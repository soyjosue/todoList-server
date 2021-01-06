const mysql = require('mysql');
const {promisify} = require('util');

const { database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection( (err, connection) => {

    if (err) {
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('La conexion con la base de datos fue cerrada');
        } else if(err.code === 'ER_CON_COUNT_ERROR') {
            console.error('DATABASE HAS TO MANY CONNECTIONS');
        } else if (err.code === 'ECONNREFUSED') {
            console.error('La conexion de la DATABASE fue rechazada ');
        }
    }

    if( connection ) connection.release();
    console.log('La Database esta conectada');
    return;

} );

pool.query = promisify(pool.query);

module.exports = pool;