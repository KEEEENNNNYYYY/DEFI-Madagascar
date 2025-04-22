const sendMessageQuery = ({ id, senderId, receiverId, content, sentAt }) => {
    return {
        text: `
        INSERT INTO "message" (id, sender_id, receiver_id, content, sent_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `,
        values: [id, senderId, receiverId, content, sentAt]
    };
};

module.exports = sendMessageQuery;
