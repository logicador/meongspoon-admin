var express = require('express');
var router = express.Router();
const { isLogined, isNone } = require('../../lib/common');
const pool = require('../../lib/database');


//전체 음식 카테고리1 가져오기
router.get('', async (req, res) => {
    try {
        if (!isLogined(req.session)) {
            res.json({ status: 'ERR_NO_PERMISSION' });
            return;
        }
        
        let query = "SELECT * FROM t_food_categories1 AS fc1Tab";
        query += " LEFT JOIN (SELECT fc2_fc1_id, GROUP_CONCAT(CONCAT_WS(':', fc2_id, fc2_name) SEPARATOR '|') AS fc2_info FROM t_food_categories2 GROUP BY fc2_fc1_id) AS fc2Tab";
        query += " ON fc1Tab.fc1_id = fc2Tab.fc2_fc1_id;";

        let [result, fields] = await pool.query(query);

        res.json({ status: 'OK', result: result });

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;