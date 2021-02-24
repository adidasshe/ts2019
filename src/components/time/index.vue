 <template>
  <div class="time">{{str}}</div>
</template>
<script>
export default {
  name: "Timer",
  props: {
    total_time: {
      type: Number,
    },
    restart: {
      type: Number,
    },
  },
  data() {
    return {
      h: 0, //定义时，分，秒，毫秒并初始化为0；
      m: 0,
      s: 0,
      ms: 0,
      timer: 0, //定时器
      str: "00:00:00:00",
      times: 0, //统计共多少秒时
    };
  },
  watch: {
    restart: {
      handler(val) {
        if (val === 1) {
          this.stop();
          this.start();
        }
      },
    },
  },
  created() {
    this.times = this.total_time;
    this.timer = setInterval(this.startTimer, 50);
  },
  methods: {
    startTimer() {
      //定义计时函数
      this.ms = this.ms + 50; //毫秒
      if (this.ms >= 1000) {
        this.ms = 0;
        this.s = this.s + 1; //秒
      }
      if (this.s >= 60) {
        this.s = 0;
        this.m = this.m + 1; //分钟
      }
      if (this.m >= 60) {
        this.m = 0;
        this.h = this.h + 1; //小时
      }
      this.str =
        this.toDub(this.h) +
        ":" +
        this.toDub(this.m) +
        ":" +
        this.toDub(this.s) +
        ":" +
        this.toDub1(this.ms);
      //统计共看了多少秒
      let stopTime = this.s + this.m * 60 + this.h * 3600;
      if (stopTime === this.times) {
        this.stop();
        this.str =
          this.toDub(this.h) +
          ":" +
          this.toDub(this.m) +
          ":" +
          this.toDub(this.s);
      }
    },
    toDub(n) {
      //补0操作
      if (n < 10) {
        return "0" + n;
      } else {
        return "" + n;
      }
    },
    toDub1(n) {
      //去0操作
      n = n / 10;
      if (n === 0 || n === 5) {
        return "0" + n;
      }
      return n;
    },

    stop() {
      clearInterval(this.timer);
    },
    start() {
      this.timer = setInterval(this.startTimer, 50);
    },
  },
};
</script>
<style  scoped>
.time {
  font-size: 30px;
  color: #000;
  /* background-color: blue; */
}
</style>

