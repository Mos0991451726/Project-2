import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Auth.module.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    alert("สมัครสมาชิกสำเร็จ!");
    navigate("/login");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>สมัครสมาชิก</h1>

      <form onSubmit={handleRegister}>
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
          สมัครสมาชิก
        </button>
      </form>
    </div>
  );
}

export default Register;
