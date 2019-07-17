<template>
    <Drawer title="编辑用户" v-model="show" width="720" :mask-closable="false" :closable="false">
        <Form ref="userAddForm" :model="formData">
            <Row :gutter="32">
                <Col span="12">
                <FormItem label="用户名" label-position="top" prop="username">
                    <Input :value="formData.username" placeholder="4-16位 英文或数字" disabled />
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="密码" label-position="top" prop="password">
                    <Input v-model="formData.password" placeholder="8-16位 任意字符"></Input>
                </FormItem>
                </Col>
            </Row>
            <FormItem label="姓名" label-position="top" prop="fullname">
                <Input v-model="formData.fullname" placeholder="请输入用户姓名"></Input>
            </FormItem>
            <FormItem label="性别">
                <RadioGroup v-model="formData.sex">
                    <Radio label="男"></Radio>
                    <Radio label="女"></Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="简介" label-position="top" prop="desc">
                <Input type="textarea" v-model="formData.desc" :rows="4" placeholder="随便写点什么吧。。。" />
            </FormItem>
        </Form>
        <div class="demo-drawer-footer">
            <Button style="margin-right: 8px" @click="cancelHandle">取消</Button>
            <Button type="primary" @click="submitHandle">提交</Button>
        </div>
        <Spin size="large" fix v-if="spinShow">提交中...</Spin>
    </Drawer>
</template>

<script>
    export default {
        props: ['show', 'formData'],
        data() {
            return {
                spinShow: false
            }
        },
        methods: {
            cancelHandle() {
                this.$emit('on-cancel');
            },
            submitHandle() {
                this.spinShow = true;
                this.$ajax.post('/user/updateUser', this.formData).then(res => {
                    if( res.status === 200 ) {
                        this.$Message.success('编辑成功！');
                        this.$emit('on-submit');
                    } else {
                        this.$Message.error(res.data);
                    }
                    this.spinShow = false;
                });
            }
        }
    }
</script>

<style >

</style>
