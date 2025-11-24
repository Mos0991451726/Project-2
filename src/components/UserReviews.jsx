import React, { useState, useEffect } from "react";
import styles from "../styles/Profile.module.css";
import { FaStar, FaPlus, FaSearch } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import ReviewModal from "./ReviewModal";

function UserReviews({ user }) {
    const { user: currentUser } = useAuth();

    if (!currentUser || !user) return null;

    const [reviews, setReviews] = useState([]);
    const [showModal, setShowModal] = useState(false);

    // 🟦 โหลดรีวิวจาก localStorage ตาม email ของ user เจ้าของโปรไฟล์
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("reviews") || "{}");
        setReviews(saved[user.email] || []);
    }, [user.email]);

    // 🟩 ฟังก์ชันบันทึกกลับลง localStorage
    const saveReviews = (email, data) => {
        const allReviews = JSON.parse(localStorage.getItem("reviews") || "{}");
        allReviews[email] = data;
        localStorage.setItem("reviews", JSON.stringify(allReviews));
    };

    // ➕ เพิ่มรีวิวใหม่
    const handleAddReview = (newReview) => {
        const formatted = {
            id: reviews.length + 1,
            name: currentUser?.username || "ผู้ใช้",
            rating: newReview.rating,
            text: newReview.text,
            time: new Date().toLocaleString("th-TH"),
        };
        setReviews([...reviews, formatted]);
        setShowModal(false);
    };


    const isOwner = currentUser.email === user.email;

    return (
        <div className={styles.reviewCard}>
            <h3 className={styles.reviewTitle}>⭐ รีวิวผู้ใช้</h3>

            {reviews.length === 0 && (
                <p className={styles.noReviewText}>ยังไม่มีรีวิว</p>
            )}

            {reviews.map((r) => (
                <div key={r.id} className={styles.reviewItem}>
                    <div className={styles.stars}>
                        {[...Array(r.rating)].map((_, i) => (
                            <FaStar key={i} className={styles.starIcon} />
                        ))}
                    </div>

                    <p className={styles.reviewText}>{r.text}</p>
                    <span className={styles.reviewAuthor}>
                        — {r.name} ({r.time})
                    </span>
                    <div className={styles.reviewLine}></div>
                </div>
            ))}

            {/* ปุ่ม */}
            {isOwner ? (
                <button className={styles.reviewBtn}>
                    <FaSearch /> ดูรีวิวทั้งหมด
                </button>
            ) : (
                <button className={styles.reviewBtn} onClick={() => setShowModal(true)}>
                    <FaPlus /> เพิ่มรีวิว
                </button>
            )}

            {/* Modal */}
            {showModal && (
                <ReviewModal
                    onClose={() => setShowModal(false)}
                    onSubmit={handleAddReview}
                />
            )}
        </div>
    );
}

export default UserReviews;
