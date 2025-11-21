import React from "react";
import { useParams } from "react-router-dom";
import { mockProperties } from "../data/mockProperties";
import MapComponent from "../components/MapComponent";
import styles from "../styles/PropertyDetail.module.css";

function PropertyDetail() {
  const { id } = useParams();
  const property = mockProperties.find((p) => p.id === parseInt(id));

  if (!property) return <h2>ไม่พบข้อมูลอสังหาริมทรัพย์</h2>;

  return (
    <div className={styles.detail}>
      <h1>{property.name}</h1>

      <img
        src={property.image || "/assets/no-image.png"}
        alt={property.name}
        className={styles.detailImg}
        onError={(e) => (e.target.src = "/assets/no-image.png")}
      />

      <p>📍 {property.location}</p>
      <p>💰 ราคา: {property.price} บาท</p>
      <p>🏠 ประเภท: {property.type}</p>

      <h3>ตำแหน่งบนแผนที่</h3>
      <MapComponent lat={property.lat} lon={property.lon} name={property.name} />
    </div>
  );
}

export default PropertyDetail;
