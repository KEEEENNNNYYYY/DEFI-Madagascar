// /home/unity/Bureau/[IMPORTANT]/DEFI-Madagascar/Web-app/back-end/server/query/postQuery/postImageQuery.js

const postImageQuery = ({ image_url, user_id }) => {
  return {
    text: `
      INSERT INTO post (image_url, user_id)
      VALUES ($1, $2)
      RETURNING *;
    `,
    values: [image_url, user_id]
  };
};

module.exports = postImageQuery;
