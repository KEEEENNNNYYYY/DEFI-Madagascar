const express = require('express');
const router = express.Router();
const pool = require("../../../config/db");
const deletePostQuery = require("../../query/postQuery/deletePostQuery");
const cloudinary = require('cloudinary').v2;
require("dotenv").config();


// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// DELETE /posts/:id
router.delete('/:id', async (req, res) => {
  const postId = parseInt(req.params.id);

  if (isNaN(postId)) {
    return res.status(400).json({ error: "ID invalide." });
  }

  try {
    // 1. Récupérer le post pour avoir le public_id
    const fetchPost = await pool.query("SELECT public_id FROM post WHERE id = $1", [postId]);

    if (fetchPost.rowCount === 0) {
      return res.status(404).json({ error: "Post non trouvé." });
    }

    const publicId = fetchPost.rows[0].public_id;

    // 2. Supprimer l'image de Cloudinary si public_id existe
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }

    // 3. Supprimer le post de la BDD
    const query = deletePostQuery(postId);
    await pool.query(query);

    res.status(200).json({ message: "Post et image supprimés avec succès." });
  } catch (err) {
    console.error("Erreur lors de la suppression :", err);
    res.status(500).json({ error: "Erreur serveur lors de la suppression." });
  }
});

module.exports = router;
