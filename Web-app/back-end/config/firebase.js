const admin = require("firebase-admin");
const serviceAccount = require("./defi-madagascar-firebase-adminsdk-fbsvc-25f07d21ba.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token manquant ou invalide." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.firebase_uid = decodedToken.uid;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token invalide." });
  }
};

module.exports = verifyFirebaseToken;
