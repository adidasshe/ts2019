<template>
  <div id="map">
    <el-dialog
      :visible.sync="dialogVisible"
      width="0"
      :close-on-click-modal="false"
      :show-close="false"
      :modal="false"
      :modal-append-to-body="false"
      top="0vh"
      :center="true"
      :fullscreen="false"
      style="margin-top: 0%;margin-left: 20%;width:100%;"
    >
      <timer :total_time="total_time" :restart="restart" class="timer" />
    </el-dialog>
  </div>
</template>
<script>
import timer from "@/components/time";
import { taskResult } from "@/api/task";
import { mapGetters } from "vuex";
import L from "leaflet";
import 'leaflet-plugin-trackplayback' //轨迹回放插件
import "leaflet/dist/leaflet.css";
import "@/assets/js/AnimatedMarker.js"; //坐标移动插件
import "leaflet-toolbar/dist/leaflet.toolbar.js";
import "leaflet-toolbar/dist/leaflet.toolbar.css";
// import "Leaflet.AnimatedMarker-1.0.0/src/AnimatedMarker.js";
// import "Leaflet.MovingMarker-master/MovingMarker";
import icon from "leaflet/dist/images/marker-icon.png";
import car from "leaflet/dist/images/car.png";
// import car from "@/assets/images/car.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import Bus from "@/utils/bus.js";
// import car from 'assets/images/car.png'
// import { replay } from "@/api/task";
export default {
  data() {
    return {
      speed: 2000,
      coors: [
        [39.550339, 116.114129],
        [39.560339, 116.124229],
        [39.570339, 116.134329],
        [39.600339, 116.155329],
      ],
      temp: {},
      total_time: 0,
      task: null,
      points: null,
      task_id: null,
      restart: 0,
      dialogFormVisible: false,
      dialogVisible: true,
      result: "",
      mapUrl: "http://192.168.0.135/osm_tiles/{z}/{x}/{y}.png",
      mapUrl2: "http://bigdata5/osm_tiles/{z}/{x}/{y}.png",
    };
  },
  components: {
    timer,
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      this.total_time = this.$route.params.total_time;
      this.task = this.$route.params.data;
      this.points = this.$route.params.points;
      this.task_id = this.$route.params.task_id;
      var map = L.map("map", {
        minZoom: 3,
        maxZoom: 17,
        center: this.task[0].coors[0],
        // center: [31.2223608,121.4910911],
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
        crs: L.CRS.EPSG3857,
      });

      // L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      L.tileLayer(this.mapUrl2, {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      //默认标注
      let DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow,
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
      let tmprect;
      const latlngs = [];
      latlngs[0] = [this.points.maxLat, this.points.maxLon];
      latlngs[1] = [this.points.minLat, this.points.minLon];
      // console.log("88888", this.task[0]);
      tmprect = L.rectangle(latlngs, { dashArray: 5 }).addTo(map);

      //画疏散点
      let platlng = this.points.dest;
      for (let i = 0; i < platlng.length; i++) {
        L.circleMarker(platlng[i], {
          radius: 10,
          color: "red",
          fillColor: "red",
          fillOpacity: 1,
        }).addTo(map);
      }
      //回放动画

      var myGroup;
      var replay = () => {
        let cars = [];
        for (let i = 0; i < this.task.length; i++) {
          //按照画的线移动
          let line = L.polyline(this.task[i].coors, { color: "red" }),
            animatedMarker = L.animatedMarker(line.getLatLngs(), {
              icon: myIcon,
              distance: 200, // meters
              interval: this.speed, // milliseconds
              // autoStart: false,
            });

          cars.push(animatedMarker);
        }
        myGroup = L.layerGroup(cars);
        map.addLayer(myGroup);
        // animatedMarker.start();
        setTimeout(function () {
          // Stop the animation
          animatedMarker.stop();
        }, 0.0000001 * 1000);
      };
      //正常播放
      replay();

      /**
       * 重新选择区域及地点
       */
      var MyAction1 = L.Toolbar2.Action.extend({
        options: {
          toolbarIcon: {
            html: "查看任务结果",
            className: "ss",
            tooltip: "查看任务结果",
          },
        },

        addHooks: () => {
          this.getResult();
        },
      });
      /**
       * 5倍速
       */
      var MyAction2 = L.Toolbar2.Action.extend({
        options: {
          toolbarIcon: {
            html: "2倍速度回放",
            className: "ss",
            tooltip: "回放速度2倍",
          },
        },

        addHooks: () => {
          this.speed = 2000 / 2;
          myGroup.clearLayers();
          replay();
        },
      });
      /**
       * 10倍速
       */
      var MyAction3 = L.Toolbar2.Action.extend({
        options: {
          toolbarIcon: {
            html: "5倍速度回放",
            className: "ss",
            tooltip: "回放速度5倍",
          },
        },

        addHooks: () => {
          this.speed = 2000 / 5;
          myGroup.clearLayers();
          replay();
        },
      });
      /**
       * 20倍速
       */
      var MyAction4 = L.Toolbar2.Action.extend({
        options: {
          toolbarIcon: {
            html: "20倍速度回放",
            className: "ss",
            tooltip: "回放速度20倍",
          },
        },

        addHooks: () => {
          this.restart = 1;
          this.speed = 2000 / 20;
          myGroup.clearLayers();
          replay();
        },
      });
      /**
       * 添加左侧按钮
       */
      new L.Toolbar2.Control({
        position: "topleft",
        actions: [MyAction1, MyAction2, MyAction3, MyAction4],
      }).addTo(map);
    },

    /**
     * 查看任务结果
     */
    getResult() {
      this.$router.push({ name: "result", params: { task_id: this.task_id } });
    },
  },
};
</script>
<style>
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

.timer {
  position: absolute;
  width: 600px;
  text-align: center;
  margin: 0 auto;
}
</style>