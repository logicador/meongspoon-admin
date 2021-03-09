const moment = require('moment');

const common = {};


// random id
common.generateRandomId = () => {
    var rand = Math.floor(Math.random() * 9999) + '';
    var pad = rand.length >= 4 ? rand : new Array(4 - rand.length + 1).join('0') + rand;
    var random_id = moment().format("YYMMDDHHmmss") + pad;
    return parseInt(random_id);
};

// none check
common.isNone = (value) => {
    if (typeof value === 'undefined' || value === null) return true;
    if (value.trim() === '') return true;
    return false;
};

// login check
// 권한 체크
common.isLogined = (session) => {
    if (!session.isLogined) return false;
    return true;
};

module.exports = common;