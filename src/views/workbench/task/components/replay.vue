<template>
  <div id="map"></div>
</template>
<script>
import mapboxgl from "mapbox-gl";
export default {
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      mapboxgl.accessToken =
        "pk.eyJ1IjoiYWRpZGFzc2hlIiwiYSI6ImNrNHJzbjV1cTEyanUzamwxdDJqc3JmcDAifQ.kZSk2K7Zg2lj_CwNJ1Dskg";
      const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v9",
        center: [116.391, 39.906], // 设置地图中心
        zoom: 13, // 设置地图比例
        pitch: 45
      });
      var popup = new mapboxgl.Popup({ offset: 25 }).setText(
        "宣武门"
      );
      var marker = new mapboxgl.Marker()
        .setLngLat([116.391, 39.906])
        .setPopup(popup)
        .addTo(map);
    }
  },
  computed: {}
};
</script>
<style>
@import url("https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.2/mapbox-gl.css");
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
</style>