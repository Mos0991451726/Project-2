import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import PropertyCard from "../components/PropertyCard";
import { useProperties } from "../context/PropertyContext";
import styles from "../styles/Home.module.css";

function Home() {
  const { properties } = useProperties();
  const [filtered, setFiltered] = useState(properties);

  useEffect(() => {
    setFiltered(properties);
  }, [properties]);

  const handleSearch = (keyword) => {
    const result = properties.filter((p) =>
      p.title.toLowerCase().includes(keyword.toLowerCase())
    );
    setFiltered(result);
  };

  const handleFilter = (filterType, value) => {
    let result = [...properties];

    if (filterType === "type" && value !== "") {
      result = result.filter((p) => p.type === value);
    }

    if (filterType === "category" && value !== "") {
      result = result.filter((p) => p.category === value);
    }

    if (filterType === "price" && value !== "") {
      const [min, max] = value.split("-");
      result = result.filter((p) => {
        const price = parseInt(p.price.toString().replace(/,/g, ""));
        if (value.includes("+")) return price >= 5000000;
        return price >= min && price <= max;
      });
    }

    setFiltered(result);
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
