import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import PropertyCard from "../components/PropertyCard";
import { useProperties } from "../context/PropertyContext";
import styles from "../styles/Home.module.css";

function Home() {
  const { properties } = useProperties();

  // ⭐ กรองเฉพาะประกาศที่อนุมัติแล้ว
  const approvedProperties = properties.filter((p) => p.status === "approved");

  // state เก็บค่า search + filter
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterPrice, setFilterPrice] = useState("");

  const [filtered, setFiltered] = useState(approvedProperties);

  // ทุกครั้งที่ search หรือ filter เปลี่ยน → คำนวณ filtered ใหม่
  useEffect(() => {
    let result = [...approvedProperties];

    // 🔹 search
    if (searchKeyword !== "") {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // 🔹 filter type
    if (filterType !== "") {
      result = result.filter((p) => p.type === filterType);
    }

    // 🔹 filter category
    if (filterCategory !== "") {
      result = result.filter((p) => p.category === filterCategory);
    }

    // 🔹 filter price
    if (filterPrice !== "") {
      const [min, max] = filterPrice.split("-");
      result = result.filter((p) => {
        const price = parseInt(p.price.toString().replace(/,/g, ""));
        if (filterPrice.includes("+")) return price >= 5000000;
        return price >= min && price <= max;
      });
    }

    setFiltered(result);
  }, [approvedProperties, searchKeyword, filterType, filterCategory, filterPrice]);

  // handler สำหรับ SearchBar
  const handleSearch = (keyword) => setSearchKeyword(keyword);

  // handler สำหรับ FilterPanel
  const handleFilter = (type, value) => {
    switch (type) {
      case "type":
        setFilterType(value);
        break;
      case "category":
        setFilterCategory(value);
        break;
      case "price":
        setFilterPrice(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🏘️ ระบบเว็บไซต์ขาย/เช่าอสังหาริมทรัพย์</h1>

      <SearchBar onSearch={handleSearch} />
      <FilterPanel onFilter={handleFilter} />

      {filtered.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          ไม่มีประกาศที่ตรงกับเงื่อนไข
        </p>
      ) : (
        <div className={styles.grid}>
          {filtered.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
