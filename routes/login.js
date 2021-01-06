const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { loginUser, authenticatedUser } = require('../controllers/loginController');
const auth = require('../middleware/auth');

router.post('/', 
    [
        check('email', 'Ingrese un correo valido.').isEmail(),
        check('password', 'Ingrese una contraseña.').not().isEmpty()
    ],
    loginUser
);

router.get('/',
    auth,
    authenticatedUser
)

module.exports = router;