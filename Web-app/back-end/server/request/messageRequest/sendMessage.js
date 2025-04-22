const express = require('express');
const router = express.Router();
const pool = require('../../../config/db');
const sendMessageQuery = require('../../query/messageQuery/sendMessageQuery'); 
const { v4: uuidv4 } = require('uuid');

/**
 * Exemple de requête POST :
 * https://defi-madagascar-1.onrender.com/messages
 * Body :
 * {
 *   "senderId": "Il7A4sHb63YroLcUSDkkI8YGEXJ3",
 *   "receiverId": "OhQrzgNEphfxdxzokMz1nKXypsR2",
 *   "content": "Yo ça va ?"
 * }
 */
router.post('/', async (req, res) => {
  const { senderId, receiverId, content } = req.body;

  if (!senderId || !receiverId || !content) {
    return res.status(400).json({ error: 'Champs requis manquants.' });
  }

  try {
    const id = uuidv4(); // Génération d’un UUID pour l’ID du message
    const sentAt = new Date().toISOString();
    const query = sendMessageQuery({ id, senderId, receiverId, content, sentAt });

    const result = await pool.query(query);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de l'envoi du message." });
  }
});

module.exports = router;
