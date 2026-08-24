#!/bin/bash
# =============================================================================
# redwork.ch - Plesk Automated Deployment & Setup Script
# =============================================================================
set -e

DOMAIN="redwork.ch"
VHOST_DIR="/var/www/vhosts/${DOMAIN}"
HTTPDOCS="${VHOST_DIR}/httpdocs"
BACKEND_DIR="${VHOST_DIR}/backend"

echo "=========================================================="
echo "🚀 Starting Deployment for ${DOMAIN} on Plesk Server..."
echo "=========================================================="

# 1. Update packages and install prerequisites
echo "📦 Installing system dependencies (Python, MongoDB, Git, Nginx)..."
apt-get update -qq
apt-get install -y python3 python3-pip python3-venv git curl gnupg

# Ensure MongoDB is installed and running
if ! command -v mongod &> /dev/null; then
    echo "🍃 Installing MongoDB..."
    curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor --yes
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    apt-get update -qq
    apt-get install -y mongodb-org
fi

systemctl enable mongod
systemctl start mongod

# 2. Check if Plesk domain exists, if not create it
if command -v plesk &> /dev/null; then
    echo "🔧 Checking Plesk domain configuration..."
    if ! plesk bin domain --info "${DOMAIN}" &> /dev/null; then
        echo "🌐 Creating domain ${DOMAIN} with alias www.${DOMAIN} in Plesk..."
        plesk bin domain --create "${DOMAIN}" -www-root httpdocs -hosting true
        plesk bin domalias --create "www.${DOMAIN}" -domain "${DOMAIN}" || true
    fi
fi

# Ensure directories exist
mkdir -p "${HTTPDOCS}"
mkdir -p "${BACKEND_DIR}"

# 3. Deploy Frontend Static Build
echo "📄 Deploying Frontend build files to ${HTTPDOCS}..."
if [ -d "./frontend/build" ]; then
    cp -r ./frontend/build/* "${HTTPDOCS}/"
fi

# Configure .htaccess for SPA routing (fallback for Apache/Plesk)
cat << 'EOF' > "${HTTPDOCS}/.htaccess"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
EOF

# 4. Deploy Backend & Setup Python Virtual Environment
echo "🐍 Setting up Python backend in ${BACKEND_DIR}..."
cp -r ./backend/* "${BACKEND_DIR}/"

cd "${BACKEND_DIR}"
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

./venv/bin/pip install --upgrade pip
./venv/bin/pip install -r requirements.txt
./venv/bin/pip install uvicorn gunicorn motor pydantic pymongo python-jose passlib bcrypt python-multipart apscheduler email-validator

# 5. Create Systemd Service for Backend
echo "⚙️ Configuring systemd service: redwork-backend.service..."
cat << EOF > /etc/systemd/system/redwork-backend.service
[Unit]
Description=redwork.ch FastAPI Backend Service
After=network.target mongod.service

[Service]
Type=simple
User=root
WorkingDirectory=${BACKEND_DIR}
Environment="PATH=${BACKEND_DIR}/venv/bin"
Environment="MONGO_URL=mongodb://127.0.0.1:27017"
Environment="DB_NAME=redwork"
Environment="PORT=8001"
ExecStart=${BACKEND_DIR}/venv/bin/python -m uvicorn server:app --host 127.0.0.1 --port 8001
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload

# Seed site_settings into MongoDB
if [ -f "${BACKEND_DIR}/seeds/site_settings.json" ]; then
    echo "🍃 Seeding MongoDB site_settings..."
    ${BACKEND_DIR}/venv/bin/python -c "
import json, asyncio, motor.motor_asyncio
async def seed():
    client = motor.motor_asyncio.AsyncIOMotorClient('mongodb://127.0.0.1:27017')
    db = client['redwork']
    with open('${BACKEND_DIR}/seeds/site_settings.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    await db.site_settings.replace_one({'key': 'main'}, data, upsert=True)
    print('MongoDB site_settings seeded successfully.')
asyncio.run(seed())
" || true
fi

systemctl enable redwork-backend
systemctl restart redwork-backend

# 6. Configure Nginx Reverse Proxy in Plesk
echo "🌐 Configuring Plesk Nginx Reverse Proxy for API & WebSockets on port 8001..."
cat << 'EOF' > /var/www/vhosts/system/${DOMAIN}/conf/vhost_nginx.conf
location /api/ {
    proxy_pass http://127.0.0.1:8001/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location /ws/ {
    proxy_pass http://127.0.0.1:8001/ws/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
    proxy_set_header Host $host;
}
EOF

nginx -t && systemctl reload nginx

# Set proper file permissions
chown -R www-data:www-data "${HTTPDOCS}" 2>/dev/null || true
chmod -R 755 "${HTTPDOCS}"

echo "=========================================================="
echo "✅ Deployment completed successfully!"
echo "🌐 Website URL: https://${DOMAIN} (and https://www.${DOMAIN})"
echo "⚙️ Backend API: http://127.0.0.1:8001/api/site-settings"
echo "=========================================================="
