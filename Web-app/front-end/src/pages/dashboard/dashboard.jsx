// src/components/Dashboard/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DumbDashboard from "./dumbDashboard";

const Dashboard = () => {
  const [postList, setPostList] = useState([]);
  const [pageInt, setPageInt] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/posts?page=${pageInt}&limit=10`);
        const newPosts = response.data.posts;

        setPostList((prev) => {
          const allPosts = [...prev, ...newPosts];
          const unique = Array.from(new Map(allPosts.map((post) => [post.id, post])).values());
          return unique;
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des posts :", error);
      }
    };

    fetchPosts();
  }, [pageInt]);

  const handleClick = () => {
    setPageInt((prev) => prev + 1);
  };

  const handleDetails = (postId) => {
    navigate(`/post/${postId}`);
  };

  return (
    <DumbDashboard
      postList={postList}
      onLoadMore={handleClick}
      onPostClick={handleDetails}
    />
  );
};

export default Dashboard;
