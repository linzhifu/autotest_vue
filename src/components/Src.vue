<template>
    <div>
        <!-- 返回上一级 -->
        <a href="#" @click.prevent="go_back">
            <i class="el-icon-d-arrow-left"></i>返回上一级<br><br>
        </a>
        <el-card class="box-card"  shadow='hover' :body-style=body_style>
            <div slot="header" class="clearfix">
                <div style="font-size:14px;margin-bottom:0px;float:left" v-if="this.$route.query.projectName">
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    项目：{{this.$route.query.projectName}}
                    &nbsp;&nbsp;&nbsp;&nbsp;
                </div>
                <div style="font-size:14px;margin-bottom:0px;float:left" v-if="this.$route.query.type == 'app'">
                    app：{{this.$route.query.appName}}
                </div>
                <div style="font-size:14px;margin-bottom:0px;float:left" v-if="this.$route.query.type == 'api'">
                    后端：{{this.$route.query.appName}}
                </div>
                <div style="font-size:14px;float:left" v-if="this.$route.query.type == 'web'">
                    前端：{{this.$route.query.appName}}
                </div>
                <div style="float: right;margin-bottom:10px;text-align:center">
                    <!-- 修改 -->
                    <el-button
                        type="primary"
                        size="mini"
                        @click="edit_appsrc" style=""
                        v-if='this.$route.query.userid==userId || userId==2'>{{editBtnText}}
                    </el-button>
                    <!-- 测试 -->
                    <el-button
                        type="primary"
                        size="mini"
                        @click="get_appTest"
                        :loading="loading">{{testBtn}}
                    </el-button>
                </div>
            </div>
            <div>
                <editor
                    height="800"
                    v-model="code"
                    :options="options"
                    lang="python"
                    theme="crimson_editor">
                </editor>
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
            code:'',
            old_code:'',
            testBtn:'开始测试',
            loading: false,
            body_style: {
                padding: '0px',
                background:'#eee'        
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
            }
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
        // 脚本测试
        get_appTest() {
            this.$confirm('1 请确认移动端是否开启开发者模式并连接测试PC </br> \
                2 请确认是否已打开appium服务端 </br> \
                3 测试大约需几分钟请耐心等待 </br> \
                4 即将开始全部自定义测试', '提示', {
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
                this.code=response.data.src
                this.old_code = response.data.src
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
        edit_appsrc() {
            var params_data = {'userId':this.userId,'token':this.token}
            var data = {
                type:this.$route.query.type,
                id:this.$route.query.id,
                src:this.code
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
                    this.old_code = this.code
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
        editBtnText: function() {
            if (this.code != this.old_code) {
                return '提交修改*'
            }
            else {
                return '提交修改 '
            }
        }
        
    },
    created() {
        this.get_appSrc()
        if (this.$route.query.userid==this.userId || this.userId==2) {
            this.options.readOnly = false
        }
    }
}
</script>