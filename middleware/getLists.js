const pool = require('../db/connection');

module.exports = async (id) => {

    const list = await pool.query(`SELECT * FROM lists where id = ${id};`);

    return list;

}