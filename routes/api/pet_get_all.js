
var express = require('express');
var router = express.Router();
const { isLogined, isNone } = require('../../lib/common');
const pool = require('../../lib/database');


//펫 전체 조회
router.get('', async (req, res) => {
    try {
        if (!isLogined(req.session)) {
            res.json({ status: 'ERR_NO_PERMISSION' });
            return;
        }
        
        let query = "SELECT * FROM t_pets AS peTab";
        query += " JOIN t_users AS uTab ON uTab.u_id = peTab.pe_u_id";
        query += " JOIN t_breeds AS bTab ON bTab.b_id = peTab.pe_b_id";
        
        let [result, fields] = await pool.query(query);

        res.json({ status: 'OK', result: result });

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;