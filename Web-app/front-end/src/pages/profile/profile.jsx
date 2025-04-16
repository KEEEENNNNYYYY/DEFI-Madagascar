import React, { useEffect, useState } from "react";
import { auth } from "../../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [postList, setPostList] = useState([]);
  const [pageInt, setPageInt] = useState(1);

  // Champs utilisateur supplémentaires
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [userId, setUserId] = useState("");

  const navigate = useNavigate();

  // 🔐 Récupération de l'utilisateur Firebase connecté
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsubscribe();
  }, []);

  // 🔁 Récupération des posts + info user
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // ✅ Récupérer les posts
        const postRes = await axios.get(`https://defi-madagascar-1.onrender.com/posts/user/${user.uid}?page=${pageInt}`);
        const newPosts = postRes.data.posts;

        setPostList((prev) => {
          const allPosts = [...prev, ...newPosts];
          const unique = Array.from(new Map(allPosts.map(post => [post.id, post])).values());
          return unique;
        });

        // ✅ Récupérer les infos utilisateur
        const userRes = await axios.get(`https://defi-madagascar-1.onrender.com/user/${user.uid}`);
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
      await axios.delete(`https://defi-madagascar-1.onrender.com/posts/${postId}`);
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
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>{firstName} {lastName}</h2>
      <p><strong>ID :</strong> {userId}</p>
      <p><strong>Email :</strong> {email}</p>
      <p><strong>Anniversaire :</strong> {birthday}</p>

      <h3>Mes publications :</h3>
      <ul>
        {postList.map((post) => (
          <li key={post.id} style={{ borderBottom: "1px solid #ccc", marginBottom: "1rem", paddingBottom: "1rem" }}>
            <img src={post.image_url} alt={post.title} style={{ width: "100px" }} />
            <h3>{post.title}</h3>
            <p>{post.description}</p>
            <p><small>Créé le : {new Date(post.created_at).toLocaleDateString()}</small></p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button onClick={() => handleDetails(post.id)}>Détails</button>
              <button onClick={() => handleDeletePost(post.id)} style={{ color: "red" }}>
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>

      {postList.length > 0 && <button onClick={handleClick}>Charger plus</button>}
    </div>
  );
};

export default Profile;
