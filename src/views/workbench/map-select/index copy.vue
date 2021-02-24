<template>
  <div>
    <pre id="info"></pre>
    <div id="map"></div>
  </div>
</template>
<script>
import {
  taskList,
  addTask,
  updateTask,
  deleteTask,
  getTask,
  replay,
} from "@/api/task";
import { mapGetters } from "vuex";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-toolbar/dist/leaflet.toolbar.js";
import "leaflet-toolbar/dist/leaflet.toolbar.css";

export default {
  data() {
    return {
      loadPointStatus: 0,
      polygonStatus: 0,
      pointStatus: 0,
      status: -1,
      layersPoint: [],
      loadPoint: [],
      temp: {
        task_name: "",
        carnums: "",
        model: "",
        dest: [],
        username: "",
        maxLon: "",
        maxLat: "",
        minLon: "",
        minLat: "",
        source: "",
        target: "",
      },

      // mapUrl2: "http://bigdata5/osm_tiles/{z}/{x}/{y}.png"
      mapUrl: "http://openstreetmap/osm_tiles/{z}/{x}/{y}.png",
    };
  },
  mounted() {
    this.temp.task_name = this.task_name;
    this.temp.username = this.name;
    this.temp.carnums = this.carnums;
    this.init();
  },
  computed: {
    ...mapGetters(["name", "task_name", "carnums"]),
  },
  methods: {
    // 初始化 39.906, 116.391
    init() {
      var map = L.map("map").setView([31.2210226, 121.489219], 13);

      L.tileLayer(this.mapUrl, {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      var that = this;
      //绘制的矩形
      var rectangle, tmprect;
      //绘制的疏散点、道路
      var layers, lPoint;

      /**
       *画矩形框

       */
      var drawPolygon = () => {
        const latlngs = [];
        map.on("click", (e) => {
          if (typeof tmprect != "undefined") {
            tmprect.remove();
          }
          //左上角坐标
          latlngs[0] = [e.latlng.lat, e.latlng.lng];
          //坐标赋值
          this.temp.maxLon = e.latlng.lng;
          this.temp.maxLat = e.latlng.lat;

          map.on("mousemove", (event) => {
            map.off("click");
            latlngs[1] = [event.latlng.lat, event.latlng.lng];
            //删除临时矩形
            if (typeof tmprect != "undefined") {
              tmprect.remove();
            }
            //添加临时矩形

            tmprect = L.rectangle(latlngs, { dashArray: 5 }).addTo(map);
          });
        });

        map.on("dblclick", (event) => {
          //矩形绘制完成，移除临时矩形，并停止监听鼠标移动事件
          // tmprect.remove();
          map.off("mousemove");
          //右下角坐标
          latlngs[1] = [event.latlng.lat, event.latlng.lng];
          this.temp.minLon = event.latlng.lng;
          this.temp.minLat = event.latlng.lat;
          // console.log(latlngs);
          rectangle = L.rectangle(latlngs, {
            color: "#3300ff",
            fillOpacity: 0,
            weight: 2,
          }).addTo(map);
          //设置区域已选择
          map.off("dblclick");
          that.status = 0;
          that.polygonStatus = 1;

          //优化得到的矩形坐标
          if (that.temp.minLat > that.temp.maxLat) {
            //比较最大最小经纬度,经度大的为左上角坐标
            let lon = that.temp.maxLon;
            that.temp.maxLon = that.temp.minLon;
            let lat = that.temp.maxLat;
            that.temp.maxLat = that.temp.minLat;
            that.temp.minLon = lon;
            that.temp.minLat = lat;
          }
          // console.log(that.temp);
          //调整view范围
          map.fitBounds(latlngs);
        });
      };

      /**
       * 画疏散点
       */
      var drawPoint = () => {
        if (that.polygonStatus === 0 && that.loadPointStatus === 0) {
          //区域未绘制状态
          that.$message.error("请先选择区域或者道路");
        } else if (that.pointStatus != 0) {
          that.$message.error("疏散点已选择");
        } else {
          //画目标点
          that.$message({
            message: "请在选择的疏散区域外选择疏散点",
            type: "warning",
          });
          map.on("click", function (e) {
            //如果选择了重置按钮则关闭打点
            if (that.status === -1) {
              map.off("click");
              console.log("未选择区域点击地点", that.pointStatus);
            } else {
              //开始打点
              if (
                that.temp.minLat <= e.latlng.lat &&
                e.latlng.lat <= that.temp.maxLat &&
                that.temp.maxLon <= e.latlng.lng &&
                e.latlng.lng <= that.temp.minLon
              ) {
                //判断点是否在疏散区域内
                that.$message.error("请在区域外选择疏散点");
              } else {
                //不在矩形区域内可以直接标点
                layers = L.circle(e.latlng, {
                  radius: 10,
                  color: "red",
                  fillColor: "red",
                  fillOpacity: 1,
                }).addTo(map);
                that.layersPoint.push(layers);
                // that.layersPoint[status].remove();
                that.temp.dest[that.status] = [e.latlng.lat, e.latlng.lng];
                that.$message({
                  message: `疏散点 ${that.status + 1} :${e.latlng}`,
                  type: "success",
                });
                that.status += 1;
                // console.log("疏散点： ", that.status, e.latlng, that.status);
              }
            }
          });
          //如果区域框已经选择之后
          // if (that.polygonStatus === 1 && that.status > 0) {
          map.on("dblclick", function (e) {
            // console.log("......");
            map.off("click");
            map.off("dblclick");
            that.pointStatus = 1;
          });
          // }
        }
      };

      /**
       * 画道路
       */
      var drawLoad = () => {
        //判断疏散区域框，如果已经画了框先清除
        if (that.polygonStatus === 1) {
          that.temp.maxLon = "";
          that.temp.maxLat = "";
          that.temp.minLon = "";
          that.temp.minLat = "";
          //移除矩形
          rectangle.remove();
          tmprect.remove();
          that.polygonStatus = 0;
        }
        if (that.loadPointStatus === 1) {
          that.$message.error("道路已选择");
        } else {
          map.on("click", function (e) {
            //判断是否打了第一点
            if (that.temp.source == "") {
              //标起点
              lPoint = L.circle(e.latlng, {
                radius: 10,
                color: "blue",
                fillColor: "blue",
                fillOpacity: 1,
              }).addTo(map);
              that.loadPoint.push(lPoint);
              that.temp.source = [e.latlng.lat, e.latlng.lng];
              // console.log("标起点");
            } else {
              //标终点
              lPoint = L.circle(e.latlng, {
                radius: 10,
                color: "blue",
                fillColor: "blue",
                fillOpacity: 1,
              }).addTo(map);
              that.loadPoint.push(lPoint);
              that.temp.target = [e.latlng.lat, e.latlng.lng];
              // console.log("标终点");
              that.loadPointStatus = 1;
              that.status = that.status + 1;
              // console.log("状态： ", that.status);
              map.off("click");
            }
          });
        }
      };
      /**
       * 选择画地点按钮
       */
      var MyCustomAction = L.Toolbar2.Action.extend({
        options: {
          toolbarIcon: {
            html: "地点",
            className: "ss",
            tooltip: "选择疏散点",
          },
        },

        addHooks: function () {
          drawPoint();
        },
      });

      /**
       * 选择画区域按钮
       */
      var MyAction1 = L.Toolbar2.Action.extend({
        options: {
          toolbarIcon: {
            html: "区域",
            className: "ss",
            tooltip: "选择疏散区域",
          },
        },

        addHooks: function () {
          //如果选择了道路则清零道路数据
          if (that.loadPointStatus === 1) {
            //移除道路标点
            for (let i = 0; i < that.loadPoint.length; i++) {
              that.loadPoint[i].remove();
            }
            that.temp.source = "";
            that.temp.target = "";
            that.loadPointStatus = 0;
          }

          if (that.polygonStatus === 0) {
            //绘制状态复位
            //疏散点坐标清零
            that.pointStatus = 0;
            that.status = -1;
            //画框
            drawPolygon();
            that.$message({
              message: "请在地图上选择区域",
              type: "warning",
            });
          } else {
            that.$message.error("区域已选择");
          }
        },
      });

      /**
       * 创建任务按钮
       */
      var MyAction3 = L.Toolbar2.Action.extend({
        options: {
          toolbarIcon: {
            html: "确定",
            className: "ss",
            tooltip: "坐标选取完毕，返回任务创建",
          },
        },

        addHooks: () => {
          //区域
          // map.setView([48.85815, 2.2942], 19);
          // console.log("创建任务", that.temp);
          // that.creat();
          //跳转回创建页面
          that.toCreat();
        },
      });

      /**
       * 重新选择区域及地点
       */
      var MyAction4 = L.Toolbar2.Action.extend({
        options: {
          toolbarIcon: {
            html: "重选",
            className: "ss",
            tooltip: "清除选择区域、道路及疏散点",
          },
        },

        addHooks: () => {
          //绘制状态复位
          //移除矩形
          rectangle.remove();
          tmprect.remove();
          //移除道路
          for (let i = 0; i < that.loadPoint.length; i++) {
            that.loadPoint[i].remove();
          }
          //移除疏散点
          for (let i = 0; i < that.layersPoint.length; i++) {
            that.layersPoint[i].remove();
          }
          //疏散点坐标清零
          that.temp.dest.length = 0;
          //选择状态复位
          that.polygonStatus = 0;
          that.loadPointStatus = 0;
          that.pointStatus = 0;
          that.status = -1;
        },
      });
      /**
       * 选择单条道路
       */
      var MyAction5 = L.Toolbar2.Action.extend({
        options: {
          toolbarIcon: {
            html: "道路",
            className: "ss",
            tooltip: "选择单条疏散道路",
          },
        },

        addHooks: () => {
          that.$message({
            message: "请在地图中选择道路",
            type: "warning",
          });
          drawLoad();
        },
      });

      /**
       * 添加左侧按钮
       */
      new L.Toolbar2.Control({
        position: "topleft",
        actions: [MyAction1, MyAction5, MyCustomAction, MyAction4, MyAction3],
      }).addTo(map);
    },
    /**
     * 跳转回创建页面
     */
    toCreat() {
      if (
        (this.polygonStatus != 0 && this.status != 0) ||
        (this.loadPointStatus != 0 && this.status != 0)
      ) {
        console.log("传递的参数", this.temp);
        this.$store.state.task.creat_temp = this.temp;
        this.$store.state.task.dialogFormVisible = true;
        this.$router.push({ name: "task" });
        console.log("传递的参数22", this.temp);
      } else {
        this.$message.error("区域或疏散点未选择！！！");
      }
    },
    /**
     * 创建任务
     * this.status值为-1时代表未选择任何区域及疏散点
     * this.status值为0时，代表未选择疏散点
     *  this.status值为1时，代表数据选择正确可以创建任务
     */
    creat() {
      // console.log(this.status);
      if (this.status === -1) {
        this.$message.error("请先选择区域");
      } else if (this.status === 0) {
        this.$message.error("请先选择疏散点");
      } else {
        console.log(this.temp);
        addTask(this.temp).then(() => {
          this.$notify({
            title: "成功",
            message: "新增仿真",
            type: "success",
            duration: 2000,
          });
          this.$router.push({ name: "task" });
        });
      }
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
  height: 1000px;
}
#info {
  display: block;
  position: relative;
  margin: 0px auto;
  width: 50%;
  padding: 10px;
  border: none;
  border-radius: 3px;
  font-size: 12px;
  text-align: center;
  color: #222;
  background: #fff;
}
</style>