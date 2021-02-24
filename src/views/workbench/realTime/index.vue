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
    </div>
  </div>
</template>
<script>
import { taskResult, realTimePlay, getRealLogs, getTaskLogs } from "@/api/task";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-rotatedmarker/leaflet.rotatedMarker.js";
import icon from "leaflet/dist/images/marker-icon.png";
import car from "@/assets/images/car2.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
export default {
  data() {
    return {
      progress: 1,
      log: {},
      count: ["任务日志"],
      data: null,
      temp: {},
      task_id: null,
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
    this.init();
    //休眠0.3秒等返回值
    // setTimeout(this.init, 0.3 * 1000);
    //2秒调接口一次
    this.times = window.setInterval(() => {
      setTimeout(this.getTask, 0);
    }, this.speed * 1000);
  },
  beforeDestroy() {
    clearInterval(this.times);
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
        maxZoom: 18,
        center: [34.694, 113.587],
        zoom: 3,
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
      });
      L.Marker.prototype.options.icon = DefaultIcon;

      //监听鼠标点击事件，弹出经纬度
      function onMapClick(e) {
        L.popup()
          .setLatLng(e.latlng)
          .setContent("经纬度: " + e.latlng.toString())
          .openOn(map);
      }
      map.on("click", onMapClick);
      var that = this;

      /**
       * 画出矩形框
       */
      var drowRectangle = () => {
        console.log("画框");
        let tmprect;
        const rlatlngs = [];
        rlatlngs[0] = [that.data.maxLat, that.data.maxLon];
        rlatlngs[1] = [that.data.minLat, that.data.minLon];
        tmprect = L.rectangle(rlatlngs, { dashArray: 5 }).addTo(map);
        map.fitBounds(rlatlngs);
      };

      /**
       * 画疏散点
       */
      var drowCircl = () => {
        let platlng = that.data.dest;
        // console.log("画点", platlng);
        for (let i = 0; i < platlng.length; i++) {
          L.circleMarker(platlng[i], {
            radius: 10,
            color: "red",
            fillColor: "red",
            fillOpacity: 1,
          }).addTo(map);
        }
      };

      /**
       * 画道路点
       */
      var drowLoad = () => {
        let point = [that.data.target.split(","), that.data.target.split(",")];
        L.circleMarker(that.data.source.split(","), {
          radius: 10,
          color: "blue",
          fillColor: "blue",
          fillOpacity: 1,
        }).addTo(map);

        L.circleMarker(that.data.target.split(","), {
          radius: 10,
          color: "blue",
          fillColor: "blue",
          fillOpacity: 1,
        }).addTo(map);
        map.fitBounds(point);
      };

      var latlngs = [];
      var mGroup = [];

      /**
       * 画初始坐标点
       */
      var drowMakers = () => {
        if (this.data == null || this.data == "undefined") {
          console.log("未获取到仿真数据，请等待...");
        } else {
          //判断是否画区域
          if (that.data.maxLat != null && that.data.maxLat != "") {
            drowRectangle();
          } else {
            // console.log("画路");
            drowLoad();
          }
          drowCircl();

          //坐标初始数据标记到地图
          latlngs = this.data.coors;
          for (let i = 0; i < latlngs.length; i++) {
            // var polyline = L.polyline(latlngs[i], { color: "red" }).addTo(map);
            let m = L.marker(latlngs[i], {}).addTo(map);
            mGroup.push(m);
          }
        }
      };
      /**
       * 计算旋转角度
       *
       * 传入前后两点的经纬度坐标值
       */
      var calculateRotationAngle = (px1, py1, px2, py2) => {
        let x = px2 - px1;
        let y = py2 - py1;
        let hypotenuse = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        //斜边长度
        let cos = x / hypotenuse;
        let radian = Math.acos(cos);
        //求出弧度
        let angle = 180 / (Math.PI / radian);
        //用弧度算出角度
        if (y < 0) {
          angle = -angle;
        } else if (y == 0 && x < 0) {
          angle = 180;
        }
        return angle;
      };
      var oldLatlng = [];
      var newLatlng = [];
      /**
       * 车辆变换坐标及方向
       */
      var carRun = () => {
        console.log("m", mGroup);
        //判断是否开始接收到仿真数据
        if (mGroup.length == 0) {
          drowMakers();
        } else {
          //每个车辆坐标转换成新接收的坐标并设置新的弧度
          for (var i = 0; i < mGroup.length; i++) {
            oldLatlng = mGroup[i].getLatLng();
            newLatlng = L.latLng(this.data.coors[i][0], this.data.coors[i][1]);

            //获取新旧坐标之间的弧度
            let angle = calculateRotationAngle(
              oldLatlng.lat,
              oldLatlng.lng,
              newLatlng.lat,
              newLatlng.lng
            );
            console.log(
              "旧坐标：",
              oldLatlng,
              "新坐标：",
              newLatlng,
              "弧度：",
              angle
            );
            mGroup[i].setRotationAngle(angle);
            // mGroup[i].setLatLng([oldLatlng.lat+0.0001, oldLatlng.lng]);
            mGroup[i].setLatLng(newLatlng);
          }
        }

        // console.log("跑啊跑", mGroup[0].getLatLng());
      };

      /**
       * 设置定时器，重绘车辆
       */

      var carTimes = setInterval(() => {
        // console.log("data", this.data);
        if (this.data.status != "finish") {
          if (that.$route.path == "/realTime") {
            carRun();
          } else {
            clearInterval(carTimes);
          }
        } else {
          //跳转结果页面
          // console.log("data", this.data);
          this.getResult();
          clearInterval(carTimes);
        }
        //速度（speed）
      }, this.speed * 3 * 1000);
    },

    /**
     * 获取任务信息
     */
    getTask() {
      this.listLoading = true;
      this.task_id = this.$route.params.task_id;
      this.LogVisible = true;
      var that = this;
      // console.log(this.taskLogStatus, "进度条显示状态");
      if (this.taskLogStatus === 0) {
        this.LodingVisible = true;
        //将任务开始时的log显示出来
        getTaskLogs(this.task_id).then((response) => {
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
        realTimePlay(this.task_id).then((response) => {
          //数据结果存入vuex中以备实时计算调用
          // this.$store.state.task.data = response.data;
          // console.log("调用回放接口", response.data);
          this.data = response.data;
          if (response.code === 1000) {
            //将实时的log显示出来
            getRealLogs(this.task_id).then((response) => {
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

    /**
     * 跳转到任务结果
     */
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