import React, { useState } from "react";
import styles from "../styles/Profile.module.css";
import Swal from "sweetalert2";

function ContactEditModal({ user, onClose, onSave }) {
  const [phone, setPhone] = useState(user.phone || "");
  const [address, setAddress] = useState(user.address || "");
  const [facebook, setFacebook] = useState(user.facebook || "");
  const [instagram, setInstagram] = useState(user.instagram || "");
  const [line, setLine] = useState(user.line || "");

  const handleSave = () => {
    // ⭐ Validate เบอร์โทร: ต้องเป็นตัวเลข 0–9 เท่านั้น
    if (phone && !/^[0-9]+$/.test(phone)) {
      Swal.fire({
        icon: "error",
        title: "เบอร์โทรไม่ถูกต้อง!",
        text: "กรุณากรอกเฉพาะตัวเลข 0–9 เท่านั้น",
      });
      return;
    }

    // ⭐ จำกัดเบอร์โทรขั้นต่ำ 9 หรือ 10 ตัว (ไทย)
    if (phone && phone.length < 9) {
      Swal.fire({
        icon: "warning",
        title: "เบอร์โทรสั้นเกินไป!",
        text: "ควรมีอย่างน้อย 9–10 หลัก",
      });
      return;
    }

    onSave({
      ...user,
      phone,
      address,
      facebook,
      instagram,
      line,
    });

    Swal.fire({
      icon: "success",
      title: "บันทึกสำเร็จ!",
      timer: 1200,
      showConfirmButton: false,
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
            maxLength={10}      // ⭐ จำกัด 10 ตัวอักษร
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
