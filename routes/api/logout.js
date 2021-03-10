var express = require('express');
var router = express.Router();
const { isLogined } = require('../../lib/common');


router.post('', async (req, res) => {
    try {
        if (!isLogined(req.session)) {
            res.json({ status: 'ERR_NO_PERMISSION' });
            return;
        }

        req.session.destroy(() => {
            res.json({ status: 'OK' });
        });

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;