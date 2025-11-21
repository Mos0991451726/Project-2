import React from "react";
import { mockPosts } from "../data/mockPosts";
import Post from "../components/Post";

function MyPosts() {
  const myName = "คุณผู้ใช้";
  const myPosts = mockPosts.filter((p) => p.user === myName);

  return (
    <div className="my-posts">
      <h1>📜 โพสต์ของฉัน</h1>
      {myPosts.length === 0 ? (
        <p>ยังไม่มีโพสต์</p>
      ) : (
        myPosts.map((p) => <Post key={p.id} post={p} />)
      )}
    </div>
  );
}

export default MyPosts;
