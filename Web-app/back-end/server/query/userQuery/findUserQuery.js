
const findUser = (name, offset) => {
    return {
        text: `
            SELECT * FROM "user"
            WHERE first_name ILIKE $1 OR last_name ILIKE $1
            LIMIT 10 OFFSET $2
        `,
        values: [`%${name}%`, offset]
    };
};

module.exports = findUser;
