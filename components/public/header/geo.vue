<template>
  <div class="m-geo">
    <i class="el-icon-location">{{ city }}</i>
    <nuxt-link
      class="changeCity"
      to="changeCity">切换城市
    </nuxt-link>
    [香河 廊坊 天津]
  </div>
</template>

<script>
  export default {
    name: '',
    data(){
      return{
        city:''
      }
    },
    mounted(){
      //要vuex持久化，则在getter里用sessionStorage
      //SSR服务端渲染组件created状态，无sessionStorage
      //data()回调，或直接放在dom里，则会created状态执行，会报sessionStorage is not defined
      //放入mounted执行
      let ncity=this.$store.getters['geo/city']?this.$store.getters['geo/city']:"选择城市"
      this.city=ncity
    }
  }
</script>
