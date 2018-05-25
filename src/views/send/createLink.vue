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
    width: 300px;
    top: 25px;
    position: relative;
}


</style>
<template>
<div class="addAccWrap">
    <span class="addAnnoun">设置推送信息</span>
    <div class="addform">
        
     </div>  
    <div id="editor" style="width:800px"></div>
    <Button type="info" v-on:click="save()" class="upload" :disabled="disabled">提交</Button>
    <!--<Alert class="succmsg" type="success" v-if="succshow" show-icon>添加成功</Alert>-->

</div>    
</template>
<script>
import WangEditor from 'wangeditor'
import common from '../../static/js/common.js'
    export default {
        data () {
            return {
                formValidate: {
                    title:'',
                    description:'',
                    picUrl:'',
                    sendUrl:'',
                    acountId:'',
                    acountName:''
                },
                disabled:false,
                errAccMsg:'',
                ruleValidate: {
                    title: [
                        { required: true, message: '请填写标题', trigger: 'blur' }
                    ],
                    sendUrl: [
                        { required: true, message: '请填写发送链接', trigger: 'blur' }
                    ]
                },
                content:''
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
                    this.formValidate.picUrl=resource;
                   }
               }) 
            },
               
             /**
              * 点击提交
              *    如果验证通过：那么发送axios
              */
              handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let account=JSON.parse(sessionStorage.getItem("Account")); 
                        this.formValidate.acountId=account.acountId;
                        this.formValidate.acountName=account.name;
                        /**
                         *  验证通过，那么把表单值发送axios请求传给后台
                         */
                        this.$ajax({
                            method:'post',
                            url:common.getUrl().url+'/send/accept/info',
                            withCredentials: true,
                            crossDomain: true,
                            data:this.Qs.stringify(this.formValidate)
                        }).then((resp) =>{
                            console.log(resp)
                            if(resp.data.code==200){
                                this.disabled=true
                            }
                            //this.$Message.success(resp.data.info.addmsg); 
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
       // let $this=this;
        let editor = new WangEditor('#editor')      //这个地方传入div元素的id 需要加#号
        editor.change =()=> {      // 配置 onchange 事件      
                                                // 编辑区域内容变化时，实时打印出当前内容
        this.content=editor.txt.html();
         console.log(this.content)
        }
        editor.customConfig.uploadImgServer = common.getUrl().url+'/upload';
        editor.customConfig.uploadFileName = 'fileName'
        //editor.customConfig.debug = true
        editor.create()                 // 生成编辑器    
        editor.txt.html('<p>请输入内容...</p>') 
      }
    }
</script>
