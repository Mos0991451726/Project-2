import React, { useState } from "react";
import styles from "../styles/Profile.module.css";

function EditProfileModal({ user, onClose, onSave }) {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || "");
  const [avatar, setAvatar] = useState(user.avatar);
  const [cover, setCover] = useState(user.cover);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setCover(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave({ ...user, name, bio, avatar, cover });
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.editModal}>
        <h2>แก้ไขโปรไฟล์</h2>

        <div className={styles.editSection}>
          <label>รูปโปรไฟล์</label>
          <div className={styles.editAvatar}>
            <img src={avatar} alt="avatar" className={styles.previewAvatar} />
            <label className={styles.editBtnMini}>
              แก้ไข
              <input type="file" accept="image/*" onChange={handleAvatarChange} />
            </label>
          </div>
        </div>

        <div className={styles.editSection}>
          <label>รูปภาพหน้าปก</label>
          <div className={styles.editCover}>
            <img src={cover} alt="cover" className={styles.previewCover} />
            <label className={styles.editBtnMini}>
              แก้ไข
              <input type="file" accept="image/*" onChange={handleCoverChange} />
            </label>
          </div>
        </div>

        <div className={styles.editSection}>
          <label>ชื่อเล่น</label>
          <input
            type="text"
            value={name}
            className={styles.inputBox}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.editSection}>
          <label>คำอธิบายตัวเอง</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="แนะนำตัวเองหน่อยสิ..."
            className={styles.textareaBox}
          ></textarea>
        </div>

        <div className={styles.editSection}>
          <label>วันที่สมัครสมาชิก</label>
          <p className={styles.joinDate}>{user.joinDate}</p>
        </div>

        <div className={styles.editActions}>
          <button className={styles.saveBtn} onClick={handleSave}>
            💾 บันทึก
          </button>
          <button className={styles.cancelBtn} onClick={onClose}>
            ❌ ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfileModal;
