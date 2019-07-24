<template>
    <Drawer title="账号注册" v-model="show" width="800" :mask-closable="false" :closable="false">
        <Form ref="userAddForm" :model="formData" :rules="ruleValidate">
            <Row :gutter="32">
                <Col span="12">
                <FormItem label="用户名：" label-position="top" prop="username">
                    <Input v-model="formData.username" placeholder="5-16位 英文或数字" />
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="密码：" label-position="top" prop="password">
                    <Input v-model="formData.password" placeholder="8-16位 英文或数字"></Input>
                </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="12">
                <FormItem label="姓名：" label-position="top" prop="fullname">
                    <Input v-model="formData.fullname" placeholder="2-8位中文 或 2-16位英文"></Input>
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="邮箱：" label-position="top" prop="email">
                    <Input v-model="formData.email" placeholder="请输入邮箱地址"></Input>
                </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="12">
                <FormItem label="手机号：" label-position="top" prop="tel">
                    <Input v-model="formData.tel" placeholder="请输入手机号码"></Input>
                </FormItem>
                </Col>
                <Col span="12">
                </Col>
            </Row>
            <FormItem label="性别：">
                <RadioGroup v-model="formData.sex">
                    <Radio label="男"></Radio>
                    <Radio label="女"></Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="简介：" label-position="top" prop="desc">
                <Input type="textarea" v-model="formData.desc" :rows="4" placeholder="随便写点什么吧。。。" />
            </FormItem>
        </Form>
        <br>
        <div class="demo-drawer-footer">
            <Button style="margin-right: 8px" @click="cancelHandle">取消</Button>
            <Button type="primary" @click="submitHandle">提交</Button>
        </div>
        <Spin size="large" fix v-if="spinShow">提交中...</Spin>
    </Drawer>
</template>

<script>
    export default {
        props: ['show'],
        data() {
            return {
                editorContent: '',
                editorContentHtml: '',
                spinShow: false,
                formData: {
                    username: '',
                    password: '',
                    fullname: '',
                    email: '',
                    tel: '',
                    sex: '男',
                    desc: ''
                },
                ruleValidate: {
                    username: [
                        { required: true, message: '用户名不能为空', trigger: 'blur' },
                        //{ pattern: /^[a-zA-Z0-9]{5,16}$/, message: '用户名格式不正确', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '密码不能为空', trigger: 'blur' },
                        //{ pattern: /^[a-zA-Z0-9]{8,16}$/, message: '密码格式不正确', trigger: 'blur' }
                    ],
                    // fullname: [
                    //     { required: true, message: '姓名不能为空', trigger: 'blur' },
                    //     { pattern: /(^[\u4e00-\u9fa5]{2,8}$)|(^[a-zA-Z]{2,16}$)/, message: '姓名格式不正确', trigger: 'blur' }
                    // ],
                    // email: [
                    //     { required: true, message: '邮箱不能为空', trigger: 'blur' },
                    //     { pattern: /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/, message: '邮箱格式不正确', trigger: 'blur' }
                    // ],
                    // tel: [
                    //     { required: true, message: '手机号不能为空', trigger: 'blur' },
                    //     { pattern: /^(1(3|4|5|6|7|8|9)|9(2|8))\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
                    // ]
                }
            }
        },
        methods: {
            cancelHandle() {
                this.$refs.userAddForm.resetFields();
                this.$emit('on-cancel');
            },
            submitHandle() {
                this.$refs.userAddForm.validate(valid => {
                    if (valid) {
                        this.spinShow = true;
                        axios.post('/regist', this.formData).then(res => {
                            if( res.data.code === 200 ) {
                                this.$refs.userAddForm.resetFields();
                                this.$Message.success('添加成功，请登录');
                                this.$emit('on-submit');
                            } else {
                                this.$Message.error(res.data.msg);
                            }
                            this.spinShow = false;
                        });
                    }
                });
            }
        }
    }
</script>
