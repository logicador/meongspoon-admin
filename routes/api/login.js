var express = require('express');
var router = express.Router();
const { isNone } = require('../../lib/common');


router.post('', (req, res) => {
    try {
        let id = req.body.id;
        let password = req.body.password;

        if (isNone(id) || isNone(password)) {
            res.json({ status: 'ERR_WRONG_PARAMS' });
            return;
        }

        if (id === 'stellation21' && password === 'Comet92!') {
            req.session.isLogined = true;
            req.session.save(() => {
                res.json({ status: 'OK' });
            });

        } else {
            res.json({ status: 'ERR_LOGIN_FAILED' });
        }

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;