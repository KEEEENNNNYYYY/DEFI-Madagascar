// Dumb Component : MessageListView.jsx
// eslint-disable-next-line no-unused-vars
import React from 'react';
import MessageSearchBar from "../../component/MessageSearchBar";

// eslint-disable-next-line react/prop-types
const MessageListView = ({ conversations, userId, onSelectUser }) => {
    return (
        <div>
            <h2>Mes conversations</h2>
            <MessageSearchBar />
            <ul>
                {/* eslint-disable-next-line react/prop-types */}
                {conversations.map((conv) => {
                    const otherUser = conv.sender_id === userId ? conv.receiver_id : conv.sender_id;

                    return (
                        <li key={conv.id} onClick={() => onSelectUser(otherUser)} style={{ cursor: 'pointer' }}>
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

export default MessageListView;
