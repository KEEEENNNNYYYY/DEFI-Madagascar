// src/pages/profile/dumbProfile.jsx
import React from "react";

const DumbProfile = ({
    firstName,
    lastName,
    userId,
    email,
    birthday,
    postList,
    handleDetails,
    handleDeletePost,
    handleClick,
    isOwnProfile
}) => {
    return (
        <div className="profile-container">
            <h2>{firstName} {lastName}</h2>
            <p><strong>ID :</strong> {userId}</p>
            <p><strong>Email :</strong> {email}</p>
            <p><strong>Anniversaire :</strong> {birthday}</p>

            <h3>Mes publications :</h3>
            <ul className="post-list">
                {postList.map((post) => (
                    <li key={post.id} className="post-item">
                        <img src={post.image_url} alt={post.title} />
                        <div>
                            <h3>{post.title}</h3>
                            <p>{post.description}</p>
                            <p><small>Créé le : {new Date(post.created_at).toLocaleDateString()}</small></p>
                            <div className="btn-group">
                                <button onClick={() => handleDetails(post.id)}>Détails</button>
                

                                {isOwnProfile && (
                                    <button onClick={() => handleDeletePost(post.id)} className="danger">
                                        Supprimer
                                    </button>
                                )}

                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            {postList.length > 0 && <button onClick={handleClick}>Charger plus</button>}
        </div>
    );
};

export default DumbProfile;
