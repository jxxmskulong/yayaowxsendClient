import Vue from 'vue';
import VueRouter from 'vue-router';
import iView from 'iview'
import Util from './libs/util'
import Login from './views/login.vue';
import Home from './views/home.vue';
import FirstPage from './views/firstPage.vue';
import SetInfo from './views/send/setInfo.vue';
import InfoList from './views/send/infoList.vue';
import SendList from './views/send/sendList.vue';
import CreateLink from './views/send/createLink.vue';
import AddChannel from './views/channel/addChannel.vue';
import ChannelList from './views/channel/channelList.vue';
import ChannelCount from './views/total/channelCount.vue';
import UserCount from './views/total/userCount.vue';
import AddAppAccount from './views/appAccount/addAppAccount.vue';
import AppAccountList from './views/appAccount/appAccountList.vue';
import Test from './views/test.vue';

Vue.use(VueRouter)
const router =new VueRouter({
 routes:
[
    {
        path: '/',
        meta: {
            title: '登录页'
        },
        component: Login 
    },
    {
        path: '/login',
        meta: {
            title: '登录页'
        },
        component: Login
    },
    // {
    //     path: '/home',
    //     meta: {
    //         title: '主页'
    //     },
    //     component: Home
    // },
    {
        path: '/home',
        component: Home,
        children:[
            {
        path: 'setInfo',
        name:'主页',
        component: SetInfo
            }
        ]
    },
    {
        path: '/home',
        component: Home,
        children:[
            {
        path: 'infoList',
        name:'主页',
        component: InfoList
            }
        ]
    },
    {
        path: '/home',
        component: Home,
        children:[
            {
        path: 'sendList',
        name:'主页',
        component: SendList
            }
        ]
    },
     {
        path: '/home',
        component: Home,
        children:[
            {
        path: 'createLink',
        name:'主页',
        component: CreateLink
            }
        ]
    },
    {
        path: '/home',
        component: Home,
        children:[
            {
        path: 'addChannel',
        name:'主页',
        component: AddChannel
            }
        ]
    },
    {
        path: '/home',
        component: Home,
        children:[
            {
        path: 'channelList',
        name:'主页',
        component: ChannelList
            }
        ]
    },
    {
        path: '/home',
        component: Home,
        children:[
            {
        path: 'channelCount',
        name:'主页',
        component: ChannelCount
            }
        ]
    },
    {
        path: '/home',
        component: Home,
        children:[
            {
        path: 'userCount',
        name:'主页',
        component: UserCount
            }
        ]
    },
    {
        path: '/home',
        component: Home,
        children:[
            {
        path: 'firstPage',
        name:'主页',
        component: FirstPage
            }
        ]
    },
    {
        path: '/home',
        component: Home,
        children:[
            {
        path: 'addAppAccount',
        name:'主页',
        component: AddAppAccount
            }
        ]
    },
    {
        path: '/home',
        component: Home,
        children:[
            {
        path: 'appAccountList',
        name:'主页',
        component: AppAccountList
            }
        ]
    },
    
    {
        path: '/test',
        meta: {
            title: '测试页'
        },
        component: Test
    }   
]
}) 
router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    next();
});

router.afterEach((to, from, next) => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});
export default router;