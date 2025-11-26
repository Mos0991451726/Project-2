// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  getUserByEmail,
  saveUser,
  getAllUsers
} from "../utils/userDB";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // ⭐ สร้าง Admin เริ่มต้นถ้ายังไม่มี
  const ensureDefaultAdmin = async () => {
    const admin = await getUserByEmail("admin@example.com");

    if (!admin) {
      const newAdmin = {
        email: "admin@example.com",
        password: "123456",
        username: "Administrator",
        role: "admin",
        status: "active",
        avatar: "/assets/default-avatar.png",
        cover: "/assets/cover-default.jpg",
        bio: "I am the system admin",
        joinDate: new Date().toLocaleDateString("th-TH"),
      };

      await saveUser(newAdmin);
    }
  };

  // โหลด User หลัง refresh
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);

      await ensureDefaultAdmin();

      const email = localStorage.getItem("currentUser");

      if (email) {
        const foundUser = await getUserByEmail(email);
        if (foundUser) {
          setUser(foundUser);
          setIsLoggedIn(true);
        }
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  // Register
  const register = async (email, password, username) => {
    const exist = await getUserByEmail(email);

    if (exist) {
      alert("อีเมลนี้ถูกใช้แล้ว");
      return false;
    }

    const newUser = {
      email,
      password,
      username,
      role: "user",
      status: "active",
      avatar: "/assets/default-avatar.png",
      cover: "/assets/cover-default.jpg",
      bio: "",
      joinDate: new Date().toLocaleDateString("th-TH"),
    };

    await saveUser(newUser);
    return true;
  };

  // Login
  const login = async (email, password) => {
    const found = await getUserByEmail(email);

    if (!found) {
      alert("ไม่พบบัญชีผู้ใช้");
      return false;
    }

    if (found.password !== password) {
      alert("รหัสผ่านไม่ถูกต้อง");
      return false;
    }

    localStorage.setItem("currentUser", email);
    setUser(found);
    setIsLoggedIn(true);

    return found;
  };

  // ⭐ Update User (ไม่เก็บ Base64 ลง localStorage)
const updateUser = async (updatedInfo) => {
  if (!user) return;

  const current = await getUserByEmail(user.email);

  const updated = {
    ...current,
    username: updatedInfo.username,
    bio: updatedInfo.bio,
    avatar: updatedInfo.avatar,   // ← บันทึก base64 ได้เลย
    cover: updatedInfo.cover,     // ← เหมือนกัน
  };

  await saveUser(updated);
  setUser(updated);
};

  // Logout
  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        loading,
        register,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
