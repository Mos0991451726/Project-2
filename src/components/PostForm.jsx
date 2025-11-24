import React, { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostContext";
import styles from "../styles/PostForm.module.css";

function PostForm() {
  const { user } = useAuth();
  const { addPost } = usePosts();

  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  if (!user) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() && !image) return;

    // ⭐ ส่งเข้า addPost แบบที่ PostContext รองรับ
    addPost(content, image);

    setContent("");
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3 className={styles.welcome}>👋 สวัสดี, {user.username}!</h3>

      <textarea
        className={styles.textarea}
        placeholder="คุณกำลังคิดอะไรอยู่?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        className={styles.fileInput}
      />

      {image && (
        <div className={styles.previewWrapper}>
          <img src={image} alt="preview" className={styles.preview} />
          <button
            type="button"
            className={styles.removeBtn}
            onClick={() => {
              setImage(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
          >
            ❌ ลบรูป
          </button>
        </div>
      )}

      <button type="submit" className={styles.postBtn}>โพสต์</button>
    </form>
  );
}

export default PostForm;
