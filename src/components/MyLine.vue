<template>
    <div class="line" @dblclick="doubleClick">
        <div class="text-bg" v-html="msg"></div>
        <Avatar :src="img" class="img" />
        <Modal v-model="imgModal.show" :width="800" :footer-hide="true" style="text-align: center;">
            <img :src="imgModal.src" style="max-width: 100%;">
        </Modal>
    </div>
</template>

<script>
    export default {
        name: "doctor-chat",
        props: ['img', 'msg'],
        data() {
            return {
                imgModal: {
                    show: false,
                    src: ''
                }
            }
        },
        methods: {
            doubleClick(ev) {
                if( ev.target.localName === 'img' ) {
                    this.imgModal.show = true;
                    this.imgModal.src = ev.target.src;
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .line{
        margin: 30px 0;
        text-align: right;
        .img{
            width: 40px;
            height: 40px;
            margin-left: 18px;
        }
        .text-bg{
            position: relative;
            border-radius: 4px;
            text-align: left;
            word-break: break-all;
            vertical-align: top;
            display: inline-block;
            max-width: 50%;
            padding: 6px 12px;
            background-color: rgb(113, 150, 159);
            color: #fff;
            margin-top: 4px;
            box-shadow: 0 0 6px 0px #999;
            letter-spacing: 1px;
            &:before{
                position: absolute;
                content: '';
                border-left: 10px solid rgb(113, 150, 159);
                border-top: 4px solid transparent;
                border-right: 10px solid transparent;
                border-bottom: 4px solid transparent;
                top: 10px;
                right: -20px;
            }
        }
    }
</style>