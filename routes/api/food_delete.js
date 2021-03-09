var express = require('express');
var router = express.Router();
const { isLogined, isNone } = require('../../lib/common');
const pool = require('../../lib/database');
const fs = require('fs');


//음식 삭제
router.post('', async (req, res) => {
    try {
        if (!isLogined(req.session)) {
            res.json({ status: 'ERR_NO_PERMISSION' });
            return;
        }
        
        let fId = req.body.fId;

        if (isNone(fId)) {
            res.json({ status: 'ERR_WRONG_PARAMS' });
            return;
        }

        let query = "SELECT *";
        query += " FROM t_foods AS fTab";
        query += " LEFT JOIN (SELECT msnf_target_id, COUNT(*) AS msnfCnt FROM t_maps_symptom_nutrient_food WHERE msnf_type = 'FOOD' GROUP BY msnf_target_id) AS msnfTab";
        query += " ON fTab.f_id = msnfTab.msnf_target_id";
        query += " LEFT JOIN (SELECT mpnf_target_id, COUNT(*) AS mpnfCnt FROM t_maps_product_nutrient_food WHERE mpnf_type = 'FOOD' GROUP BY mpnf_target_id) AS mpnfTab";
        query += " ON fTab.f_id = mpnfTab.mpnf_target_id";
        query += " LEFT JOIN (SELECT mdnf_target_id, COUNT(*) AS mdnfCnt FROM t_maps_disease_nutrient_food WHERE mdnf_type = 'FOOD' GROUP BY mdnf_target_id) AS mdnfTab";
        query += " ON fTab.f_id = mdnfTab.mdnf_target_id";
        query += " WHERE fTab.f_id = ?";

        let params = [fId];
        
        let [result, fields] = await pool.query(query, params);

        if (result.length == 0) {
            res.json({ status: 'ERR_NO_DATA' });
            return;
        }

        let food = result[0];

        if (food.msnfCnt > 0) {
            res.json({ status: 'ERR_EXISTS_SYMPTOM' });
            return;
        }

        if (food.mpnfCnt > 0) {
            res.json({ status: 'ERR_EXISTS_PRODUCT' });
            return;
        }

        if (food.mdnfCnt > 0) {
            res.json({ status: 'ERR_EXISTS_DISEASE' });
            return;
        }

        query = "DELETE FROM t_foods WHERE f_id = ?";
        await pool.query(query, params);

        query = 'DELETE FROM t_maps_food_nutrient WHERE mfn_f_id = ?';
        await pool.query(query, params);

        if (!isNone(food.f_thumbnail)) {
            if (fs.existsSync(`public${food.f_thumbnail}`)) {
                fs.unlinkSync(`public${food.f_thumbnail}`);
                let splitted = food.f_thumbnail.split('.');
                let original = `${splitted[0]}_original.${splitted[1]}`;
                if (fs.existsSync(`public${original}`)) {
                    fs.unlinkSync(`public${original}`);
                }
            }
        }

        res.json({ status: 'OK' });

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;