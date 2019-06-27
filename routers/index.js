
const express = require('express');
const router = express.Router();

const verification = require('../controller/verification/verification');
const router_user = require('./user');
const router_login = require('./login');

router.get('/verification/:phone_number',verification.getCode);
router.use('/user',router_user);
router.use('/login',router_login);



module.exports = router;
