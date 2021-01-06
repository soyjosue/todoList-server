const jwt = require('jsonwebtoken');

module.exports = (id, res) => {

    const payload = {
        user: {
            id
        }
    }

    jwt.sign(payload, 'todolist', {
        expiresIn: 3600 // 1 hora
    }, (err, token) => {
        if(err) throw err;

        res.json({ token });
    }
    );

}