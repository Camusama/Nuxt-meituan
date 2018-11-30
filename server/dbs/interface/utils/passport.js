import passport from 'koa-passport';
import LocalStrategy from 'passport-local';
import UserModel from '../../models/users';

passport.use(new LocalStrategy(async (username, password, done) => {
  let where = {
    username
  };

  let result = await UserModel.findOne(where);
  if (result) {
    if (result.password === password) {
      return done(null, result);
    } else {
      return done(null, false, '密码错误');
    }
  } else {
    return done(null, false, '用户不存在');
  }

}));
//本插件在ctx里定义了login和logout函数
// logIn()和logOut()操作真正调用的是
// SessionManager中的操作，其定义在passport/sessionmanager.js,
// 序列化ctx.login()触发，在用户登录验证成功以后将会把用户的数据存储到 session 中
passport.serializeUser((user, done) => {
  done(null, user);
});
// 反序列化（请求时，session中存在"passport":{"user":"xxx"}触发） session 中读取用户对象
passport.deserializeUser((user, done) => {
  return done(null, user);
});

export default passport;
