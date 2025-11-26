import React, { useState, useRef } from "react";
import styles from "../styles/Profile.module.css";
import Swal from "sweetalert2";

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

  /* ---------------------------------------------------------
      ⭐ เปลี่ยนรหัสผ่าน
  ---------------------------------------------------------- */
  const handleChangePassword = async () => {
    const result = await Swal.fire({
      title: "ตั้งรหัสผ่านใหม่",
      html: `
        <input id="newpass" type="password" class="swal2-input" placeholder="รหัสผ่านใหม่">
        <input id="confirmpass" type="password" class="swal2-input" placeholder="ยืนยันรหัสผ่าน">
      `,
      confirmButtonText: "บันทึกรหัสผ่าน",
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
      preConfirm: () => {
        const pass = document.getElementById("newpass").value;
        const confirm = document.getElementById("confirmpass").value;

        if (!pass || !confirm) {
          Swal.showValidationMessage("กรุณากรอกรหัสผ่านให้ครบ");
          return false;
        }

        if (pass !== confirm) {
          Swal.showValidationMessage("รหัสผ่านไม่ตรงกัน!");
          return false;
        }

        return pass;
      },
    });

    if (!result.isConfirmed) return;

    onSave(
      {
        ...user,
        password: result.value,
      },
      "password"
    );

    Swal.fire({
      icon: "success",
      title: "เปลี่ยนรหัสผ่านสำเร็จ!",
      timer: 1200,
      showConfirmButton: false,
    });
  };

  /* ---------------------------------------------------------
      ⭐ บันทึกข้อมูลโปรไฟล์
  ---------------------------------------------------------- */
  const handleSave = () => {
    if (!username.trim()) {
      Swal.fire({
        icon: "warning",
        title: "ชื่อผู้ใช้ห้ามเว้นว่าง!",
        text: "กรุณากรอกชื่อผู้ใช้ก่อนบันทึก",
      });
      return;
    }

    onSave(
      {
        ...user,
        username,
        bio,
        avatar,
        cover,
      },
      "profile"
    );

    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.editModal}>
        <h2>แก้ไขโปรไฟล์</h2>

        {/* ==================== รูปโปรไฟล์ ==================== */}
        <div className={styles.editSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.titleLeft}>รูปโปรไฟล์</span>
            <button
              className={styles.editLinkBtn}
              onClick={() => avatarInputRef.current.click()}
            >
              แก้ไข
            </button>
          </div>

          <img src={avatar} className={styles.previewAvatar} />

          <input
            type="file"
            ref={avatarInputRef}
            className={styles.hiddenInput}
            accept="image/*"
            onChange={(e) => uploadFile(e, setAvatar)}
          />
        </div>

        {/* ==================== รูปหน้าปก ==================== */}
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

        {/* ==================== ชื่อผู้ใช้ / Bio ==================== */}
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

        {/* ==================== ปุ่มตั้งรหัสผ่านใหม่ ==================== */}
        <div className={styles.editSection}>
          <button className={styles.passwordBtn} onClick={handleChangePassword}>
            🔐 ตั้งรหัสผ่านใหม่
          </button>
        </div>

        {/* ==================== ปุ่มบันทึก / ยกเลิก ==================== */}
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
