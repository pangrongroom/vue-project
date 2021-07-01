<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showaddCate">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        class="treeTable"
      >
        <!-- 是否有效模板列 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序模板列 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作模板列 -->
        <template slot="opt">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showbianji"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="shanchu"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <!-- prop验证规则 -->
        <el-form-item label="分类名称 :" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类 :">
          <!-- options用来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <el-cascader
            :props="cascaderProps"
            v-model="selectedKeys"
            :options="parentCateList"
            expandTrigger="hover"
            @change="parentCateChanged"
            class="parent"
            clearable
            props.checkStrictly="true"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑的对话框 -->
    <el-dialog title="编辑" :visible.sync="bianjiDialogVisible" width="50%">
      <span>编辑功能还没做好！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bianjiDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="bianjiDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Cate",
  data() {
    return {
      //商品分类的数据列表
      cateList: [],
      //总数据条数
      total: 0,
      //查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //为table指定列的定义
      columns: [
        //第一列
        {
          label: "分类名称",
          prop: "cat_name",
        },
        //第2列
        {
          label: "是否有效",
          //表示，将这个列定义为模板列
          type: "template",
          //表示当前这一列使用的模板名称
          template: "isok",
        },
        //第3列
        {
          label: "排序",
          //表示，将这个列定义为模板列
          type: "template",
          //表示当前这一列使用的模板名称
          template: "order",
        },
        //第4列
        {
          label: "操作",
          //表示，将这个列定义为模板列
          type: "template",
          //表示当前这一列使用的模板名称
          template: "opt",
        },
      ],
      //控制对话框的显示与隐藏
      addCateDialogVisible: false,
      //添加分类的表单数据对象
      addCateForm: {
        //将要添加的分类的名称
        cat_name: "",
        //分级分类id
        cat_pid: 0,
        //分类的等级，默认添加一级分类
        cat_level: 0,
      },
      //添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类的名称", trigger: "blur" },
        ],
      },
      //存放父级分类的列表数据
      parentCateList: [],
      //指定级联选择器的配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //选中的父级分类的ID数组
      selectedKeys: [],
      //编辑对话框的显示与隐藏值
      bianjiDialogVisible: false,
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //获取商品分类数据的获取
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.querInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败");
      }
      //   console.log(res.data);
      //把数据列表赋值给cateList
      this.cateList = res.data.result;
      //为总数据条数赋值
      this.total = res.data.total;
    },
    //监听 pagesize改变
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize;
      this.getCateList();
    },
    //监听pagenum 的改变
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage;
      this.getCateList();
    },
    //点击显示添加分类的对话框
    showaddCate() {
      //弹出对话框之前先发送请求获分级分类取到数据列表的数据
      this.getParentCateList();
      this.addCateDialogVisible = !this.addCateDialogVisible;
    },
    //获取分级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类数据失败");
      }
      //   console.log(res.data);
      this.parentCateList = res.data;
    },
    //选择项发生变化触发这个函数
    parentCateChanged() {
      //   console.log(this.selectedKeys);
      //如果 selectedKeys数组中的length 大于0，说明选中
      //反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        //父级分类的id
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1];
        //为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        this.addCateForm.cat_pid = 0;
        //为当前分类的等级赋值
        this.addCateForm.cat_level = 0;
      }
    },
    //点击按钮添加新的分类值
    addCate() {
      //   console.log(this.addCateForm);
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加分类失败");
        }
        this.$message.success("添加分类成功");
        this.getCateList();
        this.addCateDialogVisible = !this.addCateDialogVisible;
      });
    },
    //监听堆话框的关闭事件，重置表单的数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },
    //点击编辑的对话框显示
    showbianji() {
      this.bianjiDialogVisible = !this.bianjiDialogVisible;
    },
    //删除功能
    shanchu() {
      this.$message.error("删除失败,此分类不能删除");
    },
  },
};
</script>

<style scoped>
.treeTable {
  margin-top: 15px;
}
.parent {
  width: 100%;
}
</style>