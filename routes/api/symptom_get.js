var express = require('express');
var router = express.Router();
const { isLogined, isNone } = require('../../lib/common');
const pool = require('../../lib/database');


//특정 증상 조회
router.get('', async (req, res) => {
    try {
        if (!isLogined(req.session)) {
            res.json({ status: 'ERR_NO_PERMISSION' });
            return;
        }
        
        let sId = req.query.sId;

        if (isNone(sId)) {
            res.json({ status: 'ERR_WRONG_PARAMS' });
            return;
        }

        let query = "SELECT * FROM t_symptoms WHERE s_id = ?";
        let params = [sId];
        let [result, fields] = await pool.query(query, params);

        if (result.length == 0) {
            res.json({ status: 'ERR_NO_DATA' });
            return;
        }

        let symptom = result[0];

        // 연관된 음식, 영양소 정보
        query = "SELECT * FROM t_maps_symptom_nutrient_food AS msnfTab";
        query += " LEFT JOIN t_foods AS fTab ON fTab.f_id = msnfTab.msnf_target_id";
        query += " LEFT JOIN t_nutrients AS nTab ON nTab.n_id = msnfTab.msnf_target_id";
        query += " WHERE msnfTab.msnf_s_id = ?";
        [result, fields] = await pool.query(query, params);
        let nutrientFoodList = result;

        // 연관된 질병 정보
        query = "SELECT * FROM t_maps_symptom_disease AS msdTab";
        query += " JOIN t_diseases AS dTab ON dTab.d_id = msdTab.msd_d_id";
        query += " WHERE msd_s_id = ?";
        [result, fields] = await pool.query(query, params);
        let diseaseList = result;

        res.json({status: 'OK', result: {
            symptom: symptom,
            nutrientFoodList: nutrientFoodList,
            diseaseList: diseaseList
        }});

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;