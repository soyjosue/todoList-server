const express = require('express');
const router = express.Router();
const taksController = require('../controllers/taksController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// Crear Tarea
router.post('/',
    auth,
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('isCompleted').default(false).toBoolean(),
        check('list', 'La lista es obligatoria').isNumeric()
    ],
    taksController.createTaks
);

// Eliminar Tarea
router.delete('/:id',
    auth,
    taksController.deleteTaks
)

// Eliminar Tarea de la listas
router.delete('/all/:list',
    auth,
    taksController.deleteTaksList
)

// Modificar Tarea
router.put('/',
    auth,
    [
        check('id', 'El ID es obligatorio').isNumeric(),
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('isCompleted').default(false),
    ],
    taksController.modifyTask
)

// Obtener Tareas
router.get('/:list',
    auth,
    [
        check('list', 'El ID de la lista es obligatorio.').isNumeric()
    ],
    taksController.getTasks
)

module.exports = router;