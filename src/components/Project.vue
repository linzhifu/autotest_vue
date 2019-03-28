<template>
<div>
    <!-- 添加项目 -->
    <div id="add_project">
        <el-button type="primary" @click="new_product">新建项目</el-button>
        <el-input placeholder="项目名称" v-model="proname" style="width:200px"></el-input>
        <el-input placeholder="项目描述" v-model="prodes" style="width:200px"></el-input>
        <br><br>
    </div>
    <!-- 项目列表 -->
    <el-table
     stripe
     border
     :data="projects.filter(data => !search || data.proname.toLowerCase().includes(search.toLowerCase()) || data.prodes.toLowerCase().includes(search.toLowerCase()))"
     empty-text="暂无项目"
     :header-cell-style="{background:'#ddd'}"
     highlight-current-row>
        <el-table-column label="项目名称" align="center" prop="proname">
        </el-table-column>
        <el-table-column label="项目描述" align="center" prop="prodes">
        </el-table-column>
        <el-table-column label="创建人" align="center" prop="username">
        </el-table-column>
        <el-table-column label="测试中心" align="center">
            <template slot-scope="scope">
                <el-button type="primary" @click="go_webTest(scope.row.id)" size="mini">前端</el-button>
                <el-button type="primary" @click="go_apiTest(scope.row.id)" size="mini">后端</el-button>
            </template>
        </el-table-column>
        <el-table-column align="center">
            <template slot="header" slot-scope="scope">
                <el-input v-model="search" size="mini" placeholder="输入关键字搜索"/>
            </template>
            <template slot-scope="scope">
                <el-button
                size="mini"
                type="primary"
                @click="open_edit(scope.row)" class="el-icon-edit"></el-button>
                <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete"></el-button>
            </template>
        </el-table-column>
    </el-table>
    <br>
    <div style="text-align: center;">
        <el-button type="primary" :disabled="isPreDisabled" @click="get_pre">上一页</el-button>
        <el-button type="primary" :disabled="isNextDisabled" @click="get_next">下一页</el-button>
    </div>
    <!-- 修改数据 -->
    <el-dialog :visible.sync="dialogFormVisible">
        <el-form>
            <el-form-item label="项目名称" label-width="120px">
            <el-input v-model="editObj.proname" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <el-form >
            <el-form-item label="项目描述" label-width="120px">
            <el-input v-model="editObj.prodes" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleEdit(editObj)">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
