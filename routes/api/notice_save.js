var express = require('express');
var router = express.Router();
const { isLogined, isNone } = require('../../lib/common');
const pool = require('../../lib/database');


router.post('', async (req, res) => {
    try {
        if (!isLogined(req.session)) {
            res.json({ status: 'ERR_NO_PERMISSION' });
            return;
        }
        
        let mode = req.body.mode;
        let title = req.body.title;
        let contents = req.body.contents;
        let noId = req.body.noId;

        let query = "";
        let params = [];

        if (mode == 'ADD') {
            query = "INSERT INTO t_notices (no_title, no_contents) VALUES (?, ?)";
            params = [title, contents];

        } else {
            query = "UPDATE t_notices SET no_title = ?, no_contents = ?, no_updated_date = NOW() WHERE no_id = ?";
            params = [title, contents, noId];
        }

        await pool.query(query, params);
        res.json({ status: 'OK' });

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;