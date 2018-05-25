<style>
.appAccountListWrap{
   width: 100%;
   height: 100vh;
   margin: 77px 269px;
}
.appAccountListAnn{
    font-size: 30px;
    color: #d8d6d6 !important;
    text-shadow: 0px 0.5px #666, 0px 1px #666, 0px 1.5px #666, 0px 2px #666;
    font-family: cursive;
}
.app-danger{
    font-size: 15px;
    color: red;
}
.appFirst{
    margin: 10px;
    overflow: hidden;
    position:relative;
    top: 30px;
    width: 438px;
    left: 452px;
}  
.appUpload{
    width: 250px;
}
#appFile{
    position: absolute;
    height: 32px;
    margin: 0 0 0 -255px;
    opacity: 0;
    width: 253px;
    top:0px;
}
#appimgHead{
    top: 12px;
    position: relative;
}
</style>

<template>
<div class="appAccountListWrap"> 
     <span class="appAccountListAnn">公众号列表</span>
     <Table border :columns="columns1" :data="data1" style="min-width:900px;width:calc(100vw - 300px);top:20px;" ></Table>
     <div class="appFirst" >
        
            <!--<Page :total="pageTotal" :current="pageNum" :page-size="pageSize" show-elevator show-total 
            @on-change="handlePage"></Page>-->
           <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" show-elevator show-sizer show-total 
            @on-change="handlePage"></Page>      <!-- show-sizer： 在页面显示，每页显示多少条  但是必须是pageSize=10,也就是每页显示10条 -->
        
    </div>

    <!-- 修改 -->
    <Modal
        v-model="modal1"
        width="60%"
        title="设置推送时间"
        @on-ok="ok"
        @on-cancel="cancel">
        <Form ref="formValidate" :model="formValidate" :label-width="80" :rules="ruleValidate" >
             <FormItem label="AppId" prop="appId" style="width:300px;" >
                <Input v-model="formValidate.appId" placeholder="开发者ID" :disabled="dis"></Input>
            </FormItem>

            <FormItem label="AppSecret" prop="secret" style="width:300px;">
                <Input type="password" v-model="formValidate.secret" placeholder="开发者密码"></Input>
            </FormItem>

            <FormItem label="AppName" prop="appName" style="width:300px;">
                <Input v-model="formValidate.appName" placeholder="公众号名称"></Input>
            </FormItem>
            
            <FormItem label="二维码" prop="appCode">
                <Button type="info" class="appUpload" >上传二维码图片</Button>
			    <input type="file" id="appFile" @change="uploadImage()" name="fileName" multiple="multiple" ref="avatarInput" />
                <img id='appimgHead' :src="formValidate.appCode" alt="" />
            </FormItem>
        </Form> 
        <div slot="footer">
                <Button type="primary" @click="handleSubmit('formValidate')" :disabled="disabled">提交</Button>
                <Button type="ghost" >重置</Button>
        </div>
    </Modal>

