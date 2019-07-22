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
            <div class="content">
                <div class="chat-show" ref="chatShow">
                    <!--<MyLine img="user.png" v-for="(message, index) in my" :msg="message"></MyLine>-->
                    <!--<div style="text-align: center;">-->
                        <!--<a href="javascript:;" v-if="total > 0" @click="checkMore">查看更多消息...</a>-->
                    <!--</div>-->
                    <div v-for="(li, index) in messageList" :key="index">
                        <FriendLine v-if="li.from === $route.query.user" img="logo.png" :msg="li.msg"></FriendLine>
                        <MyLine v-else-if="li.to === $route.query.user" img="user.png" :msg="li.msg"></MyLine>
                        <!--<TimeLine v-else-if="li.type === 'time'" :msg="li.msg"></TimeLine>-->
                    </div>
                </div>
                <!--<div class="new-message">-->
                    <!--<span @click="">新消息...</span>-->
                <!--</div>-->
            </div>
            <div class="send">
                <editor :content="chat.content" @edit="chat.content = arguments[0]"></editor>
                <Button type="primary" @click="sendMessage">发送</Button>
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
                user: ''
            }
        },
        methods: {
            //  清除搜索内容
            clearSearch() {
                this.searchText = '';
            },
            //  选择聊天
            selectChat(item, index) {
                this.selectIndex = index;
            },
            //  获取聊天记录
            getMessageHistory() {
                axios.get('/user/getMessageHistory', {
                    params: {
                        username: this.$route.query.user
                    }
                }).then(res => {
                    this.messageList = res.data.data.messages;
                    this.user = res.data.data.user;
                    this.$socket.emit('single chat', this.user);
                });
            },
            sendMessage() {
                this.$socket.emit('sendMessage', {
                    from: this.user,
                    to: this.$route.query.user,
                    msg: this.chat.content
                });
                this.chat.content = '';
                // axios.post('/user/sendMessage', {
                //     username: this.$route.query.user,
                //     msg: this.chat.content
                // }).then(res => {
                //     this.chat.content = '';
                // });
            }
        },
        mounted() {
            this.getMessageHistory();
            this.$socket.on('newMessage', data => {
                console.log(data);
                if( data.from === this.user || ( data.from === this.$route.query.user && data.to === this.user ) ) {
                    this.messageList.push(data);
                }
                // if( data.to === this.$route.query.user || data.from === this.$route.query.user ) {
                //     this.messageList.push(data);
                // }
            });
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
        .content{
            flex: 1;
            overflow-y: scroll;
            position: relative;
            padding: 24px 36px;
        }
        .send{
            height: 260px;
            padding-bottom: 42px;
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
            right: 30px;
            bottom: 30px;
            padding: 5px 20px;
            background-color: #a8d8b9;
            text-align: center;
            z-index: 99;
            color: #42602d;
            cursor: pointer;
            border-radius: 20px;
        }
    }
</style>