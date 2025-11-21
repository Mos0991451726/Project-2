import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProperties } from "../context/PropertyContext";
import styles from "../styles/AddProperty.module.css";

function AddProperty() {
  const { addProperty } = useProperties();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [details, setDetails] = useState("");
  const [image, setImage] = useState(null);
  const [coords, setCoords] = useState({ lat: 13.7563, lon: 100.5018 });

  const fileRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (window.longdo) {
      initMap();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://api.longdo.com/map/?key=1b4327452cc20e14a37e40cc130bd03a";
    script.async = true;
    script.onload = initMap;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initMap = () => {
    if (!window.longdo) {
      console.error("❌ Longdo Map ยังไม่พร้อม");
      return;
    }

    const map = new window.longdo.Map({
      placeholder: document.getElementById("propertyMap"),
    });

    map.location({ lon: coords.lon, lat: coords.lat }, true);
    map.zoom(10);

    const marker = new window.longdo.Marker(map.location());
    map.Overlays.add(marker);

    map.Event.bind("click", function (overlay) {
      const loc = map.location(overlay);
      marker.move(loc);
      setCoords({ lat: loc.lat, lon: loc.lon });
    });

    mapRef.current = map;
    markerRef.current = marker;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !location || !price || !type || !category)
      return alert("⚠️ กรุณากรอกข้อมูลให้ครบทุกช่อง");

    const formattedPrice = Number(price).toLocaleString("th-TH");

    addProperty({
      id: Date.now(),
      title,
      location,
      type,
      category,
      price: formattedPrice,
      details,
      image,
      lat: coords.lat,
      lon: coords.lon,
    });

    alert("✅ ลงประกาศเรียบร้อยแล้ว!");
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <h2>📝 ลงประกาศอสังหาริมทรัพย์</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label>ชื่ออสังหาริมทรัพย์</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>ทำเล / ที่อยู่</label>
        <input value={location} onChange={(e) => setLocation(e.target.value)} />

        <div
          id="propertyMap"
          className={styles.map}
        ></div>

        <p>📍 พิกัด: {coords.lat.toFixed(5)}, {coords.lon.toFixed(5)}</p>

        <label>ประเภทประกาศ</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">-- เลือกประเภทประกาศ --</option>
          <option value="ขาย">ขาย</option>
          <option value="เช่า">เช่า</option>
        </select>

        <label>ประเภทอสังหาริมทรัพย์</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">-- เลือกประเภทอสังหา --</option>
          <option value="บ้าน">บ้าน</option>
          <option value="คอนโด">คอนโด</option>
          <option value="ที่ดิน">ที่ดิน</option>
          <option value="ทาวน์โฮม">ทาวน์โฮม</option>
        </select>

        <label>ราคา (บาท)</label>
        <input
          type="number"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <label>รายละเอียดเพิ่มเติม</label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        ></textarea>

        <label>อัปโหลดรูปภาพ</label>
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={handleImageChange}
        />

        {image && (
          <div className={styles.preview}>
            <img src={image} alt="preview" />
          </div>
        )}

        <button type="submit" className={styles.submitBtn}>
          📤 โพสต์ประกาศ
        </button>
      </form>
    </div>
  );
}

export default AddProperty;
