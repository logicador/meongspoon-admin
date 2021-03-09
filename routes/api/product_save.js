var express = require('express');
var router = express.Router();
const { isLogined, isNone } = require('../../lib/common');
const pool = require('../../lib/database');


//제품 저장 (등록, 수정)
router.post('', async (req, res) => {
    try {
        if (!isLogined(req.session)) {
            res.json({ status: 'ERR_NO_PERMISSION' });
            return;
        }
        
        let mode = req.body.mode;
        let pId = req.body.pId;
        let pcId = req.body.pcId;
        let pbId = req.body.pbId;
        let name = req.body.name;
        let keyword = req.body.keyword;
        let price = req.body.price;
        let origin = req.body.origin;
        let manufacturer = req.body.manufacturer;
        let packingVolume = req.body.packingVolume;
        let recommend = req.body.recommend;
        let feedNutrients = req.body.feedNutrients;
        let nutrientFoodData = req.body.nutrientFoodData;

        console.log(pcId);
        console.log(pbId);
        console.log(name);
        console.log(keyword);
        console.log(feedNutrients);

        if (isNone(pcId) || isNone(pbId) || isNone(name) || isNone(keyword) || (pcId == 1 && !(feedNutrients))) {
            res.json({status: 'ERR_WRONG_PARAMS'});
            return;
        }

        if (isNone(price)) price = 0;

        let query = "";
        let params = [pcId, pbId, name, keyword, price, origin, manufacturer, packingVolume, recommend];

        if (mode === 'ADD') { // 추가일때
            query = "INSERT INTO t_products (p_pc_id, p_pb_id, p_name, p_keyword, p_price, p_origin, p_manufacturer, p_packing_volume, p_recommend) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            let [result, fields] = await pool.query(query, params);
            pId = result.insertId;

        } else if (mode === 'MODIFY') { // 수정일때
            if (isNone(pId)) {
                res.json({status: 'ERR_WRONG_PARAMS'});
                return;
            }

            query = "UPDATE t_products";
            query += " SET p_pc_id = ?, p_pb_id = ?, p_name = ?, p_keyword = ?, p_price = ?, p_origin = ?, p_manufacturer = ?, p_packing_volume = ?, p_recommend = ?";
            query += " WHERE p_id = ?";
            params.push(pId);
            await pool.query(query, params);

            // 연관 데이터 삭제
            params = [pId];

            query = "DELETE FROM t_maps_product_nutrient_food WHERE mpnf_p_id = ?";
            await pool.query(query, params);

            query = "DELETE FROM t_feed_nutrients WHERE fn_p_id = ?";
            await pool.query(query, params);

        } else {
            res.json({ status: 'ERR_WRONG_MODE' });
            return;
        }

        // 연관 음식, 영양소
        if (nutrientFoodData.length > 0) {
            query = "INSERT INTO t_maps_product_nutrient_food (mpnf_p_id, mpnf_type, mpnf_target_id) VALUES";
            params = [];
            for (let i = 0; i < nutrientFoodData.length; i++) {
                if (i > 0) query += " ,";
                query += " (?, ?, ?)";
                params.push(pId);
                params.push(nutrientFoodData[i].type);
                params.push(nutrientFoodData[i].targetId);
            }
            await pool.query(query, params);
        }

        // 제품이 사료일 경우 연관 성분
        if (pcId == 1) {
            query = 'INSERT INTO t_feed_nutrients (fn_p_id, fn_prot, fn_fat, fn_fibe, fn_ash, fn_calc, fn_phos, fn_mois) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            params = [
                pId, feedNutrients.prot, feedNutrients.fat, feedNutrients.fibe, feedNutrients.ash,
                feedNutrients.calc, feedNutrients.phos, feedNutrients.mois
            ];
            await pool.query(query, params);
        }

        res.json({ status: 'OK', pId: pId });

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;