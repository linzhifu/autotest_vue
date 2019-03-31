<template>
<div>
    <!-- 返回上一级 -->
    <a href="#" @click.prevent="go_back"><i class="el-icon-d-arrow-left"></i>返回上一级</a>
    <br><br>
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
                        <el-form label-width="100px">
                            <el-form-item v-for="(value, key) in params[scope.row.id]" :key="key" :label="key">
                                <el-input v-model="params[scope.row.id][key]" style="width:500px"></el-input>
                                <el-button
                                 size="mini"
                                 type="danger"
                                 icon="el-icon-delete"
                                 @click.prevent="removeLabel(params[scope.row.id],key)">
                                </el-button>
                            </el-form-item>
                        </el-form>
                        <el-button
                         size="mini"
                         type="primary"
                         @click="addLabel(params[scope.row.id])" class="el-icon-plus">添加Param
                        </el-button>
                        <el-button
                         size="mini"
                         type="primary"
                         @click="edit_param(scope.row.id,'apiparam',params[scope.row.id])" class="el-icon-edit">提交修改
                        </el-button>
                    </el-tab-pane>
                    <!-- body -->
                    <el-tab-pane label="Body">
                        <el-form label-width="100px">
                            <el-form-item v-for="(value, key) in body[scope.row.id]" :key="key" :label="key">
                                <el-input v-model="body[scope.row.id][key]" style="width:500px"></el-input>
                                <el-button
                                 size="mini"
                                 type="danger"
                                 icon="el-icon-delete"
                                 @click.prevent="removeLabel(body[scope.row.id],key)">
                                </el-button>
                            </el-form-item>
                        </el-form>
                        <el-button
                         size="mini"
                         type="primary"
                         @click="addLabel(body[scope.row.id])" class="el-icon-plus">添加Param
                        </el-button>
                        <el-button
                         size="mini"
                         type="primary"
                         @click="edit_param(scope.row.id,'apijson',body[scope.row.id])" class="el-icon-edit">提交修改
                        </el-button>
                    </el-tab-pane>
                    <!-- response -->
                    <el-tab-pane label="Response">
                        <el-form label-width="100px">
                            <el-form-item v-for="(value, key) in response[scope.row.id]" :key="key" :label="key">
                                <el-input v-model="response[scope.row.id][key]" style="width:500px"></el-input>
                                <el-button
                                 size="mini"
                                 type="danger"
                                 icon="el-icon-delete"
                                 @click.prevent="removeLabel(response[scope.row.id],key)">
                                </el-button>
                            </el-form-item>
                        </el-form>
                        <el-button
                         size="mini"
                         type="primary"
                         @click="addLabel(response[scope.row.id])" class="el-icon-plus">添加Param
                        </el-button>
                        <el-button
                         size="mini"
                         type="primary"
                         @click="edit_param(scope.row.id,'apiresponse',response[scope.row.id])" class="el-icon-edit">提交修改
                        </el-button>
                    </el-tab-pane>
                <el-tab-pane label="测试数据">
                    <el-button
                        size="mini"
                        type="primary"
                        @click.prevent="apiTest(scope.row)">测试
                    </el-button>
                    <br>
                    <pre style="font-size:14px" v-text="error"></pre>
                </el-tab-pane>
                </el-tabs>
            </template>
        </el-table-column>
        <el-table-column label="名称" align="center" prop="apiname">
        </el-table-column>
        <el-table-column label="请求方法" align="center" prop="apimethod">
        </el-table-column>
        <el-table-column label="URL" align="center" prop="apiurl">
        </el-table-column>
        <el-table-column label="后端" align="center" prop="apiManagerName">
        </el-table-column>
        <el-table-column label="测试结果" align="center">
            <template slot-scope="scope">
                <p v-if="scope.row.apistatus" style="color:green">PASS</p>
                <p v-else style="color:red">FAIL</p>
            </template>
        </el-table-column>
        <el-table-column label="最近修改" align="center">
            <template slot-scope="scope">
                <p>{{scope.row.update_time|dateFormat}}</p>
            </template>
        </el-table-column>
        <el-table-column label="Index" align="center" prop="index" sortable>
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
            <el-input v-model="editObj.index" autocomplete="off"></el-input>
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
            token: this.storage.getItem('token'),
            apiname: '',
            apiurl:'',
            apiparams:{},
            apibody:{},
            search: '',
            apiCases: [],
            pre:'',
            next:'',
            error:'请按测试按键开始API测试',
            apiManagerId: this.$route.query.apiManagerId,
            isNextDisabled:false,
            isPreDisabled:false,
            dialogFormVisible:false,
            editObj:{
                apiname:'',
                apimethod:'',
                apiurl:'',
                apiparam:'',
                apijson:'',
                apiresponse:'',
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
        // API测试
        apiTest(row) {
            this.axios({
                baseURL:row.apiManagerUrl,
                url:row.apiurl,
                method:row.apimethod,
                params:this.params[row.id],
                data:this.body[row.id],
            }).then(response=>{
                console.log(response.data)
                this.error = response.data
                if (!this.error.errcode) {
                     this.$message({
                        message: 'PASS',
                        type: 'success',
                        center: true,
                        showClose: true,
                    });
                }
                else {
                    this.$message({
                        message: 'FAIL',
                        type: 'error',
                        center: true,
                        showClose: true,
                    })
                }
            },error=>{
                console.log(error.response.data)
                this.error=error.response.data
            })
        },
        // 编辑参数——删除一项
        removeLabel(object, key) {
            this.$confirm('提交修改后将永久删除, 是否继续?', '提示', {
                distinguishCancelAndClose: true,
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(() => {
                // 必须用这种全局方法，Vue才能监控数据变化
                this.$delete(object,key)
            }).catch(() => {
            })
        },
        //编辑参数-添加一项
        addLabel(object) {
            this.$prompt('请输入param名称', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                this.$set(object,value,'')
            })
        },
        //编辑-提交param
        edit_param(id,key,value) {
            var row = {
            }
            row['id'] = id
            row[key] = JSON.stringify(value)
            // console.log(row)
            this.handleEdit(row)
        },
        // 获取数据列表
        get_apiCases() {
            var params,body,response_obj
            var params_data = {'userId':this.userId,'token':this.token}
            var url = 'api/v1/apiCase/?apiManager='+this.apiManagerId
            this.axios({
                baseURL:this.url,
                url:url,
                method:'get',
                params:params_data,
            }).then(response=>{
                // 判断是否成功
                if (!response.data.errcode) {
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
            this.editObj = row
        },
        // 编辑修改数据
        handleEdit(row) {
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
                    this.get_apiCases()
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
                    'apiManager': this.apiManagerId,
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
    },
    beforeCreate() {
    },
    created() {
        // 获取数据列表
        this.get_apiCases()
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
