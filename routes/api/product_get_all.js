var express = require('express');
var router = express.Router();
const { isLogined, isNone } = require('../../lib/common');
const pool = require('../../lib/database');


//전체제품 가져오기
router.get('', async (req, res) => {
    try {
        if (!isLogined(req.session)) {
            res.json({ status: 'ERR_NO_PERMISSION' });
            return;
        }

        let query = "SELECT * FROM t_products AS pTab";
        query += " JOIN t_product_categories AS pcTab ON pcTab.pc_id = pTab.p_pc_id";
        query += " JOIN t_product_brands AS pbTab ON pbTab.pb_id = pTab.p_pb_id";

        let [result, fields] = await pool.query(query);
        
        res.json({ status: 'OK', result: result });

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;