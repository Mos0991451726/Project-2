import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Home from "../pages/Home";
import PropertyDetail from "../pages/PropertyDetail";
import Community from "../pages/Community";
import MyPosts from "../pages/MyPosts";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import About from "../pages/About";
import AddProperty from "../pages/AddProperty";
import AdminDashboard from "../pages/AdminDashboard";


// 🔒 สำหรับหน้าเฉพาะผู้ใช้ที่ล็อกอิน
function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" />;
}

// 🔑 สำหรับหน้าเฉพาะ Admin
function AdminRoute({ children }) {
  const { user } = useAuth();
  return user?.role === "admin" ? children : <Navigate to="/" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/property/:id" element={<PropertyDetail />} />

      <Route path="/community" element={<Community />} />

      {/* 🔒 เฉพาะผู้ใช้ที่ล็อกอิน */}
      <Route
        path="/myposts"
        element={
          <PrivateRoute>
            <MyPosts />
          </PrivateRoute>
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 🔒 เฉพาะผู้ใช้ที่ล็อกอิน */}
      <Route
        path="/add-property"
        element={
          <PrivateRoute>
            <AddProperty />
          </PrivateRoute>
        }
      />

      {/* 🔒 เฉพาะผู้ใช้ที่ล็อกอิน */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      <Route path="/about" element={<About />} />

      {/* 🔑 หน้าเฉพาะ Admin */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <h1 style={{ textAlign: "center", marginTop: "2rem" }}>
              🔧 หน้าจัดการระบบ (Admin Dashboard)
            </h1>
          </AdminRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
    </Routes>

  );
}

export default AppRoutes;
