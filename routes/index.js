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
        menu: 'main',
        isLogined: req.session.isLogined
    });
});


router.get('/login', (req, res) => {
    res.render('index', {
        menu: 'login',
        isLogined: req.session.isLogined
    });
});


router.get('/nutrient', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'nutrient',
        isLogined: req.session.isLogined
    });
});


router.get('/nutrient/add', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'nutrient_add',
        isLogined: req.session.isLogined
    });
});


router.get('/nutrient/detail/:nId', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'nutrient_detail',
        isLogined: req.session.isLogined,

        nId: req.params.nId
    });
});


router.get('/food', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'food',
        isLogined: req.session.isLogined
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
        isLogined: req.session.isLogined,

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
        isLogined: req.session.isLogined,

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
        menu: 'disease',
        isLogined: req.session.isLogined
    });
});


router.get('/disease/add', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'disease_add',
        isLogined: req.session.isLogined
    });
});


router.get('/disease/detail/:dId', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'disease_detail',
        isLogined: req.session.isLogined,

        dId: req.params.dId
    });
});


router.get('/symptom', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'symptom',
        isLogined: req.session.isLogined
    });
});


router.get('/symptom/add', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'symptom_add',
        isLogined: req.session.isLogined
    });
});


router.get('/symptom/detail/:sId', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'symptom_detail',
        isLogined: req.session.isLogined,

        sId: req.params.sId
    });
});


router.get('/product', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'product',
        isLogined: req.session.isLogined
    });
});


router.get('/product/add', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'product_add',
        isLogined: req.session.isLogined
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
        isLogined: req.session.isLogined,

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
        menu: 'product_category',
        isLogined: req.session.isLogined
    });
});


router.get('/product/brand', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'product_brand',
        isLogined: req.session.isLogined
    });
});


router.get('/breed', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'breed',
        isLogined: req.session.isLogined
    });
});


router.get('/breed/add', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'breed_add',
        isLogined: req.session.isLogined
    });
});


router.get('/breed/detail/:bId', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'breed_detail',
        isLogined: req.session.isLogined,

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
        isLogined: req.session.isLogined,

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
        menu: 'inoculation',
        isLogined: req.session.isLogined
    });
});


router.get('/food_nutrient/category', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'food_nutrient_category',
        isLogined: req.session.isLogined
    });
});


router.get('/food/category', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'food_category',
        isLogined: req.session.isLogined
    });
});


router.get('/notice', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'notice',
        isLogined: req.session.isLogined
    });
});

router.get('/notice/add', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'notice_add',
        isLogined: req.session.isLogined
    });
});

router.get('/notice/detail/:noId', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'notice_detail',
        isLogined: req.session.isLogined,

        noId: req.params.noId
    });
});


router.get('/question', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'question',
        isLogined: req.session.isLogined
    });
});

router.get('/question/detail/:qId', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'question_detail',
        isLogined: req.session.isLogined,

        qId: req.params.qId
    });
});


router.get('/user', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'user',
        isLogined: req.session.isLogined
    });
});


router.get('/pet', (req, res) => {
    if (!isLogined(req.session)) {
        res.redirect('/login');
        return;
    }

    res.render('index', {
        menu: 'pet',
        isLogined: req.session.isLogined
    });
});


module.exports = router;
