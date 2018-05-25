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
    <span class="chlAnnoun">新增渠道</span>
    <div class="chlForm">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <FormItem label="Name" prop="name">
                <Input v-model="formValidate.name" placeholder="名称"></Input>
            </FormItem>

            <FormItem label="Phone" prop="phone">
                <Input v-model="formValidate.phone" placeholder="联系电话"></Input>
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
import common from '../../static/js/common.js'
    export default {
        data () {
            return {
                formValidate: {
                   name:'',
                   phone:''
                },
                disabled:false,
                ruleValidate: {
                    name: [
                        { required: true, message: '请填写名称', trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, message: '请填写联系电话', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
               
             /**
              * 点击提交
              *    如果验证通过：那么发送axios
              */
              handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        /**
                         *  验证通过，那么把表单值发送axios请求传给后台
                         */
                         //防止表单重复提交
                         this.disabled=true;
                        this.$ajax({
                            method:'post',
                            url:common.getUrl().url+'/channel/add',
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
