
const express = require('express');
const router = express.Router();

const router_user = require('./user');
const router_login = require('./login');

router.use('/user',router_user);
router.use('/login',router_login);


module.exports = router;
