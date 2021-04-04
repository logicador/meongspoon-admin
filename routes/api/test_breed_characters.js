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

        let query = "SELECT * FROM t_breeds";
        let params = [];
        let [result, fields] = await pool.query(query);

        for (let i = 0; i < result.length; i++) {
            let breed = result[i];

            query = "INSERT INTO t_breed_characters (bc_b_id) VALUES (?)";
            params = [breed.b_id];
            await pool.query(query, params);
        }

        res.json({ status: 'OK' });

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;
