var express = require('express');
var router = express.Router();
const { isLogined, isNone } = require('../../lib/common');
const pool = require('../../lib/database');


//특정 제품 조회
router.get('', async (req, res) => {
    try {
        if (!isLogined(req.session)) {
            res.json({ status: 'ERR_NO_PERMISSION' });
            return;
        }
        
        let pId = req.query.pId;

        if (isNone(pId)) {
            res.json({status: 'ERR_WRONG_PARAMS'});
            return;
        }

        let query = "SELECT * FROM t_products WHERE p_id = ?";
        let params = [pId];
        let [result, fields] = await pool.query(query, params);

        if (result.length == 0) {
            res.json({ status: 'ERR_NO_DATA' });
            return;
        }

        let product = result[0];

        // 연관된 성분 (사료일 경우)
        let feedNutrients = null;
        if (product.p_pc_id == 1) {
            query = "SELECT * FROM t_feed_nutrients WHERE fn_p_id = ?";
            [result, fields] = await pool.query(query, params);
            feedNutrients = result[0];
        }

        // 연관된 이미지
        query = "SELECT * FROM t_images WHERE i_data_type LIKE 'PRODUCT' AND i_target_id = ?";
        [result, fields] = await pool.query(query, params);
        let imageList = result;

        // 연관된 음식, 영양소
        query = "SELECT * FROM t_maps_product_nutrient_food AS mpnfTab";
        query += " LEFT JOIN t_foods AS fTab ON fTab.f_id = mpnfTab.mpnf_target_id";
        query += " LEFT JOIN t_nutrients AS nTab ON nTab.n_id = mpnfTab.mpnf_target_id";
        query += " WHERE mpnfTab.mpnf_p_id = ?";
        [result, fields] = await pool.query(query, params);
        let nutrientFoodList = result;

        res.json({status: 'OK', result: {
            product: product,
            feedNutrients: feedNutrients,
            imageList: imageList,
            nutrientFoodList: nutrientFoodList
        }});

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;