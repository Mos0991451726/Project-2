export function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("PostDB", 2);

        request.onupgradeneeded = (e) => {
            const db = e.target.result;

            // สร้าง store สำหรับโพสต์
            if (!db.objectStoreNames.contains("posts")) {
                db.createObjectStore("posts", { keyPath: "id", autoIncrement: true });
            }

            // ⭐ เพิ่ม store สำหรับรายงานโพสต์
            if (!db.objectStoreNames.contains("reports")) {
                db.createObjectStore("reports", { keyPath: "id", autoIncrement: true });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/* ---------------------------------------------------
   📌 Posts (โพสต์)
--------------------------------------------------- */

export async function getAllPosts() {
    const db = await openDB();
    return new Promise((resolve) => {
        const tx = db.transaction("posts", "readonly");
        const store = tx.objectStore("posts");
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result);
    });
}

export async function addPostDB(post) {
    const db = await openDB();
    return new Promise((resolve) => {
        const tx = db.transaction("posts", "readwrite");
        const store = tx.objectStore("posts");
        const req = store.add(post);
        req.onsuccess = () => resolve(req.result); // ส่งคืน id
    });
}

export async function updatePostDB(post) {
    const db = await openDB();
    return new Promise((resolve) => {
        const tx = db.transaction("posts", "readwrite");
        const store = tx.objectStore("posts");
        store.put(post);
        tx.oncomplete = () => resolve(true);
    });
}

export async function deletePostDB(id) {
    const db = await openDB();
    return new Promise((resolve) => {
        const tx = db.transaction("posts", "readwrite");
        const store = tx.objectStore("posts");
        store.delete(id);
        tx.oncomplete = () => resolve(true);
    });
}

/* ---------------------------------------------------
   📌 Reports (รายงานโพสต์)
--------------------------------------------------- */

export async function addReportDB(report) {
    const db = await openDB();
    return new Promise((resolve) => {
        const tx = db.transaction("reports", "readwrite");
        const store = tx.objectStore("reports");
        store.add(report);
        tx.oncomplete = () => resolve(true);
    });
}

export async function getAllReports() {
    const db = await openDB();
    return new Promise((resolve) => {
        const tx = db.transaction("reports", "readonly");
        const store = tx.objectStore("reports");
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result);
    });
}

export async function deleteReportDB(id) {
    const db = await openDB();
    return new Promise((resolve) => {
        const tx = db.transaction("reports", "readwrite");
        const store = tx.objectStore("reports");
        store.delete(id);
        tx.oncomplete = () => resolve(true);
    });
}
