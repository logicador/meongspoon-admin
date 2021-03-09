var express = require('express');
var router = express.Router();
const { isLogined, isNone } = require('../../lib/common');
const pool = require('../../lib/database');


//영양소 삭제
router.post('', async (req, res) => {
    try {
        if (!isLogined(req.session)) {
            res.json({ status: 'ERR_NO_PERMISSION' });
            return;
        }
        
        let nId = req.body.nId;

        if (isNone(nId)) {
            res.json({status: 'ERR_WRONG_PARAMS'});
            return;
        }

        let query = "SELECT *";
        query += " FROM t_nutrients AS nTab";
        query += " LEFT JOIN (SELECT mfn_n_id, COUNT(*) AS mfnCnt FROM t_maps_food_nutrient GROUP BY mfn_n_id) AS mfnTab";
        query += " ON nTab.n_id = mfnTab.mfn_n_id";
        query += " LEFT JOIN (SELECT msnf_target_id, COUNT(*) AS msnfCnt FROM t_maps_symptom_nutrient_food WHERE msnf_type = 'NUTRIENT' GROUP BY msnf_target_id) AS msnfTab";
        query += " ON nTab.n_id = msnfTab.msnf_target_id";
        query += " LEFT JOIN (SELECT mpnf_target_id, COUNT(*) AS mpnfCnt FROM t_maps_product_nutrient_food WHERE mpnf_type = 'NUTRIENT' GROUP BY mpnf_target_id) AS mpnfTab";
        query += " ON nTab.n_id = mpnfTab.mpnf_target_id";
        query += " LEFT JOIN (SELECT mdnf_target_id, COUNT(*) AS mdnfCnt FROM t_maps_disease_nutrient_food WHERE mdnf_type = 'NUTRIENT' GROUP BY mdnf_target_id) AS mdnfTab";
        query += " ON nTab.n_id = mdnfTab.mdnf_target_id";
        query += " WHERE nTab.n_id = ?";

        let params = [nId];

        let [result, fields] = await pool.query(query, params);

        if (result.length == 0) {
            res.json({status: 'ERR_NO_DATA'});
            return;
        }

        let nutrient = result[0];

        if (nutrient.mfnCnt > 0) {
            res.json({ status: 'ERR_EXISTS_FOOD' });
            return;
        }

        if (nutrient.msnfCnt > 0) {
            res.json({ status: 'ERR_EXISTS_SYMPTOM' });
            return;
        }

        if (nutrient.mpnfCnt > 0) {
            res.json({ status: 'ERR_EXISTS_PRODUCT' });
            return;
        }

        if (nutrient.mdnfCnt > 0) {
            res.json({ status: 'ERR_EXISTS_DISEASE' });
            return;
        }

        query = "DELETE FROM t_nutrients WHERE n_id = ?";
        params = [nId];

        await pool.query(query, params);

        res.json({ status: 'OK' });

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;