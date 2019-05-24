
const express = require('express');
const router = express.Router();

const router_login = require('../routers/login');

router.use("/login",router_login);


module.exports = router;
