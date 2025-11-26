import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Auth.module.css";

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();

  const loggedInUser = await login(email, password);

  if (!loggedInUser) return;

  // 🔹 ตรวจ role
  if (loggedInUser.role === "admin") {
    navigate("/admin");
  } else {
    navigate("/profile");
  }
};

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>เข้าสู่ระบบ</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="อีเมล"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />

        <input
          type="password"
          placeholder="รหัสผ่าน"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />

        <button type="submit" className={styles.button}>
          เข้าสู่ระบบ
        </button>
      </form>

      {/* 🔹 ลิงก์สมัครสมาชิก */}
      <p style={{ marginTop: "1rem" }}>
        ยังไม่มีบัญชี?{" "}
        <Link to="/register" style={{ color: "#0077b6", fontWeight: "bold" }}>
          สมัครสมาชิก
        </Link>
      </p>
    </div>
  );
}

export default Login;
