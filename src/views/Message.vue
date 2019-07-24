<template>
    <div class="container">
        <div class="message-list">
            <div class="search-container">
                <div class="search-input">
                    <Icon class="search-btn" type="ios-search" size="16" />
                    <input type="text" placeholder="搜索" v-model.trim="searchText">
                    <Icon class="clear-search-btn" type="ios-close-circle-outline" size="16" v-show="searchText"  @click="clearSearch" />
                </div>
            </div>
            <div class="list">
                <div class="item"
                     v-for="(item, index) in list"
                     :key="index"
                     :class="{active: selectIndex === index}"
                     @click="selectChat(item, index)"
                >
                    <Avatar class="user-icon" shape="square" :src="item.icon" size="large" />
                    <div class="message-info">
                        <p class="name">{{item.name}}</p>
                        <p class="last-message">{{item.last}}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="message-content">
            <div class="header">
                <span class="name">{{ list[selectIndex].name }}</span>
            </div>
            <div class="container">
                <div class="content" ref="chatShow">
                    <div class="chat-show">
                        <div style="text-align: center;" v-if="lastCount > 0">
                            <Icon type="ios-time-outline" size="14" style="margin-right: 3px; color: #2d8cf0" />
                            <a href="javascript:;" @click="checkMore" style="vertical-align: middle;">查看更多消息...</a>
                        </div>
                        <div v-for="(li, index) in messageList" :key="index">
                            <FriendLine v-if="li.from === $route.query.user" img="logo.png" :msg="li.msg"></FriendLine>
                            <MyLine v-else-if="li.to === $route.query.user" img="user.png" :msg="li.msg"></MyLine>
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
                list: [{}],
                chat: {
                    content: '123'
                },
                messageList: [],
                user: '',
                pageNum: 1,
                lastCount: 0,
                hasNewMessage: false
            }
        },
        methods: {
            keySend(ev) {
                if( ev.keyCode === 13 && ev.ctrlKey ) {
                    this.sendMessage();
                }
            },
            //  清除搜索内容
            clearSearch() {
                this.searchText = '';
            },
            //  选择聊天
            selectChat(item, index) {
                this.selectIndex = index;
            },
            checkMore() {
                this.pageNum++;
                this.getMessageHistory();
            },
            //  获取聊天记录
            getMessageHistory() {
                axios.get('/user/getMessageHistory', {
                    params: {
                        username: this.$route.query.user,
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
                        this.user = res.data.data.user;
                        this.lastCount = res.data.data.lastCount;
                        this.$socket.emit('single chat', this.user);
                    }
                });
            },
            sendMessage() {
                this.$socket.emit('sendMessage', {
                    from: this.user,
                    to: this.$route.query.user,
                    msg: this.chat.content
                });
                this.chat.content = '';
            }
        },
        mounted() {
            this.getMessageHistory();
            this.$socket.on('newMessage', data => {
                if( data.from === this.user || ( data.from === this.$route.query.user && data.to === this.user ) ) {
                    this.messageList.push(data);
                    if( data.from === this.user ) {
                        this.$nextTick(() => {
                            this.$refs.chatShow.scrollTop = this.$refs.chatShow.scrollHeight;
                        });
                    } else {
                        let scrollBottom = this.$refs.chatShow.scrollHeight - this.$refs.chatShow.scrollTop - this.$refs.chatShow.clientHeight;
                        if( scrollBottom > 60 ) {
                            this.$nextTick(() => {
                                this.hasNewMessage = true;
                            });
                        } else {
                            this.$nextTick(() => {
                                this.$refs.chatShow.scrollTop = this.$refs.chatShow.scrollHeight;
                            });
                        }
                    }
                }
            });
            this.$refs.chatShow.onscroll = (ev) => {
                let scrollBottom = this.$refs.chatShow.scrollHeight - this.$refs.chatShow.scrollTop - this.$refs.chatShow.clientHeight;
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
    .message-list{
        width: 300px;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .list{
        flex: 1;
        overflow-y: scroll;
        background-color: #EFEEEE;
        .item{
            user-select: none;
            padding: 10px;
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
                width: 170px;
                display: inline-block;
                vertical-align: top;
                margin-left: 10px;
                .name{
                    font-size: 16px;
                    color: #000;
                }
                .last-message{
                    color: #999;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
            }
        }
    }
    .message-content{
        position: relative;
        display: flex;
        flex: 1;
        background-color: #F5F5F5;
        flex-direction: column;
        .header{
            height: 65px;
            border-bottom: 1px solid #E7E7E7;
            .name{
                line-height: 80px;
                margin-left: 30px;
                font-size: 24px;
            }
        }
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
    .search-container{
        background-color: #EFEEEE;
        width: 300px;
        height: 50px;
        .search-btn{
            cursor: pointer;
        }
        .clear-search-btn{
            margin-left: 10px;
            cursor: pointer;
        }
    }
    .search-input{
        margin: 10px 20px;
        background-color: #DBD9D8;
        padding: 0 10px;
        border-radius: 4px;
        input{
            position: relative;
            background: none;
            border: none;
            outline: none;
            height: 30px;
            width: 180px;
            margin-left: 10px;
            top: 1px;
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
    .ql-editor{

    }
</style>