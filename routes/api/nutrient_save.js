var express = require('express');
var router = express.Router();
const { isLogined, isNone } = require('../../lib/common');
const pool = require('../../lib/database');


//영양소 저장 (추가, 수정)
router.post('', async (req, res) => {
    try {
        if (!isLogined(req.session)) {
            res.json({ status: 'ERR_NO_PERMISSION' });
            return;
        }

        let mode = req.body.mode; // ADD, MODIFY
        let nId = req.body.nId;
        let name = req.body.name;
        let keyword = req.body.keyword;
        let desc = req.body.desc;
        let descOver = req.body.descOver;
        let descShort = req.body.descShort;

        if (isNone(mode) || isNone(name) || isNone(keyword)) {
            res.json({status: 'ERR_WRONG_PARAMS'});
            return;
        }

        let query = "";
        let params = [name, keyword, desc, descOver, descShort];

        if (mode === 'ADD') {
            query += "INSERT INTO t_nutrients (n_name, n_keyword, n_desc, n_desc_over, n_desc_short) VALUES (?, ?, ?, ?, ?)";
            await pool.query(query, params);

        } else if (mode === 'MODIFY') {
            if (isNone(nId)) {
                res.json({status: 'ERR_WRONG_PARAMS'});
                return;
            }
            
            query += "UPDATE t_nutrients SET";
            query += " n_name = ?, n_keyword = ?, n_desc = ?, n_desc_over = ?, n_desc_short = ?";
            query += " WHERE n_id = ?";
            params.push(nId);
            await pool.query(query, params);

        } else {
            res.json({ status: 'ERR_WRONG_MODE' });
            return;
        }

        res.json({ status: 'OK' });

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;