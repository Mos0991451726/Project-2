import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import styles from "../styles/AdminDashboard.module.css";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostContext";
import { useProperties } from "../context/PropertyContext";
import { loadUsers, usersToArray } from "../utils/userDB";
import Swal from "sweetalert2";

function AdminDashboard() {
  // ⭐ ใช้ updateUser จาก AuthContext
  const { user, updateUser } = useAuth();
  const { posts } = usePosts();
  const { properties } = useProperties();

  const [totalUsers, setTotalUsers] = useState(0);
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    username: "",
    phone: "",
    email: "",
    joinDate: "",
    role: "",
    status: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      const usersObj = await loadUsers();
      const arr = await usersToArray(usersObj);

      // ⭐ นับเฉพาะ Active users
      const activeUsers = arr.filter(u => (u.status || "active") === "active");
      setTotalUsers(activeUsers.length);

      // ⭐ โหลดข้อมูลแอดมินเข้าฟอร์ม
      const current = usersObj[user.email];
      if (current) {
        setProfile({
          username: current.username,
          phone: current.phone || "",
          email: current.email,
          joinDate: current.joinDate || "",
          role: current.role,
          status: current.status || "active",
        });
      }
    };

    fetchData();
  }, []);

  // ⭐ บันทึกข้อมูล
  const handleSave = async () => {
    // ตรวจสอบเบอร์โทรให้ครบ 10 หลัก
    if (!profile.phone.match(/^[0-9]{10}$/)) {
      Swal.fire({
        icon: "error",
        title: "เบอร์โทรไม่ถูกต้อง",
        text: "กรุณากรอกเบอร์โทรให้ครบ 10 หลัก!",
      });
      return;
    }

    // ใช้ updateUser (จาก AuthContext)
    await updateUser({
      username: profile.username,
      phone: profile.phone
    });

    Swal.fire({
      icon: "success",
      title: "บันทึกข้อมูลสำเร็จ!",
      timer: 1200,
      showConfirmButton: false,
    }).then(() => {
      window.location.reload();
    });
  };

  return (
    <div className={styles.layout}>
      <AdminSidebar />

      <div className={styles.content}>
        <h1 className={styles.title}>⚙️ ระบบจัดการ (Admin)</h1>
        <p>ยินดีต้อนรับ, {user.email}</p>

        {/* Cards */}
        <div className={styles.cards}>
          <div className={styles.card}>
            <h3>👥 ผู้ใช้ทั้งหมด (Active)</h3>
            <p>{totalUsers}</p>
          </div>

          <div className={styles.card}>
            <h3>📝 โพสต์ทั้งหมด</h3>
            <p>{posts.length}</p>
          </div>

          <div className={styles.card}>
            <h3>🏠 ประกาศทั้งหมด</h3>
            <p>{properties.length}</p>
          </div>
        </div>

        {/* Profile Block */}
        <div className={styles.profileBlock}>
          <h2 className={styles.profileTitle}>ข้อมูลผู้ดูแลระบบ (Admin)</h2>

          {!editing ? (
            <>
              <p className={styles.profileItem}><span>ชื่อผู้ใช้:</span> {profile.username}</p>
              <p className={styles.profileItem}><span>อีเมล:</span> {profile.email}</p>
              <p className={styles.profileItem}><span>เบอร์โทร:</span> {profile.phone || "ยังไม่มีข้อมูล"}</p>
              <p className={styles.profileItem}><span>ตำแหน่ง:</span> {profile.role}</p>
              <p className={styles.profileItem}><span>สถานะบัญชี:</span> {profile.status}</p>
              <p className={styles.profileItem}><span>วันที่เข้าร่วม:</span> {profile.joinDate}</p>

              <button className={styles.editBtn} onClick={() => setEditing(true)}>
                ✏️ แก้ไขข้อมูล
              </button>
            </>
          ) : (
            <>
              <label>ชื่อผู้ใช้</label>
              <input
                className={styles.profileInput}
                value={profile.username}
                onChange={(e) =>
                  setProfile({ ...profile, username: e.target.value })
                }
              />
              <label>เบอร์โทร</label>
              <input
                className={styles.profileInput}
                value={profile.phone}
                maxLength="10"
                onChange={(e) => {
                  // อนุญาตเฉพาะตัวเลข 0-9
                  const value = e.target.value.replace(/\D/g, "");
                  setProfile({ ...profile, phone: value });
                }}
              />

              <button className={styles.saveBtn} onClick={handleSave}>
                💾 บันทึกข้อมูล
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
