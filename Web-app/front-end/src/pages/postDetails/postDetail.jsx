// src/components/PostDetail/PostDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DumbPostDetail from "./dumbPostDetail";

const PostDetail = () => {
  const { post_id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/posts/${post_id}`);
        setPost(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération du post :", error);
      }
    };

    fetchPost();
  }, [post_id]);

  return <DumbPostDetail post={post} />;
};

export default PostDetail;
