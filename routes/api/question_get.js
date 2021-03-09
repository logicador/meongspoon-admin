var express = require('express');
var router = express.Router();
const { isLogined, isNone } = require('../../lib/common');
const pool = require('../../lib/database');


router.get('', async (req, res) => {
    try {
        if (!isLogined(req.session)) {
            res.json({ status: 'ERR_NO_PERMISSION' });
            return;
        }

        let qId = req.query.qId;

        let query = "SELECT * FROM t_questions AS qTab";
        query += " JOIN t_users AS uTab ON uTab.u_id = qTab.q_u_id";
        query += " WHERE qTab.q_id = ?";

        let params = [qId];
        
        let [result, fields] = await pool.query(query, params);

        res.json({ status: 'OK', result: result[0] });

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;