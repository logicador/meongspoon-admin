var express = require('express');
var router = express.Router();
const { isLogined, isNone } = require('../../lib/common');
const pool = require('../../lib/database');


//제품 브랜드 저장 (입력, 수정)
router.post('', async (req, res) => {
    try {
        if (!isLogined(req.session)) {
            res.json({ status: 'ERR_NO_PERMISSION' });
            return;
        }
        
        let mode = req.body.mode; // ADD, MODIFY
        let pbId = req.body.pbId;
        let name = req.body.name;

        if (isNone(name)) {
            res.json({status: 'ERR_WRONG_PARAMS'});
            return;
        }

        let query = "";
        let params = [name];

        if (mode === 'ADD') {
            query = "INSERT INTO t_product_brands (pb_name) VALUES (?)";
            await pool.query(query, params);

        } else if (mode === 'MODIFY') {
            if (isNone(pbId)) {
                res.json({ status: 'ERR_WRONG_PARAMS' });
                return;
            }

            query = "UPDATE t_product_brands SET pb_name = ? WHERE pb_id = ?";
            params.push(pbId);
            console.log(query, params);
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