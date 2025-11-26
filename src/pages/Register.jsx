import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Auth.module.css";
import Swal from "sweetalert2";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    // 🔴 1. เช็คช่องว่าง
    if (!email.trim() || !password.trim() || !username.trim() || !confirm.trim()) {
      Swal.fire({
        icon: "warning",
        title: "ข้อมูลไม่ครบ!",
        text: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
      });
      return;
    }

    // 🔴 2. เช็ครหัสผ่านไม่ตรงกัน
    if (password !== confirm) {
      Swal.fire({
        icon: "error",
        title: "รหัสผ่านไม่ตรงกัน!",
        text: "กรุณากรอกรหัสผ่านให้ตรงกันทั้งสองช่อง",
      });
      return;
    }

    // 🔴 3. สมัครสมาชิก
    const ok = register(email, password, username);

    if (ok) {
      Swal.fire({
        icon: "success",
        title: "สมัครสมาชิกสำเร็จ!",
        confirmButtonText: "ไปหน้าเข้าสู่ระบบ",
        confirmButtonColor: "#3085d6",
      }).then(() => navigate("/login"));
    } else {
      Swal.fire({
        icon: "error",
        title: "สมัครไม่สำเร็จ!",
        text: "อีเมลนี้มีผู้ใช้แล้ว หรือเกิดข้อผิดพลาด",
      });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>สมัครสมาชิก</h1>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="ชื่อผู้ใช้ (Username)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
        />

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

        <input
          type="password"
          placeholder="ยืนยันรหัสผ่าน"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={styles.input}
        />

        <button type="submit" className={styles.button}>
          สมัครสมาชิก
        </button>
      </form>

      <p style={{ marginTop: "1rem" }}>
        มีบัญชีอยู่แล้ว?{" "}
        <Link to="/login" style={{ color: "#0077b6", fontWeight: "bold" }}>
          เข้าสู่ระบบ
        </Link>
      </p>
    </div>
  );
}

export default Register;
