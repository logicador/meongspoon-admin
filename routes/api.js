var express = require('express');
var router = express.Router();


// GET
router.use('/nutrient/get/all', require('./api/nutrient_get_all.js'));
router.use('/nutrient/get', require('./api/nutrient_get.js'));

router.use('/food/get/all', require('./api/food_get_all.js'));
router.use('/food/get', require('./api/food_get.js'));

router.use('/disease/get/all', require('./api/disease_get_all.js'));
router.use('/disease/get', require('./api/disease_get.js'));

router.use('/symptom/get/all', require('./api/symptom_get_all.js'));
router.use('/symptom/get', require('./api/symptom_get.js'));

router.use('/product/get/all', require('./api/product_get_all.js'));
router.use('/product/get', require('./api/product_get.js'));
router.use('/product/category/get/all', require('./api/product_category_get_all.js'));
router.use('/product/brand/get/all', require('./api/product_brand_get_all.js'));

router.use('/breed/get/all', require('./api/breed_get_all.js'));
router.use('/breed/get', require('./api/breed_get.js'));

router.use('/inoculation/get/all', require('./api/inoculation_get_all.js'));

router.use('/food/category1/get/all', require('./api/food_category1_get_all.js'));

router.use('/notice/get/all', require('./api/notice_get_all.js'));
router.use('/notice/get', require('./api/notice_get.js'));

router.use('/question/get/all', require('./api/question_get_all.js'));
router.use('/question/get', require('./api/question_get.js'));

router.use('/user/get/all', require('./api/user_get_all.js'));
router.use('/pet/get/all', require('./api/pet_get_all.js'));


// POST
router.use('/login', require('./api/login.js'));
router.use('/logout', require('./api/logout.js'));
router.use('/upload/image', require('./api/upload_image.js'));
router.use('/delete/image', require('./api/delete_image.js'));

router.use('/nutrient/save', require('./api/nutrient_save.js'));
router.use('/nutrient/delete', require('./api/nutrient_delete.js'));

router.use('/food/save', require('./api/food_save.js'));
router.use('/food/delete', require('./api/food_delete.js'));

router.use('/product/save', require('./api/product_save.js'));
router.use('/product/delete', require('./api/product_delete.js'));
router.use('/product/category/save', require('./api/product_category_save.js'));
router.use('/product/category/delete', require('./api/product_category_delete.js'));
router.use('/product/brand/save', require('./api/product_brand_save.js'));
router.use('/product/brand/delete', require('./api/product_brand_delete.js'));

router.use('/breed/save', require('./api/breed_save.js'));
router.use('/breed/delete', require('./api/breed_delete.js'));

router.use('/inoculation/save', require('./api/inoculation_save.js'));
router.use('/inoculation/delete', require('./api/inoculation_delete.js'));

router.use('/food/category1/save', require('./api/food_category1_save.js'));
router.use('/food/category1/delete', require('./api/food_category1_delete.js'));
router.use('/food/category2/save', require('./api/food_category2_save.js'));
router.use('/food/category2/delete', require('./api/food_category2_delete.js'));

router.use('/notice/save', require('./api/notice_save.js'));
router.use('/notice/delete', require('./api/notice_delete.js'));

router.use('/question/answer', require('./api/question_answer.js'));


module.exports = router;