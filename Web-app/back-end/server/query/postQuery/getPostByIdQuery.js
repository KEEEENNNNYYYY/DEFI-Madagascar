const getPostById = (post_id) => {
    return {
      text: 'SELECT * FROM post WHERE id = $1',
      values: [post_id]
    };
  };
  
  module.exports = getPostById;
  