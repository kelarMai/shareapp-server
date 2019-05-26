
const express = require('express');
const router = express.Router();

const Login = require('../controller/user/login');

router.get('/login',Login.userLogin);

module.exports = router;