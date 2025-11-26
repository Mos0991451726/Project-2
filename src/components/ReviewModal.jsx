import React, { useState } from "react";
import styles from "../styles/Profile.module.css";
import { FaStar } from "react-icons/fa";
import Swal from "sweetalert2";

function ReviewModal({ onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");

  const handleSubmit = () => {
    // 🟥 แจ้งเตือนหากไม่ให้คะแนนหรือไม่เขียนข้อความ
    if (!rating || text.trim() === "") {
      Swal.fire({
        icon: "warning",
        title: "กรุณาให้คะแนนและเขียนรีวิว",
        text: "คุณต้องให้คะแนน 1–5 ดาว และต้องเขียนเนื้อหาอย่างน้อย 1 บรรทัด",
      });
      return;
    }

    // 🟩 ส่งข้อมูลรีวิวออกไป
    onSubmit({ rating, text });

    // 🟦 Popup แจ้งเตือนส่งสำเร็จ
    Swal.fire({
      icon: "success",
      title: "ส่งรีวิวสำเร็จ!",
      showConfirmButton: false,
      timer: 1200
    });

    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.reviewModal}>

        <h3>⭐ เพิ่มรีวิว</h3>

        <div className={styles.starSelect}>
          {[1, 2, 3, 4, 5].map((num) => (
            <FaStar
              key={num}
              size={28}
              color={num <= rating ? "#f1c40f" : "#ccc"}
              onClick={() => setRating(num)}
              style={{ cursor: "pointer" }}
            />
          ))}
        </div>

        <textarea
          className={styles.textareaBox}
          placeholder="เขียนรีวิวของคุณ..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className={styles.modalActions}>
          <button className={styles.saveBtn} onClick={handleSubmit}>
            ส่งรีวิว
          </button>
          <button className={styles.cancelBtn} onClick={onClose}>
            ยกเลิก
          </button>
        </div>

      </div>
    </div>
  );
}

export default ReviewModal;
