const getUserByIdQuery = (user_id) => {
    return {
      text: 'SELECT * FROM "user" WHERE id = $1',
      values: [user_id]
    };
  };
  
  module.exports = getUserByIdQuery;
  