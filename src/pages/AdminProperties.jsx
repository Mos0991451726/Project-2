import React from "react";
import { useNavigate } from "react-router-dom";
import { useProperties } from "../context/PropertyContext";
import AdminSidebar from "../components/AdminSidebar";
import styles from "../styles/AdminProperties.module.css";

function AdminProperties() {
  const { properties, approveProperty, rejectProperty } = useProperties();
  const navigate = useNavigate();

  return (
    <div className={styles.layout}>
      <AdminSidebar />

      <div className={styles.content}>
        <h1 className={styles.title}>🏠 จัดการประกาศอสังหา</h1>

        {properties.length === 0 ? (
          <p>ยังไม่มีประกาศ</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ชื่อ</th>
                <th>ประเภท</th>
                <th>ราคา</th>
                <th>สถานะ</th>
                <th>ดำเนินการ</th>
              </tr>
            </thead>

            <tbody>
              {properties.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td>{p.type}</td>
                  <td>{p.price}</td>
                  <td>
                    {p.status === "pending" ? "⌛ รออนุมัติ" : "✔️ อนุมัติแล้ว"}
                  </td>
                  <td>
                    {p.status === "pending" && (
                      <>
                        <button onClick={() => approveProperty(p.id)}>
                          ✔️ อนุมัติ
                        </button>
                        <button onClick={() => rejectProperty(p.id)}>
                          ❌ ลบ
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <button className={styles.logout} onClick={() => navigate("/profile")}>
        🔙 กลับหน้าโปรไฟล์
      </button>
    </div>
  );
}

export default AdminProperties;
