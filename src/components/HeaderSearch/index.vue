<template>
  <div :class="{'show':show}" class="header-search">
    <svg-icon class-name="search-icon" icon-class="search" @click.stop="click" />
    <el-select
      ref="headerSearchSelect"
      v-model="name"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="搜索设备名"
      class="header-search-select"
      @change="change"
    >
      <el-option
        v-for="item in options"
        :key="item.device_id"
        :value="item.device_id"
        :label="item.device_name"
      />
    </el-select>
  </div>
</template>

<script>
import { getDeviceId } from "@/api/device";
// import { mapMutations } from 'vuex'
export default {
  Sname: "HeaderSearch",
  data() {
    return {
      name: [],
      options: [],
      show: false,
      fuse: undefined,
      loading: false
    };
  },
  computed: {},
  watch: {
    show(value) {
      if (value) {
        document.body.addEventListener("click", this.close);
      } else {
        document.body.removeEventListener("click", this.close);
      }
    }
  },
  mounted() {},
  methods: {
    click() {
      this.show = !this.show;
      if (this.show) {
        this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.focus();
      }
    },
    close() {
      this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.blur();
      this.options = [];
      this.show = false;
    },
    change(val) {
      //把选中的设备ID保存到VUEX
      // this.$store.dispatch("user/deviceId", val);
      this.$store.commit("user/SET_DEVICE_ID", val);
      // console.log(this.$route.name);
      let name = this.$route.name;
      //如果当前页面不是三相数据显示页面，跳转到三相信息界面
      if (name != "control" && name != "roads") {
        this.$router.push({ name: "phase" });
      }

      // this.$router.push('/workbench/workbench/phase')
      this.name = "";
      // this.options = [];
      this.$nextTick(() => {
        this.show = false;
      });
    },
    // 搜索设备名
    querySearch(query) {
      if (query !== "") {
        // console.log(query);
        this.loading = true;
        let name = query
        getDeviceId(name)
          .then(res => {
            this.options = res.data;
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        this.options = [];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    /deep/ .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
