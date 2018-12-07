<template>
  <div class="page-order">
    <el-row v-if="login">
      <el-col
        :span="4"
        class="navbar">
        <h3>我的美团</h3>
        <dl>
          <dt>我的订单</dt>
          <dd>全部订单<i class="el-icon-arrow-right"/></dd>
          <dd>代付款<i class="el-icon-arrow-right"/></dd>
          <dd>待使用<i class="el-icon-arrow-right"/></dd>
        </dl>
        <dl/>
        <dl>
          <dt>我的收藏</dt>
          <dd>收藏的商家<i class="el-icon-arrow-right"/></dd>
          <dd>收藏的团购<i class="el-icon-arrow-right"/></dd>
        </dl>
        <dl>
          <dt>抵用券</dt>
          <dd>可用券<i class="el-icon-arrow-right"/></dd>
          <dd>失效券<i class="el-icon-arrow-right"/></dd>
        </dl>
        <dl>
          <dt>个人信息</dt>
          <dd>账户设置<i class="el-icon-arrow-right"/></dd>
        </dl>
      </el-col>
      <el-col
        :span="19"
        class="table">
        <el-tabs
          v-model="activeName"
          @tab-click="handleClick">
          <el-tab-pane
            label="全部订单"
            name="all">
            <list :cur="cur"/>
          </el-tab-pane>
          <el-tab-pane
            label="待付款"
            name="unpay">
            <list :cur="cur"/>
          </el-tab-pane> <el-tab-pane
            label="待使用"
            name="unuse">
            <list :cur="cur"/>
          </el-tab-pane> <el-tab-pane
            label="待评价"
            name="unreplay">
            <list :cur="cur"/>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <el-row
      v-else
    >
      <el-col>
        <div class="order-need-login">
          <img
            src="//p0.meituan.net/codeman/56a7d5abcb5ce3d90fc91195e5b5856911194.png"
            alt="登录查看">
          <span>请登录后查看订单</span>
          <el-button
            type="primary"
            round
            style="padding: 0 23px;">
            <a href="/login">立即登录</a>
          </el-button>
        </div>
      </el-col>
    </el-row>
  </div>

</template>

<script>
  import List from '~/components/order/list.vue'
  export default {
    name: "Order",
    components:{
      List
    },
    data(){
      return{
        activeName:"all",
        list:[],
        cur:[],
      }
    },
    watch:{
      activeName(val){
        //数据过滤，当status为0则是未付款
        this.cur=this.list.filter( item=>{
          if(val ==="unpay"){
            return item.status === 0
          }else if (val === "all"){
            return true
          }else {
            return false
          }
        })
      },
      list(){
        let val=this.name
        this.cur=this.list.filter(item=>{
          if(val==="unpay"){
            return item.status===0
          }else if(val==="all"){
            return true
          }else {
            return false
          }
        })
      }
    },
    methods:{
      handleClick(tab){
        this.activeName= tab.name
      }
    },

    async asyncData(ctx){
      let {status,data:{code,list}}=await ctx.$axios.post('/order/getOrders')
      if(status==200&&code===0&&list.length){
        return{
          list:list.map(item=>{
            return{
              img:item.imgs.length?item.imgs[0].url:'/logo.png',
              name:item.name,
              count:1,
              total:item.total,
              status:item.status,
              statusTxt:item.status===0?"待付款":"已付款"
            }
          }),
          cur:list.map(item=>{
            return{
              img:item.imgs.length?item.imgs[0].url:'/logo.png',
              name:item.name,
              count:1,
              total:item.total,
              status:item.status,
              statusTxt:item.status===0?"待付款":"已付款"
            }
          }),
          login:true
        }
      }else if(status===200&&code===-1){
        return {login:false}
      }
    }
  }
</script>

<style lang="scss">
  @import "~/assets/css/order/index.scss";
  .order-need-login{
    padding: 30px 0;
    margin-bottom: 40px;
    text-align: center;
    background-color: #fff;
    boder:1px solid #e5e5e5;
    img{
      display: inline-block;
    }
    span{
      display: block;
      margin: 10px 0 14px;
      color:#666;
      font-size: 20px;
      line-height: 26px;
    }
    button{
      background-color: #13D1BE;
      border-color: #13D1BE;
      a{
        color: #fff;
      }
    }
  }
</style>
