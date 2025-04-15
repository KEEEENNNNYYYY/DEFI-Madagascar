const deletePostQuery = (post_id) => {
    return {
      text: `DELETE FROM post WHERE id = $1`,
      values: [post_id]
    };
  };
  
  module.exports = deletePostQuery;
  