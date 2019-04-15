/**
 * 我的关注
 */
var user_content = function(){
    var pageCount = 0;//页数

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
        $("#pAndD_pages").createPage({
            pageCount:pageCount,
            current:1,
            backFn:function(result){
                search(result,false);
            }
        })
    }
	/**
     * 加载关注的摄影师或设计师
     */
	function search(pageCount,type){
		$.ajax({
			url:"/sjcq/pAndD/list",    // 请求的url地址
            type:"post",   // 请求方式
            dataType:"json",   // 返回格式为json
            async:false,// 请求是否异步，默认为异步，这也是ajax重要特性
            data:{index:pageCount,size:6,order:"id",spellName:"",type:3},    // 参数值     
            success:function(data){
                pageCount = Math.ceil(data.total/6);//获取 页数 
                var html = "";
                $(data.rows).each(function(i,row){
                    html = html + '<div class="ur_dl clearfix">';
                    html = html + '<div class="ur_dt">';
                    html = html + '<dl class="clearfix">';
                    html = html + '<dt><img src="'+index_nav.PICURI+row.actor+'" style="width: 100%;height: 100%;cursor:pointer;" onclick="photographer.jump(\''+row.uuid+'\')" ></dt>';
                    html = html + '<dd>';
                    html = html + '<p class="ti">'+row.realName+'</p>';
                    html = html + '<p class="ad">'+row.address+'</p>';
                    html = html + '<p class="zp"><span>作品  '+getUtil.number(row.nOfWorks)+'</span><span class="ml20">关注量  '+getUtil.number(row.focusOnNum)+'</span></p>';
                    html = html + '<p class="ci">'+getUtil.null_W(row.remark)+'</p>';
                    //html = html + '<p class="artion"><a href="#"><i class="ico ico29"></i>关注</a></p>';
                    //是否关注
                    // if(row.concern){//已关注
                    //     html = html + '<p class="artion"><a href="javascript:void(0)" onclick="in_browse.delConcern(\''+row.uuid+'\',\'pAndD_concern\',0,this)" class="cur"><i class="ico ico29"></i> 已关注</a></p>';
                    // }else{//未关注
                    //     html = html + '<p class="artion"><a href="javascript:void(0)" onclick="in_browse.addConcern(\''+row.uuid+'\',\'pAndD_concern\',0,this)">+ 关注</a></p>';
                    // }  
                    html = html + '</dd>';
                    html = html + '</dl>';
                    html = html + '</div>';
                    html = html + '<div class="ur_dd">';
                    html = html + '<div class="ur_outBox">';
                    html = html + '<div class="ur_itemBox">';

                    if(row.photo_pic!=null&&row.photo_pic.length>0){
                        var len = row.photo_pic.length;
                        var str = "";
                        for(var j = 0;j<len;j++){
                            if(j==0){
                                str = str + '<div class="ur_li" >';
                            }
                            str = str + '<img onclick="in_search.imgJump(\''+row.photo_pic[j].picXh+'\')" style="cursor:pointer;height:'+(260.00/1080)*getWinXY().Y+'px;" src="'+index_nav.PICURI+row.photo_pic[j].picLylys+'">';
                            if((j+1)%3==0){
                                str = str + '</div>';
                                str = str + '<div class="ur_li" >';
                            }
                            if((j+1)==len){
                                str = str + '</div>';
                            }
                        }
                        html = html + str;
                    }else{
                    	html+='<p>暂无代表作品！</p>';
                    }
                    html = html + '</div>';
                    html = html + '</div>';
                    html = html + '<div  class="leftBtn ico ico16"></div>';
                    html = html + '<div  class="rightBtn ico ico17"></div>';
                    html = html + '</div>';
                    html = html + '</div>';
                });
                $("#pAndD_list").html(html);
                if(type){//是否第一次加载分页
                    initPages(pageCount);
                }
                //图片轮换
                $("#pAndD_list .ur_dd").each(function(){
                    photographer.partBanner({
                        outBox:$(this),//最外层显示三个内容的盒子
                        moveBox:$(this).find('.ur_itemBox'),//内部移动的整个盒子
                        leftBtn:$(this).find('.leftBtn'),//左按钮
                        rightBtn:$(this).find('.rightBtn')//右按钮
                    });
        		});
                $(window).resize(function(){
            		$("#pAndD_list .ur_dd img").each(function(){
            			this.style.height=((260.00/1920)*($(window).width()))+'px';
            		});
            		//图片轮换
                    $("#pAndD_list .ur_dd").each(function(){
                        photographer.partBanner({
                            outBox:$(this),//最外层显示三个内容的盒子
                            moveBox:$(this).find('.ur_itemBox'),//内部移动的整个盒子
                            leftBtn:$(this).find('.leftBtn'),//左按钮
                            rightBtn:$(this).find('.rightBtn')//右按钮
                        });
            		});
                });

                
            },
            error:function(){
                layer.msg('加载我的关注失败！');
            }
        });

	}

	
    //图片点击移动
    function partBanner_content(options){
        var widObj=options.outBox;
        var moveObj=options.moveBox;
        var oneWid = widObj.width();//每次移动的距离
        
        for(var i=0;i<moveObj.length;i++){
            var curObj=$(moveObj[i]).children();
            var len=curObj.length;
            if(len<2){
                options.rightBtn.hide();
                options.leftBtn.hide();
                return;
            }
            var allWidth =oneWid*len;//当前总的宽度
            $(moveObj[i]).width(allWidth);//设置盒子总宽度
            curObj.width(oneWid);//每三个部分设置宽度
        }
        options.rightBtn.on('click',function(){
            var nowMove=$(this).siblings().find('.ur_itemBox');
            nowMove.stop().animate({"margin-left":-oneWid},800,function(){
                var nowOne=nowMove.children().eq(0);
                $(nowOne).appendTo(nowMove);
                nowMove.css('margin-left',0);
            });
        })
        options.leftBtn.on('click',function(){
            var nowMove=$(this).siblings().find('.ur_itemBox');
            var nowLen=nowMove.children().length;
            var lastOne=nowMove.children().eq(nowLen-1);
            $(lastOne).prependTo(nowMove);
            nowMove.css('margin-left',-oneWid);
            nowMove.stop().animate({"margin-left":0},800);
        })
    }

	return {
		init:init
	}
}();