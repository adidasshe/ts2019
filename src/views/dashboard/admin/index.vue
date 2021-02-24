<template>
  <div id="map">
    <!-- <div class="eve">
      <div class="eve-face">
        <div class="eve-skin">
          <div class="left-eye">
            <div class="pupil"></div>
          </div>
          <div class="right-eye">
            <div class="pupil"></div>
          </div>
        </div>
      </div>
      <div class="eve-body"></div>
      <div class="eve-left-hand"></div>
      <div class="eve-right-hand"></div>
    </div> -->
  </div>
</template>
 
<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default {
  name: "mLeaflet",
  data() {
    return {
      // mapUrl:"http://bigdata5/osm_tiles/{z}/{x}/{y}.png"
      mapUrl:"http://openstreetmap/osm_tiles/{z}/{x}/{y}.png"
    };
  },
  methods: {
    init() {
      var map = L.map("map", {
        minZoom: 3,
        maxZoom: 17,
        center: [39.550339, 116.114129],
        zoom: 3,
        zoomControl: false,
        attributionControl: false,
        crs: L.CRS.EPSG3857
      });

      L.tileLayer(this.mapUrl, {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      //监听鼠标点击事件，弹出经纬度
      function onMapClick(e) {
        L.popup()
          .setLatLng(e.latlng)
          .setContent("经纬度: " + e.latlng.toString())
          .openOn(map);
      }
      map.on("click", onMapClick);
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style  scoped>
#map {
  width: 100%;
  height: 1000px;
}
:root{
  --background:#1c2541;
  --face-color:#fff;
}
body{
  background:var(--background);
  margin:100px;
  display:flex;
  justify-content:center;
  align-items:center;
  
}

.eve{
  position:relative;
  display:flex;
  justify-content:center; 
  width:250px;
  height:400px;
  border:1px solid transparent; 
  animation: motion 2s infinite;
  
  
}
.eve-face{
  position:absolute;
  display:flex;
  justify-content:center;
  align-items:center;
  width:90px;
  height:70px;
  top:60px;
  background:var(--face-color);
  border-radius:100px 100px 45px 45px; 
  box-shadow:10px 5px 6px grey inset;
}
.eve-skin{
  postion:absolute;
  width:80px;
  height:55px;
  background:#000;
  border-radius:100px 100px 70px 70px;
  
}
.left-eye{
  position:absolute;
  top:30px;
  left:20px;
  width:20px;
  height:12px;
  background:#067FE2;
/*   border-radius:100px 100px 50px 50px; */
  clip-path: ellipse(50% 45% at 50% 50%);
  animation:eyeblink 2s infinite;
  
  
}
.right-eye{
  position:absolute;
  top:30px;
  right:20px;
  width:20px;
  height:12px;
  background:#067FE2;
/*   border-radius:100px 100px 50px 50px; */
  clip-path: ellipse(50% 45% at 50% 50%);
  animation:eyeblink 2s infinite;
}
.left-eye .pupil{
  position:absolute;
  top:4px;
  left:5px;
  width:10px;
  height:4px;
  background:#fff;
  opacity:0.6;
  border-radius:50%;
}

.right-eye .pupil{
  position:absolute;
  top:4px;
  right:5px;
  width:10px;
  height:4px;
  background:#fff;
  opacity:0.6;
  border-radius:50%;
}

/* .eve-body{
  position:absolute;
  top:140px;
  width:95px;
  height:200px;
  background:#fff;
  
  
} */
.eve-body{
  position: absolute;
  top: 140px;
  background:#fff;
  width: 95px;
  height: 200px;
  clip-path: ellipse(50% 100% at 50% 100%);
  transform:rotate(180deg);
  overflow: hidden;
  box-shadow:-50px 3px 8px inset grey;
}
.eve-left-hand{
  position:absolute;
  width:60px;
  height:140px;
  top:140px;
  right:165px;
  background:#fff;
  transform:rotate(185deg);
  clip-path: ellipse(25% 50% at 50% 50%);
  box-shadow:28px 3px 6px inset grey;
  
  
}
.eve-right-hand{
  position:absolute;
  width:60px;
  height:140px;
  top:140px;
  left:165px;
  background:#fff;
  transform:rotate(-185deg);
  clip-path: ellipse(25% 50% at 50% 50%);
  box-shadow:-28px 3px 6px inset grey;
  
}
@keyframes motion{
  0%{transform:translateY(0px);}
  50%{transform:translateY(-60px);}
 }

@keyframes eyeblink{
   0%,30%,35%,100% {
        transform: scale(1);
    }
    33%,34% {
        transform: scale(1, 0);
    }

}
</style>
