<template>
<div>
    <!-- 返回上一级 -->
    <a href="#" @click.prevent="go_back"><i class="el-icon-d-arrow-left"></i>返回上一级</a><br><br>
    <div style="font-size:17px;margin-bottom:10px">
            项目：{{this.$route.query.projectName}}
    </div>
    <div style="font-size:17px;margin-bottom:10px">
            app：{{this.$route.query.appName}}
    </div>
    <div style="font-size:17px">
            案例：{{this.$route.query.appCase}}
    </div><br>
    <el-button type="primary" @click="appTest()" style="" :loading="loading">{{testBtn}}</el-button>
    <br><br>
    <el-collapse v-model="activeName" accordion>
        <el-collapse-item title="操作步骤" name="1">
            <!-- 添加app操作 -->
            <div>
                <el-button type="primary" @click="new_appcase">添加步骤</el-button>
                <el-input placeholder="请输入名称" v-model="appname" style="width:200px"></el-input>
                <br><br>
            </div>
            <!-- appium操作步骤 -->
            <el-table
             border
             stripe
             :data="appCases.filter(data => (!search || data.appname.toLowerCase().includes(search.toLowerCase())))"
             empty-text="暂无项目"
             :default-sort = "{prop: 'index', order: 'ascending'}"
             :header-cell-style="{background:'#ddd'}"
             highlight-current-row>
                <el-table-column label="" align="center" prop="index" width="50px" sortable>
                </el-table-column>
                <el-table-column label="步骤" align="center" prop="appname">
                </el-table-column>
                <el-table-column label="元素定位方法" align="center" prop="selectmethod">
                </el-table-column>
                <el-table-column label="元素定位参数" align="center" prop="selectparam">
                </el-table-column>
                <el-table-column label="元素操作方法" align="center" prop="appoprate">
                </el-table-column>
                <el-table-column label="操作参数" align="center" prop="appparam">
                </el-table-column>
                <el-table-column label="最近修改" align="center">
                    <template slot-scope="scope">
                        <p>{{scope.row.update_time|dateFormat}}</p>
                    </template>
                </el-table-column>
                <el-table-column align="center">
                    <template slot="header">
                        <el-input v-model="search" size="mini" placeholder="输入关键字搜索"/>
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
        </el-collapse-item>
        <el-collapse-item title="操作验证" name="2">
        <!-- 添加验证操作 -->
        <div>
            <el-button type="primary" @click="new_appcase('check')">添加验证</el-button>
            <el-input placeholder="请输入名称" v-model="appname" style="width:200px"></el-input>
            <br><br>
        </div>
        <!-- app验证数据列表 -->
        <el-table
            border
            stripe
            :data="checkAppCases.filter(data => (!search || data.appname.toLowerCase().includes(search.toLowerCase())))"
            empty-text="暂无项目"
            :default-sort = "{prop: 'index', order: 'ascending'}"
            :header-cell-style="{background:'#ddd'}"
            highlight-current-row>
            <el-table-column label="" align="center" prop="index" width="50px" sortable>
            </el-table-column>
            <el-table-column label="验证" align="center" prop="appname">
            </el-table-column>
            <el-table-column label="元素定位方法" align="center" prop="selectmethod">
            </el-table-column>
            <el-table-column label="元素定位参数" align="center" prop="selectparam">
            </el-table-column>
            <el-table-column label="元素操作" align="center" prop="appoprate">
            </el-table-column>
            <el-table-column label="操作参数" align="center" prop="appparam">
            </el-table-column>
            <el-table-column label="验证数据" align="center" prop="checktext">
            </el-table-column>
            <el-table-column label="最近修改" align="center">
                <template slot-scope="scope">
                    <p>{{scope.row.update_time|dateFormat}}</p>
                </template>
            </el-table-column>
            <el-table-column align="center">
                <template slot="header">
                    <el-input v-model="search" size="mini" placeholder="输入关键字搜索"/>
                </template>
                <template slot-scope="scope">
                    <span v-if='!(scope.row.user==userId) && !(userId==2)'>暂无权限操作</span>
                    <el-tooltip class="item" effect="dark" content="编辑修改" placement="top">
                        <el-button
                            v-if='scope.row.user==userId || userId==2'
                            size="mini"
                            type="primary"
                            @click="open_edit(scope.row,'check')" class="el-icon-edit">
                        </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top">
                        <el-button
                            v-if='scope.row.user==userId || userId==2'
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row, 'check')" icon="el-icon-delete">
                            </el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <br>
        <!-- 翻页 -->
        <div style="text-align: center;">
            <el-button type="primary" :disabled="isCheckPreDisabled" @click="get_checkPre">上一页</el-button>
            <el-button type="primary" :disabled="isCheckNextDisabled" @click="get_checkNext">下一页</el-button>
        </div>
        </el-collapse-item>
    </el-collapse>
    <!-- 修改数据 -->
    <el-dialog :visible.sync="dialogFormVisible">
        <el-form>
            <el-form-item label="步骤" label-width="120px">
            <el-input v-model="editObj.appname" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <el-form >
            <el-form-item label="元素定位方法" label-width="120px">
            <el-input v-model="editObj.selectmethod" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <el-form >
            <el-form-item label="元素定位参数" label-width="120px">
            <el-input v-model="editObj.selectparam" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <el-form >
            <el-form-item label="元素操作" label-width="120px">
            <el-input v-model="editObj.appoprate" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <el-form>
            <el-form-item label="操作参数" label-width="120px">
            <el-input v-model="editObj.appparam" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <el-form v-if="editObj.type">
            <el-form-item label="验证数据" label-width="120px">
            <el-input v-model="editObj.checktext" autocomplete="off"></el-input>
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
var user;
export default {
    name:'AppCase',
    data() {
        return {
            axios: this.axios,
            url: this.url,
            userId: this.storage.getItem('userId'),
            token: this.storage.getItem('token'),
            testBtn:'开始测试',
            loading:false,
            appname: '',
            search: '',
            appCases: [],
            checkAppCases:[],
            pre:'',
            next:'',
            checkPre:'',
            checkNext:'',
            testType: this.$route.query.testType,
            isNextDisabled:false,
            isPreDisabled:false,
            isCheckNextDisabled:false,
            isCheckPreDisabled:false,
            dialogFormVisible:false,
            editObj:{
                id:'',
                appname:'',
                selectmethod:'',
                selectparam:'',
                appoprate:'',
                appparam:'',
                index:'',
                type:'',
                checktext:'',
            },
            activeName:''
        }
    },
    methods: {
        // 返回上一级
        go_back() {
            this.$router.back(-1)
        },
        // app测试
        appTest() {
            this.$confirm('1 请确认移动端是否开启开发者模式并连接测试PC </br> \
                2 请确认是否已打开appium服务端</br> \
                3 测试大约需几分钟请耐心等待 </br> \
                4 即将开始 '+ this.$route.query.appCase + ' 测试', '提示', {
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
                        'testType':this.testType
                    }
                    this.axios({
                        baseURL:this.url,
                        url:'/api/v1/appCaseTest/',
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
        // 获取数据列表
        get_appCases() {
            var params_data = {
                'userId':this.userId,
                'token':this.token,
                'testType':this.testType
            }
            this.axios({
                baseURL:this.url,
                url:'api/v1/appCase/',
                method:'get',
                params:params_data,
            }).then(response=>{
                this.appCases=response.data.results
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
        get_checkAppCases() {
            var params_data = {
                'userId':this.userId,
                'token':this.token,
                'testType':this.testType
            }
            this.axios({
                baseURL:this.url,
                url:'api/v1/checkAppCase/',
                method:'get',
                params:params_data,
            }).then(response=>{
                this.checkAppCases=response.data.results
                // 判断是否有上一页
                this.checkPre=response.data.previous
                if (!this.checkPre) {
                    this.isCheckPreDisabled=true
                }
                else {
                    this.isCheckPreDisabled=false
                }
                // 判断是否有下一页
                this.checkNext=response.data.next
                if (!this.checkNext) {
                    this.isCheckNextDisabled=true
                }
                else {
                    this.isCheckNextDisabled=false
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
        open_edit(row, type) {
            this.dialogFormVisible = true
            // this.editObj = row
            this.editObj['id']=row.id
            this.editObj['appname']=row.appname
            this.editObj['selectmethod']=row.selectmethod
            this.editObj['selectparam']=row.selectparam
            this.editObj['appoprate']=row.appoprate
            this.editObj['appparam']=row.appparam
            this.editObj['index']=row.index
            this.editObj['type']=type
            if (type=='check') {
                this.editObj['checktext']=row.checktext
            }
        },
        // 编辑修改数据
        handleEdit(row) {
            if (!row.appname && row.type!='check') {
                this.$message({
                    message: "步骤名称不能为空",
                    type: 'error',
                    center: true
                })
                return
            }
            if (!row.appname && row.type=='check') {
                this.$message({
                    message: "验证名称不能为空",
                    type: 'error',
                    center: true
                })
                return
            }
            this.dialogFormVisible = false
            var params_data = {'userId':this.userId,'token':this.token}
            var url = 'api/v1/appCase/'+row.id+'/'
            if (row['type']=='check') {
                // 判断是操作哪个表格的数据
                url = 'api/v1/checkAppCase/'+row.id+'/'
            }
            this.axios({
                baseURL:this.url,
                url:url,
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
                    this.get_appCases()
                    this.get_checkAppCases()
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
        handleDelete(index, row, type) {
            this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
                distinguishCancelAndClose: true,
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(() => {
                var params_data = {'userId':this.userId,'token':this.token}
                var url = 'api/v1/appCase/'+row.id+'/'
                if (type=='check') {
                    // 判断是操作哪个表格的数据
                    url = 'api/v1/checkAppCase/'+row.id+'/'
                }
                this.axios({
                    baseURL:this.url,
                    url:url,
                    method:'delete',
                    params:params_data
                }).then(response=>{
                    // 判断是否成功
                    if (!response.data.errcode) {
                        this.$message({
                            message: '删除成功',
                            type: 'success',
                            center: true
                        });
                        this.get_appCases()
                        this.get_checkAppCases()
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
            })
        },
        // 添加数据
        new_appcase(type) {
            if (!this.appname && type!='check') {
                this.$message({
                    message: "步骤名称不能为空",
                    type: 'error',
                    center: true
                })
                return
            }
            if (!this.appname && type=='check') {
                this.$message({
                    message: "验证名称不能为空",
                    type: 'error',
                    center: true
                })
                return
            }
            var body_data = {
                'appname': this.appname,
                'testType': this.testType,
                'user':this.userId
            }
            var url = 'api/v1/appCase/'
            if (type=='check') {
                url = 'api/v1/checkAppCase/'
            }
            var params_data = {'userId':this.userId,'token':this.token}
            this.axios({
                baseURL:this.url,
                url:url,
                method:'post',
                params:params_data,
                data:body_data
            }).then(response=>{
                // 判断是否成功
                if (!response.data.errcode) {
                    this.$message({
                        message: '添加成功',
                        type: 'success',
                        center: true
                    });
                    this.get_appCases()
                    this.get_checkAppCases()
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
            this.appname=''
        },
        // 上一页
        get_pre() {
            this.axios.get(this.pre).then(response=>{
                // 判断是否成功
                if (!response.data.errcode) {
                    this.appCases=response.data.results
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
        get_checkPre() {
            this.axios.get(this.checkPre).then(response=>{
                // 判断是否成功
                if (!response.data.errcode) {
                    this.checkAppCases=response.data.results
                    // 判断是否有上一页
                    this.checkPre=response.data.previous
                    if (!this.checkPre) {
                        this.isCheckPreDisabled=true
                    }
                    else {
                        this.isCheckPreDisabled=false
                    }
                    // 判断是否有下一页
                    this.checkNext=response.data.next
                    if (!this.checkNext) {
                        this.isCheckNextDisabled=true
                    }
                    else {
                        this.isCheckNextDisabled=false
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
                    this.appCases=response.data.results
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
        get_checkNext() {
            this.axios.get(this.checkNext).then(response=>{
                // 判断是否成功
                if (!response.data.errcode) {
                    this.checkAppCases=response.data.results
                    // 判断是否有上一页
                    this.checkPre=response.data.previous
                    if (!this.checkPre) {
                        this.isCheckPreDisabled=true
                    }
                    else {
                        this.isCheckPreDisabled=false
                    }
                    // 判断是否有下一页
                    this.checkNext=response.data.next
                    if (!this.checkNext) {
                        this.isCheckNextDisabled=true
                    }
                    else {
                        this.isCheckNextDisabled=false
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
    },
    beforeCreate() {
    },
    created() {
        // 获取数据列表
        this.get_appCases()
        this.get_checkAppCases()
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
