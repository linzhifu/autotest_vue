<template>
<div>
    <a v-if="this.$route.params.projectId" href="#" @click.prevent="go_back">
        <i class="el-icon-d-arrow-left"></i>返回上一级<br><br>
    </a>
    <el-button type="primary" @click="new_webcase">添加测试</el-button>
    <el-input placeholder="请输入名称" v-model="webname" style="width:200px"></el-input>
    <el-input placeholder="请输入描述" v-model="webdes" style="width:200px"></el-input>
    <el-select v-if="!this.$route.params.projectId" v-model="projectId" placeholder="请选择">
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
     :data="webManagers.filter(data => !search || data.webname.toLowerCase().includes(search.toLowerCase()) || data.webdes.toLowerCase().includes(search.toLowerCase()))"
     empty-text="暂无项目"
     :header-cell-style="{background:'#ddd'}"
     highlight-current-row>
        <el-table-column label="名称" align="center" prop="webname">
        </el-table-column>
        <el-table-column label="描述" align="center" prop="webdes">
        </el-table-column>
        <el-table-column label="URL" align="center" prop="weburl">
        </el-table-column>
        <el-table-column label="创建人" align="center" prop="username">
        </el-table-column>
        <el-table-column label="项目" align="center" prop="proname">
        </el-table-column>
        <el-table-column label="测试案例" align="center">
            <template slot-scope="scope">
                <el-button type="primary" @click="go_webTest(scope.row.id)" size="mini">点击进入</el-button>
            </template>
        </el-table-column>
        <el-table-column align="center">
            <template slot="header" slot-scope="scope">
                <el-input v-model="search" size="mini" placeholder="输入名称关键字搜索"/>
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
            <el-input v-model="editObj.webname" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <el-form >
            <el-form-item label="描述" label-width="120px">
            <el-input v-model="editObj.webdes" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <el-form >
            <el-form-item label="URL" label-width="120px">
            <el-input v-model="editObj.weburl" autocomplete="off"></el-input>
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
    name:'WebManager',
    data() {
        return {
            axios: this.axios,
            url: this.url,
            userID:user.data.id,
            webname: '',
            webdes: '',
            search: '',
            webManagers: [],
            project_options: [],
            pre:'',
            next:'',
            isNextDisabled:false,
            isPreDisabled:false,
            projectId: this.$route.params.projectId,
            dialogFormVisible:false,
            editObj:{
                webname:'',
                webdes:'',
            }
        }
    },
    methods: {
        // 返回上一级
        go_back() {
            this.$router.back(-1)
        },
        // 获取数据
        get_webManagers() {
            var url = this.url+'api/v1/webManager/'
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
                    this.webManagers=[]
                    for (var i=0;i<response.data.results.length;i++){
                        this.webManagers.push(response.data.results[i])
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
            this.axios.patch(this.url+'api/v1/webManager/'+row.id+'/',row).then(response=>{
                // 判断是否成功
                if (!response.data.errcode) {
                    this.$message({
                        message: '修改成功',
                        type: 'success',
                        center: true,
                        showClose: true,
                    });
                    this.get_webManagers()
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
                this.axios.delete(this.url+'api/v1/webManager/'+row.id+'/').then(response=>{
                    // 判断是否成功
                    if (!response.data.errcode) {
                        this.$message({
                            message: '删除成功',
                            type: 'success',
                            center: true,
                            showClose: true,
                        });
                        this.get_webManagers()
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
                    'webname': this.webname,
                    'webdes': this.webdes,
                    'user': this.userID,
                    'project': this.projectId
                }
            this.axios.post(this.url+'api/v1/webManager/',json_data).then(response=>{
                // 判断是否成功
                if (!response.data.errcode) {
                    this.$message({
                        message: '添加成功',
                        type: 'success',
                        center: true,
                        showClose: true,
                    });
                    // this.webManagers.push(response.data.data)
                    this.get_webManagers()
                    this.webname=''
                    this.webdes=''
                }
                else {
                    this.$message({
                        message: "添加失败",
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
                    this.webManagers=[]
                    for (var i=0;i<response.data.results.length;i++){
                        this.webManagers.push(response.data.results[i])
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
                    this.webManagers=[]
                    for (var i=0;i<response.data.results.length;i++){
                        this.webManagers.push(response.data.results[i])
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
        // 进入前端测试案例
        go_webTest(webManagerId) {
            var url = '/home/webCase/'+webManagerId
            this.$router.push({ path: url})
        }
    },
    beforeCreate() { 
        // 获取本地缓存最新数据user
        user = JSON.parse(window.localStorage.getItem('user'))
    },
    created() {
        this.get_webManagers()
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
    }
}
</script>

<style scoped>
</style>