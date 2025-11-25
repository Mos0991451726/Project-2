import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import PropertyCard from "../components/PropertyCard";
import { useProperties } from "../context/PropertyContext";
import styles from "../styles/Home.module.css";

function Home() {
  const { properties } = useProperties();

  // state เก็บค่า search + filter
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterPrice, setFilterPrice] = useState("");

  // ผลลัพธ์ประกาศหลังกรอง
  const [filtered, setFiltered] = useState([]);

  // ⭐ Recalculate filtered เมื่อ properties หรือ filter/search เปลี่ยน
  useEffect(() => {
    let result = properties.filter((p) => p.status === "approved");

    // 🔎 Search filter
    if (searchKeyword !== "") {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // 🏘 Filter Type
    if (filterType !== "") {
      result = result.filter((p) => p.type === filterType);
    }

    // 📂 Filter Category
    if (filterCategory !== "") {
      result = result.filter((p) => p.category === filterCategory);
    }

    // 💰 Filter Price
    if (filterPrice !== "") {
      const [min, max] = filterPrice.split("-");

      result = result.filter((p) => {
        const price = parseInt(p.price.toString().replace(/,/g, ""));

        if (filterPrice.includes("+")) {
          return price >= 5000000;
        }

        return price >= min && price <= max;
      });
    }

    setFiltered(result);
  }, [properties, searchKeyword, filterType, filterCategory, filterPrice]);

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
