import React from "react";
import styles from "../styles/PropertyCard.module.css";

function PropertyCard({ property }) {
  const handleDetailClick = () => {
    // บังคับรีโหลดหน้า พร้อมเปลี่ยน URL
    window.location.href = `/property/${property.id}`;
  };

  return (
    <div className={styles.propertyCard}>
      <h3>{property.title}</h3>
      <p>📍 {property.location}</p>

      <img
        // src={property.image || "/assets/no-image.png"}
        alt={property.title}
        className={styles.propertyImage}
        onError={(e) => (e.target.src = "/assets/no-image.png")}
      />

      <p>📦 ประเภท: {property.type}</p>
      <p>🏠 หมวดหมู่: {property.category}</p>

      <p>
        💰{" "}
        {property.price
          ? Number(String(property.price).replace(/[^0-9]/g, "")).toLocaleString("th-TH")
          : "ไม่ระบุ"}{" "}
        บาท
      </p>

      <button className={styles.btnDetail} onClick={handleDetailClick}>
        ดูรายละเอียด
      </button>
    </div>
  );
}

export default PropertyCard;
