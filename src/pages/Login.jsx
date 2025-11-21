import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ← เพิ่ม Link
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Auth.module.css";

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    login(email, password);
    navigate("/profile");
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

      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <span>ยังไม่มีบัญชี? </span>
        <Link
          to="/register"
          style={{
            color: "#0077b6",
            fontWeight: "600",
            textDecoration: "none",
          }}
        >
          สมัครสมาชิก
        </Link>
      </div>
    </div>
  );
}

export default Login;
