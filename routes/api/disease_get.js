var express = require('express');
var router = express.Router();
const { isLogined, isNone } = require('../../lib/common');
const pool = require('../../lib/database');


// 특정 질병 조회
router.get('', async (req, res) => {
    try {
        if (!isLogined(req.session)) {
            res.json({ status: 'ERR_NO_PERMISSION' });
            return;
        }
        
        let dId = req.query.dId;

        if (isNone(dId)) {
            res.json({ status: 'ERR_WRONG_PARAMS' });
            return;
        }

        let query = "SELECT * FROM t_diseases WHERE d_id = ?";
        let params = [dId];
        let [result, fields] = await pool.query(query, params);

        if (result.length == 0) {
            res.json({ status: 'ERR_NO_DATA' });
            return;
        }

        let disease = result[0];

        // 연관된 음식, 영양소 정보
        query = "SELECT * FROM t_maps_disease_nutrient_food AS mdnfTab";
        query += " LEFT JOIN t_foods AS fTab ON fTab.f_id = mdnfTab.mdnf_target_id";
        query += " LEFT JOIN t_nutrients AS nTab ON nTab.n_id = mdnfTab.mdnf_target_id";
        query += " WHERE mdnfTab.mdnf_d_id = ?";
        [result, fields] = await pool.query(query, params);
        let nutrientFoodList = result;

        // 연관된 증상 정보
        query = "SELECT * FROM t_maps_symptom_disease AS msdTab";
        query += " JOIN t_symptoms AS sTab ON sTab.s_id = msdTab.msd_s_id";
        query += " WHERE msd_d_id = ?";
        [result, fields] = await pool.query(query, params);
        let symptomList = result;

        res.json({status: 'OK', result: {
            disease: disease,
            nutrientFoodList: nutrientFoodList,
            symptomList: symptomList
        }});

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;