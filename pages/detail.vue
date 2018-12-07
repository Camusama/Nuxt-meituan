<template>
  <div
    v-loading="loading"
    class="page-detail"
    element-loading-text="加载中"
    element-loading-background="#fff">
    <el-row>
      <el-col :span="24">
        <crumbs
          :keyword="keyword"
          :type="type"/>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <summa :meta="product"/>
      </el-col>
    </el-row>
    <el-row class="m-title">
      <el-col :span="24">
        <h3>商家团购及优惠</h3>
      </el-col>
    </el-row>
    <el-row v-if="canOrder || !login">
      <el-col :span="24">
        <list
          v-if="login"
          :list="list"/>
        <div
          v-else
          class="deal-need-login">
          <img
            src="//p0.meituan.net/codeman/56a7d5abcb5ce3d90fc91195e5b5856911194.png"
            alt="登录查看">
          <span>请登录后查看详细团购优惠</span>
          <el-button
            type="primary"
            round>
            <a href="/login">立即登录</a>
          </el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Crumbs from '~/components/detail/crumbs.vue'
  import Summa from '~/components/detail/summary.vue'
  import List from '~/components/detail/list.vue'

  export default {
    components: {
      Crumbs,
      Summa,
      List
    },
    data(){
      return{
        keyword:'',
        product: {},
        type:'',
        list: [],
        login: false,
        loading:true
      }
    },
    computed: {
      // 根据数据是否有效来计算是否能购买
      // 能购买状态指的是整个detail下面的大框，所以未登录状态不知道能否购买，也显示这个框，v-else提示登录
      canOrder: function() {
        return this.list.filter(item => item.photos.length).length
      }
    },
    async mounted(){
      let { keyword, type } = this.$route.query
      let { status, data: { product, more: list, login } } = await this.$axios.get('/search/products', {
        params: {
          keyword,
          type,
          city: this.$store.getters['geo/city']
        }
      })
      if (status === 200) {
          this.keyword=keyword,
          this.product=product,
          this.type=type,
          this.list=list,
          this.login=login
      } else {
          this.keyword=keyword,
          this.product={},
          this.type=type,
          this.list=[],
          this.login= false
      }
      this.loading=false
    },
    // async asyncData (ctx) {
    //   // 客户端拿不到请求参数，只能在服务器端拿到参数keyword和type
    //   let { keyword, type } = ctx.query
    //   let { status, data: { product, more: list, login } } = await ctx.$axios.get('/search/products', {
    //     params: {
    //       keyword,
    //       type,
    //       // city: ctx.store.state.geo.position.city
    //       city:ctx.store.getters['geo/city']
    //     }
    //   })
    //   if (status === 200) {
    //     return {
    //       keyword,
    //       product,
    //       type,
    //       list,
    //       login
    //     }
    //   } else {
    //     return {
    //       keyword,
    //       product: {},
    //       type,
    //       list: [],
    //       login: false
    //     }
    //   }
    // }
  }
</script>

<style lang="scss">
  @import "~/assets/css/detail/index.scss";
</style>
