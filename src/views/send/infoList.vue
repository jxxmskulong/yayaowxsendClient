<style>
.addWrap{
   width: 100%;
   height: 100vh;
   margin: 77px 269px;
}
.addAnnount{
    font-size: 30px;
    color: #d8d6d6 !important;
    text-shadow: 0px 0.5px #666, 0px 1px #666, 0px 1.5px #666, 0px 2px #666;
    font-family: cursive;
}
.addContent{
    color: red;
    position: relative;
    margin: 10px 0;
    font-size: 14px;
}
.titleIpt{
    position: relative;
    top: 10px;
    width: 300px;
    height: 40px;
}
.titleCla{
    width: 300px;
    height: 40px;
}
.picIpt{
    position: relative;
    margin: 35px 0px;
}
.text-danger{
    font-size: 15px;
    color: red;
}
.isExit{
        font-size: 17px;
        text-align: center;
        color: red;
    }
.pageFirst{
    margin: 10px;
    overflow: hidden;
    position:relative;
    top: 30px;
    width: 438px;
    left: 452px;
}  
.sAppId{
    position: relative;
    top: -10px;
}     
.btnInfoUpload{
    width: 200px;
    position: relative;
}
#imgInfoFile{
    position: absolute;
    height: 32px;
    margin: 0 0 0 -152px;
    opacity: 0;
    width: 150px;
    top:0px;
    background:red;
}
#imgInfoHead{
    top: 12px;
    position: relative;
}
</style>

