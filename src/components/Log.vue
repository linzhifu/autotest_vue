<template>
    <div>
        <iframe id="myiframe" src="http://172.16.9.88:8081" height="720px" width="100%" scrolling="no" frameborder="0"></iframe>
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
    name: "Log",
    data() {
        return {
            axios: this.axios,
            url: this.url,
            userId: this.storage.getItem('userId'),
            token: this.storage.getItem('token'),
        }
    },
};
</script>

<style scoped>
</style>
