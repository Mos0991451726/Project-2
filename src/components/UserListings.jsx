import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Profile.module.css";

function UserListings({ properties }) {
  const navigate = useNavigate();

  const getImageUrl = (img) => {
    if (!img) return "/assets/no-image.png";

    // ⭐ ถ้าเป็น Blob → แปลง URL
    if (img instanceof Blob) return URL.createObjectURL(img);

    // ⭐ ถ้าเป็น string → ใช้เลย
    if (typeof img === "string") return img;

    return "/assets/no-image.png";
  };

  return (
    <div className={styles.listingCard}>
      <h3 className={styles.sectionTitle}>🏠 ประกาศของผู้ใช้</h3>

      {properties.length === 0 ? (
        <p className={styles.noPost}>ยังไม่มีประกาศในตอนนี้</p>
      ) : (
        <div className={styles.listingGrid}>
          {properties.map((p) => (
            <div
              key={p.id}
              className={styles.listingItem}
              onClick={() => navigate(`/property/${p.id}`)}
            >
              <img
                src={getImageUrl(p.image)}
                alt="property"
                className={styles.listingImage}
                onError={(e) => (e.target.src = "/assets/no-image.png")}
              />

              <h4 className={styles.listingName}>{p.title}</h4>

              <p>📍 {p.location}</p>
              <p>🏷 ประเภท: {p.type}</p>
              <p>🏡 หมวดหมู่: {p.category}</p>

              <p className={styles.price}>
                💰 {p.price} บาท
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserListings;
