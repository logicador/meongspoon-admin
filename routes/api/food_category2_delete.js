var express = require('express');
var router = express.Router();
const { isLogined, isNone } = require('../../lib/common');
const pool = require('../../lib/database');


//음식 카테고리2 삭제
router.post('', async (req, res) => {
    try {
        if (!isLogined(req.session)) {
            res.json({ status: 'ERR_NO_PERMISSION' });
            return;
        }
        
        let fc2Id = req.body.fc2Id;

        if (isNone(fc2Id)) {
            res.json({ stauts: 'ERR_WRONG_PARAMS' });
            return;
        }

        let query = "SELECT * FROM t_food_categories2 AS fc2Tab";
        query += " LEFT JOIN (SELECT *, COUNT(*) AS fCnt FROM t_foods GROUP BY f_id) AS fTab";
        query += " ON fTab.f_fc2_id = fc2Tab.fc2_id";
        query += " WHERE fc2Tab.fc2_id = ?";

        let params = [fc2Id];

        let [result, fields] = await pool.query(query, params);

        if (result.length == 0) {
            res.json({ status: 'ERR_NO_DATA' });
            return;
        }

        let foodCategory2 = result[0];

        if (foodCategory2.fCnt > 0) {
            res.json({ status: 'ERR_EXISTS_FOOD' });
            return;
        }

        query = "DELETE FROM t_food_categories2 WHERE fc2_id = ?";
        await pool.query(query, params);

        res.json({status: 'OK'});

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;