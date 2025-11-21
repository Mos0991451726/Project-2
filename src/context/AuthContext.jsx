import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const isLoggedIn = !!user;

  // ⭕ โหลดข้อมูลผู้ใช้จาก localStorage เมื่อเปิดเว็บ
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("authUser"));
    if (savedUser) setUser(savedUser);
  }, []);

  // 🔵 Login (ตอนนี้ยังไม่ได้เชื่อม Backend)
  const login = (email, password) => {
    // 💡 ถ้า email = admin@admin.com → ให้ role = admin
    const role = email === "admin@admin.com" ? "admin" : "user";

    const loggedUser = { email, role };
    setUser(loggedUser);
    localStorage.setItem("authUser", JSON.stringify(loggedUser));
  };

  // 🟠 Register (สมัคร = user เท่านั้น)
  const register = (email, password) => {
    const newUser = { email, role: "user" };
    localStorage.setItem("authUser", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
