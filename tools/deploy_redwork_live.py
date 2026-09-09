import os
import posixpath
import sys

import paramiko


HOST = "178.254.22.30"
USER = "root"


def main():
    password = os.environ["REDWORK_SSH_PASSWORD"]
    archive = os.environ["REDWORK_ARCHIVE"]
    remote_archive = "/tmp/" + os.path.basename(archive)

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(
        HOST,
        username=USER,
        password=password,
        timeout=20,
        look_for_keys=False,
        allow_agent=False,
    )

    try:
        if os.environ.get("REDWORK_VERIFY_ONLY") == "1":
            admin_password = os.environ.get("REDWORK_ADMIN_PASSWORD", password)
            script = f"""set -e
printf 'UNAUTH_DASHBOARD='
curl -k -s -o /tmp/rw_unauth.txt -w 'HTTP:%{{http_code}}\\n' https://www.redwork.ch/api/dashboard || true
LOGIN_JSON=$(curl -k -s -X POST https://www.redwork.ch/api/admin/login -H 'Content-Type: application/json' -d '{{"username":"admin","password":"{admin_password}"}}' || true)
TOKEN=$(printf '%s' "$LOGIN_JSON" | python3 -c 'import sys,json; data=json.load(sys.stdin); print(data.get("access_token", ""))' 2>/dev/null || true)
if [ -n "$TOKEN" ]; then
  printf 'ADMIN_LOGIN=HTTP:200\\n'
  printf 'CUSTOMERS='
  curl -k -s -o /tmp/rw_customers.json -w 'HTTP:%{{http_code}} SIZE:%{{size_download}}\\n' https://www.redwork.ch/api/admin/customers -H "Authorization: Bearer $TOKEN" || true
else
  printf 'ADMIN_LOGIN=FAILED\\n'
  printf 'LOGIN_RESPONSE=%s\\n' "$LOGIN_JSON"
fi
systemctl --no-pager --full status redwork-backend | sed -n '1,8p'
"""
            stdin, stdout, stderr = client.exec_command(script, timeout=120)
            out = stdout.read().decode("utf-8", "replace")
            err = stderr.read().decode("utf-8", "replace")
            print(out)
            if err:
                print("ERR:", err, file=sys.stderr)
            return 0

        if os.environ.get("REDWORK_ASSET_VERIFY") == "1":
            script = """set -e
printf 'INDEX_BUNDLE='
grep -o 'main\\.[a-z0-9]*\\.js' /var/www/vhosts/redwork.ch/httpdocs/index.html | head -1 || true
printf '\\nDASHBOARD_TEXT='
grep -o 'Premium Digital Agency Portal' /var/www/vhosts/redwork.ch/httpdocs/static/js/main.*.js | head -1 || true
printf '\\nCUSTOMERS_TEXT='
grep -o 'Customer 360' /var/www/vhosts/redwork.ch/httpdocs/static/js/main.*.js | head -1 || true
printf '\\nBACKUP_COUNT='
find /var/www/vhosts/redwork.ch/deploy-backups -maxdepth 1 -mindepth 1 -type d | wc -l
journalctl -u redwork-backend --since '5 minutes ago' --no-pager | tail -20
"""
            stdin, stdout, stderr = client.exec_command(script, timeout=60)
            out = stdout.read().decode("utf-8", "replace")
            err = stderr.read().decode("utf-8", "replace")
            print(out)
            if err:
                print("ERR:", err, file=sys.stderr)
            return 0

        if os.environ.get("REDWORK_MARKETPLACE_VERIFY") == "1":
            script = """set -e
curl -k -s -o /tmp/rw_products.html -w 'PRODUCTS_PAGE=HTTP:%{http_code}\\n' https://www.redwork.ch/products
curl -k -s -o /tmp/rw_dash_products.html -w 'DASHBOARD_PRODUCTS=HTTP:%{http_code}\\n' https://www.redwork.ch/dashboard/products
curl -k -s -o /tmp/rw_api_products.json -w 'API_PRODUCTS=HTTP:%{http_code}:SIZE:%{size_download}\\n' https://www.redwork.ch/api/products
printf 'MARKETPLACE_TEXT='
grep -o 'Digitale Lösungen für Ihr Business' /var/www/vhosts/redwork.ch/httpdocs/static/js/main.*.js | head -1 || true
printf '\\nDASHBOARD_PRODUCTS_TEXT='
grep -o 'Services / Produkte' /var/www/vhosts/redwork.ch/httpdocs/static/js/main.*.js | head -1 || true
printf '\\n'
"""
            stdin, stdout, stderr = client.exec_command(script, timeout=60)
            out = stdout.read().decode("utf-8", "replace")
            err = stderr.read().decode("utf-8", "replace")
            print(out)
            if err:
                print("ERR:", err, file=sys.stderr)
            return 0

        if os.environ.get("REDWORK_UPLOAD", "1") == "1":
            sftp = client.open_sftp()
            try:
                print(f"upload {archive} -> {remote_archive}")
                sftp.put(archive, remote_archive)
            finally:
                sftp.close()

        script = f"""set -e
TS=$(date +%Y%m%d%H%M%S)
DOMAIN=redwork.ch
VHOST=/var/www/vhosts/$DOMAIN
HTTPDOCS=$VHOST/httpdocs
BACKEND=$VHOST/backend
BACKUP=$VHOST/deploy-backups/$TS
RELEASE=/tmp/redwork_release_$TS
mkdir -p "$BACKUP" "$RELEASE"
cp -a "$HTTPDOCS" "$BACKUP/httpdocs"
cp -a "$BACKEND" "$BACKUP/backend"
tar -xzf "{remote_archive}" -C "$RELEASE"
rm -rf "$HTTPDOCS"/*
cp -a "$RELEASE/frontend/build/." "$HTTPDOCS/"
if [ -f "$BACKUP/httpdocs/.htaccess" ]; then cp -a "$BACKUP/httpdocs/.htaccess" "$HTTPDOCS/.htaccess"; fi
cp -a "$RELEASE/backend/." "$BACKEND/"
chown -R www-data:www-data "$HTTPDOCS" 2>/dev/null || true
chmod -R 755 "$HTTPDOCS"
cd "$BACKEND"
if [ -x venv/bin/pip ]; then venv/bin/pip install -r requirements.txt >/tmp/redwork_pip_$TS.log; fi
python3 -m py_compile server.py
systemctl restart redwork-backend
sleep 3
systemctl is-active redwork-backend
printf 'LOCAL_API='
curl -fsS http://127.0.0.1:8001/api/admin -w ' HTTP:%{{http_code}}\\n' || true
printf 'PUBLIC_SITE='
curl -k -fsS https://www.redwork.ch/ -o /tmp/redwork_public_$TS.html -w 'HTTP:%{{http_code}}\\n' || true
printf 'PUBLIC_DASHBOARD='
curl -k -fsS https://www.redwork.ch/dashboard -o /tmp/redwork_dashboard_$TS.html -w 'HTTP:%{{http_code}}\\n' || true
printf 'BACKUP=%s\\n' "$BACKUP"
"""
        stdin, stdout, stderr = client.exec_command(script, timeout=180)
        out = stdout.read().decode("utf-8", "replace")
        err = stderr.read().decode("utf-8", "replace")
        print(out)
        if err:
            print("ERR:", err, file=sys.stderr)
        return 0
    finally:
        client.close()


if __name__ == "__main__":
    raise SystemExit(main())
