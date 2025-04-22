const express = require('express');
const router = express.Router();
const pool = require("../../../config/db");
const getUserPostQuery = require("../../query/postQuery/getUserPostQuery");

/**
 * Exemple : GET https://defi-madagascar-1.onrender.com/posts/user/PZWY7Wb1o8WmFW7v9jX7vE6gtOt1?page=2
 */
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * 10;

  try {
    const query = getUserPostQuery(user_id, offset);
    const result = await pool.query(query);

    res.json({
      page,
      limit: 10,
      posts: result.rows,
    });
  } catch (err) {
    console.error("Erreur lors de la récupération des posts de l'utilisateur :", err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
