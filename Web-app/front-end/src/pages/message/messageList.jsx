// Smart Component : messageList.jsx
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../utils/firebase';
import MessageListView from "../../component/MessageListView";

const MessageList = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                console.warn('Aucun utilisateur connecté');
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchConversations = async () => {
            if (!userId) return;

            try {
                const res = await axios.get(`https://defi-madagascar-1.onrender.com/chat?user=${userId}`);
                setConversations(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Erreur:', err);
                setLoading(false);
            }
        };

        fetchConversations();
    }, [userId]);

    if (!userId) return <p>Connexion en cours...</p>;
    if (loading) return <p>Chargement...</p>;

    return (
        <MessageListView
            conversations={conversations}
            userId={userId}
            onSelectUser={(userId) => navigate(`/chat/${userId}`)}
        />
    );
};

export default MessageList;
