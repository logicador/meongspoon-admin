var express = require('express');
var router = express.Router();
const { isLogined, isNone } = require('../../lib/common');
const pool = require('../../lib/database');
const fs = require('fs');


//이미지 삭제
router.post('', async (req, res) => {
    try {
        if (!isLogined(req.session)) {
            res.json({ status: 'ERR_NO_PERMISSION' });
            return;
        }
        
        let deleteList = req.body.deleteList;

        if (!(deleteList)) {
            res.json({ status: 'ERR_WRONG_PARAMS' });
            return;
        }

        let query = "DELETE FROM t_images WHERE i_id IN (";
        let params = [];

        for (let i = 0; i < deleteList.length; i++) {
            if (fs.existsSync(`public${deleteList[i].path}`)) {
                fs.unlinkSync(`public${deleteList[i].path}`);
                let splitted = deleteList[i].path.split('.');
                let original = `${splitted[0]}_original.${splitted[1]}`;
                if (fs.existsSync(`public${original}`)) {
                    fs.unlinkSync(`public${original}`);
                }
            }

            if (deleteList[i].type != 'THUMB') {
                if (params.length > 0) query += " ,";
                query += " ?";
                params.push(deleteList[i].iId);
            }
        }

        query += " )";

        if (params.length > 0) await pool.query(query, params);

        res.json({ status: 'OK' });

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;