import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useProperties } from "../context/PropertyContext";
import AdminSidebar from "../components/AdminSidebar";
import PropertyPopup from "../components/PropertyPopup";
import styles from "../styles/AdminProperties.module.css";
import Swal from "sweetalert2";


function AdminProperties() {
  const { properties, approveProperty, rejectProperty, closeProperty, deleteProperty, reopenProperty } = useProperties();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const ITEMS_PER_PAGE = 10;

  // ⭐ FILTERED LIST
  const filtered = useMemo(() => {
    return properties
      .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
      .filter((p) => (filterType === "all" ? true : p.type === filterType))
      .filter((p) => (filterStatus === "all" ? true : p.status === filterStatus));
  }, [properties, search, filterType, filterStatus]);

  // ⭐ PAGINATION
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(start, start + ITEMS_PER_PAGE);

  const approveAllPending = () => {
    properties
      .filter((p) => p.status === "pending")
      .forEach((p) => approveProperty(p.id));
  };

  const badgeClass = (status) => {
    if (status === "pending") return styles.badgePending;
    if (status === "approved") return styles.badgeApproved;
    if (status === "closed") return styles.badgeClosed;
    return styles.badgeRejected;
  };

  const formatThumb = (img) => {
    return img instanceof Blob ? URL.createObjectURL(img) : img || "/assets/no-image.png";
  };

  return (
    <div className={styles.layout}>
      <AdminSidebar />

      <div className={styles.content}>
        <h1 className={styles.title}>🏠 จัดการประกาศอสังหา</h1>

        {/* 🔎 Search + Filters */}
        <div className={styles.filters}>
          <input
            type="text"
            placeholder="ค้นหาชื่อประกาศ..."
            className={styles.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select className={styles.select} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">ทุกประเภท</option>
            <option value="ขาย">ขาย</option>
            <option value="เช่า">เช่า</option>
          </select>

          <select className={styles.select} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">ทุกสถานะ</option>
            <option value="pending">รออนุมัติ</option>
            <option value="approved">อนุมัติแล้ว</option>
            <option value="closed">ปิดประกาศ</option>
            <option value="rejected">ถูกปฏิเสธ</option>
          </select>

          <button className={styles.bulkBtn} onClick={approveAllPending}>
            ✔️ อนุมัติทั้งหมด
          </button>
        </div>

        {/* TABLE */}
        {paginated.length === 0 ? (
          <p>ไม่พบประกาศ</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>รูป</th>
                <th>ชื่อ</th>
                <th>ประเภท</th>
                <th>ราคา</th>
                <th>สถานะ</th>
                <th>ดำเนินการ</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((p) => (
                <tr key={p.id}>
                  <td>
                    <img src={formatThumb(p.image)} alt="thumb" className={styles.thumb} />
                  </td>

                  <td>{p.title}</td>
                  <td>{p.type}</td>
                  <td>{p.price}</td>

                  <td>
                    <span className={badgeClass(p.status)}>
                      {p.status === "pending"
                        ? "⌛ รออนุมัติ"
                        : p.status === "approved"
                          ? "✔️ อนุมัติแล้ว"
                          : p.status === "closed"
                            ? "🚫 ปิดประกาศ"
                            : "❌ ถูกปฏิเสธ"}
                    </span>
                  </td>

                  <td className={styles.actions}>

                    {/* 🔍 ดูเพิ่ม */}
                    <button
                      onClick={() => setSelectedProperty(p)}
                      className={styles.viewBtn}
                    >
                      🔍 ดูเพิ่ม
                    </button>

                    {/* 🟢 อนุมัติ */}
                    {p.status === "pending" && (
                      <button
                        onClick={() => approveProperty(p.id)}
                        className={styles.approveBtn}
                      >
                        ✔️ อนุมัติ
                      </button>
                    )}

                    {/* 🔴 ปิดประกาศ (เฉพาะ approved เท่านั้น) */}
                    {p.status === "approved" && (
                      <button
                        onClick={() => closeProperty(p.id)}
                        className={styles.closeBtn}
                      >
                        🚫 ปิดประกาศ
                      </button>
                    )}
                    {p.status === "closed" && (
                      <button
                        onClick={() => reopenProperty(p.id)}
                        className={styles.reopenBtn}
                      >
                        🔓 เปิดประกาศอีกครั้ง
                      </button>
                    )}
                    {/* ❌ ลบประกาศ (อนุญาตทุกสถานะ) */}
                    <button
                      onClick={() => {
                        Swal.fire({
                          title: "ลบประกาศ?",
                          text: "คุณต้องการลบประกาศนี้จริงหรือไม่?",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#d33",
                          cancelButtonColor: "#3085d6",
                          confirmButtonText: "ลบ",
                          cancelButtonText: "ยกเลิก",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            deleteProperty(p.id);

                            Swal.fire({
                              icon: "success",
                              title: "ลบประกาศสำเร็จ",
                            });
                          }
                        });
                      }}
                      className={styles.deleteBtn}
                    >
                      🗑 ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* PAGINATION */}
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              className={`${styles.pageBtn} ${page === num ? styles.activePage : ""}`}
              onClick={() => setPage(num)}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <PropertyPopup data={selectedProperty} onClose={() => setSelectedProperty(null)} />
    </div>
  );
}

export default AdminProperties;
