const getAllUserQuery = (offset) => {
    return {
        text: 'SELECT * FROM "user" ORDER BY id LIMIT 10 OFFSET $1',
        values: [offset]
    };
};

module.exports = getAllUserQuery;

