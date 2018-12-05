<template>
  <div class="">
    <dl class="m-categroy">
      <dt>按拼音首字母选择：</dt>
      <dd
        v-for="item in list"
        :key="item">
        <a :href="'#city-'+item">{{ item }}</a>
      </dd>
    </dl>
    <dl
      v-for="item in block"
      :key="item.title"
      class="m-categroy-section">
      <dt :id="'city-'+item.title">{{ item.title }}</dt>
      <dd>
        <span
          v-for="c in item.city"
          :key="c">{{ c }}</span>
      </dd>
    </dl>
  </div>
</template>

<script>
  // 中文转化为拼音
  import pyjs from 'js-pinyin'

  export default {
    data () {
      return {
        list: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
        block: []
      }
    },
    async mounted () {
      let blocks = []
      let { status, data: { city } } = await this.$axios.get('/geo/city')
      if (status === 200) {
        let p
        let c
        let d = {}
        city.forEach(item => {
          // 获取拼音的首字母
          p = pyjs.getFullChars(item.name).toLocaleLowerCase().slice(0, 1)
          // 获取首字母的code值
          c = p.charCodeAt(0)
          // 小写的a到z的code值
          if (!d[p]) {
            d[p] = []
          }
          // 生成map
          d[p].push(item.name)
        })
        for (let [k, v] of Object.entries(d)) {
          blocks.push({
            title: k.toUpperCase(),
            city: v
          })
        }
        // 排序
        blocks.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0))
        this.block = blocks
      }
    }
  }
</script>

<style lang="scss">
  @import "~/assets/css/changeCity/categroy.scss";
</style>
