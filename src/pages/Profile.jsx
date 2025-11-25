import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostContext";

import EditProfileModal from "../components/EditProfileModal";
import ContactSidebar from "../components/ContactSidebar";
import UserReviews from "../components/UserReviews";
import UserListings from "../components/UserListings";
import Post from "../components/Post";

import styles from "../styles/Profile.module.css";

function Profile() {
  const { user: currentUser, updateUser } = useAuth();
  const { posts } = usePosts();
  const { email } = useParams(); // ★ email จาก URL เช่น /profile/a@gmail.com

  const [showModal, setShowModal] = useState(false);

  // โหลด user ทั้งหมดจาก localStorage
  const allUsersObj = JSON.parse(localStorage.getItem("users")) || {};

  // ★ ถ้ามี email → ดูโปรไฟล์คนนั้น
  // ★ ถ้าไม่มี → ดูโปรไฟล์ตัวเอง
  const profileUser = email ? allUsersObj[email] : currentUser;

  if (!profileUser) return <p>ไม่พบบัญชีผู้ใช้นี้</p>;

  // ★ เจ้าของหรือไม่
  const isOwner = currentUser?.email === profileUser.email;

  // ★ เอาโพสต์ของเจ้าของโปรไฟล์
  const myPosts = posts.filter((p) => p.userId === profileUser.email);

  useEffect(() => {
    console.log(JSON.parse(localStorage.getItem("authUser")));
  }, []);

  const handleSave = (updatedUser) => {
    updateUser(updatedUser); // อัปเดต currentUser เท่านั้น
  };

  return (
    <div className={styles.profilePage}>

      {/* ปก */}
      <div
        className={styles.coverPhoto}
        style={{ backgroundImage: `url(${profileUser.cover})` }}
      />

      {/* Layout 2 คอลัมน์ */}
      <div className={styles.profileLayout}>

        {/* ===========================
            คอลัมน์ซ้าย
        ============================ */}
        <div className={styles.leftColumn}>
          <ContactSidebar user={profileUser} />

          <UserReviews user={profileUser} />

          <UserListings
            properties={[ ]}
          />
        </div>

        {/* ===========================
            คอลัมน์ขวา
        ============================ */}
        <div className={styles.rightColumn}>

          {/* การ์ดโปรไฟล์ */}
          <div className={styles.profileCard}>
            <div className={styles.avatarContainer}>
              <img src={profileUser.avatar} className={styles.avatar} />
            </div>

            <h2>{profileUser.username}</h2>

            {/* ปุ่มแก้ไขเฉพาะเจ้าของ */}
            {isOwner && (
              <button
                className={styles.editBtn}
                onClick={() => setShowModal(true)}
              >
                ✏️ แก้ไขโปรไฟล์
              </button>
            )}

            {profileUser.bio && <p className={styles.bioText}>“{profileUser.bio}”</p>}

            <p className={styles.joinDate}>เข้าร่วมเมื่อ: {profileUser.joinDate}</p>
          </div>

          {/* โพสต์ของ user */}
          <div className={styles.myPostsSection}>
            <h3>📸 โพสต์ของ {isOwner ? "ฉัน" : profileUser.username}</h3>

            {myPosts.length === 0 ? (
              <p className={styles.noPost}>ยังไม่มีโพสต์ในตอนนี้</p>
            ) : (
              myPosts.map((post) => <Post key={post.id} post={post} />)
            )}
          </div>

        </div>

      </div>

      {/* โมดัลแก้ไขโปรไฟล์ */}
      {showModal && isOwner && (
        <EditProfileModal
          user={profileUser}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

    </div>
  );
}

export default Profile;
