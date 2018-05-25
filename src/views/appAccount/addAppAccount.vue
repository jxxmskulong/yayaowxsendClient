<style>
.chlAccWrap{
   width: 100%;
   height:auto!important;
   min-height:100vh;
   margin: 77px 269px;
}
.chlAnnoun{
    font-size: 30px;
    color: #d8d6d6 !important;
    text-shadow: 0px 0.5px #666, 0px 1px #666, 0px 1.5px #666, 0px 2px #666;
    font-family: cursive;
}
.chlForm{
    width: 300px;
    top: 25px;
    position: relative;
}


</style>
<template>
<div class="chlAccWrap">
    <span class="chlAnnoun">新增公众号</span>
    <div class="chlForm">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <FormItem label="AppId" prop="appId">
                <Input v-model="formValidate.appId" placeholder="开发者ID"></Input>
            </FormItem>

            <FormItem label="AppSecret" prop="secret">
                <Input type="password" v-model="formValidate.secret" placeholder="开发者密码"></Input>
            </FormItem>

            <FormItem label="AppName" prop="appName">
                <Input v-model="formValidate.appName" placeholder="公众号名称"></Input>
            </FormItem>

            <FormItem label="二维码" prop="appCode">
                <Button type="info" class="btnAccUpload" >上传二维码图片</Button>
			    <input type="file" id="imgAccFile" @change="uploadImage()" name="fileName" multiple="multiple" ref="avatarInput" />
                <img id='imgHead' :src="formValidate.appCode" alt="" />
            </FormItem>
            <!--<FormItem label="Status" prop="status">
                <Select v-model="formValidate.statusId" @on-change='getStatusName' :label-in-value="true" clearable placeholder="状态">
                   <Option v-for="item in statusList" :value="item.statusId" :key="item.name">{{ item.name }}</Option>
                </Select>
            </FormItem>-->

            <!--<FormItem label="Status">
                <Select v-model="formValidate.status" placeholder="状态" disabled>
                   <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>-->
            
            <FormItem>
                <Button type="primary" @click="handleSubmit('formValidate')" :disabled="disabled">提交</Button>
                <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
            </FormItem>
        </Form>
    </div>
</div>    
</template>
<script>
import common from '../../static/js/common.js'
import uploadImg from '../../static/js/upload.js'
    export default {
        data () {
            return {
                formValidate: {
                   appId:'',
                   secret:'',
                   appName:'',
                   appCode:''
                   //status:0
                },
                disabled:false,
                ruleValidate: {
                    appId: [
                        { required: true, message: '请填写开发者ID', trigger: 'blur' }
                    ],
                    secret: [
                        { required: true, message: '请填写开发者密码', trigger: 'blur' }
                    ],
                    appName: [
                        { required: true, message: '请填写公众号名称', trigger: 'blur' }
                    ],
                    appCode: [
                        { required: true, message: '请上传二维码图片',pattern: /.+/, trigger: 'change' }
                    ]
                },
                lock: false,
                // statusList:[
                //     {
                //         value:0,
                //         label:"未使用"
                //     },
                //     {
                //         value:1,
                //         label:"使用中"
                //     }
                // ]
            }
        },
        methods: {
            /**
             * 图片上传
             *   通过回调函数success返回异步请求的值
             */
            uploadImage(){
               let $this=this
               uploadImg.uploadImg($this,{
                   success:(resource)=>{
                    console.log(resource)
                    this.formValidate.appCode=resource;
                   }
               }) 
               if(this.errAccMsg!=""){
                    this.$Message.error(this.errAccMsg);
               }
            },
             /**
              * 点击提交
              *    如果验证通过：那么发送axios
              * 禁止重复提交：
              *       1、用disabled属性、在点击之后、ajax提交之前做判断          
              *       2、设置一个锁    本次提交采用第二种  
              */
              handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        /**
                         *  验证通过，那么把表单值发送axios请求传给后台
                         */
                        if(this.lock){
                            console.log(this.lock)
                            return this.$Message.error('请勿重复提交!');;
                        }
                        this.lock=true
                        this.$ajax({
                            method:'post',
                            url:common.getUrl().url+'/appAccount/add',
                            withCredentials: true,
                            crossDomain: true,
                            data:this.Qs.stringify(this.formValidate)
                        }).then((resp) =>{
                            //console.log(resp)
                            if(resp.data.code==200){
                                this.disabled=true
                                this.$Message.success(resp.data.msg); 
                                return ;
                            }
                            this.lock=false;
                            this.$Message.error(resp.data.msg); 
                        })
                    } else {
                        this.$Message.error('Fail!');
                        return ;
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            }
           
        },
        created(){
            
        },
        mounted() {
           
      }
    }
</script>
