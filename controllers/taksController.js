const { validationResult } = require('express-validator');
const pool = require('../db/connection');
const isOwnerList = require('../middleware/isOwnerList');
const getTaks = require('../middleware/getTaks');

exports.createTaks = async(req, res) => {

    const err = validationResult(req);
    if(!err.isEmpty()) return res.status(401).json({
        errors: err
    });

    const { list } = req.body;

    if(!await isOwnerList(list, req.user.id)) return res.json({
        msg: 'El usuario no puede agregar una tarea a esta lista.'
    });

    try{

        const { name, isCompleted } = req.body;

        await pool.query(`
            INSERT INTO taks (
                name,
                list,
                author,
                isCompleted
            ) values (
                '${name}',
                ${list},
                ${req.user.id},
                ${isCompleted}
            );
        `);

        res.json({
            name,
            list,
            author: req.user.id,
            isCompleted
        });

    } catch(err) {
        return res.status(400).json({
            msg: 'Hubo un error.'
        });
    }

}

exports.deleteTaks = async (req, res) => {

    try{
        
        const tasks = await getTaks(req.params.id);

        if(tasks.length === 0) return res.status(401).json({
            msg: 'La tarea no existe.'
        });

        const [ task ] = tasks;

        if( task.author !== req.user.id ) return res.status(400).json({
            msg: 'El usuario no puede elimianr esta tarea.'
        });

        pool.query(`
            DELETE FROM taks WHERE id=${req.params.id} AND author=${req.user.id}
        `)

        return res.status(200).json({
            msg: 'Tarea eliminada'
        });

    } catch(err) {
        return res.status(400).json({
            msg: 'Hubo un error'
        });
    }

}

exports.deleteTaksList = async (req, res) => {

    try{

        pool.query(`
            DELETE FROM taks WHERE list=${req.params.list} AND author=${req.user.id}
        `)

        return res.status(200).json({
            msg: 'Tareas eliminada'
        });

    } catch(err) {
        return res.status(400).json({
            msg: 'Hubo un error'
        });
    }

}

exports.modifyTask = async (req, res) => {

    const err = validationResult(req);
    if(!err.isEmpty()) return res.status(400).json({
        errors: err 
    });

    try{

        const tasks = await getTaks(req.body.id);

        if(tasks.length === 0) return res.status(401).json({
            msg: 'La tarea no existe.'
        });
        
        const [ task ] = tasks;

        if(task.author !== req.user.id) return res.status(400).json({
            msg: 'El usuario no puede modificar esta tarea.'
        });

        pool.query(`
            UPDATE taks SET name='${req.body.name}', isCompleted=${req.body.isCompleted} WHERE id=${req.body.id} AND author=${req.user.id};
        `);

        res.status(200).json({
            msg: 'Tarea modificada.'
        });

    }catch(err) {
        res.status(400).json({ msg: 'Hubo un error'});
    }

}

exports.getTasks = async (req, res) => {

    try{

      const tasks = await pool.query(`
        SELECT id, name, list, author, isCompleted FROM taks WHERE list = ${req.params.list} AND author=${req.user.id}
      `);

      res.json({
        tasks
      })

    } catch(err) {
        res.status(400).json({
            msg: 'Hubo un error'
        });
    }

}