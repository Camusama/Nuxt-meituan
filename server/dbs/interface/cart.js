import Router from 'koa-router'
import axios from './utils/axios'
import Cart from '../models/cart'
import md5 from 'crypto-js/md5'

let router = new Router({ prefix: '/cart' })

router.post('/create', async ctx => {
  // 登录拦截
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: -1,
      msg: 'please login'
    }
  } else {
    let time = Date()
    let cartNo = md5(Math.random() * 1000 + time).toString()
    let { params: { id, detail } } = ctx.request.body
    // 通过model实例的方式保存，区别于model.create()
    let cart = new Cart({ id, cartNo, time, user: ctx.session.passport.user, detail })
    let result = await cart.save()
    if (result) {
      ctx.body = {
        code: 0,
        msg: '',
        id: cartNo
      }
    } else {
      ctx.body = {
        code: -1,
        msg: 'fail'
      }
    }
  }
})

router.post('/getCart', async ctx => {
  let { id } = ctx.request.body
  console.log(id)
  try {
    let result = await Cart.findOne({ cartNo: id })
    ctx.body = {
      code: 0,
      data: result
        ? result.detail[0]
        : {}
    }
  } catch (e) {
    ctx.body = {
      code: -1,
      data: {}
    }
  }
})

export default router
