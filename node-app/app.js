// 引入模块express
const express = require("express");
var exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
// 实例化
const app = express();

//链接本地的mogoose地址
mongoose.connect("mongodb://localhost/node-app")
  .then(() => {
    console.log("mongodb is working")
  })
  .catch(err => {
    console.log(err)
  })
//引入模型
require("./models/Idea")
//实例化一个model
const Idea = mongoose.model('ideas')

// handlebars中间件
// 设置视图引擎
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// bodyParser中间件
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//配置路由
app.get('/', (req, res) => {
  //配置路由区域 定义一个变量通过render传递回去
  const title = "welcome here";
  res.render("index", {
    title: title
  })
})
app.get('/about', (req, res) => {
  res.render("about")
})
app.get('/ideas', (req, res) => {
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
app.get('/ideas/add', (req, res) => {
  res.render("ideas/add")
})
// 编辑
app.get('/ideas/edit/:id', (req, res) => {
  res.render("ideas/edit")
})

app.post('/ideas', urlencodedParser, (req, res) => {
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
        res.redirect('/ideas')
      })
  }

})
// 设置端口号
const port = 5000;
// 设置监听
app.listen(port, () => {
  console.log(`server is starting on ${port}`);
})