/* eslint-disable */
var user;
export default {
	name: "Project",
	data() {
		return {
            axios: this.axios,
            url: this.url,
            userID:user.data.id,
            proname: '',
            prodes: '',
            projects:[],
            search: '',
            pre:'',
            next:'',
            isNextDisabled:false,
            isPreDisabled:false,
            dialogFormVisible:false,
            editObj:{
                proname:'',
                prodes:'',
            }
		};
	},
	methods: {
        // 加载数据
        get_projects() {
            this.axios.get(this.url+'api/v1/project/').then(response=>{
                // 判断是否成功
                if (!response.data.errcode) {
                    // this.$message({
                    //     message: '加载成功',
                    //     type: 'success',
                    //     center: true,
                    //     showClose: true,
                    // });
                    this.projects=[]
                    for (var i=0;i<response.data.results.length;i++){
                        this.projects.push(response.data.results[i])
                    }
                    // 判断是否有上一页
                    this.pre=response.data.previous
                    if (!this.pre) {
                        this.isPreDisabled=true
                    }
                    else {
                        this.isPreDisabled=false
                    }
                    // 判断是否有下一页
                    this.next=response.data.next
                    if (!this.next) {
                        this.isNextDisabled=true
                    }
                    else {
                        this.isNextDisabled=false
                    }
                }
                else {
                    this.$message({
                        message: "加载失败",
                        type: 'error',
                        center: true,
                        showClose: true,
                    })
                }
            },error=>{
                this.$message({
                        message: error.response.data,
                        type: 'error',
                        center: true,
                        showClose: true,
                    })
            })
        },
        // 打开编辑
        open_edit(row) {
            this.dialogFormVisible = true
            this.editObj = row
        },
        // 编辑修改数据
        handleEdit(row) {
            this.dialogFormVisible = false
            this.axios.patch(this.url+'api/v1/project/'+row.id+'/',row).then(response=>{
                // 判断是否成功
                if (!response.data.errcode) {
                    this.$message({
                        message: '修改成功',
                        type: 'success',
                        center: true,
                        showClose: true,
                    });
                    this.get_projects()
                }
                else {
                    this.$message({
                        message: "修改失败",
                        type: 'error',
                        center: true,
                        showClose: true,
                    })
                }
            },error=>{
                this.$message({
                        message: error.response.data,
                        type: 'error',
                        center: true,
                        showClose: true,
                    })
            })
        },
        // 删除数据
        handleDelete(index, row) {
            this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
                distinguishCancelAndClose: true,
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                this.axios.delete(this.url+'api/v1/project/'+row.id+'/').then(response=>{
                    // 判断是否成功
                    if (!response.data.errcode) {
                        this.$message({
                            message: '删除成功',
                            type: 'success',
                            center: true,
                            showClose: true,
                        });
                        this.get_projects()
                    }
                    else {
                        this.$message({
                            message: "删除失败",
                            type: 'error',
                            center: true,
                            showClose: true,
                        })
                    }
                },error=>{
                    this.$message({
                            message: error.response.data,
                            type: 'error',
                            center: true,
                            showClose: true,
                        })
                })
            })
        },
        // 添加数据
        new_product() {
            var json_data = {
                    'proname': this.proname,
                    'prodes': this.prodes,
                    'user': this.userID,
                }
            this.axios.post(this.url+'api/v1/project/',json_data).then(response=>{
                // 判断是否成功
                if (!response.data.errcode) {
                    this.$message({
                        message: '新建成功',
                        type: 'success',
                        center: true,
                        showClose: true,
                    });
                    // this.projects.push(response.data.data)
                    // 重新加载数据
                    this.get_projects()
                    this.proname=''
                    this.prodes=''
                }
                else {
                    this.$message({
                        message: "新建失败",
                        type: 'error',
                        center: true,
                        showClose: true,
                    })
                }
            },error=>{
                this.$message({
                        message: error.response.data,
                        type: 'error',
                        center: true,
                        showClose: true,
                    })
            })
        },
        // 上一页
        get_pre() {
            this.axios.get(this.pre).then(response=>{
                // 判断是否成功
                if (!response.data.errcode) {
                    this.$message({
                        message: '加载成功',
                        type: 'success',
                        center: true,
                        showClose: true,
                    });
                    this.projects=[]
                    for (var i=0;i<response.data.results.length;i++){
                        this.projects.push(response.data.results[i])
                    }
                    // 判断是否有上一页
                    this.pre=response.data.previous
                    if (!this.pre) {
                        this.isPreDisabled=true
                    }
                    else {
                        this.isPreDisabled=false
                    }
                    // 判断是否有下一页
                    this.next=response.data.next
                    if (!this.next) {
                        this.isNextDisabled=true
                    }
                    else {
                        this.isNextDisabled=false
                    }
                }
                else {
                    this.$message({
                        message: "加载失败",
                        type: 'error',
                        center: true,
                        showClose: true,
                    })
                }
            },error=>{
                this.$message({
                        message: error.response.data,
                        type: 'error',
                        center: true,
                        showClose: true,
                    })
            })
        },
        // 下一页
        get_next() {
            this.axios.get(this.next).then(response=>{
                // 判断是否成功
                if (!response.data.errcode) {
                    this.$message({
                        message: '加载成功',
                        type: 'success',
                        center: true,
                        showClose: true,
                    });
                    this.projects=[]
                    for (var i=0;i<response.data.results.length;i++){
                        this.projects.push(response.data.results[i])
                    }
                    // 判断是否有上一页
                    this.pre=response.data.previous
                    if (!this.pre) {
                        this.isPreDisabled=true
                    }
                    else {
                        this.isPreDisabled=false
                    }
                    // 判断是否有下一页
                    this.next=response.data.next
                    if (!this.next) {
                        this.isNextDisabled=true
                    }
                    else {
                        this.isNextDisabled=false
                    }
                }
                else {
                    this.$message({
                        message: "加载失败",
                        type: 'error',
                        center: true,
                        showClose: true,
                    })
                }
            },error=>{
                this.$message({
                        message: error.response.data,
                        type: 'error',
                        center: true,
                        showClose: true,
                    })
            })
        },
        // 前端测试
        go_webTest(projectId) {
            var url = '/home/webManager/'+projectId
            this.$router.push({ path: url})
        },
        // 后端测试
        go_apiTest(projectId) {
            var url = '/home/apiManager/'+projectId
            this.$router.push({ path: url})
        }
    },
    beforeCreate() { 
        // 获取本地缓存最新数据user
        user = JSON.parse(window.localStorage.getItem('user'))
    },
    created() {
        this.get_projects()
    },
};
</script>

<style scoped>
</style>
