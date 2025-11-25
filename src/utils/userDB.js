// utils/userDB.js

// อ่านผู้ใช้ทั้งหมด (object)
export const loadUsers = () => {
  return JSON.parse(localStorage.getItem("users")) || {};
};

// บันทึกกลับ
export const saveUsers = (users) => {
  localStorage.setItem("users", JSON.stringify(users));
};

// แปลง users เป็น array
export const usersToArray = (usersObj) => {
  return Object.keys(usersObj).map((email) => usersObj[email]);
};

// เปลี่ยน role
export const updateUserRole = (email, newRole) => {
  const users = loadUsers();
  if (!users[email]) return false;

  users[email].role = newRole;
  saveUsers(users);
  return true;
};

// ban user
export const banUser = (email) => {
  const users = loadUsers();
  if (!users[email]) return false;

  users[email].status = "banned";
  saveUsers(users);
  return true;
};

// unban user
export const unbanUser = (email) => {
  const users = loadUsers();
  if (!users[email]) return false;

  users[email].status = "active";
  saveUsers(users);
  return true;
};

// ลบผู้ใช้
export const deleteUserDB = (email) => {
  const users = loadUsers();
  if (!users[email]) return false;

  delete users[email];
  saveUsers(users);
  return true;
};

// เพิ่มผู้ใช้ใหม่
export const addUserDB = (email, username, role) => {
  const users = loadUsers();

  if (users[email]) return false;

  users[email] = {
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

  saveUsers(users);
  return true;
};

// ค้นหา
export const searchUsers = (list, text) => {
  return list.filter(
    (u) =>
      u.email.toLowerCase().includes(text.toLowerCase()) ||
      u.username.toLowerCase().includes(text.toLowerCase())
  );
};

// Filter ตาม role/status
export const filterUsers = (list, role, status) => {
  return list.filter((u) => {
    const okRole = role === "all" || u.role === role;
    const okStatus = status === "all" || (u.status || "active") === status;
    return okRole && okStatus;
  });
};

// Pagination
export const paginate = (list, page, perPage) => {
  const start = (page - 1) * perPage;
  return list.slice(start, start + perPage);
};

// Export CSV
export const exportCSV = (list) => {
  const header = "email,username,role,status,joinDate\n";
  const rows = list
    .map((u) => `${u.email},${u.username},${u.role},${u.status},${u.joinDate}`)
    .join("\n");

  const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "users_export.csv";
  a.click();
};
