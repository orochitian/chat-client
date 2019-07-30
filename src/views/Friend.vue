<template>
    <div class="container">
        <div class="message-list">
            <div class="search-container">
                <div class="search-input">
                    <Icon class="search-btn" type="ios-search" size="16" />
                    <input type="text" placeholder="搜索：账号或昵称" v-model.trim="searchText" @input="searchFriend">
                    <Icon class="clear-search-btn" type="ios-close-circle-outline" size="16" v-show="searchText"  @click="clearSearch" />
                </div>
                <Icon type="ios-add-circle" class="add-friend" size="26" @click="addFriend" />
            </div>
            <div class="list">
                <div class="new-friend" :class="{active: selectIndex < 0}" @click="selectNewFriend">
                    <Avatar class="icon" shape="square" icon="md-person-add" size="large" />
                    <p class="text">新的朋友</p>
                </div>
                <div v-if="list.length > 0">
                    <div class="item"
                         v-for="(item, index) in (searchText ? searchList : list)"
                         :key="index"
                         :class="{active: selectIndex === index}"
                         @click="selectChat(item, index)"
                    >
                        <Avatar class="user-icon" shape="square" :src="item.icon || '/default.jpg'" size="large" />
                        <div class="message-info">
                            <p class="name">{{item.nickname || item.username}}</p>
                            <p class="last-message">{{item.mood}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="friend-content">
            <router-view />
        </div>
    </div>
</template>

<script>
    export default {
        name: "friend",
        data() {
            return {
                addFriendShow: false,
                searchText: '',
                selectIndex: 0,
                list: [],
                searchList: []
            }
        },
        methods: {
            //  搜索好友
            searchFriend() {
                if( this.searchText ) {
                    let reg = new RegExp(this.searchText);
                    this.searchList = this.list.filter(item => reg.test(item.username) || reg.test(item.nickname));
                }
            },
            //  清除搜索内容
            clearSearch() {
                this.searchText = '';
            },
            //  查看好友申请
            selectNewFriend() {
                this.selectIndex = -1;
                this.$router.push('/friend/friendRequest');
            },
            //  选择聊天
            selectChat(item, index) {
                this.selectIndex = index;
                this.$router.push({path: '/message', query: {user: this.list[index].username}});
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
                        axios.post('/user/addFriend', {username: value, mark}).then(res => {
                            if( res.data.code === 200 ) {
                                this.$Message.success('好友申请发送成功');
                            }
                        });
                    }
                })
            },
            //  获取好友列表
            getFriendList() {
                axios.get('/user/getFriendList').then(res => {
                    if( res.data.code === 200 ) {
                        this.list = res.data.data;
                    }
                });
            }
        },
        mounted() {
            this.getFriendList();
            //  捕获好友申请结果
            this.$socket.on('friend request result', result => {
                if( result ) {
                    this.getFriendList();
                } else {
                    this.$Message.error('您的好友申请被无情的拒绝了');
                }
            })
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
        .new-friend{
            user-select: none;
            padding: 10px;
            &:hover{
                background-color: rgba(0, 0, 0, .1);
            }
            &.active{
                background-color: rgba(0, 0, 0, .2);
            }
            .icon{
                margin-left: 20px;
                color: #fff;
                background-color: #FA9D3B;
            }
            .text{
                width: 170px;
                display: inline-block;
                margin-top: 2px;
                margin-left: 10px;
                font-size: 14px;
                vertical-align: middle;
                color: #000;
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