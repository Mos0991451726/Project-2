import React from "react";
import { usePosts } from "../context/PostContext";
import AdminSidebar from "../components/AdminSidebar";
import styles from "../styles/AdminPosts.module.css";

function AdminPosts() {
  const { posts, deletePost, toggleHidePost } = usePosts();

  return (
    <div className={styles.layout}>
      <AdminSidebar />

      <div className={styles.content}>
        <h1 className={styles.title}>📝 จัดการโพสต์ทั้งหมด</h1>

        {posts.length === 0 ? (
          <p>ยังไม่มีโพสต์</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ผู้ใช้</th>
                <th>เนื้อหา</th>
                <th>รูปภาพ</th>
                <th>สถานะ</th>
                <th>จัดการ</th>
              </tr>
            </thead>

            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td>{p.userName}</td>
                  <td>{p.content.substring(0, 30)}...</td>
                  <td>{p.image ? "📷" : "-"}</td>
                  <td>{p.hidden ? "❌ ถูกปิดกั้น" : "✔ ปกติ"}</td>

                  <td>
                    <button
                      className={styles.actionBtn}
                      onClick={() => toggleHidePost(p.id)}
                    >
                      {p.hidden ? "ยกเลิกปิดกั้น" : "ปิดกั้นโพสต์"}
                    </button>

                    <button
                      className={styles.actionDelete}
                      onClick={() => {
                        if (confirm("ต้องการลบโพสต์นี้จริงหรือไม่?")) {
                          deletePost(p.id);
                        }
                      }}
                    >
                      ลบโพสต์
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminPosts;
