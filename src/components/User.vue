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
            storage: this.storage,
            username: user.data.username,
            username_new: '',
            email: user.data.email,
            password_1: '',
            password_2: '',
            activeName:'1'
        }
    },
    methods: {
        // 修改用户名
        update_username() {
            var json_data = {
                'username': this.username_new
            }
            this.axios.patch(this.url+'api/v1/user/'+user.data.id+'/',json_data).then(response=>{
                // 判断是否登陆成功，登陆成功errcode为0
                if (!response.data.errcode) {
                    this.$message({
                        message: '修改成功',
                        type: 'success',
                        center: true,
                        showClose: true,
                    });
                    this.storage.setItem('user',JSON.stringify(response.data))
                    this.username = this.username_new
                    this.username_new = ''
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
                        message: error.response.data.username,
                        type: 'error',
                        center: true,
                    })
            })
        },
        // 修改密码
        update_password() {
            if (this.password_1 && this.password_1==this.password_2) {
                var json_data = {
                    'password': this.password_1
                }
                this.axios.patch(this.url+'api/v1/user/'+user.data.id+'/',json_data).then(response=>{
                    // 判断是否成功
                    if (!response.data.errcode) {
                        this.$message({
                            message: '修改成功,请重新登录',
                            type: 'success',
                            center: true,
                            showClose: true,
                        });
                        this.$router.push('/login/')
                    }
                    else {
                        this.$message({
                            message: "修改失败",
                            type: 'error',
                            center: true,
                            showClose: true,
                        })
                    }
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
    },
    beforeCreate() { 
        // 获取本地缓存最新数据user
        user = JSON.parse(window.localStorage.getItem('user'))
    },
}
</script>


<style scoped>
.el-collapse {
    width: 400px;
}
</style>

