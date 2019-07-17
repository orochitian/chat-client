import Vue from 'vue'
import App from './App.vue'
import router from './router'
import iview from 'iview'
import 'iview/dist/styles/iview.css'
import axios from 'axios'

//  自己封装的quill富文本编辑器
import editor from './components/Editor';
Vue.component('editor', editor);

Vue.use(iview);


axios.defaults.baseURL = 'http://localhost';
axios.defaults.withCredentials = true;

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
