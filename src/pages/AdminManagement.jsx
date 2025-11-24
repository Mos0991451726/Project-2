import React, { useState } from "react";
import styles from "../styles/AdminManagement.module.css";
import { usePosts } from "../context/PostContext";
import { useProperties } from "../context/PropertyContext";
import { useAuth } from "../context/AuthContext";

function AdminManagement() {
  const { posts, deletePost } = usePosts();
  const { properties } = useProperties();
  const { userList = [] } = useAuth(); // รองรับในอนาคต

  const [section, setSection] = useState("users");

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>⚙️ ระบบจัดการ (Admin)</h1>

      <div className={styles.menu}>
        <button
          className={`${styles.menuBtn} ${
            section === "users" ? styles.active : ""
          }`}
          onClick={() => setSection("users")}
        >
          👥 ผู้ใช้
        </button>

        <button
          className={`${styles.menuBtn} ${
            section === "posts" ? styles.active : ""
          }`}
          onClick={() => setSection("posts")}
        >
          📝 โพสต์
        </button>

        <button
          className={`${styles.menuBtn} ${
            section === "properties" ? styles.active : ""
          }`}
          onClick={() => setSection("properties")}
        >
          🏠 ประกาศอสังหา
        </button>
      </div>

      {/* ---------------- ผู้ใช้ ---------------- */}
      {section === "users" && (
        <div className={styles.panel}>
          <h2>👥 จัดการผู้ใช้</h2>

          {userList.length === 0 ? (
            <p>ยังไม่มีข้อมูลผู้ใช้ (ยังไม่เชื่อมต่อฐานข้อมูล)</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>อีเมล</th>
                  <th>Role</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {userList.map((u, i) => (
                  <tr key={i}>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>
                      <button className={styles.actionBtn}>แก้ไข</button>
                      <button className={styles.actionDelete}>ลบ</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ---------------- โพสต์ ---------------- */}
      {section === "posts" && (
        <div className={styles.panel}>
          <h2>📝 จัดการโพสต์</h2>

          {posts.length === 0 ? (
            <p>ยังไม่มีโพสต์</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ผู้ใช้</th>
                  <th>เนื้อหา</th>
                  <th>รูปภาพ</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id}>
                    <td>{p.user}</td>
                    <td>{p.content?.substring(0, 30)}...</td>
                    <td>{p.image ? "📷" : "–"}</td>
                    <td>
                      <button
                        className={styles.actionDelete}
                        onClick={() => deletePost(p.id)}
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ---------------- อสังหา ---------------- */}
      {section === "properties" && (
        <div className={styles.panel}>
          <h2>🏠 จัดการประกาศอสังหา</h2>

          {properties.length === 0 ? (
            <p>ยังไม่มีประกาศอสังหา</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ชื่อ</th>
                  <th>ประเภท</th>
                  <th>ราคา</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.type}</td>
                    <td>{p.price}</td>
                    <td>
                      <button className={styles.actionBtn}>แก้ไข</button>
                      <button className={styles.actionDelete}>ลบ</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminManagement;
