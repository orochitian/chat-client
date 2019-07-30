<template>
    <div style="padding: 20px; overflow: auto;">
        <div class="list" v-if="list.length > 0">
            <div v-if="list.length > 0">
                <div class="item"
                     v-for="(item, index) in list"
                     :key="index"
                >
                    <Avatar class="user-icon" shape="square" :src="item.icon" size="large" />
                    <div class="message-info">
                        <p class="name">{{item.nickname || item.from}}</p>
                        <p class="last-message">{{item.mark}}</p>
                    </div>
                    <div class="handle">
                        <Button type="success" size="small" @click="requestHandle(item, true)">接受</Button>
                        <Button type="error" size="small" @click="requestHandle(item, false)" style="margin-left: 10px;">拒绝</Button>
                    </div>
                </div>
            </div>
        </div>
        <Alert v-else type="warning">暂无好友申请</Alert>
        <Button type="error" @click="deleteFriends">删除所有好友关系（仅为了测试方便）</Button>
        <Spin size="large" fix v-if="loading"></Spin>
    </div>
</template>

<script>
    export default {
        name: "friend-request",
        data() {
            return {
                loading: true,
                list: []
            }
        },
        methods: {
            deleteFriends() {
                axios.get('/user/deleteFriends').then(res => {
                    if( res.data.code === 200 ) {
                        this.$Message.success('好友关系已删除');
                        this.$router.push('/friend');
                    }
                });
            },
            getRequestList() {
                axios.get('/user/friendRequestList').then(res => {
                    this.list = res.data.data;
                    this.loading = false;
                });
            },
            requestHandle(item, accept) {
                axios.post('/user/friendRequestHandle', {
                    to: item.to,
                    from: item.from,
                    accept
                }).then(res => {
                    if( res.data.code === 200 ) {
                        this.getRequestList();
                    }
                });
            }
        },
        mounted() {
            this.getRequestList();
        }
    }
</script>

<style scoped lang="scss">
    .list{
        .item{
            position: relative;
            user-select: none;
            padding: 10px;
            border-bottom: 1px solid #E7E7E7;
            &:hover{
                background-color: rgba(0, 0, 0, .1);
            }
            &.active{
                background-color: rgba(0, 0, 0, .2);
            }
            .user-icon{
                margin-left: 20px;
            }
            .message-info{
                position: absolute;
                right: 130px;
                left: 80px;
                display: inline-block;
                vertical-align: top;
                margin-left: 10px;
                .name{
                    font-size: 16px;
                    color: #000;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
                .last-message{
                    color: #999;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
            }
            .handle{
                float: right;
                padding-top: 10px;
            }
        }

    }
</style>