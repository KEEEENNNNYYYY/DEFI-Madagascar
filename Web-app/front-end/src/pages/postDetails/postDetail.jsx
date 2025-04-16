import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PostDetail = () => {
  const { post_id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`https://defi-madagascar-1.onrender.com/posts/${post_id}`);
        setPost(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération du post :", error);
      }
    };

    fetchPost();
  }, [post_id]);

  if (!post) return <p>Chargement...</p>;

  return (
    <div>
      <h2>{post.title}</h2>
      <img src={post.image_url} alt={post.title} style={{ width: "300px" }} />
      <p>{post.description}</p>
      <p><small>Créé le : {new Date(post.created_at).toLocaleDateString()}</small></p>
    </div>
  );
};

export default PostDetail;
