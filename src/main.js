import App from './App.vue'
import router from './router'
import axios from 'axios'
import io from 'socket.io-client'

Vue.prototype.$socket = io.connect('http://localhost');

//  自己封装的quill富文本编辑器
import editor from './components/Editor';
Vue.component('editor', editor);

axios.defaults.baseURL = 'http://localhost';
axios.defaults.withCredentials = true;
axios.interceptors.request.use(req => {
    let user = JSON.parse(sessionStorage.getItem('chat-user'));
    if( user ) {
        req.headers.token = user.token
    }
    return req;
}, err => {
    return Promise.reject(err)
});
axios.interceptors.response.use(res => {
    //  如果服务器返回登录失效
    if( res.data.code === 401 ) {
        window.sessionStorage.removeItem('chat-user');
        router.push('/login');
    } else if( res.data.code !== 200 ) {
        iview.Message.warning(res.data.msg);
    }
    return res;
}, error => {
    router.push('/login');
    return Promise.reject(error);
});

router.beforeEach((to, from, next) => {
    if( to.path === '/login' ) {
        next();
    } else {
        let token = sessionStorage.getItem('chat-user');
        if( !token ) {
            next({ path: "/login", replace: true });
        } else {
            next();
        }
    }
})

window.axios = axios;

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
