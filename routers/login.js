
const express = require('express');
const router = express.Router();

const Login = require('../controller/login/login');

router.put('/login',Login.userLogin);

module.exports = router;