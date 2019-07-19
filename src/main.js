import Vue from 'vue'
import App from './App.vue'
import router from './router'
import iview from 'iview'
import 'iview/dist/styles/iview.css'
import axios from 'axios'
import io from 'socket.io-client'

Vue.prototype.$socket = io.connect('http://localhost');

//  自己封装的quill富文本编辑器
import editor from './components/Editor';
Vue.component('editor', editor);

Vue.use(iview);


axios.defaults.baseURL = 'http://localhost';
axios.defaults.withCredentials = true;
axios.interceptors.response.use((res) => {
    if( res.data.code === 401 ) {
        window.sessionStorage.setItem('chat-login', 0);
        router.push('/login');
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
        let login = window.sessionStorage.getItem('chat-login');
        if( !login || login !== '1' ) {
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
