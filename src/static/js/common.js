
export default {
    /**
 *  配置服务器地址：
 *      1、测试环境
 *      2、生产环境
 */

    getUrl(){
        var flag=true;
       // var flag=false;
        /**
         *  方法里面定义方法
         */
        let getBaseUrl=(flag)=>{
            var baseUrl={};
            if(flag){
                baseUrl={
                        url:'http://118.190.133.146:8091'	
                }
            }else{
                baseUrl={
                        url:'http://localhost:8011'	
                    }
            }
            return baseUrl;
       }
        return getBaseUrl(flag);
    }
}