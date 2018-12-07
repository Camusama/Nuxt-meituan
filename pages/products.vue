<template>
  <div class="page-product">
    <el-row
      v-loading="loading"
      element-loading-text="加载中"
      class="page-product">
      <el-col :span="19">
        <Crumbs :keyword="keyword"/>
        <Categroy
          :types="types"
          :areas="areas"/>
        <List :list="list"/>
      </el-col>
      <el-col :span="5">
        <Amap
          v-if="point.length"
          :width="230"
          :height="290"
          :point="point"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Crumbs from '~/components/products/crumbs'
  import Categroy from '~/components/products/categroy'
  import List from '~/components/products/list'
  import Amap from '~/components/public/map'

  export default {
    components: {
      Crumbs,
      Categroy,
      List,
      Amap
    },
    data () {
      return {
        list: [],
        types: [],
        areas: [],
        keyword: '',
        point: [],
        loading:true
      }
    },
    // ssr
    // async asyncData (ctx) {
    //   let keyword = ctx.query.keyword
    //   // let city = ctx.store.state.geo.position.city
    //   let {  data: {  city } } = await ctx.$axios.get('/geo/getPosition')
    //
    //   // let city= ctx.store.getters['geo/city']
    //   // console.log(city)
    //   let { status, data: { count, pois } } = await ctx.$axios.get('/search/resultsByKeywords', {
    //     params: {
    //       keyword,
    //       city
    //     }
    //   })
    //   let { status: status2, data: { areas, types } } = await ctx.$axios.get('/categroy/crumbs', {
    //     params: {
    //       city
    //     }
    //   })
    //   // 数据映射
    //   if (status === 200 && count > 0 && status2 === 200) {
    //     return {
    //       list: pois.filter(item => item.photos.length).map(item => {
    //         return {
    //           type: item.type,
    //           img: item.photos[0].url,
    //           name: item.name,
    //           comment: Math.floor(Math.random() * 10000),
    //           rate: Number(item.biz_ext.rating),
    //           price: Number(item.biz_ext.cost),
    //           scene: item.tag,
    //           tel: item.tel,
    //           status: '可订明日',
    //           location: item.location,
    //           module: item.type.split(';')[0]
    //         }
    //       }),
    //       keyword,
    //       areas: areas.filter(item => item.type !== '').slice(0, 5),
    //       types: types.filter(item => item.type !== '').slice(0, 5),
    //       point: (pois.find(item => item.location).location || '').split(',')
    //     }
    //   }
    // },
    async mounted(){
      let keyword = this.$route.query.keyword
      let city = this.$store.getters['geo/city']
      let { status, data: { count, pois } } = await this.$axios.get('/search/resultsByKeywords', {
        params: {
          keyword,
          city
        }
      })
      let { status: status2, data: { areas, types } } = await this.$axios.get('/categroy/crumbs', {
        params: {
          city
        }
      })
      // 数据映射
      if (status === 200 && count > 0 && status2 === 200) {
          this.list=pois.filter(item => item.photos.length).map(item => {
            return {
              type: item.type,
              img: item.photos[0].url,
              name: item.name,
              comment: Math.floor(Math.random() * 10000),
              rate: Number(item.biz_ext.rating),
              price: Number(item.biz_ext.cost),
              scene: item.tag,
              tel: item.tel,
              status: '可订明日',
              location: item.location,
              module: item.type.split(';')[0]
            }
          }),
          this.keyword=keyword,
          this.areas=areas.filter(item => item.type !== '').slice(0, 5),
          this.types=types.filter(item => item.type !== '').slice(0, 5),
          this.point= (pois.find(item => item.location).location || '').split(',')
      }
      this.loading=false
    }
  }
</script>

<style lang="scss">
  @import "~/assets/css/products/index.scss";
</style>
