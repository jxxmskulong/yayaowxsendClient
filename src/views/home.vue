<style scoped>
.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}
.layout-header-bar{
    background: #fff;
    box-shadow: 0 1px 1px rgba(0,0,0,.1);
}
.top{
    position: fixed;
    width: 100%;
    z-index: 2;
    left: 0px;
    top: 0px;
}
.title{
    position: relative;
    left: 200px;
    font-size: 28px;
    font-family: cursive;
    color: #d8d6d6 !important;
    text-shadow: 0px 0.5px #666, 0px 1px #666, 0px 1.5px #666, 0px 2px #666;
}
.account{
    position: absolute;
    left: 75%;
    top: 0px;
}
.roleName{
    position: relative;
    float: left;
    text-align: center;
    font-size: 15px;
}
.nickname{
    font-family: cursive;
    color: #d8d6d6 !important;
    text-shadow: 0px 0.5px #666, 0px 1px #666, 0px 1.5px #666, 0px 2px #666;
    font-size: 20px;
}
.exit{
    position: absolute;
    width: 80px;
    height: 60px;
    border: 0px;
    background-color: #495060;
    text-align: center;
    font-family: cursive;
    color: #d8d6d6 !important;
    text-shadow: 0px 0.5px #666, 0px 1px #666, 0px 1.5px #666, 0px 2px #666;
    font-size: 20px;
}
.isExit{
    font-size: 17px;
    text-align: center;
    color: red;
}
.navigation{
    border-top: 1px solid #ccc;
    top:60px;
}
.contentDiv{
    position: relative;
    left: 200px;
    top: 61px;
    background-color: white;
    width: 100%;
    height: 700px;
}
.firstPage{
    position: fixed;
    top: 85px;
    left: 250px;
    font-size: 30px;
    color: #d8d6d6 !important;
    text-shadow: 0px 0.5px #666, 0px 1px #666, 0px 1.5px #666, 0px 2px #666;
    font-family: cursive;
}
</style>

<template>
    <div class="layout">
        <div class="top">
            <Menu mode="horizontal" theme="dark" active-name="1">
                <span class="title">雅耀微信推送项目 </span>
                <div class="account">
                    <div class="roleName ">
                        <a href="javascript:;">
                        <span class="nickname">{{nickname}}</span>
                        <Icon type="arrow-down-b" style="color:white"></Icon>
                        </a>
                    </div>
                    <!-- <a v-on:click='exit' class="edit">退出</a>   -->
                    <a href="javascript:;" @click="modal10 = true" class="exit">退出</a>
                    <Modal width="250px"
                            title="退出登录"
                            @on-ok="ok"
                            v-model="modal10"
                            class-name="vertical-center-modal">
                            <p class="isExit">是否退出登录！</p>
                        </Modal>
                </div>     
                </Menu>
        </div>
        <Sider :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto'}" class="navigation">
             <Menu theme="dark" :active-name="1" :open-names="['1']"  @on-select="select1" accordion mode="vertical" width="200px">
                <MenuItem name="/home/firstPage">
                        首页
                </MenuItem>
                <!--<Submenu name="2">
                    <template slot="title">
                        <Icon type="volume-medium"></Icon>
                        公告管理
                    </template>
                    <MenuItem name="">公告列表</MenuItem>
                    <MenuItem v-show='showAddNotice' name="/home/addNotice">新增公告</MenuItem>
                </Submenu>-->
                <Submenu name="2" v-if="isAdmin">
                    <template slot="title">
                      <Icon type="social-tux"></Icon>
                        公众号管理
                    </template>
                    <MenuItem name="/home/addAppAccount">新增公众号</MenuItem>
                    <MenuItem name="/home/appAccountList">公众号列表</MenuItem>
                </Submenu>
                <Submenu name="3" v-if="isAdmin">
                    <template slot="title">
                       <Icon type="cube"></Icon>
                        渠道信息
                    </template>
                    <MenuItem name="/home/addChannel">新增渠道</MenuItem>
                    <MenuItem name="/home/channelList">渠道列表</MenuItem>
                </Submenu>
                <!--<Submenu name="4">
                    <template slot="title">
                       <Icon type="cube"></Icon>
                        推广链接
                    </template>
                    <MenuItem name="/home/createLink">提取链接</MenuItem>
                </Submenu>-->
                <Submenu name="5" v-if="isAdmin">
                    <template slot="title">
                       <Icon type="social-twitter"></Icon>
                        推送服务
                    </template>
                    <MenuItem name="/home/setInfo">信息设置</MenuItem>
                    <MenuItem name="/home/infoList">信息列表</MenuItem>
                    <MenuItem name="/home/sendList">推送列表</MenuItem>
                </Submenu>
                
                <Submenu name="6">
                    <template slot="title">
                        <Icon type="stats-bars"></Icon>
                        统计分析
                    </template>
                   <!-- <MenuItem name="/home/channelCount">分渠道用户统计</MenuItem>  -->
                    <MenuItem name="/home/userCount">用户统计</MenuItem>
                </Submenu>
            </Menu>
        </Sider>
        <router-view></router-view>
    </div>
</template>
<script>
import common from '../static/js/common.js'
    export default {
        data () {
            return {
             nickname:"",
             modal10: false,
             showAddNotice:false,
             isAdmin:true
            }
        },
        methods:{
            /*
            *   判断是否已经登录
            *   1、已经登录从sessionStorage中获取账户信息，进行显示
            *   2、未登录直接退回登录页面
            *   3、登录成功、判断角色信息、如果是渠道主、那么对一些信息进行隐藏
            */
            islogin(){
                this.$ajax({
                    method:'get',
                    url:common.getUrl().url+ "/login/isLogin",
                    withCredentials: true,       
                    crossDomain: true
                }).then((resp)=>{
                    console.log(resp);
                    if(resp.data.code==200){
                        let account=JSON.parse(sessionStorage.getItem("Account"));    //把对象转成字符串
                        this.nickname=account.name;

                        /**
                         * 判断角色信息
                         */
                         var roleName=account.roleName;
                         if(roleName!="管理员"){
                            this.isAdmin=false;
                         }

                        return ;
                    }
                    this.$router.push({path: '/login'});
                }).catch((error)=>{
                    console.log(error);
                })
            },
          /*
          *  退出
          *  1、点击退出、弹出退出提示框，点击确定退回到登录页面
          *  2、根据存储的key，清除sessionStorage
          */
          ok () {
                this.$ajax({
                method:'get',
                url:common.getUrl().url+"/login/exit",
                withCredentials: true,       
                crossDomain: true
                }).then((resp)=>{
                    console.log(resp);
                    if(resp.data.code==200){
                        sessionStorage.removeItem("Account");
                        this.$router.push({path: '/login'});
                }
                }).catch((error)=>{
                    console.log(error);
                })
            },
            /**
             *  该方法：控制点击左边目录栏，控制点击二级目录栏进行跳转
             */
            select1(name){
                console.log(name);
                this.$router.push(name);
            },
              
    },
    created(){
            this.islogin();
            this.select1("/home/firstPage");
       }
    }       
</script>
  