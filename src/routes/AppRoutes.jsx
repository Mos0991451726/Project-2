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

// Admin
import AdminDashboard from "../pages/AdminDashboard";
import AdminManagement from "../pages/AdminUsers";
import AdminReports from "../pages/AdminReports";

// ⭐ เพิ่ม import สำหรับหน้าใหม่
import AdminPosts from "../pages/AdminPosts";
import AdminProperties from "../pages/AdminProperties";

function AppRoutes() {
  const { user, isLoggedIn, loading } = useAuth();

  if (loading) return <div>กำลังโหลดข้อมูล...</div>;

  // ต้องล็อกอินก่อน
  const requireLogin = (element) =>
    isLoggedIn ? element : <Navigate to="/login" replace />;

  // ต้องเป็น Admin เท่านั้น
  const requireAdmin = (element) =>
    isLoggedIn && user?.role === "admin"
      ? element
      : <Navigate to="/" replace />;

  return (
    <Routes>
      
      {/* Main */}
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

      {/* ⭐ Admin Routes อัปเดตแล้ว */}
      <Route path="/admin" element={requireAdmin(<AdminDashboard />)} />
      <Route path="/admin/manage" element={requireAdmin(<AdminManagement />)} />

      {/* เพิ่มใหม่ให้ตรงกับ Sidebar */}
      <Route path="/admin/posts" element={requireAdmin(<AdminPosts />)} />
      <Route path="/admin/properties" element={requireAdmin(<AdminProperties />)} />

      <Route path="/admin/reports" element={requireAdmin(<AdminReports />)} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
