import React from "react";
import styles from "../styles/PostPopup.module.css";

function PostPopup({ post, onClose }) {
    if (!post) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>

                <button className={styles.closeBtn} onClick={onClose}>✖</button>

                <h2 className={styles.title}>📌 โพสต์ต้นฉบับ</h2>

                <div className={styles.header}>
                    <img src={post.owner.avatar} className={styles.avatar} />
                    <div>
                        <strong>{post.owner.username}</strong>
                        <div className={styles.time}>
                            {new Date(post.time).toLocaleString("th-TH")}
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
