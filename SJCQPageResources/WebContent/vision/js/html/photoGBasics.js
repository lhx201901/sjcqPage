/**
 * 摄影师，设计师 详情页面
 */
var photoGBasics = {
	
    init:function(){
        photoGBasics.basics();
        photoGBasics.search(1,12,true);//代表作品
    },
    /**
     * 转换子 div
     * state 0:代表作品 1：图集
     */
    page_div:function(state,_this){
        $("#opus_list_tj").html("");
        $("#opus_list").html("");
        $(_this).siblings().each(function(){//取消其他选中
            $(this).attr("class","");
        });
        $(_this).attr("class","cur");//选中当前类
        if(0==state){
        	photoGBasics.search(1,12,true);//代表作品
        }else{
        	photoGBasics.searchTj(1,12,true);//图集
        }
    },
    /**
     * 摄影师 设计师 详情
     */
    basics:function(){
        var uuid = getUtil.getUrlParam("basics");//获取url上的参数 一级目录
        if(uuid!=null&&uuid!=""&&uuid!=undefined){
            $.ajax({
                url:"/sjcq/pAndD/basics",    // 请求的url地址
                type:"post",   // 请求方式
                dataType:"json",   // 返回格式为json
                async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
                data:{uuid:uuid},    // 参数值     
                success:function(data){
                    $("#user_cover").attr("src",index_nav.PICURI+data.cover);
                    $("#user_actor").attr("src",index_nav.PICURI+data.actor);
                    $(".user_info_msg>.w_auto>.user_name").html(data.realName);
                    $(".user_info_msg>.w_auto>.user_con").html(data.remark);
                    $("#user_address").html(getUtil.null_W(data.address));
                    $("#user_nOfWorks").html("作品 "+getUtil.number(data.numberOfWorks));
                    $("#user_focus").html("关注量 "+getUtil.number(data.focusOnNum));
                    $("#user_viewed").html("被浏览数 "+getUtil.number(data.viewed));
                },
                error:function(){
                    layer.msg('加载数据失败！');
                }
            });
        }
    },
    /**
     * 初始化分页
     * @param type 类型： 1、代表作品，2、图集
     * @param pageCount 总页数
     */
	initPages:function(type,pageCount){
		$("#loadPage").html('<div class="pages" id="persionInfoPages'+type+'"></div>');
		$("#persionInfoPages"+type).createPage({
	        pageCount:pageCount,
	        current:1,
	        backFn:function(result){
	        	if(type==1){
	        		photoGBasics.search(result,12,false);
	        	}else if(type==2){
	        		photoGBasics.searchTj(result, 12, false);
	        	}
	        }
	    })
	},
    /**
     * 加载代表作品
     * @param pageIndex 当前页
     * @param pageSize 每页大小
     * @param is 是否初始化分页控件
     */
    search:function(pageIndex,pageSize,is){
       
        var uuid = getUtil.getUrlParam("basics");//获取url上的参数 一级目录
        if(uuid!=null&&uuid!=""&&uuid!=undefined){
            $.ajax({
                url:"/sjcq/pAndD/opus",    // 请求的url地址
                type:"post",   // 请求方式
                dataType:"json",   // 返回格式为json
                async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
                data:{index:pageIndex,size:pageSize,uuid:uuid},    // 参数值     
                success:function(data){
                	if(is){
                		photoGBasics.initPages(1, Math.ceil(data.total/pageSize));
                	}
                    
                    var str = "";
                    $(data.rows).each(function(i,row){
                        str = str + '<li >';
                        str = str + '<div class="img_info">';
                        str = str + '<a href="javascript:void(0)" onclick="in_search.imgJump(\''+row.pic_xh+'\')">';
                        str = str + '<p class="img"><img src="'+index_nav.PICURI+row.pic_lylys+'"></p>';
                        str = str + '</a>';
                        str = str + '<div class="atr_info">';
                        str = str + '<div class="atit">'+getUtil.nullR(row.pic_mc)+'</div>';
                        str = str + '<div class="atime">'+getUtil.getTimetrans(row.pic_scsj)+'</div>';
                        if(row.collect){
                            str = str + '<div class="sesum" ><i class="ico ico24f " onclick="in_browse.delCollect(\''+row.pic_xh+'\',\'\',0,this)"></i></div>';
                        }else{
                            str = str + '<div class="sesum" ><i class="ico ico18 " onclick="in_browse.addCollect(\''+row.pic_xh+'\',\'\',0,this)"></i></div>';
                        }
                        // str = str + '<div class="sesum"><i class="ico ico18"></i></div>';
                        str = str + '</div>';
                        str = str + '</div>';
                        str = str + '</li>';
                    });
                    $("#opus_list").html(str);
                },
                error:function(){
                    layer.msg('加载数据失败！');
                }
            });
        }
    },
    /**
     * 加载图集 
     * @param pageIndex 当前页
     * @param pageSize 每页大小
     * @param is 是否初始化分页控件
     * @returns {Boolean}
     */
    searchTj:function(pageIndex,pageSize,is){

    	var uuid = getUtil.getUrlParam("basics");//获取url上的参数 一级目录
        if(uuid!=null&&uuid!=""&&uuid!=undefined){
            var jsonstring = JSON.stringify({table:"d_photo_tj",term:"","tj_sczxh":uuid});

            in_search.search(pageIndex,pageSize,"id","desc",jsonstring,function(data){
               
            	if(is){
            		photoGBasics.initPages(2, Math.ceil(data.total/pageSize));
            	}
                var html = "";
                $(data.rows).each(function(i,row){
                    html = html + '<li onclick="in_search.imgJumpTj(\''+row.tj_xh+'\')">';
                    html = html + '<div class="img_info">';
                    html = html + '<a href="javascript:void(0)">';
                    html = html + '<p class="img"><img src="'+index_nav.PICURI+row.tj_fmlj+'"></p>';
                    html = html + '</a>';
                    html = html + '<div class="atr_info">';
                    html = html + '<div class="atit"></div>';
                    html = html + '<div class="atime">'+row.tj_mc+'</div>';
                   // html = html + '<div class="sesum"><i class=\"ico ico40\"></i></div>';
                    html = html + '<div class="sesum"><i class=\"ico\"><span style="color: red;">'+row.tj_sl+'</sapn>张</i></div>';
                    html = html + '</div>';
                    html = html + '</div>';
                    html = html + '</li>';
                });
                $("#opus_list").html(html);
            });
        }
        $('html').animate( {scrollTop: 800}, 500);
    }
}