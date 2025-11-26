import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Comment.module.css";

function Comment({ user, email, text }) {
  return (
    <div className={styles.comment}>
      
      <Link 
        to={`/profile/${email}`} 
        className={styles.user}
        style={{ textDecoration: "none", fontWeight: "bold" }}
      >
        {user}
      </Link>
      
      : {text}
    </div>
  );
}

export default Comment;
