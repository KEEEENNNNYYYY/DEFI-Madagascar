const express = require('express');
const router = express.Router();
const pool = require('../../../config/db');
const getDiscussionQuery = require('../../query/messageQuery/getDiscussionQuery');

/**
 * Exemple :
 * GET http://localhost:5000/messages?user1=Il7A4...&user2=OhQrzg...
*/
router.get('/', async (req, res) => {
  const { user1, user2 } = req.query;

  if (!user1 || !user2) {
    return res.status(400).json({ error: "Les deux IDs d'utilisateur sont requis." });
  }

  try {
    const query = getDiscussionQuery(user1, user2);
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la récupération des messages." });
  }
});

module.exports = router;
