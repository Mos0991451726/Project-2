import React from "react";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Navbar.module.css";

function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();

  // ฟังก์ชันเปลี่ยนหน้า + รีโหลด
  const navigateTo = (path) => {
    window.location.href = path; // ⭐ รีเฟรชหน้า
  };

  return (
    <nav className={styles.navbar}>
      <span className={styles.logo} onClick={() => navigateTo("/")}>🏠 Real Estate</span>

      <ul className={styles.links}>
        <li>
          <span onClick={() => navigateTo("/")}>หน้าแรก</span>
        </li>

        <li>
          <span onClick={() => navigateTo("/community")}>คอมมูนิตี้</span>
        </li>

        <li>
          <span onClick={() => navigateTo("/about")}>เกี่ยวกับ</span>
        </li>

        {!isLoggedIn ? (
          <li>
            <span onClick={() => navigateTo("/login")}>เข้าสู่ระบบ</span>
          </li>
        ) : (
          <>
            {user?.role === "admin" && (
              <li>
                <span onClick={() => navigateTo("/admin")}>แดชบอร์ดแอดมิน</span>
              </li>
            )}

            <li>
              <span onClick={() => navigateTo("/add-property")}>ลงประกาศ</span>
            </li>

            <li>
              <span onClick={() => navigateTo("/profile")}>
                <img src={user.avatar} className={styles.avatar} alt="avatar" />
              </span>
            </li>

            <li>
              <button className={styles.logoutBtn} onClick={logout}>
                ออกจากระบบ
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
