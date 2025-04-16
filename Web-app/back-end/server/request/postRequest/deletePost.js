const express = require('express');
const router = express.Router();
const pool = require("../../../config/db");
const cloudinary = require("../../../config/cloudinary");

// DELETE /posts/:id
router.delete('/:id', async (req, res) => {
  const postId = parseInt(req.params.id, 10);

  if (isNaN(postId)) {
    return res.status(400).json({ error: "ID invalide." });
  }

  try {
    // 1. Récupérer le public_id de l'image à supprimer
    const fetchPost = await pool.query("SELECT public_id FROM post WHERE id = $1", [postId]);

    if (fetchPost.rowCount === 0) {
      return res.status(404).json({ error: "Post non trouvé." });
    }

    const publicId = fetchPost.rows[0].public_id;

    // 2. Supprimer l'image de Cloudinary si elle existe
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }

    // 3. Supprimer le post dans la base de données
    await pool.query("DELETE FROM post WHERE id = $1", [postId]);

    res.status(200).json({ message: "Post et image supprimés avec succès." });
  } catch (err) {
    console.error("Erreur lors de la suppression :", err);
    res.status(500).json({ error: "Erreur serveur lors de la suppression." });
  }
});

module.exports = router;
