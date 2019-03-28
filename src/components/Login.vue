<template>
    <div>
        <div id="login_img">
            <img src="../assets/img/login-img.png" alt="">
        </div>
        <el-tabs v-model="activeName" type="border-card" value="first">
            <!-- 用户名登陆 -->
            <el-tab-pane label="用户名登陆">
                <el-input v-model="username" placeholder="请输入用户名" clearable></el-input>
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
            captcha_button: '获取验证码'
        }
    },
    methods: {
        login(type) {
            // alert(this.username+'---'+this.password+'---'+type)
            var json_data = {
                'type': type,
                'username': this.username,
                'password': this.password,
                'email':this.email,
                'captcha': this.captcha,
            }
            this.axios.post(this.url+'api/v1/login/',json_data).then(response=>{
                // 判断是否登陆成功，登陆成功errcode为0
                if (!response.data.errcode) {
                    this.$message({
                        message: '登陆成功',
                        type: 'success',
                        center: true,
                    });
                    this.storage.setItem('user',JSON.stringify(response.data))
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
            })
        },
        get_captcha() {
            this.axios.get(this.url+'api/v1/captcha/?email='+this.email).then(response=>{
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
            })
        }
    }
};
</script>

<style scoped>
    body {
        background: #93defe;
    }
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
