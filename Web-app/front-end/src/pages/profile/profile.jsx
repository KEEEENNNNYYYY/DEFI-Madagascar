// src/components/Profile/Profile.jsx
import React, { useEffect, useState } from "react";
import { auth } from "../../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DumbProfile from "./dumbProfile";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [postList, setPostList] = useState([]);
  const [pageInt, setPageInt] = useState(1);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [userId, setUserId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const postRes = await axios.get(`http://localhost:5000/posts/user/${user.uid}?page=${pageInt}`);
        const newPosts = postRes.data.posts;

        setPostList((prev) => {
          const allPosts = [...prev, ...newPosts];
          const unique = Array.from(new Map(allPosts.map(post => [post.id, post])).values());
          return unique;
        });

        const userRes = await axios.get(`http://localhost:5000/user/${user.uid}`);
        const data = userRes.data;

        setFirstName(data.first_name);
        setLastName(data.last_name);
        setEmail(data.email);
        setBirthday(new Date(data.birthday).toLocaleDateString());
        setUserId(data.id);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchData();
  }, [pageInt, user]);

  const handleDetails = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/posts/${postId}`);
      setPostList(prev => prev.filter(post => post.id !== postId));
    } catch (error) {
      console.error("Erreur lors de la suppression du post :", error);
    }
  };

  const handleClick = () => {
    setPageInt((prev) => prev + 1);
  };

  if (!user) return <p>Chargement du profil...</p>;

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
    />
  );
};

export default Profile;
