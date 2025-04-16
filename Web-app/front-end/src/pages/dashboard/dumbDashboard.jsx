// src/components/Dashboard/DumbDashboard.jsx
import React from "react";

const DumbDashboard = ({ postList, onLoadMore, onPostClick }) => {
  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <ul className="post-list">
        {postList.map((post) => (
          <li key={post.id} className="post-item">
            <img src={post.image_url} alt={post.title} style={{ width: "100px" }} />
            <h3>{post.title}</h3>
            <p>{post.description}</p>
            <p>
              <small>Créé le : {new Date(post.created_at).toLocaleDateString()}</small>
            </p>
            <button onClick={() => onPostClick(post.id)}>Détails</button>
          </li>
        ))}
      </ul>
      <button onClick={onLoadMore}>Charger plus</button>
    </div>
  );
};

export default DumbDashboard;
