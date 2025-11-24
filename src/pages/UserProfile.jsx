// src/pages/UserProfile.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ContactSidebar from "../components/ContactSidebar";
import UserReviews from "../components/UserReviews";
import UserListings from "../components/UserListings";
import styles from "../styles/Profile.module.css";
import { getAllUsers } from "../utils/userUtils";

function UserProfile() {
  const { email } = useParams();            // อีเมลของโปรไฟล์ที่กำลังเปิด
  const { user: currentUser } = useAuth(); // ผู้ใช้ที่กำลังล็อกอิน

  const allUsers = getAllUsers();
  const profileUser = allUsers[email];

  if (!profileUser) return <p>ไม่พบบัญชีผู้ใช้</p>;

  const isOwner = currentUser?.email === email;

  return (
    <div className={styles.profilePage}>

      <div
        className={styles.coverPhoto}
        style={{ backgroundImage: `url(${profileUser.cover})` }}
      />

      <div className={styles.profileLayout}>

        {/* คอลัมน์ซ้าย */}
        <div className={styles.leftColumn}>
          <ContactSidebar user={profileUser} />

          <UserReviews user={profileUser} />

          <UserListings properties={[]} />
        </div>

        {/* คอลัมน์ขวา */}
        <div className={styles.rightColumn}>

          <div className={styles.profileCard}>
            <div className={styles.avatarContainer}>
              <img src={profileUser.avatar} className={styles.avatar} />
            </div>

            <h2>{profileUser.username}</h2>

            {isOwner ? (
              <button className={styles.editBtn}>
                ✏️ แก้ไขโปรไฟล์
              </button>
            ) : (
              <button className={styles.editBtn}>
                ⭐ เพิ่มรีวิวผู้ใช้นี้
              </button>
            )}

            {profileUser.bio && (
              <p className={styles.bioText}>“{profileUser.bio}”</p>
            )}

            <p className={styles.joinDate}>
              เข้าร่วมเมื่อ: {profileUser.joinDate}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default UserProfile;
