import { useEffect, useState } from "react";
import styles from "../styles/Post.module.css";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostContext";
import { useNavigate } from "react-router-dom";
import ReportModal from "./ReportModal";
import { getUserByEmail } from "../utils/userDB";

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
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);

  const [commentText, setCommentText] = useState("");
  const [replyIndex, setReplyIndex] = useState(null);
  const [replyText, setReplyText] = useState("");

  // ⭐ owner state ใหม่ (รองรับ IndexedDB)
  const [owner, setOwner] = useState({
    username: "ผู้ใช้ไม่พบ",
    avatar: "/assets/default-avatar.png",
    email: "none",
  });

  if (!user) return null;

  // ⭐ โหลดข้อมูล owner จาก IndexedDB
  useEffect(() => {
    const loadOwner = async () => {
      const found = await getUserByEmail(post.userId);
      if (found) setOwner(found);
    };
    loadOwner();
  }, [post.userId]);

  // ⭐ แปลงภาพจาก Blob → URL
  let imageURL = null;
  if (post.image instanceof Blob) {
    imageURL = URL.createObjectURL(post.image);
  } else if (typeof post.image === "string") {
    imageURL = post.image;
  }

  // ✏ ส่งคอมเมนต์
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

  // ↩ ส่งตอบกลับ
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
    <>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <img
            src={owner.avatar}
            className={styles.avatar}
            alt="avatar"
            onClick={() => navigate(`/profile/${owner.email}`)}
            style={{ cursor: "pointer" }}
          />

          <div className={styles.ownerInfo}>
            <strong
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/profile/${owner.email}`)}
            >
              {owner.username}
            </strong>

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
                {/* เจ้าของโพสต์ */}
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

                {/* ผู้ใช้คนอื่น */}
                {user.email !== post.userId && (
                  <button
                    className={styles.menuItem}
                    onClick={() => {
                      setReportTarget({
                        postId: post.id,
                        postContent: post.content,
                        postImage: imageURL || null,

                        postOwner: {
                          email: owner.email,
                          username: owner.username,
                          avatar: owner.avatar,
                        },

                        reporter: {
                          email: user.email,
                          username: user.username,
                          avatar: user.avatar,
                        },

                        time: new Date().toISOString(),
                      });

                      setShowReportModal(true);
                      setShowMenu(false);
                    }}
                  >
                    🚨 รายงานโพสต์
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* เนื้อหาโพสต์ */}
        <div className={styles.content}>
          {post.content && <p className={styles.text}>{post.content}</p>}

          {imageURL && (
            <img src={imageURL} alt="โพสต์" className={styles.image} />
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
                  onClick={() =>
                    setReplyIndex(replyIndex === i ? null : i)
                  }
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

      {/* ⭐ Modal รายงานโพสต์ */}
      {showReportModal && reportTarget && (
        <ReportModal
          post={reportTarget}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </>
  );
}

export default Post;
