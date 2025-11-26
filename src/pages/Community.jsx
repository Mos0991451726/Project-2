import React from "react";
import { usePosts } from "../context/PostContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import PostForm from "../components/PostForm";
import Post from "../components/Post";

import styles from "../styles/Community.module.css";
import Swal from "sweetalert2";

function Community() {
  const { posts } = usePosts();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // ⭐ แสดงโพสต์เฉพาะที่ไม่ถูกปิดกั้น
  const visiblePosts = posts.filter((p) => !p.hidden);

  /* --------------------------------------------------
     ⭐ ฟังก์ชันตรวจสอบว่า login หรือยัง
  -------------------------------------------------- */
  const checkLogin = async () => {
    if (!isLoggedIn) {
      await Swal.fire({
        icon: "warning",
        title: "กรุณาเข้าสู่ระบบก่อน",
        text: "ต้องเข้าสู่ระบบเพื่อใช้งานฟีเจอร์นี้นะครับ",
        confirmButtonText: "เข้าสู่ระบบ",
      });

      // ⭐ เก็บ path ปัจจุบันไว้ เผื่อกลับมาหน้าเดิม
      localStorage.setItem("redirectAfterLogin", "/community");

      navigate("/login");
      return false;
    }
    return true;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🗣️ คอมมูนิตี้อสังหาริมทรัพย์</h1>
      <p className={styles.subtitle}>
        แชร์โพสต์ รูปภาพ และความคิดเห็นเกี่ยวกับอสังหาได้ที่นี่
      </p>

      {/* ⭐ แสดงฟอร์มโพสต์เฉพาะผู้ที่ล็อกอินแล้ว */}
      {isLoggedIn ? (
        <PostForm />
      ) : (
        <button
          className={styles.loginToPost}
          onClick={async () => {
            await checkLogin();
          }}
        >
          🔐 เข้าสู่ระบบเพื่อโพสต์หรือแสดงความคิดเห็น
        </button>
      )}

      {/* ⭐ แสดงเฉพาะ visiblePosts */}
      {visiblePosts.length === 0 ? (
        <p className={styles.noPosts}>ยังไม่มีโพสต์ในขณะนี้</p>
      ) : (
        visiblePosts
          .sort((a, b) => new Date(b.time) - new Date(a.time))
          .map((p) => (
            <Post
              key={p.id}
              post={p}
              checkLogin={checkLogin} // ⭐ ส่งต่อไปให้ Post ใช้ด้วย
            />
          ))
      )}
    </div>
  );
}

export default Community;