</div>
</template>
<script>
import common from '../../static/js/common.js'
import uploadImg from '../../static/js/upload.js'
let deleteIndex
    export default {
        data () {
            return {
                columns1: [
                    {   
                        title: '序号',
                        width:80,
                        render: (h,params) => {
                            return h('span', params.index + (this.pageNum- 1) * this.pageSize + 1);
                        }
                    },
                    {
                        title: 'AppId',
                        key: 'appId'
                    },
                    // {
                    //     title: 'AppSecret',
                    //     key: 'secret'
                    // },
                    {
                        title: '公众号名称',
                        key: 'appName'
                    },
                    {
                        title: '封面图片',
                        key: 'pUrl',
                         render: (h,params) => {
                             return h('img', {
                                attrs: {
                                    src: params.row.appCode,
                                    width:'100%',
                                    height:'100%'
                                }
                             })
                         }
                    },
                    // {
                    //     title: '状态',
                    //     key: 'status'
                    // },
                    {
                        title: '创建时间',
                        key: 'createDate'
                    },
                    {     
                        title: '操作',
                        key: 'action', 
                        align: 'center',
                        render: (h, params) => {
                            //自动更新切换公众号按钮禁止点击事件
                            // let dis=false;
                            // if(params.row.status=="使用中"){
                            //     dis=true;
                            // } 
                             let bt1=h('Button', {
                                    attrs: {
                                        id:params.row.appAccountId,
                                        //id:params.index,
                                        //disabled: dis
                                    },
                                    props: {
                                        type: 'info',
                                        // size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            console.log(params);
                                            //let dis=document.getElementById(bt1.data.attrs.id)
                                            //this.changeApp(params.index)
                                            this.updateApp(params.row)
                                        },
                                        
                                    }
                                }, '修改')
                                 return h('div', [
                                             bt1,
                                      ])
                        }
                    }
                    
                ],
                data1: [
                    
                ],
                pageTotal: 0,  
                pageNum: 1,
                pageSize: 10,
                modal1:false,
                formValidate:{
                   appId:'',
                   secret:'',
                   appName:'',
                   appCode:''
                },
                ruleValidate: {
                    appId: [
                         { required: true, message: '请输入开发者账号', trigger: 'blur' }
                    ],
                    secret: [
                        { required: true, message: '请输入开发者密码', trigger: 'blur' },
                    ],
                    appName: [
                        { required: true, message: '请输入公众号名称', trigger: 'blur' },
                    ]
                },
                lock:false, 
                disabled:false,
                dis:true
            }
        },
        methods:{
            ok () {
                this.$Message.info('点击了确定');
            },
            cancel () {
                this.getSendInfo(this.pageNum);
                this.$Message.info('点击了取消');
            },
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
            /*
             *  分页获取所有的发送信息、并展示在表格中
             */
             getSendInfo(num){
                this.$ajax({
                     method: 'post',
                     url:common.getUrl().url+"/appAccount/select",
                     withCredentials: true,       
                     crossDomain: true,
                     params:{
                         num:num,
                         size:this.pageSize
                     }  
                }).then((resp)=>{
                    /**
                     *  每次点击下一页先清空本页数据
                     */
                    this.data1=[];
                    console.log(resp.data.list)
    
                    /* 
                     * 后台传一个集合到前端：前端显示就是一个数组，也就是说直接当作数组进行处理就行
                     *      1、可以试试，那么前端传一个数组到后端，后端是不是用集合接收？？？？？ 
                    */
                    for(let i=0;i<resp.data.list.length;i++){
                        // for(let j=0;j<this.statusList.length;j++){
                        //     if(resp.data.list[i].status==this.statusList[j].value){
                        //             resp.data.list[i].status=this.statusList[j].label
                        //         }
                        // }
                        this.data1.push(resp.data.list[i])
                    }
                    this.pageTotal=resp.data.total  
                })
          }, 
           handlePage (value) {
                //this.data1 = this.getSendInfo();
                this.pageNum = value  
                console.log("当前页："+value)
                this.getSendInfo(this.pageNum)  
            },
            /**
             * 点击修改公众号App
             */
            // changeApp(index){
            //    //console.log(dis);
            //    this.$ajax({
            //          method: 'post',
            //          url:common.getUrl().url+"/appAccount/update/status",
            //          withCredentials: true,       
            //          crossDomain: true,
            //          params:{
            //             appAccountId:dis.id 
            //          }  
            //     }).then((resp)=>{
            //         console.log(resp.data)
            //         /* 
            //          * 后台传一个集合到前端：前端显示就是一个数组，也就是说直接当作数组进行处理就行
            //          *      1、可以试试，那么前端传一个数组到后端，后端是不是用集合接收？？？？？ 
            //         */
            //         if(resp.data.code==200){
            //             this.getSendInfo(this.pageNum);
            //             this.$Message.success(resp.data.msg); 
            //             return ;
            //         }
            //         this.pageTotal=resp.data.total  
            //     })
               
            // },
            /**
             * 修改
             */
            updateApp(tempApp){
                console.log(tempApp)
                //先清空数据
                this.lock=""
                this.formValidate=""
                this.formValidate=tempApp

                this.modal1=true;

            },
            /**
             * 提交修改
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
                            url:common.getUrl().url+'/appAccount/update',
                            withCredentials: true,
                            crossDomain: true,
                            data:this.Qs.stringify(this.formValidate)
                        }).then((resp) =>{
                            console.log(resp)
                            if(resp.data.code==200){
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

           
        },
        created(){
            this.getSendInfo(this.pageNum)
            
       },
       mounted() {
       
      }
    }       
</script>
