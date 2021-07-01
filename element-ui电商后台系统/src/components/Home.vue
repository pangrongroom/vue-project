<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/logo.jpg" alt="" />
        <span>电商后台管理系统</span>
      </div>

      <el-button type="info" @click="logout"> 退出</el-button></el-header
    >
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isShow ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleClick">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          :collapse="isShow"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span class="aa">{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <!-- 模板 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span class="aa">{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      //左侧菜单数据
      menulist: [],
      iconsObj: {
        125: "el-icon-s-custom",
        103: "el-icon-monitor",
        101: "el-icon-shopping-bag-1",
        102: "el-icon-shopping-cart-full",
        145: "el-icon-s-marketing",
      },
      //折叠
      isShow: false,
      //路由地址判断是否被激活
      activePath: "",
    };
  },
  created() {
    //发送网络请求
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  name: "Home",
  methods: {
    logout() {
      //点击退出清空 token  然后跳转到login界面
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    //获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg);
      }
      this.menulist = res.data;
      // console.log(res);
    },
    //切换菜单的折叠与展开
    toggleClick() {
      this.isShow = !this.isShow;
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
      // console.log(this.activePath);
    },
  },
};
</script>

<style scoped>
.home-container {
  height: 100vh;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #373d41;
  color: #333;
  text-align: center;
  /* line-height: 60px; */

  color: #fff;
  padding: 0;
  font-size: 20px;
}
.el-header div {
  display: flex;
  /* 垂直居中 */
  align-items: center;
}
.el-header img {
  width: 100px;
  height: 60px;
  border-radius: 50%;
}
.el-header span {
  margin-left: 15px;
}

.el-aside {
  background-color: #333744;
  color: #333;
  /* text-align: center; */
  /* line-height: 200px; */
}
.el-menu {
  border-right: none;
}

.el-main {
  background-color: #eaedf1;
  color: #333;
  /* text-align: center; */
  /* line-height: 160px; */
}
.aa {
  margin-left: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  /* |||的间距 */
  letter-spacing: 0.2em;
  cursor: pointer;
}

/* body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
} */
</style>