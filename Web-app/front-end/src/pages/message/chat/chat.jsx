import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../utils/firebase';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io("https://defi-madagascar-1.onrender.com");

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user1, setUser1] = useState(null);
  const { userId } = useParams();
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  // Récupération de l'utilisateur connecté
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser1(u.uid);
        socket.emit("userConnected", u.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  // Récupération des messages de la conversation
  useEffect(() => {
    if (!user1 || !userId) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`https://defi-madagascar-1.onrender.com/message?user1=${user1}&user2=${userId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user1, userId]);

  // Réception des messages en temps réel
  useEffect(() => {
    const handleReceiveMessage = (message) => {
      if (
        (message.sender_id === userId && message.receiver_id === user1) ||
        (message.sender_id === user1 && message.receiver_id === userId)
      ) {
        setMessages((prev) => [...prev, message]);
      } else {
        console.log("📨 Nouveau message d'un autre utilisateur ignoré dans cette vue");
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [user1, userId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
  
    try {
      setSending(true);
  
      await axios.post("https://defi-madagascar-1.onrender.com/message", {
        senderId: user1,
        receiverId: userId,
        content: newMessage,
      });
  
      const messageData = {
        id: Date.now(),
        sender_id: user1,
        receiver_id: userId,
        content: newMessage,
        sent_at: new Date().toISOString(),
      };
  
      socket.emit("sendMessage", messageData); // ✅ après la déclaration
  
      setMessages((prev) => [...prev, messageData]);
      setNewMessage("");
    } catch (err) {
      console.error("Erreur lors de l'envoi du message :", err);
    } finally {
      setSending(false);
    }
  };
  

  // Affichage en cours de connexion ou chargement
  if (!user1 || loading) return <p>Chargement en cours...</p>;

  return (
    <div>
      <h2>Conversation</h2>
      <h1>Chat entre {user1} et {userId}</h1>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
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
        <button
          onClick={handleSendMessage}
          disabled={sending || !newMessage.trim()}
          style={{ padding: "8px" }}
        >
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default Chat;
