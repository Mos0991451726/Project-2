import React from "react";
import styles from "../styles/AdminDashboard.module.css";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostContext";
import { useProperties } from "../context/PropertyContext";

function AdminDashboard() {
  const { user } = useAuth();
  const { posts } = usePosts();
  const { properties } = useProperties();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🔧 Admin Dashboard</h1>
      <p className={styles.subtitle}>ยินดีต้อนรับ, {user.email}</p>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h2>👥 ผู้ใช้ทั้งหมด</h2>
          <p className={styles.count}>–</p>
          <small>ยังไม่เชื่อมต่อฐานข้อมูล</small>
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

      <div className={styles.actions}>
        <button className={styles.btn}>จัดการผู้ใช้</button>
        <button className={styles.btn}>จัดการโพสต์</button>
        <button className={styles.btn}>จัดการประกาศ</button>
      </div>
    </div>
  );
}

export default AdminDashboard;
