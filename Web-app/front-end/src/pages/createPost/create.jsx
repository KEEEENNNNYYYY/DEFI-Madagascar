import React, { useState } from "react";
import { auth } from "../../utils/firebase";
import axios from "axios";

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [latestPostImage, setLatestPostImage] = useState(""); // <- 🆕
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [imagePublicId, setImagePublicId] = useState(""); // <- 🆕


    const user = auth.currentUser;

    const cloudName = "dyjrnhldt";
    const uploadPreset = "addImage";

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            formData
        );

        const { secure_url, public_id } = response.data;
        return { secure_url, public_id }; // <- on retourne les deux
    };


    const handleFile = async (file) => {
        try {
            setIsUploading(true);
            const { secure_url, public_id } = await uploadToCloudinary(file);
            setImageUrl(secure_url);
            setImageFile(file);
            setImagePublicId(public_id);

            // 👇 si tu veux, tu peux stocker le public_id dans un useState aussi
            // setImagePublicId(public_id);
        } catch (err) {
            setError("Échec de l'upload de l'image");
        } finally {
            setIsUploading(false);
        }
    };


    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            handleFile(file);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            handleFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage("");

        if (!user) {
            setError("L'utilisateur n'est pas connecté.");
            return;
        }

        try {
            await axios.post("http://localhost:5000/posts", {
                title,
                description,
                image_url: imageUrl,
                public_id: imagePublicId, // <- 🆕
                user_id: user.uid,
            });


            setSuccessMessage("Post créé avec succès !");
            setLatestPostImage(imageUrl); // <- 🆕 stocke l’image après post
            setTitle("");
            setDescription("");
            setImageFile(null);
            setImageUrl("");
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        }
    };

    return (
        <div style={{ maxWidth: "500px", margin: "0 auto" }}>
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

                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    style={{
                        margin: "10px 0",
                        padding: "20px",
                        border: "2px dashed #ccc",
                        borderRadius: "10px",
                        backgroundColor: dragOver ? "#e3f2fd" : "#fafafa",
                        textAlign: "center",
                    }}
                >
                    <p>Glissez-déposez une image ici ou cliquez pour en choisir une</p>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                        id="fileInput"
                    />
                    <label htmlFor="fileInput" style={{ cursor: "pointer", color: "blue" }}>
                        Choisir un fichier
                    </label>
                </div>

                {imageUrl && (
                    <div style={{ textAlign: "center", margin: "10px 0" }}>
                        <img src={imageUrl} alt="Aperçu" style={{ maxWidth: "100%" }} />
                    </div>
                )}

                <button type="submit" disabled={isUploading || !imageUrl}>
                    {isUploading ? "Envoi de l'image..." : "Créer un post"}
                </button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

            {/* 🆕 Affiche l’image du dernier post */}
            {latestPostImage && (
                <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <h3>Dernière image postée :</h3>
                    <img src={latestPostImage} alt="Dernier post" style={{ maxWidth: "100%" }} />
                </div>
            )}
        </div>
    );
};

export default CreatePost;
