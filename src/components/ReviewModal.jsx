import React, { useState } from "react";
import styles from "../styles/Profile.module.css";
import { FaStar } from "react-icons/fa";

function ReviewModal({ onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!rating || text.trim() === "") {
      alert("กรุณาให้คะแนนและเขียนข้อความรีวิว");
      return;
    }
    onSubmit({ rating, text });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.reviewModal}>

        <h3>⭐ เพิ่มรีวิว</h3>

        <div className={styles.starSelect}>
          {[1,2,3,4,5].map(num => (
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
