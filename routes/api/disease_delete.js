var express = require('express');
var router = express.Router();
const { isLogined, isNone } = require('../../lib/common');
const pool = require('../../lib/database');


//질병 삭제
router.post('', async (req, res) => {
    try {
        if (!isLogined(req.session)) {
            res.json({ status: 'ERR_NO_PERMISSION' });
            return;
        }
        
        let dId = req.body.dId;

        if (isNone(dId)) {
            res.json({status: 'ERR_WRONG_PARAMS'});
            return;
        }

        let query = "SELECT *";
        query += " FROM t_diseases AS dTab";
        query += " LEFT JOIN (SELECT msd_d_id, COUNT(*) AS msdCnt FROM t_maps_symptom_disease GROUP BY msd_d_id) AS msdTab";
        query += " ON dTab.d_id = msdTab.msd_d_id";
        query += " LEFT JOIN (SELECT mped_d_id, COUNT(*) AS mpedCnt FROM t_maps_pet_disease GROUP BY mped_d_id) AS mpedTab";
        query += " ON dTab.d_id = mpedTab.mped_d_id";
        query += " LEFT JOIN (SELECT mbagd_d_id, COUNT(*) AS mbagdCnt FROM t_maps_breed_age_group_disease GROUP BY mbagd_d_id) AS mbagdTab";
        query += " ON dTab.d_id = mbagdTab.mbagd_d_id";
        query += " WHERE dTab.d_id = ?";

        let params = [dId];

        let [result, fields] = await pool.query(query, params);

        if (result.length == 0) {
            res.json({ status: 'ERR_NO_DATA' });
            return;
        }

        let disease = result[0];

        if (disease.msdCnt > 0) {
            res.json({status: 'ERR_EXISTS_SYMPTOM'});
            return;
        }

        if (disease.mpedCnt > 0) {
            res.json({status: 'ERR_EXISTS_PRODUCT'});
            return;
        }

        if (disease.mbagdCnt > 0) {
            res.json({status: 'ERR_EXISTS_BREED_AGE_GROUP'});
            return;
        }

        query = "DELETE FROM t_diseases WHERE d_id = ?";
        await pool.query(query, params);

        query = "DELETE FROM t_maps_disease_nutrient_food WHERE mdnf_d_id = ?";
        await pool.query(query, params);
        
        res.json({ status: 'OK' });

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;