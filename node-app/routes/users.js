const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
//密码加密
const bcrypt = require('bcrypt')
//passport本地验证
const passport = require("passport");

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

//登录页面点击注册
router.post("/users/login", urlencodedParser, (req, res, next) => {
  //用passport进行验证
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next)

  //查询数据库，如果存在数据库中的 
  // User.findOne({
  //   email: req.body.email
  // })
  //   .then((user) => {
  //     if (!user) {
  //       req.flash('error_msg', "用户不存在")
  //       res.redirect("/users/login")
  //       return
  //     }
  //     //密码验证
  //     //bcrypt.compare(myPlaintextPassword, hash, function (err, res) {}) 
  //     //myPlaintextPassword:前端的输入密码 hash数据库中的密码
  //     bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
  //       if (err) throw err;
  //       if (isMatch) {
  //         req.flash("success_msg", "登录成功")
  //         res.redirect("/ideas");
  //       } else {
  //         req.flash("error_msg", "密码错误")
  //         res.redirect("/users/login")
  //       }
  //     });
  //   })


})

router.get('/users/register', (req, res) => {
  res.render("users/register")
})

//注册页面点击提交
router.post("/users/register", urlencodedParser, (req, res) => {
  // console.log(req.body)
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
    })
      .then((user) => {
        if (user) {
          req.flash("error_msg", "邮箱已经存在, 请更换邮箱注册~!");
          res.redirect("/users/register");
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          })
          //开始存取密码之前开始bcrypt加密
          // genSalt（saltRounds，function(){}）saltRounds密码强度 6
          //bcrypt.hash(myPlaintextPassword) myPlaintextPassword:加密对象
          bcrypt.genSalt(6, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              //将加密过后的hash赋值给这个要存储的数组的密码
              newUser.password = hash;
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
            });
          });


        }
      })
  }
})
//退出
router.get("/users/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "退出登录成功！");
  res.redirect("/users/login")
})
// 暴露这个router模块
module.exports = router