const express = require('express');
const router = express.Router();
const pool = require("../../../config/db");
const deletePostQuery = require("../../query/postQuery/deletePostQuery");
const cloudinary = require("../../../config/cloudinary");
const verifyFirebaseToken = require("../../../config/firebase");


router.delete('/:id', verifyFirebaseToken, async (req, res) => {
  const postId = parseInt(req.params.id);
  const firebase_uid = req.firebase_uid;

  if (isNaN(postId)) {
    return res.status(400).json({ error: "ID invalide." });
  }

  try {
    // Récupère le post avec son auteur
    const fetchPost = await pool.query("SELECT public_id, user_id FROM post WHERE id = $1", [postId]);

    if (fetchPost.rowCount === 0) {
      return res.status(404).json({ error: "Post non trouvé." });
    }

    const { public_id, user_id } = fetchPost.rows[0];

    // Vérifie que le user_id correspond bien au firebase_uid
    const userRes = await pool.query('SELECT id FROM "user" WHERE id = $1', [user_id]);


    if (userRes.rowCount === 0 || userRes.rows[0].id !== firebase_uid) {
      return res.status(403).json({ error: "Non autorisé à supprimer ce post." });
    }

    if (public_id) {
      await cloudinary.uploader.destroy(public_id);
    }

    await pool.query(deletePostQuery(postId));
    res.status(200).json({ message: "Post supprimé avec succès." });
  } catch (err) {
    console.error("Erreur lors de la suppression :", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

module.exports = router;
