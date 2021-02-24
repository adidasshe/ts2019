<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="name"
        placeholder="任务名"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
        >搜索任务</el-button
      >
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
        >新建任务</el-button
      >
      <!-- <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>-->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
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

      <el-table-column label="任务名" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.task_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="摘要" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.detail }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务状态" min-width="50px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="任务回放"
        align="center"
        min-width="50"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            size="mini"
            v-if="row.status === '未完成'"
            @click="realTime(row)"
            >实时</el-button
          >
          <el-button
            type="success"
            size="mini"
            v-if="row.status === '已完成'"
            @click="replay(row)"
            >回放</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="创建人" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{
            scope.row.create_time | parseTime("{y}-{m}-{d} {h}:{i}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="任务结果"
        align="center"
        min-width="150"
        width="150"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            size="mini"
            type="success"
            v-if="row.status === '已完成'"
            @click="handleResult(row)"
            >查看</el-button
          >
        </template>
      </el-table-column>

      <el-table-column
        label="管理"
        align="center"
        min-width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            size="mini"
            title="编辑"
            type="primary"
            icon="el-icon-edit"
            circle
            @click="handleUpdate(row)"
          ></el-button>
          <el-button
            size="mini"
            type="danger"
            title="删除"
            icon="el-icon-delete"
            circle
            @click="handleDelete(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="total, sizes,prev, pager, next,jumper"
      :current-page.sync="listQuery.pageNum"
      :page-size="listQuery.pageSize"
      :page-sizes="[10, 15, 20]"
      :total="total"
    ></el-pagination>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="130px"
        style="width: 400px; margin-left: 50px"
        size="mini"
      >
        <el-form-item label="任务名称" prop="task_name">
          <el-input v-model="temp.task_name" placeholder="任务名"></el-input>
        </el-form-item>
        <el-form-item label="区域车辆数量" prop="carnums">
          <el-input v-model="temp.carnums" placeholder="数量"></el-input>
        </el-form-item>
        <el-form-item label="设置区域">
          <el-input v-model="temp.maxLon" placeholder="最大经度"></el-input>
          <el-input v-model="temp.maxLat" placeholder="最大纬度"></el-input>
          <el-input v-model="temp.minLon" placeholder="最小经度"></el-input>
          <el-input v-model="temp.minLat" placeholder="最小纬度"></el-input>
        </el-form-item>
        <!-- <el-form-item label="设置目的地">
          <el-input v-model="temp.dest" placeholder="经纬度"></el-input>
        </el-form-item>-->
        <el-form-item label="道路">
          <el-input v-model="temp.source" placeholder=""></el-input>
          <el-input v-model="temp.target" placeholder=""></el-input>
        </el-form-item>
        <el-form-item
          v-for="(dest, index) in temp.dest"
          :label="'疏散点: ' + (index + 1)"
          :key="dest.key"
        >
          <el-input v-model="dest[1]" placeholder="经度"></el-input>
          <el-input v-model="dest[0]" placeholder="纬度"></el-input>
          <el-button @click.prevent="removeEp(dest)">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="addEp">添加疏散点</el-button>
          <el-button type="info" @click="mapSelect" icon="el-icon-search"
            >地图选取坐标</el-button
          >
        </el-form-item>
        <el-form-item label="选择模型">
          <el-select v-model="temp.model" placeholder="请选择模型">
            <el-option label="模型一" value="shanghai"></el-option>
            <el-option label="模型二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="摘要">
          <el-input v-model="temp.detail" placeholder="具体描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogUpdate" title="编辑任务">
      <el-form
        ref="dataForm2"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="任务名" prop="task_name">
          <el-input v-model="temp.task_name" />
        </el-form-item>
        <el-form-item label="摘要">
          <el-input v-model="temp.detail" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdate = false">取消</el-button>
        <el-button type="primary" @click="updateTask()">确定</el-button>
      </div>
    </el-dialog>
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
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import Bus from "@/utils/bus.js";

const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
};

export default {
  name: "ComplexTable",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      data: {
        task_name: "",
        carnums: "",
      },
      fileList: [],
      name: "",
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: Object.assign({}, defaultListQuery),
      rolesTypeOptions: [
        { value: "2", label: "user" },
        { value: "1", label: "admin" },
        { value: "0", label: "superAdmin" },
      ],
      sexTypeOptions: [
        { value: "1", label: "男" },
        { value: "0", label: "女" },
      ],
      showReviewer: false,
      sizeForm: {
        task_name: "",
        carnums: "",
        model: "",
        status: 0,
        // desc: "",
        username: "",
        maxLon: "",
        maxLat: "",
        minLon: "",
        minLat: "",
      },
      temp: {
        task_name: "",
        carnums: "",
        model: "",
        detail: "",
        dest: [],
        username: "",
        maxLon: "",
        maxLat: "",
        minLon: "",
        minLat: "",
        source: "",
        target: "",
      },
      dialogFormVisible: false,
      dialogUpdate: false,
      dialogStatus: "",
      textMap: {
        update: "回放",
        create: "新建任务",
        version: "升级设备",
      },
      rules: {
        task_name: [
          { required: true, message: "任务名必须填写", trigger: "change" },
        ],
        carnums: [{ required: true, message: "区域车辆数", trigger: "change" }],
        maxLon: [{ required: true, message: "区域经纬度", trigger: "change" }],
        dest: [
          { required: true, message: "疏散点必须填写", trigger: "change" },
        ],
      },
      downloadLoading: false,
    };
  },
  created() {
    this.getList();
    if (this.$store.state.task.dialogFormVisible) {
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.temp = this.$store.state.task.creat_temp;
    }
  },

  methods: {
    /**
     * 点击任务结果
     */
    handleResult(row) {
      this.$router.push({ name: "result", params: { task_id: row.task_id } });
      // console.log(row.task_id);
    },
    /**
     * 地图选取区域、目的地及疏散点经纬度信息
     */
    mapSelect() {
      // console.log(this.temp.carnums);
      if (this.temp.task_name != "" && this.temp.carnums != "") {
        //任务名、车数量存入vuex，便于下个组件调用
        this.$store.commit("task/SET_TASK_NAME", this.temp.task_name);
        this.$store.commit("task/SET_CARNUMS", this.temp.carnums);
        //跳转到选取坐标页面
        this.$router.push({ name: "mapSelect" });
      } else {
        this.$message({
          message: "请填写任务名及区域车辆数",
          type: "warning",
        });
      }
    },
    /**
     * 获取任务列表
     */
    getList() {
      this.listLoading = true;
      taskList(this.listQuery).then((response) => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },

    /**
     * 搜索任务
     */
    handleFilter() {
      let task_name = this.name;
      // console.log(name)
      getTask(task_name).then((response) => {
        this.list = response.data;
      });
    },

    /**
     * 删除任务
     */
    handleDelete(row) {
      let task_id = row.task_id;
      // console.log(id);
      this.$confirm("是否要删除该任务?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteTask(task_id).then((response) => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getList();
        });
      });
    },

    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    /**
     * 创建任务预处理
     */
    handleCreate() {
      this.temp.task_name = "";
      this.temp.carnums = "";
      this.temp.model = "";
      this.temp.detail = "";
      this.temp.dest = [];
      this.temp.username = "";
      this.temp.maxLon = "";
      this.temp.maxLat = "";
      this.temp.minLon = "";
      this.temp.minLat = "";
      this.temp.source = "";
      this.temp.target = "";
      this.temp.username = this.$store.getters.name;
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    /**
     * 创建任务
     */
    createData() {
      this.getList();
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          //判断区域或者道路是否有数据
          console.log("检查道路");
          if (this.temp.maxLon == "" && this.temp.source == "") {
            this.$message({
              message: "请选择疏散区域或者道路",
              type: "warning",
            });
          } else {
            console.log("检查dest");
            if (this.temp.dest.length != 0) {
              console.log("目的地", this.temp),
                addTask(this.temp).then(() => {
                  this.getList();
                  // this.list.unshift(this.temp);
                  this.dialogFormVisible = false;
                  this.$notify({
                    title: "成功",
                    message: "新增仿真",
                    type: "success",
                    duration: 2000,
                  });
                  this.$store.state.task.dialogFormVisible = false;
                });
              this.getList();
            } else {
              this.$message({
                message: "请添加疏散点",
                type: "warning",
              });
            }
          }
        }
      });
    },
    /**
     * 任务回放
     */
    replay(row) {
      var task_id = row.task_id;
      if (row.status != "已完成") {
        this.$message.error("此任务正在计算");
      } else {
        this.listLoading = true;
        replay(task_id).then((res) => {
          // console.log(res.data);
          this.$router.push({
            name: "replay",
            params: {
              total_time: res.total_time,
              task_id: task_id,
              points: res.points,
              data: res.data,
            },
          });
        });
      }
    },
    /**
     * 修改任务预处理
     */
    handleUpdate(row) {
      this.temp = Object.assign({}, row);
      // this.temp.detail = row.desc;
      this.dialogUpdate = true;
      // console.log(this.temp);
    },
    /**
     * 修改任务
     */
    updateTask() {
      // this.temp.detail = this.temp.desc;
      // console.log(this.temp);
      updateTask(this.temp).then((response) => {
        this.$message({
          type: "success",
          message: "修改成功!",
        });
        this.dialogUpdate = false;
        this.getList();
      });
    },
    /**
     * 实时回放
     */
    realTime(row) {
      var task_id = row.task_id;
      if (row.status != "未完成") {
        this.$message.error("此任务已完成");
      } else {
        this.$store.state.task.task_id = row.task_id;
        this.$router.push({
          name: "realTime",
          params: {
            task_id: task_id, 
          },
        });
      }
    },
    /**
     * 分页操作
     */
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    /**
     *
     */
    removeEp(item) {
      var index = this.temp.dest.indexOf(item);
      if (index !== -1) {
        this.temp.dest.splice(index, 1);
      }
    },
    addEp() {
      this.temp.dest.push({
        value: "",
        // key: Date.now()
      });
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}`
        ? "ascending"
        : sort === `-${key}`
        ? "descending"
        : "";
    },
  },
};
</script>