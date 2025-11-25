import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProperties } from "../context/PropertyContext";
import MapComponent from "../components/MapComponent";
import styles from "../styles/PropertyDetail.module.css";

function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties } = useProperties();

  const property = properties.find((p) => p.id === Number(id));

  // ⭐ ต้องอยู่เหนือ return ทุกแบบ
  const images = useMemo(() => {
    if (!property) return [];
    const all = [property.image, ...(property.otherImages || [])].filter(Boolean);

    return all
      .map((img) => {
        if (img instanceof Blob) return URL.createObjectURL(img);
        if (typeof img === "string") return img;
        return null;
      })
      .filter(Boolean);
  }, [property]);

  const [currentIndex, setCurrentIndex] = useState(0);

  if (!property) return <p>❌ ไม่พบประกาศ</p>;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1 < images.length ? prev + 1 : 0));
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 >= 0 ? prev - 1 : images.length - 1));
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.backBtn}
        onClick={() => navigate("/")}
      >
        ⬅ กลับไปหน้าแรก
      </button>
      <h1>{property.title}</h1>

      <div className={styles.galleryWrapper}>
        <img
          src={images[currentIndex] || "/assets/no-image.png"}
          className={styles.galleryImage}
          alt="property"
        />
        {images.length > 1 && (
          <>
            <button className={styles.arrowLeft} onClick={prevImage}>‹</button>
            <button className={styles.arrowRight} onClick={nextImage}>›</button>
          </>
        )}
      </div>

      <div className={styles.ownerBox}>
        <h3>👤 เจ้าของประกาศ</h3>
        <div
          className={styles.ownerInfo}
          onClick={() => navigate(`/profile/${property.ownerEmail}`)}
        >
          <img
            src={property.ownerAvatar || "/assets/default-avatar.png"}
            className={styles.ownerAvatar}
            alt="avatar"
          />
          <div className={styles.ownerText}>
            <strong>{property.ownerName || "ไม่พบชื่อผู้ใช้"}</strong>
            <p>{property.ownerEmail}</p>
          </div>
        </div>
      </div>
      {/* ⭐ รายละเอียดประกาศแบบใหม่ */}
      <div className={styles.detailBox}>
        <h3>📌 รายละเอียดประกาศ</h3>

        <div className={styles.detailItem}>
          <span className={styles.icon}>📍</span>
          <strong>ทำเล:</strong> {property.location}
        </div>

        <div className={styles.detailItem}>
          <span className={styles.icon}>💰</span>
          <strong>ราคา:</strong> {property.price} บาท
        </div>

        <div className={styles.detailItem}>
          <span className={styles.icon}>🏷️</span>
          <strong>ประเภทประกาศ:</strong> {property.type}
        </div>

        <div className={styles.detailItem}>
          <span className={styles.icon}>🏡</span>
          <strong>ประเภทอสังหา:</strong> {property.category}
        </div>

        <div className={styles.detailItem}>
          <span className={styles.icon}>📝</span>
          <strong>รายละเอียด:</strong> {property.details}
        </div>
      </div>
      {/* ⭐ สิ่งอำนวยความสะดวก */}
      {property.amenities && (
        <div className={styles.amenityBox}>
          <h3>✨ สิ่งอำนวยความสะดวก</h3>

          <div className={styles.amenityGrid}>
            {Object.entries(property.amenities)
              .filter(([key, value]) => value === true)
              .map(([key]) => {
                const item = {
                  lift: { label: "ลิฟต์", icon: "🛗" },
                  parking: { label: "ที่จอดรถ", icon: "🚗" },
                  security: { label: "การรักษาความปลอดภัย 24 ชม.", icon: "🛡️" },
                  cctv: { label: "กล้องวงจรปิด (CCTV)", icon: "📹" },
                  wifi: { label: "Wi-Fi", icon: "📶" },
                  pool: { label: "สระว่ายน้ำ", icon: "🏊" },
                  gym: { label: "ฟิตเนส", icon: "🏋️" },
                  pet: { label: "เลี้ยงสัตว์ได้", icon: "🐶" },
                  playground: { label: "สนามเด็กเล่น", icon: "🛝" },
                  restaurant: { label: "ร้านอาหารในโครงการ", icon: "🍽️" },
                }[key];

                if (!item) return null;

                return (
                  <div key={key} className={styles.amenityItem}>
                    <span className={styles.amenityIcon}>{item.icon}</span>
                    {item.label}
                  </div>
                );
              })}
          </div>
        </div>
      )}

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
