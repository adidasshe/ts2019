<template>
  <div id="vmeter" :style="{width: '100%', height: '300px'}"></div>
</template>

<script>
import echarts from "echarts";
import resize from "./mixins/resize";
export default {
  mixins: [resize],
  name: "vmeter",
  data() {
    return {
      msg: "仪表盘",
      device_data: null
    };
  },
  mounted() {
    this.drawLine();
  },
  created() {
    this.getdata();
    // this.drawLine();
  },
  methods: {
    drawLine() {
      var that = this;
      // 基于准备好的dom，初始化echarts实例
      let vmeter = echarts.init(
        document.getElementById("vmeter"),
        "infographic"
      );
      // 绘制图表
      var option = {
        // backgroundColor: '#1b1b1b',
        tooltip: {
          formatter: "{c}{a}"
        },
        toolbox: {
          feature: {
            // restore: {},
            // saveAsImage: {}
          }
        },
        series: [
          {
            name: "V",
            type: "gauge",
            z: 3,
            radius: "80%",
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                width: 10
              }
            },
            axisTick: {
              // 坐标轴小标记
              length: 15, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: "auto"
              }
            },
            axisLabel: {
              backgroundColor: "auto",
              borderRadius: 2,
              color: "#eee",
              padding: 3,
              textShadowBlur: 2,
              textShadowOffsetX: 1,
              textShadowOffsetY: 1,
              textShadowColor: "#222"
            },
            title: {
              // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: "bolder",
              fontSize: 15,
              fontStyle: "italic"
            },

            center: ["30%", "50%"],
            max: "500",
            detail: { formatter: "{value}V" },
            data: [
              {
                value: 0,
                name: "A相电压"
              }
            ]
          },
          {
            name: "A",
            type: "gauge",
            center: ["55%", "50%"],
            startAngle: 135,
            endAngle: -135,
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                width: 3
              }
            },
            max: "300",
            detail: { formatter: "{value}A" },
            data: [
              {
                value: 0,
                name: "A相电流"
              }
            ]
          },
        
        ]
      };

      vmeter.setOption(option);
      // vmeter.showLoading()
      // myChart.setOption(option);

      //根据窗口的大小变动图表 --- 重点
      window.onresize = function() {
        vmeter.resize();
        //myChart1.resize();    //若有多个图表变动，可多写
      };

      setInterval(function() {
        // console.log(that.$store.state.device_data)
        // option.series[0].data[0].value = that.$store.state.device_data.voltage1;
        // option.series[1].data[0].value = that.$store.state.device_data.current1;
        // vmeter.setOption(option, true);
      }, 100*1000);
    },
    getdata() {
      
    }
  }
};
</script>

<style scoped>
</style>
