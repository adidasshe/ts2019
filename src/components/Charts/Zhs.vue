<template>
<div>
  <!-- <p>总耗时 /s</p> -->
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</div>
  
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
      default: "zhs",
    },
    times: {
      type: Object,
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
    };
  },
  watch: {
    times: {
      deep: true,
      handler(val) {
        this.initChart();
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
      var dataStyle = {
        normal: {
          label: {
            show: false,
          },
        },
      };
      var option = {
        // backgroundColor: "#fff",
        series: [
          {
            name: "项目用时",
            type: "pie",
            clockWise: false,
            radius: [80, 95],
            itemStyle: dataStyle,
            hoverAnimation: false,
            center: ["15%", "45%"],
            data: [
              {
                value: this.times.total_time,
                label: {
                  normal: {
                    rich: {
                      a: {
                        color: "#000",
                        align: "center",
                        fontSize: 16,
                        fontWeight: "bold",
                      },
                      b: {
                        color: "#888888",
                        align: "center",
                        fontSize: 12,
                      },
                    },
                    formatter: function (params) {
                      return "{b|项目用时}\n\n" + "{a|" + params.value + "秒}";
                    },
                    position: "center",
                    x: "14%",
                    show: true,
                    textStyle: {
                      fontSize: "14",
                      fontWeight: "normal",
                      color: "#fff",
                    },
                  },
                },
                itemStyle: {
                  normal: {
                    color: "#0090FD",
                    shadowColor: "#C257F6",
                    shadowBlur: 3,
                  },
                },
              },
              {
                value: 0,
                name: "invisible",
                itemStyle: {
                  normal: {
                    color: "#F4F8F9",
                  },
                },
              },
            ],
          },
          {
            name: "最快用时",
            type: "pie",
            clockWise: false,
            radius: [65, 70],
            itemStyle: dataStyle,
            hoverAnimation: false,
            center: ["42%", "45%"],
            data: [
              {
                value: this.times.elst_cost,
                label: {
                  normal: {
                    rich: {
                      a: {
                        color: "#000",
                        align: "center",
                        fontSize: 16,
                        fontWeight: "bold",
                      },
                      b: {
                        color: "#888888",
                        align: "center",
                        fontSize: 12,
                      },
                    },
                    formatter: function (params) {
                      return "{b|最快用时}\n\n" + "{a|" + params.value + "秒}";
                    },
                    position: "center",

                    show: true,
                    textStyle: {
                      fontSize: "14",
                      fontWeight: "normal",
                      color: "#fff",
                    },
                  },
                },
                itemStyle: {
                  normal: {
                    color: "#5ED054",
                    shadowColor: "#79C2BC",
                    shadowBlur: 3,
                  },
                },
              },
              {
                value: this.times.total_time - this.times.elst_cost,
                name: "invisible",
                itemStyle: {
                  normal: {
                    color: "#F4F8F9",
                  },
                },
              },
            ],
          },
          {
            name: "最晚用时",
            type: "pie",
            clockWise: false,
            radius: [65, 70],
            itemStyle: dataStyle,
            hoverAnimation: false,
            center: ["65%", "45%"],
            data: [
              {
                value: this.times.ltst_cost,
                label: {
                  normal: {
                    rich: {
                      a: {
                        color: "#000",
                        align: "center",
                        fontSize: 16,
                        fontWeight: "bold",
                      },
                      b: {
                        color: "#888888",
                        align: "center",
                        fontSize: 12,
                      },
                    },
                    formatter: function (params) {
                      return "{b|最晚用时}\n\n" + "{a|" + params.value + "秒}";
                    },
                    position: "center",
                    show: true,
                    textStyle: {
                      fontSize: "14",
                      fontWeight: "normal",
                      color: "#fff",
                    },
                  },
                },
                itemStyle: {
                  normal: {
                    color: "#69A3E2",
                    shadowColor: "#389af4",
                    shadowBlur: 3,
                  },
                },
              },
              {
                value: this.times.total_time - this.times.ltst_cost,
                name: "invisible",
                itemStyle: {
                  normal: {
                    color: "#F4F8F9",
                  },
                },
              },
            ],
          },
          {
            name: "平均用时",
            type: "pie",
            clockWise: false,
            radius: [65, 70],
            itemStyle: dataStyle,
            hoverAnimation: false,
            center: ["88%", "45%"],
            data: [
              {
                value: this.times.avg_time,
                label: {
                  normal: {
                    rich: {
                      a: {
                        color: "#000",
                        align: "center",
                        fontSize: 16,
                        fontWeight: "bold",
                      },
                      b: {
                        color: "#888888",
                        align: "center",
                        fontSize: 12,
                      },
                    },
                    formatter: function (params) {
                      return "{b|平均用时}\n\n" + "{a|" + params.value + "秒}";
                    },
                    position: "center",
                    show: true,
                    textStyle: {
                      fontSize: "14",
                      fontWeight: "normal",
                      color: "#fff",
                    },
                  },
                },
                itemStyle: {
                  normal: {
                    color: "#FDBA4F",
                    shadowColor: "#F4F8F9",
                    shadowBlur: 3,
                  },
                },
              },
              {
                value: this.times.total_time - this.times.avg_time,
                name: "invisible",
                itemStyle: {
                  normal: {
                    color: "#F4F8F9",
                  },
                },
              },
            ],
          },
        ],
      };
      this.chart.setOption(option);
    },
  },
};
</script>
