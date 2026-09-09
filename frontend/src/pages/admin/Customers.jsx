import React, { useEffect, useMemo, useState } from "react";
import api from "../../api";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Building2, Calendar, CheckCircle2, Edit, Mail, Phone, Search, ShieldCheck, Trash2, UserRound, Users } from "lucide-react";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  emailVerified: false,
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("de-DE");
};

const Field = ({ id, label, value, onChange, type = "text" }) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input id={id} type={type} value={value || ""} onChange={(event) => onChange(event.target.value)} />
  </div>
);

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/admin/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error("Customers error:", err);
      setError(err.response?.data?.detail || "Kunden konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    const needle = search.toLowerCase();
    return customers.filter((customer) =>
      `${customer.firstName || ""} ${customer.lastName || ""} ${customer.email || ""} ${customer.company || ""}`.toLowerCase().includes(needle)
    );
  }, [customers, search]);

  const customerStats = useMemo(() => ({
    total: customers.length,
    verified: customers.filter((customer) => customer.emailVerified).length,
    companies: customers.filter((customer) => customer.company).length,
  }), [customers]);

  const openCustomer = async (customer) => {
    setError("");
    try {
      const res = await api.get(`/admin/customers/${customer.id}`);
      setSelected(res.data);
      setForm({
        firstName: res.data.firstName || "",
        lastName: res.data.lastName || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        company: res.data.company || "",
        emailVerified: Boolean(res.data.emailVerified),
      });
    } catch (err) {
      setError(err.response?.data?.detail || "Kundendaten konnten nicht geladen werden.");
    }
  };

  const saveCustomer = async () => {
    if (!selected) return;
    setSaving(true);
    setError("");
    try {
      const res = await api.put(`/admin/customers/${selected.id}`, form);
      setCustomers((current) => current.map((customer) => customer.id === selected.id ? res.data : customer));
      setSelected(res.data);
      setForm({
        firstName: res.data.firstName || "",
        lastName: res.data.lastName || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        company: res.data.company || "",
        emailVerified: Boolean(res.data.emailVerified),
      });
    } catch (err) {
      setError(err.response?.data?.detail || "Kunde konnte nicht gespeichert werden.");
    } finally {
      setSaving(false);
    }
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm("Sind Sie sicher, dass Sie diesen Kunden löschen möchten?")) return;
    try {
      await api.delete(`/admin/customers/${id}`);
      fetchCustomers();
    } catch (err) {
      setError("Fehler beim Löschen: " + (err.response?.data?.detail || err.message));
    }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center">Laden...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kunden</h1>
          <p className="text-muted-foreground">Customer 360, Stammdaten und Kontoqualität</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Badge variant="secondary" className="justify-center px-3 py-2">{customerStats.total} Kunden</Badge>
          <Badge variant="secondary" className="justify-center px-3 py-2">{customerStats.verified} verifiziert</Badge>
          <Badge variant="secondary" className="justify-center px-3 py-2">{customerStats.companies} Firmen</Badge>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Kundenverwaltung</CardTitle>
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Kunden suchen..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>E-Mail</TableHead>
                <TableHead>Firma</TableHead>
                <TableHead>Kunde seit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.firstName} {customer.lastName}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.company || "-"}</TableCell>
                  <TableCell>{formatDate(customer.createdAt)}</TableCell>
                  <TableCell>
                    <Badge variant={customer.emailVerified ? "default" : "secondary"}>
                      {customer.emailVerified ? "Verifiziert" : "Nicht verifiziert"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openCustomer(customer)} aria-label="Kunde bearbeiten">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => deleteCustomer(customer.id)} aria-label="Kunde löschen">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Profile</DialogTitle>
            <DialogDescription>
              Stammdaten, Kontoübersicht und verifizierte Customer-ID aus der Datenbank.
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><UserRound className="h-5 w-5" /> Customer Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-center justify-between"><span className="text-muted-foreground">Customer ID</span><span className="font-mono text-xs">{selected.id}</span></div>
                    <div className="flex items-center justify-between"><span className="text-muted-foreground">Name</span><span>{selected.firstName} {selected.lastName}</span></div>
                    <div className="flex items-center justify-between"><span className="text-muted-foreground">Company</span><span>{selected.company || "-"}</span></div>
                    <div className="flex items-center justify-between"><span className="text-muted-foreground">Status</span><Badge>{selected.emailVerified ? "Aktiv" : "Prüfung"}</Badge></div>
                    <div className="flex items-center justify-between"><span className="text-muted-foreground">Kunde seit</span><span>{formatDate(selected.createdAt)}</span></div>
                    <div className="flex items-center justify-between"><span className="text-muted-foreground">Last Login</span><span>{formatDate(selected.lastLogin)}</span></div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["Aktive Projekte", "-"],
                    ["Hosting", "-"],
                    ["Domains", "-"],
                    ["Offene Tickets", "-"],
                    ["Rechnungen offen", "-"],
                    ["Renewals", "-"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg border bg-white p-3">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="mt-1 text-lg font-semibold">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <section className="space-y-3">
                  <h3 className="flex items-center gap-2 font-semibold"><UserRound className="h-4 w-4" /> Personal Data</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field id="firstName" label="Vorname" value={form.firstName} onChange={(value) => setForm({ ...form, firstName: value })} />
                    <Field id="lastName" label="Nachname" value={form.lastName} onChange={(value) => setForm({ ...form, lastName: value })} />
                    <Field id="email" label="E-Mail" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} />
                    <Field id="phone" label="Telefon" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} />
                    <Field id="company" label="Firma" value={form.company} onChange={(value) => setForm({ ...form, company: value })} />
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="flex items-center gap-2 font-semibold"><ShieldCheck className="h-4 w-4" /> Account</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-lg border p-3"><Calendar className="mb-2 h-4 w-4 text-muted-foreground" />Kunde seit<br /><strong>{formatDate(selected.createdAt)}</strong></div>
                    <div className="rounded-lg border p-3"><CheckCircle2 className="mb-2 h-4 w-4 text-muted-foreground" />Last Login<br /><strong>{formatDate(selected.lastLogin)}</strong></div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">Email verified</p>
                      <p className="text-sm text-muted-foreground">Steuert den verifizierten Kontostatus.</p>
                    </div>
                    <Switch checked={form.emailVerified} onCheckedChange={(checked) => setForm({ ...form, emailVerified: checked })} />
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="flex items-center gap-2 font-semibold"><Building2 className="h-4 w-4" /> Business</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-lg border p-3"><Mail className="mb-2 h-4 w-4 text-muted-foreground" />Ansprechpartner<br /><strong>{form.firstName} {form.lastName}</strong></div>
                    <div className="rounded-lg border p-3"><Phone className="mb-2 h-4 w-4 text-muted-foreground" />Telefon<br /><strong>{form.phone || "-"}</strong></div>
                  </div>
                </section>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>Schliessen</Button>
            <Button onClick={saveCustomer} disabled={saving}>{saving ? "Speichern..." : "Änderungen speichern"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
