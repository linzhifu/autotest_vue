<template>
<div>
    <!-- 返回上一级 -->
    <a href="#" @click.prevent="go_back">
        <i class="el-icon-d-arrow-left"></i>返回上一级<br><br>
    </a>
    <div style="font-size:17px;margin-bottom:10px">
            项目：{{this.$route.query.projectName + ' - ' + this.$route.query.type}}
    </div>
    <div style="font-size:17px">
            测试：{{this.$route.query.apiName}}
    </div><br>
    <!-- 添加测试分类 -->
    <div>
        <el-button type="primary" @click="new_webcase">添加分类</el-button>
        <el-input placeholder="请输入名称" v-model="typename" style="width:200px"></el-input>
        <el-input placeholder="请输入描述" v-model="typedes" style="width:200px"></el-input>
        <el-tooltip class="item" effect="dark" content="设置API自定义变量" placement="top-start">
            <el-button icon="el-icon-edit" type="primary" style="float: right;margin-left:10px" @click="apiVarFormVisible = true" v-if="this.$route.query.projectName == '量产云平台'"></el-button>
        </el-tooltip>
        <el-button type="primary" @click="apiTest" style="float: right;" :loading="loading">{{testBtn}}</el-button>
        <br><br>
    </div>
    <!-- API列表 -->
    <el-table
        stripe
        border
        :data="testtypes.filter(data => !search || data.typename.toLowerCase().includes(search.toLowerCase()) || data.typedes.toLowerCase().includes(search.toLowerCase()))"
        empty-text="暂无项目"
        :header-cell-style="{background:'#ddd'}"
        :default-sort = "{prop: 'index', order: 'ascending'}"
        highlight-current-row>
        <el-table-column label="" align="center" prop="is_test" width="50px">
            <template slot-scope="scope">
                <input type="checkbox" :checked="scope.row.is_test" disabled>
            </template>
        </el-table-column>
        <el-table-column label="" align="center" prop="index" width="50px" sortable>
        </el-table-column>
        <el-table-column label="名称" align="center" prop="typename">
            <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="'点击查看 '+scope.row.typename+' 接口'"  placement="top">
                    <a href="#" @click.prevent="go_apiTest(scope.row)">
                        <p>{{scope.row.typename}}</p>
                    </a>
                </el-tooltip>
            </template>
        </el-table-column>
        <el-table-column label="描述" align="center" prop="typedes">
        </el-table-column>
        <el-table-column label="最近修改" align="center" prop="update_time">
            <template slot-scope="scope">
                <p>{{scope.row.update_time|dateFormat}}</p>
            </template>
        </el-table-column>
        <el-table-column label="测试" align="center" prop="result" width="100">
            <template slot-scope="scope">
                <p v-if="scope.row.result" style="color:green">PASS</p>
                <p v-else style="color:red">FAIL</p>
            </template>
        </el-table-column>
        <el-table-column align="center">
            <template slot="header">
                <el-input v-model="search" size="mini" placeholder="输入名称关键字搜索"/>
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
            <el-input v-model="editObj.typename" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <el-form >
            <el-form-item label="描述" label-width="120px">
            <el-input v-model="editObj.typedes" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <el-form >
            <el-form-item label="优先级" label-width="120px">
             <el-input-number v-model="editObj.index" controls-position="right"></el-input-number>
            </el-form-item>
        </el-form>
        <el-form >
            <el-form-item label="是否测试" label-width="120px">
             <el-checkbox v-model="editObj.is_test"></el-checkbox>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleEdit(editObj)">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 设置自定义变量-->
    <el-dialog width="500px" title='自定义变量' :visible.sync="apiVarFormVisible">
        <div>
            <el-button type="primary" @click="new_var()">添加</el-button>
            <el-input placeholder="请输入变量名" v-model="varname" style="width:150px"></el-input>
            <el-input placeholder="请输入变量值" v-model="varvalue" style="width:150px"></el-input>
        <br><br>
        </div>
        <el-table
            border
            :data="apiVars"
            style="width: 100%"
            :header-cell-style="{background:'#F2F6FC'}">
            <el-table-column label="变量名">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.varname"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="变量值">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.varvalue"></el-input>
                </template>
            </el-table-column>
            <el-table-column width="140" align="center">
                <template slot-scope="scope">
                    <span v-if='!(scope.row.user==userId) && !(userId==2)'>暂无权限操作</span>
                    <el-tooltip class="item" effect="dark" content="修改" placement="top">
                        <el-button
                            v-if='scope.row.user==userId || userId==2'
                            size="mini"
                            type="primary"
                            @click="edit_var(scope.row)" class="el-icon-edit">
                        </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top">
                        <el-button
                            v-if='scope.row.user==userId || userId==2'
                            size="mini"
                            type="danger"
                            @click="delete_var(scope.row)" icon="el-icon-delete">
                        </el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click="apiVarFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="apiVarFormVisible = false;set_var()">设置</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
