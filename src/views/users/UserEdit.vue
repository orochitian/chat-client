<template>
    <div>
        <Modal v-model="show"
               :userData="userData"
               @on-ok="submitHandler"
               @on-cancel="cancelHandler"
               :closable="false"
               :mask-closable="false"
               title="编辑资料"
               :width="650"
        >
            <Form :model="userData" :label-width="60">
                <FormItem label="头像">
                <span @click="iconShow = true" style="cursor: pointer;">
                    <Avatar shape="square" :src="userData.icon || '/default.jpg'" size="large" />
                </span>
                    <Upload action="//localhost:80/upload"
                            class="upload"
                            :show-upload-list="false"
                            :data="{username: userData.username}"
                            accept="image/*"
                            :headers="{token: userData.token}"
                            :on-success="uploadSuccess"
                    >
                        <Button icon="ios-cloud-upload-outline" type="primary">上传</Button>
                    </Upload>
                </FormItem>
                <Row>
                    <Col span="12">
                    <FormItem label="昵称">
                        <Input v-model="userData.nickname"></Input>
                    </FormItem>
                    </Col>
                    <Col span="12">
                    <FormItem label="性别">
                        <Select v-model="userData.sex">
                            <Option value="男">男</Option>
                            <Option value="女">女</Option>
                        </Select>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                    <FormItem label="生日">
                        <DatePicker type="date" :value="userData.birthday" :editable="false" @on-change="changeDate"></DatePicker>
                    </FormItem>
                    </Col>
                    <Col span="12">
                    <FormItem label="血型">
                        <Select v-model="userData.bloodType">
                            <Option value="A">A</Option>
                            <Option value="B">B</Option>
                            <Option value="AB">AB</Option>
                            <Option value="O">O</Option>
                            <Option value="其他血型">其他血型</Option>
                        </Select>
                    </FormItem>
                    </Col>
                </Row>
                <FormItem label="家乡">
                    <Input v-model="userData.hometown"></Input>
                </FormItem>
                <FormItem label="所在地">
                    <Input v-model="userData.address"></Input>
                </FormItem>
                <Row>
                    <Col span="12">
                    <FormItem label="学校">
                        <Input v-model="userData.school"></Input>
                    </FormItem>
                    </Col>
                    <Col span="12">
                    <FormItem label="职业">
                        <Input v-model="userData.job"></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                    <FormItem label="手机">
                        <Input v-model="userData.tel"></Input>
                    </FormItem>
                    </Col>
                    <Col span="12">
                    <FormItem label="邮箱">
                        <Input v-model="userData.email"></Input>
                    </FormItem>
                    </Col>
                </Row>
                <FormItem label="个性签名">
                    <Input type="textarea" :rows="3" v-model="userData.mood"></Input>
                </FormItem>
                <FormItem label="个人说明">
                    <Input type="textarea" :rows="3" v-model="userData.desc"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button style="margin-right: 8px" @click="cancelHandler">取消</Button>
                <Button type="primary" @click="submitHandler">提交</Button>
            </div>
        </Modal>
        <Modal v-model="iconShow" :footer-hide="true">
            <img :src="userData.icon" style="width: 100%;">
        </Modal>
    </div>
</template>

<script>
    export default {
        props: ['show'],
        data() {
            return {
                spinShow: false,
                userData: {},
                iconShow: false
            }
        },
        methods: {
            submitHandler() {
                axios.post('/user/update', this.userData).then(res => {
                    if( res.data.code === 200 ) {
                        sessionStorage.setItem('chat-user', JSON.stringify(this.userData));
                        this.$emit('on-close');
                    }
                });

            },
            cancelHandler() {
                this.userData = JSON.parse(sessionStorage.getItem('chat-user'));
                this.$emit('on-close');
            },
            changeDate(formate) {
                this.userData.birthday = formate;
            },
            uploadSuccess(res, file, fileList) {
                this.userData.icon = '//localhost:80' + res.data;
            }
        },
        created() {
            this.userData = JSON.parse(sessionStorage.getItem('chat-user'));
        }
    }
</script>

<style scoped lang="scss">
    .upload{
        display: inline-block;
        margin-left: 20px;
    }
</style>

<style>
    textarea{
        resize: none !important;
    }
</style>
