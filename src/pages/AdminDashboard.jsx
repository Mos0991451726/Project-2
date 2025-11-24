import React from "react";
import styles from "../styles/AdminDashboard.module.css";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostContext";
import { useProperties } from "../context/PropertyContext";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const { posts } = usePosts();
  const { properties } = useProperties();

  return (
    <div className={styles.layout}>

      {/* --- Sidebar --- */}
      <div className={styles.sidebar}>
        <h2>Admin Panel</h2>

        <a className={styles.menuItem}>👤 จัดการผู้ใช้</a>
        <a className={styles.menuItem}>📝 จัดการโพสต์</a>
        <a className={styles.menuItem}>🏠 จัดการประกาศ</a>

        {/* 🔥 เปลี่ยนเป็นปุ่มออกจากระบบ */}
        <button
          onClick={logout}
          className={styles.menuItem}
          style={{ background: "none", border: "none", textAlign: "left", cursor: "pointer" }}
        >
          🚪 ออกจากระบบ
        </button>
      </div>

      {/* --- Content --- */}
      <div className={styles.content}>
        <h1 className={styles.title}>🔧 Admin Dashboard</h1>
        <p>ยินดีต้อนรับ, {user.email}</p>

        <div className={styles.cardsRow}>
          <div className={styles.card}>
            <h2>👥 ผู้ใช้ทั้งหมด</h2>
            <p className={styles.count}>–</p>
          </div>

          <div className={styles.card}>
            <h2>📝 โพสต์ทั้งหมด</h2>
            <p className={styles.count}>{posts.length}</p>
          </div>

          <div className={styles.card}>
            <h2>🏠 ประกาศอสังหา</h2>
            <p className={styles.count}>{properties.length}</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default AdminDashboard;
