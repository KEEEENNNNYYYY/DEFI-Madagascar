import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import DumbProfile from "./dumbProfile";

const Profile = () => {
  const { id } = useParams(); // récupère l'ID dans l'URL
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [postList, setPostList] = useState([]);
  const [pageInt, setPageInt] = useState(1);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (!id) {
      const unsubscribe = onAuthStateChanged(auth, (u) => {
        if (u) setUser(u);
      });
      return () => unsubscribe();
    }
  }, [id]);

  useEffect(() => {
    const fetchData = async (targetUserId) => {
      try {
        const postRes = await axios.get(`http://localhost:5000/posts/user/${targetUserId}?page=${pageInt}`);
        const newPosts = postRes.data.posts;

        setPostList((prev) => {
          const allPosts = [...prev, ...newPosts];
          const unique = Array.from(new Map(allPosts.map(post => [post.id, post])).values());
          return unique;
        });

        const userRes = await axios.get(`http://localhost:5000/user/${targetUserId}`);
        const data = userRes.data;

        setFirstName(data.first_name);
        setLastName(data.last_name);
        setEmail(data.email);
        setBirthday(new Date(data.birthday).toLocaleDateString());
        setUserId(data.id);
      } catch (error) {
        console.error("Erreur lors de la récupération du profil :", error);
      }
    };

    if (id) {
      fetchData(id);
    } else if (user) {
      fetchData(user.uid);
    }
  }, [id, user, pageInt]);

  const handleDetails = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/posts/${postId}`);
      setPostList((prev) => prev.filter(post => post.id !== postId));
    } catch (error) {
      console.error("Erreur lors de la suppression du post :", error);
    }
  };

  const handleClick = () => {
    setPageInt((prev) => prev + 1);
  };

  if (!user && !id) return <p>Chargement du profil...</p>;

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
