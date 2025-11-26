import { useEffect, useState } from "react";
import styles from "../styles/Post.module.css";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostContext";
import { useNavigate } from "react-router-dom";
import ReportModal from "./ReportModal";
import { getUserByEmail } from "../utils/userDB";
import Swal from "sweetalert2";

// 🕓 ฟังก์ชันแปลงเวลา
function timeAgo(timestamp) {
  const now = new Date();
  const diff = Math.floor((now - new Date(timestamp)) / 1000);

  if (diff < 60) return `${diff} วินาทีที่แล้ว`;
  if (diff < 3600) return `${Math.floor(diff / 60)} นาทีที่แล้ว`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ชั่วโมงที่แล้ว`;

  return new Date(timestamp).toLocaleString("th-TH");
}

function Post({ post, checkLogin: parentCheck }) {
  const { user, isLoggedIn } = useAuth();
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

  // ⭐ โหลด owner จาก IndexedDB
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

  /* -----------------------------------------------------------
      ⭐ เพิ่มใหม่: เช็คล็อกอิน (ใช้ได้ทุก action)
  ----------------------------------------------------------- */
  const checkLogin = async () => {
    if (isLoggedIn) return true;

    await Swal.fire({
      icon: "warning",
      title: "กรุณาเข้าสู่ระบบก่อน",
      text: "ต้องเข้าสู่ระบบเพื่อทำรายการนี้",
      confirmButtonText: "เข้าสู่ระบบ",
    });

    localStorage.setItem("redirectAfterLogin", "/community");
    navigate("/login");

    return false;
  };

  /* -----------------------------------------------------------
      ส่งคอมเมนต์
  ----------------------------------------------------------- */
  const handleComment = async (e) => {
    e.preventDefault();

    if (!(await checkLogin())) return;

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

  /* -----------------------------------------------------------
      ส่งตอบกลับ
  ----------------------------------------------------------- */
  const handleReply = async (index) => {
    if (!(await checkLogin())) return;

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

  /* -----------------------------------------------------------
      แก้ไขโพสต์
  ----------------------------------------------------------- */
  const handleEdit = async () => {
    if (!(await checkLogin())) return;

    const { value: newText } = await Swal.fire({
      title: "แก้ไขโพสต์",
      input: "text",
      inputValue: post.content,
      confirmButtonText: "บันทึก",
      cancelButtonText: "ยกเลิก",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return "กรุณากรอกข้อความใหม่";
      }
    });

    if (newText) {
      editPost(post.id, newText);

      Swal.fire({
        icon: "success",
        title: "แก้ไขสำเร็จ!",
        timer: 1200,
        showConfirmButton: false,
      });
    }
  };

  /* -----------------------------------------------------------
      ลบโพสต์
  ----------------------------------------------------------- */
  const handleDelete = async () => {
    if (!(await checkLogin())) return;

    const result = await Swal.fire({
      title: "ลบโพสต์นี้?",
      text: "ไม่สามารถกู้คืนได้หลังจากลบแล้ว!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบโพสต์",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#e63946",
    });

    if (result.isConfirmed) {
      deletePost(post.id);

      Swal.fire({
        icon: "success",
        title: "ลบโพสต์สำเร็จ!",
        timer: 1200,
        showConfirmButton: false,
      });
    }
  };

  /* -----------------------------------------------------------
      รายงานโพสต์
  ----------------------------------------------------------- */
  const handleReport = async () => {
    if (!(await checkLogin())) return;

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
  };

  return (
    <>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <img
            src={owner.avatar}
            className={styles.avatar}
            onClick={() => navigate(`/profile/${owner.email}`)}
            alt="avatar"
            style={{ cursor: "pointer" }}
          />

          <div className={styles.ownerInfo}>
            <strong
              onClick={() => navigate(`/profile/${owner.email}`)}
              style={{ cursor: "pointer" }}
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
                {user && user.email === post.userId ? (
                  <>
                    <button className={styles.menuItem} onClick={handleEdit}>
                      ✏️ แก้ไขโพสต์
                    </button>
                    <button className={styles.menuItemDelete} onClick={handleDelete}>
                      🗑 ลบโพสต์
                    </button>
                  </>
                ) : (
                  <button className={styles.menuItem} onClick={handleReport}>
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
          {imageURL && <img src={imageURL} className={styles.image} alt="" />}
        </div>

        {/* ปุ่มต่างๆ */}
        <div className={styles.actions}>
          <button
            className={`${styles.likeBtn} ${
              post.likes.includes(user?.email) ? styles.liked : ""
            }`}
            onClick={async () => {
              if (!(await checkLogin())) return;
              likePost(post.id, user.email);
            }}
          >
            ❤️ ถูกใจ {post.likes.length}
          </button>

          <button
            className={styles.commentToggleBtn}
            onClick={async () => {
              if (!(await checkLogin())) return;
              setShowCommentBox((prev) => !prev);
            }}
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

                <button
                  className={styles.replyBtn}
                  onClick={async () => {
                    if (!(await checkLogin())) return;
                    setReplyIndex(replyIndex === i ? null : i);
                  }}
                >
                  ↩️ ตอบกลับ
                </button>

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
                {c.replies?.length > 0 && (
                  <div className={styles.replyList}>
                    {c.replies.map((r, idx) => (
                      <div key={idx} className={styles.replyItem}>
                        <img src={r.avatar} className={styles.replyAvatar} alt="" />
                        <div>
                          <strong>{r.userName}</strong> {r.text}
                          <div className={styles.commentTime}>{timeAgo(r.time)}</div>
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
