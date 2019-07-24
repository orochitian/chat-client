<template>
    <div ref="editor" @keydown="keySend"></div>
</template>

<script>
    export default {
        name: "editor",
        props: ['content'],
        data() {
            return {
                _content: '',
                videoIframe: ''
            }
        },
        watch: {
            //  监听父组件传递的content值，变化后更新富文本内容
            content(newVal, oldVal) {
                if (this.quill) {
                    if (newVal && newVal !== this._content) {
                        this._content = newVal;
                        this.quill.clipboard.dangerouslyPasteHTML(newVal);
                    } else if(!newVal) {
                        this.quill.setText('');
                    }
                }
            }
        },
        methods: {
            keySend(ev) {
                this.$emit('keySend', ev);
            },
            uploadToServer(file, callback) {
                var xhr = new XMLHttpRequest();
                var formData = new FormData();
                formData.append('upload', file);
                xhr.open('post', this.$ajax.defaults.baseURL + '/upload/blogUpload');
                xhr.withCredentials = true;
                xhr.responseType = 'json';
                xhr.send(formData);
                xhr.onreadystatechange = () => {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        callback(xhr.response);
                    }
                };
            }
        },
        mounted() {
            //  初始化quill
            this.quill = new Quill(this.$refs.editor, {
                theme: 'snow',
                modules: {
                    history: {
                        userOnly: true
                    },
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'align': [] }],
                        ['clean'],
                        ['image', 'video']
                    ],
                    // syntax: true
                }
            });

            //  自定义图片上传
            var toolbar = this.quill.getModule('toolbar');
            toolbar.addHandler('image', () => {
                var fileInput = toolbar.container.querySelector('input.ql-image[type=file]');
                if (fileInput == null) {
                    fileInput = document.createElement('input');
                    fileInput.setAttribute('type', 'file');
                    fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
                    fileInput.classList.add('ql-image');
                    fileInput.addEventListener('change',  () => {
                        if (fileInput.files != null && fileInput.files[0] != null) {
                            /*
                            *   自定义富文本图片上传
                            *   富文本默认使用base64，大图片存储到数据库后长度会非常非常大，导致查询异常缓慢！
                            *   所以这里手动改为将图片上传到服务器，服务器返回图片静态地址。
                            * */
                            this.uploadToServer(fileInput.files[0], (res) => {
                                var range = this.quill.getSelection();
                                if (range) {
                                    fileInput.value = null;
                                    //  在当前光标位置插入图片
                                    toolbar.quill.insertEmbed(range.index, 'image', this.$ajax.defaults.baseURL + res.file.path);
                                    //  将光标移动到图片后面
                                    toolbar.quill.setSelection(range.index + 1);
                                }
                            });
                        }
                    });
                    toolbar.container.appendChild(fileInput);
                }
                fileInput.click();
            });

            //  自定义粘贴图片功能
            this.quill.root.addEventListener('paste', evt => {
                if (evt.clipboardData && evt.clipboardData.files && evt.clipboardData.files.length) {
                    evt.preventDefault();
                    [].forEach.call(evt.clipboardData.files, file => {
                        if (!file.type.match(/^image\/(gif|jpe?g|a?png|svg|webp|bmp|vnd\.microsoft\.icon)/i)) {
                            return;
                        }
                        this.uploadToServer(file, (res) => {
                            var range = this.quill.getSelection();
                            if (range) {
                                //  在当前光标位置插入图片
                                toolbar.quill.insertEmbed(range.index, 'image', this.$ajax.defaults.baseURL + res.file.path);
                                //  将光标移动到图片后面
                                toolbar.quill.setSelection(range.index + 1);
                            }
                        });
                    });
                }
            }, false);

            //  自定义插入视频
            toolbar.addHandler('video', () => {
                this.$Modal.confirm({
                    render: (h) => {
                        return h('Input', {
                            props: {
                                value: this.videoIframe,
                                autofocus: true,
                                placeholder: '复制视频插入代码'
                            },
                            on: {
                                input: (val) => {
                                    this.videoIframe = val;
                                }
                            }
                        })
                    },
                    okText: '插入视频',
                    onOk: () => {
                        this.quill.focus();
                        if( !/^<iframe.+<\/iframe>$/.test(this.videoIframe) ) {
                            this.videoIframe = '';
                            return;
                        }
                        var range = this.quill.getSelection();
                        if (range) {
                            //  在当前光标位置插入图片
                            toolbar.quill.clipboard.dangerouslyPasteHTML(range.index, this.videoIframe);
                            //  将光标移动到图片后面
                            toolbar.quill.setSelection(range.index + 1);
                        }
                        this.videoIframe = '';
                    },
                    onCancel: () => {
                        this.videoIframe = '';
                    }
                })
            });

            //  监听富文本变化，更新父组件数据
            this.quill.on('text-change', () => {
                let html = this.$refs.editor.children[0].innerHTML;
                if (html === '<p><br></p>') html = '';
                this._content = html;
                this.$emit('edit', this._content);
            });
        }
    }
</script>

<style>
    .ql-toolbar.ql-snow{
        border: none;
        border-top: 1px solid #ECECEC;
        background-color: #fff;
    }
    .ql-container.ql-snow{
        border: none;
        background-color: #fff;
    }
</style>
