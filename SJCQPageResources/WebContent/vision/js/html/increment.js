/**
 * 增资服务
 */
$(function(){
	increment.initData();
})

var increment={
	initData:function(){
		$.ajax({
            url:"/sjcq/ptgyatv/searchAddedValue",    // 请求的url地址
            type:"post",   // 请求方式
            contentType : 'application/json;charset=utf-8',
            dataType:"json",   // 返回格式为json
            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
           // data:{type:type,pageIndex:pageIndex,pageSize:pageSize},    // 参数值     state 0:密码登录 1:验证码登录
            success:function(data){
            	if(data.status=="success"){
//            		$(".simg").html("");
//            		var html="";
            		$.each(data.data,function(index,item){
            			//html+='<img src="'+index_nav.PICURI+item.savBgpic+'"><br>';
            			if(index==0){
            				$(".increment").append('<div class="simg clearfix"><img src="'+index_nav.PICURI+item.savBgpic+'"></div>');
            			}else{
            				$(".increment").append('<div class="simg mt20 clearfix"><img src="'+index_nav.PICURI+item.savBgpic+'"></div>');
            			}
            		});		
            	//	$(".simg").html(html);
            	}else{
            		layer.alert(data.message);
            	}
            },
            error:function(){
                layer.alert('查询加载失败！');
            }
		});
	}
}