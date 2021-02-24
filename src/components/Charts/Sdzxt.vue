<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts";
import resize from "./mixins/resize";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    id: {
      type: String,
      default: "sdzxt",
    },
    avgSpeeds: {
      type: Array,
      required: true,
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "300px",
    },
  },
  data() {
    return {
      chart: null,
      time: [],
      speeds: [],
    };
  },
  watch: {
    avgSpeeds: {
      deep: true,
      handler(val) {
        this.hanlerSpeeds();
        this.chart.setOption({
          series: [
            {
              data: this.speeds,
            },
          ],
          xAxis: [
            {
              data: this.time,
            },
          ],
        });
      },
    },
  },
  mounted() {
    this.hanlerSpeeds();
    this.initChart();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    //处理平均速度数据
    hanlerSpeeds() {
      for (let i = 0; i < this.avgSpeeds.length; i++) {
        this.time[i] = this.avgSpeeds[i].moment;
        this.speeds[i] = this.avgSpeeds[i].m_speed;
      }
      // console.log("time",this.time)
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id));
      var option = {
        
        // backgroundColor: "#fff",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            lineStyle: {
              color: "#57617B",
            },
          },
        },
        grid: {
          left: "10%",
          right: "10%",
          bottom: "30%",
          top: "20%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: "#0E2A43",
              },
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 14,
                color: "#D5CBE8",
              },
            },
            axisTick: {
              show: false,
            },
            data: this.time,
          },
          {
            axisPointer: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: "#0E2A43",
              },
            },
            axisTick: {
              show: false,
            },
            position: "bottom",
            offset: 0,
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "平均速度趋势图 m/s",
            nameTextStyle:{
              color:"#9A9A9A"
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: "#0E2A43",
              },
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 14,
                color: "#D5CBE8",
              },
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: "#57617B",
              },
            },
          },
        ],
        series: [
          {
            name: "平均速度",
            type: "line",
            smooth: true,
            stack: "总量",
            symbol: "circle",
            symbolSize: 5,
            showSymbol: false,
            animationDelay: 0.5 * 1000,
            animationDuration: 1000,
            markPoint: {
              // symbol: 'none',
              symbolSize: 10,
              label: {
                position: "insideBottomRight",
                formatter: "{b} : {c}",
              },
              data: [
                {
                  type: "max",
                  name: "最大值",
                },
                { type: "min", name: "最小值" },
              ],
              animationDelay: 2 * 1000,
              animationDuration: 0.1 * 1000,
            },
            markLine: {
              label: {
                position: "insideEndBottom",
                formatter: "{b} : {c}",
              },
              data: [{ type: "average", name: "平均值" }],
            },
            lineStyle: {
              normal: {
                width: 1,
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 0,
                  colorStops: [
                    {
                      offset: 0,
                      color: "#0090FD", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "#0090FD", // 100% 处的颜色
                    },
                  ],
                  globalCoord: false, // 缺省为 false
                },
                opacity: 0.9,
              },
            },
            // areaStyle: {
            //   normal: {
            //     color: new echarts.graphic.LinearGradient(
            //       0,
            //       0,
            //       0,
            //       1,
            //       [
            //         {
            //           offset: 0,
            //           color: "rgba(137, 189, 27, 0.3)",
            //         },
            //         {
            //           offset: 0.8,
            //           color: "rgba(137, 189, 27, 0)",
            //         },
            //       ],
            //       false
            //     ),
            //     shadowColor: "rgba(0, 0, 0, 0.1)",
            //     shadowBlur: 10,
            //   },
            // },
            itemStyle: {
              normal: {
                color: "rgb(137,189,27)",
                borderColor: "rgba(137,189,2,0.27)",
                borderWidth: 12,
              },
            },
            data: this.speeds,
          },
        ],
      };
      this.chart.setOption(option);
    },
  },
};
</script>
