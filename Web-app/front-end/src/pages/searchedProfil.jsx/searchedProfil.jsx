// src/pages/profile/searchedProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DumbProfile from "../profile/dumbProfile";

const SearchedProfile = () => {
  const { id } = useParams(); // ID ici est soit user.id (UUID) ou firebase_uid
  const navigate = useNavigate();

  const [postList, setPostList] = useState([]);
  const [pageInt, setPageInt] = useState(1);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        // Nettoyage pour éviter l'empilement de posts
        setPostList([]);

        // 🔹 Récupération des infos de l'utilisateur visité
        const userRes = await axios.get(`http://localhost:5000/user/${id}`);
        const data = userRes.data;

        setFirstName(data.first_name);
        setLastName(data.last_name);
        setEmail(data.email);
        setBirthday(new Date(data.birthday).toLocaleDateString());
        setUserId(data.id);

        // 🔹 Récupération des posts de cet utilisateur
        const postRes = await axios.get(`http://localhost:5000/posts/user/${data.id}?page=${pageInt}`);
        setPostList(postRes.data.posts);

        console.log("Profil visité :", data.first_name, data.last_name);

      } catch (error) {
        console.error("Erreur lors de la récupération du profil visité :", error);
      }
    };

    fetchData();
  }, [id, pageInt]);

  const handleDetails = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handleClick = () => {
    setPageInt((prev) => prev + 1);
  };

  return (
    <DumbProfile
      firstName={firstName}
      lastName={lastName}
      userId={userId}
      email={email}
      birthday={birthday}
      postList={postList}
      handleDetails={handleDetails}
      handleDeletePost={() => {}} // Rien ici, car pas autorisé
      handleClick={handleClick}
      isOwnProfile={false} // Important pour ne pas afficher "Supprimer"
    />
  );
};

export default SearchedProfile;
