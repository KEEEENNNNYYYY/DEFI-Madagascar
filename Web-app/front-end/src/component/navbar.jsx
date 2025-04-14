import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase";

const Navbar = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.link}>Accueil</Link>
      <Link to="/dashboard" style={styles.link}>Dashboard</Link>
      <Link to="/posts" style={styles.link}>Créer un post</Link>
      {!user ? (
        <>
          <Link to="/login" style={styles.link}>Connexion</Link>
          <Link to="/register" style={styles.link}>Inscription</Link>
        </>
      ) : (
        <button onClick={handleLogout} style={styles.button}>Déconnexion</button>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    padding: "10px",
    backgroundColor: "#f1f1f1",
    display: "flex",
    gap: "10px",
    alignItems: "center"
  },
  link: {
    textDecoration: "none",
    color: "#333",
    fontWeight: "bold"
  },
  button: {
    background: "none",
    border: "none",
    color: "red",
    cursor: "pointer",
    fontWeight: "bold"
  }
};

export default Navbar;
