import React, { createContext, useContext, useState, useEffect } from "react";

// Context
const PropertyContext = createContext();
export const useProperties = () => useContext(PropertyContext);

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);

  // ⭐ โหลดข้อมูลจาก localStorage ตอนเริ่มต้น
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("posts") || "[]");
    setProperties(stored);
  }, []);

  // ฟังก์ชันเพิ่มประกาศ
  const addProperty = (property) => {
    const now = new Date().toISOString();
    const newProperty = {
      id: Date.now(),
      status: "pending", // รออนุมัติ
      time: now,         // เก็บเวลาโพสต์
      ...property,
    };

    const updated = [newProperty, ...properties];

    // อัปเดต state + localStorage
    setProperties(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
  };

  // อนุมัติประกาศ
  const approveProperty = (id) => {
    const updated = properties.map((p) =>
      p.id === id ? { ...p, status: "approved" } : p
    );
    setProperties(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
  };

  // ลบ/ปฏิเสธประกาศ
  const rejectProperty = (id) => {
    const updated = properties.filter((p) => p.id !== id);
    setProperties(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
  };

  return (
    <PropertyContext.Provider
      value={{ properties, addProperty, approveProperty, rejectProperty }}
    >
      {children}
    </PropertyContext.Provider>
  );
};
