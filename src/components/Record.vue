<template>
    <div>
        <!-- <el-row>
            <el-col :span="10"><ve-histogram :data="chartData"></ve-histogram></el-col>
        </el-row> -->
        <iframe id="myiframe" src="http://10.1.19.252:8081" height="720px" width="100%" scrolling="no" frameborder="0"></iframe>
    </div>
</template>

<script>
/* eslint-disable */
function changeFrameHeight(){
    var ifm= document.getElementById("myiframe");
    ifm.height=document.documentElement.clientHeight;
    }
    window.onresize=function(){
    changeFrameHeight();
}
export default {
    name: "Record",
    data() {
        return {
            axios: this.axios,
            url: this.url,
            userId: this.storage.getItem('userId'),
            token: this.storage.getItem('token'),
            chartData: {
                columns: ["日期", "测试总数", "PASS", "FAIL"],
                rows: [
                    { 日期: "2018-05-22", 测试总数: 10, PASS: 6, FAIL: 4 },
                    { 日期: "2018-05-23", 测试总数: 10, PASS: 5, FAIL: 5 },
                    { 日期: "2018-05-24", 测试总数: 10, PASS: 4, FAIL: 6 }
                ]
            }
        }
    },
    methods: {
        // get_records() {
        //     var params_data = {'userId':this.userId,'token':this.token, projectId: 52}
        //     this.axios({
        //         baseURL:this.url,
        //         url:'api/v1/getRecord/',
        //         method:'get',
        //         params:params_data,
        //     }).then(response=>{
        //         this.chartData.rows=response.data.records
        //     },error=>{
        //         this.$message({
        //             message: '匿名用户，请先登录',
        //             type: 'error',
        //             center: true,
        //             showClose: true,
        //         })
        //     })
        // }
    },
    created() {
        // this.get_records()
    }
};
</script>