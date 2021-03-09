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
        
        let qId = req.body.qId;
        let answer = req.body.answer;
    
        let query = "UPDATE t_questions SET q_status = 'A', q_answer = ?, q_answered_date = NOW() WHERE q_id = ?";
        let params = [answer, qId];
        await pool.query(query, params);
    
        res.json({ status: 'OK' });

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;