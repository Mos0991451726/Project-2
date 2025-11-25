import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// โหลดผู้ใช้ทั้งหมด
const getAllUsers = () => {
  return JSON.parse(localStorage.getItem("users")) || {};
};

// บันทึกผู้ใช้ทั้งหมด
const saveAllUsers = (users) => {
  localStorage.setItem("users", JSON.stringify(users));
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);   // ⭐ สำคัญที่สุด

  // ⭐ เพิ่ม admin ถ้ายังไม่มี
  const ensureDefaultAdmin = () => {
    const users = getAllUsers();

    if (!users["admin@example.com"]) {
      users["admin@example.com"] = {
        email: "admin@example.com",
        password: "123456",
        username: "Administrator",
        role: "admin",
        avatar: "/assets/default-avatar.png",
        cover: "/assets/cover-default.jpg",
        bio: "I am the system admin",
        joinDate: new Date().toLocaleDateString("th-TH"),
      };
      saveAllUsers(users);
    }
  };

  useEffect(() => {
    ensureDefaultAdmin();

    const users = getAllUsers();
    const currentEmail = localStorage.getItem("currentUser");

    if (currentEmail && users[currentEmail]) {
      setUser(users[currentEmail]);
      setIsLoggedIn(true);
    }

    setLoading(false);   // ⭐ บอกว่าโหลดเสร็จแล้ว
  }, []);

  // สมัครสมาชิก
  const register = (email, password, username) => {
    const users = getAllUsers();

    if (users[email]) {
      alert("อีเมลนี้ถูกใช้แล้ว");
      return false;
    }

    users[email] = {
      email,
      password,
      username,
      role: "user",
      avatar: "/assets/default-avatar.png",
      cover: "/assets/cover-default.jpg",
      bio: "",
      joinDate: new Date().toLocaleDateString("th-TH"),
    };

    saveAllUsers(users);
    return true;
  };

  // ล็อกอิน
  const login = (email, password) => {
    const users = getAllUsers();

    if (!users[email]) {
      alert("ไม่พบบัญชีผู้ใช้");
      return false;
    }

    if (users[email].password !== password) {
      alert("รหัสผ่านไม่ถูกต้อง");
      return false;
    }

    localStorage.setItem("currentUser", email);
    setUser(users[email]);
    setIsLoggedIn(true);

    return users[email];
  };

  // อัปเดตผู้ใช้
const updateUser = (updatedInfo) => {
  if (!user) return;  

  const users = getAllUsers();
  const email = user.email; 

  users[email] = {
    ...users[email],
    ...updatedInfo,
  };

  saveAllUsers(users);
  setUser(users[email]);   
};

 
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
