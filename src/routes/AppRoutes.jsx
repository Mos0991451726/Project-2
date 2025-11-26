import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Pages
import Home from "../pages/Home";
import PropertyDetail from "../pages/PropertyDetail";
import Community from "../pages/Community";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import About from "../pages/About";
import AddProperty from "../pages/AddProperty";

// Admin pages
import AdminDashboard from "../pages/AdminDashboard";
import AdminUsers from "../pages/AdminUsers";
import AdminReports from "../pages/AdminReports";
import AdminPosts from "../pages/AdminPosts";
import AdminProperties from "../pages/AdminProperties";

function AppRoutes() {
  const { user, isLoggedIn, loading } = useAuth();

  if (loading) return <div>กำลังโหลดข้อมูล...</div>;

  const requireLogin = (element) =>
    isLoggedIn ? element : <Navigate to="/login" replace />;

  const requireAdmin = (element) =>
    isLoggedIn && user?.role === "admin"
      ? element
      : <Navigate to="/" replace />;

  return (
    <Routes>

      {/* Public pages */}
      <Route path="/" element={<Home />} />
      <Route path="/property/:id" element={<PropertyDetail />} />
      <Route path="/community" element={<Community />} />
      <Route path="/about" element={<About />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Profile */}
      <Route path="/profile" element={requireLogin(<Profile />)} />
      <Route path="/profile/:email" element={<Profile />} />

      {/* Add Property */}
      <Route path="/add-property" element={requireLogin(<AddProperty />)} />

      {/* Admin Routes (ทุกอันตรงกับ Sidebar แล้ว) */}
      <Route path="/admin" element={requireAdmin(<AdminDashboard />)} />
      <Route path="/admin/users" element={requireAdmin(<AdminUsers />)} />
      <Route path="/admin/posts" element={requireAdmin(<AdminPosts />)} />
      <Route path="/admin/properties" element={requireAdmin(<AdminProperties />)} />
      <Route path="/admin/reports" element={requireAdmin(<AdminReports />)} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default AppRoutes;
