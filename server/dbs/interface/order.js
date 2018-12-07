import Router from 'koa-router'
import axios from './utils/axios'
import Order from '../models/order'
import Cart from '../models/cart'
import sign from './utils/sign'
import md5 from 'crypto-js/md5'


let router = new Router({
  prefix: '/order'
})
router.post('/createOrder',async ctx=>{
  let {id,price,count}=ctx.request.body
  let time=Date()
  let orderID =md5(Math.random()*1000+time).toString()
  if(!ctx.isAuthenticated()){
    ctx.body={
      code:-1,
      msg:'need login'
    }
  }else{
    let findCart = await Cart.findOne({cartNo:id})
    let order=new Order({
      id:orderID,
      count,
      total:price*count,
      time,
      user:ctx.session.passport.user,
      name:findCart.detail[0].name,
      imgs:findCart.detail[0].imgs,
      status:0
    })
    try {
      //如果下单了，就加入订单列表里，并从购物车里移除
      let result=await order.save();
      if(result){
        await findCart.remove()
        ctx.body={
          code:0,
          id:orderID
        }
      }else{
        ctx.body={
          code:-1
        }
      }
    }catch (e) {
      ctx.body={
        code:-1,
        msg:'服务器出错'
      }
    }
  }
})

router.post('/getOrders', async ctx=>{
  if(!ctx.isAuthenticated()){
    ctx.body={
      code:-1,
      list:[],
      msg:'need login'
    }
  }else{
    try {
      let result = await Order.find()
      if(result){
        ctx.body={
          code:0,
          list:result
        }
      }else{
        ctx.body={
          code:-1,
          list:[]
        }
      }
    }catch (e) {
      ctx.body={
        code:-1,
        list:[]
      }
    }
  }
})

export default router
