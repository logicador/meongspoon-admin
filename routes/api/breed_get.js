var express = require('express');
var router = express.Router();
const { isLogined, isNone } = require('../../lib/common');
const pool = require('../../lib/database');


//특정 견종 가져오기
router.get('', async (req, res) => {
    try {
        if (!isLogined(req.session)) {
            res.json({ status: 'ERR_NO_PERMISSION' });
            return;
        }

        let bId = req.query.bId;

        if (isNone(bId)) {
            res.json({ status: 'ERR_WRONG_PARAMS' });
            return;
        }

        let query = "SELECT * FROM t_breeds WHERE b_id = ?";
        let params = [bId];
        let [result, fields] = await pool.query(query, params);

        if (result.length == 0) {
            res.json({ status: 'ERR_NO_DATA' });
            return;
        }

        let breed = result[0];

        query = "SELECT * FROM t_breed_age_groups WHERE bag_b_id = ?";
        [result, fields] = await pool.query(query, params);

        let breedAgeGroupList = result;

        query = "SELECT * FROM t_breed_characters WHERE bc_b_id = ?";
        [result, fields] = await pool.query(query, params);

        let breedCharacter = result[0];

        res.json({status: 'OK', result: {
            breed : breed,
            breedAgeGroupList: breedAgeGroupList,
            breedCharacter: breedCharacter
        }});

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;
