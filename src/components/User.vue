<template>
<div>
    <el-collapse v-model="activeName" accordion>
        <el-collapse-item title="个人资料" name="1">
            <p>用户名：{{username}}</p>
            <p>邮箱&nbsp;&nbsp;&nbsp;&nbsp;：{{email}}</p>
        </el-collapse-item>
        <el-collapse-item title="修改用户名" name="2">
            <br>
            <el-input placeholder="请输入用户名" v-model="username_new" clearable>
            </el-input>
            <br><br>
            <el-button type="primary" @click="update_username">确认</el-button>
        </el-collapse-item>
        <el-collapse-item title="修改密码" name="3">
            <br>
            <el-input v-model="password_1" placeholder="请输入密码，确保两次输入一致" show-password clearable>
            <template slot="prepend">密码</template>
            </el-input>
            <br><br>
            <el-input v-model="password_2" placeholder="请输入密码，确保两次输入一致" show-password clearable>
            <template slot="prepend">密码</template>
            </el-input>
            <br><br>
            <el-button type="primary" @click="update_password">修改密码</el-button>
        </el-collapse-item>
    </el-collapse>
    <br><br>
    <el-button type="danger" @click="logout">注销用户</el-button>
</div>
</template>

<script>
/* eslint-disable */
var user;
export default {
    name: 'User',
    data() {
        return {
            axios: this.axios,
            url: this.url,
            userId: this.storage.getItem('userId'),
            token: this.storage.getItem('token'),
            username: '',
            username_new: '',
            email: '',
            password_1: '',
            password_2: '',
            activeName:'1'
        }
    },
    methods: {
        // 获取用户信息
        get_user() {
            var params_data = {'userId':this.userId,'token':this.token}
            this.axios({
                baseURL:this.url,
                url:'v1/user/'+this.userId+'/',
                method:'get',
                params:params_data,
            }).then(response=>{
                this.username = response.data.data.username
                this.email = response.data.data.email
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
        // 修改用户名
        update_username() {
            var params_data = {'userId':this.userId,'token':this.token}
            var body_data = {'username': this.username_new}
            this.axios({
                baseURL:this.url,
                url:'v1/user/'+this.userId+'/',
                method:'patch',
                params:params_data,
                data:body_data,
            }).then(response=>{
                // 判断是否成功，成功errcode为0
                if (!response.data.errcode) {
                    this.$message({
                        message: '修改成功',
                        type: 'success',
                        center: true,
                        showClose: true,
                        duration:0,
                    });
                    this.username = this.username_new
                    this.username_new = ''
                }
                else {
                    this.$message({
                        message: "修改失败",
                        type: 'error',
                        center: true,
                        showClose: true,
                        duration:0,
                    })
                }
            },error=>{
                this.$message({
                    message: '自动化测试平台异常，请检查网络',
                    type: 'error',
                    center: true,
                    showClose: true,
                    duration:0,
                })
            })
        },
        // 修改密码
        update_password() {
            if (this.password_1 && this.password_1==this.password_2) {
                var params_data = {'userId':this.userId,'token':this.token}
                var body_data = {'password': this.password_1}
                this.axios({
                    baseURL:this.url,
                    url:'v1/user/'+this.userId+'/',
                    method:'patch',
                    params:params_data,
                    data:body_data,
                }).then(response=>{
                    // 判断是否成功
                    if (!response.data.errcode) {
                        this.$message({
                            message: '修改成功',
                            type: 'success',
                            center: true,
                            showClose: true,
                            duration:0,
                        });
                    }
                    else {
                        this.$message({
                            message: "修改失败",
                            type: 'error',
                            center: true,
                            showClose: true,
                            duration:0,
                        })
                    }
                },error=>{
                    this.$message({
                        message: '自动化测试平台异常，请检查网络',
                        type: 'error',
                        center: true,
                        showClose: true,
                        duration:0,
                    })
                })
            }
            else {
                this.$message({
                        message: "两次密码不一致，请重新输入",
                        type: 'error',
                        center: true,
                        showClose: true,
                })
            }
            this.password_1 = this.password_2 = ''
        },
        // 注销用户
        logout() {
            this.storage.removeItem('userId')
            this.storage.removeItem('token')
            this.$router.push('/')
        }
    },
    beforeCreate() {
    },
    created() {
        this.get_user()
    }
}
</script>


<style scoped>
.el-collapse {
    width: 400px;
}
</style>

