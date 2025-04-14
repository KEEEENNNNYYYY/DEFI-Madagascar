const express = require('express');
const router = express.Router();
const pool = require("../../../config/db");
const findUserQuery = require("../../query/userQuery/findUserQuery");

/**
 * example : http://localhost:5000/search?name=an&page=1
*/

router.get('/', async (req, res) => {
    const name = req.query.name || '';
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * 10;

    try {
        const query = findUserQuery(name, offset);
        const result = await pool.query(query);
        res.json({
            page,
            results: result.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router; 
