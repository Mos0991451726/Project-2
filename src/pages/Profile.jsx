import React, { useState, useEffect } from "react";
import { usePosts } from "../context/PostContext";
import EditProfileModal from "../components/EditProfileModal";
import Post from "../components/Post";
import styles from "../styles/Profile.module.css";

function Profile() {
  const { posts } = usePosts();

  const storedUser = JSON.parse(localStorage.getItem("authUser")) || {
    name: "คุณผู้ใช้",
    avatar: "/assets/avatar-default.png",
    cover: "/assets/cover-default.jpg",
    bio: "",
    joinDate: new Date().toLocaleDateString("th-TH"),
  };

  const [user, setUser] = useState(storedUser);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!storedUser.joinDate) {
      const updated = {
        ...storedUser,
        joinDate: new Date().toLocaleDateString("th-TH"),
      };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
    }
  }, []);

  useEffect(() => {
    console.log(JSON.parse(localStorage.getItem("authUser")));
  }, []);

  const handleSave = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const myPosts = posts.filter((p) => p.user === user.name);

  return (
    <div className={styles.profilePage}>
      <div
        className={styles.coverPhoto}
        style={{ backgroundImage: `url(${user.cover})` }}
      ></div>

      <div className={styles.profileCard}>
        <div className={styles.avatarContainer}>
          <img src={user.avatar} alt="avatar" className={styles.avatar} />
        </div>

        <h2>{user.name}</h2>

        <button className={styles.editBtn} onClick={() => setShowModal(true)}>
          ✏️ แก้ไขโปรไฟล์
        </button>

        {user.bio && <p className={styles.bioText}>“{user.bio}”</p>}

        <p className={styles.joinDate}>เข้าร่วมเมื่อ: {user.joinDate}</p>
      </div>

      <div className={styles.myPostsSection}>
        <h3>📸 โพสต์ของฉัน</h3>

        {myPosts.length === 0 ? (
          <p className={styles.noPost}>ยังไม่มีโพสต์ในตอนนี้</p>
        ) : (
          myPosts.map((p) => <Post key={p.id} post={p} />)
        )}
      </div>

      {showModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default Profile;
