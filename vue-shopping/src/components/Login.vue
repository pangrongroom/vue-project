<template>
  <div class="login">
    <!-- form表单 -->
    <div class="form-wrap">
      <!-- logo图片 -->
      <div class="logo-wrap">
        <img src="../assets/logo1.jpg" alt="" />
      </div>
      <!-- 登录表单 -->
      <el-form :model="loginFormModel" ref="loginFormRef" label-width="100px" class="login-form">
        <el-form-item label="用户：" prop="username">
          <el-input v-model="loginFormModel.username" prefix-icon="el-icon-user " placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input placeholder="请输入密码" v-model="loginFormModel.password"  prefix-icon="el-icon-view" type="password"></el-input>
        </el-form-item>
        <el-form-item label=" " class="btns">
          <el-button
            type="primary"
            @click="login"
            icon="el-icon-s-promotion
"
            >登录</el-button
          >
          <el-button @click="resetForm" icon="el-icon-edit-outline" type="danger">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import request from '../utils/request.js'
export default {
  name: '',
  data() {
    return {
      //登录用户的参数
      loginFormModel: {
        username: 'admin',
        password: '123456',

      },
    }
  },
  methods: {
    login() {
      let _this = this

      //验证表单
      let form = this.$refs['loginFormRef']
      form.validate(async function (valid) {
        console.log(valid)
        //错误的验证结果
        if (!valid) {
          return _this.$message.error('错误的用户名或密码')
        }
        //执行登录操作
        let res = await request({ url: 'login', type: 'post', data: _this.loginFormModel })
        console.log(res)
        _this.$message.success('登录成功')
        //保存数据到sessionStorage中
        sessionStorage.setItem('user-login', JSON.stringify(res))
        //跳转
        _this.$router.push('/home')
      })
    },
    //重置
    resetForm() {
      let form = this.$refs['loginFormRef']
      //清空验证消息
      form.resetFields()
      //清空用户名和密码
      this.$nextTick(function () {
        this.loginFormModel.username = ''
        this.loginFormModel.password = ''
      })
    },
  },
}
</script>

<style lang="less" scoped>
.login {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #2c3e50;

  .form-wrap {
    background-color: #ffffff;
    width: 5rem;
    height: 3.2rem;
    border-radius: 0.1rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .logo-wrap {
      width: 1.5rem;
      height: 1.5rem;
      background-color: #ffffff;
      border-radius: 50%;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      img {
        width: 100%;
        background-color: #5f9ea0;
        border-radius: 50%;
      }
    }

    .el-form {
      bottom: 0;
      position: absolute;
      width: 100%;
      left: 0;
      padding-right: 0.3rem;
      .btns {
        text-align: right;
      }
    }
  }
}
</style>
