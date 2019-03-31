<template>
<div>
    <!-- 返回上一级 -->
    <a href="#" @click.prevent="go_back"><i class="el-icon-d-arrow-left"></i>返回上一级</a>
    <br><br>
    <!-- 添加web操作 -->
    <div>
        <el-button type="primary" @click="new_webcase">添加步骤</el-button>
        <el-input placeholder="请输入名称" v-model="webname" style="width:200px"></el-input>
        <el-input placeholder="请输入操作类型" v-model="weboprateOBj" style="width:200px"></el-input>
        <br><br>
    </div>
    <!-- 前端selenium操作步骤 -->
    <el-collapse accordion>
        <el-collapse-item v-for="(oprateObj,key) in oprateObjs" :title="oprateObj" :name="oprateObj" :key="key">
            <el-button type="primary" @click="webTest(oprateObj)">开始测试</el-button><br><br>
            <el-table
            border
            stripe
            :data="webCases.filter(data => (!search || data.webname.toLowerCase().includes(search.toLowerCase())) && data.oprateOBj.toLowerCase().includes(oprateObj))"
            empty-text="暂无项目"
            :default-sort = "{prop: 'index', order: 'ascending'}"
            :header-cell-style="{background:'#ddd'}"
            highlight-current-row>
                <el-table-column label="步骤" align="center" prop="webname">
                </el-table-column>
                <el-table-column label="CSS选择器" align="center" prop="webcss">
                </el-table-column>
                <el-table-column label="元素操作" align="center" prop="weboprate">
                </el-table-column>
                <el-table-column label="操作参数" align="center" prop="webparam">
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
        </el-collapse-item>
    </el-collapse>
    <!-- 修改数据 -->
    <el-dialog :visible.sync="dialogFormVisible">
        <el-form>
            <el-form-item label="步骤" label-width="120px">
            <el-input v-model="editObj.webname" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <el-form >
            <el-form-item label="Css选择器" label-width="120px">
            <el-input v-model="editObj.webcss" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <el-form >
            <el-form-item label="元素操作" label-width="120px">
            <el-input v-model="editObj.weboprate" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <el-form >
            <el-form-item label="操作参数" label-width="120px">
            <el-input v-model="editObj.webparam" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <el-form >
            <el-form-item label="Index" label-width="120px">
            <!-- <el-input v-model="editObj.index" autocomplete="off"></el-input> -->
            <el-input-number v-model="editObj.index" controls-position="right"></el-input-number>
            </el-form-item>
        </el-form>
        <el-form >
            <el-form-item label="操作类型" label-width="120px">
            <el-input v-model="editObj.oprateOBj" autocomplete="off"></el-input>
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
    name:'WebCase',
    data() {
        return {
            axios: this.axios,
            url: this.url,
            userId: this.storage.getItem('userId'),
            token: this.storage.getItem('token'),
            webname: '',
            weburl:'',
            weboprateOBj:'',
            search: '',
            webCases: [],
            pre:'',
            next:'',
            webManagerId: this.$route.query.webManagerId,
            isNextDisabled:false,
            isPreDisabled:false,
            dialogFormVisible:false,
            editObj:{
                id:'',
                webname:'',
                webcss:'',
                weboprate:'',
                webparam:'',
                index:'',
                oprateOBj:'',
            },
            testObj:{},
            oprateObjs:[]
        }
    },
    methods: {
        // 返回上一级
        go_back() {
            this.$router.back(-1)
        },
        // 前端测试
        webTest(oprateObj) {
            this.axios({
                baseURL:this.url,
                url:'/api/v1/webTest/',
                method:'post',
                params:{'url': this.weburl},
                data:this.testObj[oprateObj],
            }).then(response=>{
                alert('ok')
                console.log(response.data)
            },error=>{
                alert('error')
                console.log(error.response.data)
            })
        },
        // 获取数据列表
        get_webCases() {
            var params_data = {'userId':this.userId,'token':this.token}
            this.axios({
                baseURL:this.url,
                url:'api/v1/webCase/?webManager='+this.webManagerId,
                method:'get',
                params:params_data,
            }).then(response=>{
                this.webCases=[]
                this.testObj=[]
                this.weburl = ''
                this.oprateObjs = []
                for (var i=0;i<response.data.results.length;i++){
                    this.webCases.push(response.data.results[i])
                    var element = {}
                    element['css']=response.data.results[i].webcss
                    element['method']=response.data.results[i].weboprate
                    element['param']=response.data.results[i].webparam
                    if (!this.weburl) {
                        this.weburl = response.data.results[i].weburl
                    }
                    if (this.oprateObjs.indexOf(response.data.results[i].oprateOBj)==-1) {
                        this.oprateObjs.push(response.data.results[i].oprateOBj)
                        this.$set(this.testObj,response.data.results[i].oprateOBj,[])
                    }
                    this.testObj[response.data.results[i].oprateOBj].push(element)
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
            this.editObj['webname']=row.webname
            this.editObj['webcss']=row.webcss
            this.editObj['weboprate']=row.weboprate
            this.editObj['webparam']=row.webparam
            this.editObj['oprateOBj']=row.oprateOBj
            this.editObj['index']=row.index
        },
        // 编辑修改数据
        handleEdit(row) {
            this.dialogFormVisible = false
            var params_data = {'userId':this.userId,'token':this.token}
            this.axios({
                baseURL:this.url,
                url:'api/v1/webCase/'+row.id+'/',
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
                    this.get_webCases()
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
                    url:'api/v1/webCase/'+row.id+'/',
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
                        this.get_webCases()
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
            })
        },
        // 添加数据
        new_webcase() {
            var body_data = {
                    'webname': this.webname,
                    'oprateOBj': this.weboprateOBj,
                    'webManager': this.webManagerId,
                    'user':this.userId
                }
            var params_data = {'userId':this.userId,'token':this.token}
            this.axios({
                baseURL:this.url,
                url:'api/v1/webCase/',
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
                    this.get_webCases()
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
            this.webname=''
            this.weboprateOBj=''
        },
        // 上一页
        get_pre() {
            this.axios.get(this.pre).then(response=>{
                // 判断是否成功
                if (!response.data.errcode) {
                    this.$message({
                        // message: '加载成功',
                        // type: 'success',
                        // center: true,
                        // showClose: true,
                    });
                    this.webCases=[]
                    for (var i=0;i<response.data.results.length;i++){
                        this.webCases.push(response.data.results[i])
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
                    this.webCases=[]
                    for (var i=0;i<response.data.results.length;i++){
                        this.webCases.push(response.data.results[i])
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
        // 获取本地缓存最新数据user
        user = JSON.parse(window.localStorage.getItem('user'))
    },
    created() {
        // 获取数据列表
        this.get_webCases()
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
