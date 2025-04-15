const express = require('express');
const router = express.Router();
const pool = require("../../../config/db");
const getPostById = require("../../query/postQuery/getPostByIdQuery"); // chemin corrigé

/**
 * Exemple : GET http://localhost:5000/post/1
 */
router.get('/:post_id', async (req, res) => {
  const { post_id } = req.params;

  try {
    const query = getPostById(post_id);
    const result = await pool.query(query);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "post non trouvé" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erreur lors de la récupération des infos post :", err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
