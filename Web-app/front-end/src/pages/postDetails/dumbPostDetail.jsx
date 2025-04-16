// src/components/PostDetail/DumbPostDetail.jsx
import React from "react";

const DumbPostDetail = ({ post }) => {
  if (!post) return <p>Chargement...</p>;

  return (
    <div>
      <h2>{post.title}</h2>
      <img src={post.image_url} alt={post.title} style={{ width: "300px" }} />
      <p>{post.description}</p>
      <p>
        <small>Créé le : {new Date(post.created_at).toLocaleDateString()}</small>
      </p>
    </div>
  );
};

export default DumbPostDetail;
