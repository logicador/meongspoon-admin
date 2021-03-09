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
        
        let pbId = req.body.pbId;

        if (isNone(pbId)) {
            res.json({status: 'ERR_WRONG_PARAMS'});
            return;
        }

        let query = "SELECT * FROM t_products WHERE p_pb_id = ?";
        let params = [pbId];

        let [result, fields] = await pool.query(query, params);

        if (result.length > 0) {
            res.json({status: 'ERR_EXISTS_PRODUCT'});

        } else {
            query = "DELETE FROM t_product_brands WHERE pb_id = ?";
            await pool.query(query, params);
            res.json({ status: 'OK' });
        }

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;