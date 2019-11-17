//实例化 passport的local
const LocalStrategy = require("passport-local").Strategy
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//加载model
const User = mongoose.model("users");

// 公开到外部的一个方法
module.exports = (passport) => {
  //实例化local
  passport.use(new LocalStrategy(
    { usernameField: "email" },
    (email, password, done) => {
      // console.log(email);
      // console.log(password);
      //以上已经可以拿到前端输入的内容了
      // 本地数据库查询
      User.findOne({
        email: email
      })
        .then((user) => {
          if (!user) {
            //done(是否传递内容，得到对应user，出现的message的提示)
            return done(null, false, { message: "没有这个用户" })
          }
          //密码验证
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user)
            } else {
              return done(null, false, { message: "密码错误！" })
            }
          });
        })

    }
  ));
  //序列化和反序列化？？
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
}







