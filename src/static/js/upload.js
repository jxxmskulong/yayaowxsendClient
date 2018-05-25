/**
 *  图片上传工具类
 * 
 * p.success 
 */

export default {  
    /**
     *   axios异步请求，返回需要值，必须通过一个回调函数来获取p.success(resp)
     * @param {*} this 
     * @param {*} p 
     */
    uploadImg($this,p){
            $this.errAccMsg="";
               //设置图片格式、单图片大小(小于300KB)
               let options={
					picType:["jpg","jpeg","png","bmp"],
					picSize:300
			}
               //获取files对象
               let file=event.currentTarget.files[0];
               //判断图片格式
               let fileType=file.type.substr(file.type.lastIndexOf("/")+1);
               //obj.forEach((e)=>{})   遍历数组
               let tag=false;
               options.picType.forEach((e)=>{
                    if(e==fileType){
                        tag=true;
                    }
                })
                if(tag==false){
                    $this.errAccMsg="格式错误";
                    return ;
                }
                //判断图片大小
                var size=file.size;
                console.log(Math.round(size/1024));
			    if(Math.round(size/1024)>options.picSize){//B 转为KB      Math.round(size/1024*100/1024)/100   B 转 MB
                    $this.errAccMsg="图片大小不能超过300KB";
				return ;
			    }
                /*限制单图片上传
                if(this.picArr.length>0){
                    this.errAccMsg="只能上传一张图片";
                    return ;
                }   */
                //如果验证通过了，传到后台，并上传到服务器 ,并返回URL，进行显示 
                 
			    var formDate=new FormData();
                formDate.append("picFile",file);
                //console.log(formDate.get("picFile"));
                $this.$ajax({
                    method:'post',
                    data:formDate,
                    withCredentials: true,
                    crossDomain: true,
                    url:"http://118.190.133.146:8091/info/upload",
                    //url:"http://localhost:8011/info/upload",
                    headers:{'Content-Type':'multipart/form-data'}
                }).then((resp)=>{
                    p.success(resp.data.info.msg)
                }).catch((error)=>{
                    console.log(error);
                })
           }


}