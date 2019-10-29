<template>
    <div>
        <!-- 返回上一级 -->
        <a href="#" @click.prevent="go_back">
            <i class="el-icon-d-arrow-left"></i>返回上一级<br><br>
        </a>
        <el-card class="box-card"  shadow='hover' :body-style=body_style>
            <div slot="header" class="clearfix">
                <span style="font-size:14px;margin-bottom:10px;" v-if="this.$route.query.projectName">
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    项目：{{this.$route.query.projectName}}
                    &nbsp;&nbsp;&nbsp;&nbsp;
                </span>
                <span style="font-size:14px;margin-bottom:10px;" v-if="this.$route.query.type == 'app'">
                    app：{{this.$route.query.appName}}
                </span>
                <span style="font-size:14px;margin-bottom:10px;" v-if="this.$route.query.type == 'api'">
                    后端：{{this.$route.query.appName}}
                </span>
                <span style="font-size:14px;margin-bottom:10px;" v-if="this.$route.query.type == 'web'">
                    前端：{{this.$route.query.appName}}
                </span>
                <!-- 测试 -->
                <el-button
                    type="primary"
                    size="mini"
                    @click="get_appTest"
                    style="float:right"
                    :loading="loading">{{testBtn}}
                </el-button>
            </div>
            <div>
                <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit">
                    <el-tab-pane
                        :key="item.name"
                        v-for="item in editableTabs"
                        :label="item.title"
                        :name="item.name">
                        <editor
                            height="500"
                            v-model="item.content"
                            :options="options"
                            lang="python"
                            theme="crimson_editor"
                            @input="inputEdit(item)">
                        </editor><br>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <el-button
                            type="primary"
                            size="mini"
                            @click="edit_appsrc(item)" style=""
                            v-if='srcUser==userId || userId==2'>{{editBtnText}}
                        </el-button><br><br>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-card>
    </div>
</template>

<script>
/* eslint-disable */
import editor from 'vue2-ace-editor'
import 'brace/mode/python'
import 'brace/mode/javascript'
import 'vue2-ace-editor/node_modules/brace/snippets/python'
import 'brace/theme/crimson_editor'
import 'brace/theme/chrome'
import 'brace/ext/language_tools'
export default {
    name:'Src',
    data() {
        return {
            axios: this.axios,
            url: this.url,
            userId: this.storage.getItem('userId'),
            token: this.storage.getItem('token'),
            srcUser:this.$route.query.userid,
            testBtn:'开始测试',
            loading: false,
            editBtnText:'保存',
            body_style: {
                padding: '20px',
                background:''        
                },
            options: {
                // 目前功能不明
                enableBasicAutocompletion: true,
                // 代码块提示，如if
                enableSnippets: true,
                // 自动补全
                enableLiveAutocompletion: true,
                // 语法高亮
                highlightActiveLine: true,
                // 只读
                readOnly: true
            },
            editableTabsValue:'main',
            editableTabs: [],
        }
    },
    methods: {
        // 返回上一级
        go_back() {
            if (this.editBtnText == '提交修改*') {
                this.$confirm('脚本未保存，是否确定离开?', '提示', {
                    distinguishCancelAndClose: true,
                    type: 'warning',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    }).then(() => {
                        this.$router.back(-1)
                    }).catch(() => {
                })
            }
            else {
                this.$router.back(-1)
            }
            
        },
        // 用户输入状态监控
        inputEdit(item) {
            // 用*标记未保存文件
            item.title = item.name + '*.' + item.title.split('.')[1]
        },
        // 编辑脚本
        handleTabsEdit(targetName, action) {
            if (this.srcUser!=this.userId && this.userId!=2) {
                this.$message({
                    message: '没有权限',
                    type: 'error',
                    center: true
                })
                return
            }
            // 添加脚本
            if (action === 'add') {
                this.$prompt('请输入文件名', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({ value }) => {
                    var item = {
                        title:value + '.py',
                        name:value,
                        content:'# 目前只支持python3文件'
                    }
                    this.edit_appsrc(item)
                    this.editableTabs.push(item)
                    this.editableTabsValue = value
                }).catch(() => {   
                });
            }
            // 删除文件
            if (action === 'remove') {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    distinguishCancelAndClose: true,
                    type: 'warning',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(() => {
                    if (targetName == 'main') {
                        this.$message({
                            message: 'main.py 文件不允许删除',
                            type: 'error',
                            center: true
                        })
                        return
                    }
                    var params_data = {'userId':this.userId,'token':this.token}
                    var item
                    this.editableTabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            item = tab
                            item.index = index
                        }
                    })
                    var data = {
                        type:this.$route.query.type,
                        id:this.$route.query.id,
                        src:item
                    }
                    this.axios({
                        baseURL:this.url,
                        url:'api/v1/saveSrc',
                        method:'delete',
                        params:params_data,
                        data:data
                    }).then(response=>{
                        // 判断是否成功
                        if (!response.data.errcode) {
                            this.$message({
                                message: '删除成功',
                                type: 'success',
                                center: true
                            });
                            // 删除当前显示的页面,切换到main.py
                            if (targetName == this.editableTabsValue) {
                                this.editableTabsValue = 'main'
                            }
                            // 删除选中页面
                            this.editableTabs.splice(item.index,1)
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
            }   
        },
        // 开始脚本测试
        get_appTest() {
            this.$confirm('1 测试大约需几分钟请耐心等待 </br> \
                2 即将开始测试', '提示', {
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
                    var url = 'api/v1/saveSrc/'
                    var params_data = {
                        'userId':this.userId,
                        'token':this.token,
                        'type':this.$route.query.type,
                        'id':this.$route.query.id,
                    }
                    this.axios({
                        baseURL:this.url,
                        url:url,
                        method:'patch',
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
        // 获取脚本
        get_appSrc() {
            var url = 'api/v1/saveSrc/'
            var params_data = {
                'userId':this.userId,
                'token':this.token,
                'type':this.$route.query.type,
                'id':this.$route.query.id,
            }
            this.axios({
                baseURL:this.url,
                url:url,
                method:'get',
                params:params_data,
            }).then(response=>{
                this.editableTabs=response.data.src
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
         // 编辑测试脚本
        edit_appsrc(item) {
            var params_data = {'userId':this.userId,'token':this.token}
            var data = {
                type:this.$route.query.type,
                id:this.$route.query.id,
                src:item
            }
            this.axios({
                baseURL:this.url,
                url:'api/v1/saveSrc/',
                method:'post',
                params:params_data,
                data:data,
            }).then(response=>{
                // 判断是否成功
                if (!response.data.errcode) {
                    this.$message({
                        message: '提交成功',
                        type: 'success',
                        center: true
                    });
                    item.title = item.name + '.' + item.title.split('.')[1]
                }
                else {
                    this.$message({
                        message: "提交失败",
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
        }
    },
    components: {
        editor
    },
    computed: {
    },
    created() {
        this.get_appSrc()
        if (this.$route.query.userid==this.userId || this.userId==2) {
            this.options.readOnly = false
        }
    }
}
</script>