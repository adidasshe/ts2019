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
      default: "chart",
    },
    data: {
      type: Array,
      required: true,
    },
    width: {
      type: String,
      default: "350px",
    },
    height: {
      type: String,
      default: "300px",
    },
  },
  data() {
    return {
      chart: null,
      totle: this.data[0].value + this.data[1].value,
    };
  },
  watch: {
    data: {
      deep: true,
      handler(val) {
        this.totle = this.data[0].value + this.data[1].value;
        this.chart.setOption({
          title: {
            text: `总车辆数: ${this.totle}`,
          },
          series: {
            data: val,
          },
        });
      },
    },
  },
  mounted() {
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
      var option = {
        // backgroundColor: "#EEEEEE",
        color: [
          "#5ED054",
          "#F4F8F9",
          "#61a0a8",
          "#d48265",
          "#91c7ae",
          "#749f83",
          "#ca8622",
          "#bda29a",
          "#6e7074",
          "#546570",
          "#c4ccd3",
        ],
        title: {
          text: `总车辆数: ${this.totle}`,
          textStyle: {
            fontSize: 12,
          },
          left: "left",
        },
        tooltip: {
          // trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "right",
          data: ["实到车辆数", "未到车辆数"],
        },
        series: [
          {
            name: "仿真结果",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: this.data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      this.chart.setOption(option);
    },
  },
};
</script>
