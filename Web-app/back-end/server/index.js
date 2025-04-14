const express = require('express');
require('dotenv').config({ path: '../config/.env' });
const pool = require('../config/db');
const cors = require("cors");
const app = express();
app.use(cors()); 

const PORT = process.env.PORT || 5000;

const getAllUsers = require('./request/userRequest/getAllUsers');
const createUser = require('./request/userRequest/createUser');
const findUser = require('./request/userRequest/findUser');

const getAllPost = require ('./request/postRequest/getAllPost');
const createPost =require('./request/postRequest/createPost') 




app.use(express.json());


app.get('/', (req, res) => {
    res.send('API Defi Madagascar 🚀');
});

app.use('/users', getAllUsers);
app.use('/users', createUser);
app.use('/search',findUser);

app.use('/posts', getAllPost);
app.use('/posts',createPost);


app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
