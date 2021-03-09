var express = require('express');
var router = express.Router();
const { isLogined, isNone } = require('../../lib/common');
const pool = require('../../lib/database');


//음식 카테고리2 저장 (입력, 수정)
router.post('', async (req, res) => {
    try {
        if (!isLogined(req.session)) {
            res.json({ status: 'ERR_NO_PERMISSION' });
            return;
        }
        
        let fc1Id = req.body.fc1Id;
        let fc2Id = req.body.fc2Id;
        let mode = req.body.mode;
        let name = req.body.name;

        if (isNone(mode) || isNone(name)) {
            res.json({ status: 'ERR_WRONG_PARAMS' });
            return;
        }

        let query = "";
        let params = [name];

        if (mode === 'ADD') {
            if (isNone(fc1Id)) {
                res.json({ status: 'ERR_WRONG_PARAMS' });
                return;
            }

            query = "INSERT INTO t_food_categories2 (fc2_name, fc2_fc1_id) VALUES (?, ?)";
            params.push(fc1Id);

        } else if (mode === 'MODIFY') {
            if (isNone(fc2Id)) {
                res.json({ status: 'ERR_WRONG_PARAMS' });
                return;
            }

            query = "UPDATE t_food_categories2 SET fc2_name = ? WHERE fc2_id = ?";
            params.push(fc2Id);

        } else {
            res.json({ status: 'ERR_WRONG_MODE' });
            return;
        }

        await pool.query(query, params);
        res.json({ status: 'OK' });

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;