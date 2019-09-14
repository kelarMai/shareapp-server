
const express = require('express');
const router = express.Router();

const captcha = require('../controller/user/captcha');


router.get('/captcha/:phone_number',captcha.getCode);

module.exports = router;