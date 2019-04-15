/**摄影活动
 * wc
 * 20181010
 */
$(function(){
	$(".hdlishow li").remove();
	activite.searchActiveData("all",1,6,true);
	$('#inp_search').keydown(function(e){
		if(e.keyCode==13){
			index_nav.search();
		}
	})
});


var activite={
		//初始化分页
	initPages:function(type,pageCount){
		$("#uploadPages").html("");
		$("#uploadPages").html('<div class="pages" id="uploadStatusImgPage'+type+'"></div>');
		$("#uploadStatusImgPage"+type).children().remove();
		$("#uploadStatusImgPage"+type).createPage({
			pageCount:pageCount,
			current:1,
			backFn:function(result){
				console.log("status=="+type);
				activite.searchActiveData(type,result,6,false);
			}
		})	
	},	
	//通过类型展示数据
	showActive:function(_this,type){
		$(".hdlishow li").remove();
		activite.tabActiveCss(_this,type);
		activite.searchActiveData(type,1,6,true);
	},
	//通过类型切换样式
	tabActiveCss:function(_this,type){
		$(_this).parent().children().removeClass("cur");
		$(_this).addClass("cur");
		
	},
	//通过类型查找数据
	searchActiveData:function(type,pageIndex,pageSize,isInitialize){
		var showType=0;
		if(type=='all'){
			showType=0;
		}else if(type=='call'){
			showType=1;
		}else if(type=='proceed'){
			showType=2;
		}else if(type=='finish'){
			showType=3;
		}
		$(".hdlishow li").remove();
		$.ajax({
            url:"/sjcq/ptgyatv/searchActiveData",    // 请求的url地址
            type:"post",   // 请求方式
           // contentType : 'application/json;charset=utf-8',
            dataType:"json",   // 返回格式为json
            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
            data:{text:"",type:showType,pageIndex:pageIndex,pageSize:pageSize,orderBy:"id"},    // 参数值     state 0:密码登录 1:验证码登录
            success:function(data){
	            	var total=data.total;
            		if(isInitialize){
            			activite.initPages(type,getPages(total,pageSize));//  total%pageSize==0? Math.ceil(total/pageSize): Math.ceil(total/pageSize)+1);
            		}
            		$.each(data.rows,function(index,item){
            			$(".hdlishow").append(				
            					'<li  onclick=\'activite.jumpPage("'+item.id+'","'+item.atyXh+'")\'>'
            				       + '<div class="hd_info">'
            				       		+ '<div class="img">'
            					       		+ ' <p><img   src="'+index_nav.PICURI+item.atyCoverImg+'"></p>'
            					       		+ ' <div class="hd_ipr">'
            					       			+ ' <div class="hdti">'+item.atyTitle+'</div>'
            					       			+ ' <div class="hdci"><i class="ico ico31"></i>'+item.atyAwards+'</div>'
            					       		+ ' </div>'
            					       	+ ' </div>'
            					       	+ '<p class="tit">'+item.atyReleaseUnit+'</p>'
            					       	+ ' <p class="con"><i class="ico ico32"></i>距截稿：'+item.executeFinishDays+'天</p>'
            					       	+ ' <p class="hd_zt"><i class="ico ico33">'+item.statusInfo+'</i></p>'
            				       + ' </div>'
            				     + '</li>'
            			);
            		});

            },
            error:function(){
                layer.alert('查询加载失败！');
            }
		});
	},
	jumpPage:function(id,atyXh){
		//window.open("activityDetail.html?id="+id, "_blank");
		
		window.open("../../activity/introduction.html?id=" +id+"&atyXh="+atyXh, "_self");
	}
}
function getPages(totle,size){
	if(totle<=size){
		return 1;
	}
	if(totle%size==0){
		return Math.ceil(totle/size);
	}else{

		return  Math.ceil(totle/size);
	}
}