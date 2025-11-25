import React from "react";
import { useProperties } from "../context/PropertyContext";
import AdminSidebar from "../components/AdminSidebar";
import styles from "../styles/AdminProperties.module.css";

function AdminProperties() {
  const { properties } = useProperties();

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
              </tr>
            </thead>

            <tbody>
              {properties.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.type}</td>
                  <td>{p.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminProperties;
