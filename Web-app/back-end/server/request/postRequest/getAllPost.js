// /server/request/postRequest/getAllPost.js
const express = require('express');
const router = express.Router();
const pool = require("../../../config/db");
const getAllPostQuery = require("../../query/postQuery/getAllPostQuery");

/**
 * Exemple : GET https://defi-madagascar-1.onrender.com/posts?page=1&limit=10
 */
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const query = getAllPostQuery(limit, offset);
        const result = await pool.query(query);

        res.json({
            page,
            limit,
            posts: result.rows
        });
    } catch (err) {
        console.error("Erreur lors de la récupération des posts :", err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;
