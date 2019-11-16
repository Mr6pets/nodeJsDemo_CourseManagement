const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

//?????
const router = express.Router();

// bodyParser中间件
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//加载model
require("../models/User")
const User = mongoose.model('users');

//登录和注册
//req=request请求 res=response返回
router.get('/users/login', (req, res) => {
  res.render("users/login");
})

router.get('/users/register', (req, res) => {
  res.render("users/register")
})

//注册页面点击提交
router.post("/users/register", urlencodedParser, (req, res) => {
  // console.log(req.body)
  // res.send("register")
  // 验证密码
  let errors = [];
  if (req.body.password != req.body.password2) {
    errors.push({
      text: "两次密码不一致"
    })
  }
  if (req.body.password.length < 4) {
    errors.push({
      text: "密码不能小于4位"
    })
  }
  if (errors.length > 0) {
    res.render("users/register", {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    })
  } else {
    //存要注册的信息先在本地的数据库中查询下是否存在
    User.findOne({
      email: req.body.email
    }).then((user) => {
      if (user) {
        req.flash("error_msg", "邮箱已经存在, 请更换邮箱注册~!");
        res.redirect("/users/register");
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        })
        //往本地数据库中存我们拿到的数据信息
        newUser.save()
          .then((user) => {
            req.flash("success_msg", "注册成功")
            res.redirect("/users/login")
          })
          .catch((err) => {
            req.flash("error_msg", "账号注册失败")
            res.redirect("/users/register")
          })
      }
    })
  }
})

// 暴露这个router模块
module.exports = router