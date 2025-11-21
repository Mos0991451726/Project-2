import React from "react";
import styles from "../styles/Comment.module.css";

function Comment({ user, text }) {
  return (
    <div className={styles.comment}>
      <strong className={styles.user}>{user}</strong>: {text}
    </div>
  );
}

export default Comment;
