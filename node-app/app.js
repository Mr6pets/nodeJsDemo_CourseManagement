// 引入模块express
const express = require("express");
var exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash');
// 实例化
const app = express();
//载入 routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');


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

//method-override中间件
app.use(methodOverride('_method'));

//session 和 flash middleware 中间件
app.use(session({
  secret: 'secret',//秘钥
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

//配置全局变量 方便其他页面使用
// 将flash中存入的变量存入res.locals变量中，假如我要在网站中使用flash中存的error和success变量，加可以把它们传入locals变量中，这样所有的模板都可以拿到这个变量。
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error = req.flash('error_msg');
  next();
})

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

//使用暴出来的router 接口
app.use('/', ideas)
app.use('/', users)



// 设置端口号
const port = 5000;
// 设置监听
app.listen(port, () => {
  console.log(`server is starting on ${port}`);
})