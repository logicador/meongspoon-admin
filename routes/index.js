var express = require('express');
var router = express.Router();
const { isLogined } = require('../lib/common');
const pool = require('../lib/database');


router.get('/', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'main'
    });
});


router.get('/login', (req, res) => {
    res.render('index', {
        menu: 'login'
    });
});


router.get('/nutrient', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'nutrient'
    });
});


router.get('/nutrient/add', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'nutrient_add'
    });
});


router.get('/nutrient/detail/:nId', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'nutrient_detail',

        nId: req.params.nId
    });
});


router.get('/food', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'food'
    });
});


router.get('/food/add', async (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    let query = "SELECT * FROM t_food_categories1 AS fc1Tab";
    query += " LEFT JOIN (SELECT fc2_fc1_id, GROUP_CONCAT(CONCAT_WS(':', fc2_id, fc2_name) SEPARATOR '|') AS fc2_info FROM t_food_categories2 GROUP BY fc2_fc1_id) AS fc2Tab";
    query += " ON fc1Tab.fc1_id = fc2Tab.fc2_fc1_id;";

    let [result, fields] = await pool.query(query);

    let foodCategory2List = [];
    for (let i = 0; i < result.length; i++) {
        let fc1 = result[i];
        let fc2Info = fc1.fc2_info;
        let data = { fc1Id: fc1.fc1_id, fc2List: [] };
        if (fc2Info) {
            for (let j = 0; j < fc2Info.split('|').length; j++) {
                let fc2Str = fc2Info.split('|')[j];
                let fc2Id = fc2Str.split(':')[0];
                let fc2Name = fc2Str.split(':')[1];
                data.fc2List.push({ fc2Id: fc2Id, fc2Name: fc2Name });
            }
        }
        foodCategory2List.push(data);
    }

    res.render('index', {
        menu: 'food_add',

        foodCategory1List: result,
        foodCategory2List: JSON.stringify(foodCategory2List)
    });
});


router.get('/food/detail/:fId', async (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    let query = "SELECT * FROM t_food_categories1 AS fc1Tab";
    query += " LEFT JOIN (SELECT fc2_fc1_id, GROUP_CONCAT(CONCAT_WS(':', fc2_id, fc2_name) SEPARATOR '|') AS fc2_info FROM t_food_categories2 GROUP BY fc2_fc1_id) AS fc2Tab";
    query += " ON fc1Tab.fc1_id = fc2Tab.fc2_fc1_id;";

    let [result, fields] = await pool.query(query);

    let foodCategory2List = [];
    for (let i = 0; i < result.length; i++) {
        let fc1 = result[i];
        let fc2Info = fc1.fc2_info;
        let data = { fc1Id: fc1.fc1_id, fc2List: [] };
        if (fc2Info) {
            for (let j = 0; j < fc2Info.split('|').length; j++) {
                let fc2Str = fc2Info.split('|')[j];
                let fc2Id = fc2Str.split(':')[0];
                let fc2Name = fc2Str.split(':')[1];
                data.fc2List.push({ fc2Id: fc2Id, fc2Name: fc2Name });
            }
        }
        foodCategory2List.push(data);
    }

    res.render('index', {
        menu: 'food_detail',

        fId: req.params.fId,

        foodCategory1List: result,
        foodCategory2List: JSON.stringify(foodCategory2List)
    });
});


router.get('/disease', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'disease'
    });
});


router.get('/disease/add', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'disease_add'
    });
});


router.get('/disease/detail/:dId', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'disease_detail',

        dId: req.params.dId
    });
});


router.get('/symptom', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'symptom'
    });
});


router.get('/symptom/add', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'symptom_add'
    });
});


router.get('/symptom/detail/:sId', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'symptom_detail',

        sId: req.params.sId
    });
});


router.get('/product', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'product'
    });
});


router.get('/product/add', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'product_add'
    });
});


router.get('/product/detail/:pId', async (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    let pId = req.params.pId;

    let query = "SELECT * FROM t_products WHERE p_id = ?";
    let params = [pId];
    let [result, fields] = await pool.query(query, params);

    if (result.length == 0) {
        res.json({ status: 'ERR_NO_DATA' });
        return;
    }

    let product = result[0];

    let pcId = product.p_pc_id;
    let pbId = product.p_pb_id;
    let fnProt = 0;
    let fnFat = 0;
    let fnFibe = 0;
    let fnAsh = 0;
    let fnCalc = 0;
    let fnPhos = 0;
    let fnMois = 0;
    if (pcId == 1) {
        query = "SELECT * FROM t_feed_nutrients WHERE fn_p_id = ?";
        [result, fields] = await pool.query(query, params);

        if (result.length > 0) {
            let feedNutrient = result[0];
            fnProt = feedNutrient.fn_prot;
            fnFat = feedNutrient.fn_fat;
            fnFibe = feedNutrient.fn_fibe;
            fnAsh = feedNutrient.fn_ash;
            fnCalc = feedNutrient.fn_calc;
            fnPhos = feedNutrient.fn_phos;
            fnMois = feedNutrient.fn_mois;
        }
    }

    res.render('index', {
        menu: 'product_detail',

        pId: req.params.pId,

        pcId: pcId,
        pbId: pbId,
        fnProt: fnProt,
        fnFat: fnFat,
        fnFibe: fnFibe,
        fnAsh: fnAsh,
        fnCalc: fnCalc,
        fnPhos: fnPhos,
        fnMois: fnMois
    });
});


router.get('/product/category', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'product_category'
    });
});


router.get('/product/brand', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'product_brand'
    });
});


router.get('/breed', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'breed'
    });
});


router.get('/breed/add', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'breed_add'
    });
});


router.get('/breed/detail/:bId', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'breed_detail',

        bId: req.params.bId
    });
});


router.get('/breed/weak/disease/:bagId', async (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    let bagId = req.params.bagId;

    let query = "SELECT * FROM t_breed_age_groups AS bagTab JOIN t_breeds AS bTab ON bTab.b_id = bagTab.bag_b_id WHERE bagTab.bag_id = ?";
    let params = [bagId];

    let [result, fields] = await pool.query(query, params);

    if (result.length == 0) {
        res.json({ status: 'ERR_NO_DATA' });
        return;
    }

    let bName = result[0].b_name;
    let bagMinAge = result[0].bag_min_age;
    let bagMaxAge = result[0].bag_max_age;

    res.render('index', {
        menu: 'breed_weak_disease',

        bagId: bagId,

        bName: bName,
        bagMinAge: bagMinAge,
        bagMaxAge: bagMaxAge
    });
});


router.get('/inoculation', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'inoculation'
    });
});


router.get('/food_nutrient/category', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'food_nutrient_category'
    });
});


router.get('/food/category', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'food_category'
    });
});


router.get('/notice', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'notice'
    });
});

router.get('/notice/add', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'notice_add'
    });
});

router.get('/notice/detail/:noId', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'notice_detail',

        noId: req.params.noId
    });
});


router.get('/question', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'question'
    });
});

router.get('/question/detail/:qId', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'question_detail',

        qId: req.params.qId
    });
});


module.exports = router;
