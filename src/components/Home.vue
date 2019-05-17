<template>
<el-container>
    <el-header>
            <el-menu mode="horizontal"
             :default-active="$route.path"
             background-color="#545c64"
             text-color="#fff"
             active-text-color="#ffd04b"
            router>
            <el-menu-item index="/home/user">
                <i class="el-icon-thirdshanghuhaopeizhi"></i>
                <span slot="title">用户中心</span>
            </el-menu-item>
            <el-menu-item index="/home/project">
                <i class="el-icon-menu"></i>
                <span slot="title">项目中心</span>
            </el-menu-item>
            <el-menu-item index="/home/webManager/" disabled>
                <i class="el-icon-thirdhoutaicaozuorizhi-"></i>
                <span slot="title">前端测试</span>
            </el-menu-item>
            <el-menu-item index="/home/apiManager/">
                <i class="el-icon-thirdduanxintongji-"></i>
                <span slot="title" disabled>后端测试</span>
            </el-menu-item>
            <el-menu-item index="/home/record/">
                <i class="el-icon-document"></i>
                <span slot="title">测试LOG</span>
            </el-menu-item>
            </el-menu>
    </el-header>
    <el-main>
        <router-view></router-view>
    </el-main>
</el-container>
</template>

<script>
/* eslint-disable */
export default {
    name: 'Home'
}
</script>

<style scoped>
.el-header{
    padding: 0;
}
</style>
