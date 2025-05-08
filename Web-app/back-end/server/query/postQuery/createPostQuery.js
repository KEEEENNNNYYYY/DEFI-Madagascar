// /home/unity/Bureau/[IMPORTANT]/DEFI-Madagascar/Web-app/back-end/server/query/postQuery/postImageQuery.js
const postQuery = ({ title, description, image_url, public_id, user_id }) => {
    return {
        text: `
            INSERT INTO post (title, description, image_url, public_id, user_id)
            VALUES ($1, $2, $3, $4, $5)
                RETURNING *;
        `,
        values: [title, description, image_url, public_id, user_id]
    };
};

module.exports = postQuery;
