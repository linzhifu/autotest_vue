<template>
<div>
    <div v-if="this.$route.query.projectId">
    <!-- 返回上一级 -->
        <a href="#" @click.prevent="go_back">
            <i class="el-icon-d-arrow-left"></i>返回上一级<br><br>
        </a>
        <span style="font-size:17px" v-if="this.$route.query.projectName">
            项目：{{this.$route.query.projectName}}
        </span><br><br>
    </div>
    <!-- 添加APP -->
    <div>
        <el-button type="primary" @click="new_app">添加app</el-button>
        <el-input placeholder="请输入名称" v-model="appname" style="width:200px"></el-input>
        <el-input placeholder="请输入描述" v-model="appdes" style="width:200px"></el-input>
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
     :data="appManagers.filter(data => !search || data.appname.toLowerCase().includes(search.toLowerCase()) || data.appdes.toLowerCase().includes(search.toLowerCase()))"
     empty-text="暂无项目"
     :header-cell-style="{background:'#ddd'}"
     highlight-current-row>
    <el-table-column type="expand">
        <template slot-scope="scope">
            <el-tabs type="border-card">
                <!-- desired_caps -->
                <el-tab-pane label="desired_caps">
                    <el-table
                        border
                        :data="desired_caps[scope.row.id]"
                        style="width: 100%"
                        :header-cell-style="{background:'#F2F6FC'}">
                        <el-table-column label="KEY">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row[0]"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="VALUE">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row[1]"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column width="80" align="center">
                            <template slot-scope="desired_caps_Param">
                            <el-button
                                size="mini"
                                type="danger"
                                icon="el-icon-delete"
                                @click.prevent="remove_desired_caps(desired_caps_Param,scope.row.id)">
                            </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <br>
                    <el-button
                        size="mini"
                        type="primary"
                        @click="add_desired_caps(desired_caps[scope.row.id])" class="el-icon-plus">添加参数
                    </el-button>
                    <el-button
                        v-if='scope.row.user==userId || userId==2'
                        size="mini"
                        type="primary"
                        @click="edit_desired_caps(scope.row.id,'desired_caps',desired_caps[scope.row.id])" class="el-icon-edit">{{editParam}}
                    </el-button>
                </el-tab-pane>
                </el-tabs>
            </template>
        </el-table-column>
        <el-table-column label="名称" align="center">
            <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="'点击进入 '+scope.row.appname+' app测试'"  placement="top">
                    <a href="#" @click.prevent="go_appTest(scope.row)">
                        <p>{{scope.row.appname}}</p>
                    </a>
                </el-tooltip>
            </template>
        </el-table-column>
        <el-table-column label="描述" align="center" prop="appdes">
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
            <template slot="header">
                <el-input v-model="search" size="mini" placeholder="输入项目名称关键字搜索"/>
            </template>
            <template slot-scope="scope">
                <span v-if='!(scope.row.user==userId) && !(userId==2)'>暂无权限操作</span>
                <el-tooltip class="item" effect="dark" content="编辑修改" placement="top">
                    <el-button
                        v-if='scope.row.user==userId || userId==2'
                        size="mini"
                        type="primary"
                        @click="open_edit(scope.row)" class="el-icon-edit">
                    </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                    <el-button
                        v-if='scope.row.user==userId || userId==2'
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete">
                    </el-button>
                </el-tooltip>
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
            <el-input v-model="editObj.appname" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <el-form >
            <el-form-item label="描述" label-width="120px">
            <el-input v-model="editObj.appdes" autocomplete="off"></el-input>
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
import md5 from 'js-md5'
var user;
export default {
    name:'AppManager',
    data() {
        return {
            axios: this.axios,
            url: this.url,
            userId: this.storage.getItem('userId'),
            token: this.storage.getItem('token'),
            editParam:'提交修改',
            testBtn:'开始测试',
            loading:false,
            appname: '',
            appdes: '',
            search: '',
            appManagers: [],
            project_options: [],
            pre:'',
            next:'',
            projectId: this.$route.query.projectId,
            projectName: this.$route.query.projectName,
            isNextDisabled:false,
            isPreDisabled:false,
            dialogFormVisible:false,
            testUserFormVisible:false,
            editObj:{
                id:'',
                appname:'',
                appdes:'',
            },
            desired_caps:{},
        }
    },
    methods: {
        // 返回上一级
        go_back() {
            this.$router.back(-1)
        },
        // api测试
        apiManagerTest() {
            this.$confirm('即将开始 ' + this.$route.query.projectName + ' 后端测试，请耐心等待', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message({
                    message: '测试开始',
                    type: 'success',
                    center: true
                });
                this.loading=true
                this.testBtn='测试中...'
                var params_data = {
                    'userId':this.userId,
                    'token':this.token,
                    'projectId':this.projectId
                }
                var data = {}
                if (this.$route.query.projectName == '量产云平台') {
                    var data = {
                        testUserInfo:{
                            testUserId:this.testUserId,
                            testUserToken:this.testUserToken,
                            adminUserId:this.adminUserId,
                            adminUserToken:this.adminUserToken,
                        }
                    }
                }
                
                this.axios({
                    baseURL:this.url,
                    url:'/api/v1/apiManagerTest/',
                    method:'post',
                    params:params_data,
                    data:data
                }).then(response=>{
                    // 判断是否成功
                    if (!response.data.errcode) {
                        this.$message({
                            message: this.$route.query.projectName + ' 后端测试 PASS',
                            type: 'success',
                            center: true,
                            showClose: true,
                            duration: 0
                        });
                    }
                    else {
                        this.$message({
                            message: response.data.errmsg,
                            type: 'error',
                            center: true,
                            showClose: true,
                            duration: 0
                        })
                    }
                    this.loading=false
                    this.testBtn='开始测试'
                    this.get_appManagers()
                },error=>{
                    this.$message({
                        message: '自动化测试平台异常，请检查网络',
                        type: 'error',
                        center: true,
                        showClose: true,
                        duration: 0
                    })
                    this.get_appManagers()
                    this.loading=false
                    this.testBtn='开始测试'
                })
            }).catch(() => {        
            });
        },
        // 获取数据列表
        get_appManagers() {
            var url = 'api/v1/appManager/'
            var desired_caps = []
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
                this.appManagers=response.data.results
                for (var i=0;i<response.data.results.length;i++){
                    // 获取param
                    if (response.data.results[i].desired_caps) {
                        var _desired_caps = JSON.parse(response.data.results[i].desired_caps)
                        for (var key in _desired_caps){
                            desired_caps.push([key,_desired_caps[key]])
                        }
                    }
                    else {
                        desired_caps=[]
                    }
                    // 必须用这种全局方法，Vue才能监控数据变化
                    this.$set(this.desired_caps,response.data.results[i].id,desired_caps)
                    desired_caps=[]
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
        // 添加desired_caps
        add_desired_caps(object) {
            object.push(['',''])
            this.editParam = '提交修改*'
        },
        // 删除param
        remove_desired_caps(object,id) {
            this.$confirm('提交修改后将永久删除, 是否继续?', '提示', {
                distinguishCancelAndClose: true,
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(() => {
                // 必须用这种全局方法，Vue才能监控数据变化
                this.$delete(this.desired_caps[id],object.$index)
                this.editParam = '提交修改*'
            }).catch(() => {
            })
        },
        // 提交修改param
        edit_desired_caps(id,key,value) {
            var row = {
            }
            row['id'] = id
            var _value = {}
            for (var i in value) {
                if (value[i][0] != '' && value[i][1] != ''){
                    _value[value[i][0]] = value[i][1]
                }
            }
            row[key] = JSON.stringify(_value)
            this.handleEdit(row, false)
            this.editParam = '提交修改'
        },
        // 打开编辑
        open_edit(row) {
            this.dialogFormVisible = true
            // this.editObj = row
            this.editObj['id']=row.id
            this.editObj['appname']=row.appname
            this.editObj['appdes']=row.appdes
        },
        // 编辑修改数据
        handleEdit(row, update=true) {
            if (update) {
                if (!row.appname || !row.appdes) {
                    this.$message({
                        message: "名称、描述不能为空",
                        type: 'error',
                        center: true
                    })
                    return
                }
            }
            this.dialogFormVisible = false
            var params_data = {'userId':this.userId,'token':this.token}
            this.axios({
                baseURL:this.url,
                url:'api/v1/appManager/'+row.id+'/',
                method:'patch',
                params:params_data,
                data:row,
            }).then(response=>{
                // 判断是否成功
                if (!response.data.errcode) {
                    this.$message({
                        message: '修改成功',
                        type: 'success',
                        center: true
                    });
                    if (update) {
                        this.get_appManagers()
                    }
                }
                else {
                    this.$message({
                        message: "修改失败",
                        type: 'error',
                        center: true
                    })
                }
            },error=>{
                this.$message({
                    message: '自动化测试平台异常，请检查网络',
                    type: 'error',
                    center: true
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
                    url:'api/v1/appManager/'+row.id+'/',
                    method:'delete',
                    params:params_data,
                }).then(response=>{
                    // 判断是否成功
                    if (!response.data.errcode) {
                        this.$message({
                            message: '删除成功',
                            type: 'success',
                            center: true
                        });
                        this.get_appManagers()
                    }
                    else {
                        this.$message({
                            message: "删除失败",
                            type: 'error',
                            center: true
                        })
                    }
                },error=>{
                   this.$message({
                        message: '自动化测试平台异常，请检查网络',
                        type: 'error',
                        center: true
                    })
                })
            }).catch(() => {
            })
        },
        // 添加数据
        new_app() {
            if (!this.appname || !this.appdes) {
                this.$message({
                    message: "名称、描述、URL不能为空",
                    type: 'error',
                    center: true
                })
                return
            }
            var body_data = {
                'appname': this.appname,
                'appdes': this.appdes,
                'user': this.userId,
                'project': this.projectId
            }
            var params_data = {'userId':this.userId,'token':this.token}
            this.axios({
                baseURL:this.url,
                url:'api/v1/appManager/',
                method:'post',
                params:params_data,
                data:body_data,
            }).then(response=>{
                // 判断是否成功
                if (!response.data.errcode) {
                    this.$message({
                        message: '添加成功',
                        type: 'success',
                        center: true
                    });
                    this.get_appManagers()
                }
                else {
                    this.$message({
                        message: "新建失败",
                        type: 'error',
                        center: true
                    })
                }
            },error=>{
                this.$message({
                    message: '自动化测试平台异常，请检查网络',
                    type: 'error',
                    center: true
                })
            })
            // this.get_appManagers()
            this.appname=''
            this.appdes=''
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
        go_appTest(object) {
            var url = '/home/AppType/'
            var query_data = {
                'object_id':object.id, 
                'content_type': object.contenttype,
                'projectName':object.proname,
                'appName':object.appname
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
                        center: true
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
                this.get_appManagers()
            }
        }
    },
    beforeCreate() {
    },
    created() {
        // 获取数据列表
        this.get_appManagers()
        // 获取项目列表
        if (!this.$route.query.projectId) {
            this.get_projects()
        }
    },
    beforeMount() {
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