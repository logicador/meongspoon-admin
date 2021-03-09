var express = require('express');
var router = express.Router();
const { isLogined, isNone } = require('../../lib/common');
const pool = require('../../lib/database');


//특정 음식 조회
router.get('', async (req, res) => {
    try {
        if (!isLogined(req.session)) {
            res.json({ status: 'ERR_NO_PERMISSION' });
            return;
        }
        
        let fId = req.query.fId;

        if (isNone(fId)) {
            res.json({ status: 'ERR_WRONG_PARAMS' });
            return;
        }

        let query = "SELECT * FROM t_foods WHERE f_id = ?";
        let params = [fId];

        //특정 음식의 기본정보 조회
        let [result, fields] = await pool.query(query, params);

        if (result.length == 0) {
            res.json({ status: 'ERR_NO_DATA' });
            return;
        }

        let food = result[0];

        // 연관된 영양소 정보
        query = "SELECT * FROM t_maps_food_nutrient AS fTab";
        query += " LEFT JOIN t_nutrients AS nTab ON nTab.n_id = fTab.mfn_n_id";
        query += " WHERE fTab.mfn_f_id = ?";
        params = [fId];
        [result, fields] = await pool.query(query, params);
        let nutrientList = result;

        res.json({status: 'OK', result: {
            food: food,
            nutrientList: nutrientList
        }});

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;