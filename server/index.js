import mongoose from 'mongoose';
import bodyParser from 'koa-bodyparser';
import session from 'koa-generic-session';
import Redis from 'koa-redis';
import json from 'koa-json';

import config from '../nuxt.config.js';
import dbConfig from './dbs/config';
import passport from './dbs/interface/utils/passport';

import usersRouter from './dbs/interface/users';
import geo from './dbs/interface/geo'
import search from './dbs/interface/search'
import categroy from './dbs/interface/categroy'
import cart from './dbs/interface/cart'


const Koa = require('koa')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')


const app = new Koa()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

// Import and Set Nuxt.js options
// let config = require('../nuxt.config.js')
config.dev = !(app.env === 'production')

//配置session
app.keys = ['meituan', 'keys'];
app.proxy = true;
app.use(session({
  key: 'meituan',
  prefix: 'mt:uid',
  store: new Redis()
}));

app.use(bodyParser({ extendTypes: ['json', 'form', 'text'] }));
app.use(json());
mongoose.connect(dbConfig.dbs, {
  useNewUrlParser: true
});
//使用passport中间件
app.use(passport.initialize());
app.use(passport.session());

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }
  //使用路由中间件
  app.use(usersRouter.routes()).use(usersRouter.allowedMethods());
  app.use(geo.routes()).use(geo.allowedMethods())
  app.use(search.routes()).use(search.allowedMethods())
  app.use(categroy.routes()).use(categroy.allowedMethods())
  app.use(cart.routes()).use(cart.allowedMethods())


  app.use(ctx => {
    ctx.status = 200 // koa defaults to 404 when it sees that status is unset

    return new Promise((resolve, reject) => {
      ctx.res.on('close', resolve)
      ctx.res.on('finish', resolve)
      nuxt.render(ctx.req, ctx.res, promise => {
        // nuxt.render passes a rejected promise into callback on error.
        promise.then(resolve).catch(reject)
      })
    })
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
