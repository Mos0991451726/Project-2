// pages/AdminUsers.jsx
import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import UserModal from "../components/UserModal";
import AddUserModal from "../components/AddUserModal";
import {
  loadUsers,
  saveUsers,
  usersToArray,
  updateUserRole,
  banUser,
  unbanUser,
  deleteUserDB,
  addUserDB,
  searchUsers,
  filterUsers,
  paginate,
} from "../utils/userDB";

import styles from "../styles/AdminUsers.module.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [page, setPage] = useState(1);
  const perPage = 5;

  const [viewUser, setViewUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // โหลดผู้ใช้ครั้งแรก
  useEffect(() => {
    reloadUsers();
  }, []);

  const reloadUsers = () => {
    const usersObj = loadUsers();
    setUsers(usersToArray(usersObj));
  };

  // filter + search
  let filtered = searchUsers(users, search);
  filtered = filterUsers(filtered, roleFilter, statusFilter);

  // pagination
  const totalPages = Math.ceil(filtered.length / perPage);
  const pagedUsers = paginate(filtered, page, perPage);

  // action functions
  const handleRoleChange = (email, newRole) => {
    updateUserRole(email, newRole);
    reloadUsers();
  };

  const handleBan = (email) => {
    banUser(email);
    reloadUsers();
  };

  const handleUnban = (email) => {
    unbanUser(email);
    reloadUsers();
  };

  const handleDelete = (email) => {
    if (!confirm("ต้องการลบผู้ใช้นี้หรือไม่")) return;
    deleteUserDB(email);
    reloadUsers();
  };

  const handleAddUser = (email, username, role) => {
    addUserDB(email, username, role);
    reloadUsers();
    setShowAddModal(false);
  };

  return (
    <div className={styles.layout}>
      <AdminSidebar />

      <div className={styles.content}>
        <h1 className={styles.title}>👤 จัดการผู้ใช้ทั้งหมด</h1>

        {/* Search / Filter */}
        <div className={styles.filters}>
          <input
            className={styles.searchInput}
            placeholder="ค้นหาผู้ใช้..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className={styles.selectBox}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">Role: ทั้งหมด</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <select
            className={styles.selectBox}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">สถานะ: ทั้งหมด</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </select>

          <button className={styles.addBtn} onClick={() => setShowAddModal(true)}>
            ➕ เพิ่มผู้ใช้
          </button>
        </div>

        {/* Users Table */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Email</th>
              <th>ชื่อผู้ใช้</th>
              <th>Role</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {pagedUsers.map((u) => (
              <tr key={u.email}>
                <td>{u.email}</td>
                <td>{u.username}</td>
                <td>
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.email, e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>{u.status || "active"}</td>

                <td className={styles.actions}>
                  <button onClick={() => setViewUser(u)}>ดู</button>

                  {u.status === "banned" ? (
                    <button className={styles.unbanBtn} onClick={() => handleUnban(u.email)}>
                      ปลดแบน
                    </button>
                  ) : (
                    <button className={styles.banBtn} onClick={() => handleBan(u.email)}>
                      แบน
                    </button>
                  )}

                  <button className={styles.deleteBtn} onClick={() => handleDelete(u.email)}>
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className={styles.pagination}>
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            ⬅ Prev
          </button>

          <span>{page} / {totalPages}</span>

          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            Next ➡
          </button>
        </div>
      </div>

      {/* Popup อยู่ตรงนี้ → นอก content */}
      {viewUser && <UserModal user={viewUser} onClose={() => setViewUser(null)} />}
      {showAddModal && <AddUserModal onAdd={handleAddUser} onClose={() => setShowAddModal(false)} />}
    </div>
  );
}

export default AdminUsers;
