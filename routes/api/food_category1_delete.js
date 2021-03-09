var express = require('express');
var router = express.Router();
const { isLogined, isNone } = require('../../lib/common');
const pool = require('../../lib/database');


//음식 카테고리1 삭제
router.post('', async (req, res) => {
    try {
        if (!isLogined(req.session)) {
            res.json({ status: 'ERR_NO_PERMISSION' });
            return;
        }
        
        let fc1Id = req.body.fc1Id;

        if (isNone(fc1Id)) {
            res.json({ stauts: 'ERR_WRONG_PARAMS' });
            return;
        }

        let query = "SELECT * FROM t_food_categories1 AS fc1Tab";
        query += " LEFT JOIN (SELECT *, COUNT(*) AS fCnt FROM t_foods GROUP BY f_id) AS fTab";
        query += " ON fTab.f_fc1_id = fc1Tab.fc1_id";
        query += " WHERE fc1Tab.fc1_id = ?";

        let params = [fc1Id];

        let [result, fields] = await pool.query(query, params);

        if (result.length == 0) {
            res.json({ status: 'ERR_NO_DATA' });
            return;
        }

        let foodCategory1 = result[0];

        if (foodCategory1.fCnt > 0) {
            res.json({ status: 'ERR_EXISTS_FOOD' });
            return;
        }

        query = "DELETE FROM t_food_categories1 WHERE fc1_id = ?";
        await pool.query(query, params);

        query = "DELETE FROM t_food_categories2 WHERE fc2_fc1_id = ?";
        await pool.query(query, params);

        res.json({ status: 'OK' });

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;