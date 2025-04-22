import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../utils/firebase';
import { useParams } from 'react-router-dom';


const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user1, setUser1] = useState(null); // utilisateur connecté
  const { userId } = useParams();
  // Ajoute ces states en haut :
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      await axios.post("http://localhost:5000/message", {
        senderId: user1,
        receiverId: userId,
        content: newMessage,
      });

      setMessages(prev => [...prev, {
        id: Date.now(),
        sender_id: user1,
        content: newMessage,
        sent_at: new Date().toISOString()
      }]);
      setNewMessage("");
    } catch (err) {
      console.error("Erreur lors de l'envoi du message :", err);
    } finally {
      setSending(false);
    }
  };
  // userId = destinataire


  // Authentifie l'utilisateur Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser1(u.uid);
      } else {
        console.warn('Aucun utilisateur connecté');
      }
    });

    return () => unsubscribe();
  }, []);

  // Récupération des messages quand l'utilisateur est connecté
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user1) return;

      try {
        const response = await axios.get(`http://localhost:5000/message?user1=${user1}&user2=${userId}`);
        setMessages(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des messages:', error);
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user1, userId]);

  if (!user1) return <p>Connexion en cours...</p>;
  if (loading) return <p>Chargement des messages...</p>;

  return (
    <div>
      <h2>Conversation</h2>
      <h1>Chat entre {user1} et {userId}</h1>
      <ul>
        {messages.map((msg) => (
          <li key={msg.id}>
            <strong>{msg.sender_id === user1 ? 'Moi' : 'Lui'}:</strong> {msg.content}
            <br />
            <small>{new Date(msg.sent_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: "1rem" }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écris ton message..."
          style={{ width: "80%", padding: "8px" }}
        />
        <button onClick={handleSendMessage} disabled={sending || !newMessage.trim()} style={{ padding: "8px" }}>
          Envoyer
        </button>
      </div>

    </div>
  );
};

export default Chat;