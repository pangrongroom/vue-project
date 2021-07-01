<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/logo.jpg" alt="" />
      </div>
      <!-- 登陆表单 -->
      <!-- ref是拿到实例对象 -->
      <el-form
        ref="loginformref"
        label-width="0px"
        class="login-form"
        :model="loginform"
        :rules="rules"
      >
        <!-- 用户名 -->

        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-s-custom"
            v-model="loginform.username"
          ></el-input>
        </el-form-item>

        <!-- 密码 -->

        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="loginform.password"
            type="password"
            @keyup.enter.native="loginup()"
          ></el-input>
        </el-form-item>

        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetLoginform">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      //登陆表单的数据绑定对象
      loginform: {
        username: "admin",
        password: "123456",
      },
      //验证规则对象
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入登陆密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //键盘事件 手动调用点击事件
    loginup() {
      // console.log("ss");
      this.login();
    },
    //点击重置表单
    resetLoginform() {
      // console.log(this);
      this.$refs.loginformref.resetFields();
    },
    login() {
      //加了 async 和 await 修饰之后 返回的就是对象 不加的话就会返回一个promise
      //给表单绑定ref 之后使用$refs 拿到这个表单
      //validate对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise
      //参数Function(callback: Function(boolean, object))
      this.$refs.loginformref.validate(async (valid) => {
        //判断如果用户输入的用户名和密码的格式是否正确在就直接返回
        // valid会返回一个boolean值
        if (!valid) {
          return;
        }
        //用户名存在就发送网络请求，拿到用户的数据
        //解构出来data
        const { data: res } = await this.$http.post("login", this.loginform);
        //在数据库中寻找有没有这个用户
        if (res.meta.status !== 200) {
          return this.$message.error("登陆失败");
          // console.log('登陆失败');
        }
        //   console.log('登陆成功');
        this.$message.success("登陆成功");
        //1.将登陆成功之后的 token,保存到客户端的sessionStorage中
        //1.1项目中除了登录接口以外的其他api接口，必须在登陆之后才能访问
        //1.2 token 直在当前网站打开期间生效，所以将token 保存在sessionStorage中
        //  console.log(res);
        window.sessionStorage.setItem("token", res.data.token);
        //2.通过路由导航跳转到后台主页，路由地址是 /home
        this.$router.push("/home");
      });
    },
  },
};
</script>

<style Lang="less" scoped>
.login_container {
  /* background-color: #2d4d6d;
   */
  background: url(~assets/666.jpg);
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  /* 下阴影 */
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}
.avatar_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  /* c3盒子模型 */
  box-sizing: border-box;
}
</style>

