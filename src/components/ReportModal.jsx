import React, { useState } from "react";
import styles from "../styles/Modal.module.css";
import { addReportDB } from "../utils/db";
import Swal from "sweetalert2";

function ReportModal({ post, onClose }) {
  const [reason, setReason] = useState("");

  const reasons = [
    "เนื้อหาไม่เหมาะสม",
    "สแปม / โฆษณา",
    "ข้อมูลเท็จ",
    "คุกคาม / พูดจาไม่ดี",
    "อื่น ๆ",
  ];

  const handleSubmit = async () => {
    if (!reason) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาเลือกเหตุผล",
      });
      return;
    }
    const reportData = {
      id: Date.now(),
      reason,
      time: new Date().toISOString(),

      // ⭐ ข้อมูลโพสต์
      postId: post.postId,
      postContent: post.postContent,
      postImage: post.postImage,

      // ⭐ เจ้าของโพสต์
      postOwner: {
        email: post.postOwner.email,
        username: post.postOwner.username,
        avatar: post.postOwner.avatar,
      },

      // ⭐ ผู้รายงานโพสต์
      reporter: {
        email: post.reporter.email,
        username: post.reporter.username,
        avatar: post.reporter.avatar,
      },
    };

    await addReportDB(reportData);

    Swal.fire({
      icon: "success",
      title: "ส่งรายงานสำเร็จ",
      confirmButtonColor: "#28a745",
    }); onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>🚨 รายงานโพสต์</h2>

        <p>เลือกเหตุผลในการรายงาน:</p>

        <select
          className={styles.select}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        >
          <option value="">-- เลือกเหตุผล --</option>
          {reasons.map((r, i) => (
            <option key={i} value={r}>{r}</option>
          ))}
        </select>

        <button className={styles.reportBtn} onClick={handleSubmit}>
          ส่งรายงาน
        </button>

        <button className={styles.closeBtn} onClick={onClose}>
          ปิด
        </button>
      </div>
    </div>
  );
}

export default ReportModal;
