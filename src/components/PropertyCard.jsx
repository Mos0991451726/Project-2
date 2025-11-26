import React, { useState, useEffect, useMemo } from "react";
import styles from "../styles/PropertyCard.module.css";

function PropertyCard({ property }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFav, setIsFav] = useState(false);

  // ⭐ รวมรูป → แปลง Blob เป็น URL
  const images = useMemo(() => {
    const all = [property.image, ...(property.otherImages || [])].filter(Boolean);

    return all.map((img) => {
      // ถ้าเป็น Blob → สร้าง Object URL
      if (img instanceof Blob) return URL.createObjectURL(img);

      // ถ้าเป็น string (base64) → ใช้ตรงๆ
      if (typeof img === "string") return img;

      return null;
    }).filter(Boolean);
  }, [property.image, property.otherImages]);

  // ❤️ โหลดสถานะ favorite
  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFav(favs.includes(property.id));
  }, [property.id]);

  // ❤️ toggle favorite
  const toggleFavorite = () => {
    let favs = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (isFav) {
      favs = favs.filter((id) => id !== property.id);
    } else {
      favs.push(property.id);
    }

    localStorage.setItem("favorites", JSON.stringify(favs));
    setIsFav(!isFav);
  };

  // 🕒 ป้าย "มาใหม่" (24 ชม.)
  const isNew = () => {
    const now = Date.now();
    return now - property.id < 24 * 60 * 60 * 1000;
  };

  // ▶▶ slide controls
  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1 < images.length ? prev + 1 : 0));
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 >= 0 ? prev - 1 : images.length - 1));
  };

  const handleDetailClick = () => {
    window.location.href = `/property/${property.id}`;
  };

  return (
    <div className={styles.propertyCard}>
      {/* ป้ายมาใหม่ */}
      {isNew() && <div className={styles.badgeNew}>🔥 มาใหม่</div>}

      <br />
      <br />
      {/* รูป + ปุ่มเลื่อน */}
      <div className={styles.imageWrapper}>
        <img
          src={images[currentIndex] || "/assets/no-image.png"}
          alt={property.title}
          className={styles.propertyImage}
        />

        {images.length > 1 && (
          <>
            <button className={styles.arrowLeft} onClick={prevImage}>‹</button>
            <button className={styles.arrowRight} onClick={nextImage}>›</button>
          </>
        )}
      </div>

      <h3 className={styles.title}>{property.title}</h3>
      <p className={styles.location}>📍 {property.location}</p>

      <p>📦 {property.type}</p>
      <p>🏠 {property.category}</p>

      <p className={styles.price}>
        💰{" "}
        {Number(
          String(property.price).replace(/[^0-9]/g, "")
        ).toLocaleString("th-TH")}{" "}
        บาท
      </p>

      <button className={styles.btnDetail} onClick={handleDetailClick}>
        🔍 ดูรายละเอียด
      </button>
    </div>
  );
}

export default PropertyCard;
