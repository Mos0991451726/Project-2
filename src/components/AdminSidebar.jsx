import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/AdminSidebar.module.css";

function AdminSidebar() {
  const navigate = useNavigate();

  return (
    <div className={styles.sidebar}>
      <h2>Admin Panel</h2>

      <div className={styles.menu}>
        <button
          type="button"
          className={styles.menuItem}
          onClick={() => navigate("/admin")}
        >
          Dashboard
        </button>

        <button
          type="button"
          className={styles.menuItem}
          onClick={() => navigate("/admin/manage")}
        >
          จัดการผู้ใช้
        </button>

        <button
          type="button"
          className={styles.menuItem}
          onClick={() => navigate("/admin/posts")}
        >
          จัดการโพสต์
        </button>

        <button
          type="button"
          className={styles.menuItem}
          onClick={() => navigate("/admin/properties")}
        >
          จัดการอสังหา
        </button>

        <button
          type="button"
          className={styles.menuItem}
          onClick={() => navigate("/admin/reports")}
        >
          รายงาน
        </button>
      </div>

      <button type="button" className={styles.logout}>
        ออกจากระบบ
      </button>
    </div>
  );
}

export default AdminSidebar;
