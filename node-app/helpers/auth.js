module.exports = {
  //定义一些方法
  ensureAuthenticated: (req, res, next) => {
    //如果request中有这个方法 
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "请先登录！")
    res.redirect("/users/login")
  }
}