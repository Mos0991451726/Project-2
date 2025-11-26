import React, { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostContext";
import styles from "../styles/PostForm.module.css";
import Swal from "sweetalert2";

function PostForm() {
  const { user } = useAuth();
  const { addPost } = usePosts();

  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  if (!user) return null;

  // ⭐ เก็บไฟล์เป็น Blob ไม่ใช่ Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);  // <-- Blob
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!content.trim() && !image) {
      Swal.fire({
        icon: "warning",
        title: "ไม่สามารถโพสต์ได้",
        text: "กรุณาพิมพ์ข้อความหรือเลือกรูปอย่างน้อย 1 อย่าง",
      });
      return;
    }

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

      {/* ⭐ Preview Blob ด้วย URL.createObjectURL */}
      {image && (
        <div className={styles.previewWrapper}>
          <img
            src={URL.createObjectURL(image)}
            alt="preview"
            className={styles.preview}
          />
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
