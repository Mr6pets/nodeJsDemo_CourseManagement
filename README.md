# nodeJsDemo_CourseManagement
这是一个nodejsw为后台前端页面采用bootstrap框架包含登录 验证 增删改查课程的一个练习demo



### 以下是记录的一些必要的知识点





####	step

~~~js
step_one:
新建文件夹node-app
cd node-app
执行 npm init 初始化一个packge.json的配置文件（根据提示进行配置）
在文件夹中建立一个入口文件app.json
npm install express安装路由
全局安装 sudo npm install -g nodemon 模块

tips：npm root -g(得到一个全局安装模块的路径)


~~~



> nodeJS模板引擎 handlebars

~~~js
安装handlebars
npm install express-handlebars

var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

~~~

需要注意的是用handlebars模块 在文件夹下面建立views文件夹下面要有一个固定的名为layouts文件夹下同时要有一个main.handlebarsd 文件 这里的这个main.handlebars其实就是视图的一个入口 

####	mian.handlebars

~~~html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>handlebars</title>
</head>

<body>
  {{{body}}}
</body>

</html>
~~~

其他视图文件和layouts文件夹平级 如 index.handlebars...



> ​	使用公共模板

views文件夹下建立指定的名文件夹 partials添加公用文件内容

main.handlebars文件引入partials文件下的文件

~~~js
{{> 文件名}}
exp：{{> navbar}}
~~~

tips:如果是当前的express的版本号超过4那就不需要安转body-parser 

> mangoDB

下载本地mangoDB

官网下载地址

~~~
https://www.mongodb.com/download-center#atlas
~~~

选择电脑的系统和版本号,找类似这样的文件下载解压

~~~
mongodb-macos-x86_64-4.2.1.tgz
~~~

将解压好的文件夹 打开添加一个data的文件夹 在data文件夹中再次建立一个databs 用来存取我们要创建的数据库，相当与存的数据到本地数据库中

~~~
打开终端：
cd 到bin: cd bin
执行：./mongod --dbpath ~/mongodb/data/databs(这里的意思是:在本文件夹下有个mongod 文件 指定路径到根目录下的mongodb文件夹下的data文件夹下的 databs文件夹中)
~~~

这里的终端会执行一些命令 之后会等待

开启另外一个终端，执行bin文件夹下的mongo

~~~
在bin文件夹下执行 ./mongo
现在可以看到第一个终端已经执行了进程
~~~

第二个终端执行 show databases 可以查看我们现在有的数据库 到这里本地的mangoDB就安装好了

> ​	使用mangoDB

~~~
安装模块mongoose:
npm install mongoose
~~~

~~~js
app.js文件中引入模块
const mongoose = require("mongoose");
//链接本地的mogoose地址
//mongodb://localhost/自己命名的数据库名字
mongoose.connect("mongodb://localhost/node-app")
  .then(() => {
    console.log("mongodb is going")
  })
  .catch(err => {
    console.log(err)
  })
~~~

> ​	查看mongoose本地数据库中是否有内容

打开终端terminal

~~~js
cd mongoosew文件夹下的bin文件夹里
step1：cd mongoose/bin/
step2：执行 ./mongo
step3：执行 show dbs 显示有哪些数据库
	这的例子就是有：
  admin
  config
  local
  node-app
step4：找到我们的要数据库:执行 use (数据库名)（node-app）：use node-app
这里的例子：
提示：switched to db node-app
step5：执行 show collections
找到ideas
step6:执行 db.ideas.find()
找到ideas中所有信息

~~~

> ​	method-override

在form表单中 提交只有get post 这里nodejs中实现编辑要用put方法 这里通过method-override模块

~~~js
npm install method-override
~~~

> ​	[express-session](https://www.cnblogs.com/mingjiatang/p/7495321.html)   [connect-flash](https://www.jianshu.com/p/29607cb427d4)

~~~js
express-session: 存储需要用到的数据
~~~

> ​	代码抽离中有些不明白的地方

[关于暴露的路由模块的说明](https://blog.csdn.net/u011146511/article/details/80680598)

connect-flash的使用

