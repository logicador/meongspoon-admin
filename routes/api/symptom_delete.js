var express = require('express');
var router = express.Router();
const { isLogined, isNone } = require('../../lib/common');
const pool = require('../../lib/database');


//증상 삭제
router.post('', async (req, res) => {
    try {
        if (!isLogined(req.session)) {
            res.json({ status: 'ERR_NO_PERMISSION' });
            return;
        }
        
        let sId = req.body.sId;

        if (isNone(sId)) {
            res.json({status: 'ERR_WRONG_PARAMS'});
            return;
        }

        let query = "DELETE FROM t_symptoms WHERE s_id = ?";
        let params = [sId];
        await pool.query(query, params);

        query = "DELETE FROM t_maps_symptom_nutrient_food WHERE msnf_s_id = ?";
        await pool.query(query, params);

        query = "DELETE FROM t_maps_symptom_disease WHERE msd_s_id = ?";
        await pool.query(query, params);

        res.json({ status: 'OK' });

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;