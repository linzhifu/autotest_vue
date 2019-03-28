<template>
<div>
    <a v-if="this.$route.params.projectId" href="#" @click.prevent="go_back">
        <i class="el-icon-d-arrow-left"></i>返回上一级<br><br>
    </a>
    <el-button type="primary" @click="new_webcase">添加模块</el-button>
    <el-input placeholder="请输入名称" v-model="apiname" style="width:200px"></el-input>
    <el-input placeholder="请输入描述" v-model="apides" style="width:200px"></el-input>
    <el-input placeholder="请输入URL" v-model="apiurl" style="width:200px"></el-input>
    <el-select v-if="!this.$route.params.projectId" v-model="projectId" placeholder="请选择项目">
    <el-option
        v-for="item in project_options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
        </el-option>
    </el-select>
    <br>
    <br>
    <el-table
     stripe
     border
     :data="apiManagers.filter(data => !search || data.apiname.toLowerCase().includes(search.toLowerCase()) || data.apides.toLowerCase().includes(search.toLowerCase()))"
     empty-text="暂无项目"
     :header-cell-style="{background:'#ddd'}"
     highlight-current-row>
        <el-table-column label="名称" align="center" prop="apiname">
        </el-table-column>
        <el-table-column label="描述" align="center" prop="apides">
        </el-table-column>
        <el-table-column label="URL" align="center" prop="apiurl">
        </el-table-column>
        <el-table-column label="创建人" align="center" prop="username">
        </el-table-column>
        <el-table-column label="项目" align="center" prop="proname">
        </el-table-column>
        <el-table-column label="测试案例" align="center">
            <template slot-scope="scope">
                <el-button type="primary" @click="go_apiTest(scope.row.id)" size="mini">点击进入</el-button>
            </template>
        </el-table-column>
        <el-table-column align="center">
            <template slot="header" slot-scope="scope">
                <el-input v-model="search" size="mini" placeholder="输入项目名称关键字搜索"/>
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
            <el-form-item label="名称" label-width="120px">
            <el-input v-model="editObj.apiname" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <el-form >
            <el-form-item label="描述" label-width="120px">
            <el-input v-model="editObj.apides" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <el-form >
            <el-form-item label="URL" label-width="120px">
            <el-input v-model="editObj.apiurl" autocomplete="off"></el-input>
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
    name:'ApiManager',
    data() {
        return {
            axios: this.axios,
            url: this.url,
            userID:user.data.id,
            apiname: '',
            apides: '',
            apiurl:'',
            search: '',
            apiManagers: [],
            project_options: [],
            pre:'',
            next:'',
            projectId: this.$route.params.projectId,
            isNextDisabled:false,
            isPreDisabled:false,
            dialogFormVisible:false,
            editObj:{
                apiname:'',
                apides:'',
                apiurl:'',
            }
        }
    },
    methods: {
        // 返回上一级
        go_back() {
            this.$router.back(-1)
        },
        // 获取数据列表
        get_apiManagers() {
            var url = this.url+'api/v1/apiManager/'
            if (this.$route.params.projectId) {
                url = url +'?project='+this.$route.params.projectId
            }
            this.axios.get(url).then(response=>{
                // 判断是否成功
                if (!response.data.errcode) {
                    // this.$message({
                    //     message: '加载成功',
                    //     type: 'success',
                    //     center: true,
                    //     showClose: true,
                    // });
                    this.apiManagers=[]
                    for (var i=0;i<response.data.results.length;i++){
                        if (this.$route.params.projectId) {
                            if (response.data.results[i].project ==this.$route.params.projectId) {
                                this.apiManagers.push(response.data.results[i])
                            }
                        }
                        else {
                            this.apiManagers.push(response.data.results[i])
                        }
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
            this.axios.patch(this.url+'api/v1/apiManager/'+row.id+'/',row).then(response=>{
                // 判断是否成功
                if (!response.data.errcode) {
                    this.$message({
                        message: '修改成功',
                        type: 'success',
                        center: true,
                        showClose: true,
                    });
                    this.get_apiManagers()
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
                cancelButtonText: '取消',
            }).then(() => {
                this.axios.delete(this.url+'api/v1/apiManager/'+row.id+'/').then(response=>{
                    // 判断是否成功
                    if (!response.data.errcode) {
                        this.$message({
                            message: '删除成功',
                            type: 'success',
                            center: true,
                            showClose: true,
                        });
                        this.get_apiManagers()
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
        new_webcase() {
            var json_data = {
                    'apiname': this.apiname,
                    'apides': this.apides,
                    'apiurl':this.apiurl,
                    'user': this.userID,
                    'project': this.projectId
                }
            this.axios.post(this.url+'api/v1/apiManager/',json_data).then(response=>{
                // 判断是否成功
                if (!response.data.errcode) {
                    this.$message({
                        message: '添加成功',
                        type: 'success',
                        center: true,
                        showClose: true,
                    });
                    // this.apiManagers.push(response.data.data)
                    this.get_apiManagers()
                    this.apiname=''
                    this.apides=''
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
                    this.apiManagers=[]
                    for (var i=0;i<response.data.results.length;i++){
                        this.apiManagers.push(response.data.results[i])
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
                    this.apiManagers=[]
                    for (var i=0;i<response.data.results.length;i++){
                        this.apiManagers.push(response.data.results[i])
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
        // 进入API
        go_apiTest(apiManagerId) {
            var url = '/home/apiCase/'+apiManagerId
            this.$router.push({ path: url})
        }
    },
    beforeCreate() { 
        // 获取本地缓存最新数据user
        user = JSON.parse(window.localStorage.getItem('user'))
    },
    created() {
        // 获取数据列表
        this.get_apiManagers()
        // 获取项目列表
        if (!this.$route.params.projectId) {
            this.axios.get(this.url+'api/v1/project/').then(response=>{
                // 判断是否成功
                if (!response.data.errcode) {
                    // this.$message({
                    //     message: '加载成功',
                    //     type: 'success',
                    //     center: true,
                    //     showClose: true,
                    // });
                    this.project_options=[]
                    for (var i=0;i<response.data.results.length;i++){
                        var data = {
                            "value":response.data.results[i].id,
                            "label":response.data.results[i].proname
                        }
                        this.project_options.push(data)
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
        }
    },
}
</script>

<style scoped>
</style>