<template>
    <div>
        <!-- 返回上一级 -->
        <a href="#" @click.prevent="go_back">
            <i class="el-icon-d-arrow-left"></i>返回上一级<br><br>
        </a>
        <div style="font-size:17px;margin-bottom:10px" v-if="this.$route.query.projectName">
            项目：{{this.$route.query.projectName}}
        </div>
        <div style="font-size:17px;margin-bottom:10px" v-if="this.$route.query.appName">
            app：{{this.$route.query.appName}}
        </div>
        <div style="font-size:17px;margin-bottom:10px" v-if="this.$route.query.apiName">
            后端：{{this.$route.query.apiName}}
        </div>
        <div style="font-size:17px" v-if="this.$route.query.webName">
            前端：{{this.$route.query.webName}}
        </div><br>
        我是脚本编辑器
    </div>
</template>

<script>
/* eslint-disable */
export default {
    name:'Src',
    methods: {
        // 返回上一级
        go_back() {
            this.$router.back(-1)
        },
    }
}
</script>