<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showaddjuese = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <!-- 通过scope.row可以拿到roleList数组里面的数据 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 栅格系统布局 -->
            <el-row
              v-for="(item, i1) in scope.row.children"
              :key="item.id"
              :class="['vcenter', i1 === 0 ? 'bdtop' : '', 'bdbottom']"
            >
              <!-- 渲染一级权限的内容 -->
              <el-col :span="5">
                <el-tag closable @close="removeById(scope.row, item.id)">{{
                  item.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限的内容 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row
                  v-for="(item2, i2) in item.children"
                  :key="item2.id"
                  :class="['vcenter', i2 === 0 ? '' : 'bdtop']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      :class="[i3 === 0 ? '' : 'bdtop']"
                      type="warning"
                      closable
                      @close="removeById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{ scope.row }}</pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="bianji"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              v-model="scope.row.id"
              @click="delite(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="showaddjuese"
      width="50%"
      @close="adduser"
    >
      <!-- 内容主体区域 -->
      <el-form :model="addUser" ref="adduser" label-width="70px">
        <el-form-item label="角色名称" prop="username">
          <el-input v-model="addUser.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="password">
          <el-input v-model="addUser.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="showaddjuese = false">取 消</el-button>
        <el-button type="primary" @click="addturnUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 用树形控件 -> 展示权限数据的内容 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      //所有角色列表数据
      roleList: [],
      showaddjuese: false,
      //判断用户的表单数据
      addUser: {
        roleName: "",
        roleDesc: "",
      },
      //控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      //所有权限的数据
      rightsList: [],
      //树形控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      //默认选中的接待你id值数组
      defKeys: [],
      //当前即将分配全选角色的id
      roleId: "",
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    //获取所有角色的列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.roleList = res.data;
      // console.log(this.roleList);
    },
    //  添加角色信息
    addturnUser() {
      this.$refs.adduser.validate(async (valid) => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.post("roles", this.addUser);
        if (res.meta.status !== 201) {
          return this.$message.error("添加角色失败");
        }
        this.$message.success("添加角色成功");
        this.showaddjuese = false;
        this.getRolesList();
      });
    },
    // 删除角色信息
    delite(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .delete("roles/" + id)
            .then(() => {
              this.$message.success("删除用户成功");
              this.getRolesList();
            })
            .catch(() => {
              this.$message.error("删除用户失败");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 编辑的我占时不做了
    bianji() {
      this.$message.error("您暂时还不能对此用户编辑");
    },
    //监听关闭对话框回调函数刷新
    adduser() {
      this.$refs.adduser.resetFields();
    },
    //根据id删除对应的权限
    async removeById(role, rightid) {
      //弹框提示用户是否要删除
      const configresult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (configresult != "confirm") {
        return this.$message.info("取消了删除");
      }
      // console.log("确认了删除");
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightid}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败");
      }
      // this.getRolesList();
      //这里不能从新渲染页面的所有数据
      //只需要重新给权限赋值就行了
      role.children = res.data;
    },
    //展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id;
      //获取所有权限数据
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限数据失败!");
      }
      this.rightsList = res.data;
      // console.log(this.rightsList);
      //递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys);
      // console.log(this.defKeys);

      //点击改变显示与隐藏对话框的值
      this.setRightDialogVisible = !this.setRightDialogVisible;
    },
    //通过递归的形式获取角色下所有三级权限的id，并保存到defKeys数组中
    getLeafKeys(node, arr) {
      //不包含children属性 则是3级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      //不是则调用递归继续遍历添加
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
      // console.log(arr);
    },
    //监听分配权限对话框的关闭事件 清空数组
    setRightDialogClosed() {
      this.defKeys = [];
    },
    //点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      // console.log(keys);
      const idStr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败!");
      }
      this.$message.success("分配权限成功");
      this.getRolesList();
      this.setRightDialogVisible = false;
    },
  },
};
</script>

<style scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>