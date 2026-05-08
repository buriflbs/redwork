import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  getCurrentAccount,
  loginAccount,
  logoutAccount,
  registerAccount,
  verifyAccount,
  requestPasswordReset,
  resetPassword,
  updateAccountProfile,
  changeAccountPassword,
  createAccountOrder,
  createAccountTicket,
  createAccountInvoice,
  updateOrderStatus,
  updateTicketStatus,
  addTicketResponse,
} from "../lib/accountStorage";

const CustomerAuthContext = createContext();

export function CustomerAuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCustomer(getCurrentAccount());
    setLoading(false);
  }, []);

  const login = useCallback((email, password) => {
    const user = loginAccount(email, password);
    setCustomer(user);
    return user;
  }, []);

  const register = useCallback((payload) => {
    const user = registerAccount(payload);
    setCustomer(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    logoutAccount();
    setCustomer(null);
  }, []);

  const verifyEmail = useCallback((token) => {
    const user = verifyAccount(token);
    setCustomer(user);
    return user;
  }, []);

  const sendPasswordReset = useCallback((email) => {
    return requestPasswordReset(email);
  }, []);

  const resetPasswordByToken = useCallback((token, password) => {
    const user = resetPassword(token, password);
    setCustomer(user);
    return user;
  }, []);

  const updateProfile = useCallback((payload) => {
    const user = updateAccountProfile(payload);
    setCustomer(user);
    return user;
  }, []);

  const changePassword = useCallback((currentPassword, newPassword) => {
    const user = changeAccountPassword(currentPassword, newPassword);
    setCustomer(user);
    return user;
  }, []);

  const createOrder = useCallback((payload) => {
    if (!customer) throw new Error("Nicht angemeldet");
    return createAccountOrder(customer.id, payload);
  }, [customer]);

  const createTicket = useCallback((payload) => {
    if (!customer) throw new Error("Nicht angemeldet");
    return createAccountTicket(customer.id, payload);
  }, [customer]);

  const createInvoice = useCallback((payload) => {
    if (!customer) throw new Error("Nicht angemeldet");
    return createAccountInvoice(customer.id, payload);
  }, [customer]);

  const updateOrderSt = useCallback((orderId, status) => {
    if (!customer) throw new Error("Nicht angemeldet");
    const updated = updateOrderStatus(customer.id, orderId, status);
    setCustomer({ ...customer, orders: customer.orders?.map((o) => (o.id === orderId ? updated : o)) });
    return updated;
  }, [customer]);

  const updateTicketSt = useCallback((ticketId, status) => {
    if (!customer) throw new Error("Nicht angemeldet");
    const updated = updateTicketStatus(customer.id, ticketId, status);
    setCustomer({ ...customer, tickets: customer.tickets?.map((t) => (t.id === ticketId ? updated : t)) });
    return updated;
  }, [customer]);

  const addResponse = useCallback((ticketId, response) => {
    if (!customer) throw new Error("Nicht angemeldet");
    const newResp = addTicketResponse(customer.id, ticketId, response);
    const updated = customer.tickets?.find((t) => t.id === ticketId);
    setCustomer({ ...customer, tickets: customer.tickets?.map((t) => (t.id === ticketId ? updated : t)) });
    return newResp;
  }, [customer]);

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        loading,
        login,
        register,
        logout,
        verifyEmail,
        sendPasswordReset,
        resetPassword: resetPasswordByToken,
        updateProfile,
        changePassword,
        createOrder,
        createTicket,
        createInvoice,
        updateOrderStatus: updateOrderSt,
        updateTicketStatus: updateTicketSt,
        addTicketResponse: addResponse,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export const useCustomerAuth = () => useContext(CustomerAuthContext);
