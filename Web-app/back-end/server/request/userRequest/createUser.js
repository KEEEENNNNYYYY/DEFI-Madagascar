const express = require('express');
const router = express.Router();
const pool = require('../../../config/db');
const createUserQuery = require('../../query/userQuery/createUserQuery');

/**
 * Exemple de requête POST :
 * http://localhost:5000/users
 * Body :
 * {
 *   "firstName": "Tahina",
 *   "lastName": "Rakoto",
 *   "birthday": "1997-03-22",
 *   "email": "tahina@example.com",
 *   "firebase_uid": "uid_tahina_22"
 * }
 */
router.post('/', async (req, res) => {
    const { firstName, lastName, birthday, email, firebase_uid } = req.body;
  
    if (!firstName || !lastName || !birthday || !email || !firebase_uid) {
      return res.status(400).json({ error: 'Champs requis manquants.' });
    }
  
    try {
      const query = createUserQuery({ firstName, lastName, birthday, email, firebase_uid });
      const result = await pool.query(query);
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur lors de la création de l'utilisateur." });
    }
  });
  
module.exports = router;
