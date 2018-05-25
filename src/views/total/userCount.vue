<style>
.userCountWrap{
   width: 100%;
   height: 100vh;
   margin: 77px 269px;
}
.userCountAnnount{
    font-size: 30px;
    color: #d8d6d6 !important;
    text-shadow: 0px 0.5px #666, 0px 1px #666, 0px 1.5px #666, 0px 2px #666;
    font-family: cursive;
}
.userCountPageFirst{
    margin: 10px;
    overflow: hidden;
    position:relative;
    top: 60px;
    width: 600px;
    left: 452px;
}  
.userCountSend{
    width: 120px;
    top: 35px;
    position: relative;
    left: -177px;
}
.updateData2{
    position: relative;
    width: 100px;
} 
.updateUser{
    width:auto;
    position: relative;
    top:10px;
} 
.searchUser{
    width:auto;
    position: relative;
    top:25px;
}
</style>

<template>
<div class=" userCountWrap">
     <span class="userCountAnnount">用户数据统计</span>
     <div class="updateUser">
       <Select v-model="model2" clearable style="width:200px">
            <Option v-for="item in appList" :value="item.appId" :key="item.appId">{{ item.appName }}</Option>
        </Select>
        <Button type="info" @click="updateData2" class="updateData2" :disabled="updis">更新</Button>
     </div>
     <div class="searchUser">
         <Select v-model="model3" clearable style="width:200px" placeholder="请选择公众号">
            <Option v-for="item in appList" :value="item.appId" :key="item.appId">{{ item.appName }}</Option>
        </Select>
         <Input v-model="channelId" placeholder="请输入渠道Id" style="width:200px"></Input>
        <Select v-model="model1" clearable  style="width:200px" placeholder="请选择用户状态">
            <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        
        <Button type="ghost" icon="ios-search" @click="search">搜索</Button>
     </div>
     <Table border :columns="columns1" :data="data1" style="min-width:900px;width:calc(100vw - 300px);top:30px;" ></Table>
     <div class="userCountPageFirst" >
        
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
                columns1: [
                    {   
                        title: '序号',
                        width:80,
                        render: (h,params) => {
                            return h('span', params.index + (this.pageNum- 1) * this.pageSize + 1);
                        }
                    },
                    {
                        title: '用户Id',
                        key: 'openId'
                    },
                    {
                        title: 'appId',
                        key: 'appId'
                    },
                    {
                        title: '渠道Id',
                        key: 'channelId'
                    },
                    {
                        title: '渠道账号',
                        key: 'phone'
                    },
                    {
                        title: '公众号名称',
                        key: 'appName'
                    },
                    {
                        title: '状态',
                        key: 'status'
                    },
                    {
                        title: '关注时间',
                        key: 'showDate'
                    },
                    {
                        title: '创建时间',
                        key: 'updateDate'
                    }
                ],
                data1: [

                ],
                pageTotal: 0,  
                pageNum: 1,
                pageSize: 10,
                appList:[],
                typeList:[
                    {
                        value: 0,
                        label: "关注"
                    },
                    {
                        value: 1,
                        label: "取消关注"
                    },
                    {
                        value: 2,
                        label: "关注不活跃"
                    },
                    {
                        value: 3,
                        label: "全部用户"
                    }
                ],
                model1:'',
                model2:'',
                model3:'',
                updis: false,
                channelId:''
            }
        },
        methods:{
            /**
             * 搜索
             */
            search(){
                this.getSendInfo(1)
            },
            /*
             *  分页获取所有的发送信息、并展示在表格中
             * 
             */
             getSendInfo(num){
                this.$ajax({
                     method: 'post',
                     url:common.getUrl().url+"/user/select",
                     withCredentials: true,       
                     crossDomain: true,
                     params:{
                         num:num,
                         size:this.pageSize,
                         appId:this.model3,
                         channelId:this.channelId,
                         status:this.model1
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
                                if(resp.data.list[i].status==this.typeList[j].value){
                                    resp.data.list[i].status=this.typeList[j].label
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
            /**
             * 更新数据
             */
            updateData2(){
                console.log(this.model2)
                this.updis=true;
                this.$ajax({
                     method: 'get',
                     url:common.getUrl().url+"/wx/update",
                     withCredentials: true,       
                     crossDomain: true,
                      params:{
                       appId:this.model2 
                     } 
                }).then((resp)=>{
                    console.log(resp.data)
                    if(resp.data.code==200){
                        this.$Message.success(resp.data.msg); 
                        return ;
                    }
                    this.updis=false;
                    this.$Message.error(resp.data.msg); 
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
            }

        },
        created(){
            this.getSendInfo(this.pageNum)     
            this.getAppList()
       },
       mounted() {
       
      }
    }       
</script>
