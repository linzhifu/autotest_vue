<template>
    <div>
        <div id="login_img">
            <img src="../assets/img/login-img.png" alt="">
        </div>
        <el-tabs v-model="activeName" type="border-card" value="first">
            <!-- 用户名登陆 -->
            <el-tab-pane label="用户名登陆">
                <el-input v-model="username" placeholder="请输入用户名" clearable required></el-input>
                <el-input v-model="password" placeholder="请输入登陆密码" show-password clearable></el-input>
                <el-button id="login" type="primary" @click="login('username')">登陆</el-button>
            </el-tab-pane>
            <!-- 邮箱登陆 -->
            <el-tab-pane label="邮箱登陆" name="second">
                <el-input v-model="email" type="email" placeholder="请输入邮箱" clearable></el-input>
                        <el-input v-model="captcha" placeholder="请输入验证码" clearable>
                            <el-button slot="append" @click="get_captcha" :disabled="is_ok" style="margin:-10px 0">{{captcha_button}}</el-button>
                        </el-input>
                <el-button id="login" type="primary" @click="login('email')">登陆</el-button>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
/* eslint-disable */
export default {
    name: "Login",
    data(){
        return {
            url: this.url,
            axios: this.axios,
            username: '',
            email: '',
            password: '',
            captcha: '',
            activeName: '',
            storage: this.storage,
            is_ok: false,
            captcha_button: '获取验证码',
        }
    },
    methods: {
        // 用户登陆
        login(type) {
            // 验证邮箱格式
            if (type == 'email') {
                if (!this.check_email(this.email)) {
                    return
                }
            }
            // 验证用户名密码不能为空
            if (type == 'username') {
                if (!this.username) {
                    this.$message({
                        message: '用户名不能为空',
                        type: 'error',
                        center: true,
                    })
                    return
                }
                if (!this.password) {
                    this.$message({
                        message: '密码不能为空',
                        type: 'error',
                        center: true,
                    })
                    return
                }
            }
            var body_data = {
                'type': type,
                'username': this.username,
                'password': this.password,
                'email':this.email,
                'captcha': this.captcha,
            }
            this.axios({
                baseURL:this.url,
                url:'api/v1/login/',
                method:'post',
                data:body_data,
            }).then(response=>{
                // 判断是否登陆成功，登陆成功errcode为0
                if (!response.data.errcode) {
                    this.$message({
                        message: '登陆成功',
                        type: 'success',
                        center: true,
                    });
                    this.storage.setItem('userId',response.data.data.id)
                    this.storage.setItem('token',response.data.token)
                    // 登陆成功后跳转
                    this.$router.push({ path: '/home/'})
                }
                else {
                    this.$message({
                        message: response.data.errmsg,
                        type: 'error',
                        center: true,
                    })
                }
            },error=>{
                this.$message({
                    message: error.response.data,
                    type: 'error',
                    center: true,
                })
            })
        },
        // 获取验证码
        get_captcha() {
            if (!this.check_email(this.email)) {
                    return
                }
            var params_data = {'email':this.email}
            this.axios({
                baseURL:this.url,
                url:'api/v1/captcha/',
                method:'get',
                params:params_data,
            }).then(response=>{
                if (!response.data.errcode) {
                    this.$message({
                        message: '发送成功',
                        type: 'success',
                        center: true,
                    });
                    // this.is_ok = true;
                    var time = 60;
                    this.captcha_button = time+'s';
                    // 设置定时器30s
                    var interval=setInterval(()=>{
                        if (time<=1){
                            // 恢复按键    
                            this.is_ok = false;
                            clearInterval(interval);
                            this.captcha_button = '获取验证码'
                        }
                        else{
                            time--;
                            this.captcha_button = time+'s';
                        }
                    },1000)
                }
                else {
                    this.$message({
                        message: response.data.errmsg,
                        type: 'error',
                        center: true,
                    })
                }
            },error=>{
                this.$message({
                    message: error.response.data,
                    type: 'error',
                    center: true,
                })
            })
        },
        // 验证邮箱格式
        check_email(value) {
            var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
            var isok= reg.test(value);
            if (!isok) {
                this.$message({
                    message: '邮箱格式不对，请重新输入',
                    type: 'error',
                    center: true,
                })
                return false
            }
            return true
        },
    }
};
</script>

<style scoped>
    img {
        position: absolute;
        left: 160px;
        top: 120px;
    }
    .el-tabs {
        width: 400px;
        height: 300px;
        position: absolute;
        left: 800px;
        top: 180px;
        box-shadow: 15px 15px 4px rgba(0, 0, 0, .12);
        text-align: center;
    }
    .el-input {
        margin: 10px 0;
        width: 90%;
    }
    .el-input input{
    height: 50px;
    }
    .el-button {
    margin: 5px 0 40px 0;
    height: 50px;
    width: 90%;
    }
</style>
