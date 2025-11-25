import React from "react";
import { useParams } from "react-router-dom";
import { useProperties } from "../context/PropertyContext";
import MapComponent from "../components/MapComponent";
import styles from "../styles/PropertyDetail.module.css";

function PropertyDetail() {
  const { id } = useParams(); // ดึง id จาก URL
  const { properties } = useProperties();

  // หา property ตาม id
  const property = properties.find((p) => p.id === Number(id));

  if (!property) return <p>❌ ไม่พบประกาศ</p>;

  return (
    <div className={styles.container}>
      <h1>{property.title}</h1>

      <img
        src={property.image || "/assets/no-image.png"}
        alt={property.title}
        className={styles.image}
        onError={(e) => (e.target.src = "/assets/no-image.png")}
      />

      <p>📍 {property.location}</p>
      <p>💰 ราคา: {property.price} บาท</p>
      <p>🏠 ประเภท: {property.type}</p>
      <p>🏠 หมวดหมู่: {property.category}</p>
      <p>📝 รายละเอียด: {property.details}</p>
      <p>📅 วันที่โพสต์: {new Date(property.time).toLocaleString()}</p>

      {/* แสดงตำแหน่งบนแผนที่ ถ้ามีพิกัด */}
      {property.lat && property.lon && (
        <>
          <h3>ตำแหน่งบนแผนที่</h3>
          <MapComponent lat={property.lat} lon={property.lon} name={property.title} />
        </>
      )}
    </div>
  );
}

export default PropertyDetail;
