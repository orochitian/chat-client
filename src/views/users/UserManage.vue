<template>
    <div class="container">
        <lrBreadcrumb :breadcrumbItems="breadcrumbItems"></lrBreadcrumb>
        <Card>
            <!--  用户列表  -->
            <Table stripe border :columns="columns" :data="pageInfo.users"></Table>
            <lrPage :pageData="pageInfo"></lrPage>
        </Card>
        <!--  添加/编辑用户 抽屉  -->
        <UserEdit :show="editShow" :formData="editUserData" @on-cancel="editShow = false" @on-submit="userSubmitHandle"></UserEdit>
    </div>
</template>

<script>
    import UserEdit from './UserEdit';

    export default {
        components: { UserEdit },
        data() {
            return {
                editShow: false,
                breadcrumbItems: [
                    {title: '用户管理'}
                ],
                editUserData: {},
                columns: [
                    {
                        title: '用户名',
                        key: 'username'
                    },{
                        title: '密码',
                        key: 'password'
                    }, {
                        title: '姓名',
                        key: 'fullname'
                    }, {
                        title: '性别',
                        key: 'sex',
                        width: 100
                    },  {
                        title: '简介',
                        key: 'desc',
                        width: 300,
                        tooltip: true
                    }, {
                        title: '操作',
                        width: 300,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary'
                                    },
                                    style: {
                                        marginRight: '10px'
                                    },
                                    on: {
                                        click: () => {
                                            this.editShow = true;
                                            this.editUserData = JSON.parse(JSON.stringify(params.row));
                                        }
                                    }
                                }, [
                                    h('Icon', {
                                        props: {
                                            type: 'md-create'
                                        },
                                        style: {
                                            marginRight: '2px',
                                            fontSize: '15px'
                                        }
                                    }),
                                    h('span', '编辑')
                                ]),
                                h('Button', {
                                    props: {type: 'error'},
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '注意！',
                                                content: '确定要删除这个用户吗？',
                                                onOk: () => {
                                                    this.$ajax.post('/user/delUser', params.row).then(res => {
                                                        this.loadPage();
                                                    });
                                                }
                                            })
                                        }
                                    }
                                }, [
                                    h('Icon', {
                                        props: {
                                            type: 'md-trash'
                                        },
                                        style: {
                                            marginRight: '2px',
                                            fontSize: '15px'
                                        }
                                    }),
                                    h('span', '删除')
                                ])
                            ])
                        }
                    },
                ],
                pageInfo: {},
            }
        },
        watch: {
            '$route'() {
                this.loadPage();
            }
        },
        methods: {
            //  加载页面
            loadPage() {
                this.$ajax.get('/user/getUserList', {params: this.$route.query}).then(res => {
                    this.pageInfo = res.data;
                });
            },
            //  用户添加/编辑成功回调
            userSubmitHandle() {
                this.editShow = false;
                this.loadPage();
            }
        },
        mounted() {
            this.loadPage();
        }
    }
</script>

<style scoped>

</style>
