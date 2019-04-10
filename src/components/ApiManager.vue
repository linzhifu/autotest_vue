<template>
<div>
    <!-- 返回上一级 -->
    <a v-if="this.$route.query.projectId" href="#" @click.prevent="go_back">
        <i class="el-icon-d-arrow-left"></i>返回上一级<br><br>
    </a>
    <!-- 添加API -->
    <div>
        <el-button type="primary" @click="new_webcase">添加模块</el-button>
        <el-input placeholder="请输入名称" v-model="apiname" style="width:200px"></el-input>
        <el-input placeholder="请输入描述" v-model="apides" style="width:200px"></el-input>
        <el-input placeholder="请输入URL" v-model="apiurl" style="width:200px"></el-input>
        <el-select v-if="!this.$route.query.projectId" v-model="projectId" placeholder="请选择项目">
        <el-option
            v-for="item in project_options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        <el-button v-if="this.$route.query.projectId" type="primary" @click="apiManagerTest" style="float: right;" :loading="loading">{{testBtn}}</el-button>
        <br><br>
    </div>
    <!-- API列表 -->
    <el-table
     stripe
     border
     :data="apiManagers.filter(data => !search || data.apiname.toLowerCase().includes(search.toLowerCase()) || data.apides.toLowerCase().includes(search.toLowerCase()))"
     empty-text="暂无项目"
     :header-cell-style="{background:'#ddd'}"
     highlight-current-row>
        <el-table-column label="名称" align="center">
            <template slot-scope="scope">
                <a href="#" @click.prevent="go_apiTest(scope.row)">
                    <p>{{scope.row.apiname}}</p>
                </a>
            </template>
        </el-table-column>
        <el-table-column label="描述" align="center" prop="apides">
        </el-table-column>
        <el-table-column label="URL" align="center" prop="apiurl">
        </el-table-column>
        <el-table-column label="项目" align="center" prop="proname">
        </el-table-column>
        <el-table-column label="测试结果" align="center" prop="result">
            <template slot-scope="scope">
                <p v-if="scope.row.result" style="color:green">PASS</p>
                <p v-else style="color:red">FAIL</p>
            </template>
        </el-table-column>
        <el-table-column label="最近修改" align="center" prop="update_time">
            <template slot-scope="scope">
                <p>{{scope.row.update_time|dateFormat}}</p>
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
    <!-- 翻页 -->
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
            userId: this.storage.getItem('userId'),
            token: this.storage.getItem('token'),
            testBtn:'开始测试',
            loading:false,
            apiname: '',
            apides: '',
            apiurl:'',
            search: '',
            apiManagers: [],
            project_options: [],
            pre:'',
            next:'',
            projectId: this.$route.query.projectId,
            projectName: this.$route.query.projectName,
            isNextDisabled:false,
            isPreDisabled:false,
            dialogFormVisible:false,
            editObj:{
                id:'',
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
        // api测试
        apiManagerTest() {
            this.loading=true
            this.testBtn='测试中...'
            var params_data = {
                'userId':this.userId,
                'token':this.token,
                'projectId':this.projectId
            }
            this.axios({
                baseURL:this.url,
                url:'/api/v1/apiManagerTest/',
                method:'get',
                params:params_data,
            }).then(response=>{
                // 判断是否成功
                if (!response.data.errcode) {
                    this.$message({
                        message: 'PASS',
                        type: 'success',
                        center: true,
                        showClose: true,
                    });
                }
                else {
                    this.$message({
                        message: response.data.errmsg,
                        type: 'error',
                        center: true,
                        showClose: true,
                    })
                }
                this.loading=false
                this.testBtn='开始测试'
                this.get_apiManagers()
            },error=>{
                this.$message({
                    message: error.response.data,
                    type: 'error',
                    center: true,
                    showClose: true,
                })
                this.get_apiManagers()
                this.loading=false
                this.testBtn='开始测试'
            })
        },
        // 获取数据列表
        get_apiManagers() {
            var url = 'api/v1/apiManager/'
            if (this.$route.query.projectId) {
                url = url +'?project='+this.$route.query.projectId
            }
            var params_data = {'userId':this.userId,'token':this.token}
            this.axios({
                baseURL:this.url,
                url:url,
                method:'get',
                params:params_data,
            }).then(response=>{
                this.apiManagers=response.data.results
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
            },error=>{
                this.$message({
                        message: '匿名用户，请先登录',
                        type: 'error',
                        center: true,
                        showClose: true,
                    })
                this.$router.push('/')
            })
        },
        // 打开编辑
        open_edit(row) {
            this.dialogFormVisible = true
            // this.editObj = row
            this.editObj['id']=row.id
            this.editObj['apiname']=row.apiname
            this.editObj['apides']=row.apides
            this.editObj['apiurl']=row.apiurl
        },
        // 编辑修改数据
        handleEdit(row) {
            this.dialogFormVisible = false
            var params_data = {'userId':this.userId,'token':this.token}
            this.axios({
                baseURL:this.url,
                url:'api/v1/apiManager/'+row.id+'/',
                method:'patch',
                params:params_data,
                data:row,
            }).then(response=>{
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
                var params_data = {'userId':this.userId,'token':this.token}
                this.axios({
                    baseURL:this.url,
                    url:'api/v1/apiManager/'+row.id+'/',
                    method:'delete',
                    params:params_data,
                }).then(response=>{
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
            }).catch(() => {
            })
        },
        // 添加数据
        new_webcase() {
            var body_data = {
                    'apiname': this.apiname,
                    'apides': this.apides,
                    'apiurl':this.apiurl,
                    'user': this.userId,
                    'project': this.projectId
                }
            var params_data = {'userId':this.userId,'token':this.token}
            this.axios({
                baseURL:this.url,
                url:'api/v1/apiManager/',
                method:'post',
                params:params_data,
                data:body_data,
            }).then(response=>{
                // 判断是否成功
                if (!response.data.errcode) {
                    this.$message({
                        message: '添加成功',
                        type: 'success',
                        center: true,
                        showClose: true,
                    });
                    this.get_apiManagers()
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
            // this.get_apiManagers()
            this.apiname=''
            this.apides=''
            this.apiurl=''
        },
        // 上一页
        get_pre() {
            this.axios.get(this.pre).then(response=>{
                // 判断是否成功
                if (!response.data.errcode) {
                    this.apiManagers=response.data.results
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
                    this.apiManagers=response.data.results
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
        go_apiTest(object) {
            var url = '/home/ApiType/'
            var query_data = {
                'object_id':object.id, 
                'content_type': object.contenttype,
                'apiurl':object.apiurl
            }
            this.$router.push({ path: url,query:query_data})
        },
        // 获取项目列表
        get_projects() {
            var params_data = {'userId':this.userId,'token':this.token}
            this.axios({
                baseURL:this.url,
                url:'api/v1/project/',
                method:'get',
                params:params_data,
            }).then(response=>{
                // 判断是否成功
                if (!response.data.errcode) {
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
                        message: '匿名用户，请先登录',
                        type: 'error',
                        center: true,
                        showClose: true,
                    })
                this.$router.push('/')
            })
        },
    },
    watch: {
        '$route.query.projectId':function(val) {
            if (!val) {
                this.get_projects()
                this.get_apiManagers()
            }
        }
    },
    beforeCreate() {
    },
    created() {
        // 获取数据列表
        this.get_apiManagers()
        // 获取项目列表
        if (!this.$route.query.projectId) {
            this.get_projects()
        }
    },
    filters:{
        dateFormat:function(time) {
            var date=new Date(time);
            var year=date.getFullYear();
            /* 在日期格式中，月份是从0开始的，因此要加0
            * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
            * */
            var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
            var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
            var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
            var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
            var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
            // 拼接
            return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
        }
    }
}
</script>

<style scoped>
</style>