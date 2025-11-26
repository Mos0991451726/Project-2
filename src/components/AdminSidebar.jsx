import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import styles from "../styles/AdminSidebar.module.css";

function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { label: "Dashboard", icon: "📊", path: "/admin" },
    { label: "จัดการผู้ใช้", icon: "👤", path: "/admin/users" },
    { label: "จัดการโพสต์", icon: "📝", path: "/admin/posts" },
    { label: "จัดการอสังหา", icon: "🏘️", path: "/admin/properties" },
    { label: "รายงาน", icon: "🚨", path: "/admin/reports" },
  ];

  const handleLogoutToProfile = async () => {
    const result = await Swal.fire({
      icon: "question",
      title: "กลับหน้าโปรไฟล์?",
      text: "ต้องการออกจากหน้าแอดมินและกลับสู่โปรไฟล์หรือไม่?",
      showCancelButton: true,
      confirmButtonText: "กลับหน้ารโปรไฟล์",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      navigate("/profile");
    }
  };

  return (
    <div className={styles.sidebar}>
      <h2 className={styles.title}>⚙️ Admin Panel</h2>

      <div className={styles.menu}>
        {menuItems.map((item) => (
          <button
            key={item.path}
            className={`${styles.menuItem} ${
              location.pathname === item.path ? styles.active : ""
            }`}
            onClick={() => navigate(item.path)}
          >
            <span className={styles.icon}>{item.icon}</span> {item.label}
          </button>
        ))}

        {/* ปุ่มกลับโปรไฟล์ */}
        <button className={styles.logout} onClick={handleLogoutToProfile}>
          🔙 กลับหน้าโปรไฟล์
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;
