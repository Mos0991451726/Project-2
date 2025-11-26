// ===============================
// ⭐ PropertyDB — IndexedDB
// ===============================

import { openDB } from "idb";

const DB_NAME = "PropertyDB";
const DB_VERSION = 1;

// ===============================
// ⭐ เปิดฐานข้อมูล
// ===============================
export const propertyDB = await openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    // ตารางเก็บประกาศ
    if (!db.objectStoreNames.contains("properties")) {
      db.createObjectStore("properties", {
        keyPath: "id",
      });
    }

    // ตารางเก็บ Favorite
    if (!db.objectStoreNames.contains("favorites")) {
      db.createObjectStore("favorites", {
        keyPath: "id",
      });
    }
  },
});

// ===============================
// ⭐ ฟังก์ชันจัดการ Properties
// ===============================

// ดึงประกาศทั้งหมด
export async function getAllProperties() {
  return await propertyDB.getAll("properties");
}

// ดึงประกาศตาม ID
export async function getPropertyById(id) {
  return await propertyDB.get("properties", id);
}

// เพิ่มประกาศใหม่
export async function addPropertyToDB(property) {
  return await propertyDB.put("properties", property);
}

// ลบประกาศ
export async function deletePropertyFromDB(id) {
  return await propertyDB.delete("properties", id);
}

// อัปเดตประกาศ
export async function updatePropertyInDB(property) {
  return await propertyDB.put("properties", property);
}

// ===============================
// ⭐ ฟังก์ชัน Favorite
// ===============================

// ดึง favorites ทั้งหมด
export async function getFavorites() {
  return await propertyDB.getAll("favorites");
}

// เช็คว่า favorite?
export async function isFavorite(id) {
  const fav = await propertyDB.get("favorites", id);
  return !!fav;
}

// สลับสถานะ Favorite
export async function toggleFavoriteInDB(id) {
  const fav = await propertyDB.get("favorites", id);

  if (fav) {
    await propertyDB.delete("favorites", id);
    return false;
  } else {
    await propertyDB.put("favorites", { id });
    return true;
  }
}

// ลบ Favorite ทั้งหมด (optional)
export async function clearFavorites() {
  return await propertyDB.clear("favorites");
}

