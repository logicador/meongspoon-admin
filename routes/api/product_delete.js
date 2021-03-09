var express = require('express');
var router = express.Router();
const { isLogined, isNone } = require('../../lib/common');
const pool = require('../../lib/database');
const fs = require('fs');


//제품 삭제
router.post('', async (req, res) => {
    try {
        if (!isLogined(req.session)) {
            res.json({ status: 'ERR_NO_PERMISSION' });
            return;
        }

        let pId = req.body.pId;

        if (isNone(pId)) {
            res.json({status: 'ERR_WRONG_PARAMS'});
            return;
        }

        let query = "SELECT * FROM t_products AS pTab";
        query += " LEFT JOIN (SELECT mpep_p_id, COUNT(*) AS mpepCnt FROM t_maps_pet_product GROUP BY mpep_p_id) AS mpepTab";
        query += " ON mpepTab.mpep_p_id = pTab.p_id";
        query += " LEFT JOIN (SELECT pr_p_id, COUNT(*) AS prCnt FROM t_product_reviews GROUP BY pr_p_id) AS prTab";
        query += " ON pTab.p_id = prTab.pr_p_id";
        query += " WHERE pTab.p_id = ?";

        let params = [pId];

        let [result, fields] = await pool.query(query, params);

        if (result.length == 0) {
            res.json({ status: 'ERR_NO_DATA' });
            return;
        }

        let product = result[0];

        if (product.mpepCnt > 0) {
            res.json({ status: 'ERR_EXISTS_PET' });
            return;
        }

        if (product.prCnt > 0) {
            res.json({ status: 'ERR_EXISTS_REVIEW' });
            return;
        }

        query = "DELETE FROM t_products WHERE p_id = ?";
        await pool.query(query, params);

        query = "DELETE FROM t_maps_product_nutrient_food WHERE mpnf_p_id = ?";
        await pool.query(query, params);

        query = "SELECT * FROM t_images WHERE i_data_type LIKE 'product' AND i_target_id = ?";
        [result, fields] = await pool.query(query, params);

        let imageList = result;

        query = "DELETE FROM t_images WHERE i_data_type LIKE 'product' AND i_target_id = ?";
        await pool.query(query, params);

        if (imageList.length > 0) {
            for (let i = 0; i < imageList.length; i++) {
                if (fs.existsSync(`public${imageList[i].i_path}`)) {
                    fs.unlinkSync(`public${imageList[i].i_path}`);
                    let splitted = imageList[i].i_path.split('.');
                    let original = `${splitted[0]}_original.${splitted[1]}`;
                    if (fs.existsSync(`public${original}`)) {
                        fs.unlinkSync(`public${original}`);
                    }
                }
            }
        }

        if (fs.existsSync(`public${product.p_thumbnail}`)) {
            fs.unlinkSync(`public${product.p_thumbnail}`);
            let splitted = product.p_thumbnail.split('.');
            let original = `${splitted[0]}_original.${splitted[1]}`;
            if (fs.existsSync(`public${original}`)) {
                fs.unlinkSync(`public${original}`);
            }
        }

        res.json({ status: 'OK' });

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;