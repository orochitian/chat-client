<template>
    <div class="container">
        <div class="friend-info">
            <div class="name">
                <Avatar class="icon" shape="square" :src="friend.icon || '/default.jpg'" size="large" />
                <span class="nickname">{{friend.nickname || friend.username}}</span>
            </div>
            <div class="info">
                <div class="item">
                    <span>性别：</span>
                    <span>{{friend.sex}}</span>
                </div>
                <div class="item">
                    <span>生日：</span>
                    <span>{{friend.birthday}}</span>
                </div>
                <div class="item">
                    <span>血型：</span>
                    <span>{{friend.bloodType}}</span>
                </div>
                <div class="item">
                    <span>家乡：</span>
                    <span>{{friend.hometown}}</span>
                </div>
                <div class="item">
                    <span>所在地：</span>
                    <span>{{friend.address}}</span>
                </div>
                <div class="item">
                    <span>学校：</span>
                    <span>{{friend.school}}</span>
                </div>
                <div class="item">
                    <span>职业：</span>
                    <span>{{friend.job}}</span>
                </div>
                <div class="item">
                    <span>手机：</span>
                    <span>{{friend.tel}}</span>
                </div>
                <div class="item">
                    <span>邮箱：</span>
                    <span>{{friend.email}}</span>
                </div>
                <div class="item">
                    <span>个性签名：</span>
                    <span>{{friend.mood}}</span>
                </div>
                <div class="item">
                    <span>个人说明：</span>
                    <span>{{friend.desc}}</span>
                </div>
            </div>
        </div>
        <div class="message-content">
            <div class="container">
                <div class="content" ref="chatShow">
                    <div class="chat-show">
                        <div style="text-align: center;" v-if="lastCount > 0">
                            <Icon type="ios-time-outline" size="14" style="margin-right: 3px; color: #2d8cf0" />
                            <a href="javascript:;" @click="checkMore" style="vertical-align: middle;">查看更多消息...</a>
                        </div>
                        <div v-for="(li, index) in messageList" :key="index">
                            <FriendLine v-if="li.from === friendId" :img="friend.icon || '/default.jpg'" :msg="li.msg"></FriendLine>
                            <MyLine v-else-if="li.to === friendId" :img="user.icon || '/default.jpg'" :msg="li.msg"></MyLine>
                            <!--<TimeLine v-else-if="li.type === 'time'" :msg="li.msg"></TimeLine>-->
                        </div>
                    </div>
                </div>
                <div class="new-message" v-show="hasNewMessage">
                    <span @click="">新消息...</span>
                </div>
            </div>

            <div class="send">
                <editor :content="chat.content" @edit="chat.content = arguments[0]" @keySend="keySend"></editor>
                <div class="send-btn-container">
                    <Button class="send-btn" type="primary" @click="sendMessage">发送(Ctrl+Enter)</Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import MyLine from '../components/MyLine'
    import FriendLine from '../components/FriendLine'
    import TimeLine from '../components/TimeLine'
    export default {
        name: "message",
        components: {
            MyLine,
            FriendLine,
            TimeLine
        },
        data() {
            return {
                searchText: '',
                selectIndex: 0,
                chat: {
                    content: ''
                },
                messageList: [],
                user: {},
                friend: {},
                friendId: this.$route.query.user,
                pageNum: 1,
                lastCount: 0,
                hasNewMessage: false
            }
        },
        methods: {
            //  ctrl+enter发送
            keySend(ev) {
                if( ev.keyCode === 13 && ev.ctrlKey ) {
                    this.sendMessage();
                }
            },
            //  查看历史消息
            checkMore() {
                this.pageNum++;
                this.getMessageHistory();
            },
            //  获取聊天记录
            getMessageHistory() {
                axios.get('/user/getMessageHistory', {
                    params: {
                        username: this.friendId,
                        pageNum: this.pageNum
                    }
                }).then(res => {
                    if( res.data.code === 200 ) {
                        //  如果pageNum > 1，表示在查看历史记录
                        if( this.pageNum > 1 ) {
                            let scrollTop = this.$refs.chatShow.scrollHeight;
                            res.data.data.messages.forEach(item => {
                                this.messageList.unshift(item);
                            });
                            this.$nextTick(() => {
                                let top = this.$refs.chatShow.scrollHeight - scrollTop;
                                this.$refs.chatShow.scrollTop = top;
                            });
                        } else {
                            this.messageList = res.data.data.messages;
                            this.$nextTick(() => {
                                this.$refs.chatShow.scrollTop = this.$refs.chatShow.scrollHeight;
                            });
                        }
                        this.user = JSON.parse(sessionStorage.getItem('chat-user'));
                        this.lastCount = res.data.data.lastCount;
                    }
                });
            },
            sendMessage() {
                let content = this.chat.content.replace(/<p>(\s+|<br>)<\/p>/g, '');
                if( !content ) {
                    this.$Message.warning('无法发送空白消息');
                    return;
                }
                this.$socket.emit('sendMessage', {
                    from: this.user.username,
                    to: this.friendId,
                    msg: this.chat.content
                });
                this.chat.content = '';
            }
        },
        mounted() {
            this.getMessageHistory();
            let chatShow = this.$refs.chatShow;
            this.$socket.on('newMessage', data => {
                if( data.from === this.user.username || ( data.from === this.friendId && data.to === this.user.username ) ) {
                    this.messageList.push(data);
                    if( data.from === this.user.username ) {
                        this.$nextTick(() => {
                            chatShow.scrollTop = chatShow.scrollHeight;
                        });
                    } else {
                        let scrollBottom = chatShow.scrollHeight - chatShow.scrollTop - chatShow.clientHeight;
                        if( scrollBottom > 60 ) {
                            this.$nextTick(() => {
                                this.hasNewMessage = true;
                            });
                        } else {
                            this.$nextTick(() => {
                                chatShow.scrollTop = chatShow.scrollHeight;
                            });
                        }
                    }
                }
            });

            axios.get('/user/getUser', {params: {username: this.friendId}}).then(res => {
                this.friend = res.data.data;
            });

            chatShow.onscroll = (ev) => {
                let scrollBottom = chatShow.scrollHeight - chatShow.scrollTop - chatShow.clientHeight;
                if( scrollBottom < 60 ) {
                    this.hasNewMessage = false;
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .container{
        height: 100%;
        display: flex;
        flex-direction: row;
    }
    .friend-info{
        width: 300px;
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: #EFEEEE;
        .name{
            padding: 0 50px;
            margin: 30px 0;
            .icon{
                margin-right: 20px;
            }
            .nickname{
                font-size: 20px;
            }
        }
        .info{
            padding: 0 50px;
            .item{
                margin-top: 10px;
            }
        }
    }
    .message-content{
        position: relative;
        display: flex;
        flex: 1;
        background-color: #F5F5F5;
        flex-direction: column;
        .container{
            position: relative;
            flex: 1;
            overflow: hidden;
        }
        .content{
            position: relative;
            overflow-y: scroll;
            padding: 24px 36px;
            width: 100%;
            & /deep/ img{
                max-width: 100%;
            }
            z-index: 9;
        }
        .send{
            position: relative;
            height: 260px;
            padding-bottom: 41px;
            overflow: hidden;
            .send-btn-container{
                width: 180px;
                position: absolute;
                right: 0;
                top: 41px;
                bottom: 0;
                background-color: #fff;
            }
            .send-btn{
                position: absolute;
                right: 30px;
                bottom: 30px;
            }
        }
    }
    .new-message{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        span{
            position: absolute;
            right: 40px;
            bottom: 20px;
            padding: 5px 30px;
            background-color: rgba(137, 190, 178, .8);
            text-align: center;
            z-index: 99;
            color: #fff;
            cursor: pointer;
            border-radius: 20px;
            transition: 1s ease-in-out;
        }
    }
</style>

<style lang="scss">
    .ql-container{
        position: absolute;
        top: 41px;
        bottom: 0;
        left: 0;
        right: 160px;
        height: auto;
    }
</style>