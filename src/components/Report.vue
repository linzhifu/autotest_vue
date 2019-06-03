<template>
    <div>
        <!-- 返回上一级 -->
        <div v-if="this.$route.query.projectName">
            <a href="#" @click.prevent="go_back">
                <i class="el-icon-d-arrow-left"></i>返回上一级<br><br>
            </a>
        </div>
        <!-- 添加测试报告 -->
        <div>
            <el-button type="primary" @click="new_report()">添加测试报告</el-button>
            <el-select v-model="projectId" placeholder="请选择项目">
            <el-option
                v-for="item in project_options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select><br>
        </div><br>
        <!-- 测试报告列表 -->
        <div>
            <el-table
                stripe
                border
                empty-text="暂无项目"
                :data="reports.filter(data => !search || data.proname.toLowerCase().includes(search.toLowerCase()))"
                :header-cell-style="{background:'#ddd'}"
                highlight-current-row
                style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <h4>测试软件版本信息：</h4>
                        <span v-for="(val,key) in JSON.parse(scope.row.version)" :key="key">
                            {{key}}：{{val}}
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;
                        </span>
                        <h4>Release Note：</h4>
                        <pre> {{scope.row.releaseNote}}</pre>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="proname"
                    label="项目">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="username"
                    label="创建人">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="创建时间"
                    prop="update_time"
                    sortable>
                    <template slot-scope="scope">
                        <p>{{scope.row.update_time|dateFormat}}</p>
                    </template>
                </el-table-column>
                <el-table-column align="center" width="280">
                    <template slot="header" slot-scope="scope">
                        <el-input v-model="search" size="mini" placeholder="输入关键字搜索"/>
                    </template>
                    <template slot-scope="scope">
                        <a :href="scope.row.update_time|dateLogFormat">
                        <el-button
                            size="mini"
                            type="primary"
                            class="el-icon-download">
                        </el-button>
                        </a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete">
                        </el-button>
                    </template>
                </el-table-column>
            </el-table><br>
            <!-- 翻页 -->
            <div style="text-align: center;">
                <el-button type="primary" :disabled="isPreDisabled" @click="get_pre">上一页</el-button>
                <el-button type="primary" :disabled="isNextDisabled" @click="get_next">下一页</el-button>
            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
export default {
    name: 'Report',
    data() {
        return {
            axios: this.axios,
            url: this.url,
            userId: this.storage.getItem('userId'),
            token: this.storage.getItem('token'),
            reports:[],
            project_options:[],
            projectId: '',
            search:this.$route.query.projectName,
            pre:'',
            next:'',
            isNextDisabled:false,
            isPreDisabled:false,
        }
    },
    methods: {
        // 返回上一级
        go_back() {
            this.$router.back(-1)
        },
        // 获取测试报告记录
        get_reports () {
            var params_data = {'userId':this.userId,'token':this.token}
            this.axios({
                baseURL:this.url,
                url:'api/v1/report/',
                method:'get',
                params:params_data,
            }).then(response=>{
                this.reports=response.data.results
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
        // 添加测试报告
        new_report() {
            if (!this.projectId) {
                this.$message({
                    message: "请选择项目",
                    type: 'error',
                    center: true
                })
                return
            }
            for (var i=0;i<this.project_options.length;i++) {
                console.log(this.project_options[i])
                if (this.project_options[i]['value']==this.projectId) {
                    // 量产云平台报告
                    if (this.project_options[i]['label']=='量产云平台') {
                        var url = '/home/mpcloud'
                        var query = {
                            projectId:this.projectId,
                            projectName:this.project_options[i]['label']
                        }
                        this.$router.push({ path: url, query:query})
                        return
                    }
                }
            }
        },
        // 上一页
        get_pre() {
            this.axios({
                url:this.pre,
                method:'get',
            }).then(response=>{
                // 判断是否成功
                if (!response.data.errcode) {
                    this.projects=response.data.results
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
        // 下一页
        get_next() {
            this.axios({
                url:this.next,
                method:'get',
            }).then(response=>{
                // 判断是否成功
                if (!response.data.errcode) {
                    this.reports=response.data.results
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
        // 下载
        download(row) {
            alert(row.proname)
        },
        // 删除数据
        handleDelete(index, row) {
            this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
                distinguishCancelAndClose: true,
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                var params_data = {'userId':this.userId,'token':this.token}
                this.axios({
                    baseURL:this.url,
                    url:'api/v1/report/'+row.id+'/',
                    method:'delete',
                    params:params_data,
                }).then(response=>{
                    // 判断是否成功
                    if (!response.data.errcode) {
                        // this.$message({
                        //     message: '删除成功',
                        //     type: 'success',
                        //     center: true
                        // });
                        var fileName = this.dateLogFormat(row.update_time)
                        this.axios({
                            baseURL:this.url,
                            url:'api/v1/mpcloudExcel/?fileName='+fileName,
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
                        this.get_reports()
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
            }).catch(action=>{
                // console.log(action)
            })
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
        dateLogFormat(time) {
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
            return year+month+day+hours+minutes+seconds+'.xlsx';
        }
    },
    created() {
        this.get_reports()
        this.get_projects()
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
        },
        dateLogFormat:function(time) {
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
            var reportUrl='http://172.16.9.88:8081/reports/'
            // 拼接
            // return 'http://172.16.9.88:8081/reports/20190529171104.txt'
            return reportUrl+year+month+day+hours+minutes+seconds+'.xlsx';
        }
    }
}
</script>
