const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

//引入守卫
const { ensureAuthenticated } = require("../helpers/auth")


//引入模型
require("../models/Idea")
//实例化一个model
const Idea = mongoose.model('ideas')

//?????
const router = express.Router();

// bodyParser中间件
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// 课程页面
router.get('/ideas', ensureAuthenticated, (req, res) => {
  //填写页面的拿到的信息已近存储到了本地的mongoose数据库中了。这里的路由是将本地的存储的数据库信息拿出来展示在页面上
  Idea.find({})
    .sort({ data: "desc" })
    .then(ideas => {
      res.render("ideas/index", {
        ideas: ideas
      })
    })

})
// 添加页面
router.get('/ideas/add', ensureAuthenticated, (req, res) => {
  res.render("ideas/add")
})
// 编辑
router.get('/ideas/edit/:id', ensureAuthenticated, (req, res) => {
  //获取本地数据库中我们传递过来的数据id的那个值的数据
  //Idea中查找数据结构_id: 是传递过来的这一个值的数据 如果成功了就then方法下去
  Idea.findOne({
    _id: req.params.id
  })
    .then((idea) => {
      res.render("ideas/edit", {
        idea: idea
      })
    })

})

//实现增加到数据库中
router.post('/ideas', urlencodedParser, (req, res) => {
  // 这里就是拿到数据内容提交到数据库中
  // console.log(req.body)
  //这里的定义一个存放错误信息的空数组，如果前台传递过来的是没有值的 那就把自己定义的对象添加到数组里
  let errors = [];
  if (!req.body.title) {
    errors.push({ text: "请输入标题" })
  }
  if (!req.body.details) {
    errors.push({ text: "请输入详情" })
  }
  //如果前台传递过来的的确是有些是没有值的 那就是数组的有长度值 那就返回一些信息 例如这个错误数组 还有前台传递过来的写值
  if (errors.length > 0) {
    res.render("ideas/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    })
  } else {
    //前台符合要求 执行这里的代码 就是将拿到的数据存储在本地的mongoose数据库中
    const newUser = {
      title: req.body.title,
      details: req.body.details
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        req.flash("success_msg", "数据添加成功")
        res.redirect('/ideas')
      })
  }
})

// 实现编辑
router.put('/ideas/:id', urlencodedParser, (req, res) => {
  //点击编辑后  在本地数据库中找到我们编辑的这一条 成功之后执行then方法
  Idea.findOne({
    _id: req.params.id

  })
    .then((idea) => {
      idea.title = req.body.title,
        idea.details = req.body.details
      //将页面的修改过后的内容存到idea这个对象中 准备 往本地数据库存东西
      idea.save()
        .then((idea) => {
          req.flash("success_msg", "数据编辑成功")
          res.redirect("/ideas")
        })
    })
})
//实现删除
router.delete("/ideas/:id", ensureAuthenticated, (req, res) => {
  Idea.remove({
    _id: req.params.id
  })
    .then(() => {
      req.flash("success_msg", "数据删除成功")
      res.redirect("/ideas")
    })
})

// 暴露这个router模块
module.exports = router;