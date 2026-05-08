const USERS_KEY = "rw_accounts";
const CURRENT_USER_KEY = "rw_current_user";

function loadJson(key) {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveJson(key, value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function normalizeEmail(email) {
  return (email || "").trim().toLowerCase();
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function generateToken() {
  return `${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
}

export function getStoredAccounts() {
  return loadJson(USERS_KEY) || [];
}

export function saveStoredAccounts(accounts) {
  saveJson(USERS_KEY, accounts);
}

export function getCurrentAccount() {
  return loadJson(CURRENT_USER_KEY);
}

export function setCurrentAccount(user) {
  saveJson(CURRENT_USER_KEY, user);
}

export function clearCurrentAccount() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CURRENT_USER_KEY);
}

function saveAccount(account) {
  const accounts = getStoredAccounts();
  const next = accounts.map((item) => (item.id === account.id ? account : item));
  saveStoredAccounts(next);
  if (getCurrentAccount()?.id === account.id) {
    setCurrentAccount(account);
  }
  return account;
}

export function findAccountByEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  return getStoredAccounts().find((account) => account.email === normalizedEmail) || null;
}

export function findAccountById(id) {
  return getStoredAccounts().find((account) => account.id === id) || null;
}

export function findAccountByVerificationToken(token) {
  return getStoredAccounts().find((account) => account.verificationToken === token) || null;
}

export function findAccountByResetToken(token) {
  return getStoredAccounts().find((account) => account.resetToken === token) || null;
}

export function registerAccount({ name, email, password }) {
  const normalizedEmail = normalizeEmail(email);
  if (!name || !normalizedEmail || !password) {
    throw new Error("Bitte Name, E-Mail und Passwort angeben.");
  }
  if (password.length < 8) {
    throw new Error("Das Passwort muss mindestens 8 Zeichen lang sein.");
  }
  const accounts = getStoredAccounts();
  if (accounts.some((account) => account.email === normalizedEmail)) {
    throw new Error("Zu dieser E-Mail existiert bereits ein Konto.");
  }
  const user = {
    id: generateId(),
    name: name.trim(),
    email: normalizedEmail,
    password,
    plan: "Business Hosting",
    emailVerified: false,
    verificationToken: generateToken(),
    resetToken: null,
    resetTokenExpiry: null,
    status: "Aktiv",
    supportLevel: "Premium 24/7 Support",
    assignedManager: "Elif Meier",
    domains: [{ name: "example.ch", status: "Aktiv" }],
    serverStatus: "Betriebsbereit",
    paymentStatus: "Aktuell",
    activities: ["Konto erstellt", "Willkommens-E-Mail gesendet", "Dashboard eingerichtet"],
    orders: [],
    invoices: [],
    tickets: [],
    company: "",
    phone: "",
    createdAt: new Date().toISOString(),
  };
  saveStoredAccounts([...accounts, user]);
  setCurrentAccount(user);
  return user;
}

export function loginAccount(email, password) {
  const normalizedEmail = normalizeEmail(email);
  const user = findAccountByEmail(normalizedEmail);
  if (!user || user.password !== password) {
    throw new Error("E-Mail oder Passwort ist falsch.");
  }
  setCurrentAccount(user);
  return user;
}

export function logoutAccount() {
  clearCurrentAccount();
}

export function verifyAccount(token) {
  const user = findAccountByVerificationToken(token);
  if (!user) {
    throw new Error("Verifizierungscode ungültig.");
  }
  user.emailVerified = true;
  user.verificationToken = null;
  return saveAccount(user);
}

export function requestPasswordReset(email) {
  const user = findAccountByEmail(email);
  if (!user) {
    throw new Error("Kein Konto mit dieser E-Mail gefunden.");
  }
  user.resetToken = generateToken();
  user.resetTokenExpiry = Date.now() + 1000 * 60 * 60;
  saveAccount(user);
  return user.resetToken;
}

export function resetPassword(token, password) {
  const user = findAccountByResetToken(token);
  if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < Date.now()) {
    throw new Error("Passwort-Reset-Token ungültig oder abgelaufen.");
  }
  if (!password || password.length < 8) {
    throw new Error("Das Passwort muss mindestens 8 Zeichen lang sein.");
  }
  user.password = password;
  user.resetToken = null;
  user.resetTokenExpiry = null;
  return saveAccount(user);
}

export function updateAccountProfile(payload) {
  const user = getCurrentAccount();
  if (!user) {
    throw new Error("Nicht angemeldet.");
  }
  const next = {
    ...user,
    name: payload.name || user.name,
    company: payload.company || user.company,
    phone: payload.phone || user.phone,
  };
  return saveAccount(next);
}

export function changeAccountPassword(currentPassword, newPassword) {
  const user = getCurrentAccount();
  if (!user) {
    throw new Error("Nicht angemeldet.");
  }
  if (user.password !== currentPassword) {
    throw new Error("Aktuelles Passwort ist falsch.");
  }
  if (!newPassword || newPassword.length < 8) {
    throw new Error("Das Passwort muss mindestens 8 Zeichen lang sein.");
  }
  user.password = newPassword;
  return saveAccount(user);
}

export function createAccountOrder(userId, payload) {
  const user = findAccountById(userId);
  if (!user) {
    throw new Error("Kunde nicht gefunden.");
  }
  const order = {
    id: generateId(),
    title: payload.title,
    description: payload.description,
    billing: payload.billing,
    price: payload.price,
    paymentMethod: payload.paymentMethod,
    status: payload.status || "Offen",
    createdAt: new Date().toISOString(),
  };
  user.orders = [order, ...(user.orders || [])];
  user.activities = [`Bestellung ${order.title} erstellt`, ...(user.activities || [])].slice(0, 10);
  saveAccount(user);

  createAccountInvoice(userId, {
    amount: order.price,
    description: `Rechnung für ${order.title}`,
    status: order.status === "Bezahlt" ? "Bezahlt" : "Offen",
    paymentMethod: order.paymentMethod,
    items: [{ description: order.title, price: order.price }],
  });

  return order;
}

export function createAccountTicket(userId, payload) {
  const user = findAccountById(userId);
  if (!user) {
    throw new Error("Kunde nicht gefunden.");
  }
  const ticket = {
    id: generateId(),
    category: payload.category,
    priority: payload.priority,
    subject: payload.subject,
    message: payload.message,
    status: "Offen",
    createdAt: new Date().toISOString(),
  };
  user.tickets = [ticket, ...(user.tickets || [])];
  user.activities = [`Ticket ${ticket.subject} eröffnet`, ...(user.activities || [])].slice(0, 10);
  saveAccount(user);
  return ticket;
}

export function getAccountOrders(userId) {
  const user = findAccountById(userId);
  return user?.orders || [];
}

export function getAccountInvoices(userId) {
  const user = findAccountById(userId);
  return user?.invoices || [];
}

export function getAccountTickets(userId) {
  const user = findAccountById(userId);
  return user?.tickets || [];
}

export function createAccountInvoice(userId, payload) {
  const user = findAccountById(userId);
  if (!user) {
    throw new Error("Kunde nicht gefunden.");
  }
  const invoiceNumber = `RW-${new Date().getFullYear()}-${String((user.invoices?.length || 0) + 1).padStart(5, "0")}`;
  const invoiceDate = new Date().toISOString();
  const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const invoice = {
    id: generateId(),
    number: invoiceNumber,
    date: invoiceDate,
    dueDate,
    amount: payload.amount,
    status: payload.status || "Offen",
    paymentMethod: payload.paymentMethod || "Unbekannt",
    description: payload.description,
    items: payload.items || [{ description: payload.description || "Hosting-Paket", price: payload.amount }],
    createdAt: new Date().toISOString(),
  };
  user.invoices = [invoice, ...(user.invoices || [])];
  saveAccount(user);
  return invoice;
}

export function updateOrderStatus(userId, orderId, status) {
  const user = findAccountById(userId);
  if (!user) {
    throw new Error("Kunde nicht gefunden.");
  }
  const order = user.orders?.find((o) => o.id === orderId);
  if (!order) {
    throw new Error("Bestellung nicht gefunden.");
  }
  order.status = status;
  saveAccount(user);
  return order;
}

export function updateTicketStatus(userId, ticketId, status) {
  const user = findAccountById(userId);
  if (!user) {
    throw new Error("Kunde nicht gefunden.");
  }
  const ticket = user.tickets?.find((t) => t.id === ticketId);
  if (!ticket) {
    throw new Error("Ticket nicht gefunden.");
  }
  ticket.status = status;
  if (!ticket.responses) ticket.responses = [];
  saveAccount(user);
  return ticket;
}

export function addTicketResponse(userId, ticketId, response) {
  const user = findAccountById(userId);
  if (!user) {
    throw new Error("Kunde nicht gefunden.");
  }
  const ticket = user.tickets?.find((t) => t.id === ticketId);
  if (!ticket) {
    throw new Error("Ticket nicht gefunden.");
  }
  if (!ticket.responses) ticket.responses = [];
  const newResponse = {
    id: generateId(),
    message: response.message,
    author: response.author || "Kundenservice",
    createdAt: new Date().toISOString(),
  };
  ticket.responses.push(newResponse);
  ticket.status = "Beantwortet";
  saveAccount(user);
  return newResponse;
}
