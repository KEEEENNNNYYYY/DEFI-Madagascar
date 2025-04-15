import React, { useState } from "react";
import axios from "axios";

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  const handleSearch = async () => {
    if (!searchValue.trim()) return;

    try {
      const res = await axios.get(`http://localhost:5000/search?name=${searchValue}&page=${page}`);
      setResults(res.data.results);
    } catch (err) {
      console.error("Erreur lors de la recherche :", err);
    }
  };

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
    setPage(1); // reset page if changing search term
  };

  const handleNextPage = () => {
    setPage(prev => prev + 1);
    handleSearch();
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
      handleSearch();
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "1rem" }}>
      <input
        type="text"
        placeholder="Rechercher un utilisateur..."
        value={searchValue}
        onChange={handleInputChange}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        style={{ width: "100%", padding: "8px", marginBottom: "1rem" }}
      />
      <button onClick={handleSearch}>Rechercher</button>

      {results.length > 0 && (
        <div>
          <ul style={{ marginTop: "1rem" }}>
            {results.map(user => (
              <li key={user.id} style={{ borderBottom: "1px solid #ccc", padding: "8px 0" }}>
                <strong>{user.first_name} {user.last_name}</strong><br />
                <small>Email : {user.email}</small><br />
                <small>Anniversaire : {new Date(user.birthday).toLocaleDateString()}</small>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
            <button disabled={page <= 1} onClick={handlePrevPage}>⬅ Précédent</button>
            <button onClick={handleNextPage}>Suivant ➡</button>
          </div>
        </div>
      )}

      {results.length === 0 && searchValue && (
        <p>Aucun utilisateur trouvé.</p>
      )}
    </div>
  );
};

export default SearchBar;
