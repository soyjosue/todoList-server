const pool = require('../db/connection');

module.exports = async (id) => {

    const task = await pool.query(`SELECT * FROM taks where id = ${id};`);

    return task;

}