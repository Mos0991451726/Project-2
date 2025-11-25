import React, { useState, useMemo } from "react";
import styles from "../styles/PropertyPopup.module.css";

function PropertyPopup({ data, onClose }) {
  if (!data) return null;

  // -----------------------------
  // ⭐ รวมรูปทั้งหมดเป็น Array
  // -----------------------------
  const images = useMemo(() => {
    const arr = [];

    // รูปหลัก
    if (data.image) {
      arr.push(
        data.image instanceof Blob
          ? URL.createObjectURL(data.image)
          : data.image
      );
    }

    // รูปเพิ่มเติม
    if (data.otherImages && data.otherImages.length > 0) {
      data.otherImages.forEach((img) => {
        arr.push(img instanceof Blob ? URL.createObjectURL(img) : img);
      });
    }

    return arr;
  }, [data]);

  // -----------------------------
  // ⭐ index ของรูปปัจจุบัน
  // -----------------------------
  const [index, setIndex] = useState(0);

  const nextImage = () => {
    setIndex((prev) => (prev + 1 < images.length ? prev + 1 : 0));
  };

  const prevImage = () => {
    setIndex((prev) => (prev - 1 >= 0 ? prev - 1 : images.length - 1));
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button className={styles.closeBtn} onClick={onClose}>✖</button>

        <h2 className={styles.title}>📌 รายละเอียดประกาศ</h2>

        {/* ⭐ รูปหลัก + รูปอื่นแบบสไลด์ */}
        <img
          src={images[index] || "/assets/no-image.png"}
          className={styles.mainImg}
          alt="property"
        />

        {/* ⭐ ปุ่มซ้ายขวา (ใช้งานได้จริง) */}
        {images.length > 1 && (
          <div className={styles.arrowBox}>
            <button className={styles.arrowBtn} onClick={prevImage}>‹</button>
            <button className={styles.arrowBtn} onClick={nextImage}>›</button>
          </div>
        )}

        {/* ⭐ ข้อมูลย่อ */}
        <div className={styles.infoBox}>
          <div className={styles.detailRow}><span>🏷 ชื่อ:</span> {data.title}</div>
          <div className={styles.detailRow}><span>📍 ทำเล:</span> {data.location}</div>
          <div className={styles.detailRow}><span>🏢 ประเภทประกาศ:</span> {data.type}</div>
          <div className={styles.detailRow}><span>🏠 ประเภทอสังหา:</span> {data.category}</div>
          <div className={styles.detailRow}><span>💰 ราคา:</span> {data.price} บาท</div>
          <div className={styles.detailRow}><span>📝 รายละเอียด:</span> {data.details}</div>
          <div className={styles.detailRow}>
            <span>🌐 พิกัด:</span> {data.lat.toFixed(5)}, {data.lon.toFixed(5)}
          </div>
        </div>

        {/* ⭐ สิ่งอำนวยความสะดวก */}
        {data.amenities && (
          <>
            <h3 className={styles.amenityTitle}>✨ สิ่งอำนวยความสะดวก</h3>
            <div className={styles.amenityList}>
              {Object.entries(data.amenities)
                .filter(([k, v]) => v === true)
                .map(([key]) => (
                  <div key={key} className={styles.amenityItem}>
                    {key === "lift" && "🛗 ลิฟต์"}
                    {key === "pool" && "🏊 สระว่ายน้ำ"}
                    {key === "wifi" && "📶 Wi-Fi"}
                    {key === "playground" && "🛝 สนามเด็กเล่น"}
                    {key === "parking" && "🚗 ที่จอดรถ"}
                    {key === "security" && "🛡️ รปภ."}
                    {key === "cctv" && "📹 CCTV"}
                    {key === "gym" && "🏋️ ฟิตเนส"}
                  </div>
                ))}
            </div>
          </>
        )}

        {/* ⭐ Map Embed */}
        <h3 className={styles.mapTitle}>🗺 ตำแหน่งบนแผนที่</h3>
        <iframe
          title="map"
          className={styles.map}
          src={`https://www.google.com/maps?q=${data.lat},${data.lon}&z=15&output=embed`}
        ></iframe>

        {/* ⭐ เจ้าของประกาศ */}
        <div className={styles.ownerBox}>
          <img
            src={data.ownerAvatar || "/assets/default-avatar.png"}
            className={styles.ownerAvatar}
            alt="owner"
          />
          <div>
            <strong>ผู้โพสต์:</strong> {data.ownerName}
            <p>{data.ownerEmail}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyPopup;
