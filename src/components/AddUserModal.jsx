// components/AddUserModal.jsx
import React, { useState } from "react";
import Swal from "sweetalert2";
import styles from "../styles/AddUserModal.module.css";

function AddUserModal({ onAdd, onClose }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("user");

  // ⭐ Validation เบื้องต้น
  const validate = () => {
    if (!email.trim() || !email.includes("@")) {
      Swal.fire({
        icon: "warning",
        title: "อีเมลไม่ถูกต้อง!",
        text: "กรุณากรอกอีเมลที่ถูกต้อง",
      });
      return false;
    }

    if (!username.trim()) {
      Swal.fire({
        icon: "warning",
        title: "ชื่อผู้ใช้ห้ามว่าง!",
      });
      return false;
    }

    return true;
  };

  const handleAdd = async () => {
    if (!validate()) return;

    const success = await onAdd(email, username, role);

    if (success) {
      Swal.fire({
        icon: "success",
        title: "เพิ่มผู้ใช้สำเร็จ!",
        timer: 1200,
        showConfirmButton: false,
      });

      // reset form
      setEmail("");
      setUsername("");
      setRole("user");

      onClose();
    } else {
      Swal.fire({
        icon: "error",
        title: "เพิ่มผู้ใช้ไม่สำเร็จ",
        text: "อีเมลนี้ถูกใช้ไปแล้ว!",
      });
    }
  };

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

        <button onClick={handleAdd} className={styles.addBtn}>
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
