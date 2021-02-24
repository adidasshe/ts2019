<template>
  <div class="dialog">
    <div id="map">
      <el-dialog
        :visible.sync="LogVisible"
        :close-on-click-modal="false"
        :show-close="false"
        :modal="false"
        width="0"
        style="margin-top: 27%; margin-left: 8%; width: 100%"
      >
        <div class="main" v-if="LodingVisible">
          <div class="loding-text">
            <div class="loading">
              任务初始化中
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        <ul
          class="infinite-list"
          ref="scroll"
          v-infinite-scroll="load"
          style="overflow: auto"
        >
          <li ref="li" v-for="i in count" class="infinite-list-item">
            {{ i }}
          </li>
          <!-- <li v-model="count" class="infinite-list-item">{{ i }}</li> -->
        </ul>
      </el-dialog>

      <el-dialog title="任务结果" :visible.sync="dialogFormVisible">
        <el-form
          ref="dataForm"
          :model="temp"
          label-position="left"
          label-width="130px"
          style="width: 500px; margin-left: 50px"
          size="mini"
        >
          <el-form-item label="任务名称">
            <el-input v-model="temp.task_name"></el-input>
          </el-form-item>
          <el-form-item label="车辆总数">
            <el-input v-model="temp.total_car"></el-input>
          </el-form-item>
          <el-form-item label="总共耗时">
            <el-input v-model="temp.total_time"></el-input>
          </el-form-item>
          <el-form-item label="平均速度:(KM/H)">
            <el-input v-model="temp.avg_speed"></el-input>
          </el-form-item>

          <el-form-item
            v-for="(dest, index) in temp.dest"
            :label="'疏散点: ' + (index + 1)"
            prop="dest"
          >
            <el-input v-model="dest.destination"></el-input>
            <el-form-item label="应到车辆:">
              <el-input v-model="dest.should_arrived"></el-input>
            </el-form-item>
            <el-form-item label="实到车辆:">
              <el-input v-model="dest.arrived"></el-input>
            </el-form-item>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { taskResult, realTimePlay, getRealLogs, getTaskLogs } from "@/api/task";
