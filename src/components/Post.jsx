import React, { useState } from "react";
import styles from "../styles/Post.module.css";

// 🕓 ฟังก์ชันแสดงเวลาผ่านไป
function timeAgo(timestamp) {
  if (!timestamp) return "";
  const now = new Date();
  const diff = Math.floor((now - new Date(timestamp)) / 1000);
  if (isNaN(diff)) return "";

  if (diff < 60) return `${diff} วินาทีที่แล้ว`;
  if (diff < 3600) return `${Math.floor(diff / 60)} นาทีที่แล้ว`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ชั่วโมงที่แล้ว`;

  const date = new Date(timestamp);
  const today = new Date();
  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
    return "วันนี้";

  return date.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Post({ post, onLike, onComment, onDelete, currentUser }) {
  const [commentText, setCommentText] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(post.content || "");
  const [replyTarget, setReplyTarget] = useState(null);

  const handleComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      user: currentUser || "ผู้ใช้",
      text: commentText,
      time: new Date().toISOString(),
      replies: [],
    };

    if (replyTarget) {
      replyTarget.replies = replyTarget.replies || [];
      replyTarget.replies.push(newComment);
    } else {
      post.comments.push(newComment);
    }

    setCommentText("");
    setReplyTarget(null);
  };

  const handleEditSave = () => {
    if (editText.trim() === "") return;
    post.content = editText;
    setIsEditing(false);
    setShowMenu(false);
  };

  return (
    <div className={styles.postCard}>
      {/* Header */}
      <div className={styles.postHeader}>
        <img
          src={post.avatar || "/assets/default-avatar.png"}
          alt="user"
          className={styles.postAvatar}
        />
        <div className={styles.postInfo}>
          <strong>{post.user}</strong>
          <div className={styles.postTime}>
            {new Date(post.time).toLocaleString("th-TH", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </div>
        </div>

        {currentUser === post.user && (
          <div className={styles.postOptions}>
            <button
              className={styles.menuBtn}
              onClick={() => setShowMenu(!showMenu)}
            >
              ⋯
            </button>

            {showMenu && (
              <div className={styles.menuDropdown}>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)}>✏️ แก้ไข</button>
                )}
                <button onClick={() => onDelete(post.id)}>🗑️ ลบ</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className={styles.postContent}>
        {isEditing ? (
          <div className={styles.editMode}>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className={styles.editTextarea}
            />
            <div className={styles.editActions}>
              <button onClick={handleEditSave}>💾 บันทึก</button>
              <button onClick={() => setIsEditing(false)}>❌ ยกเลิก</button>
            </div>
          </div>
        ) : (
          <>
            {post.content && <p className={styles.postText}>{post.content}</p>}
            {post.image && (
              <img src={post.image} alt="โพสต์" className={styles.postImage} />
            )}
          </>
        )}
      </div>

      {/* Actions */}
      <div className={styles.postActions}>
        <button
          className={`${styles.likeBtn} ${post.liked ? styles.liked : ""}`}
          onClick={onLike}
        >
          ❤️ ถูกใจ {post.likes > 0 && <span>({post.likes})</span>}
        </button>
        <button className={styles.commentBtn}>💬 แสดงความคิดเห็น</button>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleComment} className={styles.commentForm}>
        <input
          type="text"
          placeholder={
            replyTarget
              ? `ตอบกลับ ${replyTarget.user}...`
              : "เขียนความคิดเห็น..."
          }
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button type="submit">ส่ง</button>
      </form>

      {/* Comment List */}
      <div className={styles.commentList}>
        {post.comments?.map((c, i) => (
          <div key={i} className={styles.commentItem}>
            <strong>{c.user}</strong> <span>{c.text}</span>
            <div className={styles.commentMeta}>
              <small>{timeAgo(c.time)}</small>
              <button
                className={styles.replyBtn}
                onClick={() => setReplyTarget(c)}
              >
                ตอบกลับ
              </button>
            </div>

            {c.replies?.length > 0 && (
              <div className={styles.replyList}>
                {c.replies.map((r, ri) => (
                  <div key={ri} className={styles.replyItem}>
                    <strong>{r.user}</strong> <span>{r.text}</span>
                    <div className={styles.commentMeta}>
                      <small>{timeAgo(r.time)}</small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Post;
