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
      default: "sddb",
    },
    speeds: {
      type: Array,
    },
    width: {
      type: String,
      default: "300px",
    },
    height: {
      type: String,
      default: "300px",
    },
  },
  data() {
    return {
      chart: null,
      data: this.speeds,
    };
  },
  watch: {
    speeds: {
      handler(val) {
        console.log("val", val);
        this.initChart();
      },
    },
  },
  mounted() {
    console.log("speeds",this.speeds)
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
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id));
      console.log("222", this.speeds);
      let data = this.speeds;
      var option = {
        
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "none",
          },
        },
        grid: {
          left: "0%",
          right: "5%",
          bottom: "-5%",
          top: "2%",
          containLabel: true,
        },
        xAxis: {
          show: false,
          type: "value",
        },
        yAxis: [
          {
            type: "category",
            inverse: true,
            axisLabel: {
              show: true,
              fontSize: 12,
              textStyle: {
                color: "#000",
              },
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            data: ["平均速度", "最快速度", "最慢速度"],
          },
          {
            show: true,
            type: "category",
            inverse: true,
            axisTick: "none",
            axisLine: "none",
            axisLabel: {
              show: true,
              textStyle: {
                color: "#000",
                fontSize: "12",
              },
              formatter: function (value, index) {
                return "{x|" + value + "}  {y|" + "M/S}";
              },
              rich: {
                y: {
                  color: "#000",
                  fontSize: 16,
                },
                x: {
                  color: "#2ACEF8",
                  fontSize: 16,
                },
              },
            },
            data: data,
          },
        ],
        series: [
          {
            name: "车辆速度",
            type: "bar",
            zlevel: 1,
            itemStyle: {
              normal: {
                barBorderRadius: 30,
                color: (val) => {
                  if (val.dataIndex < 1) {
                    return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                      {
                        offset: 0,
                        color: "#49bdff",
                      },
                    ]);
                  } else {
                    return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                      {
                        offset: 0,
                        color: "#49bdff",
                      },
                    ]);
                  }
                },
              },
            },
            barWidth: 10,
            data: data,
          },
        ],
      };
      this.chart.setOption(option);
      
    },
  },
};
</script>
