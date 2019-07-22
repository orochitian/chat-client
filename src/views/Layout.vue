<template>
    <div>
        <!--  ======================= Sidebar =======================  -->
        <Sider id="side-bar" width="65">
            <div class="logo">
                <h2>
                    <router-link to="/">
                        <Avatar shape="square" src="user.png" />
                    </router-link>
                </h2>
            </div>
            <Menu active-name="friends" theme="dark" width="auto">
                <MenuItem name="friends" to="/friend">
                    <Icon type="md-contacts" size="30" />
                </MenuItem>
                <MenuItem name="message" to="/message">
                    <Icon type="ios-chatbubbles" size="30" />
                </MenuItem>
            </Menu>
            <div class="menu" @click="menu">
                <Icon type="ios-menu-outline" size="30" />
            </div>
        </Sider>

        <Layout class="layout">
            <!--  ======================= Content =======================  -->
            <Content class="content">
                <transition name="fade-slide">
                    <router-view></router-view>
                </transition>
            </Content>
        </Layout>
    </div>
</template>

<script>
    export default {
        name: 'layout',
        data() {
            return {
                userData: {}
            }
        },
        methods: {
            menu() {
                this.$Modal.confirm({
                    title: '提示',
                    content: '是否退出当前账号？',
                    onOk: () => {
                        axios.get('/logout').then(res => {
                            sessionStorage.removeItem('chat-token');
                            this.$router.push('/login');
                        });
                    }
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .layout{
        margin-left: 65px;
        background: none;
        height: 100vh;
    }
    .content{
        overflow-x: hidden;
    }
    .user-drop{
        float: right;
        a{
            color: #fff;
        }
    }
    .ivu-menu-dark{
        background-color: #28292C;
    }
    .ivu-menu-item{
        padding: 14px 0 !important;
        text-align: center;
        &:hover{
            background: none !important;
        }
        &.ivu-menu-item-active{
            /*background-color: #35495E !important;*/
            background: none !important;
            color: rgb(107, 194, 53) !important;
        }
    }
    #side-bar{
        position: fixed;
        min-height: 100vh;
        background-color: #28292C;
        .logo{
            height: 64px;
            line-height: 64px;
            text-align: center;
            .router-link-active{
                color: #ccc;
            }
        }
    }
    .menu{
        position: absolute !important;
        bottom: 40px;
        width: 100%;
        text-align: center;
        color: rgba(255, 255, 255, .7);
        cursor: pointer;
        &:hover{
            color: rgba(255, 255, 255, 1);
        }
    }
</style>
