import React, { useState } from "react";
import styles from "../styles/Post.module.css";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostContext";

// 🕓 ฟังก์ชันแปลงเวลา
function timeAgo(timestamp) {
  const now = new Date();
  const diff = Math.floor((now - new Date(timestamp)) / 1000);

  if (diff < 60) return `${diff} วินาทีที่แล้ว`;
  if (diff < 3600) return `${Math.floor(diff / 60)} นาทีที่แล้ว`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ชั่วโมงที่แล้ว`;

  return new Date(timestamp).toLocaleString("th-TH");
}

function Post({ post }) {
  const { user } = useAuth();
  const { deletePost, editPost, likePost, addComment, addReply } = usePosts();

  const [showMenu, setShowMenu] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [replyIndex, setReplyIndex] = useState(null);
  const [replyText, setReplyText] = useState("");

  // โหลดข้อมูล user ทั้งหมดจาก localStorage
  const allUsersObj = JSON.parse(localStorage.getItem("users")) || {};
  const allUsers = Object.values(allUsersObj);

  const owner =
    allUsers.find((u) => u.email === post.userId) || {
      username: "ผู้ใช้ไม่พบ",
      avatar: "/assets/default-avatar.png",
    };

  // ➤ ฟังก์ชันส่งคอมเมนต์
  const handleComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addComment(post.id, {
      userId: user.email,
      userName: user.username,
      avatar: user.avatar || "/assets/default-avatar.png",
      text: commentText,
      time: new Date().toISOString(),
    });

    setCommentText("");
  };

  // ➤ ฟังก์ชันส่ง reply (ตอบกลับ)
  const handleReply = (index) => {
    if (!replyText.trim()) return;

    addReply(post.id, index, {
      userId: user.email,
      userName: user.username,
      avatar: user.avatar || "/assets/default-avatar.png",
      text: replyText,
      time: new Date().toISOString(),
    });

    setReplyText("");
    setReplyIndex(null);
  };

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <img src={owner.avatar} className={styles.avatar} alt="avatar" />

        <div className={styles.ownerInfo}>
          <strong>{owner.username}</strong>
          <div className={styles.time}>{timeAgo(post.time)}</div>
        </div>

        {/* ⋯ เมนู */}
        <div className={styles.menuWrapper}>
          <button
            className={styles.menuBtn}
            onClick={() => setShowMenu((prev) => !prev)}
          >
            ⋯
          </button>

          {showMenu && (
            <div className={styles.menuList}>
              {user.email === post.userId && (
                <>
                  <button
                    className={styles.menuItem}
                    onClick={() => {
                      const newText = prompt("แก้ไขโพสต์:", post.content);
                      if (newText !== null) editPost(post.id, newText);
                      setShowMenu(false);
                    }}
                  >
                    ✏️ แก้ไขโพสต์
                  </button>

                  <button
                    className={styles.menuItemDelete}
                    onClick={() => {
                      if (confirm("ต้องการลบโพสต์นี้?")) deletePost(post.id);
                      setShowMenu(false);
                    }}
                  >
                    🗑 ลบโพสต์
                  </button>
                </>
              )}

              <button
                className={styles.menuItem}
                onClick={() => {
                  alert("📣 รายงานโพสต์เรียบร้อย");
                  setShowMenu(false);
                }}
              >
                🚨 รายงานโพสต์
              </button>
            </div>
          )}
        </div>
      </div>

      {/* เนื้อหาโพสต์ */}
      <div className={styles.content}>
        {post.content && <p className={styles.text}>{post.content}</p>}

        {post.image && (
          <img src={post.image} alt="โพสต์" className={styles.image} />
        )}
      </div>

      {/* ปุ่ม Like / Comment */}
      <div className={styles.actions}>
        <button
          className={`${styles.likeBtn} ${
            post.likes.includes(user.email) ? styles.liked : ""
          }`}
          onClick={() => likePost(post.id, user.email)}
        >
          ❤️ ถูกใจ {post.likes.length}
        </button>

        <button
          className={styles.commentToggleBtn}
          onClick={() => setShowCommentBox((prev) => !prev)}
        >
          💬 แสดงความคิดเห็น
        </button>
      </div>

      {/* กล่องคอมเมนต์ */}
      {showCommentBox && (
        <form className={styles.commentForm} onSubmit={handleComment}>
          <input
            type="text"
            placeholder="แสดงความคิดเห็น..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button type="submit">ส่ง</button>
        </form>
      )}

      {/* รายการคอมเมนต์ */}
      <div className={styles.commentList}>
        {post.comments.map((c, i) => (
          <div key={i} className={styles.commentItem}>
            <img src={c.avatar} className={styles.commentAvatar} alt="" />

            <div>
              <strong>{c.userName}</strong> {c.text}
              <div className={styles.commentTime}>{timeAgo(c.time)}</div>

              {/* ปุ่มตอบกลับ */}
              <button
                className={styles.replyBtn}
                onClick={() => setReplyIndex(replyIndex === i ? null : i)}
              >
                ↩️ ตอบกลับ
              </button>

              {/* กล่องตอบกลับ */}
              {replyIndex === i && (
                <div className={styles.replyForm}>
                  <input
                    type="text"
                    placeholder="พิมพ์คำตอบ..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <button onClick={() => handleReply(i)}>ส่ง</button>
                </div>
              )}

              {/* Reply list */}
              {c.replies && c.replies.length > 0 && (
                <div className={styles.replyList}>
                  {c.replies.map((r, idx) => (
                    <div key={idx} className={styles.replyItem}>
                      <img
                        src={r.avatar}
                        className={styles.replyAvatar}
                        alt=""
                      />
                      <div>
                        <strong>{r.userName}</strong> {r.text}
                        <div className={styles.commentTime}>
                          {timeAgo(r.time)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Post;
