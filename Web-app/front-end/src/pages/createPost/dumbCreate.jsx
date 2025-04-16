// src/components/CreatePost/DumbCreatePost.jsx
import React from "react";

const DumbCreatePost = ({
  title,
  setTitle,
  description,
  setDescription,
  imageUrl,
  isUploading,
  handleFileChange,
  handleDrop,
  dragOver,
  setDragOver,
  handleSubmit,
  error,
  successMessage,
  latestPostImage
}) => {
  return (
    <div className="create-post-container">
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
          className={`drop-area ${dragOver ? "drag-over" : ""}`}
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

      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      {latestPostImage && (
        <div className="last-image-preview">
          <h3>Dernière image postée :</h3>
          <img src={latestPostImage} alt="Dernier post" style={{ maxWidth: "100%" }} />
        </div>
      )}
    </div>
  );
};

export default DumbCreatePost;
