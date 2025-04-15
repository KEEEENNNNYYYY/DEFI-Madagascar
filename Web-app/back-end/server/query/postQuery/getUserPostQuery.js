const getUserPostQuery = (user_id, offset) => {
  return {
    text: 'SELECT * FROM post WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10 OFFSET $2',
    values: [user_id, offset]
  };
};

module.exports = getUserPostQuery;
