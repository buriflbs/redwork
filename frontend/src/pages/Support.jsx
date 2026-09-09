import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api";
import CustomerShell from "../components/customer/CustomerShell";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { MessageSquare, Plus, Send, ArrowLeft } from "lucide-react";

export default function Support() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    category: "",
    priority: "medium",
    message: ""
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get("/tickets");
      setTickets(res.data);
    } catch (err) {
      console.error("Tickets error:", err);
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async (e) => {
    e.preventDefault();
    try {
      await api.post("/tickets", newTicket);
      setNewTicket({ subject: "", category: "", priority: "medium", message: "" });
      setShowNewTicket(false);
      fetchTickets();
      alert("Destek talebi başarıyla oluşturuldu!");
    } catch (err) {
      alert("Talep oluşturulamadı: " + (err.response?.data?.detail || err.message));
    }
  };

  if (loading) {
    return <CustomerShell active="support"><div className="py-20 text-center text-slate-500">Destek talepleri yükleniyor...</div></CustomerShell>;
  }

  return (
    <CustomerShell active="support">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A]">Destek Talepleri</h1>
            <p className="text-sm text-slate-500 mt-1">Teknik destek, faturalandırma veya genel sorularınız için 7/24 destek ekibimizle iletişime geçin.</p>
          </div>
          <Button onClick={() => setShowNewTicket(true)} className="rounded-xl bg-[#E63946] hover:bg-[#d02f3c] text-white font-bold shadow-md">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Destek Talebi
          </Button>
        </div>

        {showNewTicket && (
          <Card className="rounded-[22px] border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#0F172A]">Yeni Destek Talebi Oluştur</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={createTicket} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Betreff</label>
                    <Input
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                      required
                      placeholder="Kurze Beschreibung Ihres Problems"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Kategorie</label>
                    <Select value={newTicket.category} onValueChange={(value) => setNewTicket({...newTicket, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Kategorie auswählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technisches Problem</SelectItem>
                        <SelectItem value="billing">Abrechnung</SelectItem>
                        <SelectItem value="account">Konto</SelectItem>
                        <SelectItem value="domain">Domain</SelectItem>
                        <SelectItem value="other">Sonstiges</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Priorität</label>
                  <Select value={newTicket.priority} onValueChange={(value) => setNewTicket({...newTicket, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Niedrig</SelectItem>
                      <SelectItem value="medium">Normal</SelectItem>
                      <SelectItem value="high">Hoch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nachricht</label>
                  <Textarea
                    value={newTicket.message}
                    onChange={(e) => setNewTicket({...newTicket, message: e.target.value})}
                    required
                    rows={5}
                    placeholder="Beschreiben Sie Ihr Problem detailliert..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">
                    <Send className="h-4 w-4 mr-2" />
                    Ticket erstellen
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowNewTicket(false)}>
                    Abbrechen
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {tickets.length === 0 ? (
            <Card className="rounded-[22px] border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#0F172A] mb-2">Henüz destek talebi yok</h3>
                <p className="text-slate-500 text-sm">Oluşturulmuş bir destek talebiniz bulunmuyor.</p>
              </CardContent>
            </Card>
          ) : (
            tickets.map((ticket) => (
              <Card key={ticket.id} className="rounded-[20px] border-slate-100 shadow-sm hover:shadow-md transition">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-[#0F172A]">{ticket.subject}</h3>
                      <p className="text-xs text-slate-500 mt-1">Talep #{ticket.id} • {ticket.category}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Oluşturulma: {new Date(ticket.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={
                        ticket.status === 'open' ? 'destructive' :
                        ticket.status === 'in_progress' ? 'default' :
                        ticket.status === 'answered' ? 'secondary' : 'outline'
                      }>
                        {ticket.status === 'open' ? 'Açık' :
                         ticket.status === 'in_progress' ? 'İşleniyor' :
                         ticket.status === 'answered' ? 'Yanıtlandı' : 'Kapatıldı'}
                      </Badge>
                      <Badge variant={
                        ticket.priority === 'high' ? 'destructive' :
                        ticket.priority === 'medium' ? 'default' : 'secondary'
                      }>
                        {ticket.priority === 'high' ? 'Yüksek' :
                         ticket.priority === 'medium' ? 'Normal' : 'Düşük'}
                      </Badge>
                      <Button variant="outline" size="sm" asChild className="rounded-xl">
                        <Link to={`/tickets/${ticket.id}`}>Görüntüle</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </CustomerShell>
  );
}