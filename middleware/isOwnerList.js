const pool = require('../db/connection');

module.exports = async(listId, author) => {

    const list = await pool.query(`
        SELECT author FROM lists WHERE id=${listId};
    `)

    return list[0].author === author;

}