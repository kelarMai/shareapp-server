
const express = require('express');
const router = express.Router();

const router_phone = require('./phone');
const router_user = require('./user');

router.use('/phone',router_phone);
router.use('/user',router_user);



module.exports = router;
