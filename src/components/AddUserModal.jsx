// components/AddUserModal.jsx
import React, { useState } from "react";
import styles from "../styles/AdminUsers.module.css";

function AddUserModal({ onAdd, onClose }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("user");

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>เพิ่มผู้ใช้ใหม่</h2>

        <input
          type="text"
          placeholder="อีเมล"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="ชื่อผู้ใช้"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          onClick={() => {
            onAdd(email, username, role);
          }}
          className={styles.addBtn}
        >
          เพิ่มผู้ใช้
        </button>

        <button className={styles.closeBtn} onClick={onClose}>
          ปิด
        </button>
      </div>
    </div>
  );
}

export default AddUserModal;
