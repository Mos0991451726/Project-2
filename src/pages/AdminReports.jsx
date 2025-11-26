import React, { useEffect, useState } from "react";
import { getAllReports, deleteReportDB } from "../utils/db";
import { usePosts } from "../context/PostContext";
import PostPopup from "../components/PostPopup";
import AdminSidebar from "../components/AdminSidebar";   // ⭐ เพิ่ม
import styles from "../styles/AdminReports.module.css";

function AdminReports() {
    const [reports, setReports] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const { deletePost } = usePosts();

    useEffect(() => {
        getAllReports().then((data) => {
            const sorted = data.sort((a, b) => new Date(b.time) - new Date(a.time));
            setReports(sorted);
        });
    }, []);

    const handleDeleteReport = async (id) => {
        await deleteReportDB(id);
        setReports((prev) => prev.filter((r) => r.id !== id));
    };

    const handleDeletePost = async (postId, reportId) => {
        if (!confirm("ต้องการลบโพสต์นี้จริงหรือไม่ ?")) return;
        await deletePost(postId);
        await deleteReportDB(reportId);
        setReports((prev) => prev.filter((r) => r.id !== reportId));
        alert("ลบโพสต์และรายงานสำเร็จ");
    };

    return (
        <div className={styles.layout}>    {/* ⭐ layout หลัก */}

            <AdminSidebar />               {/* ⭐ แสดง Sidebar */}

            <div className={styles.content}>  {/* ⭐ content อยู่ขวา */}
                <h1 className={styles.title}>🚨 รายงานโพสต์ทั้งหมด</h1>

                {reports.length === 0 && (
                    <p className={styles.empty}>ยังไม่มีรายงาน</p>
                )}

                {reports.map((r) => (
                    <div key={r.id} className={styles.card}>
                        <div className={styles.row}><strong>โพสต์ ID:</strong> {r.postId}</div>
                        <div className={styles.row}>
                            <strong>ผู้รายงาน:</strong> {r.reporter?.email || "ไม่พบข้อมูล"}
                        </div>

                        <div className={styles.row}>
                            <strong>เจ้าของโพสต์:</strong> {r.postOwner?.email || "ไม่พบข้อมูล"}
                        </div>
                        <div className={styles.row}><strong>เหตุผล:</strong> {r.reason}</div>
                        <div className={styles.row}><strong>เวลา:</strong> {new Date(r.time).toLocaleString("th-TH")}</div>
                        {/* เนื้อหาโพสต์ */}
                        <div className={styles.row}>
                            <strong>เนื้อหาโพสต์:</strong>{" "}
                            {
                                typeof r.postContent === "string"
                                    ? r.postContent
                                    : r.postContent?.content || "ไม่มีเนื้อหา"
                            }
                        </div>
                        <div className={styles.actions}>
                            <button type="button" className={styles.viewBtn}
                                onClick={() =>
                                    setSelectedPost({
                                        owner: r.postOwner || { username: "ไม่พบชื่อผู้ใช้", avatar: "/assets/default-avatar.png" },
                                        content: r.postContent || "",
                                        image: r.postImage || null,
                                        time: r.time
                                    })
                                }>
                                🔍 ดูโพสต์ต้นฉบับ
                            </button>

                            <button type="button" className={styles.deletePostBtn}
                                onClick={() => handleDeletePost(r.postId, r.id)}>
                                🗑 ลบโพสต์ต้นฉบับ
                            </button>

                            <button type="button" className={styles.deleteReportBtn}
                                onClick={() => handleDeleteReport(r.id)}>
                                ❌ ลบรายงานนี้
                            </button>
                        </div>
                    </div>
                ))}

                {selectedPost && (
                    <PostPopup post={selectedPost} onClose={() => setSelectedPost(null)} />
                )}
            </div>
        </div >
    );
}

export default AdminReports;
