const createPostQuery = ({ title, description, image_url, user_id }) => {
    return {
      text: `
        INSERT INTO post (title, description, image_url, user_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `,
      values: [title, description, image_url, user_id]
    };
  };
  
  module.exports = createPostQuery;
  