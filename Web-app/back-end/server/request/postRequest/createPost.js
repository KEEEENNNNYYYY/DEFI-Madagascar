const express = require('express');
const router = express.Router();
const pool = require('../../../config/db');
const postImageQuery = require('../../query/postQuery/postImageQuery');

/**
 * Body attendu :
 * {
 *   "title": "Post 1",
 *   "description": "Contenu",
 *   "image_url": "https://res.cloudinary.com/...",
 *   "public_id": "img_public_id_de_cloudinary",
 *   "user_id": "uid_firebase"
 * }
 */
router.post('/', async (req, res) => {
    const { title, description, image_url, public_id, user_id } = req.body;

    // Vérifier si tous les champs sont envoyés
    if (!title || !description || !image_url || !public_id || !user_id) {
        console.log("Champs manquants :", { title, description, image_url, public_id, user_id });
        return res.status(400).json({ error: 'Champs requis manquants.' });
    }

    try {
        const query = postImageQuery({ title, description, image_url, public_id, user_id });

        console.log("Exécution de la requête avec les valeurs :", query.values);

        const result = await pool.query(query.text, query.values);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Erreur lors de l'insertion du post :", err);
        res.status(500).json({ error: "Erreur lors de la création du post." });
    }
});

module.exports = router;
