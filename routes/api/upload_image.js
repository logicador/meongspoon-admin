var express = require('express');
var router = express.Router();
const { isLogined, generateRandomId } = require('../../lib/common');
var formidable = require('formidable');
var sharp = require('sharp');
var fs = require('fs');
var imageSize = require('image-size');
const pool = require('../../lib/database');


//이미지 저장
router.post('', (req, res) => {
    try {
        if (!isLogined(req.session)) {
            res.json({ status: 'ERR_NO_PERMISSION' });
            return;
        }

        let form = new formidable.IncomingForm();
        form.encoding = 'utf-8';
        form.uploadDir = 'upload/tmp';
        form.multiples = true;
        form.keepExtensions = true;

        form.parse(req, function(error, body, files) {
            if (error) {
                res.json({ status: 'ERR_UPLOAD' });
                return;
            }

            let dataType = body.dataType;
            let type = body.type; // THUMB, IMAGE, IMAGE_DETAIL
            let targetId = body.targetId; // 데이터 아이디

            let imageName = generateRandomId();

            // 이미지 프로세싱
            let reImagePath = `/images/${dataType}/${imageName}.jpg`;
            let imagePath = `public/images/${dataType}/${imageName}.jpg`;
            let originalImagePath = `public/images/${dataType}/${imageName}_original.jpg`;
            fs.rename(files.image.path, imagePath, function() {
                fs.copyFile(imagePath, originalImagePath, async () => {

                    let originalWidth = imageSize(originalImagePath).width;
                    let rw = 0;
                    while (true) {
                        if (fs.statSync(imagePath).size > 100000) {
                            rw += 2;
                            await sharp(originalImagePath)
                                .resize({ width: parseInt(originalWidth * ((100 - rw) / 100)) })
                                .toFile(imagePath);

                        } else {
                            break;
                        }
                    }

                    let query = "";
                    let params = [];

                    if (type === 'THUMB') {
                        params = [reImagePath, targetId];
                        if (dataType === 'food') {
                            query = "UPDATE t_foods SET f_thumbnail = ? WHERE f_id = ?";
                        } else if (dataType === 'product') {
                            query = "UPDATE t_products SET p_thumbnail = ? WHERE p_id = ?";
                        } else {
                            res.json({ status: 'ERR_WRONG_DATA_TYPE' });
                            return;
                        }

                    } else {
                        query = "INSERT INTO t_images (i_type, i_path, i_target_id, i_data_type) VALUES (?, ?, ?, ?)";
                        params = [type, reImagePath, targetId, dataType];
                    }

                    await pool.query(query, params);

                    res.json({ status: 'OK', reImagePath: reImagePath });

                });
            });
        });

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;
