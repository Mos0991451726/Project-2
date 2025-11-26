// pages/AdminUsers.jsx
import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import UserModal from "../components/UserModal";
import Swal from "sweetalert2";
import AddUserModal from "../components/AddUserModal";
import { useAuth } from "../context/AuthContext";
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
  const { user } = useAuth();
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

  const reloadUsers = async () => {
    const usersObj = await loadUsers();     // ⭐ await สำคัญมาก
    const arr = await usersToArray(usersObj);
    setUsers(arr);
  };

  // filter + search
  let filtered = searchUsers(users, search);
  filtered = filterUsers(filtered, roleFilter, statusFilter);

  // pagination
  const totalPages = Math.ceil(filtered.length / perPage);
  const pagedUsers = paginate(filtered, page, perPage);

  // action functions
  const handleRoleChange = async (email, newRole) => {
    await updateUserRole(email, newRole);

    const updated = users.map((u) =>
      u.email === email ? { ...u, role: newRole } : u
    );
    setUsers(updated);

    Swal.fire({
      icon: "success",
      title: "อัปเดต Role สำเร็จ",
      text: `${email} → ${newRole}`,
      timer: 1400,
      showConfirmButton: false
    });
  };
  // ⭐ แบนผู้ใช้
  const handleBan = async (email) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "แบนผู้ใช้?",
      text: `คุณต้องการแบน ${email} ใช่หรือไม่?`,
      showCancelButton: true,
      confirmButtonText: "แบน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#e63946",
      cancelButtonColor: "#457b9d",
    });

    if (!confirm.isConfirmed) return;

    await banUser(email);

    const updated = users.map((u) =>
      u.email === email ? { ...u, status: "banned" } : u
    );
    setUsers(updated);

    Swal.fire({
      icon: "success",
      title: "แบนผู้ใช้สำเร็จ",
      timer: 1200,
      showConfirmButton: false
    });
  };


  // ⭐ ปลดแบนผู้ใช้
  const handleUnban = async (email) => {
    await unbanUser(email);

    const updated = users.map((u) =>
      u.email === email ? { ...u, status: "active" } : u
    );
    setUsers(updated);

    Swal.fire({
      icon: "success",
      title: "ปลดแบนสำเร็จ",
      timer: 1200,
      showConfirmButton: false
    });
  };

  // ⭐ ลบผู้ใช้
  const handleDelete = async (email) => {
    const result = await Swal.fire({
      title: "ลบผู้ใช้?",
      text: "คุณต้องการลบผู้ใช้นี้จริงหรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก"
    });

    if (!result.isConfirmed) return;

    await deleteUserDB(email);

    const updated = users.filter((u) => u.email !== email);
    setUsers(updated);

    Swal.fire({
      icon: "success",
      title: "ลบผู้ใช้สำเร็จ",
      timer: 1500,
      showConfirmButton: false
    });
  };

  // ⭐ เพิ่มผู้ใช้ใหม่
  const handleAddUser = async (email, username, role) => {
    const added = await addUserDB(email, username, role);

    if (!added) {
      Swal.fire({
        icon: "error",
        title: "เพิ่มผู้ใช้ไม่สำเร็จ",
        text: "อีเมลนี้มีอยู่แล้ว!",
      });
      return;
    }

    // โหลดใหม่แบบถูกต้อง
    const usersObj = await loadUsers();
    const arr = await usersToArray(usersObj);
    setUsers(arr);

    Swal.fire({
      icon: "success",
      title: "เพิ่มผู้ใช้สำเร็จ",
      text: `${username} (${email})`,
      timer: 1500,
      showConfirmButton: false
    });

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
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <select
            className={styles.selectBox}
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">Role: ทั้งหมด</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <select
            className={styles.selectBox}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
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
                    <button
                      className={styles.banBtn}
                      onClick={() => {
                        if (u.email === user.email) {
                          Swal.fire({
                            icon: "error",
                            title: "ห้ามแบนตัวเอง!",
                            text: "แอดมินไม่สามารถแบนบัญชีของตนเองได้",
                          });
                          return;
                        }
                        handleBan(u.email);
                      }}
                    >
                      แบน
                    </button>
                  )}

                  <button
                    className={styles.deleteBtn}
                    onClick={() => {
                      if (u.email === user.email) {
                        Swal.fire({
                          icon: "error",
                          title: "ไม่สามารถลบบัญชีของคุณเองได้",
                          text: "แอดมินไม่สามารถลบบัญชีตัวเองได้",
                        });
                        return;
                      }

                      handleDelete(u.email);
                    }}
                  >
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
