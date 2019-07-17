<template>
    <div class="container">
        <div class="message-list">
            <div class="search-container">
                <div class="search-input">
                    <Icon class="search-btn" type="ios-search" size="16" />
                    <input type="text" placeholder="搜索" v-model.trim="searchText">
                    <Icon class="clear-search-btn" type="ios-close-circle-outline" size="16" v-show="searchText"  @click="clearSearch" />
                </div>
                <Icon type="ios-add-circle" class="add-friend" size="26" @click="addFriend" />
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
                list: [
                    {
                        icon: 'user.png',
                        name: '任小仙',
                        last: '最后一条消息最后一条消息最后一条消息最后一条消息最后一条消息最后一条消息'
                    }, {
                        icon: 'user.png',
                        name: '大魔王',
                        last: '最后一条消息最后一条消息最后一条消息最后一条消息最后一条消息最后一条消息'
                    }, {
                        icon: 'user.png',
                        name: '青春斗',
                        last: '最后一条消息最后一条消息最后一条消息最后一条消息最后一条消息最后一条消息'
                    }, {
                        icon: 'user.png',
                        name: '二百五',
                        last: '最后一条消息最后一条消息最后一条消息最后一条消息最后一条消息最后一条消息'
                    },
                ],
                chat: {
                    content: '123'
                },
                my: []
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
            //  添加朋友
            addFriend() {
                let value = '';
                this.$Modal.confirm({
                    render: (h) => {
                        return h('Input', {
                            props: {
                                value,
                                autofocus: true,
                                placeholder: '输入好友账号'
                            },
                            on: {
                                input: (val) => {
                                    value = val;
                                }
                            }
                        })
                    },
                    onOk: () => {
                        axios.post('/user/addFriend', {username: value}).then(res => {
                            if( res.data.code !== 200 ) {
                                this.$Message.error(res.data.msg);
                            } else {
                                this.$Message.success('添加成功');
                            }
                        });
                    }
                })
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
        .content{
            flex: 1;
            overflow-y: scroll;
            position: relative;
            padding: 24px 36px;
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
    .add-friend{
        margin-left: 10px;
        cursor: pointer;
        color: #999;
    }
    .search-input{
        display: inline-block;
        margin: 10px 0 10px 30px;
        background-color: #DBD9D8;
        padding: 0 10px;
        border-radius: 4px;
        width: 210px;
        input{
            position: relative;
            background: none;
            border: none;
            outline: none;
            height: 30px;
            width: 130px;
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