// /server/query/postQuery/getAllPostQuery.js
const getAllPostQuery = (limit, offset) => {
    return {
      text: 'SELECT * FROM post ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      values: [limit, offset]
    };
  };
  
  module.exports = getAllPostQuery;
  