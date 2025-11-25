// components/UserModal.jsx
import React from "react";
import styles from "../styles/AdminUsers.module.css";

function UserModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>ข้อมูลผู้ใช้</h2>

        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>ชื่อผู้ใช้:</strong> {user.username}</p>
        <p><strong>สถานะ:</strong> {user.status || "active"}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>วันที่สมัคร:</strong> {user.joinDate}</p>

        <button className={styles.closeBtn} onClick={onClose}>
          ปิด
        </button>
      </div>
    </div>
  );
}

export default UserModal;
