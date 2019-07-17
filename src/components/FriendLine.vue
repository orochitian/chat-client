<template>
    <div class="line">
        <Avatar :src="img" class="img" />
        <div class="text-bg" v-html="msg"></div>
    </div>
</template>

<script>
    export default {
        name: "patient-chat",
        props: ['img', 'msg']
    }
</script>

<style scoped lang="scss">
    .line{
        margin: 30px 0;
        .img{
            width: 40px;
            height: 40px;
            margin-right: 18px;
        }
        .text-bg{
            position: relative;
            border-radius: 4px;
            word-break: break-all;
            vertical-align: top;
            display: inline-block;
            max-width: 50%;
            padding: 6px 12px;
            background-color: #fff;
            margin-top: 4px;
            box-shadow: 0 0 6px 0px #ccc;
            letter-spacing: 1px;
            &:before{
                position: absolute;
                content: '';
                border-right: 10px solid #fff;
                border-top: 4px solid transparent;
                border-left: 10px solid transparent;
                border-bottom: 4px solid transparent;
                top: 10px;
                left: -20px;
            }
        }
    }
</style>