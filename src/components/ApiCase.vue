<template>
<div>
    <!-- 返回上一级 -->
    <a href="#" @click.prevent="go_back"><i class="el-icon-d-arrow-left"></i>返回上一级</a><br><br>
    <div style="font-size:17px;margin-bottom:10px">
            项目：{{this.$route.query.projectName}}
    </div>
    <div style="font-size:17px;margin-bottom:10px">
            测试：{{this.$route.query.apiName}}
    </div>
    <div style="font-size:17px;margin-bottom:10px">
            案例：{{this.$route.query.apiCase}}
    </div>
    <div style="font-size:17px;margin-bottom:10px" v-if="this.$route.query.projectName == '量产云平台'">
            管理员ID：{{adminId}}
    </div>
    <div style="font-size:17px" v-if="this.$route.query.projectName == '量产云平台'">
            测试用户ID：{{testUserId}}
    </div>
    <br>
    <!-- 添加API -->
    <div>
        <el-button type="primary" @click="new_apicase">添加API</el-button>
        <el-input placeholder="请输入名称" v-model="apiname" style="width:200px"></el-input>
        <el-input placeholder="请输入URL" v-model="apiurl" style="width:200px"></el-input>
        <el-select v-model="editObj.apimethod" placeholder="请求方法">
            <el-option
                v-for="item in method_options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>
        <el-button type="primary" @click="apiCaseTest" style="float: right;" :loading="loading">{{testBtn}}</el-button>
        <br><br>
    </div>
    <!-- API列表 -->
    <el-table
     border
     stripe
     :data="apiCases.filter(data => !search || data.apiname.toLowerCase().includes(search.toLowerCase()) || data.apiurl.toLowerCase().includes(search.toLowerCase()))"
     empty-text="暂无项目"
     :default-sort = "{prop: 'index', order: 'ascending'}"
     :header-cell-style="{background:'#ddd'}"
     highlight-current-row>
        <el-table-column type="expand">
            <template slot-scope="scope">
                <el-tabs type="border-card">
                    <!-- param -->
                    <el-tab-pane label="Params">
                        <el-table
                         border
                         :data="params[scope.row.id]"
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
                                <template slot-scope="scopeParam">
                                <el-button
                                    size="mini"
                                    type="danger"
                                    icon="el-icon-delete"
                                    @click.prevent="removeParam(scopeParam,scope.row.id)">
                                </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <br>
                        <el-button
                         size="mini"
                         type="primary"
                         @click="addParam(params[scope.row.id])" class="el-icon-plus">添加Param
                        </el-button>
                        <el-button
                         size="mini"
                         type="primary"
                         @click="edit_param(scope.row.id,'apiparam',params[scope.row.id])" class="el-icon-edit">{{editParam}}
                        </el-button>
                    </el-tab-pane>
                    <!-- body -->
                    <el-tab-pane label="Body">
                        <el-select  v-model="scope.row.contentType" style="width:300px">
                            <el-option v-for="item in ['application/x-www-form-urlencoded','application/json']" :key="item" :value="item"></el-option>
                        </el-select><br><br>
                        <el-input  type="textarea" autosize v-model="body[scope.row.id]" @change="body_change(body[scope.row.id])"></el-input><br><br>
                        <el-button
                         size="mini"
                         type="primary"
                         @click="edit_body(scope.row,'apijson',body[scope.row.id])" class="el-icon-edit">{{editBody}}
                        </el-button>
                    </el-tab-pane>
                    <!-- response -->
                    <el-tab-pane label="Response">
                        <el-input  type="textarea" autosize v-model="response[scope.row.id]" @change="response_change(response[scope.row.id])"></el-input><br><br>
                        <el-button
                         size="mini"
                         type="primary"
                         @click="edit_response(scope.row.id,'apiresponse',response[scope.row.id])" class="el-icon-edit">{{editResponse}}
                        </el-button>
                    </el-tab-pane>
                    <el-tab-pane label="权限管理">
                        <el-checkbox v-model="scope.row.isAdmin" @change="scope.row.isAuth = !scope.row.isAdmin;auth_change()">管理员</el-checkbox>
                        <el-checkbox v-model="scope.row.isAuth" @change="scope.row.isAdmin = !scope.row.isAuth;auth_change()">授权</el-checkbox>
                        <br><br>
                        <div>操作者信息：</div><br>
                        <el-form inline>
                            <el-form-item>
                                <el-select v-model="scope.row.operatorType" clearable placeholder="请选择type(必填)" class="select-type" :disabled="!scope.row.isAuth" @change="auth_change()">
                                    <el-option v-for="item in ['user','role','team']" :key="item" :label="item" :value="item"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-input placeholder="请输入id(必填)" v-model="scope.row.operatorId" class="input-item" clearable :disabled="!scope.row.isAuth"  @change="auth_change()"></el-input>
                            </el-form-item>
                        </el-form>
                        <div class="operator">资源信息：</div><br>
                        <el-form inline>
                            <el-form-item>
                                <el-input placeholder="请输入type(必填)" v-model="scope.row.objectType" class="select-type" clearable :disabled="!scope.row.isAuth" @change="auth_change()"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-input placeholder="请输入id(必填)" v-model="scope.row.objectId" class="input-item" clearable :disabled="!scope.row.isAuth" @change="auth_change()"></el-input>
                            </el-form-item>
                        </el-form>
                        <div class="operator">操作信息：</div><br>
                        <el-form inline>
                            <el-form-item>
                                <el-input placeholder="请输入内容(必填)" v-model="scope.row.actions" class="select-type" clearable :disabled="!scope.row.isAuth" @change="auth_change()"></el-input>
                            </el-form-item>
                        </el-form>
                        <el-button
                         size="mini"
                         type="primary"
                         @click="edit_auth(scope.row)" class="el-icon-edit">{{editAuth}}
                        </el-button>
                    </el-tab-pane>
                    <el-tab-pane label="测试数据">
                        <el-button
                            size="mini"
                            type="primary"
                            @click.prevent="apiTest(scope.row)">测试
                        </el-button>
                        <br>
                        <pre style="font-size:14px" v-text="scope.row.testdata"></pre>
                    </el-tab-pane>
                </el-tabs>
            </template>
        </el-table-column>
        <el-table-column label="" align="center" prop="index" width="50px" sortable>
        </el-table-column>
        <el-table-column label="名称" align="center" prop="apiname">
        </el-table-column>
        <el-table-column label="请求方法" align="center" prop="apimethod">
        </el-table-column>
        <el-table-column label="URL" align="center" prop="apiurl">
        </el-table-column>
        <el-table-column label="测试结果" align="center">
            <template slot-scope="scope">
                <p v-if="scope.row.result" style="color:green">PASS</p>
                <p v-else style="color:red">FAIL</p>
            </template>
        </el-table-column>
        <el-table-column label="最近修改" align="center">
            <template slot-scope="scope">
                <p>{{scope.row.update_time|dateFormat}}</p>
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
            <el-form-item label="请求方法" label-width="120px">
                <el-select v-model="editObj.apimethod" placeholder="请选择">
                    <el-option
                        v-for="item in method_options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-form >
            <el-form-item label="URL" label-width="120px">
            <el-input v-model="editObj.apiurl" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <el-form >
            <el-form-item label="Index" label-width="120px">
            <!-- <el-input v-model="editObj.index" autocomplete="off"></el-input> -->
            <el-input-number v-model="editObj.index" controls-position="right"></el-input-number>
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
export default {
    name:'ApiCase',
    data() {
        return {
            axios: this.axios,
            url: this.url,
            userId: this.storage.getItem('userId'),
            testUserId:'',
            adminId:'',
            testToken:'',
            adminToken:'',
            token: this.storage.getItem('token'),
            testUser:'',
            testBtn:'开始测试',
            loading:false,
            apiname: '',
            apiurl:'',
            apiparams:{},
            apibody:{},
            search: '',
            apiCases: [],
            pre:'',
            next:'',
            error:{},
            editParam:'提交修改',
            editBody:'提交修改',
            editResponse:'提交修改',
            editAuth: '提交修改',
            testType: this.$route.query.testType,
            baseurl: this.$route.query.apiurl,
            isNextDisabled:false,
            isPreDisabled:false,
            dialogFormVisible:false,
            editObj:{
                id:'',
                apiname:'',
                apimethod:'',
                apiurl:'',
                index:'',
            },
            method_options: [
                {
                    'label':'get',
                    'value':'get'
                },
                {
                    'label':'post',
                    'value':'post'
                },
                {
                    'label':'patch',
                    'value':'patch'
                },
                {
                    'label':'delete',
                    'value':'delete'
                },
            ],
            params:{},
            body:{},
            response:{},
        }
    },
    methods: {
        // 返回上一级
        go_back() {
            this.$router.back(-1)
        },
        // 量产云平台测试用户登陆
        testUserLogin() {
            var loginUrl = '/api/v1/user/login'
            var loginMethod = 'post'
            var data = {
                'email':'17388730192@163.com',
                'pswmd5':'202cb962ac59075b964b07152d234b70',
                'timestamp':Date.parse(new Date())
            }
            this.axios({
                baseURL:this.baseurl,
                url:loginUrl,
                method:loginMethod,
                data:data,
            }).then(response=>{
                this.testUser = response.data
                if (response.data.errcode=='0') {
                    this.testUserId = response.data.data['userid']
                    this.testToken = response.data.data['token']
                }
                else {
                    this.$message({
                        message: '测试用户登陆 FAIL',
                        type: 'error',
                        center: true,
                        showClose: true,
                    })
                }
            },error=>{
                this.testUser = error.response.data
            })
        },
        // 量产云平台管理员登陆
        adminLogin() {
            var loginUrl = '/api/v1/user/login'
            var loginMethod = 'post'
            var data = {
                'email':'linzhifu221@163.com',
                'pswmd5':'c313b271b06b2b50ad9a3e93e8744029',
                'timestamp':Date.parse(new Date())
            }
            this.axios({
                baseURL:this.baseurl,
                url:loginUrl,
                method:loginMethod,
                data:data,
            }).then(response=>{
                this.testUser = response.data
                if (response.data.errcode=='0') {
                    this.adminId = response.data.data['userid']
                    this.adminToken = response.data.data['token']
                }
                else {
                    this.$message({
                        message: '管理员登陆 FAIL',
                        type: 'error',
                        center: true,
                        showClose: true,
                    })
                }
            },error=>{
                this.testUser = error.response.data
            })
        },
        // 删除管理员权限
        deleteAdmin(row) {
            var params = {
                'userid':this.adminId,
                'token': this.adminToken
            }
            var data = {
                roleid:1,
                userid:this.testUserId
            }
            this.axios({
                baseURL:this.baseurl,
                url:'/api/v1/role/user',
                method:'delete',
                params:params,
                data:data,
            }).then((res)=>{
                if(res.data.errcode==0){
                    return
                } else {
                    this.$message({
                        message: row['apiname'] + ' 删除管理员权限失败-errcode不一致',
                        type: 'error',
                        center: true,
                        showClose: true,
                    })
                    return
                }
            }).catch((error)=>{
                this.$message({
                    message: '删除管理员权限失败-服务器错误，请检查 ' + this.baseurl + ' 服务器是否正常',
                    type: 'error',
                    center: true,
                    showClose: true,
                })
                return
            })
        },
        // 删除权限
        deleteAuth(row) {
            if(row.operatorType =='' || row.operatorId =='' ||  row.objectType =='' || row.objectId =='' || row.actions ==''){
                this.$message({
                    message: '请确保必填项都已填写',
                    type: 'warning'
                });
                return 
            }
            var params = {
                'userid': this.adminId,
                'token': this.adminToken
            }
            var data = {
                "operator":{
                    "type":row.operatorType,
                    "id":Number(row.objectType)
                },
                "object":{
                    "type":row.objectType,
                    "id":Number(row.objectId)
                },
                "actions":row.actions.split(',')
            }
            this.axios({
                baseURL:this.baseurl,
                url:'/api/v1/role/permission',
                method:'delete',
                params:params,
                data:data,
            }).then((res)=>{
                if(res.data.errcode==0){
                    return
                } else {
                    this.$message({
                        message: row['apiname'] + ' 删除权限失败-errcode不一致',
                        type: 'error',
                        center: true,
                        showClose: true,
                    })
                    return
                }
            }).catch((error)=>{
                this.$message({
                    message: '删除权限失败-服务器错误，请检查 ' + this.baseurl + ' 服务器是否正常',
                    type: 'error',
                    center: true,
                    showClose: true,
                })
                return
            })
        },
        // API单元测试
        apiTest(row) {
            if (!this.isJsonString(this.body[row.id])) {
                this.$message.error('body数据不符合json格式');
                return
            }
            if (!this.isJsonString(this.response[row.id])) {
                this.$message.error('response数据不符合json格式');
                return
            }
            // 设置管理员权限
            if (row.isAdmin) {
                let params = {
                    'userid':this.adminId,
                    'token': this.adminToken
                }
                let data = {
                    roleid:1,
                    userid:this.testUserId
                }
                this.axios({
                    baseURL:this.baseurl,
                    url:'/api/v1/role/user',
                    method:'post',
                    params:params,
                    data:data,
                }).then((res)=>{
                    if(res.data.errcode==0){
                        var _value = {}
                        for (var i in this.params[row.id]) {
                            if (this.params[row.id][i][0] != '' && this.params[row.id][i][1] != ''){
                                _value[this.params[row.id][i][0]] = this.params[row.id][i][1]
                            }
                        }
                        var params = _value
                        var headers = {'Content-Type': row.contentType}
                        var data = JSON.parse(this.body[row.id])
                        var res = JSON.parse(this.response[row.id])
                        var resu = '测试 PASS'
                        var message = row['apiname'] + '' + resu
                        if (data.hasOwnProperty('timestamp')) {
                            data['timestamp'] = Date.parse(new Date())
                        }
                        this.axios({
                            baseURL:this.baseurl,
                            url:row.apiurl,
                            method:row.apimethod,
                            params:params,
                            data:data,
                            headers:headers
                        }).then(response=>{
                            row.testdata = response.data
                            if (response.data.errcode==res['errcode']) {
                                if ('data' in res) {
                                    for (var i in res['data']) {
                                        if (res['data'][i] != response.data['data'][i]) {
                                            this.$message({
                                                message: row['apiname'] + ' data不一致',
                                                type: 'error',
                                                center: true,
                                                showClose: true,
                                            })
                                            // 删除权限
                                            this.deleteAdmin(row)
                                            return
                                        }
                                    }
                                }
                                if ('errmsg' in res) {
                                    if (res['errmsg'] != response.data['errmsg']) {
                                        this.$message({
                                            message: row['apiname'] + ' errmsg不一致',
                                            type: 'error',
                                            center: true,
                                            showClose: true,
                                        })
                                        // 删除权限
                                        this.deleteAdmin(row)
                                        return
                                    }
                                }
                                this.$message({
                                    message: row['apiname'] + ' 测试 PASS',
                                    type: 'success',
                                    center: true,
                                    showClose: true,
                                })
                                // 删除权限
                                this.deleteAdmin(row)
                                return
                            }
                            else {
                                this.$message({
                                    message: row['apiname'] + ' errcode不一致',
                                    type: 'error',
                                    center: true,
                                    showClose: true,
                                })
                                // 删除权限
                                this.deleteAdmin(row)
                                return
                            }
                        },error=>{
                            console.log(error.response.data)
                            row.testdata=error.response.data
                            this.$message({
                                message: '服务器错误，请检查 ' + this.baseurl + ' 服务器是否正常',
                                type: 'error',
                                center: true,
                                showClose: true,
                            })
                            // 删除权限
                            this.deleteAdmin(row)
                            return
                        })
                    } else {
                        this.$message({
                            message: row['apiname'] + ' 授予管理员权限失败',
                            type: 'error',
                            center: true,
                            showClose: true,
                        })
                        return
                    }
                }).catch((error)=>{
                    this.$message({
                        message: '服务器错误，请检查 ' + this.baseurl + ' 服务器是否正常',
                        type: 'error',
                        center: true,
                        showClose: true,
                    })
                    return
                })
            }
            // 添加权限
            if (row.isAuth) {
                if(row.operatorType =='' || row.operatorId =='' ||  row.objectType =='' || row.objectId =='' || row.actions ==''){
                    this.$message({
                        message: '请确保必填项都已填写',
                        type: 'warning'
                    });
                    return 
                }
                let params = {
                    'userid': this.adminId,
                    'token': this.adminToken
                }
                let data = {
                    "operator":{
                        "type":row.operatorType,
                        "id":Number(row.operatorId)
                    },
                    "object":{
                        "type":row.objectType,
                        "id":Number(row.objectId)
                    },
                    "actions":row.actions.split(',')
                }
                this.axios({
                    baseURL:this.baseurl,
                    url:'/api/v1/role/permission',
                    method:'post',
                    params:params,
                    data:data,
                }).then((res)=>{
                    if(res.data.errcode==0){
                        var _value = {}
                        for (var i in this.params[row.id]) {
                            if (this.params[row.id][i][0] != '' && this.params[row.id][i][1] != ''){
                                _value[this.params[row.id][i][0]] = this.params[row.id][i][1]
                            }
                        }
                        var params = _value
                        var headers = {'Content-Type': row.contentType}
                        var data = JSON.parse(this.body[row.id])
                        var res = JSON.parse(this.response[row.id])
                        var resu = '测试 PASS'
                        var message = row['apiname'] + '' + resu
                        if (data.hasOwnProperty('timestamp')) {
                            data['timestamp'] = Date.parse(new Date())
                        }
                        this.axios({
                            baseURL:this.baseurl,
                            url:row.apiurl,
                            method:row.apimethod,
                            params:params,
                            data:data,
                            headers:headers
                        }).then(response=>{
                            row.testdata = response.data
                            if (response.data.errcode==res['errcode']) {
                                if ('data' in res) {
                                    for (var i in res['data']) {
                                        if (res['data'][i] != response.data['data'][i]) {
                                            this.$message({
                                                message: row['apiname'] + ' data不一致',
                                                type: 'error',
                                                center: true,
                                                showClose: true,
                                            })
                                            // 删除权限
                                            this.deleteAuth(row)
                                            return
                                        }
                                    }
                                }
                                if ('errmsg' in res) {
                                    if (res['errmsg'] != response.data['errmsg']) {
                                        this.$message({
                                            message: row['apiname'] + ' errmsg不一致',
                                            type: 'error',
                                            center: true,
                                            showClose: true,
                                        })
                                        // 删除权限
                                        this.deleteAuth(row)
                                        return
                                    }
                                }
                                this.$message({
                                    message: row['apiname'] + ' 测试 PASS',
                                    type: 'success',
                                    center: true,
                                    showClose: true,
                                })
                                // 删除权限
                                this.deleteAuth(row)
                                return
                            }
                            else {
                                this.$message({
                                    message: row['apiname'] + ' errcode不一致',
                                    type: 'error',
                                    center: true,
                                    showClose: true,
                                })
                                // 删除权限
                                this.deleteAuth(row)
                                return
                            }
                        },error=>{
                            console.log(error.response.data)
                            row.testdata=error.response.data
                            this.$message({
                                message: '服务器错误，请检查 ' + this.baseurl + ' 服务器是否正常',
                                type: 'error',
                                center: true,
                                showClose: true,
                            })
                            // 删除权限
                            this.deleteAuth(row)
                            return
                        })
                    } else {
                        this.$message({
                            message: row['apiname'] + ' 授予权限失败',
                            type: 'error',
                            center: true,
                            showClose: true,
                        })
                        return
                    }
                }).catch((error)=>{
                    this.$message({
                        message: '授予权限失败-服务器错误，请检查 ' + this.baseurl + ' 服务器是否正常',
                        type: 'error',
                        center: true,
                        showClose: true,
                    })
                    return
                })
            }
        },
        // 全部API测试
        apiCaseTest() {
            this.$confirm('即将开始 ' + this.$route.query.apiCase + ' api测试，请耐心等待', '提示', {
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
                    'testType':this.testType,
                    'url': this.baseurl
                }
                this.axios({
                    baseURL:this.url,
                    url:'/api/v1/apiCaseTest/',
                    method:'get',
                    params:params_data,
                }).then(response=>{
                    // 判断是否成功
                    if (!response.data.errcode) {
                        this.$message({
                            message: this.$route.query.apiCase + ' 测试 PASS',
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
                    this.get_apiCases()
                },error=>{
                    this.$message({
                        message: '自动化测试平台异常，请检查网络',
                        type: 'error',
                        center: true,
                        showClose: true,
                    })
                    this.loading=false
                    this.testBtn='开始测试'
                })
                }).catch(() => {     
            });
        },
        // 添加param
        addParam(object) {
            object.push(['',''])
            this.editParam = '提交修改*'
        },
        // 删除param
        removeParam(object,id) {
            this.$confirm('提交修改后将永久删除, 是否继续?', '提示', {
                distinguishCancelAndClose: true,
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(() => {
                // 必须用这种全局方法，Vue才能监控数据变化
                this.$delete(this.params[id],object.$index)
                this.editParam = '提交修改*'
            }).catch(() => {
            })
        },
        // 提交修改param
        edit_param(id,key,value) {
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
        // body数据发生变化
        body_change(value) {
            this.editBody = '提交修改*'
            if (!this.isJsonString(value)) {
                this.$message({
                    message: 'body数据不符合json格式',
                    type: 'warning'
                });
            }
        },
        // 提交修改param
        edit_body(object,key,value) {
            var row = {
            }
            row['id'] = object['id']
            if (!this.isJsonString(value)) {
                this.$message.error('body数据不符合json格式');
                return
            }
            row[key] = value
            row['contentType'] = object['contentType']
            this.handleEdit(row, false)
            this.editBody = '提交修改'
        },
        // response数据发生变化
        response_change(value) {
            this.editResponse = '提交修改*'
            if (!this.isJsonString(value)) {
                this.$message({
                    message: 'response数据不符合json格式',
                    type: 'warning'
                });
            }
        },
        // 提交修改response
        edit_response(id,key,value) {
            var row = {
            }
            row['id'] = id
            if (!this.isJsonString(value)) {
                this.$message.error('response数据不符合json格式');
                return
            }
            row[key] = value
            this.handleEdit(row, false)
            this.editResponse = '提交修改'
        },
        // auth数据发生变化
        auth_change(row) {
            this.editAuth = '提交修改*'
        },
        // 提交修改auth
        edit_auth(object) {
            var row = {
            }
            row['id'] = object.id
            row['isAdmin'] = object.isAdmin
            row['isAuth'] = object.isAuth
            row['operatorType'] = object.operatorType
            row['operatorId'] = object.operatorId
            row['objectType'] = object.objectType
            row['objectId'] = object.objectId
            row['actions'] = object.actions
            this.handleEdit(row, false)
            this.editAuth = '提交修改'
        },
        // 获取数据列表
        get_apiCases() {
            var params = []
            var response_obj
            var body
            var params_data = {
                'userId':this.userId,
                'token':this.token,
                'testType':this.testType
            }
            this.axios({
                baseURL:this.url,
                url:'api/v1/apiCase/',
                method:'get',
                params:params_data,
            }).then(response=>{
                this.apiCases=response.data.results
                for (var i=0;i<response.data.results.length;i++){
                    // 获取param
                    if (response.data.results[i].apiparam) {
                        var _params = JSON.parse(response.data.results[i].apiparam)
                        for (var key in _params){
                            params.push([key,_params[key]])
                        }
                    }
                    else {
                        params=[]
                    }

                    // 获取body
                    if (response.data.results[i].apijson) {
                        body = JSON.parse(response.data.results[i].apijson)
                    }
                    else {
                        body={}
                    }

                    // 获取response
                    if (response.data.results[i].apiresponse) {
                        response_obj = JSON.parse(response.data.results[i].apiresponse)
                    }
                    else {
                        response_obj={}
                    }
                    // 必须用这种全局方法，Vue才能监控数据变化
                    this.$set(this.params,response.data.results[i].id,params)
                    this.$set(this.body,response.data.results[i].id,JSON.stringify(body,null,4))
                    this.$set(this.response,response.data.results[i].id,JSON.stringify(response_obj,null,4))
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
        // 打开编辑
        open_edit(row) {
            this.dialogFormVisible = true
            // this.editObj = row
            this.editObj['id']=row.id
            this.editObj['apiname']=row.apiname
            this.editObj['apimethod']=row.apimethod
            this.editObj['apiurl']=row.apiurl
            this.editObj['index']=row.index
        },
        // 编辑修改数据
        handleEdit(row, update=true) {
            this.dialogFormVisible = false
            var params_data = {'userId':this.userId,'token':this.token}
            this.axios({
                baseURL:this.url,
                url:'api/v1/apiCase/'+row.id+'/',
                method:'patch',
                params:params_data,
                data:row
            }).then(response=>{
                // 判断是否成功
                if (!response.data.errcode) {
                    this.$message({
                        message: '修改成功',
                        type: 'success',
                        center: true,
                        showClose: true,
                    });
                    if (update) {
                        this.get_apiCases()
                    }
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
                    url:'api/v1/apiCase/'+row.id+'/',
                    method:'delete',
                    params:params_data
                }).then(response=>{
                    // 判断是否成功
                    if (!response.data.errcode) {
                        this.$message({
                            message: '删除成功',
                            type: 'success',
                            center: true,
                            showClose: true,
                        });
                        this.get_apiCases()
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
        new_apicase() {
            var body_data = {
                    'apiname': this.apiname,
                    'apiurl': this.apiurl,
                    'apimethod':this.editObj.apimethod,
                    'testType': this.testType,
                    'user':this.userId
                }
            var params_data = {'userId':this.userId,'token':this.token}
            this.axios({
                baseURL:this.url,
                url:'api/v1/apiCase/',
                method:'post',
                params:params_data,
                data:body_data
            }).then(response=>{
                // 判断是否成功
                if (!response.data.errcode) {
                    this.$message({
                        message: '添加成功',
                        type: 'success',
                        center: true,
                        showClose: true,
                    });
                    this.get_apiCases()
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
            this.apiname=''
            this.apiurl=''
            this.editObj.apimethod=''
        },
        // 上一页
        get_pre() {
            this.axios.get(this.pre).then(response=>{
                // 判断是否成功
                if (!response.data.errcode) {
                    this.$message({
                    });
                    this.apiCases=response.data.results
                    for (var i=0;i<response.data.results.length;i++){
                        // 获取param
                        if (response.data.results[i].apiparam) {
                            params = JSON.parse(response.data.results[i].apiparam)
                        }
                        else {
                            params={}
                        }

                        // 获取body
                        if (response.data.results[i].apijson) {
                            body = JSON.parse(response.data.results[i].apijson)
                        }
                        else {
                            body={}
                        }

                        // 获取response
                        if (response.data.results[i].apiresponse) {
                            response_obj = JSON.parse(response.data.results[i].apiresponse)
                        }
                        else {
                            response_obj={}
                        }
                        // 必须用这种全局方法，Vue才能监控数据变化
                        this.$set(this.params,response.data.results[i].id,params)
                        this.$set(this.body,response.data.results[i].id,body)
                        this.$set(this.response,response.data.results[i].id,response_obj)
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
                        // message: '加载成功',
                        // type: 'success',
                        // center: true,
                        // showClose: true,
                    });
                    this.apiCases=response.data.results
                    for (var i=0;i<response.data.results.length;i++){
                        // 获取param
                        if (response.data.results[i].apiparam) {
                            params = JSON.parse(response.data.results[i].apiparam)
                        }
                        else {
                            params={}
                        }

                        // 获取body
                        if (response.data.results[i].apijson) {
                            body = JSON.parse(response.data.results[i].apijson)
                        }
                        else {
                            body={}
                        }

                        // 获取response
                        if (response.data.results[i].apiresponse) {
                            response_obj = JSON.parse(response.data.results[i].apiresponse)
                        }
                        else {
                            response_obj={}
                        }
                        // 必须用这种全局方法，Vue才能监控数据变化
                        this.$set(this.params,response.data.results[i].id,params)
                        this.$set(this.body,response.data.results[i].id,body)
                        this.$set(this.response,response.data.results[i].id,response_obj)
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
        isJsonString(str) {
            try {
                if (typeof JSON.parse(str) == "object") {
                    return true;
                }
            } catch(e) {
            }
            return false;
        },
    },
    beforeCreate() {
    },
    created() {
        // 获取数据列表
        this.get_apiCases()
        if (this.$route.query.projectName == '量产云平台') {
            this.testUserLogin()
            this.adminLogin()
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
