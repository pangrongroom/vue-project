<template>
  <div class="foopwd">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <el-form-item prop="user1">
        <el-input type="text" placeholder="用户名" required="required" prefix-icon="el-icon-user-solid"></el-input>
      </el-form-item>
      <el-form-item prop="pass1">
        <el-input class="phone-input" placeholder="手机号/邮箱" prefix-icon="el-icon-mobile-phone"></el-input>
      </el-form-item>
      <el-form-item prop="code" class="phone" v-show="yzmshow">
        <el-input placeholder="验证码" :minlength="6" :maxlength="6"></el-input>
        <el-button type="primary" @click="getCode()" class="code-btn" :disabled="!show">
          <span v-show="show">发送验证码</span>
          <span v-show="!show" class="count">{{ count }} </span>
        </el-button>
      </el-form-item>
      <el-form-item prop="pass">
        <el-input type="password" placeholder="请输入密码" prefix-icon="el-icon-lock"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input type="password" placeholder="请再次输入密码" prefix-icon="el-icon-lock"></el-input>
      </el-form-item>
      <el-form-item class="btn-form">
        <el-button type="primary" @click="submitForm('ruleForm')">立即修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Foopwd',

  data() {
    return {}
  },

  props: [],

  components: {},

  computed: {},

  watch: {},

  filters: {},

  methods: {},

  created() {},

  mounted() {},
}
</script>

<style lang="less" scoped>
.foopwd {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 200px;
}
</style>
