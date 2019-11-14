const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

//?????
const router = express.Router();

// bodyParser中间件
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//登录和注册
//req=request请求 res=response返回
router.get('/users/login', (req, res) => {
  res.send("login");
})

router.get('/users/register', (req, res) => {
  res.send("register")
})

module.exports = router