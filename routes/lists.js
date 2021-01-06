const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const listsController = require('../controllers/listsController');
const auth = require('../middleware/auth');

// Crear Lista
router.post('/', 
    auth,
    [
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        check('color', 'El color es obligatorio.').isHexColor()
    ],
    listsController.createList
)

// Eliminar Lista
router.delete('/:id',
    auth,
    listsController.deleteList
)

// Modificar Lista
router.put('/',
    auth,
    [
        check('id', 'El ID es obligatorio').isNumeric(),
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('color', 'El color no es valido').isHexColor()
    ],
    listsController.modifyList
)

// Obtener Lista
router.get('/',
    auth,
    listsController.getListsUser
)

module.exports = router;