import React, { createContext, useContext, useState } from "react";
import { mockPosts } from "../data/mockPosts";

const PostContext = createContext();
export const usePosts = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState(mockPosts);

// ✅ เพิ่มโพสต์ใหม่
const addPost = (content, image, userData = { name: "คุณผู้ใช้", avatar: "/assets/default-avatar.png" }) => {
  const newPost = {
    id: Date.now(),
    user: userData.name,
    avatar: userData.avatar,
    content,
    image,
    likes: 0,
    liked: false,
    comments: [],
    time: new Date().toISOString(),
  };

  // ✅ ใช้ callback form เพื่อให้แน่ใจว่า React ใช้ state ล่าสุดเสมอ
  setPosts((prev) => [newPost, ...prev]);
};

  // ✅ ลบโพสต์
  const deletePost = (id) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  // ✅ ถูกใจ / เลิกถูกใจ
  const toggleLike = (id) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
            ...p,
            liked: !p.liked,
            likes: p.liked ? p.likes - 1 : p.likes + 1,
          }
          : p
      )
    );
  };

  // ✅ เพิ่มคอมเมนต์
  const addComment = (id, user, text) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, comments: [...p.comments, { user, text }] }
          : p
      )
    );
  };

  return (
    <PostContext.Provider
      value={{ posts, addPost, deletePost, toggleLike, addComment }}
    >
      {children}
    </PostContext.Provider>
  );
};
