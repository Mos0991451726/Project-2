import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const PostContext = createContext();
export const usePosts = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);

  // โหลดโพสต์จาก localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("posts") || "[]");

    // ล้างโพสต์ที่มีรูปแบบผิด
    const valid = saved.filter((p) => typeof p.content === "string");

    if (valid.length !== saved.length) {
      console.warn("⚠️ พบโพสต์ format เก่า — ล้างข้อมูลที่ผิด");
      localStorage.setItem("posts", JSON.stringify(valid));
    }

    setPosts(valid);
  }, []);

  // อัปเดต localStorage ทุกครั้งที่ posts เปลี่ยน
useEffect(() => {
  const safePosts = posts.map(p => ({
    ...p,
    image: typeof p.image === "string" && p.image.length < 500000 
      ? p.image 
      : null, // ถ้าใหญ่มาก ไม่เก็บลง localStorage
  }));

  localStorage.setItem("posts", JSON.stringify(safePosts));
}, [posts]);

  // ⭐ เพิ่มโพสต์ใหม่
  const addPost = (content, image) => {
    if (!user) return;

    const newPost = {
      id: Date.now(),
      userId: user.email,
      userName: user.username,
      avatar: user.avatar ?? "/assets/default-avatar.png",
      content,
      image,
      time: new Date().toISOString(),
      comments: [],
      likes: [], // ⭐ array เท่านั้น
    };

    setPosts((prev) => [...prev, newPost]);
  };

  // ⭐ ลบโพสต์
  const deletePost = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  // ⭐ แก้ไขโพสต์
  const editPost = (postId, newText) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, content: newText } : p
      )
    );
  };

  // ⭐ ไลก์ / ยกเลิกไลก์
  const likePost = (postId, userEmail) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;

        const current = Array.isArray(p.likes) ? p.likes : [];

        if (current.includes(userEmail)) {
          return { ...p, likes: current.filter((x) => x !== userEmail) };
        }

        return { ...p, likes: [...current, userEmail] };
      })
    );
  };

  // ⭐ เพิ่มคอมเมนต์ (comment)
  const addComment = (postId, comment) => {
    const newComment = { ...comment, replies: [] };

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, comments: [...p.comments, newComment] }
          : p
      )
    );
  };

  // ⭐ ตอบกลับคอมเมนต์ (reply)
  const addReply = (postId, commentIndex, replyData) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;

        const updatedComments = [...p.comments];
        const target = updatedComments[commentIndex];

        if (!target.replies) target.replies = [];

        target.replies = [...target.replies, replyData];

        return { ...p, comments: updatedComments };
      })
    );
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        addPost,
        deletePost,
        editPost,
        likePost,
        addComment,
        addReply,   // ⭐ สำคัญมาก!!
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
