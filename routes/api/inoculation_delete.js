var express = require('express');
var router = express.Router();
const { isLogined, isNone } = require('../../lib/common');
const pool = require('../../lib/database');


//접종테이블 삭제
router.post('', async (req, res) => {
    try {
        if (!isLogined(req.session)) {
            res.json({ status: 'ERR_NO_PERMISSION' });
            return;
        }
        
        let inId = req.body.inId;

        if (isNone(inId)) {
            res.json({ status: 'ERR_WRONG_PARAMS' });
            return;
        }

        let query = "SELECT * FROM t_maps_pet_inoculation WHERE mpein_in_id = ?";
        let params = [inId];

        let [result, fields] = await pool.query(query, params);

        if (result.length > 0) {
            res.json({ status: 'ERR_EXISTS_PET' });
            return;
        }

        query = "DELETE FROM t_inoculations WHERE in_id = ?";
        await pool.query(query, params);
        res.json({ status: 'OK' });

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;