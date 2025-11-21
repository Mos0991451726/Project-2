import React from "react";

function ImageUpload({ onUpload }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpload(URL.createObjectURL(file));
    }
  };

  return <input type="file" accept="image/*" onChange={handleFileChange} />;
}

export default ImageUpload;
