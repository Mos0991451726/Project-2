import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/AdminSidebar.module.css";

function AdminSidebar() {
  const navigate = useNavigate();

  return (
    <div className={styles.sidebar}>
      <h2>Admin Panel</h2>

      <div className={styles.menu}>
        <button className={styles.menuItem} onClick={() => navigate("/admin/manage")}>
          Dashboard
        </button>

        <button className={styles.menuItem} onClick={() => navigate("/admin/users")}>
          จัดการผู้ใช้
        </button>

        <button className={styles.menuItem} onClick={() => navigate("/admin/posts")}>
          จัดการโพสต์
        </button>

        <button className={styles.menuItem} onClick={() => navigate("/admin/properties")}>
          จัดการอสังหา
        </button>

        <button className={styles.menuItem} onClick={() => navigate("/admin/reports")}>
          รายงาน
        </button>
        <button
          className={styles.logout}
          onClick={() => navigate("/profile")}
        >
          🔙 กลับหน้าโปรไฟล์
        </button>
      </div>

      <button></button>
    </div>
  );
}

export default AdminSidebar;
