<template>
  <div id="map">
    <div class="list">
      <el-row :gutter="4">
        <el-col :span="6">
          <el-card shadow="hover">
            <el-row>
              <el-col :span="6">
                <el-image class="img" :src="fangzhen" />
              </el-col>
              <el-col :span="18">
                <div class="title">任务名称 ：{{ temp.task_name }}</div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <el-row>
              <el-col :span="6">
                <el-image class="img" :src="time" />
              </el-col>
              <el-col :span="18">
                <span>车辆运动开始时间</span>
                <div class="title1">{{ temp.start_time }}</div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <el-row>
              <el-col :span="6">
                <el-image class="img" :src="road" />
              </el-col>
              <el-col :span="18">
                <span>道路总长度</span>
                <div class="title1">{{ temp.sum_length }}m</div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <el-row :gutter="4">
              <el-col :span="6">
                <el-image class="img" :src="car" />
              </el-col>
              <el-col :span="9">
                <span>初始车距</span>
                <div class="title1">{{ temp.car_dis }}m</div>
              </el-col>
              <el-col :span="9">
                <el-button
                  type="success"
                  icon="el-icon-download"
                  @click="download"
                  >数据下载</el-button
                >
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="list-chart">
      <el-row :gutter="4">
        <el-col :span="6">
          <el-card shadow="hover">
            <p>仿真总体结果</p>
            <fzztjg :data="pie_data" />
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover">
            <p>总耗时 /s</p>
            <zhs :times="times" class="chart" />
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <p>速度 M/S</p>
            <!-- <sddb :speeds="speeds" /> -->
            <div
              id="sddb"
              :style="{ width: '300px', height: '300px' }"
              ref="sddb"
              class="chart"
            ></div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- 平均速度趋势图 -->
    <div class="list-line">
      <el-row>
        <el-col :span="18">
          <sdzxt :avgSpeeds="avgSpeeds" />
        </el-col>
        <el-col :span="6">
          <div class="title2">总平均速度：{{ this.speeds[0] }} m/s</div>
          <div class="title3">{{ time_line }}</div>
        </el-col>
      </el-row>
    </div>
    <div class="table">
      <el-table
        :data="list_table"
        border
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          label="ID"
          prop="id"
          sortable="custom"
          align="center"
          width="80"
          :class-name="getSortClass('id')"
          v-if="false"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.task_id }}</span>
          </template>
        </el-table-column>

        <el-table-column label="疏散点坐标" min-width="450px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.destination }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="距离疏散点平均距离"
          min-width="250px"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.avg_dis }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实到车辆" min-width="250px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.darrived }}</span>
          </template>
        </el-table-column>
        <el-table-column label="应到车辆" min-width="250px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.should_arrived }}</span>
          </template>
        </el-table-column>
        <el-table-column label="到达占比" min-width="200px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.percent }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="下载说明"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <span>下载本任务的数据</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="getDataByAxios">确定下载</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import echarts from "echarts";
import fzztjg from "@/components/Charts/Fzztjg";
import zhs from "@/components/Charts/Zhs";
import sddb from "@/components/Charts/Sddb";
import sdzxt from "@/components/Charts/Sdzxt";
import { getToken } from "@/utils/auth";

