var express = require('express');
var router = express.Router();
const { isLogined, isNone } = require('../../lib/common');
const pool = require('../../lib/database');


//견종 저장 (입력, 수정)
router.post('', async (req, res) => {
    try {
        if (!isLogined(req.session)) {
            res.json({ status: 'ERR_NO_PERMISSION' });
            return;
        }

        let mode = req.body.mode; // ADD, MODIFY
        let bId = req.body.bId;
        let bType = req.body.bType;
        let name = req.body.name;
        let keyword = req.body.keyword;
        let breedAgeGroups = req.body.breedAgeGroups;
        // let deleteBreedAgeGroups = req.body.deleteBreedAgeGroups; // 폐기 예정 (취약질병 X)

        if (isNone(name) || isNone(keyword) || isNone(bType)) {
            res.json({status: 'ERR_WRONG_PARAMS'});
            return;
        }

        let query = "";
        let params = [name, keyword, bType];

        if (mode === 'ADD') {
            query = "INSERT INTO t_breeds(b_name, b_keyword, b_type) VALUES(?, ?, ?)";
            let [result, fields] = await pool.query(query, params);
            bId = result.insertId;

        } else if (mode === 'MODIFY') {
            if (isNone(bId)) {
                res.json({ status: 'ERR_WRONG_PARAMS' });
                return;
            }

            query = "UPDATE t_breeds SET b_name = ?, b_keyword = ?, b_type = ? WHERE b_id = ?";
            params.push(bId);
            await pool.query(query, params);

            // 연관 데이터 삭제
            params = [bId];

            query = "DELETE FROM t_breed_age_groups WHERE bag_b_id = ?";
            await pool.query(query, params);

        } else {
            res.json({status: 'ERR_WRONG_MODE'});
            return;
        }

        // 연관 나이대별 그룹
        if (breedAgeGroups.length > 0) {
            query = "INSERT INTO t_breed_age_groups (bag_b_id, bag_min_age, bag_max_age) VALUES";
            params = [];
            for (let i = 0; i < breedAgeGroups.length; i++) {
                if (i > 0) query += " ,";
                query += " (?, ?, ?)";
                params.push(bId);
                params.push(breedAgeGroups[i].minAge);
                params.push(breedAgeGroups[i].maxAge);
            }
            await pool.query(query, params);
        }

        res.json({ status: 'OK', bId: bId });

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;
