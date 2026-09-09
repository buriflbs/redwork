import React from "react";
import ProductMarketplace from "../components/ProductMarketplace";
import CustomerShell from "../components/customer/CustomerShell";
import { useAuth } from "../contexts/AuthContext";

export default function DashboardProducts() {
  const { user } = useAuth();

  return (
    <CustomerShell active="products">
      <div className="mb-6 rounded-2xl bg-white p-6 shadow-[0_12px_35px_rgba(16,36,82,0.06)]">
        <p className="text-sm font-semibold text-slate-500">Angemeldet als</p>
        <h1 className="text-2xl font-black text-[#102452]">{user?.firstName} {user?.lastName}</h1>
      </div>
      <ProductMarketplace embedded />
    </CustomerShell>
  );
}
