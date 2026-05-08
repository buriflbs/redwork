import React, { useState } from "react";
import { useCustomerAuth } from "../../contexts/CustomerAuthContext";
import { Send, Ticket, MessageSquare, Plus, X } from "lucide-react";

const categories = [
  { id: "hosting", label: "Hosting-Anfrage" },
  { id: "vps", label: "VPS / Server" },
  { id: "domain", label: "Domain & SSL" },
  { id: "rechnung", label: "Rechnung & Zahlung" },
  { id: "technik", label: "Technische Störung" },
];

const priorities = [
  { id: "hoch", label: "Hoch", color: "bg-red-100 text-red-700" },
  { id: "mittel", label: "Mittel", color: "bg-amber-100 text-amber-700" },
  { id: "niedrig", label: "Niedrig", color: "bg-blue-100 text-blue-700" },
];

export default function SupportTickets() {
  const { customer, createTicket, addTicketResponse, updateTicketStatus } = useCustomerAuth();
  const [form, setForm] = useState({ category: "hosting", priority: "mittel", subject: "", message: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (!form.subject || !form.message) {
      setError("Bitte füllen Sie Betreff und Nachricht aus.");
      return;
    }
    try {
      createTicket({
        category: form.category,
        priority: form.priority,
        subject: form.subject,
        message: form.message,
      });
      setSuccess("Ihr Support-Ticket wurde erfolgreich erstellt. Wir melden uns in Kürze.");
      setForm({ category: "hosting", priority: "mittel", subject: "", message: "" });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Fehler beim Erstellen des Tickets.");
    }
  };

  const handleAddResponse = (e) => {
    e.preventDefault();
    if (!responseMessage.trim()) {
      setError("Bitte geben Sie eine Nachricht ein.");
      return;
    }
    try {
      addTicketResponse(selectedTicket.id, { message: responseMessage, author: "Kunde" });
      setResponseMessage("");
      setSuccess("Ihre Antwort wurde hinzugefügt.");
      setTimeout(() => setSuccess(""), 2000);
      // Refresh ticket
      const updated = customer.tickets?.find((t) => t.id === selectedTicket.id);
      if (updated) setSelectedTicket(updated);
    } catch (err) {
      setError(err.message);
    }
  };

  const openTickets = (customer.tickets || []).filter((t) => t.status !== "Geschlossen");
  const closedTickets = (customer.tickets || []).filter((t) => t.status === "Geschlossen");
  const getPriority = (id) => priorities.find((p) => p.id === id);

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Support & Service</p>
            <h1 className="text-3xl font-bold text-slate-950">Support-Tickets</h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#E63946] px-4 py-2 text-sm font-semibold text-white">
            <Ticket size={16} /> {customer.tickets?.length || 0} Tickets
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-600">Erstellen Sie ein neues Support-Ticket oder verfolgen Sie Ihre bestehenden Anfragen in Echtzeit.</p>
      </div>

      {!selectedTicket ? (
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          {/* Formular */}
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950 mb-6 flex items-center gap-2">
              <Plus size={24} className="text-[#E63946]" /> Neues Ticket erstellen
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-slate-900">
                  Kategorie
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-[#E63946] outline-none"
                  >
                    {categories.map((option) => (
                      <option key={option.id} value={option.id}>{option.label}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-semibold text-slate-900">
                  Priorität
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-[#E63946] outline-none"
                  >
                    {priorities.map((option) => (
                      <option key={option.id} value={option.id}>{option.label}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="block text-sm font-semibold text-slate-900">
                Betreff
                <input
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  type="text"
                  placeholder="Kurze Zusammenfassung Ihres Anliegens"
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-[#E63946] outline-none"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-900">
                Nachricht
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={6}
                  placeholder="Beschreiben Sie Ihr Anliegen so genau wie möglich. Je mehr Details, desto schneller können wir helfen."
                  className="mt-2 w-full rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 resize-none focus:border-[#E63946] outline-none"
                />
              </label>
              {(error || success) && (
                <div className={`rounded-3xl px-4 py-3 text-sm ${error ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
                  {error || success}
                </div>
              )}
              <button type="submit" className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#E63946] px-6 py-3 text-sm font-semibold text-white hover:bg-[#c5303d] transition">
                <Send size={16} /> Ticket eröffnen
              </button>
            </form>
          </div>

          {/* Tickets-Übersicht */}
          <div className="space-y-4">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-950 mb-4">Offene Tickets ({openTickets.length})</h3>
              <div className="space-y-3">
                {openTickets.length > 0 ? (
                  openTickets.slice(0, 5).map((ticket) => (
                    <button
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className="w-full text-left rounded-[20px] border border-slate-200 hover:border-[#E63946] hover:bg-red-50 bg-slate-50 p-4 transition cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-950 text-sm truncate group-hover:text-[#E63946]">{ticket.subject}</div>
                          <div className="text-xs text-slate-500 mt-1">{ticket.category}</div>
                        </div>
                        <div className={`rounded-full px-2 py-1 text-xs font-semibold shrink-0 ${getPriority(ticket.priority)?.color}`}>
                          {getPriority(ticket.priority)?.label}
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">Keine offenen Tickets.</p>
                )}
              </div>
            </div>

            {closedTickets.length > 0 && (
              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-950 mb-4">Geschlossene Tickets ({closedTickets.length})</h3>
                <div className="space-y-2">
                  {closedTickets.slice(0, 3).map((ticket) => (
                    <button
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className="w-full text-left rounded-[16px] border border-slate-200 hover:bg-slate-50 bg-slate-50 p-3 text-sm text-slate-600 hover:text-slate-900 transition cursor-pointer truncate"
                    >
                      {ticket.subject}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Ticket-Detail
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-sm text-slate-500">Ticket-Details</div>
              <h2 className="text-2xl font-bold text-slate-950">{selectedTicket.subject}</h2>
            </div>
            <button onClick={() => setSelectedTicket(null)} className="rounded-full p-2 hover:bg-slate-100 transition">
              <X size={20} />
            </button>
          </div>

          <div className="grid gap-4 mb-6 md:grid-cols-4">
            <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs text-slate-500 mb-1">Ticket-ID</div>
              <div className="font-semibold text-slate-900 text-sm">{selectedTicket.id}</div>
            </div>
            <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs text-slate-500 mb-1">Status</div>
              <div className={`font-semibold text-sm inline-flex rounded-full px-3 py-1 ${
                selectedTicket.status === "Offen" ? "bg-amber-100 text-amber-700" :
                selectedTicket.status === "In Bearbeitung" ? "bg-sky-100 text-sky-700" :
                selectedTicket.status === "Beantwortet" ? "bg-emerald-100 text-emerald-700" :
                "bg-slate-100 text-slate-700"
              }`}>{selectedTicket.status}</div>
            </div>
            <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs text-slate-500 mb-1">Priorität</div>
              <div className={`font-semibold text-sm inline-flex rounded-full px-3 py-1 ${getPriority(selectedTicket.priority)?.color}`}>
                {getPriority(selectedTicket.priority)?.label}
              </div>
            </div>
            <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs text-slate-500 mb-1">Erstellt am</div>
              <div className="font-semibold text-slate-900 text-sm">{new Date(selectedTicket.createdAt).toLocaleDateString("de-CH")}</div>
            </div>
          </div>

          {/* Chat / Responses */}
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {/* Original-Nachricht */}
            <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold text-slate-950">Sie</div>
                <div className="text-xs text-slate-500">{new Date(selectedTicket.createdAt).toLocaleString("de-CH")}</div>
              </div>
              <p className="text-slate-700 text-sm">{selectedTicket.message}</p>
            </div>

            {/* Responses */}
            {selectedTicket.responses && selectedTicket.responses.map((response) => (
              <div key={response.id} className={`rounded-[20px] border p-5 ${response.author === "Kundenservice" ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-slate-50"}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold text-slate-950">{response.author}</div>
                  <div className="text-xs text-slate-500">{new Date(response.createdAt).toLocaleString("de-CH")}</div>
                </div>
                <p className="text-slate-700 text-sm">{response.message}</p>
              </div>
            ))}
          </div>

          {/* Response-Formular */}
          {selectedTicket.status !== "Geschlossen" && (
            <form onSubmit={handleAddResponse} className="space-y-3">
              <label className="block text-sm font-semibold text-slate-900">
                Ihre Antwort
                <textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  rows={3}
                  placeholder="Schreiben Sie Ihre Antwort hier..."
                  className="mt-2 w-full rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 resize-none focus:border-[#E63946] outline-none"
                />
              </label>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#E63946] px-6 py-3 text-sm font-semibold text-white hover:bg-[#c5303d] transition">
                  <Send size={16} /> Absenden
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-slate-200 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-300 transition"
                >
                  Schließen
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
