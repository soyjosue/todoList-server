const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');

const pool = require('../db/connection');
const isExistsUser = require('../middleware/isExistsUser');
const generateToken = require('../middleware/generateToken');

exports.loginUser = async (req, res) => {

    const err = validationResult(req);
    if(!err.isEmpty()) {
        return res.status(400).json({
            errors: err.array()
        })
    }

    const { email } = req.body;

    try {

        if(!await isExistsUser(email)) {
            return res.status(400).json({ msg: 'El Usuario No Existe.' });
        }

        const { password } = req.body;

        const user = await pool.query(`SELECT id, email, password FROM users WHERE email = '${email}';`);
        const passwordCorrect = await bcryptjs.compare(password, user[0].password);

        if(!passwordCorrect) {
            return res.status(400).json({ msg: 'Correo o contraseña incorrecta.' });
        }

        generateToken(user[0].id, res);

    } catch (errs) {
        return res.status(400).json({ msg: 'Hubo un error' })
    } 

}

exports.authenticatedUser = async (req, res) => {

    try{
        const user = await pool.query(`SELECT id, name, email FROM users WHERE id = ${req.user.id} `);
        res.json(user);
    } catch(err) {
        res.status(400).json({msg: 'Hubo un error'});
    }

}