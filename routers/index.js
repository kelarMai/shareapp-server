
const express = require('express');
const router = express.Router();

const router_user = require('./user');

router.use("/user",router_user);


module.exports = router;
