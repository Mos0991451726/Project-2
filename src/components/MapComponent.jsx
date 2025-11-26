import React from "react";
import styles from "../styles/Map.module.css";

function MapComponent({ lat, lon, name }) {
  return (
    <div className={styles.mapContainer}>
      <div className={styles.mapTitle}>📍 {name}</div>

      <iframe
        title="map"
        src={`https://www.google.com/maps?q=${lat},${lon}&z=16&output=embed`}
        className={styles.mapBox}
        loading="lazy"
        allowFullScreen=""
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}

export default MapComponent;