import { taskResult, download } from "@/api/task";
export default {
  data() {
    return {
      url:"http://bigdata5:8080/client/osm/v1/tasks/download.do",
      // url:"http://localhost:8088/download",
      temp: {},
      task_id: null,
      dialogVisible: false,
      list_table: null,
      time_line: null,
      pie_data: [
        { value: 0, name: "实到车辆数" },
        { value: 0, name: "未到车辆数" },
      ],
      avgSpeeds: [],
      speeds: [],
      times: {
        elst_cost: 0,
        total_time: 0,
        ltst_cost: 0,
        avg_time: 0,
      },
      fangzhen: require("@/assets/images/fangzhen.png"),
      road: require("@/assets/images/road1.png"),
      car: require("@/assets/images/car1.png"),
      time: require("@/assets/images/time.png"),
    };
  },
  components: { fzztjg, zhs, sddb, sdzxt },
  watch: {
    speeds: {
      handler(val) {
        // console.log("val", val);
        this.initChart();
      },
    },
  },
  mounted() {
    this.task_id = this.$route.params.task_id;
    this.getResult();
    // console.log("111", this.speeds);
    this.initChart();
  },
  methods: {
    /**
    点击下载数据
     */
    download() {
      console.log("开始下载数据...");
      this.dialogVisible = true;
    },
    /**
     * 调用下载数据接口
     */
    getData() {
      this.dialogVisible = false;
      let task_id = this.$route.params.task_id;
      download(task_id).then((res) => {
        console.log("下载的数据", res.data);
        let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
        let dateTime = new Date();
        let dateTimeStr =
          dateTime.getFullYear() +
          "-" +
          dateTime.getMonth() +
          "-" +
          dateTime.getDay();
        let filename = "任务：" + this.temp.task_name + " " + "数据" + ".xls";
        var blobURL = window.URL.createObjectURL(blob); // 将blob对象转为一个URL
        var tempLink = document.createElement("a"); // 创建一个a标签
        tempLink.style.display = "none";
        tempLink.href = blobURL;
        tempLink.setAttribute("download", filename); // 给a标签添加下载属性
        if (typeof tempLink.download === "undefined") {
          tempLink.setAttribute("target", "_blank");
        }
        document.body.appendChild(tempLink); // 将a标签添加到body当中
        tempLink.click(); // 启动下载
        document.body.removeChild(tempLink); // 下载完毕删除a标签
        window.URL.revokeObjectURL(blobURL);
      });
    },
    /**
     * 独立发送请求函数
     */
    getDataByAxios() {
      let that = this;
      this.dialogVisible = false;
      axios
        .get(this.url, {
          params: {
            task_id: this.task_id,
            token: getToken(), 
          },
          responseType: 'blob'
        })
        .then(function (res) {
          console.log(res)
          let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          let filename = "任务：" + that.temp.task_name + " " + "数据" + ".xlsx";
          var blobURL = window.URL.createObjectURL(blob); // 将blob对象转为一个URL
          var tempLink = document.createElement("a"); // 创建一个a标签
          tempLink.style.display = "none";
          tempLink.href = blobURL;
          tempLink.setAttribute("download", filename); // 给a标签添加下载属性
          if (typeof tempLink.download === "undefined") {
            tempLink.setAttribute("target", "_blank");
          }
          document.body.appendChild(tempLink); // 将a标签添加到body当中
          tempLink.click(); // 启动下载
          document.body.removeChild(tempLink); // 下载完毕删除a标签
          window.URL.revokeObjectURL(blobURL);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    /**
     * 初始化图表
     */
    initChart() {
      this.chart = echarts.init(this.$refs.sddb);
      // console.log("222", this.speeds);
      let data_speed = this.speeds;
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
            data: this.speeds,
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
            data: this.speeds,
          },
        ],
      };
      this.chart.setOption(option);
    },
    /**
     * 查看任务结果
     */
    getResult() {
      let task_id = this.$route.params.task_id;
      // console.log("======>>>>>>>>>>>>>>>>>>>>>>", task_id);
      taskResult(task_id).then((response) => {
        this.temp = response.data;
        this.list_table = response.data.dests;
        for (let i = 0; i < this.list_table.length; i++) {
          this.list_table[i].percent =
            Math.round(
              (response.data.dests[i].darrived /
                response.data.dests[i].should_arrived) *
                10000
            ) /
              100.0 +
            "%";
        }

        this.pie_data[0].value = response.data.arrived;
        this.pie_data[1].value =
          response.data.total_car - response.data.arrived;
        this.avgSpeeds = response.data.avgSpeeds;
        this.speeds.push(response.data.avg_speed);
        this.speeds.push(response.data.max_speed);
        this.speeds.push(response.data.min_speed);
        this.times.total_time = response.data.total_time;
        this.times.elst_cost = response.data.elst_cost;
        this.times.ltst_cost = response.data.ltst_cost;
        this.times.avg_time = response.data.avg_time;
        this.time_line =
          response.data.avgSpeeds[0].moment +
          " -- " +
          response.data.avgSpeeds[response.data.avgSpeeds.length - 1].moment;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.list {
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 50px;
  background: #ffffff;
  box-shadow: 26px 26px 51px #757575, -26px -26px 51px #ffffff;
}
.list-chart {
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 10px;
  // border-radius: 50px;
  background: #ffffff;
  box-shadow: 26px 26px 51px #757575, -26px -26px 51px #ffffff;
}
.list-line {
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 10px;
  // border-radius: 50px;
  background: #ffffff;
  box-shadow: 26px 26px 51px #757575, -26px -26px 51px #ffffff;
}
.table {
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  // border-radius: 50px;
  background: #ffffff;
  box-shadow: 26px 26px 51px #757575, -26px -26px 51px #ffffff;
}

.img {
  // border-style: solid; border-width: 5px;
}
.chart {
  // border-style: solid;
  // border-width: 5px;
  text-align: center;
  margin: 0 auto;
}
.title {
  padding: 20px 0;
  font-size: 16px;
}
.title1 {
  margin-top: 10px;
  font-size: 20px;
}
.title2 {
  margin-top: 200px;
  font-size: 25px;
}
.title3 {
  margin: 10px;
  font-size: 15px;
}
.card-panel-icon {
  // float: left;
  font-size: 48px;
}
</style>