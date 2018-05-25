<style>
.channelCountWrap{
   width: 100%;
   height: 100vh;
   margin: 77px 269px;
}
.channelCountAnnont{
    font-size: 30px;
    color: #d8d6d6 !important;
    text-shadow: 0px 0.5px #666, 0px 1px #666, 0px 1.5px #666, 0px 2px #666;
    font-family: cursive;
}
.channelCountPageFirst{
    margin: 10px;
    overflow: hidden;
    position:relative;
    top: 60px;
    width: 438px;
    left: 452px;
}  
.channelCountSend{
    width: 120px;
    top: 35px;
    position: relative;
    left: -177px;
}
.searchChannel{
    width:auto;
    position: relative;
    top:10px;
}
.updateData{
    position: relative;
    left: 35%;
    width: 100px;
}

</style>

<template>
<div class="channelCountWrap">
     <span class="channelCountAnnont">渠道数据统计</span>
     <div class="searchChannel" v-if="isAdmin">
        <Input v-model="cphone" placeholder="请输入账号" style="width: 180px"></Input>
        <Button type="ghost" icon="ios-search" @click="search">搜索</Button>
        <Button type="info" @click="updateData" class="updateData" :disabled="updis">更新</Button>
     </div>
     
     <Table border :columns="columns1" :data="data1" style="min-width:900px;width:calc(100vw - 300px);top:30px;" ></Table>
     <div class="channelCountPageFirst" >
        
            <!--<Page :total="pageTotal" :current="pageNum" :page-size="pageSize" show-elevator show-total 
            @on-change="handlePage"></Page>-->
           <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" show-elevator show-sizer show-total 
            @on-change="handlePage"></Page>     <!--  show-sizer： 在页面显示，每页显示多少条  但是必须是pageSize=10,也就是每页显示10条 -->
        
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
                        title: '渠道账号',
                        key: 'phone'
                    },
                    // {
                    //     title: '渠道Id',
                    //     key: 'channelId'
                    // },
                    {
                        title: '状态',
                        key: 'status'
                    },
                    {
                        title: '创建时间',
                        key: 'createDate'
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
                        label: "未关注"
                    },
                    {
                        value: 1,
                        label: "关注"
                    },
                    {
                        value: 2,
                        label: "取消关注"
                    }
                ],
                cphone:'',
                isAdmin:true,
                updis:false
            }
        },
        methods:{
            search(){
                this.getSendInfo(this.pageNum,this.cphone);
            },
            /*
             *  分页获取所有的发送信息、并展示在表格中
             * 
             */
             getSendInfo(num,cphone){
                this.$ajax({
                     method: 'post',
                     url:common.getUrl().url+"/channelUser/phone",
                     withCredentials: true,       
                     crossDomain: true,
                     params:{
                         num:num,
                         count:this.pageSize,
                         phone:this.cphone
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
             *  判断是否是管理员
             */
            roleJudge(){
                let account=JSON.parse(sessionStorage.getItem("Account"));
                if(account.roleName !="管理员"){
                    this.isAdmin=false;
                    this.cphone=account.phone;
                }
            },
            updateData(){
                this.updis=true;
                this.$ajax({
                     method: 'get',
                     url:common.getUrl().url+"/wx/updateData",
                     withCredentials: true,       
                     crossDomain: true,
                }).then((resp)=>{
                    console.log(resp.data)
                    if(resp.data.code==200){
                        this.$Message.success(resp.data.msg); 
                        return ;
                    }
                    this.updis=false;
                    this.$Message.error(resp.data.msg); 
                })
            }
        },
        created(){
            console.log(this.cphone)
            this.roleJudge()
            this.getSendInfo(this.pageNum,this.cphone); 
       },
       mounted() {
       
      }
    }       
</script>
