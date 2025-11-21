import React, { useState } from "react";

function LikeButton({ count }) {
  const [likes, setLikes] = useState(count);
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
    setLikes(likes + (liked ? -1 : 1));
  };

  return (
    <button onClick={toggleLike}>
      {liked ? "❤️" : "🤍"} ถูกใจ ({likes})
    </button>
  );
}

export default LikeButton;
