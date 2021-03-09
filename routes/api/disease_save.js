var express = require('express');
var router = express.Router();
const { isLogined, isNone } = require('../../lib/common');
const pool = require('../../lib/database');


//질병 저장 (추가, 수정)
router.post('', async (req, res) => {
    try {
        if (!isLogined(req.session)) {
            res.json({ status: 'ERR_NO_PERMISSION' });
            return;
        }
        
        let mode = req.body.mode; // ADD, MODIFY
        let dId = req.body.dId;
        let bpId = req.body.bpId;
        let name = req.body.name;
        let keyword = req.body.keyword;
        let reason = req.body.reason;
        let management = req.body.management;
        let nutrientFoodData = req.body.nutrientFoodData;
        let symptomData = req.body.symptomData;
        let operation = req.body.operation;

        if (isNone(mode) || isNone(name) || isNone(keyword) || isNone(bpId) || isNone(operation)) {
            res.json({status: 'ERR_WRONG_PARAMS'});
            return;
        }

        let query = "";
        let params = [name, keyword, bpId, reason, management, operation];

        if (mode === 'ADD') { //추가일떄
            query += "INSERT INTO t_diseases (d_name, d_keyword, d_bp_id, d_reason, d_management, d_operation) VALUES (?, ?, ?, ?, ?, ?)";
            let [result, fields] = await pool.query(query, params);
            dId = result.insertId;

        } else if (mode === 'MODIFY') { //수정일때
            if (isNone(dId)) {
                res.json({ status: 'ERR_WRONG_PARAMS' });
                return;
            }

            query += "UPDATE t_diseases SET";
            query += " d_name = ?, d_keyword = ?, d_bp_id = ?, d_reason = ?, d_management = ?, d_operation = ?";
            query += " WHERE d_id = ?";
            params.push(dId);
            await pool.query(query, params);

            // 연관 데이터 삭제
            params = [dId];

            query = "DELETE FROM t_maps_disease_nutrient_food WHERE mdnf_d_id = ?";
            await pool.query(query, params);
            
            query = "DELETE FROM t_maps_symptom_disease WHERE msd_d_id = ?";
            await pool.query(query, params);

        } else {
            res.json({ status: 'ERR_WRONG_MODE' });
            return;
        }

        // 연관 음식, 영양소
        if (nutrientFoodData.length > 0) {
            query = "INSERT INTO t_maps_disease_nutrient_food (mdnf_d_id, mdnf_type, mdnf_target_id) VALUES";
            params = [];
            for (let i = 0; i < nutrientFoodData.length; i++) {
                if (i > 0) query += " ,";
                query += " (?, ?, ?)";
                params.push(dId);
                params.push(nutrientFoodData[i].type);
                params.push(nutrientFoodData[i].targetId);
            }
            await pool.query(query, params);
        }

        // 연관 증상
        if (symptomData.length > 0) {
            query = "INSERT INTO t_maps_symptom_disease (msd_s_id, msd_d_id) VALUES";
            params = [];
            for (let i = 0; i < symptomData.length; i++) {
                if (i > 0) query += " ,";
                query += " (?, ?)";
                params.push(symptomData[i]);
                params.push(dId);
            }
            await pool.query(query, params);
        }

        res.json({ status: 'OK' });

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;