import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostContext";
import { useProperties } from "../context/PropertyContext";

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

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);

      // ดูโปรไฟล์ตัวเอง
      if (!email || email === currentUser?.email) {
        setProfileUser(currentUser);
        setLoading(false);
        return;
      }

      // ดูโปรไฟล์คนอื่น
      const userFromDB = await getUserByEmail(email);
      setProfileUser(userFromDB || null);

      setLoading(false);
    };

    loadUserData();
  }, [email, currentUser]);

  if (loading) return <p style={{ padding: "2rem" }}>กำลังโหลดข้อมูล...</p>;
  if (!profileUser) return <p style={{ padding: "2rem" }}>ไม่พบบัญชีผู้ใช้นี้</p>;

  const isOwner = currentUser?.email === profileUser.email;

  const myPosts = posts.filter((p) => p.userId === profileUser.email);
  const userProperties = properties.filter(
    (p) => p.ownerEmail === profileUser.email
  );

  const handleSave = (updatedUser, mode) => {
    updateUser(updatedUser, mode);
  };

  return (
    <div className={styles.profilePage}>
      {/* Cover */}
      <div
        className={styles.coverPhoto}
        style={{ backgroundImage: `url(${profileUser.cover})` }}
      />

      <div className={styles.profileLayout}>

        {/* Left Column */}
        <div className={styles.leftColumn}>
          <ContactSidebar user={profileUser} />
          <UserReviews user={profileUser} />
          <UserListings properties={userProperties} />
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          <div className={styles.profileCard}>
            <div className={styles.avatarContainer}>
              <img src={profileUser.avatar} className={styles.avatar} />
            </div>

            <h2>{profileUser.username}</h2>

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

          {/* Posts */}
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

      {/* Edit Profile Modal */}
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
