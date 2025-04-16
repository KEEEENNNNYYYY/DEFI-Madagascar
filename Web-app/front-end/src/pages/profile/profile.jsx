// src/pages/profile/profile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import DumbProfile from "./dumbProfile";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [postList, setPostList] = useState([]);
  const [pageInt, setPageInt] = useState(1);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [userId, setUserId] = useState("");
  const [isOwnProfile, setIsOwnProfile] = useState(true); // toujours true ici

  // Authentifie l'utilisateur Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // Récupère le profil connecté + ses posts
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Nettoyage des anciens posts
        setPostList([]);

        // Récupère infos utilisateur via son firebase_uid
        const userRes = await axios.get(`http://localhost:5000/user/${user.uid}`);
        const data = userRes.data;

        setFirstName(data.first_name);
        setLastName(data.last_name);
        setEmail(data.email);
        setBirthday(new Date(data.birthday).toLocaleDateString());
        setUserId(data.id);

        console.log("Profil connecté :", user.uid, "| User ID DB:", data.id);

        // Récupère ses publications
        const postRes = await axios.get(`http://localhost:5000/posts/user/${data.id}?page=${pageInt}`);
        setPostList(postRes.data.posts);

      } catch (error) {
        console.error("Erreur lors de la récupération du profil :", error);
      }
    };

    fetchData();
  }, [user, pageInt]);

  const handleDetails = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = await user.getIdToken();
      const res = await axios.delete(`http://localhost:5000/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Post supprimé :", res.data);
      setPostList((prev) => prev.filter((post) => post.id !== postId));
    } catch (error) {
      if (error.response?.status === 403) {
        alert("❌ Vous n'avez pas le droit de supprimer ce post.");
      } else {
        console.error("Erreur suppression post :", error.message);
      }
    }
  };

  const handleClick = () => {
    setPageInt((prev) => prev + 1);
  };

  if (!user) return <p>Chargement de votre profil...</p>;

  return (
    <DumbProfile
      firstName={firstName}
      lastName={lastName}
      userId={userId}
      email={email}
      birthday={birthday}
      postList={postList}
      handleDetails={handleDetails}
      handleDeletePost={handleDeletePost}
      handleClick={handleClick}
      isOwnProfile={true}
    />
  );
};

export default Profile;
