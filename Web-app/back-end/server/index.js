const express = require('express');
require('dotenv').config({ path: '../config/.env' });
const pool = require('../config/db');
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app); 
const io = socketIo(server);

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

const sendMessage = require('./request/messageRequest/sendMessage');
const getDiscussion = require('./request/messageRequest/getDiscussion')
const getAllDiscussion = require('./request/messageRequest/getAllDiscussion')

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

app.use('/message',sendMessage);
app.use('/message',getDiscussion);
app.use('/chat',getAllDiscussion);



// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
