<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="name"
        placeholder="设备名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
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
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日期" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.date | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备ID" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.device_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备名" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.device_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="经度" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.longitude }}</span>
        </template>
      </el-table-column>
      <el-table-column label="纬度" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.latitude }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备地址" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备描述" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.device_desc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备版本" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.soft_version }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="管理"
        align="center"
        min-width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,list)">删除</el-button>
          <el-button size="mini" type="warning" @click="handleVersion(row)">升级</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="设备ID" prop="device_id">
          <el-input v-model="temp.device_id" />
        </el-form-item>
        <el-form-item label="设备名" prop="device_name">
          <el-input v-model="temp.device_name" />
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="temp.longitude" />
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="temp.latitude" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="temp.address" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="temp.device_desc"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible2">
      <el-form
        ref="dataForm2"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="50px"
        style="width: 200px; margin-left:50px;"
      >
        <el-upload
          class="upload-demo"
          drag
          action="https://jsonplaceholder.typicode.com/posts/"
          multiple
          :file-list="fileList"
        >
          >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">
            1.请选择正确的.bin文件
            <br />
            <br />2.点击确定刷入升级包
          </div>
        </el-upload>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取消</el-button>
        <el-button type="primary" @click="updateVersion">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  deviceList,
  addDevice,
  updateDevice,
  deleteDevice,
  getDevice
} from "@/api/device";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "ComplexTable",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      fileList:[],
      name: "",
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: "+id"
      },
      rolesTypeOptions: [
        { value: "2", label: "user" },
        { value: "1", label: "admin" },
        { value: "0", label: "superAdmin" }
      ],
      sexTypeOptions: [
        { value: "1", label: "男" },
        { value: "0", label: "女" }
      ],
      showReviewer: false,
      temp: {
        id: undefined,
        device_id: "",
        device_name: "",
        device_desc: "",
        longitude: null,
        latitude: null,
        address: "",
        soft_version: "",
        data: new Date()
      },
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogStatus: "",
      textMap: {
        update: "编辑设备",
        create: "创建设备",
        version: "升级设备"
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        device_id: [
          { required: true, message: "设备ID必须填写", trigger: "change" }
        ],
        device_name: [
          { required: true, message: "设备名称必须填写", trigger: "change" }
        ],
        longitude: [
          { required: true, message: "设备纬度必须填写", trigger: "change" }
        ],
        latitude: [
          { required: true, message: "设备经度必须填写", trigger: "change" }
        ]
      },
      downloadLoading: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    updateVersion() {
      //版本升级
    },
    getList() {
      this.listLoading = true;
      //传入data解决token不及时刷新问题
      let token = this.$store.getters.token;
      deviceList(token).then(response => {
        this.list = response.data;
        // this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 0.1 * 1000);
      });
    },
    handleFilter() {
      let name = this.name;
      // console.log(name)
      getDevice(name).then(response => {
        this.list = response.data;
      });
    },
    handleDelete(row) {
      let id = row.id;
      console.log(id);
      this.$confirm("此操作将永久删除该设备, 是否继续?", "删除设备", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteDevice(id).then(response => {
            const index = this.list.indexOf(row);
            this.list.splice(index, 1);
            this.$notify({
              title: "成功",
              message: "删除设备",
              type: "success",
              duration: 2000
            });
          });
        })
        .catch(() => {
          this.$notify({
            title: "已取消",
            message: "删除设备",
            type: "info",
            duration: 2000
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
    resetTemp() {
      this.temp = {
        device_id: "",
        device_name: "",
        device_desc: "",
        longitude: null,
        latitude: null,
        address: ""
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleVersion() {
      this.resetTemp();
      this.dialogStatus = "version";
      this.dialogFormVisible2 = true;
      this.$nextTick(() => {
        this.$refs["dataForm2"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          addDevice(this.temp).then(() => {
            this.list.unshift(this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "添加设备",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.temp.date = new Date(this.temp.timestamp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          updateDevice(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v);
                this.list.splice(index, 1, this.temp);
                break;
              }
            }
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "更新设备",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}`
        ? "ascending"
        : sort === `-${key}`
        ? "descending"
        : "";
    }
  }
};
</script>
