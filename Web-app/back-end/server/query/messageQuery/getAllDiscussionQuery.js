const getUserConversationsQuery = (userId) => {
    return {
      text: `
        SELECT DISTINCT ON (least(sender_id, receiver_id), greatest(sender_id, receiver_id))
          id,
          sender_id,
          receiver_id,
          content,
          sent_at
        FROM message
        WHERE sender_id = $1 OR receiver_id = $1
        ORDER BY least(sender_id, receiver_id), greatest(sender_id, receiver_id), sent_at DESC;
      `,
      values: [userId]
    };
  };
  
  module.exports = getUserConversationsQuery;
  