import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostContext";
import { useProperties } from "../context/PropertyContext";

// ⭐ ฟังก์ชันดึงข้อมูล user จาก IndexedDB (คุณมีไฟล์นี้อยู่แล้ว)
import { getUserByEmail } from "../utils/userDB";

import EditProfileModal from "../components/EditProfileModal";
import ContactSidebar from "../components/ContactSidebar";
import UserReviews from "../components/UserReviews";
import UserListings from "../components/UserListings";
import Post from "../components/Post";

import styles from "../styles/Profile.module.css";

function Profile() {
  const { user: currentUser, updateUser } = useAuth();
  const { posts } = usePosts();
  const { properties } = useProperties();

  const { email } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  

  // ⭐ โหลดข้อมูลผู้ใช้ตาม email ที่กำลังดู
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);

      // ถ้าเปิดโปรไฟล์ตัวเอง
      if (!email || email === currentUser?.email) {
        setProfileUser(currentUser);
        setLoading(false);
        return;
      }

      // ถ้าดูโปรไฟล์ของคนอื่น → โหลดจาก userDB
      const userFromDB = await getUserByEmail(email);
      setProfileUser(userFromDB || null);

      setLoading(false);
    };

    loadUserData();
  }, [email, currentUser]);

  if (loading) return <p style={{ padding: "2rem" }}>กำลังโหลดข้อมูล...</p>;
  if (!profileUser) return <p style={{ padding: "2rem" }}>ไม่พบบัญชีผู้ใช้นี้</p>;

  // ⭐ ตรวจสอบเป็นเจ้าของโปรไฟล์?
  const isOwner = currentUser?.email === profileUser.email;

  // ⭐ โพสต์ของผู้ใช้
  const myPosts = posts.filter((p) => p.userId === profileUser.email);

  // ⭐ ประกาศของผู้ใช้
  const userProperties = properties.filter(
    (p) => p.ownerEmail === profileUser.email
  );

  const handleSave = (updatedUser) => {
    updateUser(updatedUser);
  };

  return (
    <div className={styles.profilePage}>
      
      {/* รูป Cover */}
      <div
        className={styles.coverPhoto}
        style={{ backgroundImage: `url(${profileUser.cover})` }}
      />

      <div className={styles.profileLayout}>

        {/* LEFT COLUMN */}
        <div className={styles.leftColumn}>
          <ContactSidebar user={profileUser} />
          <UserReviews user={profileUser} />
          <UserListings properties={userProperties} />
        </div>

        {/* RIGHT COLUMN */}
        <div className={styles.rightColumn}>

          {/* Profile Card */}
          <div className={styles.profileCard}>
            <div className={styles.avatarContainer}>
              <img src={profileUser.avatar} className={styles.avatar} />
            </div>

            <h2>{profileUser.username}</h2>

            {/* แสดงปุ่มแก้ไขเฉพาะเจ้าของ */}
            {isOwner && (
              <button
                className={styles.editBtn}
                onClick={() => setShowModal(true)}
              >
                ✏️ แก้ไขโปรไฟล์
              </button>
            )}

            {profileUser.bio && (
              <p className={styles.bioText}>“{profileUser.bio}”</p>
            )}

            <p className={styles.joinDate}>
              เข้าร่วมเมื่อ: {profileUser.joinDate}
            </p>
          </div>

          {/* MY POSTS */}
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

      {/* EDIT MODAL */}
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