<template>
<div class="addWrap">
     <span class="addAnnount">信息列表</span>
     <Table border :columns="columns1" :data="data1" style="min-width:900px;width:calc(100vw - 300px);top:20px;" ></Table>
     <div class="pageFirst" >
        
            <!--<Page :total="pageTotal" :current="pageNum" :page-size="pageSize" show-elevator show-total 
            @on-change="handlePage"></Page>-->
           <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" show-elevator show-sizer show-total 
            @on-change="handlePage"></Page>      <!-- show-sizer： 在页面显示，每页显示多少条  但是必须是pageSize=10,也就是每页显示10条 -->
        
    </div> 
    <!-- 推送 -->
    <Modal
        v-model="modal1"
        width="60%"
        title="选择公众号"
       >
       
     <Form ref="formValidate" :model="formValidate" :label-width="80">
            <FormItem label="公众号">
                <Select v-model="app" style="width:200px;">
                    <Option v-for="item in appList" :value="item.appId" :key="item.appId">{{ item.appName }}</Option>
                </Select>
            </FormItem>

            <FormItem label="类型">
                <Select v-model="formValidate.type" style="width:200px;" :disabled="tempDisabled">
                    <Option v-for="item in typeList" :value="item.label" :key="item.label">{{ item.label }}</Option>
                </Select>
            </FormItem>

            <FormItem label="标题">
                <Input v-model="formValidate.title" placeholder="标题" style="width: 200px" :disabled="tempDisabled"></Input>
            </FormItem>
            <FormItem label="描述">
                 <Input v-model="formValidate.description" type="textarea" :autosize="{minRows: 5,maxRows: 8}" :disabled="tempDisabled" placeholder="描述,1-21000"></Input>
            </FormItem>
            <FormItem label="图片">
                <!--<Button type="info" class="btnInfoUpload" :disabled="tempDisabled">上传图片</Button>
			    <input type="file" id="imgInfoFile" @change="uploadImage()" name="fileName" multiple="multiple" ref="avatarInput" :disabled="tempDisabled"/>-->
                <img id='imgInfoHead' :src="formValidate.pUrl" alt="" style="width:80%;"/>
            </FormItem>

            <FormItem label="跳转链接">
                <Input v-model="formValidate.sUrl" placeholder="跳转链接" style="width: 200px" :disabled="tempDisabled"></Input>
            </FormItem>

            <!--<FormItem>
                <Button type="info"  @click="startSend('formValidate')" style="width:200px;">进行推送</Button>
            </FormItem>-->
        </Form> 
        <div slot="footer">
                <Button type="primary" @click="handleSubmit2('formValidate')" :disabled="disabled">进行推送</Button>
                <Button type="ghost" @click="handleReset('formValidate')" style="display:none;">重置</Button>
        </div>
    </Modal> 
    <!-- 修改 -->
    <Modal
        v-model="modal2"
        width="60%"
        title="设置推送时间"
        @on-ok="ok"
        @on-cancel="cancel">
        <Form ref="formValidate" :model="formValidate" :label-width="80" :rules="ruleValidate" >
            <FormItem label="类型" prop="type">
                <Select v-model="formValidate.type" style="width:200px;">
                    <Option v-for="item in typeList" :value="item.label" :key="item.label">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="标题" prop="title">
                <Input v-model="formValidate.title" placeholder="标题" style="width: 200px" ></Input>
            </FormItem>
            <FormItem label="描述" prop="description">
                <Input v-model="formValidate.description" type="textarea" :autosize="{minRows: 5,maxRows: 8}"  placeholder="描述,1-21000"></Input>
            </FormItem>
            <FormItem label="Imghead" prop="img">
                <Button type="info" class="btnInfoUpload" >上传图片</Button>
			    <input type="file" id="imgInfoFile" @change="uploadImage()" name="fileName" multiple="multiple" ref="avatarInput" />
                <img id='imgInfoHead' :src="formValidate.pUrl" alt="" style="width:80%;"/>
            </FormItem>

            <FormItem label="跳转链接" prop="sUrl">
                <Input v-model="formValidate.sUrl" placeholder="跳转链接" style="width: 200px"></Input>
            </FormItem>
            
        </Form> 
        <div slot="footer">
                <Button type="primary" @click="handleSubmit('formValidate')" :disabled="disabled">提交</Button>
                <Button type="ghost" @click="handleReset('formValidate')" >重置</Button>
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
                        title: '信息ID',
                        key: 'sId'
                    },
                    {
                        title: '类型',
                        key: 'type'
                    },
                    {
                        title: '标题',
                        key: 'title'
                    },
                    {
                        title: '描述',
                        key: 'description',
                         render: (h,params) => {
                             return h('span', 
                               params.row.description.substr(0,100)+"..."
                             )
                         }

                    },
                    {
                        title: '跳转Url',
                        key: 'sUrl'
                    },
                    {
                        title: '封面图片',
                        key: 'pUrl',
                         render: (h,params) => {
                             return h('img', {
                                attrs: {
                                    src: params.row.pUrl,
                                    width:'100%',
                                    height:'100%'
                                }
                             })
                         }
                    },
                    {
                        title: '创建时间',
                        key: 'createDate'
                    },
                    //  {
                    //     title: '创建人',
                    //     key: 'acountName'
                    // },
                    {     
                        title: '操作',
                        key: 'action', 
                        align: 'center',
                        render: (h, params) => {
                             let bt1=h('Button', {
                                    attrs: {
                                        id:params.row.sendInfoId,
                                        //disabled:false
                                    },
                                    props: {
                                        type: 'info',
                                         size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            //let dis=document.getElementById(bt1.data.attrs.id)
                                           // dis.disabled=true
                                           console.log(params.row)
                                           
                                           this.updateInfo(params.row)
                                        }
                                    },
                                    
                                }, '修改')
                                let bt2=h('Button', {
                                    attrs: {
                                        id:params.row.sendInfoId,
                                        //disabled:false
                                    },
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                           // let dis=document.getElementById(bt1.data.attrs.id)
                                            //dis.disabled=true
                                            //console.log(dis)
                                            //this.confirm(params.index,dis)
                                            this.send(params.row)
                                        }
                                    },
                                    
                                }, '推送')
                                
                                 return h('div', [
                                             bt1,
                                             bt2
                                      ]);
                        }
                    }
                ],
                data1: [
                    
                ],
                pageTotal: 0,  
                pageNum: 1,
                pageSize: 10,
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
                appList:[

                ],
                modal1:false,
                modal2:false,
                model1:'',
                model2:'',
                disabled:false,
                tempDisabled:true,
                formValidate:{
                   type:'',
                   title:'',
                   description:'',
                   sUrl:'',
                   pUrl:''
                },
                app:'',
                ruleValidate: {
                    type: [
                         { required: true, message: '请选择消息类型', pattern: /.+/, trigger: 'change' }
                    ],
                    title: [
                        { required: true, message: '请输入标题', trigger: 'blur' },
                    ],
                   /*  sUrl: [
                        { required: true, message: '请输入跳转链接', trigger: 'blur' },
                    ] */
                },
                 lock: false
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
                    this.formValidate.pUrl=resource;
                   }
               }) 
               if(this.errAccMsg!=""){
                    this.$Message.error(this.errAccMsg);
               }
            },
            /*
             *  分页获取所有的发送信息、并展示在表格中
             * 
             */
             getSendInfo(num){
                this.$ajax({
                     method: 'post',
                     url:common.getUrl().url+"/info/select",
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
                        for(let j=0;j<this.typeList.length;j++){
                                if(resp.data.list[i].type==this.typeList[j].value){
                                    resp.data.list[i].type=this.typeList[j].label
                                }
                           }
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
        /*
           *   推送：
           *        发送ajax给后台，推送信息
           */
          send(tempSend) {
                //先清空、然后赋值
                this.app="";
                this.formValidate="";
                this.lock=""
                this.formValidate=tempSend
            console.log(this.formValidate)
                this.modal1=true

            },
             /**
             * 提交推送表单
             */
            handleSubmit2 (name) {
                if(this.lock){
                    console.log(this.lock)
                    return this.$Message.error('请勿重复提交!');
                }
                this.lock=true;
                 for(let i=0;i<this.typeList.length;i++){
                    if(this.typeList[i].label==this.formValidate.type){
                        this.formValidate.type=this.typeList[i].value
                    }
                }
                this.$ajax({
                    method: 'post',
                    url:common.getUrl().url+"/wx/send",
                    withCredentials: true,       
                    crossDomain: true,
                    data:this.Qs.stringify(this.formValidate),
                    params:{
                        appId:this.app
                    }  
            }).then((resp)=>{
                console.log(resp);
                if(resp.data.code==200){
                    //this.$Message.info('推送成功!');
                    this.$Message.success('推送成功!');
                    return ;
                }
                this.$Message.error(resp.data.msg);
                this.lock=false;
            })
        },
            /**
             * 获取公众号列表：appList
             */
            getAppList(){
                this.$ajax({
                    method: 'get',
                    url:common.getUrl().url+"/appAccount/apps",
                    withCredentials: true,       
                    crossDomain: true,
                }).then((resp)=>{
                    console.log(resp.data)
                    for(let i=0;i<resp.data.length;i++){
                        this.appList.push(resp.data[i])
                    }
                })
            },
            /**
             * 修改
             */
            updateInfo(tempInfo){
                this.lock=""
                this.formValidate=""
                this.formValidate=tempInfo
               
                this.modal2=true;
                 
            },
            /**
             * 提交修改后的表单
             */
            handleSubmit (name) {
                 if(this.lock){
                    console.log(this.lock)
                    return this.$Message.error('请勿重复提交!');
                }
                this.lock=true;

                 for(let i=0;i<this.typeList.length;i++){
                    if(this.typeList[i].label==this.formValidate.type){
                        this.formValidate.type=this.typeList[i].value
                    }
                }
                console.log(this.formValidate.type)
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$ajax({
                            method: 'post',
                            url:common.getUrl().url+"/info/update",
                            withCredentials: true,       
                            crossDomain: true,
                            data:this.Qs.stringify(this.formValidate)
                        }).then((resp)=>{
                           // console.log(resp.data)
                            if(resp.data.code==200){
                                this.$Message.success(resp.data.msg);
                                
                            }else{
                                this.$Message.error(resp.data.msg);
                            }
                           this.lock=false
                        })
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            /**
             * 重置修改表单
             */
            handleReset (name) {
                console.log(name)
                this.$refs[name].resetFields();
            }
        },
        created(){
            this.getSendInfo(this.pageNum);
            this.getAppList();
               
       },
       mounted() {
       
      }
 }           
</script>
