// src/pages/UserProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProperties } from "../context/PropertyContext";
import ContactSidebar from "../components/ContactSidebar";
import UserReviews from "../components/UserReviews";
import styles from "../styles/Profile.module.css";
import { getAllUsers } from "../utils/userUtils";

function UserProfile() {
  const { email } = useParams();       
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const { properties } = useProperties();   // ⭐ ดึงประกาศทั้งหมด
  const allUsers = getAllUsers();
  const profileUser = allUsers[email];

  const [userPosts, setUserPosts] = useState([]);

  if (!profileUser) return <p>ไม่พบบัญชีผู้ใช้</p>;

  const isOwner = currentUser?.email === email;

  // ⭐ โหลดเฉพาะประกาศที่เป็นของ user นี้
  useEffect(() => {
    const ownedPosts = properties.filter(
      (p) => p.ownerEmail === email
    );
    setUserPosts(ownedPosts);
  }, [email, properties]);

  return (
    <div className={styles.profilePage}>

      {/* Cover */}
      <div
        className={styles.coverPhoto}
        style={{ backgroundImage: `url(${profileUser.cover})` }}
      />

      <div className={styles.profileLayout}>
        
        {/* Column Left */}
        <div className={styles.leftColumn}>
          <ContactSidebar user={profileUser} />
          <UserReviews user={profileUser} />

          {/* ⭐ ประกาศของผู้ใช้ */}
          <div className={styles.listingBox}>
            <h3>🏡 ประกาศของผู้ใช้</h3>

            {userPosts.length === 0 ? (
              <p style={{ textAlign: "center", color: "#777" }}>
                ยังไม่มีประกาศในตอนนี้
              </p>
            ) : (
              <ul className={styles.propertyList}>
                {userPosts.map((post) => (
                  <li
                    key={post.id}
                    className={styles.propertyItem}
                    onClick={() => navigate(`/property/${post.id}`)}
                  >
                    📌 {post.title || "ไม่มีชื่อประกาศ"}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Column Right */}
        <div className={styles.rightColumn}>
          <div className={styles.profileCard}>
            <div className={styles.avatarContainer}>
              <img src={profileUser.avatar} className={styles.avatar} />
            </div>

            <h2>{profileUser.username}</h2>

            {isOwner ? (
              <button className={styles.editBtn}>✏️ แก้ไขโปรไฟล์</button>
            ) : (
              <button className={styles.editBtn}>⭐ เพิ่มรีวิวผู้ใช้นี้</button>
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
