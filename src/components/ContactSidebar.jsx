import React, { useState } from "react";
import styles from "../styles/Profile.module.css";
import { FaPhone, FaHome, FaInstagram, FaFacebook } from "react-icons/fa";
import { SiLine } from "react-icons/si";
import ContactEditModal from "./ContactEditModal";
import { useAuth } from "../context/AuthContext";

function ContactSidebar({ user }) {
  const { user: currentUser, updateUser } = useAuth();
  const [openEdit, setOpenEdit] = useState(false);

  const isOwner = currentUser?.email === user.email;

  const handleSave = (updatedInfo) => {
    updateUser(updatedInfo);
  };

  return (
    <div className={styles.contactCard}>
      <h3 className={styles.contactTitle}>ช่องทางการติดต่อ</h3>

      <ul className={styles.contactList}>
        {user.phone && <li><FaPhone /> {user.phone}</li>}
        {user.address && <li><FaHome /> {user.address}</li>}
        {user.facebook && <li><FaFacebook /> {user.facebook}</li>}
        {user.instagram && <li><FaInstagram /> @{user.instagram}</li>}
        {user.line && <li><SiLine /> {user.line}</li>}
      </ul>

      {isOwner && (
        <button
          className={styles.contactEditBtn}
          onClick={() => setOpenEdit(true)}
        >
          แก้ไขรายละเอียด
        </button>
      )}

      {openEdit && isOwner && (
        <ContactEditModal
          user={user}
          onClose={() => setOpenEdit(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default ContactSidebar;
