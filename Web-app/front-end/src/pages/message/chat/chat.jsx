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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser1(u.uid);
        socket.emit("userConnected", u.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user1 || !userId) return; // ne fait rien si l'un des deux est null
  
    const handleReceiveMessage = (message) => {
      console.log("📩 Reçu:", message);
      console.log("🧍 user1:", user1, " | 📬 userId (dans l'URL):", userId);
  
      if (
        (message.sender_id === userId && message.receiver_id === user1) ||
        (message.sender_id === user1 && message.receiver_id === userId)
      ) {
        console.log("✅ Message accepté pour cette conversation");
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
  

  // Réception de message en temps réel
  useEffect(() => {
    const handleReceiveMessage = (message) => {
      // On ne garde que les messages destinés à cette conversation
      if (
        (message.sender_id === userId && message.receiver_id === user1) ||
        (message.sender_id === user1 && message.receiver_id === userId)
      ) {
        setMessages((prev) => [...prev, message]);
      } else {
        // Optionnel : tu peux déclencher une notification pour un autre chat ici
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
        content: newMessage,
        sent_at: new Date().toISOString()
      };

      setMessages((prev) => [...prev, messageData]);

      // Envoie via Socket.io
      socket.emit("sendMessage", {
        senderId: user1,
        receiverId: userId,
        content: newMessage
      });

      setNewMessage("");
    } catch (err) {
      console.error("Erreur lors de l'envoi du message :", err);
    } finally {
      setSending(false);
    }
  };

  if (!user1) return <p>Connexion en cours...</p>;
  if (loading) return <p>Chargement des messages...</p>;

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
        <button onClick={handleSendMessage} disabled={sending || !newMessage.trim()} style={{ padding: "8px" }}>
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default Chat;
