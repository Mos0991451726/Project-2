import React from "react";
import { usePosts } from "../context/PostContext";
import { useAuth } from "../context/AuthContext";

import PostForm from "../components/PostForm";
import Post from "../components/Post";

import styles from "../styles/Community.module.css";

function Community() {
  const { posts } = usePosts();
  const { user } = useAuth();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🗣️ คอมมูนิตี้อสังหาริมทรัพย์</h1>
      <p className={styles.subtitle}>
        แชร์โพสต์ รูปภาพ และความคิดเห็นเกี่ยวกับอสังหาได้ที่นี่
      </p>

      {/* ฟอร์มโพสต์ — ใช้ข้อมูลผู้ใช้คนปัจจุบัน */}
      <PostForm />

      {/* รายการโพสต์ทั้งหมด (ทุกผู้ใช้) */}
      {posts.length === 0 ? (
        <p className={styles.noPosts}>ยังไม่มีโพสต์ในขณะนี้</p>
      ) : (
        posts
          .sort((a, b) => new Date(b.time) - new Date(a.time)) // new → top
          .map((p) => <Post key={p.id} post={p} />)
      )}
    </div>
  );
}

export default Community;
