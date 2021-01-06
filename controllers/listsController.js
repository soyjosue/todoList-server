const { validationResult } = require('express-validator');
const pool = require('../db/connection');

const getLists = require('../middleware/getLists');

exports.createList = async (req, res) => {

    const err = validationResult(req);
    if(!err.isEmpty()) return res.status(400).json({
        errors: err
    });

    const list = {
        name: req.body.name,
        color: req.body.color,
        create_time: new Date(),
        author: req.user.id
    };

    try{

        const { insertId } =
            await pool.query(`
            INSERT INTO lists (
                name,
                color,
                author,
                create_time
            ) values (
                '${list.name}',
                '${list.color}',
                ${list.author},
                NOW()
            );
        `);

        list.id = insertId;

        res.json(list)

    } catch(err) {
        res.status(500).json({ msg: 'Hubo un error' });
    }

}

exports.deleteList = async (req, res) => {

    try{

        const lists = await getLists(req.params.id);

        if(lists.length === 0) return res.status(401).json({
            msg: 'La lista no existe.'
        });

        const [ list ] = lists;

        if( list.author !== req.user.id ) return res.status(400).json({
            msg: 'El usuario no puede elimianr esta lista.'
        });

        pool.query(`
            DELETE FROM lists WHERE id = ${req.params.id} AND author = ${req.user.id}
        `);

        return res.json({
            msg: 'Lista Eliminada'
        });

    } catch(err) {

        res.status(401).json({
            msg: 'Hubo un errror'
        });

    }

}

exports.modifyList = async (req, res) => {

    const err = validationResult(req);
    if(!err.isEmpty()) return res.status(400).json({
        errors: err 
    });

    try{

        const lists = await getLists(req.body.id);

        
        if(lists.length === 0) return res.status(400).json({
            msg: 'La lista no existe.'
        });
        
        const [ list ] = lists;

        if(list.author !== req.user.id) return res.status(400).json({
            msg: 'El usuario no puede modificar esta lista.'
        });

        pool.query(`
            UPDATE lists SET name='${req.body.name}', color='${req.body.color}' WHERE id=${req.body.id} AND author=${req.user.id};
        `);

        res.status(200).json({
            msg: 'Lista modificada.'
        });

    }catch(err) {
        res.status(400).json({ msg: 'Hubo un error'});
    }

}

exports.getListsUser = async (req, res) => {

    try{

      const lists = await pool.query(`
        SELECT id, name, color, author FROM lists WHERE author = ${req.user.id}
      `);

      res.json({
        lists
      })

    } catch(err) {
        res.status(400).json({
            msg: 'Hubo un error'
        });
    }

}