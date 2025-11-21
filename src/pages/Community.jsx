import React from "react";
import Post from "../components/Post";
import PostForm from "../components/PostForm";
import { usePosts } from "../context/PostContext";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Community.module.css";

function Community() {
  const { posts, addPost, addComment, toggleLike, deletePost } = usePosts();
  const { user } = useAuth();

  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  const handleAddPost = (content, image, postUser) => {
    const userName =
      postUser?.name || storedUser.name || user?.name || "ผู้ใช้งานทั่วไป";
    const userAvatar =
      postUser?.avatar ||
      storedUser.avatar ||
      "/assets/default-avatar.png";

    addPost(content, image, { name: userName, avatar: userAvatar });
  };

  const handleLike = (id) => toggleLike(id);

  const handleAddComment = (id, text) => {
    const userName = storedUser.name || user?.name || "ผู้เยี่ยมชม";
    addComment(id, userName, text);
  };

  const handleDeletePost = (id) => {
    if (window.confirm("คุณต้องการลบโพสต์นี้หรือไม่?")) {
      deletePost(id);
    }
  };

  return (
    <div className={styles.container}>
      <h1>🗣️ คอมมูนิตี้อสังหาริมทรัพย์</h1>
      <p className={styles.subtitle}>
        แชร์ไอเดียหรือโพสต์เกี่ยวกับอสังหาริมทรัพย์ของคุณได้ที่นี่
      </p>

      <PostForm onPost={handleAddPost} />

      {posts.length === 0 ? (
        <p>ยังไม่มีโพสต์ในขณะนี้</p>
      ) : (
        posts.map((p) => (
          <Post
            key={p.id}
            post={p}
            currentUser={storedUser.name || user?.name}
            onLike={() => handleLike(p.id)}
            onComment={(text) => handleAddComment(p.id, text)}
            onDelete={() => handleDeletePost(p.id)}
          />
        ))
      )}
    </div>
  );
}

export default Community;
