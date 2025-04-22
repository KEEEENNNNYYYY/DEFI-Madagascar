// backend/index.js
const express = require('express');
require('dotenv').config({ path: '../config/.env' });
const pool = require('../config/db');
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app); 
const io = socketIo(server, {
    cors: {
        origin: "*", // À sécuriser en prod
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Garde une référence globale aux sockets
let onlineUsers = new Map();

io.on("connection", (socket) => {
    console.log("✅ Nouveau client connecté : ", socket.id);

    // Réception de l'utilisateur connecté
    socket.on("userConnected", (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log(`👤 ${userId} est en ligne`);
    });

    // Envoie un message à l'autre utilisateur si connecté
    socket.on("sendMessage", ({ senderId, receiverId, content }) => {
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("receiveMessage", {
                sender_id: senderId,
                content,
                sent_at: new Date().toISOString()
            });
        }
    });

    socket.on("disconnect", () => {
        console.log("❌ Client déconnecté :", socket.id);
        for (let [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
    });
});

// Routes
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
const getDiscussion = require('./request/messageRequest/getDiscussion');
const getAllDiscussion = require('./request/messageRequest/getAllDiscussion');

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

app.use('/message', sendMessage);
app.use('/message', getDiscussion);
app.use('/chat', getAllDiscussion);

// Lancement du serveur
server.listen(PORT, () => {
    console.log(`🚀 Serveur WebSocket + API sur http://localhost:${PORT}`);
});
