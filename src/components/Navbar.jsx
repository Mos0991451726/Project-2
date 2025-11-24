// Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Navbar.module.css";

function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>🏠 Real Estate</Link>

      <ul className={styles.links}>
        <li className={isActive("/") ? styles.active : ""}>
          <Link to="/">หน้าแรก</Link>
        </li>

        <li className={isActive("/community") ? styles.active : ""}>
          <Link to="/community">คอมมูนิตี้</Link>
        </li>

        <li className={isActive("/about") ? styles.active : ""}>
          <Link to="/about">เกี่ยวกับ</Link>
        </li>

        {!isLoggedIn ? (
          <>
            <li className={isActive("/login") ? styles.active : ""}>
              <Link to="/login">เข้าสู่ระบบ</Link>
            </li>
          </>
        ) : (
          <>
            {user?.role === "admin" && (
              <li className={isActive("/admin") ? styles.active : ""}>
                <Link to="/admin">แดชบอร์ดแอดมิน</Link>
              </li>
            )}

            <li className={isActive("/add-property") ? styles.active : ""}>
              <Link to="/add-property">ลงประกาศ</Link>
            </li>

            <li>
              <Link to="/profile" className={styles.profileLink}>
                <img src={user.avatar} className={styles.avatar} />
              </Link>
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
