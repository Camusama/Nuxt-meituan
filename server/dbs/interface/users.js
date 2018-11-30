import Router from 'koa-router';
import Redis from 'koa-redis';
import nodeMailer from 'nodemailer';
import User from '../models/users';
import Passport from './utils/passport';
import Email from '../config';
import axios from './utils/axios';

const NODEMAIL = 'nodemail:';

let usersRouter = new Router({
  prefix: '/users'
});

let Store = new Redis().client;
// 注意: client默认是异步callback方式调用;
// store是经过了co-redis包装,返回Promise, 所以使用async异步编程比较方便

//注册接口
usersRouter.post('/signup', async ctx => {
  const { username, password, email, code } = ctx.request.body;

  if (code) {
    const saveCode = await Store.hget(`${NODEMAIL}${username}`, 'code');
    //redis hashmap规则为 hset key field value; hget key field;
    // 则此处为获取key为nodemail:{username},field为code的value值
    const saveExpire = await Store.hget(`${NODEMAIL}${username}`, 'expire');
    if (String(code) === String(saveCode)) {
      if (new Date().getTime() - saveExpire > 0) {
        ctx.body = {
          code: -1,
          msg: '验证码已经过期，请重新尝试'
        };
        return false;
      }
    } else {
      // code!==savecode
      ctx.body = {
        code: -1,
        msg: '请填写正确的验证码'
      };
      return false;
    }
  } else {
    // 如果没填写code
    ctx.body = {
      code: -1,
      msg: '请填写验证码'
    };
  }

  let user = await User.find({ username });
  if (user.length) {
    ctx.body = {
      code: -1,
      msg: '账号已经注册'
    };
    return false;
  }

  let nuser = await User.create({
    username,
    password,
    email
  });
//创建后登录
  if (nuser) {
    let res = await axios.post('/users/signin', { username, password });
    if (res.data && res.data.code === 0) {
      ctx.body = {
        code: 0,
        msg: '注册成功',
        user: res.data.user
      };
    } else {
      ctx.body = {
        code: -1,
        msg: 'error'
      };
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '注册失败'
    };
  }
});

//登录接口
usersRouter.post('/signin', async (ctx, next) => {
  //本方法return为hashcode,user从session里取出,local为key,后面为四个field
  return Passport.authenticate('local', (error, user, info, status) => {
    if (error) {
      ctx.body = {
        code: -1,
        msg: error
      };
    } else {
      if (user) {
        ctx.body = {
          code: 0,
          msg: '登录成功',
          user
        };
        return ctx.login(user);
      } else {
        ctx.body = {
          code: -1,
          msg: info
        };
      }
    }
  })(ctx, next);
});
//验证码
usersRouter.post('/verity', async (ctx, next) => {
  let { username, email } = ctx.request.body;
  const saveExpire = Store.hget(`${NODEMAIL}${username}`, 'expire');
  if (saveExpire && new Date().getTime() - saveExpire < 0) {
    ctx.body = {
      code: -1,
      msg: '验证请求过于频繁'
    };
    return false;
  }

  let transporter = nodeMailer.createTransport({
    service: 'qq',
    host: Email.smtp.host,
    post: Email.smtp.port,
    secure: false,
    auth: {
      user: Email.smtp.user,
      pass: Email.smtp.pass
    }
  });

  let ko = {
    code: Email.smtp.code(),
    expire: Email.smtp.expire(),
    email: email,
    user: username
  };

  let mailOption = {
    from: `美团邮件认证 <${Email.smtp.user}>`,
    to: ko.email,
    subject: '《美团网站》注册码',
    html: `您在美团网中注册的邀请码是 ${ko.code}`
  };

  await transporter.sendMail(mailOption, (err, info) => {
    if (err) {
      ctx.body = {
        code: -1,
        msg: '邮件发送失败'
      };
      console.log(err);
    } else {
      Store.hmset(`${NODEMAIL}${ko.user}`, 'code', ko.code, 'expire', ko.expire, 'email', ko.email);
    }
  });

  ctx.body = {
    code: 0,
    msg: '验证码已发送，可能会有延时，有效期1分钟'
  };

});

usersRouter.get('/exit', async (ctx, next) => {
  // 注销
  await ctx.logout();
  // 二次验证
  // console.log('ctx.isAuthenticated: ', ctx.isAuthenticated);
  if (Object.keys(ctx.session.passport).length === 0) {
    ctx.body = {
      code: 0
    };
  } else {
    ctx.body = {
      code: -1
    };
  }
});

usersRouter.get('/getUser', async (ctx, next) => {
  // passport中间件,登录后会在ctx里注册passport,有user存储登录信息
  if (ctx.session.passport && ctx.session.passport.user) {
    const { username, email } = ctx.session.passport.user;
    ctx.body = {
      user: username,
      email
    };
  } else {
    ctx.body = {
      user: '',
      email: ''
    };
  }
});

export default usersRouter;
