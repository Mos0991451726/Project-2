import React, { createContext, useContext, useState } from "react";

// สร้าง Context
const PropertyContext = createContext();
export const useProperties = () => useContext(PropertyContext);

export const PropertyProvider = ({ children }) => {
const [properties, setProperties] = useState([
  {
    id: 1,
    title: "บ้านเดี่ยว ลาดพร้าว 71",
    location: "กรุงเทพมหานคร",
    price: "4,500,000",
    image: "/assets/cfe3.บ้านเดี่ยว.jpg",
    details: "บ้านเดี่ยว 2 ชั้นพร้อมสระว่ายน้ำขนาดเล็ก",
    type: "ขาย", 
    category: "บ้าน", 
  },
  {
    id: 2,
    title: "คอนโด Life Sukhumvit",
    location: "สุขุมวิท, กรุงเทพฯ",
    price: "3,200,000",
    image: "/assets/centric-ratchayothin-unite-reccommend-Adver-1.jpg",
    details: "คอนโดติด BTS พร้อมสิ่งอำนวยความสะดวกครบครัน",
    type: "เช่า", 
    category: "คอนโด", 
  },
]);

  const addProperty = (property) => {
    setProperties((prev) => [
      { id: Date.now(), ...property },
      ...prev,
    ]);
  };

  return (
    <PropertyContext.Provider value={{ properties, addProperty }}>
      {children}
    </PropertyContext.Provider>
  );
};