/* eslint-disable */
var user;
export default {
    name:'ApiType',
    data() {
        return {
            axios: this.axios,
            url: this.url,
            userId: this.storage.getItem('userId'),
            token: this.storage.getItem('token'),
            testUserId:this.storage.getItem('testUserId'),
            testUserToken:this.storage.getItem('testUserToken'),
            adminUserId:this.storage.getItem('adminUserId'),
            adminUserToken:this.storage.getItem('adminUserToken'),
            testBtn:'开始测试',
            loading:false,
            apiVarFormVisible:false,
            varname:'',
            varvalue:'',
            typename: '',
            typedes: '',
            search: '',
            testtypes: [],
            apiVars: [],
            pre:'',
            next:'',
            isNextDisabled:false,
            isPreDisabled:false,
            content_type: this.$route.query.content_type,
            object_id: this.$route.query.object_id,
            apiurl: this.$route.query.apiurl,
            dialogFormVisible:false,
            editObj:{
                id:'',
                index:'',
                typename:'',
                typedes:'',
                is_test:''
            }
        }
    },
    methods: {
        // 返回上一级
        go_back() {
            this.$router.back(-1)
        },
        // api测试
        apiTest() {
            this.$confirm('即将开始 ' + this.$route.query.apiName + ' 模块测试，请耐心等待', '提示', {
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
                    'object_id':this.object_id,
                    'content_type':this.content_type,
                    'url': this.apiurl
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
                    url:'/api/v1/apiTypeTest/',
                    method:'post',
                    params:params_data,
                    data:data
                }).then(response=>{
                    // 判断是否成功
                    if (!response.data.errcode) {
                        this.$message({
                            message: this.$route.query.apiName + ' 模块测试 PASS',
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
                    this.get_testtypes()
                },error=>{
                    this.$message({
                        message: '自动化测试平台异常，请检查网络',
                        type: 'error',
                        center: true,
                        showClose: true,
                        duration: 0
                    })
                    this.get_testtypes()
                    this.loading=false
                    this.testBtn='开始测试'
                })
            }).catch(() => {
            });
        },
        // 获取数据
        get_testtypes() {
            var params_data = {
                'userId':this.userId,
                'token':this.token,
                'object_id':this.object_id,
                'content_type':this.content_type
            }
            this.axios({
                baseURL:this.url,
                url:'api/v1/testType/',
                method:'get',
                params:params_data,
            }).then(response=>{
                this.testtypes=response.data.results
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
        // 获取数据列表(apiCaseVars)
        get_apiVars() {
            var params_data = {
                'userId':this.userId,
                'token':this.token,
                'apiManager':this.object_id
            }
            this.axios({
                baseURL:this.url,
                url:'api/v1/apiVar/',
                method:'get',
                params:params_data,
            }).then(response=>{
                this.apiVars=response.data.results
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
        // 设置自定义参数
        set_var() {
            for (var i in this.apiVars) {
                console.log(this.apiVars)
                this.storage.setItem(this.apiVars[i].varname.slice(1), this.apiVars[i].varvalue)
            }
        },
        // 添加变量
        new_var() {
            if (!this.varname || !this.varvalue) {
                this.$message({
                    message: "名称和值不能为空",
                    type: 'error',
                    center: true
                })
                return
            }
            if (this.varname.indexOf('&') != 0) {
                this.$message({
                    message: "名称必须以&开头，如&abc",
                    type: 'error',
                    center: true
                })
                return
            }
            if (this.varname.slice(1) == '') {
                this.$message({
                    message: "名称&后不能为空(错误：&，必须：&abc)",
                    type: 'error',
                    center: true
                })
                return
            }
            var body_data = {
                'varname': this.varname,
                'varvalue': this.varvalue,
                'apiManager': this.object_id
            }
            var params_data = {'userId':this.userId,'token':this.token}
            this.axios({
                baseURL:this.url,
                url:'api/v1/apiVar/',
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
                    this.get_apiVars()
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
            this.varname=''
            this.varvalue=''
        },
        // 编辑修改数据
        edit_var(row) {
            if (!row.varname || !row.varvalue) {
                this.$message({
                    message: "名称和值不能为空",
                    type: 'error',
                    center: true
                })
                return
            }
            if (row.varname.indexOf('&') != 0) {
                this.$message({
                    message: "名称必须以&开头，如&abc",
                    type: 'error',
                    center: true
                })
                return
            }
            if (row.varname.slice(1) == '') {
                this.$message({
                    message: "名称&后不能为空(错误：&，必须：&abc)",
                    type: 'error',
                    center: true
                })
                return
            }
            var params_data = {'userId':this.userId,'token':this.token}
            this.axios({
                baseURL:this.url,
                url:'api/v1/apiVar/'+row.id+'/',
                method:'patch',
                params:params_data,
                data:row
            }).then(response=>{
                // 判断是否成功
                if (!response.data.errcode) {
                    this.$message({
                        message: '修改成功',
                        type: 'success',
                        center: true
                    });
                    this.get_apiVars()
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
        delete_var(row) {
            this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
                distinguishCancelAndClose: true,
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(() => {
                var params_data = {'userId':this.userId,'token':this.token}
                this.axios({
                    baseURL:this.url,
                    url:'api/v1/apiVar/'+row.id+'/',
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
                        this.get_apiVars()
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
        // 打开编辑
        open_edit(row) {
            this.dialogFormVisible = true
            // this.editObj = row
            this.editObj['id']=row.id
            this.editObj['index']=row.index
            this.editObj['typename']=row.typename
            this.editObj['typedes']=row.typedes
            this.editObj['is_test']=row.is_test
        },
        // 编辑修改数据
        handleEdit(row) {
            if (!row.typename || !row.typedes) {
                this.$message({
                    message: "名称和描述不能为空",
                    type: 'error',
                    center: true
                })
                return
            }
            this.dialogFormVisible = false
            var params_data = {'userId':this.userId,'token':this.token}
            this.axios({
                baseURL:this.url,
                url:'api/v1/testType/'+row.id+'/',
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
                    this.get_testtypes()
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
                    url:'api/v1/testType/'+row.id+'/',
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
                        this.get_testtypes()
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
            if (!this.typename || !this.typedes) {
                this.$message({
                    message: "名称和描述不能为空",
                    type: 'error',
                    center: true
                })
                return
            }
            var body_data = {
                'typename': this.typename,
                'typedes': this.typedes,
                'object_id': this.object_id,
                'content_type': this.content_type,
                'user': this.userId
            }
            var params_data = {'userId':this.userId,'token':this.token}
            this.axios({
                baseURL:this.url,
                url:'api/v1/testType/',
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
                    this.get_testtypes()
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
            this.typename=''
            this.typedes=''
        },
        // 上一页
        get_pre() {
            this.axios.get(this.pre).then(response=>{
                // 判断是否成功
                if (!response.data.errcode) {
                    this.testtypes=response.data.results
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
                    this.testtypes=response.data.results
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
        // 进入后端测试案例
        go_apiTest(row) {
            var url = '/home/apiCase/'
            var query_data = {
                'testType': row['id'],
                'apiurl':this.apiurl,
                'projectName':this.$route.query.projectName,
                'apiName':this.$route.query.apiName,
                'apiCase':row['typename'],
                'type':this.$route.query.type
            }
            this.$router.push({ path: url,query:query_data})
        },
    },
    beforeCreate() {
    },
    created() {
        this.get_testtypes()
        this.get_apiVars()
        this.set_var()
        // 获取项目列表
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