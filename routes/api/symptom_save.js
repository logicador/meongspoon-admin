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
        
        let mode = req.body.mode; // ADD, MODIFY
        let sId = req.body.sId;
        let name = req.body.name;
        let keyword = req.body.keyword;
        let bpId = req.body.bpId;
        let nutrientFoodData = req.body.nutrientFoodData;
        let diseaseData = req.body.diseaseData;

        if (isNone(mode) || isNone(name) || isNone(keyword) || isNone(bpId)) {
            res.json({status: 'ERR_WRONG_PARAMS'});
            return;
        }

        let query = "";
        let params = [name, keyword, bpId];

        //저장인지 수정인지 확인
        if (mode === 'ADD') { //추가일떄
            query += "INSERT INTO t_symptoms (s_name, s_keyword, s_bp_id) VALUES (?, ?, ?)";
            let [result, fields] = await pool.query(query, params);
            sId = result.insertId;

        } else if (mode === 'MODIFY') { //수정일때
            if (isNone(sId)) {
                res.json({status: 'ERR_WRONG_PARAMS'});
                return;
            }

            query += "UPDATE t_symptoms SET s_name = ?, s_keyword = ?, s_bp_id = ? WHERE s_id = ?";
            params.push(sId);
            await pool.query(query, params);

            // 연관 데이터 삭제
            params = [sId];

            query = "DELETE FROM t_maps_symptom_nutrient_food WHERE msnf_s_id = ?";
            await pool.query(query, params);
            
            query = "DELETE FROM t_maps_symptom_disease WHERE msd_s_id = ?";
            await pool.query(query, params);

        } else {
            res.json({ status: 'ERR_WRONG_MODE' });
            return;
        }

        // 연관 음식, 영양소
        if (nutrientFoodData.length > 0) {
            query = "INSERT INTO t_maps_symptom_nutrient_food (msnf_s_id, msnf_type, msnf_target_id) VALUES";
            params = [];
            for (let i = 0; i < nutrientFoodData.length; i++) {
                if (i > 0) query += " ,";
                query += " (?, ?, ?)";
                params.push(sId);
                params.push(nutrientFoodData[i].type);
                params.push(nutrientFoodData[i].targetId);
            }
            await pool.query(query, params);
        }

        // 연관 질병
        if (diseaseData.length > 0) {
            query = "INSERT INTO t_maps_symptom_disease (msd_s_id, msd_d_id) VALUES";
            params = [];
            for (let i = 0; i < diseaseData.length; i++) {
                if (i > 0) query += " ,";
                query += " (?, ?)";
                params.push(sId);
                params.push(diseaseData[i]);
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