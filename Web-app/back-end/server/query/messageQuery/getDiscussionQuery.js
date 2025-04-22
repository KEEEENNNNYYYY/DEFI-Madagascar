const getDiscussionQuery = (userId1, userId2) => {
    return {
        text: `
            SELECT *
            FROM message
            WHERE 
                (sender_id = $1 AND receiver_id = $2)
                OR 
                (sender_id = $2 AND receiver_id = $1)
            ORDER BY sent_at ASC
        `,
        values: [userId1, userId2]
    };
};

module.exports = getDiscussionQuery;
