const express = require('express');
const router = express.Router();
const pool = require('../../../config/db');
const getAllDiscussionQuery = require('../../query/messageQuery/getAllDiscussionQuery');

router.get('/', async (req, res) => {
  const userId = req.query.user;

  if (!userId) return res.status(400).json({ error: 'ID utilisateur manquant.' });

  try {
    const query = getAllDiscussionQuery(userId);
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la récupération des conversations." });
  }
});

module.exports = router;
