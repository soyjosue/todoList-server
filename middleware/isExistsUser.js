const pool = require('../db/connection.js');

module.exports =  async (email) => {

    const user = await pool.query(`SELECT email FROM users WHERE email = '${email}';`);

    return user;
}