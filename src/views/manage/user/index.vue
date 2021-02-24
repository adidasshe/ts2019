<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="username"
        placeholder="用户名"
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
        v-if="false"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.user_id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="用户名" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.role }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" min-width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="50px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sex }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column label="单位" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.company }}</span>
        </template>
      </el-table-column>-->
      <!-- <el-table-column label="备注" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.desc }}</span>
        </template>
      </el-table-column>-->
      <el-table-column v-if="showReviewer" label="Reviewer" width="110px" align="center">
        <template slot-scope="scope">
          <span style="color:red;">{{ scope.row.reviewer }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="管理"
        align="center"
        min-width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
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
            @click="handleDelete(row,list)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination layout="prev, pager, next" :total="1"></el-pagination> -->

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
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="temp.password" />
        </el-form-item>

        <el-form-item label="权限" prop="prop">
          <el-select v-model="temp.role" class="filter-item" placeholder="请选择">
            <el-option
              v-for="item in rolesTypeOptions"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="temp.sex" class="filter-item" placeholder="请选择">
            <el-option
              v-for="item in sexTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="单位" prop="company">
          <el-input v-model="temp.company" />
        </el-form-item>
     
        <el-form-item label="备注">
          <el-input
            v-model="temp.desc"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入"
          />
        </el-form-item>-->
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
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="权限" prop="prop">
          <el-select v-model="temp.role" class="filter-item" placeholder="请选择">
            <el-option
              v-for="item in rolesTypeOptions"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="temp.sex" class="filter-item" placeholder="请选择">
            <el-option
              v-for="item in sexTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create1'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { userList, addUser, updateUser, deleteUser, getUser } from "@/api/user";
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
      username: "",
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
        { value: "user", label: "user" },
        { value: "admin", label: "admin" }
      ],
      sexTypeOptions: [
        { value: "男", label: "男" },
        { value: "女", label: "女" }
      ],
      showReviewer: false,
      temp: {
        user_id: undefined,
        username: "",
        password: "",
        role: "",
        name: "",
        sex: "",
        age: "",
        company: "",
        duty: "",
        phone: "",
        desc: "",
        data: new Date()
      },
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogStatus: "",
      textMap: {
        update: "编辑用户",
        create: "创建用户"
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        role: [{ required: true, message: "权限必须选择", trigger: "change" }],
        name: [{ required: true, message: "姓名填写", trigger: "change" }],
        username: [
          { required: true, message: "用户名必须填写", trigger: "blur" }
        ],
        password: [{ required: true, message: "密码必须填写", trigger: "blur" }]
      },
      downloadLoading: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //获取所有用户
    getList() {
      this.listLoading = true;
      //传入data解决token不及时刷新问题
      let token = this.$store.getters.token;
      userList(token).then(response => {
        // console.log("all用户接口数据", response);
        this.list = response.data;
        // this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 0.1 * 1000);
      });
    },
    handleFilter() {
      let username = this.username;
      console.log("用户名", username);
      getUser(username).then(response => {
        this.list = response.data;
      });
    },
    handleDelete(row) {
      let user_id = row.user_id;
      console.log("id", user_id);
      this.$confirm("此操作将永久删除该用户, 是否继续?", "删除用户", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteUser(user_id).then(response => {
            const index = this.list.indexOf(row);
            this.list.splice(index, 1);
            this.$notify({
              title: "成功",
              message: "删除用户",
              type: "success",
              duration: 2000
            });
          });
        })
        .catch(() => {
          this.$notify({
            title: "已取消",
            message: "删除用户",
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
        username: "",
        prop: null,
        name: "",
        sex: null,
        age: "",
        company: "",
        duty: "",
        phone: "",
        desc: ""
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
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          addUser( this.temp).then(() => {
            this.list.unshift(this.temp);
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: "添加用户",
              message: "成功",
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
      this.dialogFormVisible2 = true;
      this.$nextTick(() => {
        this.$refs["dataForm2"].clearValidate();
      });
    },
    updateData() {
      var that = this;
      this.$refs["dataForm2"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          if (tempData.role == "admin") {
            tempData.role = "admin";
          }
          if (tempData.role == "user") {
            tempData.role = "user";
          }
          if (tempData.sex == "男") {
            tempData.sex = "男";
          }
          if (tempData.sex == "女") {
            tempData.sex = "女";
          }
          updateUser(tempData).then(() => {
            this.dialogFormVisible2 = false;

            this.getList();
            this.$notify({
              title: "成功",
              message: "更新用户",
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
