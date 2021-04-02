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

            let bId = body.bId;

            let imagePath = `public/images/breed/${bId}.jpg`;
            fs.rename(files.image.path, imagePath, function() {
                res.json({ status: 'OK' });
            });
        });

    } catch(error) {
        console.log(error);
        res.json({ status: 'ERR_INTERNAL_SERVER' });
    }
});


module.exports = router;
