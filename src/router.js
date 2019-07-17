import Vue from 'vue'
import Router from 'vue-router'
import Layout from './views/Layout'
import Message from './views/Message'
import Friend from './views/Friend'
import Login from './views/Login'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            component: Layout,
            children: [
                {
                    path: '/',
                    component: Message
                },
                {
                    path: '/message',
                    component: Message
                },
                {
                    path: '/friend',
                    component: Friend
                },
            ]
        },
        {
            path: '/login',
            component: Login
        }
    ]
})
