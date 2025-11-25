import React from "react";
import styles from "../styles/PostPopup.module.css";

function PostPopup({ post, onClose }) {
    if (!post) return null;

    // ⭐ fallback ป้องกัน error ถ้าข้อมูล owner ขาด
    const owner = post.owner || {};
    const avatar = owner.avatar || "/assets/default-avatar.png";
    const username = owner.username || "ไม่พบชื่อผู้ใช้";

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>

                <button className={styles.closeBtn} onClick={onClose}>✖</button>

                <h2 className={styles.title}>📌 โพสต์ต้นฉบับ</h2>

                <div className={styles.header}>
                    <img
                        src={avatar}
                        className={styles.avatar}
                        alt="owner"
                    />
                    <div>
                        <strong>{username}</strong>
                        <div className={styles.time}>
                            {post.time ? new Date(post.time).toLocaleString("th-TH") : "ไม่พบเวลา"}
                        </div>
                    </div>
                </div>

                <p className={styles.content}>{post.content}</p>

                {post.image && (
                    <img src={post.image} alt="post" className={styles.postImage} />
                )}
            </div>
        </div>
    );
}

export default PostPopup;
