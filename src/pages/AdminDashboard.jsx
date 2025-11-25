import React from "react";
import AdminSidebar from "../components/AdminSidebar";
import styles from "../styles/AdminDashboard.module.css";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostContext";
import { useProperties } from "../context/PropertyContext";

function AdminDashboard() {
  const { user } = useAuth();
  const { posts } = usePosts();
  const { properties } = useProperties();

  const allUsers = JSON.parse(localStorage.getItem("users")) || {};
  const totalUsers = Object.keys(allUsers).length;

  return (
    <div className={styles.layout}>
      <AdminSidebar />

      <div className={styles.content}>
        <h1 className={styles.title}>⚙️ ระบบจัดการ (Admin)</h1>
        <p>ยินดีต้อนรับ, {user.email}</p>

        <div className={styles.cards}>
          <div className={styles.card}>
            <h3>👥 ผู้ใช้ทั้งหมด</h3>
            <p>{totalUsers}</p>
          </div>

          <div className={styles.card}>
            <h3>📝 โพสต์ทั้งหมด</h3>
            <p>{posts.length}</p>
          </div>

          <div className={styles.card}>
            <h3>🏠 ประกาศทั้งหมด</h3>
            <p>{properties.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
