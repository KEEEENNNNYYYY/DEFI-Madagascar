import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const navigate = useNavigate(); // 👉 Ajout ici

  const handleSearch = async (value = searchValue, currentPage = page) => {
    if (!value.trim()) {
      setResults([]);
      return;
    }

    try {
      const res = await axios.get(
        `https://defi-madagascar-1.onrender.com/search?name=${value}&page=${currentPage}`
      );
      setResults(res.data.results || []);
      setShowPreview(true);
    } catch (err) {
      console.error("Erreur lors de la recherche :", err);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setPage(1);

    if (typingTimeout) clearTimeout(typingTimeout);
    const timeout = setTimeout(() => {
      handleSearch(value, 1);
    }, 300);

    setTypingTimeout(timeout);
  };

  const handleNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    handleSearch(searchValue, nextPage);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      const prevPage = page - 1;
      setPage(prevPage);
      handleSearch(searchValue, prevPage);
    }
  };

  // 👉 Redirection vers /user/:id
  const handleClickUser = (id) => {
    navigate(`/user/${id}`);
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "1rem", position: "relative" }}>
      <input
        type="text"
        placeholder="Rechercher un utilisateur..."
        value={searchValue}
        onChange={handleInputChange}
        style={{ width: "100%", padding: "8px", marginBottom: "1rem" }}
        onFocus={() => searchValue && setShowPreview(true)}
        onBlur={() => setTimeout(() => setShowPreview(false), 200)}
      />

      {/* Résultats preview */}
      {showPreview && results.length > 0 && (
        <div style={{
          position: "absolute",
          top: "70px",
          left: 0,
          right: 0,
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: "5px",
          maxHeight: "250px",
          overflowY: "auto",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          zIndex: 10,
          padding: "0.5rem"
        }}>
          {results.map(user => (
            <div
              key={user.id}
              onClick={() => handleClickUser(user.id)} // 👉 Clique pour redirection
              style={{
                padding: "8px",
                borderBottom: "1px solid #eee",
                cursor: "pointer"
              }}
            >
              <strong>{user.first_name} {user.last_name}</strong><br />
              <small>{user.email}</small>
            </div>
          ))}
        </div>
      )}

      {/* Aucun résultat */}
      {showPreview && searchValue && results.length === 0 && (
        <div style={{
          position: "absolute",
          top: "70px",
          left: 0,
          right: 0,
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: "5px",
          padding: "0.5rem",
          zIndex: 10
        }}>
          Aucun utilisateur trouvé.
        </div>
      )}

      {/* Pagination */}
      {results.length > 0 && (
        <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
          <button disabled={page <= 1} onClick={handlePrevPage}>⬅ Précédent</button>
          <button onClick={handleNextPage}>Suivant ➡</button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
