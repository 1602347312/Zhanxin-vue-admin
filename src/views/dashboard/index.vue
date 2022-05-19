<template>
  <div class="dashboard-container">
    <div class="dashboard-text">CPU core: {{ cpuCore }}</div>
<!--    <div class="dashboard-text">-->
<!--      CPU usage:-->
      <li>
        <div class="dashboard-text">CPU usage</div>
        <div class="liquidfill-contain">
          <!-- 这里就是水球图的容器 -->
          <div ref="cpu" class="liquidfill" />
        </div>
      </li>
<!--      <el-progress type="dashboard" :percentage="cpuUsage.split('%')[0] - 0" :color="colors" />-->
<!--    </div>-->
    <div class="dashboard-text">memory: {{ mem }}</div>
<!--    <div class="dashboard-text">-->
<!--      memory usage:-->
<!--      <el-progress type="dashboard" :percentage="memUsage.split('%')[0] - 0" :color="colors" />-->
<!--    </div>-->
    <li>
      <div class="dashboard-text">memory usage</div>
      <div class="liquidfill-contain">
        <!-- 这里就是水球图的容器 -->
        <div ref="memory" class="liquidfill" />
      </div>
    </li>
    <div class="dashboard-text">online user: {{ onlineUser }}</div>
  </div>
</template>

<script>

import 'echarts-liquidfill'

import * as echarts from 'echarts'

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
  watch: {
    cpuUsage() {
      this.cpuCharts()
    },
    memUsage() {
      this.memCharts()
    }
  },
  created() {
    this.getSysinfo()
  },
  mounted() {
    setInterval(() => {
      this.getSysinfo()
    }, 1000 * 60)
  },
  methods: {
    getSysinfo() {
      this.$axios({
        method: 'get',
        url: 'http://101.132.121.193:8899/admin/metrics/sysinfo',
        headers: { token: window.sessionStorage.getItem('token') }
      }).then(response => {
        this.cpuCore = response.data.data.cpuCore
        this.cpuUsage = response.data.data.cpuUsage
        this.mem = response.data.data.memory
        this.memUsage = response.data.data.memoryUsage
        this.onlineUser = response.data.data.onlineUsers
      })
    },
    cpuCharts() {
      let myChart = echarts.init(this.$refs.cpu)
      let option = {
        series: [
          {
            type: 'liquidFill',
            radius: '95%',
            waveAnimation: true,
            data: [
              {
                value: (this.cpuUsage.split('%')[0] - 0) / 100,
                direction: 'left',
                itemStyle: {
                  normal: {
                    // 这里就是根据不同的值显示不同球体的颜色
                    color: eval(
                      "if(this.cpuUsage.split('%')[0] - 0<30){'rgba(0, 159, 232, 1)'}else if(this.cpuUsage.split('%')[0] - 0<70){'rgba(250, 173, 20, 1)'}else{'rgba(248, 9, 65, 1)'}"
                    )
                  }
                }
              }
            ],
            outline: {
              //   show: true, //是否显示轮廓 布尔值
              borderDistance: 1, // 外部轮廓与图表的距离 数字
              itemStyle: {
                // 这里就是根据不同的值显示不同边框的颜色
                borderColor: eval(
                  "if(this.cpuUsage.split('%')[0] - 0<30){'rgba(0, 159, 232, 1)'}else if(this.cpuUsage.split('%')[0] - 0<70){'rgba(250, 173, 20, 1)'}else{'rgba(248, 9, 65, 1)'}"
                ), // 边框的颜色
                borderWidth: 3 // 边框的宽度
                // shadowBlur: 5 , //外部轮廓的阴影范围 一旦设置了内外都有阴影
                // shadowColor: '#000' //外部轮廓的阴影颜色
              }
            },
            itemStyle: {
              opacity: 0.9, // 波浪的透明度
              shadowBlur: 0 // 波浪的阴影范围
            },
            backgroundStyle: {
              color: '#fff' // 图表的背景颜色
            },
            label: {
              // 数据展示样式
              show: true,
              color: '#000',
              insideColor: '#fff',
              fontSize: 20,
              fontWeight: 400,
              align: 'center',
              baseline: 'middle',
              position: 'inside'
            }
          }
        ]
      }
      myChart.setOption(option)
    },
    memCharts() {
      let myChart = echarts.init(this.$refs.memory)
      let option = {
        series: [
          {
            type: 'liquidFill',
            radius: '95%',
            waveAnimation: true,
            data: [
              {
                value: (this.memUsage.split('%')[0] - 0) / 100,
                direction: 'left',
                itemStyle: {
                  normal: {
                    // 这里就是根据不同的值显示不同球体的颜色
                    color: eval(
                      "if(this.memUsage.split('%')[0] - 0<30){'rgba(0, 159, 232, 1)'}else if(this.memUsage.split('%')[0] - 0<70){'rgba(250, 173, 20, 1)'}else{'rgba(248, 9, 65, 1)'}"
                    )
                  }
                }
              }
            ],
            outline: {
              //   show: true, //是否显示轮廓 布尔值
              borderDistance: 1, // 外部轮廓与图表的距离 数字
              itemStyle: {
                // 这里就是根据不同的值显示不同边框的颜色
                borderColor: eval(
                  "if(this.memUsage.split('%')[0] - 0<30){'rgba(0, 159, 232, 1)'}else if(this.memUsage.split('%')[0] - 0<70){'rgba(250, 173, 20, 1)'}else{'rgba(248, 9, 65, 1)'}"
                ), // 边框的颜色
                borderWidth: 3 // 边框的宽度
                // shadowBlur: 5 , //外部轮廓的阴影范围 一旦设置了内外都有阴影
                // shadowColor: '#000' //外部轮廓的阴影颜色
              }
            },
            itemStyle: {
              opacity: 0.9, // 波浪的透明度
              shadowBlur: 0 // 波浪的阴影范围
            },
            backgroundStyle: {
              color: '#fff' // 图表的背景颜色
            },
            label: {
              // 数据展示样式
              show: true,
              color: '#000',
              insideColor: '#fff',
              fontSize: 20,
              fontWeight: 400,
              align: 'center',
              baseline: 'middle',
              position: 'inside'
            }
          }
        ]
      }
      myChart.setOption(option)
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

.liquidfill-contain{
  display: block;
  height: 200px;
  width: 200px;
}
.liquidfill{
  width: 200px;
  height: 200px;
}
</style>
