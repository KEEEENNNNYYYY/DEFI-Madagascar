const express = require('express');
const router = express.Router();
const pool = require("../../../config/db");
const getAllUserQuery = require("../../query/userQuery/getAllUserQuery");

/**
 * exemple : GET http://localhost:5000/users?page=3
*/

router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * 10;

    try {
        const query = getAllUserQuery(offset);
        const result = await pool.query(query);
        res.json({
            page,
            limit: 10,
            users: result.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;
