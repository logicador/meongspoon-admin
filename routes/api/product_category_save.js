var express = require('express');
var router = express.Router();
const { isLogined, isNone } = require('../../lib/common');
const pool = require('../../lib/database');


//제품 카테고리 저장 (입력, 수정)
router.post('', async (req, res) => {
    try {
        if (!isLogined(req.session)) {
            res.json({ status: 'ERR_NO_PERMISSION' });
            return;
        }
        
        let mode = req.body.mode; // ADD, MODIFY
        let pcId = req.body.pcId;
        let name = req.body.name;

        if (isNone(name)) {
            res.json({status: 'ERR_WRONG_PARAMS'});
            return;
        }

        let query = "";
        let params = [name];

        if (mode === 'ADD') {
            query = "INSERT INTO t_product_categories (pc_name) VALUES (?)";
            await pool.query(query, params);

        } else if (mode === 'MODIFY') {
            if (isNone(pcId)) {
                res.json({ status: 'ERR_WRONG_PARAMS' });
                return;
            }

            query = "UPDATE t_product_categories SET pc_name = ? WHERE pc_id = ?";
            params.push(pcId);
            await pool.query(query, params);

        } else {
            res.json({status: 'ERR_WRONG_MODE'});
            return;
        }

        res.json({ status: 'OK' });

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;