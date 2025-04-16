import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 🔥 Import du hook de redirection
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";

const Login = () => {
  const navigate = useNavigate(); // 🔥 Hook pour rediriger
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
        navigate("/dashboard"); // ✅ Redirection
      }
    } catch (err) {
      console.error("Erreur de connexion :", err.message);
      setError("Email ou mot de passe incorrect.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Mot de passe :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Se connecter</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </div>
  );
};

export default Login;
