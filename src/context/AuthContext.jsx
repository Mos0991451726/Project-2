// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  getUserByEmail,
  saveUser,
} from "../utils/userDB";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  /* --------------------------------------------------
     ⭐ สร้าง Admin เริ่มต้นถ้ายังไม่มี
  -------------------------------------------------- */
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

  /* --------------------------------------------------
     ⭐ โหลดผู้ใช้หลังรีเฟรช
  -------------------------------------------------- */
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);

      await ensureDefaultAdmin();

      const email = localStorage.getItem("currentUser");

      if (email) {
        const found = await getUserByEmail(email);
        if (found) {
          setUser(found);
          setIsLoggedIn(true);
        }
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  /* --------------------------------------------------
     ⭐ Register (SweetAlert2)
  -------------------------------------------------- */
  const register = async (email, password, username) => {
    const exist = await getUserByEmail(email);

    if (exist) {
      await Swal.fire({
        icon: "error",
        title: "สมัครสมาชิกไม่สำเร็จ",
        text: "อีเมลนี้ถูกใช้แล้ว!",
      });
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

    await Swal.fire({
      icon: "success",
      title: "สมัครสมาชิกสำเร็จ!",
      timer: 1200,
      showConfirmButton: false,
    });

    return true;
  };

  /* --------------------------------------------------
     ⭐ Login (SweetAlert2)
  -------------------------------------------------- */
  const login = async (email, password) => {
    const found = await getUserByEmail(email);

    if (!found) {
      await Swal.fire({
        icon: "error",
        title: "เข้าสู่ระบบไม่สำเร็จ",
        text: "ไม่พบบัญชีผู้ใช้",
      });
      return false;
    }

    if (found.password !== password) {
      await Swal.fire({
        icon: "error",
        title: "รหัสผ่านไม่ถูกต้อง",
      });
      return false;
    }

    // ⭐ เก็บเฉพาะอีเมลเท่านั้น
    localStorage.setItem("currentUser", found.email);
    setUser(found);
    setIsLoggedIn(true);

    await Swal.fire({
      icon: "success",
      title: "เข้าสู่ระบบสำเร็จ!",
      timer: 1000,
      showConfirmButton: false,
    });

    return found;
  };

/* --------------------------------------------------
   ⭐ Update User (อัปเดตใน IndexedDB เท่านั้น)
-------------------------------------------------- */
const updateUser = async (updatedInfo) => {
  if (!user) return;

  // ดึงข้อมูลล่าสุดจาก IndexedDB
  const current = await getUserByEmail(user.email);

  // รวมข้อมูลใหม่เข้ากับข้อมูลเดิม
  const updatedUser = {
    ...current,

    // ข้อมูลพื้นฐาน
    username: updatedInfo.username ?? current.username,
    bio: updatedInfo.bio ?? current.bio,
    avatar: updatedInfo.avatar ?? current.avatar,
    cover: updatedInfo.cover ?? current.cover,

    // ⭐ ช่องทางการติดต่อ
    phone: updatedInfo.phone ?? current.phone,
    address: updatedInfo.address ?? current.address,
    facebook: updatedInfo.facebook ?? current.facebook,
    instagram: updatedInfo.instagram ?? current.instagram,
    line: updatedInfo.line ?? current.line,
  };

  // บันทึกลง IndexedDB
  await saveUser(updatedUser);

  // อัปเดต state React
  setUser(updatedUser);

  // แจ้งเตือน
  Swal.fire({
    icon: "success",
    title: "อัปเดตโปรไฟล์สำเร็จ!",
    timer: 1000,
    showConfirmButton: false,
  });
};

  /* --------------------------------------------------
     ⭐ Logout (SweetAlert2)
  -------------------------------------------------- */
  const logout = async () => {
    const result = await Swal.fire({
      title: "ออกจากระบบ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ออกจากระบบ",
      cancelButtonText: "ยกเลิก",
    });

    if (!result.isConfirmed) return;

    localStorage.removeItem("currentUser");
    setUser(null);
    setIsLoggedIn(false);

    navigate("/login");

    Swal.fire({
      icon: "success",
      title: "ออกจากระบบสำเร็จ",
      timer: 1000,
      showConfirmButton: false,
    });
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
