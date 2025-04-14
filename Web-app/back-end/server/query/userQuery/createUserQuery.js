const createUserQuery = ({ firstName, lastName, birthday, email, firebase_uid }) => {
    return {
        text: `
        INSERT INTO "user" (id, first_name, last_name, birthday, email)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `,
        values: [firebase_uid, firstName, lastName, birthday, email]
    };
};


module.exports = createUserQuery;
