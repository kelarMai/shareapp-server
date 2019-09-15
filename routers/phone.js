
const express = require('express');
const router = express.Router();

const register = require('../controller/phone/phone');

router.get('/register/register_get_captcha',register.registerGetCaptcha);

module.exports = router;