// src/components/Register/register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";
import axios from "axios";
import DumbRegister from "./dumbRegister";
import "./register.css";  // 🖋️ Import du fichier CSS

const Register = () => {
    const navigate = useNavigate();
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
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            console.log("Utilisateur Firebase créé :", user);

            const response = await axios.post("https://defi-madagascar-1.onrender.com/users", {
                firstName,
                lastName,
                birthday,
                email: user.email,
                firebase_uid: user.uid,
            });

            console.log("Réponse backend :", response.data);
            setSuccessMessage("Inscription réussie !");
            
            navigate("/dashboard");

        } catch (err) {
            console.error("Erreur :", err.response?.data || err.message);
            setError(err.response?.data?.error || err.message);
        }
    };

    return (
        <div className="container"> {/* Applique la classe 'container' pour la mise en page */}
            <DumbRegister
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                birthday={birthday}
                setBirthday={setBirthday}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                error={error}
                successMessage={successMessage}
                handleSubmit={handleSubmit}
            />
        </div>
    );
};

export default Register;
