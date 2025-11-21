import React, { useEffect } from "react";
import styles from "../styles/Map.module.css";

function MapComponent({ lat, lon, name }) {
  useEffect(() => {
    const initMap = () => {
      const longdo = window.longdo;
      if (!longdo) {
        console.error("❌ Longdo Map ยังไม่โหลด");
        return;
      }

      console.log("✅ Longdo Map Loaded");
      const map = new longdo.Map({
        placeholder: document.getElementById("map"),
      });

      map.Layers.setBase(longdo.Layers.NORMAL);

      map.location({ lon, lat }, true);
      map.zoom(16, true);

      map.Overlays.clear();

      const marker = new longdo.Marker(
        { lon, lat },
        {
          title: name,
          icon: {
            url: "https://map.longdo.com/mmmap/images/pin_mark.png",
            offset: { x: 12, y: 45 },
          },
        }
      );

      map.Overlays.add(marker);
    };

    if (!window.longdo) {
      const script = document.createElement("script");
      script.src =
        "https://api.longdo.com/map/?key=1b4327452cc20e14a37e40cc130bd03a";
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, [lat, lon, name]);

  return (
    <div className={styles.mapContainer}>
      <div className={styles.mapTitle}>📍 {name}</div>
      <div id="map" className={styles.mapBox}></div>
    </div>
  );
}

export default MapComponent;
