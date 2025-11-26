import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getAllProperties,
  addPropertyToDB,
  updatePropertyInDB,
  deletePropertyFromDB,
  toggleFavoriteInDB,
  getFavorites,
} from "../utils/propertyDB";
import { useAuth } from "../context/AuthContext";

const PropertyContext = createContext();
export const useProperties = () => useContext(PropertyContext);

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const { user } = useAuth();

  // ================================
  // ⭐ โหลดข้อมูลครั้งแรก
  // ================================
  useEffect(() => {
    loadProperties();
    loadFavoriteList();
  }, []);

  const loadProperties = async () => {
    const data = await getAllProperties();
    setProperties(data);
  };

  const loadFavoriteList = async () => {
    const favList = await getFavorites();
    setFavorites(favList.map((f) => f.id));
  };

  // ================================
  // ⭐ เพิ่มประกาศใหม่
  // ================================
  const addProperty = async (property) => {
    const now = new Date().toISOString();

    const newProperty = {
      ...property,
      id: Date.now(),
      time: now,
      status: "pending",
      ownerEmail: user?.email,
      ownerName: user?.username,
      ownerAvatar: user?.avatar,
    };

    await addPropertyToDB(newProperty);
    await loadProperties();
  };

  // ================================
  // ⭐ อนุมัติประกาศ
  // ================================
  const approveProperty = async (id) => {
    const target = properties.find((p) => p.id === id);
    if (!target) return;

    const updated = { ...target, status: "approved" };
    await updatePropertyInDB(updated);
    await loadProperties();
  };

  // ================================
  // ⭐ ปฏิเสธ (ลบ)
  // ================================
  const rejectProperty = async (id) => {
    await deletePropertyFromDB(id);
    await loadProperties();
  };

  // ================================
  // ⭐ ปิดประกาศ (เปลี่ยนสถานะเป็น closed)
  // ================================
  const closeProperty = async (id) => {
    const target = properties.find((p) => p.id === id);
    if (!target) return;

    const updated = { ...target, status: "closed" };

    await updatePropertyInDB(updated);
    await loadProperties();
  };

  // ⭐ เปิดประกาศอีกครั้ง (เปลี่ยน closed → approved)
const reopenProperty = async (id) => {
  const target = properties.find((p) => p.id === id);
  if (!target) return;

  const updated = { ...target, status: "approved" };

  await updatePropertyInDB(updated);
  await loadProperties();
};


  // ================================
  // ⭐ ลบประกาศถาวร
  // ================================
  const deleteProperty = async (id) => {
    await deletePropertyFromDB(id);
    await loadProperties();
  };

  // ================================
  // ⭐ Favorite Toggle
  // ================================
  const toggleFavorite = async (propertyId) => {
    const isFavNow = await toggleFavoriteInDB(propertyId);
    await loadFavoriteList();
    return isFavNow;
  };

  const value = {
    properties,
    favorites,
    addProperty,
    approveProperty,
    rejectProperty,
    toggleFavorite,
    closeProperty,
    deleteProperty,
    loadProperties,
    reopenProperty
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
};
