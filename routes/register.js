const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');
const { check } = require('express-validator');

router.post('/', 
    [
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        check('email', 'Agrega un correo valído').isEmail(),
        check('password', 'La contraseña debe tener minimo 6 caracteres.').isLength({ min: 6 })
    ],
    registerController.registerUser
)

module.exports = router;