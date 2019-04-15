/**
 * 基于jquery
 * 倒计时等待，发送验证码
 * 默认60秒
 */
var codeTime = {
    x:60,
    /**
     * 发送验证码
     * @param phone 手机号
     * @param callback 回调函数
     */
    phone:function(phone,callback){
        $.ajax({
            url:"/sjcq/regist/phone",    // 请求的url地址
            type:"post",   // 请求方式
            dataType:"text",   // 返回格式为json
            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
            data:{phone:phone},    // 参数值
            success:function(data){
                callback(data);
            },
            error:function(){
                callback("error");//失败传递字符串error
            }
        }); 
    },
    /**
     * 发送验证码
     * @param phone 手机号
     * @param callback 回调函数
     */
    phone2:function(phone,callback){
        $.ajax({
            url:"/sjcq/regist/phone2",    // 请求的url地址
            type:"post",   // 请求方式
            dataType:"text",   // 返回格式为json
            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
            data:{phone:phone},    // 参数值
            success:function(data){
                callback(data);
            },
            error:function(){
                callback("error");//失败传递字符串error
            }
        }); 
    },
    /**
     * @param id 标签id
     * @param valT 赋值类型 0:代表value 1:代表text
     * @param temX 等待时间 
     * @param callback 回调函数
     */
    setTime:function(id,valT,temX,callback){
        codeTime.x = temX;//获取等待时间
        codeTime.valText(id,valT,codeTime.x);//点击后直接改变显示值
        var codeOn  = setInterval(function(){//创建定时器
            codeTime.x--;
            codeTime.valText(id,valT,codeTime.x);//改变显示值
            if(codeTime.x==0){//等带时
                clearInterval(codeOn);//关闭定时器
                codeTime.codeX = 60;//返回初始值
                callback();//执行回调函数
            }
        },1000);
    },
    /**
     * @param id 标签id
     * @param valT 赋值类型 0:代表value 1:代表text
     * @param temX 等待时间 
     */
    valText:function(id,valT,temX){
        if(valT==0){
            $("#"+id).val("重新发送(" + temX + ")");
        }else{
            $("#"+id).text("重新发送(" + temX + ")");
        }
    }

}