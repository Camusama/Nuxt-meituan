<template>
  <el-container class="layout-default">
    <el-header height="197px">
      <MyHeader />
    </el-header>
    <el-main>
      <nuxt/>
    </el-main>
    <el-footer height="auto">
      <MyFooter />
    </el-footer>
  </el-container>
</template>

<script>
  import MyHeader from '~/components/public/header'
  import MyFooter from '~/components/public/footer'
  export default {
    components:{
      MyHeader,
      MyFooter
    }
  }
</script>
