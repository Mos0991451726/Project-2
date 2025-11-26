import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProperties } from "../context/PropertyContext";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/AddProperty.module.css";
import Swal from "sweetalert2";

function AddProperty() {
  const { addProperty } = useProperties();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [details, setDetails] = useState("");

  const [errors, setErrors] = useState({});

  // ⭐ Blob images
  const [image, setImage] = useState(null);
  const [otherImages, setOtherImages] = useState([]);

  // ⭐ สิ่งอำนวยความสะดวก
  const amenitiesList = [
    { key: "lift", label: "ลิฟต์", icon: "🛗" },
    { key: "parking", label: "ที่จอดรถ", icon: "🚗" },
    { key: "security", label: "การรักษาความปลอดภัย 24 ชม.", icon: "🛡️" },
    { key: "cctv", label: "CCTV", icon: "📹" },
    { key: "wifi", label: "Wi-Fi", icon: "📶" },
    { key: "pool", label: "สระว่ายน้ำ", icon: "🏊" },
    { key: "gym", label: "ฟิตเนส", icon: "🏋️" },
    { key: "pet", label: "เลี้ยงสัตว์ได้", icon: "🐶" },
    { key: "playground", label: "สนามเด็กเล่น", icon: "🛝" },
    { key: "restaurant", label: "ร้านอาหารในโครงการ", icon: "🍽️" },
  ];

  const [amenities, setAmenities] = useState({});
  const toggleAmenity = (key) =>
    setAmenities((prev) => ({ ...prev, [key]: !prev[key] }));

  // ⭐ พิกัดแผนที่
  const [coords, setCoords] = useState({ lat: 13.7563, lon: 100.5018 });
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  /* ======================================================
     ⭐ โหลด Longdo Map
  ====================================================== */
  useEffect(() => {
    if (!window.longdo) {
      const script = document.createElement("script");
      script.src =
        "https://api.longdo.com/map/?key=1b4327452cc20e14a37e40cc130bd03a";
      script.async = true;
      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      initMap();
    }
  }, []);

  const initMap = () => {
    if (!window.longdo) return;

    const map = new window.longdo.Map({
      placeholder: document.getElementById("propertyMap"),
    });

    map.location({ lon: coords.lon, lat: coords.lat }, true);
    map.zoom(15);

    // ⭐ สร้างหมุด
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

  /* ======================================================
      ⭐ Upload รูป
  ====================================================== */
  const handleImageChange = (e) => {
    if (e.target.files[0]) setImage(e.target.files[0]);
  };

  const handleMultipleChange = (e) => {
    setOtherImages((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const removeOtherImage = (i) =>
    setOtherImages((prev) => prev.filter((_, idx) => idx !== i));

  /* ======================================================
      ⭐ Validate ฟอร์ม
  ====================================================== */
  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) newErrors.title = "กรุณากรอกชื่ออสังหา";
    if (!location.trim()) newErrors.location = "กรุณากรอกทำเล";
    if (!type) newErrors.type = "กรุณาเลือกประเภท";
    if (!category) newErrors.category = "กรุณาเลือกประเภทอสังหา";
    if (!price) newErrors.price = "กรุณากรอกราคา";
    if (price < 0) newErrors.price = "ราคาต้องมากกว่า 0";
    if (!details.trim()) newErrors.details = "กรุณากรอกรายละเอียด";
    if (!image) newErrors.image = "กรุณาเลือกรูปหลัก";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* ======================================================
      ⭐ Submit
  ====================================================== */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "กรอกข้อมูลไม่ครบ!",
        text: "กรุณาตรวจสอบช่องที่เป็นสีแดง",
      });
      return;
    }

    addProperty({
      id: Date.now(),
      title,
      location,
      type,
      category,
      price: Number(price).toLocaleString("th-TH"),
      details,
      image,
      otherImages,
      amenities,
      ...coords,
      status: "pending",
      ownerEmail: user.email,
      ownerName: user.username,
      ownerAvatar: user.avatar,
      time: new Date().toISOString(),
    });

    Swal.fire({
      icon: "success",
      title: "ส่งประกาศสำเร็จ!",
      text: "รอแอดมินตรวจสอบ 🎉",
      confirmButtonColor: "#3085d6",
    });

    navigate("/");
  };

  return (
    <div className={styles.container}>
      <h2>📝 ลงประกาศอสังหาริมทรัพย์</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        
        {/* ===== ชื่อ ===== */}
        <label>ชื่ออสังหาริมทรัพย์</label>
        <input
          className={errors.title ? styles.errorInput : ""}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <p className={styles.errorText}>{errors.title}</p>}

        {/* ===== ทำเล ===== */}
        <label>ทำเล / ที่อยู่</label>
        <input
          className={errors.location ? styles.errorInput : ""}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        {errors.location && <p className={styles.errorText}>{errors.location}</p>}

        {/* ===== Map ===== */}
        <label>ตำแหน่งบนแผนที่</label>
        <div id="propertyMap" className={styles.map}></div>
        <p>📍 {coords.lat.toFixed(5)}, {coords.lon.toFixed(5)}</p>

        {/* ===== ประเภทประกาศ ===== */}
        <label>ประเภทประกาศ</label>
        <select
          className={errors.type ? styles.errorInput : ""}
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">เลือกประเภท</option>
          <option value="ขาย">ขาย</option>
          <option value="เช่า">เช่า</option>
        </select>
        {errors.type && <p className={styles.errorText}>{errors.type}</p>}

        {/* ===== ประเภทอสังหา ===== */}
        <label>ประเภทอสังหา</label>
        <select
          className={errors.category ? styles.errorInput : ""}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">เลือกประเภท</option>
          <option value="บ้าน">บ้าน</option>
          <option value="คอนโด">คอนโด</option>
          <option value="ที่ดิน">ที่ดิน</option>
          <option value="ทาวน์โฮม">ทาวน์โฮม</option>
        </select>
        {errors.category && <p className={styles.errorText}>{errors.category}</p>}

        {/* ===== ราคา ===== */}
        <label>ราคา (บาท)</label>
        <input
          type="number"
          className={errors.price ? styles.errorInput : ""}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        {errors.price && <p className={styles.errorText}>{errors.price}</p>}

        {/* ===== รายละเอียด ===== */}
        <label>รายละเอียด</label>
        <textarea
          className={errors.details ? styles.errorInput : ""}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
        {errors.details && <p className={styles.errorText}>{errors.details}</p>}

        {/* ===== รูปหลัก ===== */}
        <label>รูปหลัก</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {errors.image && <p className={styles.errorText}>{errors.image}</p>}
        {image && <img src={URL.createObjectURL(image)} className={styles.previewMain} />}

        {/* ===== รูปเพิ่มเติม ===== */}
        <label>รูปเพิ่มเติม</label>
        <input type="file" multiple accept="image/*" onChange={handleMultipleChange} />
        <div className={styles.previewScroll}>
          {otherImages.map((img, i) => (
            <div key={i} className={styles.previewItem}>
              <img src={URL.createObjectURL(img)} />
              <button onClick={() => removeOtherImage(i)}>✖</button>
            </div>
          ))}
        </div>

        {/* ===== สิ่งอำนวยความสะดวก ===== */}
        <label>สิ่งอำนวยความสะดวก</label>
        <div className={styles.amenitiesGrid}>
          {amenitiesList.map((a) => (
            <label key={a.key} className={styles.amenityItem}>
              <input
                type="checkbox"
                checked={amenities[a.key] || false}
                onChange={() => toggleAmenity(a.key)}
              />
              <span>{a.icon}</span> {a.label}
            </label>
          ))}
        </div>

        <button className={styles.submitBtn}>📤 โพสต์ประกาศ</button>
      </form>
    </div>
  );
}

export default AddProperty;
