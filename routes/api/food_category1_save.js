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
        
        let fc1Id = req.body.fc1Id;
        let mode = req.body.mode;
        let name = req.body.name;

        if (isNone(mode) || isNone(name)) {
            res.json({ status: 'ERR_WRONG_PARAMS' });
            return;
        }

        let query = "";
        let params = [name];

        if (mode === 'ADD') {
            query = "INSERT INTO t_food_categories1(fc1_name) VALUES(?)";
            await pool.query(query, params);

        } else if (mode === 'MODIFY') {
            if (isNone(fc1Id)) {
                res.json({ status: 'ERR_WRONG_PARAMS' });
                return;
            }

            query = "UPDATE t_food_categories1 SET fc1_name = ? WHERE fc1_id = ?";
            params.push(fc1Id);
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