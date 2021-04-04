var express = require('express');
var router = express.Router();
const { isLogined, isNone } = require('../../lib/common');
const pool = require('../../lib/database');


//견종 삭제
router.post('', async (req, res) => {
    try {
        if (!isLogined(req.session)) {
            res.json({ status: 'ERR_NO_PERMISSION' });
            return;
        }

        let bId = req.body.bId;

        if (isNone(bId)) {
            res.json({ status: 'ERR_WRONG_PARAMS' });
            return;
        }

        let query = "SELECT *";
        query += " FROM t_breeds AS bTab";
        query += " LEFT JOIN (SELECT pe_b_id, COUNT(*) AS peCnt FROM t_pets GROUP BY pe_b_id) AS peTab";
        query += " ON bTab.b_id = peTab.pe_b_id";
        query += " WHERE bTab.b_id = ?";

        let params = [bId];

        let [result, fields] = await pool.query(query, params);

        if (result.length == 0) {
            res.json({ status: 'ERR_NO_DATA' });
            return;
        }

        let breed = result[0];

        if (breed.peCnt > 0) {
            res.json({ status: 'ERR_EXISTS_PET' });
            return;
        }

        query = "DELETE FROM t_breeds WHERE b_id = ?";
        await pool.query(query, params);

        query = "DELETE FROM t_breed_age_groups WHERE bag_b_id = ?";
        await pool.query(query, params);

        query = "DELETE FROM t_breed_characters WHERE bc_b_id = ?";
        await pool.query(query, params);

        res.json({ status: 'OK' });

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;
