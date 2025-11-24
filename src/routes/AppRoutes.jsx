import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Home from "../pages/Home";
import PropertyDetail from "../pages/PropertyDetail";
import Community from "../pages/Community";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import About from "../pages/About";
import AddProperty from "../pages/AddProperty";
import AdminDashboard from "../pages/AdminDashboard";
import AdminManagement from "../pages/AdminManagement";

function AppRoutes() {
  const { user, isLoggedIn, loading } = useAuth();

  if (loading) {
    return <div>กำลังโหลดข้อมูล...</div>; // กัน redirect ผิดตอน Auth ยังไม่พร้อม
  }

  const requireLogin = (element) => {
    return isLoggedIn ? element : <Navigate to="/login" />;
  };

  const requireAdmin = (element) => {
    return isLoggedIn && user?.role === "admin"
      ? element
      : <Navigate to="/" />;
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/property/:id" element={<PropertyDetail />} />
      <Route path="/community" element={<Community />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User Pages */}
      <Route path="/profile" element={requireLogin(<Profile />)} />
      <Route path="/add-property" element={requireLogin(<AddProperty />)} />

      <Route path="/about" element={<About />} />

      {/* Admin Pages */}
      <Route path="/admin" element={requireAdmin(<AdminDashboard />)} />
      <Route path="/admin/manage" element={requireAdmin(<AdminManagement />)} />
    </Routes>
  );
}

export default AppRoutes;
