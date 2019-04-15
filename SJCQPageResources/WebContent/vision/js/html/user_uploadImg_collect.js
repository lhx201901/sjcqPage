/**
 * 我的收藏
 */
var user_collect = function(){
    /**
     * 初始化
     */
    function init(){
        search(1,true);
    }
    /**
     * 分页
     * @param {*} pageCount  页数
     */
    function initPages(pageCount){
        $("#opus_pages").createPage({
            pageCount:pageCount,
            current:1,
            backFn:function(result){
                search(result,false);
            }
        })
    }
    /**
     * 
     * @param {*} pageCount 分页
     * @param {*} type 是否加载分页
     */
    function search(pageCount,type){
        $.ajax({
            url:"/sjcq/collect/list",    // 请求的url地址
            type:"post",   // 请求方式
            dataType:"json",   // 返回格式为json
            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
            data:{index:pageCount,size:6},    // 参数值     
            success:function(data){
                var str = "";
                pageCount = Math.ceil(data.total/6);//获取 页数 
                $(data.rows).each(function(i,row){
               /*     str = str + '<li onclick="in_search.imgJump(\''+row.picXh+'\')"><div class="picn">';
                    str = str + '<div class="picn_nbx">';
                    str = str + '<a href="javascript:void(0)">';
                    str = str + '<p class="img"><img src="'+index_nav.PICURI+row.picLylys+'"></p>';
                    str = str + '</a>';
                    str = str + '<div class="vjg">';
                    str = str + '<div class="atit">'+getUtil.nullR(row.picMc)+'</div>';
                    str = str + '<div class="atime">'+getUtil.getTimetrans(row.picScsj)+'</div>';
                    str = str + '<div class="sesum" style="float:right;margin-top:5px"><i class="ico ico20 mr5"></i>'+getUtil.nullR(row.lookNumber)+'</div>';
                    str = str + '</div>';
                    str = str + '</div></div>';
                    str = str + '</li>';*/
                    

                	str+='<li  onclick="in_search.clickOne(\''+row.picLyljm+'\')"  ondblclick="in_search.imgJump(\''+row.picXh+'\')"><div class="picn"> '
				            			+'<div class="picn_nbx"> '+
				            				'<p><img src="'+index_nav.PICURI+row.picLylys+'"></p> '
				            			+'</div>';
                	str+='<div class="vjg"> <div class="tis">'+getUtil.nullR(row.picMc)+'</div>';
                	str+='<div class="tis">'+getUtil.getTimetrans(row.picScsj)+'</div>'
	            	+'<div class="eds">'
	            	+'<i class="ico ico52"></i>'+getUtil.nullR(row.lookNumber)
	            	+'</div>'
	            	+'</div>';
					str+='</div></li>';
            	
                });
                $("#opus_list").html(str);
                $("#opus_list .img").each(function(){
         			this.style.width=this.parentNode.clientWidth+"px";
         		});
                $(window).resize(function(){
                	$("#opus_list .img").each(function(){
             			this.style.width=this.parentNode.clientWidth+"px";
             		});
                });
                if(type){
                    initPages(pageCount);
                }
            },
            error:function(){
                layer.msg('加载数据失败！');
            }
        });
    }

	return {
        init:init
    }
}();