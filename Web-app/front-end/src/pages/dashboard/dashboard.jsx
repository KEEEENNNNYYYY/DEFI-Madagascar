import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [postList, setPostList] = useState([]);
  const [pageInt, setPageInt] = useState(1);
  const navigate = useNavigate(); // pour la navigation

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/posts?page=${pageInt}&limit=10`);
        const newPosts = response.data.posts;

        setPostList(prev => {
          const allPosts = [...prev, ...newPosts];
          const unique = Array.from(new Map(allPosts.map(post => [post.id, post])).values());
          return unique;
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des posts :", error);
      }
    };

    fetchPosts();
  }, [pageInt]);

  const handleClick = () => {
    setPageInt(prev => prev + 1);
  };

  const handleDetails = (postId) => {
    navigate(`/post/${postId}`);
  };

  return (
    <div>
       
      <h2>Dashboard</h2>
      <ul>
        {postList.map((post) => (
          <li key={post.id}>
            <img src={post.image_url} alt={post.title} style={{ width: "100px" }} />
            <h3>{post.title}</h3>
            <p>{post.description}</p>
            <p><small>Créé le : {new Date(post.created_at).toLocaleDateString()}</small></p>
            <button onClick={() => handleDetails(post.id)}>details</button>
          </li>
        ))}
      </ul>
      <button onClick={handleClick}>Charger plus</button>
    </div>
  );
};

export default Dashboard;
