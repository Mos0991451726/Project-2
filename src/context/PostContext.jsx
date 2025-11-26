import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { openDB, getAllPosts, addPostDB, updatePostDB, deletePostDB } from "../utils/db";
import { addReportDB } from "../utils/db";
import { getUserByEmail } from "../utils/userDB";

const PostContext = createContext();
export const usePosts = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);

  /* ----------------------------------------
    🟦 โหลดโพสต์จาก IndexedDB
  ---------------------------------------- */
  useEffect(() => {
    getAllPosts().then((data) => {
      setPosts(data);
    });
  }, []);

  /* ----------------------------------------
    🟩 เพิ่มโพสต์
  ---------------------------------------- */
  const addPost = async (content, imageBlob) => {
    if (!user) return;

    const newPost = {
      userId: user.email,
      userName: user.username,
      avatar: user.avatar ?? "/assets/default-avatar.png",
      content,
      image: imageBlob || null,
      time: new Date().toISOString(),
      comments: [],
      likes: [],
      hidden: false,
    };

    // ⭐ บันทึกลง IndexedDB
    const id = await addPostDB(newPost);

    // ⭐ อัปเดต state
    setPosts((prev) => [...prev, { ...newPost, id }]);
  };

  /* ----------------------------------------
    🟥 ลบโพสต์
  ---------------------------------------- */
  const deletePost = async (postId) => {
    await deletePostDB(postId);
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  /* ----------------------------------------
    🟨 แก้ไขโพสต์
  ---------------------------------------- */
  const editPost = async (postId, newText) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const updated = { ...p, content: newText };
        updatePostDB(updated);
        return updated;
      })
    );
  };

  /* ----------------------------------------
    🟦 ไลก์
  ---------------------------------------- */
  const likePost = async (postId, email) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;

        const likes = Array.isArray(p.likes) ? p.likes : [];
        const updated = {
          ...p,
          likes: likes.includes(email)
            ? likes.filter((u) => u !== email)
            : [...likes, email],
        };

        updatePostDB(updated);
        return updated;
      })
    );
  };

  /* ----------------------------------------
    🟣 คอมเมนต์
  ---------------------------------------- */
  const addComment = (postId, comment) => {
    const newComment = { ...comment, replies: [] };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const updated = { ...p, comments: [...p.comments, newComment] };
        updatePostDB(updated);
        return updated;
      })
    );
  };

  /* ----------------------------------------
    🔵 ตอบกลับคอมเมนต์
  ---------------------------------------- */
  const addReply = (postId, idx, replyData) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;

        const comments = [...p.comments];
        comments[idx].replies = [...comments[idx].replies, replyData];

        const updated = { ...p, comments };
        updatePostDB(updated);
        return updated;
      })
    );
  };

  const reportPost = async (post, reporterEmail, reason) => {
    // ⭐ สร้าง UUID ปลอดภัย ไม่ซ้ำ
    const reportId = crypto.randomUUID();

    // ⭐ โหลดข้อมูลล่าสุดของเจ้าของโพสต์
    const postOwner = await getUserByEmail(post.userId);

    // ⭐ โหลดข้อมูลล่าสุดของผู้รายงาน
    const reporter = await getUserByEmail(reporterEmail);

    const reportData = {
      id: reportId,
      postId: post.id,
      postContent: post.content,
      postImage: post.image || null,

      // ⭐ เจ้าของโพสต์ (snapshot ล่าสุด)
      postOwner: {
        email: postOwner?.email || post.userId,
        username: postOwner?.username || post.userName,
        avatar: postOwner?.avatar || post.avatar,
      },

      // ⭐ ผู้รายงาน (snapshot ล่าสุด)
      reporter: {
        email: reporter?.email || reporterEmail,
        username: reporter?.username || "unknown",
        avatar: reporter?.avatar || "/assets/default-avatar.png",
      },

      reason,
      time: new Date().toISOString(),
    };

    await addReportDB(reportData);

    alert("📨 รายงานถูกส่งถึงแอดมินแล้ว!");
  };

  const toggleHidePost = async (postId) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        const updated = { ...p, hidden: !p.hidden };
        updatePostDB(updated);
        return updated;
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
        addReply,
        reportPost,
        toggleHidePost
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
