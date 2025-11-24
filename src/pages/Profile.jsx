import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostContext";
import EditProfileModal from "../components/EditProfileModal";
import Post from "../components/Post";
import styles from "../styles/Profile.module.css";
import ContactSidebar from "../components/ContactSidebar";

function Profile() {
  const { user, updateUser } = useAuth();
  const { posts } = usePosts();

  const [showModal, setShowModal] = useState(false);

  if (!user) return <p>กำลังโหลด...</p>;

  const myPosts = posts.filter((p) => p.userId === user.email);

  const handleSave = (updatedUser) => {
    updateUser(updatedUser);
  };

  return (
    <div className={styles.profilePage}>

      {/* ปก */}
      <div className={styles.coverPhoto} style={{ backgroundImage: `url(${user.cover})` }} />

      {/* Layout 2 คอลัมน์ */}
      <div className={styles.profileLayout}>

        {/* ซ้าย : ช่องทางการติดต่อ */}
        <div className={styles.leftColumn}>
          <ContactSidebar user={user} />
        </div>

        {/* ขวา : การ์ดโปรไฟล์ + โพสต์ */}
        <div className={styles.rightColumn}>

          {/* การ์ดโปรไฟล์ */}
          <div className={styles.profileCard}>
            <div className={styles.avatarContainer}>
              <img src={user.avatar} className={styles.avatar} />
            </div>

            <h2>{user.username}</h2>

            <button className={styles.editBtn} onClick={() => setShowModal(true)}>
              ✏️ แก้ไขโปรไฟล์
            </button>

            {user.bio && <p className={styles.bioText}>“{user.bio}”</p>}
            <p className={styles.joinDate}>เข้าร่วมเมื่อ: {user.joinDate}</p>
          </div>

          {/* โพสต์ของฉัน */}
          <div className={styles.myPostsSection}>
            <h3>📸 โพสต์ของฉัน</h3>

            {myPosts.length === 0 ? (
              <p className={styles.noPost}>ยังไม่มีโพสต์ในตอนนี้</p>
            ) : (
              myPosts.map((post) => <Post key={post.id} post={post} />)
            )}
          </div>

        </div>

      </div>

      {/* Modal */}
      {showModal && (
        <EditProfileModal user={user} onClose={() => setShowModal(false)} onSave={handleSave} />
      )}

    </div>
  );
}

export default Profile;
