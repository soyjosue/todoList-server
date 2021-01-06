const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const pool = require('../db/connection.js');
const isExistsUser = require('../middleware/isExistsUser.js');
const generateToken = require('../middleware/generateToken');


exports.registerUser = async (req, res) => {
    
    // Comprobar los errores express-validator
    const errs = validationResult(req);
    if(!errs.isEmpty()) {
        return res.status(401).send({
            errors: errs.array()
        });
    }

    const { email } = req.body;

    try{


        const isExists = await isExistsUser(email);

        if(isExists.length !== 0) return res.status(400).json({
            msg: 'El usuario ya existe.'
        });


        const { name, password } = req.body;

        const user = {
            name,
            email,
            password: ''
        };

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        const { insertId } = await pool.query(` INSERT INTO users set ?`, [user]);
        
        generateToken( insertId, res );

    } catch(err) {
        res.status(400).send('Hubo un error');
    }
    

}