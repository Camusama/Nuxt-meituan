<template>
  <div class="m-iselect">
    <span class="name">按省份选择：</span>
    <el-select
      v-model="pvalue"
      placeholder="省份">
      <el-option
        v-for="item in province"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-select>
    <el-select
      v-model="cvalue"
      :disabled="!city.length"
      placeholder="城市">
      <el-option
        v-for="item in city"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-select>
    <el-autocomplete
      v-model="input"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入城市中文或拼音"
      @select="handleSelect"
    />
  </div>
</template>

<script>
  export default {
    data () {
      return {
        province: [],
        pvalue: '',
        city: [],
        cvalue: '',
        input: '',
        cities: ''
      }
    },
    watch: {
      async pvalue (newPvalue) {
        let self = this
        let { status, data: { city } } = await self.$axios.get(`/geo/province/${newPvalue}`)
        if (status === 200) {
          self.city = city.map(item => {
            return {
              value: item.id,
              label: item.name
            }
          })
          self.cvalue = ''
        }
      }
    },
    async mounted () {
      let self = this
      let { status, data: { province } } = await self.$axios.get('/geo/province')
      if (status === 200) {
        self.province = province.map(item => {
          return {
            value: item.id,
            label: item.name
          }
        })
      }
    },
    methods: {
      querySearchAsync (query, cb) {
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(this._querySearch(query, cb), 200)
      },
      // 静态方法
      async _querySearch (query, cb) {
        if (this.cities.length) {
          cb(this.cities.filter(item => item.value.indexOf(query) > -1))
        } else {
          let { status, data: { city } } = await this.$axios.get('/geo/city')
          if (status === 200) {
            this.cities = city.map(item => {
              return {
                value: item.name
              }
            })
            cb(this.cities.filter(item => item.value.indexOf(query) > -1))
          } else {
            cb([])
          }
        }
      },
      handleSelect (item) {
        console.log(item.value)
      }
    }
  }
</script>

<style lang="scss">
  @import "~/assets/css/changeCity/iselect.scss";
</style>
