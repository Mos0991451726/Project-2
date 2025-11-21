import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/PropertyCard.module.css";

function PropertyCard({ property }) {
  return (
    <div className={styles.propertyCard}>
      <img
        src={property.image}
        alt={property.name}
        className={styles.propertyImage}
      />

      <h3>{property.name}</h3>
      <p>📍 {property.location}</p>
      <p>📦 ประเภท: {property.type}</p>
      <p>🏠 หมวดหมู่: {property.category}</p>

      <p>
        💰{" "}
        {property.price
          ? Number(String(property.price).replace(/[^0-9]/g, "")).toLocaleString(
              "th-TH"
            )
          : "ไม่ระบุ"}{" "}
        บาท
      </p>

      <Link to={`/property/${property.id}`} className={styles.btnDetail}>
        ดูรายละเอียด
      </Link>
    </div>
  );
}

export default PropertyCard;
