var express = require('express');
var router = express.Router();
const { isLogined, isNone } = require('../../lib/common');
const pool = require('../../lib/database');


//음식 저장 (추가, 수정)
router.post('', async (req, res) => {
    try {
        if (!isLogined(req.session)) {
            res.json({ status: 'ERR_NO_PERMISSION' });
            return;
        }

        let mode = req.body.mode; // ADD, MODIFY
        let fId = req.body.fId;
        let name = req.body.name;
        let keyword = req.body.keyword;
        let descShort = req.body.descShort;
        let desc = req.body.desc;
        let nutrientList = req.body.nutrients;

        let fc1Id = req.body.fc1Id;
        let fc2Id = req.body.fc2Id;
        let edible = req.body.edible;

        if (isNone(mode) || isNone(name) || isNone(keyword) || isNone(fc1Id) || isNone(fc2Id)) {
            res.json({status: 'ERR_WRONG_PARAMS'});
            return;
        }

        let query = "";
        let params = [name, keyword, descShort, desc, fc1Id, fc2Id, edible];

        if (mode === 'ADD') {
            query = "INSERT INTO t_foods (f_name, f_keyword, f_desc_short, f_desc, f_fc1_id, f_fc2_id, f_edible) VALUES (?, ?, ?, ?, ?, ?, ?)";
            let [result, fields] = await pool.query(query, params);
            fId = result.insertId;

        } else if (mode === 'MODIFY') {
            if (isNone(fId)) {
                res.json({status: 'ERR_WRONG_PARAMS'});
                return;
            }

            query = "UPDATE t_foods SET";
            query += " f_name = ?, f_keyword = ?, f_desc_short = ?, f_desc = ?, f_fc1_id = ?, f_fc2_id = ?, f_edible = ?";
            query += " WHERE f_id = ?";
            params.push(fId);
            await pool.query(query, params);

            // 연관 데이터 삭제
            query = "DELETE FROM t_maps_food_nutrient WHERE mfn_f_id = ?";
            params = [fId];
            await pool.query(query, params);

        } else {
            res.json({ status: 'ERR_WRONG_MODE' });
            return;
        }

        // 연관 영양소
        if (nutrientList.length > 0) {
            query = "INSERT INTO t_maps_food_nutrient (mfn_f_id, mfn_n_id) VALUES";
            params = [];
            for (let i = 0; i < nutrientList.length; i++) {
                if (i > 0) query += " ,";
                query += " (?, ?)";
                params.push(fId);
                params.push(nutrientList[i]);
            }
            await pool.query(query, params);
        }

        res.json({ status: 'OK', fId: fId });

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;
