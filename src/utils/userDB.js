// utils/userDB.js
import { openDB } from "idb";

const DB_NAME = "UserDB";
const STORE_NAME = "users";

// เปิดฐานข้อมูล IndexedDB
const getDB = () =>
  openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "email" });
      }
    },
  });

/* --------------------------------
   ดึงผู้ใช้ทั้งหมดแบบ array
----------------------------------- */
export const getAllUsers = async () => {
  const db = await getDB();
  return await db.getAll(STORE_NAME);
};

/* --------------------------------
   ดึงผู้ใช้ทั้งหมดแบบ object {email: user}
----------------------------------- */
export const loadUsers = async () => {
  const db = await getDB();
  const all = await db.getAll(STORE_NAME);

  const obj = {};
  all.forEach((u) => {
    obj[u.email] = u;
  });

  return obj;
};

/* --------------------------------
   บันทึกผู้ใช้ทั้งหมด (ไม่ค่อยใช้)
----------------------------------- */
export const saveUsers = async (users) => {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.store;

  await store.clear();

  for (const email in users) {
    await store.put(users[email]);
  }

  await tx.done;
};

/* --------------------------------
   ดึงผู้ใช้รายคน
----------------------------------- */
export const getUserByEmail = async (email) => {
  const db = await getDB();
  return await db.get(STORE_NAME, email);
};

/* --------------------------------
   บันทึก/อัปเดตผู้ใช้รายเดียว (สำคัญมาก)
----------------------------------- */
export const saveUser = async (user) => {
  const db = await getDB();
  await db.put(STORE_NAME, user);
  return true;
};

/* --------------------------------
   แปลง object => array
----------------------------------- */
export const usersToArray = async (usersObj) => {
  return Object.keys(usersObj).map((email) => usersObj[email]);
};

/* --------------------------------
   Admin: อัปเดต role
----------------------------------- */
export const updateUserRole = async (email, newRole) => {
  const db = await getDB();
  const user = await db.get(STORE_NAME, email);
  if (!user) return false;

  user.role = newRole;
  await db.put(STORE_NAME, user);
  return true;
};

/* --------------------------------
   Ban user
----------------------------------- */
export const banUser = async (email) => {
  const db = await getDB();
  const user = await db.get(STORE_NAME, email);
  if (!user) return false;

  user.status = "banned";
  await db.put(STORE_NAME, user);
  return true;
};

/* --------------------------------
   Unban user
----------------------------------- */
export const unbanUser = async (email) => {
  const db = await getDB();
  const user = await db.get(STORE_NAME, email);
  if (!user) return false;

  user.status = "active";
  await db.put(STORE_NAME, user);
  return true;
};

/* --------------------------------
   ลบผู้ใช้
----------------------------------- */
export const deleteUserDB = async (email) => {
  const db = await getDB();
  const exist = await db.get(STORE_NAME, email);
  if (!exist) return false;

  await db.delete(STORE_NAME, email);
  return true;
};

/* --------------------------------
   เพิ่มผู้ใช้ใหม่ (Admin)
----------------------------------- */
export const addUserDB = async (email, username, role) => {
  const db = await getDB();

  const exist = await db.get(STORE_NAME, email);
  if (exist) return false;

  const newUser = {
    email,
    username,
    password: "123456",
    role,
    status: "active",
    avatar: "/assets/default-avatar.png",
    cover: "/assets/cover-default.jpg",
    bio: "",
    joinDate: new Date().toLocaleDateString("th-TH"),
  };

  await db.put(STORE_NAME, newUser);
  return true;
};

/* --------------------------------
   ค้นหา
----------------------------------- */
export const searchUsers = (list, text) => {
  return list.filter(
    (u) =>
      u.email.toLowerCase().includes(text.toLowerCase()) ||
      u.username.toLowerCase().includes(text.toLowerCase())
  );
};

/* --------------------------------
   Filter
----------------------------------- */
export const filterUsers = (list, role, status) => {
  return list.filter((u) => {
    const okRole = role === "all" || u.role === role;
    const okStatus = status === "all" || (u.status || "active") === status;
    return okRole && okStatus;
  });
};

/* --------------------------------
   Pagination
----------------------------------- */
export const paginate = (list, page, perPage) => {
  const start = (page - 1) * perPage;
  return list.slice(start, start + perPage);
};
