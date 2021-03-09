var express = require('express');
var router = express.Router();
const { isLogined, isNone } = require('../../lib/common');
const pool = require('../../lib/database');


//접종테이블 저장 (추가, 수정)
router.post('', async (req, res) => {
    try {
        if (!isLogined(req.session)) {
            res.json({ status: 'ERR_NO_PERMISSION' });
            return;
        }

        let inId = req.body.inId;
        let mode = req.body.mode;
        let name = req.body.name;

        if (isNone(mode) || isNone(name)) {
            res.json({ status: 'ERR_WRONG_PARAMS' });
            return;
        }

        let query = "";
        let params = [name];

        if (mode === 'ADD') {
            query = "INSERT INTO t_inoculations (in_name) VALUES (?)";
            await pool.query(query, params);

        } else if (mode === 'MODIFY') {
            if (isNone(inId)) {
                res.json({ status: 'ERR_WRONG_PARAMS' });
                return;
            }

            query = "UPDATE t_inoculations SET in_name = ? WHERE in_id = ?";
            params.push(inId);
            await pool.query(query, params);

        } else {
            res.json({ status: 'ERR_WRONG_MODE' });
            return;
        }

        res.json({ status: 'OK' });

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;