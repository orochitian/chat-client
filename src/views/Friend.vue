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
                <div v-if="list.length > 0">
                    <div class="item"
                         v-for="(item, index) in list"
                         :key="index"
                         :class="{active: selectIndex === index}"
                         @click="selectChat(item, index)"
                    >
                        <Avatar class="user-icon" shape="square" :src="item.icon || 'logo.png'" size="large" />
                        <div class="message-info">
                            <p class="name">{{item.username}}</p>
                            <p class="last-message">{{item.last}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="friend-content">
            <div v-if="list.length > 0">
                <div class="header">
                    <p>{{list[selectIndex].username}}</p>
                </div>
                <Button type="success" :to="{path: '/message', query: {user: list[selectIndex].username}}">发消息</Button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "friend",
        data() {
            return {
                searchText: '',
                selectIndex: 0,
                list: [],
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
                let mark = '';
                this.$Modal.confirm({
                    render: (h) => {
                        return h('div', [
                            h('Input', {
                                props: {
                                    value,
                                    autofocus: true,
                                    placeholder: '好友账号'
                                },
                                style: {
                                    marginBottom: '10px'
                                },
                                on: {
                                    input: (val) => {
                                        value = val;
                                    }
                                }
                            }),
                            h('Input', {
                                props: {
                                    value: mark,
                                    autofocus: true,
                                    placeholder: '备注：我是XXX'
                                },
                                on: {
                                    input: (val) => {
                                        mark = val;
                                    }
                                }
                            })
                        ])
                    },
                    onOk: () => {
                        // this.$socket.emit('test', {
                        //     username: value,
                        //     mark
                        // });
                        axios.post('/user/addFriend', {username: value, mark}).then(res => {
                            if( res.data.code === 200 ) {
                                this.$Message.success('添加成功');
                                this.getFriendList();
                            }
                        });
                    }
                })
            },
            //  获取好友列表
            getFriendList() {
                axios.get('/user/getFriendList').then(res => {
                    if( res.data.code === 200 ) {
                        this.list = res.data.data.list;
                    }
                });
            }
        },
        mounted() {
            this.getFriendList();
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
    .friend-content{
        position: relative;
        display: flex;
        flex: 1;
        background-color: #F5F5F5;
        flex-direction: column;
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
</style>