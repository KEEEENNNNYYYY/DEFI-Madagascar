// src/components/CreatePost/CreatePost.jsx
import React, { useState } from "react";
import { auth } from "../../utils/firebase";
import axios from "axios";
import DumbCreatePost from "./dumbCreate";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [latestPostImage, setLatestPostImage] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [imagePublicId, setImagePublicId] = useState("");

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
    return { secure_url, public_id };
  };

  const handleFile = async (file) => {
    try {
      setIsUploading(true);
      const { secure_url, public_id } = await uploadToCloudinary(file);
      setImageUrl(secure_url);
      setImageFile(file);
      setImagePublicId(public_id);
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
      await axios.post("https://defi-madagascar-1.onrender.com/posts", {
        title,
        description,
        image_url: imageUrl,
        public_id: imagePublicId,
        user_id: user.uid,
      });

      setSuccessMessage("Post créé avec succès !");
      setLatestPostImage(imageUrl);
      setTitle("");
      setDescription("");
      setImageFile(null);
      setImageUrl("");
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <DumbCreatePost
      title={title}
      setTitle={setTitle}
      description={description}
      setDescription={setDescription}
      imageUrl={imageUrl}
      isUploading={isUploading}
      handleFileChange={handleFileChange}
      handleDrop={handleDrop}
      dragOver={dragOver}
      setDragOver={setDragOver}
      handleSubmit={handleSubmit}
      error={error}
      successMessage={successMessage}
      latestPostImage={latestPostImage}
    />
  );
};

export default CreatePost;
