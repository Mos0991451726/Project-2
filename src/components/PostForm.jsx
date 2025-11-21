import React, { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/PostForm.module.css";

function PostForm({ onPost }) {
  const { isLoggedIn, user } = useAuth();
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const storedUser = JSON.parse(localStorage.getItem("user")) || {
    name: user?.name || "คุณผู้ใช้",
    avatar: "/assets/default-avatar.png",
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim() === "" && !image) return;

    const postUser = {
      name: storedUser.name,
      avatar: storedUser.avatar,
    };

    onPost(content, image, postUser);

    setContent("");
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!isLoggedIn) {
    return (
      <div className={`${styles.postForm} ${styles.locked}`}>
        <h3>🔒 กรุณาเข้าสู่ระบบก่อนโพสต์</h3>
        <p>คุณต้องเข้าสู่ระบบเพื่อแชร์ความคิดเห็นหรือรูปภาพในคอมมูนิตี้</p>
      </div>
    );
  }

  return (
    <form className={styles.postForm} onSubmit={handleSubmit}>
      <h3>👋 สวัสดี, {storedUser.name || user?.name || "ผู้ใช้งาน"}!</h3>

      <textarea
        placeholder="คุณกำลังคิดอะไรอยู่?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className={styles.textarea}
      />

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        className={styles.fileInput}
      />

      {image && (
        <div className={styles.previewContainer}>
          <img src={image} alt="Preview" className={styles.preview} />
          <button
            type="button"
            className={styles.removeImage}
            onClick={() => {
              setImage(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
          >
            ❌ ลบรูป
          </button>
        </div>
      )}

      <button type="submit" className={styles.submitBtn}>
        โพสต์
      </button>
    </form>
  );
}

export default PostForm;
