import React from "react";
import styles from "../styles/FilterPanel.module.css";

function FilterPanel({ onFilter }) {
  return (
    <div className={styles.filterPanel}>
      <select onChange={(e) => onFilter("type", e.target.value)}>
        <option value="">ประเภทประกาศ</option>
        <option value="ขาย">ขาย</option>
        <option value="เช่า">เช่า</option>
      </select>

      <select onChange={(e) => onFilter("category", e.target.value)}>
        <option value="">ประเภทอสังหา</option>
        <option value="บ้าน">บ้าน</option>
        <option value="คอนโด">คอนโด</option>
        <option value="ที่ดิน">ที่ดิน</option>
        <option value="ทาวน์โฮม">ทาวน์โฮม</option>
      </select>

      <select onChange={(e) => onFilter("price", e.target.value)}>
        <option value="">ทุกช่วงราคา</option>
        <option value="0-1000000">ต่ำกว่า 1,000,000</option>
        <option value="1000000-3000000">1,000,000 - 3,000,000</option>
        <option value="3000000-5000000">3,000,000 - 5,000,000</option>
        <option value="5000000+">มากกว่า 5,000,000</option>
      </select>
    </div>
  );
}

export default FilterPanel;
