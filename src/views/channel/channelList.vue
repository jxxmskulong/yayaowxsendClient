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
.text-danger{
    font-size: 15px;
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
.searchAppId{
    position: relative;
    top: -10px;
}  
</style>

<template>
<div class="addWrap">
     <span class="addAnnount">渠道列表</span>
     <Table border :columns="columns1" :data="data1" style="min-width:900px;width:calc(100vw - 300px);top:20px;" ></Table>
     <div class="pageFirst" >
        
            <!--<Page :total="pageTotal" :current="pageNum" :page-size="pageSize" show-elevator show-total 
            @on-change="handlePage"></Page>-->
           <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" show-elevator show-sizer show-total 
            @on-change="handlePage"></Page>      <!-- show-sizer： 在页面显示，每页显示多少条  但是必须是pageSize=10,也就是每页显示10条 -->
        
    </div>
    <Modal
        v-model="modal1"
        width="60%"
        title="推送信息列表"
       >
       <div class="searchAppId">
        <Select v-model="model2" style="width:25%;">
            <Option v-for="item in appList" :value="item.appId" :key="item.appName">{{ item.appName }}</Option>
        </Select>
        <!--<Button type="ghost" icon="ios-search" @click="search">搜索</Button>-->
     </div>
        <Table :columns="columns2" :data="data2"></Table> 
        <div slot="footer">
                <Button type="primary" style="display:none;">提交</Button>
                <Button type="ghost"  style="display:none;">重置</Button>
        </div>
    </Modal> 

</div>
</template>
<script>
import common from '../../static/js/common.js'
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
                        title: '渠道ID',
                        key: 'channelId'
                    },
                    {
                        title: '名称',
                        key: 'name'
                    },
                    {
                        title: '联系电话',
                        key: 'phone'
                    },
                    // {
                    //     title: '推广链接',
                    //     key: 'link'
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
                             let bt1=h('Button', {
                                    attrs: {
                                        id:params.row.channelId,
                                        //id:params.index,
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
                                            // console.log(params);
                                            // let dis=document.getElementById(bt1.data.attrs.id)
                                            this.getLink(params.row.channelId,params.row.name)
                                        },
                                        
                                    }
                                }, '获取推广链接')
                                 return h('div', [
                                             bt1,
                                      ])
                        }
                    }
                    
                ],
                columns2: [
                    {   
                        title: '序号',
                        width:80,
                        render: (h,params) => {
                            return h('span', params.index + (this.pageNum1- 1) * this.pageSize1 + 1);
                        }
                    },
                    {
                        title: '渠道名称',
                        key: 'channelName'
                    },
                    {
                        title: '公众号名称',
                        key: 'appName'
                    },
                    {
                        title: '推广链接',
                        key: 'link'
                    }
                    
                ],
                data1: [
                    
                ],
                data2: [
                    
                ],
                model2:'',
                modal1:false,
                pageTotal: 0,  
                pageNum: 1,
                pageSize: 10,
                appList:[

                ],
                pageNum1: 1,
                pageSize1: 10
            }
        },
        methods:{
            /*
             *  分页获取所有的发送信息、并展示在表格中
             * 
             */
             getSendInfo(num){
                this.$ajax({
                     method: 'post',
                     url:common.getUrl().url+"/channel/select",
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
            //点击获取链接按钮
            getLink(chl_id,chl_name){
                this.$ajax({
                     method: 'post',
                     url:common.getUrl().url+"/channel/link",
                     withCredentials: true,       
                     crossDomain: true,
                     params:{
                        //  num:num,
                        //  size:this.pageSize
                        channelid: chl_id,
                        channelname: chl_name
                     }  
                }).then((resp)=>{
                    /**
                     *  每次点击下一页先清空本页数据
                     */
                    this.data2=[];
                    console.log(resp.data)
                    
                    /* 
                     * 后台传一个集合到前端：前端显示就是一个数组，也就是说直接当作数组进行处理就行
                     *      1、可以试试，那么前端传一个数组到后端，后端是不是用集合接收？？？？？ 
                    */
                    for(let i=0;i<resp.data.length;i++){
                        this.data2.push(resp.data[i])
                    }
                    //this.pageTotal=resp.data.total  
                })

                this.modal1=true
            }

           
        },
        created(){
            this.getSendInfo(this.pageNum);
             
       },
       mounted() {
       
      }
    }       
</script>
