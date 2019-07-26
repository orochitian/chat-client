import Vue from 'vue'
import Router from 'vue-router'
import Layout from './views/Layout'
import Message from './views/Message'
import Friend from './views/Friend'
import FriendRequest from './views/FriendRequest'
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
                    component: Friend
                },
                {
                    path: '/message',
                    component: Message
                },
                {
                    path: '/friend',
                    component: Friend,
                    children: [
                        {
                            path: 'friendRequest',
                            component: FriendRequest
                        }
                    ]
                },
            ]
        },
        {
            path: '/login',
            component: Login
        }
    ]
})
