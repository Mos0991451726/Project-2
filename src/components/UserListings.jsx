import React from "react";
import styles from "../styles/Profile.module.css";

function UserListings({ properties }) {
  return (
    <div className={styles.listingCard}>
      <h3 className={styles.sectionTitle}>🏠 ประกาศของผู้ใช้</h3>

      {properties.length === 0 ? (
        <p className={styles.noPost}>ยังไม่มีประกาศในตอนนี้</p>
      ) : (
        <div className={styles.listingGrid}>
          {properties.map((p) => (
            <div key={p.id} className={styles.listingItem}>
              <img src={p.image} alt="" className={styles.listingImage} />
              <h4 className={styles.listingName}>{p.title}</h4>
              <p>{p.city}</p>
              <p className={styles.price}>{p.price} บาท</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserListings;
