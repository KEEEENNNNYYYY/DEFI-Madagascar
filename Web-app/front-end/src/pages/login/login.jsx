// src/components/Login/login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";
import DumbLogin from "./dumbLogin";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("Utilisateur connecté :", user);
      if (user) {
        setSuccessMessage(`Bienvenue ${user.email}`);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Erreur de connexion :", err.message);
      setError("Email ou mot de passe incorrect.");
    }
  };

  return (
    <div className="container">
      <DumbLogin
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        error={error}
        successMessage={successMessage}
        handleLogin={handleLogin}
      />
    </div>
  );
};

export default Login;
