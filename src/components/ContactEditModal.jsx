import React, { useState } from "react";
import styles from "../styles/Profile.module.css";

function ContactEditModal({ user, onClose, onSave }) {
  const [phone, setPhone] = useState(user.phone || "");
  const [address, setAddress] = useState(user.address || "");
  const [facebook, setFacebook] = useState(user.facebook || "");
  const [instagram, setInstagram] = useState(user.instagram || "");
  const [line, setLine] = useState(user.line || "");

  const handleSave = () => {
    onSave({
      ...user,
      phone,
      address,
      facebook,
      instagram,
      line
    });

    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.editModal}>

        <h2>แก้ไขช่องทางการติดต่อ</h2>

        <div className={styles.editSection}>
          <label>เบอร์โทร</label>
          <input
            type="text"
            className={styles.inputBox}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className={styles.editSection}>
          <label>ที่อยู่</label>
          <input
            type="text"
            className={styles.inputBox}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className={styles.editSection}>
          <label>Facebook</label>
          <input
            type="text"
            className={styles.inputBox}
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
          />
        </div>

        <div className={styles.editSection}>
          <label>Instagram</label>
          <input
            type="text"
            className={styles.inputBox}
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
          />
        </div>

        <div className={styles.editSection}>
          <label>Line</label>
          <input
            type="text"
            className={styles.inputBox}
            value={line}
            onChange={(e) => setLine(e.target.value)}
          />
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

export default ContactEditModal;
