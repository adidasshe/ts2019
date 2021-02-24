<template>
  <div class="user-activity">
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="原密码" prop="password">
        <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newpwd">
        <el-input type="password" v-model="ruleForm.newpwd" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { changePass } from "@/api/user";
import { getToken, setToken, removeToken } from '@/utils/auth'
// import { mapGetters } from 'vuex'
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      }
      if (value.length < 5) {
        callback(new Error("密码长度不能小于5"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.newpwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var validatePass3 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入原密码"));
      }
      if (value.length < 5) {
        callback(new Error("密码长度不能小于5"));
      } else {
        if (this.ruleForm.password !== "") {
          // this.$refs.ruleForm.validateField("oldPass");
        }
        callback();
      }
    };
    return {
      ruleForm: {
        newpwd: "",
        checkPass: "",
        password: "",
        username: ""
      },
      rules: {
        password: [{ validator: validatePass3, trigger: "blur" }],
        newpwd: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = this.ruleForm;
          // console.log(data)
          data.username = this.$store.getters.name;
          changePass(data).then(response => {
            this.$notify({
              title: "成功",
              message: "修改密码,请重新登录",
              type: "success",
              duration: 2000
            });
            removeToken();
            this.$router.push({ name: "login" });
          });
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
