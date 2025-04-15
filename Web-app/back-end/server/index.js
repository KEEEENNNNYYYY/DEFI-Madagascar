const express = require('express');
require('dotenv').config({ path: '../config/.env' });
const pool = require('../config/db');
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Import des routes
const getAllUsers = require('./request/userRequest/getAllUsers');
const createUser = require('./request/userRequest/createUser');
const findUser = require('./request/userRequest/findUser');
const getUserById = require('./request/userRequest/getUserById');


const getAllPost = require('./request/postRequest/getAllPost');
const createPost = require('./request/postRequest/createPost');
const deletePost = require('./request/postRequest/deletePost');
const getUserPosts = require('./request/postRequest/getUserPost');
const getPostById = require('./request/postRequest/getPostById');


// Routes
app.get('/', (req, res) => {
    res.send('API Defi Madagascar 🚀');
});

app.use('/users', getAllUsers);
app.use('/search', findUser);
app.use('/user', getUserById);
app.use('/users', createUser);

app.use('/posts/user', getUserPosts); 
app.use('/posts', getPostById); 
app.use('/posts', getAllPost);
app.use('/posts', createPost);
app.use('/posts', deletePost);


// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
