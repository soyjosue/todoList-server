const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    const token = req.header('x-auth-token');

    if(!token) {
        return res.status(401).json({ msg: 'No hay token.' });
    }

    try{

        const content = jwt.verify(token, 'todolist');
        req.user = content.user;
        next();

    } catch(err) {
        res.status(401).json({ msg: 'Token no valido.' });
    }

}