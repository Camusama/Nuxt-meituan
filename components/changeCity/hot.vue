<template>
  <div class="m-hcity">
    <dl>
      <dt>热门城市：</dt>
      <dd
        v-for="item in list"
        :key="item.id"
        @click="changeCity(item)">{{ item.name==='市辖区'?item.province:item.name }}
      </dd>
    </dl>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        list: []
      }
    },
    async mounted () {
      let { status, data: { hots } } = await this.$axios.get('/geo/hotCity')
      if (status === 200) {
        this.list = hots
      }
    },
    methods:{
      changeCity(item){
        let newCity=item.name==='市辖区'?item.province:item.name
        this.$store.commit('geo/setPosition',newCity)
        window.location.href='/'
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import "~/assets/css/changeCity/hot.scss";
  dd{
    cursor: pointer;
    &:hover {
      color:#13D1BE !important;
    }
  }
</style>
