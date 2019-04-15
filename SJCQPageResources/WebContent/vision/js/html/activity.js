/**
 * 摄影活动详情
 * 
 */
var ID_;
var ATYXH_="";
var pageSize=12;//页数 
var pageIndex=1;//加载 一次列表增加一页
$(function(){
	$(".vt_maximg .vt_dl_img img").css("max-height",((700.00/1920)*$(window).width())+"px");
	$(window).resize(function(){
		$(".vt_maximg .vt_dl_img img").css("max-height",((700.00/1920)*$(window).width())+"px");
	});
	ID_= GetRequest().id;
	findActivityById();
	searchData(pageIndex,pageSize,true);
	$('#inp_search').keydown(function(e){
		if(e.keyCode==13){
			index_nav.search();
		}
	})
});

/**
 * 根据id查询活动信息
 */
function findActivityById(){
	$.ajax({
        url:"/sjcq/ptgyatv/getPhotographyActiveById",
        type:"post",
        dataType:"json",
        async:false,
        data:{id:ID_},
        success:function(data){
        	ATYXH_=data.atyXh;
        	$("#atyCoverImg").attr("src",index_nav.PICURI+data.atyCoverImg);
        	$("#atyTitle").text(data.atyTitle);
        	$("#atyContent").text(data.atyContent);
        	$("#atyAwards").html("<span>活动奖项：</span>"+data.atyAwards);
        	$("#atyReleaseUnit").html("<span>活动发布单位：</span>"+data.atyReleaseUnit);
        	$("#atyZjTime").html("<span>活动召集时间：</span>"+data.atyCtStartTime+"至"+data.atyCtEndTime);
        	$("#atyIngTime").html("<span>活动进行时间：</span>"+data.atyExecuteStartTime+"至"+data.atyExecuteEndTime);
        },
        error:function(){
            layer.alert('查询加载失败！');
        }
	});
}

/**
 * 获取参数
 * @returns
 */
function getParams(){
	var searchName = $("#searchName").val();
	var jsonstring = JSON.stringify({table:"d_photo_pic",term:searchName,"aty_xh":ATYXH_});
	return jsonstring;
}

/**
 * 查询图片活动图片
 */
function searchData(pageIndex,pageSize,isInitialize){
	var jsonstring=getParams();
	$.ajax({
        url:"/sjcq/retriebe/basicSolrSearch",
        type:"post",   // 请求方式
       // contentType : 'application/json;charset=utf-8',
        dataType:"json",   // 返回格式为json
        async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
        data:{
        	pageIndex:pageIndex,
        	pageSize:pageSize,
        	orderField:'id',
        	orderType:'desc',
        	searchWord:jsonstring
        },
        success:function(data){
            	var total=data.total;
            	if(isInitialize){
        			initPages(getPages(total,pageSize));//  total%pageSize==0? Math.ceil(total/pageSize): Math.ceil(total/pageSize)+1);
        		}
            	var str = "";//添加字段
                $(data.rows).each(function(i,row){
                	str += '<li onclick="in_search.imgJump(\'' + row.pic_xh + '\')">';
                    str += '<div class="img_info">';
                    str += '<a href="javascript:void(0)">';
                    str += '<p class="img">'
                    +'<img src="'+index_nav.PICURI+row.pic_lylys+'" onload="this.clientHeight> this.clientWidth ? this.style.height = \'100%\' : this.style.width = \'100%\'"></p>';
                    str += '</a>';
                    str += '</div>';
                    str += '<div class="atr_info">';
                    str += '<a href="javascript:void(0)">';
                    str += '<div class="atime">'+getUtil.getTimetrans(row.pic_scsj)+'</div>';
                    str += '<div class="sesum"><i class="ico ico21 mr5"></i>'+getUtil.nullR(row.look_number)+'</div>';
                    if(getUtil.nullR(row.pic_mc).length > 40){
                    	 str += '<div class="atit">'+row.pic_mc.substring(0,43)+'……</div>';
                    }else{
                    	 str += '<div class="atit">'+getUtil.nullR(row.pic_mc)+'</div>';
                    }
                    str += '</a>';
                    str += '</div>';
                    str += '</li>';
                });
	            $("#pic_list").html(str);

        },
        error:function(){
            layer.alert('查询加载失败！');
        }
	});
}

/**
 * 初始分页
 * @param pageCount
 */
function initPages(pageCount){
	$("#uploadPages").html("");
	$("#uploadPages").createPage({
		pageCount:pageCount,
		current:1,
		backFn:function(result){
			searchData(result,pageSize,false);
		}
	})	
}
/**
 * 得到页数
 * @param totle
 * @param size
 * @returns
 */
function getPages(totle,size){
	console.log(totle+"++"+size+"++"+totle/size+"++"+totle%size   );	
	if(totle<=size){
		return 1;
	}
	if(totle%size==0){
		return Math.ceil(totle/size);
	}else{

		return  Math.ceil(totle/size);
	}
}

/**
 * 获取请求头的参数
 */
function GetRequest() {
	var url = location.search; //获取url中"?"符后的字串
	url = decodeURI(url);
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for (var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
		}
	}
	return theRequest;
}