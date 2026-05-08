import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ArrowUp } from "lucide-react";

import { ModalProvider } from "./contexts/ModalContext";
import { AuthProvider } from "./contexts/AuthContext";
import { CustomerAuthProvider } from "./contexts/CustomerAuthContext";

import Header from "./components/Header";
import Hero from "./components/Hero";
import StatsBar from "./components/StatsBar";
import HowWeWork from "./components/HowWeWork";
import Projects from "./components/Projects";
import BlogPosts from "./components/BlogPosts";
import Services from "./components/Services";
import Features from "./components/Features";
import PromoVideo from "./components/PromoVideo";
import Testimonials from "./components/Testimonials";
import WhyUs from "./components/WhyUs";
import FAQSection from "./components/FAQSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import HostingPackages from "./components/HostingPackages";
import QuoteWizard from "./components/QuoteWizard";
import ContactModal from "./components/ContactModal";

import AdminLogin from "./pages/admin/AdminLogin";
import AccountLogin from "./pages/AccountLogin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Register from "./pages/Register";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Quotes from "./pages/admin/Quotes";
import Contacts from "./pages/admin/Contacts";
import ProjectsAdmin from "./pages/admin/ProjectsAdmin";
import BlogsAdmin from "./pages/admin/BlogsAdmin";
import TestimonialsAdmin from "./pages/admin/TestimonialsAdmin";
import ServicesAdmin from "./pages/admin/ServicesAdmin";
import SiteSettings from "./pages/admin/SiteSettings";
import FAQAdmin from "./pages/admin/FAQAdmin";
import EmailTemplates from "./pages/admin/EmailTemplates";
import Companies from "./pages/admin/Companies";
import Products from "./pages/admin/Products";
import Invoices from "./pages/admin/Invoices";
import Offers from "./pages/admin/Offers";
import InvoiceEditor from "./pages/admin/InvoiceEditor";
import InvoiceTemplates from "./pages/admin/InvoiceTemplates";
import HostingPackagesAdmin from "./pages/admin/HostingPackagesAdmin";
import AccountLayout from "./pages/account/AccountLayout";
import AccountDashboard from "./pages/account/AccountDashboard";
import HostingShop from "./pages/account/HostingShop";
import AccountInvoices from "./pages/account/AccountInvoices";
import SupportTickets from "./pages/account/SupportTickets";
import Profile from "./pages/account/Profile";
import Checkout from "./pages/account/Checkout";

function PublicSite() {
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
      setShowTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="bg-[#f1f5fb]">
      <Header scrolled={scrolled} />
      <Hero />
      <StatsBar />
      <HowWeWork />
      <Projects />
      <BlogPosts />
      <Services />
      <HostingPackages />
      <QuoteWizard />
      <ContactModal />

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          data-testid="scroll-top-btn"
          className="fixed left-4 bottom-6 z-40 w-11 h-11 bg-[#E63946] hover:bg-[#d22c39] text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
          aria-label="Nach oben"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <CustomerAuthProvider>
            <ModalProvider>
              <Routes>
                <Route path="/" element={<PublicSite />} />

                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/register" element={<Register />} />
                <Route path="/account">
                  <Route index element={<Navigate to="/account/login" replace />} />
                  <Route path="login" element={<AccountLogin />} />
                  <Route path="forgot-password" element={<ForgotPassword />} />
                  <Route path="verify-email" element={<VerifyEmail />} />
                  <Route path="reset-password/:token" element={<ResetPassword />} />
                  <Route path="register" element={<Register />} />
                  <Route element={<AccountLayout />}>
                    <Route path="dashboard" element={<AccountDashboard />} />
                    <Route path="hosting" element={<HostingShop />} />
                    <Route path="invoices" element={<AccountInvoices />} />
                    <Route path="tickets" element={<SupportTickets />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="checkout" element={<Checkout />} />
                  </Route>
                </Route>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="site" element={<SiteSettings />} />
                  <Route path="quotes" element={<Quotes />} />
                  <Route path="contacts" element={<Contacts />} />
                  <Route path="projects" element={<ProjectsAdmin />} />
                  <Route path="blogs" element={<BlogsAdmin />} />
                  <Route path="testimonials" element={<TestimonialsAdmin />} />
                  <Route path="services" element={<ServicesAdmin />} />
                  <Route path="faqs" element={<FAQAdmin />} />
                  <Route path="templates" element={<EmailTemplates />} />
                  <Route path="companies" element={<Companies />} />
                  <Route path="products" element={<Products />} />
                  <Route path="hosting" element={<HostingPackagesAdmin />} />
                  <Route path="invoices" element={<Invoices />} />
                  <Route path="invoices/new" element={<InvoiceEditor mode="invoice" />} />
                  <Route path="invoices/:id" element={<InvoiceEditor mode="invoice" />} />
                  <Route path="invoice-templates" element={<InvoiceTemplates />} />
                  <Route path="offers" element={<Offers />} />
                  <Route path="offers/new" element={<InvoiceEditor mode="offer" />} />
                  <Route path="offers/:id" element={<InvoiceEditor mode="offer" />} />
                </Route>
              </Routes>
            </ModalProvider>
          </CustomerAuthProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
