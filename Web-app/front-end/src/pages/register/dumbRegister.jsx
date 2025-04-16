import React from "react";
import { Link } from "react-router-dom"; // 🧭 Import du Link

const DumbRegister = ({
    firstName,
    setFirstName,
    lastName,
    setLastName,
    birthday,
    setBirthday,
    email,
    setEmail,
    password,
    setPassword,
    error,
    successMessage,
    handleSubmit,
}) => {
    return (
        <div>
            <h2>Inscription</h2>
            <form onSubmit={handleSubmit}>
                {/* Inputs */}
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

            {error && <p className="error">{error}</p>}
            {successMessage && <p className="success">{successMessage}</p>}

            {/* Lien vers la page de login */}
            <p style={{ marginTop: "1rem" }}>
                Déjà un compte ?{" "}
                <Link to="/login" style={{ color: "#007bff", textDecoration: "underline" }}>
                    Connecte-toi ici
                </Link>
            </p>
        </div>
    );
};

export default DumbRegister;
