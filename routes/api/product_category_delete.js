var express = require('express');
var router = express.Router();
const { isLogined, isNone } = require('../../lib/common');
const pool = require('../../lib/database');


//제품 카테고리 삭제
router.post('', async (req, res) => {
    try {
        if (!isLogined(req.session)) {
            res.json({ status: 'ERR_NO_PERMISSION' });
            return;
        }
        
        let pcId = req.body.pcId;

        if (isNone(pcId)) {
            res.json({status: 'ERR_WRONG_PARAMS'});
            return;
        }

        let query = "SELECT * FROM t_products WHERE p_pc_id = ?";
        let params = [pcId];

        let [result, fields] = await pool.query(query, params);

        if (result.length > 0) {
            res.json({ status: 'ERR_EXISTS_PRODUCT' });

        } else {
            query = "DELETE FROM t_product_categories WHERE pc_id = ?";
            await pool.query(query, params);
            res.json({ status: 'OK' });
        }

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;