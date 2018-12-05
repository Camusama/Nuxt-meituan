<template>
  <div/>
</template>

<script>
  export default {
    layout: 'blank',
    middleware: async (ctx) => {
      let { status, data } = await ctx.$axios.get('/users/exit')
      if (status === 200 && data && data.code === 0) {
        location.href = '/'
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
