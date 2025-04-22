import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../utils/firebase';
import MessageSearchBar from "../../component/MessageSearchBar";

const MessageList = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null); // Pour stocker dynamiquement l'ID
    const navigate = useNavigate();

    // Récupère l’utilisateur connecté
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

    // Récupère les conversations quand userId est prêt
    useEffect(() => {
        const fetchConversations = async () => {
            if (!userId) return;

            try {
                const res = await axios.get(`http://localhost:5000/chat?user=${userId}`);
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
        <div>
            <h2>Mes conversations</h2>
            <MessageSearchBar />
            <ul>
                {conversations.map((conv) => {
                    const otherUser = conv.sender_id === userId ? conv.receiver_id : conv.sender_id;

                    return (
                        <li key={conv.id} onClick={() => navigate(`/chat/${otherUser}`)} style={{ cursor: 'pointer' }}>
                            <strong>{otherUser}</strong><br />
                            <em>{conv.content}</em><br />
                            <small>{new Date(conv.sent_at).toLocaleString()}</small>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default MessageList;
