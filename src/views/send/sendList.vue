<style>
.sendWrap{
   width: 100%;
   height: 100vh;
   margin: 77px 269px;
}
.sendAnnount{
    font-size: 30px;
    color: #d8d6d6 !important;
    text-shadow: 0px 0.5px #666, 0px 1px #666, 0px 1.5px #666, 0px 2px #666;
    font-family: cursive;
}
.sendPageFirst{
    margin: 10px;
    overflow: hidden;
    position:relative;
    top: 60px;
    width: 438px;
    left: 452px;
}  
.addSend{
    width: 120px;
    top: 35px;
    position: relative;
    left: -122px;
}
   
</style>

<template>
<div class="sendWrap">
     <span class="sendAnnount">推送列表</span>
     <i-button type="primary" class="addSend"@click="setSendTime">添加推送</i-button>
    <Modal
        v-model="modal1"
        width="60%"
        title="设置推送时间"
        @on-ok="ok"
        @on-cancel="cancel">
        <Form ref="formValidate" :model="formValidate" :label-width="80" :rules="ruleValidate" >
            <FormItem label="请选择">
                <RadioGroup v-model="formValidate.type">
                    <Radio label="sendTime">固定时间发送</Radio>
                    <Radio label="selfSendTime">自定义时间发送</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="Date" prop="sendTime">
                <DatePicker type="datetime" placeholder="设置固定发送时间" v-model="formValidate.sendTime" style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem label="SelfDate" prop="name">
                <Input v-model="formValidate.name" placeholder="设置自定义发送时间" style="width: 200px" :disabled="sfdisabled"></Input>
            </FormItem>
            <FormItem label="信息ID" prop="sendTimeId">
                <Input v-model="formValidate.sendTimeId" placeholder="设置发送信息ID" style="width: 200px"></Input>
            </FormItem>
        </Form> 
        <div slot="footer">
                <Button type="primary" @click="handleSubmit('formValidate')" :disabled="disabled">提交</Button>
                <Button type="ghost" @click="handleReset('formValidate')" >重置</Button>
        </div>
    </Modal>
     <Table border :columns="columns1" :data="data1" style="min-width:900px;width:calc(100vw - 300px);top:50px;" ></Table>
     <div class="sendPageFirst" >
        
            <!--<Page :total="pageTotal" :current="pageNum" :page-size="pageSize" show-elevator show-total 
            @on-change="handlePage"></Page>-->
           <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" show-elevator show-sizer show-total 
            @on-change="handlePage"></Page>      <!-- show-sizer： 在页面显示，每页显示多少条  但是必须是pageSize=10,也就是每页显示10条 -->
        
    </div> 

</div>
</template>
<script>
import common from '../../static/js/common.js'
let deleteIndex
    export default {
        data () {
            return {
                  ruleValidate: {
                    sendTime: [
                        { required: true, message: '请设置发送时间',pattern: /.+/, trigger: 'change' }
                    ],
                    sendTimeId: [
                        { required: true, message: '请设置发送信息ID', trigger: 'blur' },
                    ]
                },
                sfdisabled:true,
                disabled:false,
                columns1: [
                    {   
                        title: '序号',
                        width:80,
                        render: (h,params) => {
                            return h('span', params.index + (this.pageNum- 1) * this.pageSize + 1);
                        }
                    },
                    {
                        title: '发送类型',
                        key: 'type'
                    },
                    {
                        title: '固定发送时间',
                        key: 'sendTime'
                    },
                    {
                        title: '自定义发送时间',
                        key: 'selfSendTime'
                    },
                    {
                        title: '信息ID',
                        key: 'sendInfoId'
                    },
                    {
                        title: '状态',
                        key: 'status'
                    },
                    {
                        title: '创建时间',
                        key: 'createDate'
                    },
                     {
                        title: '创建人',
                        key: 'acountName'
                    },{     
                        title: '操作',
                        key: 'action', 
                       
                        align: 'center',
                        render: (h, params) => {
                             let bt1=h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                       
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.show(params.index)
                                        }
                                    },
                                    
                                }, '修改')
                               let bt2=h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        
                                    },
                                    style: {
                                        // left:'-5px',
                                        // position: 'relative'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index)
                                        }
                                    }
                                }, '停止')
                                return h('div', [
                                             bt1,
                                             bt2
                                      ]);
                        }
                    }
                ],
                data1: [
                    
                ],
                modal1:false,
                pageTotal: 0,  
                pageNum: 1,
                pageSize: 10,
                typeList:[
                    {
                        value: 0,
                        label: "news"
                    },
                    {
                        value: 1,
                        label: "text"
                    }
                ],
                formValidate:{
                   type:'sendTime',
                   sendTime:'',
                   selfSendTime:'',
                   sendInfoId:'',
                   acountName:''
                }
              
            }
        },
        methods:{
            ok () {
                this.$Message.info('点击了确定');
            },
            cancel () {
                this.$Message.info('点击了取消');
            },
              /*
             *  提交
             */
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        /**
                         *  验证通过，那么把表单值发送axios请求传给后台
                         */  
                        this.$ajax({
                            method:'post',
                            url:common.getUrl().url+'/add/website',
                            withCredentials: true,
                            crossDomain: true,
                            data:this.Qs.stringify(this.formValidate)
                        }).then((resp) =>{
                            console.log(resp.data.code)
                            if(resp.data.code==100){
                                this.disabled=true
                            }
                            this.$Message.success(resp.data.info.addmsg);
                        })
                        //this.$Message.success('提交成功!');
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            /**
             * 添加推送
             */
            setSendTime(){
                this.modal1=true;
            },

            /*
             *  分页获取所有的发送信息、并展示在表格中
             * 
             */
             getSendInfo(num){
                this.$ajax({
                     method: 'post',
                     url:common.getUrl().url+"/send",
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
            }
        },
        created(){
            this.getSendInfo(this.pageNum);
             
       },
       mounted() {
       
      }
    }       
</script>
