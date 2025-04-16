import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 Import du hook
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";
import axios from "axios";

const Register = () => {
    const navigate = useNavigate(); // 👈 Pour la redirection
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthday, setBirthday] = useState("");

    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage("");

        try {
            // Étape 1 : Créer l'utilisateur Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            console.log("Utilisateur Firebase créé :", user);

            // Étape 2 : Envoyer les infos au backend
            const response = await axios.post("http://localhost:5000/users", {
                firstName,
                lastName,
                birthday,
                email: user.email,
                firebase_uid: user.uid,
            });

            console.log("Réponse backend :", response.data);
            setSuccessMessage("Inscription réussie !");
            
            // ✅ Étape 3 : Redirection vers /dashboard
            navigate("/dashboard");

        } catch (err) {
            console.error("Erreur :", err.response?.data || err.message);
            setError(err.response?.data?.error || err.message);
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "0 auto" }}>
            <h2>Inscription</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Prénom :</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Nom :</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Date de naissance :</label>
                    <input
                        type="date"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                        required
                    />
                </div>
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
                <button type="submit">S'inscrire</button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        </div>
    );
};

export default Register;
