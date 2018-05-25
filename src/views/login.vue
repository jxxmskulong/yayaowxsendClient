<style scoped lang="less">
 @import '../static/css/login.css';
</style>
<template>
    <div class="wrap">
        <form id="userLogin">
            <div class="loginDiv1">
                <Input class="inputClass" size="large" v-model="account.phone" placeholder="phone"></Input>
            </div>
            <div class="loginDiv2">
                <Input class="inputClass" type="password" size="large" v-model="account.password"  placeholder="password"></Input>
            </div> 
            <div class="loginDiv3">
                <Input class="inputClass checkCode" size="large"  v-model="account.code" placeholder="checkcode"></Input>
                <a href="javascript:;" v-on:click='cutCode'><img class="ImgcheckCode"  alt="" v-bind:src="account.src" /></a>
            </div>
            
            <div class="checkbox">
                <RadioGroup v-model="account.role">
                    <Radio label="管理员"></Radio>
                    <Radio label="渠道主"></Radio>
                </RadioGroup>
            </div>
            
            <Button class="btn" type="info" v-on:click="login">登录</Button>
            <Alert class="successLogin" v-if="account.succ" v-bind:type="account.tclass" show-icon>{{account.hintmsg}}</Alert>
      </form>  
 </div>  
</template>
</script>

<script>
import common from '../static/js/common.js'
export default {
        data () {
            return {
                    /*
                    * 
                    * 1、用户名              phone
                    * 2、密码                password
                    * 3、验证码              code
                    * 4、验证码URL           src
                    * 5、角色                role
                    * 6、判断成功、失败       succ
                    * 7、类型                tclass
                    * 8、成功、失败显示       hintmsg
                    * 
                    */
                account:{
                    phone: '',
                    password: '',
                    code: '',
                    src:'',
                    role: '管理员',
                    succ:'',
                    tclass:'',
                    hintmsg:''
                },
               validCode:'' 
            }
        },
        methods:{
            /*
            *   点击验证码图片：切换验证码
            */
            cutCode(){
                 let time=new Date().getTime();
                //this.account.src="http://192.168.11.19:8080/code?"+time;
                 this.$ajax({
                        method: 'get',
                        url:common.getUrl().url+"/login/code?"+time,
                        responseType:'blob',        //二进制流
                        withCredentials: true,       
                        crossDomain: true
                     }).then((response)=>{
                         var blob = new Blob([response.data], {type: "image/png"}); 
                         console.log(blob);  
                         //window.URL.revokeObjectURL(blob); 
                         this.account.src=window.URL.createObjectURL(blob);;
                     }).catch((error)=>{
                        console.log(error);
                     })
            },
            /*
            *   点击登录按钮：根据返回数据
            *   1、错误：登录错误、显示错误提示
            *   2、正确：登录成功、把账户信息存入sessionStorage中，跳转首页
            */
            login(){
                 this.$ajax({ 
                        method: 'post',
                        url:common.getUrl().url+"/login/",
                        withCredentials: true,
                        crossDomain: true,
                        data:this.Qs.stringify(this.account)
                     }).then((response)=>{
                        console.log(response);
                        this.account.hintmsg=response.data.msg;
                        this.account.succ="true";
                        if(response.data.code==200){
                            let accountStr=JSON.stringify(response.data.info.Account);     //把对象转成字符串
                            sessionStorage.setItem("Account",accountStr);
                            this.account.tclass="success";
                            this.$router.push({path: '/home'});
                        }
                         this.account.tclass="error";
                     }).catch((error)=>{
                        console.log(error);
                     })
            }
           
        },
       created(){
            this.cutCode();
       }, 
       mounted () {
             //alert('df');

       }
    }
</script>




