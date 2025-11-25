// EditProfileModal.jsx
import React, { useState, useRef } from "react";
import styles from "../styles/Profile.module.css";

function EditProfileModal({ user, onClose, onSave }) {
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || "");
  const [avatar, setAvatar] = useState(user.avatar);
  const [cover, setCover] = useState(user.cover);

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const uploadFile = (e, setter) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setter(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSave({
      ...user,
      username,
      bio,
      avatar,
      cover,
    });
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.editModal}>
        <h2>แก้ไขโปรไฟล์</h2>

        <div className={styles.editSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.titleLeft}>รูปโปรไฟล์</span>

            {/* ปุ่มแก้ไข เปิด input file */}
            <button
              className={styles.editLinkBtn}
              onClick={() => avatarInputRef.current.click()}
            >
              แก้ไข
            </button>
          </div>

          <img src={avatar} className={styles.previewAvatar} />

          {/* input file หลัก (ซ่อน) */}
          <input
            type="file"
            ref={avatarInputRef}
            className={styles.hiddenInput}
            accept="image/*"
            onChange={(e) => uploadFile(e, setAvatar)}
          />
        </div>


        <div className={styles.editSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.titleLeft}>รูปหน้าปก</span>

            <button
              className={styles.editLinkBtn}
              onClick={() => coverInputRef.current.click()}
            >
              แก้ไข
            </button>
          </div>

          <img src={cover} className={styles.previewCover} />

          <input
            type="file"
            ref={coverInputRef}
            className={styles.hiddenInput}
            accept="image/*"
            onChange={(e) => uploadFile(e, setCover)}
          />
        </div>


        <div className={styles.editSection}>
          <label>ชื่อผู้ใช้</label>
          <input
            type="text"
            className={styles.inputBox}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className={styles.editSection}>
          <label>คำอธิบายตัวเอง</label>
          <textarea
            className={styles.textareaBox}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <div className={styles.editActions}>
          <button onClick={handleSave} className={styles.saveBtn}>
            💾 บันทึก
          </button>
          <button onClick={onClose} className={styles.cancelBtn}>
            ❌ ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfileModal;
