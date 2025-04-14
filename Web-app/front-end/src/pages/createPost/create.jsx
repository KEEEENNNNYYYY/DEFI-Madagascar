import React, { useState } from "react";
import { auth } from "../../utils/firebase"; 
import axios from "axios";

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    // Récupérer l'utilisateur actuellement connecté
    const user = auth.currentUser;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage("");

        if (!user) {
            setError("L'utilisateur n'est pas connecté.");
            return;
        }

        try {
            // Envoyer les données à ton backend Express avec axios
            const response = await axios.post("http://localhost:5000/posts", {
                title,
                description,
                image_url: imageUrl,
                user_id: user.uid, // Envoie l'ID de l'utilisateur connecté
            });

            setSuccessMessage("Post créé avec succès !");
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "0 auto" }}>
            <h2>Créer un post</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Titre :</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description :</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Image URL :</label>
                    <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Créer un post</button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        </div>
    );
};


export default CreatePost;
