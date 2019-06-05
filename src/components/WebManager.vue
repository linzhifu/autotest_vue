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
    <el-collapse v-model="activeName" accordion>
        <el-collapse-item title="自动化测试" name="1" style="font-size:17px">
           <template>
            <el-table
             :data="webAutoTests"
             style="width: 100%">
            <el-table-column
                prop="role"
                label="角色"
                width="180"
                align="center">
            </el-table-column>
            <el-table-column label="测试项" align="" width="800">
                <template slot-scope="scope">
                    <el-checkbox checked @change="checked=>selectAll(checked,scope.row)">全部</el-checkbox>
                    <span v-for="(option,index) in scope.row.options" :key=index>
                        <span v-for="(value,key,index) in option" :key=index>
                            <el-checkbox v-model='option[key]'>{{key}}</el-checkbox>
                            &nbsp;&nbsp;
                        </span>
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="" v-if="this.$route.query.projectName == '量产云平台'">
                <template slot="header" slot-scope="scope">
                    <el-button type="primary" @click="testMpcloud()" align="center" :loading="loading">{{testBtn}}</el-button>
                </template>
                <template slot-scope="scope">
                    <el-button type="primary" @click="testMpcloudCase(scope.row)" :loading="loading">{{testBtn}}</el-button>
                </template>
            </el-table-column>
            </el-table>
        </template>
        </el-collapse-item>
        <el-collapse-item title="自定义测试" name="2" style="font-size:17px">
            <!-- 添加web -->
            <div>
                <el-button type="primary" @click="new_webcase">添加测试</el-button>
                <el-input placeholder="请输入名称" v-model="webname" style="width:200px"></el-input>
                <el-input placeholder="请输入描述" v-model="webdes" style="width:200px"></el-input>
                <el-input placeholder="请输入URL" v-model="weburl" style="width:200px"></el-input>
                <el-select v-if="!this.$route.query.projectId" v-model="projectId" placeholder="请选择">
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
            <!-- web列表 -->
            <el-table
             stripe
             border
             :data="webManagers.filter(data => !search || data.webname.toLowerCase().includes(search.toLowerCase()) || data.webdes.toLowerCase().includes(search.toLowerCase()))"
             empty-text="暂无项目"
             :header-cell-style="{background:'#ddd'}"
             highlight-current-row>
                <el-table-column label="名称" align="center">
                    <template slot-scope="scope">
                        <a href="#" @click.prevent="go_webTest(scope.row)">
                            <p>{{scope.row.webname}}</p>
                        </a>
                    </template>
                </el-table-column>
                <el-table-column label="描述" align="center" prop="webdes">
                </el-table-column>
                <el-table-column label="URL" align="center" prop="weburl">
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
                        <el-input v-model="search" size="mini" placeholder="输入名称关键字搜索"/>
                    </template>
                    <template slot-scope="scope">
                        <span v-if='!(scope.row.user==userId) && !(userId==1)'>暂无权限操作</span>
                        <el-button
                        v-if='scope.row.user==userId || userId==1'
                        size="mini"
                        type="primary"
                        @click="open_edit(scope.row)" class="el-icon-edit"></el-button>
                        <el-button
                        v-if='scope.row.user==userId || userId==1'
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
        </el-collapse-item>
    </el-collapse>
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
            activeName: '',
            axios: this.axios,
            url: this.url,
            userId: this.storage.getItem('userId'),
            token: this.storage.getItem('token'),
            testBtn:'开始测试',
            loading:false,
            webname: '',
            webdes: '',
            weburl:'',
            search: '',
            webManagers: [],
            webAutoTests: [],
            project_options: [],
            pre:'',
            next:'',
            isNextDisabled:false,
            isPreDisabled:false,
            projectId: this.$route.query.projectId,
            dialogFormVisible:false,
            editObj:{
                id:'',
                webname:'',
                webdes:'',
                weburl:'',
            }
        }
    },
    methods: {
        // 返回上一级
        go_back() {
            this.$router.back(-1)
        },
        // 全选
        selectAll(checked, row) {
            // console.log(row['options'])
            var options = row['options']
            var option
            var i
            for(var j = 0,len=options.length; j < len; j++) {
                option = options[j]
                for (i in option) {
                    option[i] = checked
                }
            }
        },
        // web测试
        apiManagerTest() {
            this.$confirm('1 请确认是否已打开浏览器服务端 </br> 2 测试大约需几分钟请耐心等待 </br>3 即将开始全部自定义测试', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                dangerouslyUseHTMLString: true
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
                    this.axios({
                        baseURL:this.url,
                        url:'/api/v1/webManagerTest/',
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
                                duration:0,
                            });
                        }
                        else {
                            this.$message({
                                message: response.data.errmsg,
                                type: 'error',
                                center: true,
                                showClose: true,
                                duration:0,
                            })
                        }
                        this.loading=false
                        this.testBtn='开始测试'
                        this.get_webManagers()
                    },error=>{
                        this.$message({
                            message: '自动化测试平台异常，请检查网络',
                            type: 'error',
                            center: true,
                            showClose: true,
                            duration:0,
                        })
                        this.get_webManagers()
                        this.loading=false
                        this.testBtn='开始测试'
                    })
                }).catch(() => {        
            });
        },
        // 量产云平台单元测试
        testMpcloudCase(row) {
            this.$confirm('1 请确认是否已打开浏览器服务端 </br>2 测试大约需几分钟请耐心等待 </br>3 即将开始 '+ (row['role']) + ' 测试', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                dangerouslyUseHTMLString: true
                }).then(() => {
                    this.$message({
                        message: '测试开始',
                        type: 'success',
                        center: true
                    });
                    this.loading=true
                    this.testBtn='测试中...'
                    this.axios({
                        baseURL:this.url,
                        url:'/api/v1/webAutoTest/',
                        method:'patch',
                        data:row,
                    }).then(response=>{
                        // 判断是否成功
                        if (!response.data.errcode) {
                            this.$message({
                                message: response.data.errmsg,
                                type: 'success',
                                center: true,
                                showClose: true,
                                duration:0,
                            });
                        }
                        else {
                            this.$message({
                                message: response.data.errmsg,
                                type: 'error',
                                center: true,
                                showClose: true,
                                duration:0,
                            })
                        }
                        this.loading=false
                        this.testBtn='开始测试'
                    },error=>{
                        this.$message({
                            message: '自动化测试平台异常，请检查网络',
                            type: 'error',
                            center: true,
                            showClose: true,
                            duration:0,
                        })
                        this.loading=false
                        this.testBtn='开始测试'
                    })
                }).catch(() => {      
            });
        },
        // 量产云平台整体测试
        testMpcloud() {
            this.$confirm('1 请确认是否已打开浏览器服务端 </br> 2 测试大约需30分钟请耐心等待 </br>3 即将开始全部角色测试', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                dangerouslyUseHTMLString: true
                }).then(() => {
                    this.$message({
                        message: '测试开始',
                        type: 'success',
                        center: true
                    });
                    this.loading=true
                    this.testBtn='测试中...'
                    this.axios({
                        baseURL:this.url,
                        url:'/api/v1/webAutoTest/',
                        method:'post',
                        data:this.webAutoTests,
                    }).then(response=>{
                        // 判断是否成功
                        if (!response.data.errcode) {
                            this.$message({
                                message: '量产云平台测试 PASS',
                                type: 'success',
                                center: true,
                                showClose: true,
                                duration:0,
                            });
                        }
                        else {
                            this.$message({
                                message: response.data.errmsg,
                                type: 'error',
                                center: true,
                                showClose: true,
                                duration:0,
                            })
                        }
                        this.loading=false
                        this.testBtn='开始测试'
                    },error=>{
                        this.$message({
                            message: '自动化测试平台异常，请检查网络',
                            type: 'error',
                            center: true,
                            showClose: true,
                            duration:0,
                        })
                        this.loading=false
                        this.testBtn='开始测试'
                    })
                }).catch(() => {         
            });
        },
        // 获取自动化数据
        get_webAutotest() {
            var url = 'api/v1/webAutoTest/'
            if (this.$route.query.projectName) {
                url = url +'?project='+this.$route.query.projectName
            }
            var params_data = {'userId':this.userId,'token':this.token}
            this.axios({
                baseURL:this.url,
                url:url,
                method:'get',
                params:params_data,
            }).then(response=>{
                this.webAutoTests=response.data
            },error=>{
                this.$message({
                        message: '匿名用户，请先登录',
                        type: 'error',
                        center: true,
                        showClose: true,
                    })
                // this.$router.push('/')
            })
        },
        // 获取自定义数据
        get_webManagers() {
            var url = 'api/v1/webManager/'
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
                this.webManagers=response.data.results
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
            this.editObj['webname']=row.webname
            this.editObj['webdes']=row.webdes
            this.editObj['weburl']=row.weburl
        },
        // 编辑修改数据
        handleEdit(row) {
            if (!row.webname || !row.webdes || !row.weburl) {
                this.$message({
                    message: "名称、描述和URL不能为空",
                    type: 'error',
                    center: true
                })
                return
            }
            this.dialogFormVisible = false
            var params_data = {'userId':this.userId,'token':this.token}
            this.axios({
                baseURL:this.url,
                url:'api/v1/webManager/'+row.id+'/',
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
                    this.get_webManagers()
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
                    url:'api/v1/webManager/'+row.id+'/',
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
                        this.get_webManagers()
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
        new_webcase() {
            if (!this.webname || !this.webdes || !this.weburl) {
                this.$message({
                    message: "名称、描述和URL不能为空",
                    type: 'error',
                    center: true
                })
                return
            }
            var body_data = {
                'webname': this.webname,
                'webdes': this.webdes,
                'weburl': this.weburl,
                'user': this.userId,
                'project': this.projectId
            }
            var params_data = {'userId':this.userId,'token':this.token}
            this.axios({
                baseURL:this.url,
                url:'api/v1/webManager/',
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
                    this.get_webManagers()
                }
                else {
                    this.$message({
                        message: "添加失败",
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
            this.webname=''
            this.webdes=''
            this.weburl=''
        },
        // 上一页
        get_pre() {
            this.axios.get(this.pre).then(response=>{
                // 判断是否成功
                if (!response.data.errcode) {
                    this.webManagers=response.data.results
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
                        message: error.response.data,
                        type: 'error',
                        center: true
                    })
            })
        },
        // 下一页
        get_next() {
            this.axios.get(this.next).then(response=>{
                // 判断是否成功
                if (!response.data.errcode) {
                    this.webManagers=response.data.results
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
                        message: error.response.data,
                        type: 'error',
                        center: true
                    })
            })
        },
        // 进入前端测试案例
        go_webTest(object) {
            var url = '/home/webType/'
            var query_data = {
                'object_id':object.id, 
                'content_type': object.contenttype,
                'weburl':object.weburl,
                'projectName':object.proname,
                'webName':object.webname
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
        }
    },
    watch: {
        '$route.query.projectId':function(val) {
            if (!val) {
                this.get_projects()
                this.get_webManagers()
            }
        }
    },
    beforeCreate() {
    },
    created() {
        this.get_webManagers()
        this.get_webAutotest()
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