<template>
    <div class="login-container">
        <Form :model="formItem" :label-width="100" class="login-form">
            <h1>聊天系统登录</h1>
            <FormItem label="用户名：">
                <Input @on-enter="loginHandle" v-model.trim="formItem.username" placeholder="请输入你的用户名"></Input>
            </FormItem>
            <FormItem label="密码：">
                <Input @on-enter="loginHandle" v-model.trim="formItem.password" type="password" placeholder="请输入你的密码"></Input>
            </FormItem>
            <Button class="login-btn" type="primary" @click="loginHandle">登录</Button>
            <Button class="regist-btn" @click="addShow = true">注册</Button>
            <br><br><br>
            <Alert type="warning" show-icon>
                说明：
                <template slot="desc">
                    长时间未登录账号，系统会自动回收，不做保留。
                </template>
            </Alert>
        </Form>
        <userAdd :show="addShow" @on-cancel="addShow = false" @on-submit="addShow = false"></userAdd>
    </div>
</template>

<script>
    import userAdd from './users/UserAdd';
    export default {
        name: "login",
        components: {
            userAdd
        },
        methods: {
            loginHandle() {
                if( !this.formItem.username || !this.formItem.password ) {
                    this.$Message.error('请输入用户名和密码！');
                    return;
                }
                axios.post('/login', this.formItem).then(res => {
                    if( res.data.code === 200 ) {
                        window.sessionStorage.setItem('chat-user', JSON.stringify(res.data.data));
                        this.$router.push('/');
                    }
                });
            }
        },
        data() {
            return {
                addShow: false,
                formItem: {
                    username: '',
                    password: ''
                },
                ruleValidate: {
                    username: [
                        { required: true, message: '请输入文章标题', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请选择文章分类', trigger: 'blur' }
                    ]
                }
            }
        }
    }
</script>

<style lang="scss">
    .login-container{
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: #2d3a4b;
        .login-form{
            position: absolute;
            left: 0;
            right: 0;
            width: 520px;
            padding: 35px 0 15px 0;
            margin: 120px auto;
            h1{
                text-align: center;
                color: #fff;
                font-size: 26px;
                margin-bottom: 20px;
            }
            .ivu-btn{
                width: 100%;
            }
            .ivu-form-item{
                border: 1px solid rgba(255, 255, 255, 0.1);
                background: rgba(0, 0, 0, 0.1);
                border-radius: 5px;
                color: #454545;
                input{
                    background: transparent !important;
                    border: 0;
                    -webkit-appearance: none;
                    border-radius: 0px;
                    padding: 12px 5px 12px 15px;
                    color: #eee;
                    height: 47px;
                    box-shadow: none;
                }
                .ivu-form-item-label{
                    text-align: right;
                    vertical-align: middle;
                    float: left;
                    font-size: 14px;
                    color: #999;
                    line-height: 40px;
                    padding: 3px 12px 0 0;
                    box-sizing: border-box;
                }
            }
            .login-btn{
                background: #009688;
                border-color: #009688;
                &:hover{
                    background: #33aba0;
                    border-color: #33aba0;
                }
            }
            .regist-btn{
                margin-top: 20px;
                background: none;
                border: 1px solid #999;
                color: #999;
                &:hover{
                    border-color: #ddd;
                    color: #ddd;
                }
            }
        }

    }
</style>
