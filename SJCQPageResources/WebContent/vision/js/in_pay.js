/**
 * 公用 方法
 * 加入购物车
 */
var in_pay = {
    /**
     * 初始化
     */
    init:function(){

    },
    //加入购物车提示
    toastShow:function(str){
        $('body').append('<div class="tips" id="comToast">'
            +'<i class="ico ico25 mr10"></i>'+str
        +'</div>');
        setTimeout(function(){
            $('#comToast').remove();
        },1000)
    },
    /**
     * 加入购物车
     * @param picXh 图片序号
     */
    add:function(picXh){
        if(USRSESSION==null){
        	layer.msg("请先登录！");
            return;
        }
        $.ajax({
            url:"/sjcq/shoppingCart/add",    // 请求的url地址
            type:"post",   // 请求方式
            dataType:"text",   // 返回格式为json
            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
            data:{picXh:picXh},   // 参数值     
            success:function(data){
               //console.log(data);
               //layer.msg(data);
               in_pay.toastShow(data);
               index_nav.carNum();//刷新 购物车数量
            },
            error:function(){
                layer.msg('加载目录失败！');
            }
        });
    }

}