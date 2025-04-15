const express = require('express');
const router = express.Router();
const pool = require("../../../config/db");
const getUserByIdQuery = require("../../query/userQuery/getUserByIdQuery"); // chemin corrigé

/**
 * Exemple : GET http://localhost:5000/user/PZWY7Wb1o8WmFW7v9jX7vE6gtOt1
 */
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const query = getUserByIdQuery(user_id);
    const result = await pool.query(query);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erreur lors de la récupération des infos utilisateur :", err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
