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

        let bcAda = req.body.bcAda;
        let bcAff = req.body.bcAff;
        let bcApa = req.body.bcApa;
        let bcBar = req.body.bcBar;
        let bcCat = req.body.bcCat;
        let bcKid = req.body.bcKid;
        let bcDog = req.body.bcDog;
        let bcExe = req.body.bcExe;
        let bcTri = req.body.bcTri;
        let bcHea = req.body.bcHea;
        let bcInt = req.body.bcInt;
        let bcJok = req.body.bcJok;
        let bcHai = req.body.bcHai;
        let bcSoc = req.body.bcSoc;
        let bcStr = req.body.bcStr;
        let bcDom = req.body.bcDom;
        let bcTra = req.body.bcTra;
        let bcPro = req.body.bcPro;

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

            query = "INSERT INTO t_breed_characters";
            query += " (bc_b_id, bc_ada, bc_aff, bc_apa, bc_bar, bc_cat, bc_kid, bc_dog, bc_exe,";
            query += " bc_tri, bc_hea, bc_int, bc_jok, bc_hai, bc_soc, bc_str, bc_dom, bc_tra, bc_pro)";
            query += " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            params = [bId, bcAda, bcAff, bcApa, bcBar, bcCat, bcKid, bcDog, bcExe, bcTri, bcHea, bcInt, bcJok, bcHai, bcSoc, bcStr, bcDom, bcTra, bcPro];
            await pool.query(query, params);

        } else if (mode === 'MODIFY') {
            if (isNone(bId)) {
                res.json({ status: 'ERR_WRONG_PARAMS' });
                return;
            }

            query = "UPDATE t_breeds SET b_name = ?, b_keyword = ?, b_type = ? WHERE b_id = ?";
            params.push(bId);
            await pool.query(query, params);

            query = "UPDATE t_breed_characters SET";
            query += " bc_ada = ?, bc_aff = ?, bc_apa = ?, bc_bar = ?, bc_cat = ?, bc_kid = ?,";
            query += " bc_dog = ?, bc_exe = ?, bc_tri = ?, bc_hea = ?, bc_int = ?, bc_jok = ?,";
            query += " bc_hai = ?, bc_soc = ?, bc_str = ?, bc_dom = ?, bc_tra = ?, bc_pro = ?";
            query += " WHERE bc_b_id = ?";
            params = [bcAda, bcAff, bcApa, bcBar, bcCat, bcKid, bcDog, bcExe, bcTri, bcHea, bcInt, bcJok, bcHai, bcSoc, bcStr, bcDom, bcTra, bcPro, bId];
            await pool.query(query, params);

            // 연관 데이터 삭제
            query = "DELETE FROM t_breed_age_groups WHERE bag_b_id = ?";
            params = [bId];
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
