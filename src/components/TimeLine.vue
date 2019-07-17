<template>
    <div class="time" v-html="msg"></div>
</template>

<script>
    export default {
        name: "patient-chat",
        props: ['msg']
    }
</script>

<style scoped lang="scss">
    .time{
        width: 240px;
        padding: 5px 0;
        background-color: #ffffff;
        border-radius: 15px;
        opacity: 0.75;
        text-align: center;
        margin: 30px auto;
        font-size: 13px;
        color: #a8a8a8;
    }
</style>