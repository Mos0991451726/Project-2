import React, { useEffect, useState } from "react";
import { getAllReports, deleteReportDB } from "../utils/db";
import { usePosts } from "../context/PostContext";
import PostPopup from "../components/PostPopup";
import AdminSidebar from "../components/AdminSidebar";
import styles from "../styles/AdminReports.module.css";
import Swal from "sweetalert2";

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

    // ❌ ลบเฉพาะรายงาน
    const handleDeleteReport = async (id) => {
        const result = await Swal.fire({
            title: "ยืนยันการลบรายงาน?",
            text: "ลบแล้วจะไม่สามารถกู้คืนได้",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "ลบรายงาน",
            cancelButtonText: "ยกเลิก"
        });

        if (!result.isConfirmed) return;

        await deleteReportDB(id);
        setReports((prev) => prev.filter((r) => r.id !== id));

        Swal.fire({
            icon: "success",
            title: "ลบรายงานสำเร็จ",
            timer: 1200,
            showConfirmButton: false
        });
    };

    // 🗑 ลบโพสต์ + ลบรายงานที่เกี่ยวข้อง
    const handleDeletePost = async (postId, reportId) => {
        const result = await Swal.fire({
            title: "ต้องการลบโพสต์นี้จริงหรือไม่?",
            text: "โพสต์นี้จะถูกลบถาวรและไม่สามารถกู้คืนได้",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e74c3c",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "ลบโพสต์",
            cancelButtonText: "ยกเลิก"
        });

        if (!result.isConfirmed) return;

        await deletePost(postId);
        await deleteReportDB(reportId);

        setReports((prev) => prev.filter((r) => r.id !== reportId));

        Swal.fire({
            icon: "success",
            title: "ลบโพสต์และรายงานสำเร็จแล้ว",
            timer: 1500,
            showConfirmButton: false
        });
    };

    return (
        <div className={styles.layout}>
            <AdminSidebar />

            <div className={styles.content}>
                <h1 className={styles.title}>🚨 รายงานโพสต์ทั้งหมด</h1>

                {reports.length === 0 && (
                    <p className={styles.empty}>ยังไม่มีรายงาน</p>
                )}

                {reports.map((r) => (
                    <div key={r.id} className={styles.card}>
                        <div className={styles.row}><strong>โพสต์ ID:</strong> {r.postId}</div>
                        <div className={styles.row}><strong>ผู้รายงาน:</strong> {r.reporter?.email || "ไม่พบข้อมูล"}</div>
                        <div className={styles.row}><strong>เจ้าของโพสต์:</strong> {r.postOwner?.email || "ไม่พบข้อมูล"}</div>
                        <div className={styles.row}><strong>เหตุผล:</strong> {r.reason}</div>
                        <div className={styles.row}><strong>เวลา:</strong> {new Date(r.time).toLocaleString("th-TH")}</div>

                        <div className={styles.row}>
                            <strong>เนื้อหาโพสต์:</strong>{" "}
                            {typeof r.postContent === "string"
                                ? r.postContent
                                : r.postContent?.content || "ไม่มีเนื้อหา"}
                        </div>

                        <div className={styles.actions}>
                            <button
                                className={styles.viewBtn}
                                onClick={() =>
                                    setSelectedPost({
                                        owner: r.postOwner || {
                                            username: "ไม่พบชื่อผู้ใช้",
                                            avatar: "/assets/default-avatar.png"
                                        },
                                        content: r.postContent || "",
                                        image: r.postImage || null,
                                        time: r.time
                                    })
                                }
                            >
                                🔍 ดูโพสต์ต้นฉบับ
                            </button>

                            <button
                                className={styles.deletePostBtn}
                                onClick={() => handleDeletePost(r.postId, r.id)}
                            >
                                🗑 ลบโพสต์ต้นฉบับ
                            </button>

                            <button
                                className={styles.deleteReportBtn}
                                onClick={() => handleDeleteReport(r.id)}
                            >
                                ❌ ลบรายงานนี้
                            </button>
                        </div>
                    </div>
                ))}

                {selectedPost && (
                    <PostPopup
                        post={selectedPost}
                        onClose={() => setSelectedPost(null)}
                    />
                )}
            </div>
        </div>
    );
}

export default AdminReports;
