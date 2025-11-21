import React, { useState } from "react";
import styles from "../styles/SearchBar.module.css";

function SearchBar({ onSearch }) {
  const [keyword, setKeyword] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
    onSearch(value);
  };

  return (
    <div className={styles.searchbar}>
      <input
        type="text"
        placeholder="🔍 ค้นหาอสังหาริมทรัพย์..."
        value={keyword}
        onChange={handleChange}
        className={styles.input}
      />
    </div>
  );
}

export default SearchBar;
