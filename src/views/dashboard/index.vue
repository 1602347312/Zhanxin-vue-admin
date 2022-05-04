<template>
  <div class="dashboard-container">
    <div class="dashboard-text">CPU core: {{ cpuCore }}</div>
    <div class="dashboard-text">
      CPU usage:
      <el-progress type="dashboard" :percentage="cpuUsage.split('%')[0] - 0" :color="colors" />
    </div>
    <div class="dashboard-text">memory: {{ mem }}</div>
    <div class="dashboard-text">
      memory usage:
      <el-progress type="dashboard" :percentage="memUsage.split('%')[0] - 0" :color="colors" />
    </div>
    <div class="dashboard-text">online user: {{ onlineUser }}</div>
  </div>
</template>

<script>

export default {
  name: 'Dashboard',
  data() {
    return {
      cpuCore: 0,
      cpuUsage: '0',
      mem: '0',
      memUsage: '0',
      onlineUser: 0,
      colors: [
        { color: '#1989fa', percentage: 20 },
        { color: '#5cb87a', percentage: 40 },
        { color: '#e8c208', percentage: 60 },
        { color: '#ec5608', percentage: 80 },
        { color: '#f80303', percentage: 100 }
      ]
    }
  },
  created() {
    this.getSysinfo()
    setInterval(() => {
      this.getSysinfo()
    }, 1000 * 60)
  },
  methods: {
    getSysinfo() {
      this.$axios({
        method: 'get',
        url: 'http://101.132.121.193:8899/admin/metrics/sysinfo'
        // headers: { token: window.sessionStorage.getItem('token') }
      }).then(response => {
        this.cpuCore = response.data.data.cpuCore
        this.cpuUsage = response.data.data.cpuUsage
        this.mem = response.data.data.memory
        this.memUsage = response.data.data.memoryUsage
        this.onlineUser = response.data.data.onlineUsers
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
