<template>
  <div id="map">
    <!-- 倒计时对话框 -->
    <!-- <el-dialog
      :visible.sync="dialogVisible"
      width="0"
      :close-on-click-modal="false"
      :show-close="false"
      :modal="false"
      :modal-append-to-body="false"
      top="0vh"
      :center="true"
      :fullscreen="false"
      style="margin-top: 0%; margin-left: 20%; width: 100%"
    >
      <timer :total_time="total_time" :restart="restart" class="timer" />
    </el-dialog> -->
  </div>
</template>
<script>
import timer from "@/components/time";
import { taskResult } from "@/api/task";
import { mapGetters } from "vuex";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// import "leaflet-plugin-trackplayback"; //轨迹回放插件
import "leaflet-plugin-trackplayback/dist/control.trackplayback.js";
import "leaflet-plugin-trackplayback/dist/leaflet.trackplayback.js";
import "leaflet-plugin-trackplayback/dist/control.playback.css";
import "leaflet-toolbar/dist/leaflet.toolbar.js"; //工具按钮
import "leaflet-toolbar/dist/leaflet.toolbar.css";
import car from "leaflet/dist/images/car2.png";
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
      target: null,
      source: null,
      restart: 0,
      dialogFormVisible: false,
      dialogVisible: true,
      result: "",
      // mapUrl: "http://bigdata5/osm_tiles/{z}/{x}/{y}.png", //osm地图地址
      mapUrl: "http://openstreetmap/osm_tiles/{z}/{x}/{y}.png", //osm地图地址
    };
  },
  components: {
    timer,
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化方法
    init() {
      /**
       * 获取路由传递的值
       */
      this.task = this.$route.params.data;
      this.points = this.$route.params.points;
      this.task_id = this.$route.params.task_id;
      this.source = this.points.source;
      this.target = this.points.target;
      /**
       * 开启地图
       */
      var map = L.map("map", {
        minZoom: 3,
        maxZoom: 18,
        center: [this.task[0][0].lat, this.task[0][0].lng], //以首车辆坐标为地图中心坐标
        zoom: 17,
        zoomControl: false,
        attributionControl: false,
        crs: L.CRS.EPSG3857,
      });
      L.tileLayer(this.mapUrl, {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      /**
       *   监听鼠标点击事件，弹出经纬度
       */
      function onMapClick(e) {
        L.popup()
          .setLatLng(e.latlng)
          .setContent("经纬度: " + e.latlng.toString())
          .openOn(map);
      }
      map.on("click", onMapClick);

      /**
       * 画出矩形框
       */
      var drawPolygon = () => {
        let tmprect;
        const latlngs = [];
        latlngs[0] = [this.points.maxLat, this.points.maxLon];
        latlngs[1] = [this.points.minLat, this.points.minLon];
        tmprect = L.rectangle(latlngs, { dashArray: 5 }).addTo(map);
      };

      /**
       * 画疏散点
       */
      var drawPoint = () => {
        let platlng = this.points.dest;
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
      var drawLoad = () => {
        L.circleMarker(this.source.split(","), {
          radius: 10,
          color: "blue",
          fillColor: "blue",
          fillOpacity: 1,
        }).addTo(map);

        L.circleMarker(this.target.split(","), {
          radius: 10,
          color: "blue",
          fillColor: "blue",
          fillOpacity: 1,
        }).addTo(map);
      };
      /**
       * 回放车辆轨迹
       */
      if (this.points.maxLat != null && this.points.maxLat != "") {
        drawPolygon();
      } else {
        drawLoad();
      }
      drawPoint();
      const trackplayback = L.trackplayback(this.task, map, {
        targetOptions: {
          useImg: true,
          imgUrl: car, //更换车辆模型图片
        },
      });
      const trackplaybackControl = L.trackplaybackcontrol(trackplayback);
      trackplaybackControl.addTo(map);
      trackplayback.start();

      /**
       * 查看任务结果按钮
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
       * 添加左侧按钮
       */
      new L.Toolbar2.Control({
        position: "topleft",
        actions: [MyAction1],
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