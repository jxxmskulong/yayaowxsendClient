<style>
.firstPageWrap{
   width: 100%;
   height:auto!important;
   min-height:100vh;
   margin: 77px 269px;
}
.firstPageAnn{
    font-size: 30px;
    color: #d8d6d6 !important;
    text-shadow: 0px 0.5px #666, 0px 1px #666, 0px 1.5px #666, 0px 2px #666;
    font-family: cursive;
}
.welcome_pic img{
    width: 900px;
    height: 600px;
}

</style>
<template>
<div class="firstPageWrap">
    <span class="firstPageAnn">欢迎进入</span>
    <div class="chlForm">
            <div class="welcome_pic">
                <img src="../static/imgs/welcome.jpg" alt=""/>
            </div>
    </div>
</div>    
</template>
<script>
import common from '../static/js/common.js'
    export default {
        data () {
            return {
               
            }
        },
        methods: {
               
        },
        created(){
            
        },
        mounted() {
           
      }
    }
</script>
