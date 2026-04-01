import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AOS from "aos";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import GuestProtectedRoute from "./components/GuestProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

// Pages
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Rooms from "./pages/Rooms";
import RoomDetails from "./pages/RoomDetails";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import PaymentPage from "./pages/PaymentPage";
import PaymentConfirmation from "./pages/PaymentConfirmation";
import PaymentHistory from "./pages/PaymentHistory";
import EmailHistory from "./pages/EmailHistory";

import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import Contact from "./pages/Contact";

function App() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile"
              element={
                <GuestProtectedRoute>
                  <Profile />
                </GuestProtectedRoute>
              }
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/rooms/:id" element={<RoomDetails />} />

            {/* Protected Routes - Guest & Admin */}
            <Route
              path="/profile"
              element={
                <GuestProtectedRoute>
                  <Profile />
                </GuestProtectedRoute>
              }
            />

            {/* Protected Routes - Guest */}
            <Route
              path="/booking"
              element={
                <GuestProtectedRoute>
                  <Booking />
                </GuestProtectedRoute>
              }
            />
            <Route
              path="/payment/:bookingId"
              element={
                <GuestProtectedRoute>
                  <PaymentPage />
                </GuestProtectedRoute>
              }
            />
            <Route
              path="/payment-confirmation/:bookingId"
              element={
                <GuestProtectedRoute>
                  <PaymentConfirmation />
                </GuestProtectedRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <GuestProtectedRoute>
                  <MyBookings />
                </GuestProtectedRoute>
              }
            />
            <Route
              path="/email-history"
              element={
                <GuestProtectedRoute>
                  <EmailHistory />
                </GuestProtectedRoute>
              }
            />

            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Routes - Admin Area wrapped by AdminLayout */}
            <Route
              path="/admin/*"
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