import { mapGetters } from "vuex";
// import mapboxgl from "mapbox-gl";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@/assets/js/AnimatedMarker.js";
// import "Leaflet.AnimatedMarker-1.0.0/src/AnimatedMarker.js";
import "Leaflet.MovingMarker-master/MovingMarker";
import icon from "leaflet/dist/images/marker-icon.png";
import car from "leaflet/dist/images/car2.png";
// import car from "@/assets/images/car.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import Bus from "@/utils/bus.js";
// import car from 'assets/images/car.png'
// import { replay } from "@/api/task";
export default {
  data() {
    return {
      progress: 1,
      log: {},
      count: ["任务日志"],
      data: {},
      temp: {},
      taskLogStatus: 0,
      dialogFormVisible: false,
      LodingVisible: false,
      LogVisible: false,
      initStatus: 0,
      result: "",
      speed: 1,
      // mapUrl: "http://bigdata5/osm_tiles/{z}/{x}/{y}.png",
      mapUrl: "http://openstreetmap/osm_tiles/{z}/{x}/{y}.png",
    };
  },
  
  mounted() {
    this.getTask();
    //从vuex中取出数据
    if (this.task != null) {
      this.data = this.task;
    }
    this.init();
    //2秒调接口一次
    this.times = window.setInterval(() => {
      setTimeout(this.getTask, 0);
    }, this.speed * 1000);
  },
  beforeDestroy() {
    clearInterval(this.times);
  },
  computed: {
    ...mapGetters(["name", "task", "task_id"]),
  },
  watch: {
    task(val, oldVal) {
      if (val != oldVal) {
        this.data = val;
      }
    },
  },
  methods: {
    load() {
      // this.count.push(this.log);
      // this.count += 1;
      //自动滑动滚动条显示最新一条日志
      this.$nextTick(() => {
        let ul = this.$refs.scroll;
        ul.scrollTop = ul.scrollHeight;
        // console.log("滑动滚动条后", ul.scrollTop, ul.scrollHeight);
      });
    },
    // 初始化
    init() {
      var map = L.map("map", {
        minZoom: 3,
        maxZoom: 17,
        // center: this.data.coors[0],
        center: [31.221, 121.49],
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
        crs: L.CRS.EPSG3857,
      });

      L.tileLayer(this.mapUrl, {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      //默认标注
      let DefaultIcon = L.icon({
        iconUrl: car,
        shadowUrl: iconShadow,
        iconSize: [25, 39],
        iconAnchor: [12, 39],
      });
      L.Marker.prototype.options.icon = DefaultIcon;
      //车模型
      var myIcon = L.icon({
        iconUrl: car,
        iconSize: [25, 39],
        iconAnchor: [12, 39],
        shadowUrl: null,
      });
      //监听鼠标点击事件，弹出经纬度
      function onMapClick(e) {
        L.popup()
          .setLatLng(e.latlng)
          .setContent("经纬度: " + e.latlng.toString())
          .openOn(map);
      }
      map.on("click", onMapClick);
      //画出矩形框
      var drowRectangle = () => {
        let tmprect;
        const rlatlngs = [];
        rlatlngs[0] = [this.data.maxLat, this.data.maxLon];
        rlatlngs[1] = [this.data.minLat, this.data.minLon];
        tmprect = L.rectangle(rlatlngs, { dashArray: 5 }).addTo(map);
        map.fitBounds(rlatlngs);
      };
      //画疏散点
      var drowCircl = () => {
        let platlng = this.data.dest;
        for (let i = 0; i < platlng.length; i++) {
          L.circleMarker(platlng[i], {
            radius: 10,
            color: "red",
            fillColor: "red",
            fillOpacity: 1,
          }).addTo(map);
        }
      };

      var latlngs = [];
      var myGroup;
      // var speed = 1;
      /**
       * 画车
       */
      var drowCar = () => {
        // console.log(this.data);
        var makers = [];
        //如果有数据就画车
        if (this.data.length != 0) {
          //如果还没画区域及疏散点就先画区域、疏散点
          if (this.initStatus === 0) {
            drowRectangle();
            drowCircl();
            //区域绘制状态改变，避免重复绘制
            this.initStatus = 1;
          }
          latlngs = this.data.coors;
          //根据所有车的坐标在地图上标点
          for (let i = 0; i < latlngs.length; i++) {
            var maker = L.marker(latlngs[i]);
            makers.push(maker);
            //模拟每次标点数据变化
            // console.log(latlngs[i][0]);
            // latlngs[i][0] = latlngs[i][0] + 0.001;
          }
          myGroup = L.layerGroup(makers);
          map.addLayer(myGroup);
          // console.log(typeof myGroup)

          setTimeout(() => {
            myGroup.clearLayers();
            // console.log("清除=========>>>>>>");
            //4.5秒清除一次
          }, this.speed * 0.5 * 1000);
        }
      };
      var that = this;
      //设置定时器，重绘车辆
      var carTimes = setInterval(() => {
        // console.log("data", this.data);
        if (this.data.status != "finish") {
          if (that.$route.path == "/realTime") {
            drowCar();
          } else {
            clearInterval(carTimes);
          }
        } else {
          //跳转结果页面
          // console.log("data", this.data);
          this.getResult();
          clearInterval(carTimes);
        }
        //1秒画一次
      }, this.speed * 1 * 1000);
    },
    getTask() {
      this.listLoading = true;
      let task_id = this.task_id;
      this.LogVisible = true;
      // console.log(this.taskLogStatus, "进度条显示状态");
      if (this.taskLogStatus === 0) {
        this.LodingVisible = true;
        //将任务开始时的log显示出来
        getTaskLogs(task_id).then((response) => {
          // console.log("log:", response.data);
          //如果有数据就一直弹出信息
          if (
            response.data.log != "" &&
            response.data.log != null &&
            response.data.log != "undefined" &&
            response.data.status === 0
          ) {
            // this.log = response.data.log;
            this.count.push(response.data.log);
            this.load();
          }
          //如果状态变为初始化完成则调用回放接口
          if (response.data.status != 0) {
            this.LodingVisible = false;
            this.taskLogStatus = 1;
          }
        });
      } else {
        //调用回放接口
        realTimePlay(task_id).then((response) => {
          //数据结果存入vuex中以备实时计算调用
          this.$store.state.task.data = response.data;

          if (response.code === 1000) {
            //将实时的log显示出来
            getRealLogs(task_id).then((response) => {
              this.LogVisible = true;
              let log = response.data.log;
              // console.log("log:", response.data);

              if (log != "" && log != null && log != "undefined") {
                this.count.push(log);
                this.load();
              }
            });
          } else {
            console.log(response.data.log);
          }
        });
      }
    },
    getResult() {
      this.$router.push({ name: "result", params: { task_id: this.task_id } });
    },
  },
};
</script>
<style scope>
.coordinates {
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  position: absolute;
  bottom: 10px;
  left: 10px;
  padding: 5px 10px;
  margin: 0;
  font-size: 11px;
  line-height: 18px;
  border-radius: 3px;
  display: none;
}
#map {
  width: 100%;
  height: 1200px;
}

.section {
  position: absolute;
  height: 100vh;
  width: 100%;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.section::before {
  content: "";
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: #00adff;
  z-index: 1;
  mix-blend-mode: color;
  /* animation: animate 10s linear infinite; */
}
/*font animation */
.p {
  content: "";
  position: relative;
  color: #fff;
  text-align: center;
  margin: 0px;
  padding: 0px;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  filter: blur(0.6px); /*font animation */
  font-weight: 100;
  text-shadow: 0 0 10px rgba(255, 255, 255, 1), 0 0 20px rgba(255, 255, 255, 1),
    0 0 40px rgba(255, 255, 255, 1), 0 0 80px rgba(255, 255, 255, 1),
    0 0 160px rgba(255, 255, 255, 1);
  z-index: 1;
}
/* .animated-text {
  position: relative;
  margin: 0px;
  padding: 0px;
  width: 100%;
  text-align: center;
  color: #fff;
  text-transform: uppercase;
  font-size: 30px;
  filter: blur(0.6px);
} */
.div {
  max-width: 1000px;
}
/* loading text start */
.loding-text {
  position: absolute;
  margin-top: 0px;
  margin-left: 40px;
  font-size: 36px;
}

.loading {
  width: 650px;
  height: 15px;
  /* margin-top: 75px; */
  /* margin-left: 350px; */
}
.loading span {
  display: inline-block;
  width: 15px;
  height: 100%;
  margin-right: 5px;
  background: #484848;
  -webkit-animation: load 1.04s ease infinite;
}
.loading span:last-child {
  margin-right: 0px;
}
@-webkit-keyframes load {
  0% {
    opacity: 1;
    -webkit-transform: scale(1.2);
  }
  100% {
    opacity: 0.2;
    -webkit-transform: scale(0.2);
  }
}
.loading span:nth-child(1) {
  -webkit-animation-delay: 0.13s;
}
.loading span:nth-child(2) {
  -webkit-animation-delay: 0.26s;
}
.loading span:nth-child(3) {
  -webkit-animation-delay: 0.39s;
}
.loading span:nth-child(4) {
  -webkit-animation-delay: 0.52s;
}
.loading span:nth-child(5) {
  -webkit-animation-delay: 0.65s;
}

.infinite-list {
  position: absolute;
  width: 700px;
  height: 150px;
  margin-top: 50px;
  background-color: rgba(255, 255, 255, 0);
  /* border: 1px solid rebeccapurple; */
}

.infinite-list-item {
  height: auto;
  min-height: 90%;
  width: 95%;
  white-space: nowrap;
  margin: 5px;
  background: #9a9a9a;
  background-color: rgba(255, 255, 255, 0.8);
  list-style: decimal;
  /*解决图块不能同行显示*/
  display: inline-block;
  white-space: normal;
  word-break: break-all;
  overflow: hidden;
}

.infinite-list-wrapper p {
  text-align: center;
}
.el-dialog {
  /* background-color: rgba(0, 0, 0, 0.5); */
  /* border: 1px solid rebeccapurple; */
}
</style>