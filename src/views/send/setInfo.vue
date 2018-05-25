<style>
.addAccWrap{
   width: 100%;
   height:auto!important;
   min-height:100vh;
   margin: 77px 269px;
}
.addAnnoun{
    font-size: 30px;
    color: #d8d6d6 !important;
    text-shadow: 0px 0.5px #666, 0px 1px #666, 0px 1.5px #666, 0px 2px #666;
    font-family: cursive;
}
.addform{
    width: 600px !important;
    top: 25px;
    position: relative;
}
.btnAccUpload{
    width: 150px;
}
#imgAccFile{
    position: absolute;
    height: 32px;
    margin: 0 0 0 -152px;
    opacity: 0;
    width: 450px;
    top:0px;
}
#imgHead{
    top: 12px;
    position: relative;
}

</style>
<template>
<div class="addAccWrap">
    <span class="addAnnoun">设置推送信息</span>
    <div class="addform">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <FormItem label="类型" prop="type">
                <Select v-model="formValidate.type" style="width:200px;">
                    <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="标题" prop="title">
                <Input v-model="formValidate.title" placeholder="标题"></Input>
            </FormItem>

            <FormItem label="描述" prop="description">
                <Input v-model="formValidate.description" type="textarea" :autosize="{minRows: 5,maxRows: 8}" placeholder="描述,1-21000"></Input>
            </FormItem>

            <FormItem label="图片" prop="img">
                <Button type="info" class="btnAccUpload" >上传图片</Button>
			    <input type="file" id="imgAccFile" @change="uploadImage()" name="fileName" multiple="multiple" ref="avatarInput" />
                <img id='imgHead' :src="formValidate.pUrl" alt="" />
            </FormItem>

            <FormItem label="跳转url" prop="sUrl">
                <Input v-model="formValidate.sUrl" placeholder="跳转链接"></Input>
            </FormItem>
            
            <FormItem>
                <Button type="primary" @click="handleSubmit('formValidate')" :disabled="disabled">提交</Button>
                <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
            </FormItem>
        </Form>
    </div>
</div>    
</template>
<script>
import uploadImg from '../../static/js/upload.js'
import common from '../../static/js/common.js'
    export default {
        data () {
            return {
                 typeList:[
                    {
                        value: 0,
                        label: "图文消息"
                    },
                    {
                        value: 1,
                        label: "文本消息"
                    }
                ],
                formValidate: {
                    title:'',
                    description:'',
                    pUrl:'',
                    sUrl:'',
                    // acountId:'',
                    // acountName:''
                },
                disabled:false,
                errAccMsg:'',
                ruleValidate: {
                    /* title: [
                        { required: true, message: '请填写标题', trigger: 'blur' }
                    ],
                    sUrl: [
                        { required: true, message: '请填写发送链接', trigger: 'blur' }
                    ]  */
                }
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
                    this.formValidate.pUrl=resource;
                   }
               }) 
               if(this.errAccMsg!=""){
                    this.$Message.error(this.errAccMsg);
               }
            },
               
             /**
              * 点击提交
              *    如果验证通过：那么发送axios
              */
              handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        // let account=JSON.parse(sessionStorage.getItem("Account")); 
                        // this.formValidate.acountId=account.acountId;
                        // this.formValidate.acountName=account.name;
                        /**
                         *  验证通过，那么把表单值发送axios请求传给后台
                         */
                        //防止表单重复提交
                        this.disabled=true
                        this.$ajax({
                            method:'post',
                            url:common.getUrl().url+'/info/send',
                            withCredentials: true,
                            crossDomain: true,
                            data:this.Qs.stringify(this.formValidate)
                        }).then((resp) =>{
                            console.log(resp)
                            if(resp.data.code==200){
                                this.$Message.success(resp.data.msg);
                                return ;
                            }
                            this.disabled=false;
                            this.$Message.success(resp.data.msg); 
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
           this.formValidate.type=this.typeList[1].value;
        },
        mounted() {
           
      }
    }
</script>
