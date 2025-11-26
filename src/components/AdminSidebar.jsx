import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/AdminSidebar.module.css";

function AdminSidebar() {
  const navigate = useNavigate();

  return (
    <div className={styles.sidebar}>
      <h2>Admin Panel</h2>

      <div className={styles.menu}>

        {/* Dashboard */}
        <button
          className={styles.menuItem}
          onClick={() => navigate("/admin")}
        >
          Dashboard
        </button>

        {/* จัดการผู้ใช้ */}
        <button
          className={styles.menuItem}
          onClick={() => navigate("/admin/users")}
        >
          จัดการผู้ใช้
        </button>

        {/* จัดการโพสต์ */}
        <button
          className={styles.menuItem}
          onClick={() => navigate("/admin/posts")}
        >
          จัดการโพสต์
        </button>

        {/* จัดการอสังหา */}
        <button
          className={styles.menuItem}
          onClick={() => navigate("/admin/properties")}
        >
          จัดการอสังหา
        </button>

        {/* รายงาน */}
        <button
          className={styles.menuItem}
          onClick={() => navigate("/admin/reports")}
        >
          รายงาน
        </button>

        {/* กลับหน้าโปรไฟล์ */}
        <button
          className={styles.logout}
          onClick={() => navigate("/profile")}
        >
          🔙 กลับหน้าโปรไฟล์
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;
