/** 
 * 摄影师 设计师
 */
var photographer = {
    page:10,//页数 
    listPage:0,//加载列表 一次列表增加一页
    condition_z:"",//首字母 列表查询
    pAndD_desc:"id",//排序方式 列表查询
    /**
     * //判断查询摄影师 还是 设计师 默认摄影师
     */
    grapher_type:1,
    init:function(){
    	 $('#inp_search').keydown(function(e){
     		if(e.keyCode==13){
     			index_nav.search();
     		}
     	});
        photographer.condition();//列表条件
        var grapher = getUtil.getUrlParam("photographer");//获取url上的参数 一级目录
        
        if(grapher!=null&&grapher!=""&&grapher!="photographer"){
            window.location.href="index.html";//参数错误 返回首页
            return false;
        }
        if(grapher=="photographer"){
            photographer.grapher_type = 2;//设计师
            $("#grapher_type").siblings().each(function(){//取消其他选中
                $(this).attr("class","");
            });
            $("#grapher_type").attr("class","cur");//选中当前类
            $("#tjinfo").html("");
            $("#tjinfo").html("推荐设计师");
        } else{
        	 $("#tjinfo").html("");
             $("#tjinfo").html("推荐摄影师");
        }
        photographer.search();//加载推举摄影师
        photographer.searchList();//摄影师列表 
        photographer.scroll();//监听滚动条事件
        //
        $(window).resize(function(){
            photographer.partBanner({
                outBox:$('.ur_dd'),//最外层显示三个内容的盒子
                moveBox:$('.ur_itemBox'),//内部移动的整个盒子
                leftBtn:$('.leftBtn'),//左按钮
                rightBtn:$('.rightBtn')//右按钮
            });
        })
    },
    /**
     * 跳转到详情页面
     * @param uuid 摄影师uuid
     */
    jump:function(uuid){
        window.location.href="photographerBasics.html?basics="+uuid;
    },
    /**
     * 监听滚动条事件
     * 加载添加图片列表
     */
    scroll:function(){
        var r_footHei = $(".faut").innerHeight() + $(".footer").innerHeight();//底部的高度
        //对元素滚动的次数进行计数
        $(window).scroll(function(){
            waterPall.setWaterPall(r_footHei,function(){
                photographer.searchList();//摄影师列表 
            });
        })
    },
    /**
     * 摄影师 列表条件
     */
    condition:function(){
        var tem = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        var html = '<a href="javascript:void(0)" onclick="photographer.setUp(0,\'全部\')">全部</a>';
        $(tem).each(function(i,r){
            html = html + ' <a href="javascript:void(0)" onclick="photographer.setUp(0,\''+r+'\')">'+r+'</a>';
            //console.log(r);
        });
        $("#condition_s").html(html);
    },
    /**
     * 加载推举摄影师
     */
    search:function(){
        $.ajax({
            url:"/sjcq/pAndD/concern/list",    // 请求的url地址
            type:"post",   // 请求方式
            dataType:"json",   // 返回格式为json
            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
            data:{type:1,total:12,type:photographer.grapher_type},    // 参数值     
            success:function(data){
               //console.log(data);
               var html = '';
               $(data).each(function(i,row){
                    html = html + '<li>';
                    html = html + '<div class="tj_li_co">';
                    html = html + '<p class="img" onclick="photographer.jump(\''+row.uuid+'\')"><img src="'+index_nav.PICURI+row.cover+'" width="245px" height="97px"></p>';
                    html = html + '<p class="arimg" onclick="photographer.jump(\''+row.uuid+'\')"><img src="'+index_nav.PICURI+row.actor+'" width="62" height="62"></p>';
                    html = html + '<p class="arnam">'+row.realName+'</p>';
                    html = html + '<p class="arsp"><span>作品：'+getUtil.number(row.nOfWorks)+'</span><span class="ml20">关注量：'+getUtil.number(row.focusOnNum)+'</span></p>';
                    //是否关注
                    if(row.concern){//已关注
                        html = html + '<p class="artion"><a href="javascript:void(0)" onclick="in_browse.delConcern(\''+row.uuid+'\',\'pAndD_concern\',0,this)" class="cur"><i class="ico ico29"></i> 已关注</a></p>';
                    }else{//未关注
                        html = html + '<p class="artion"><a href="javascript:void(0)" onclick="in_browse.addConcern(\''+row.uuid+'\',\'pAndD_concern\',0,this)">+ 关注</a></p>';
                    }    
                    html = html + '</div>';
                    html = html + '</li>';
               });
                //    <!--下面这三个必须要不能删-->
                html = html + '<li class="clearJu">&nbsp;</li><li class="clearJu">&nbsp;</li><li class="clearJu">&nbsp;</li>';
                $("#search_tj").html(html);
                
            },
            error:function(){
                layer.msg('加载数据失败！');
            }
        });
    },
    /**
     * 查询条件
     * @param state 状态 0：筛选 1：排序方式
     * @param str
     */
    setUp:function(state,str){
        if(state==0){
            $("#condition_z").text(str);
            if(str=="全部"){
                photographer.condition_z = "";
            }else{
                photographer.condition_z = str;
            }
        }else if(state=1){
            $("#pAndD_desc").text(str);
            if(str=="全部"){
                photographer.pAndD_desc = "id";
            }else{
                photographer.pAndD_desc = "focusOnNum";
            }
        }
        photographer.page = 10;
        photographer.listPage = 0;
        $("#pAndD_list").html("");
        photographer.searchList();//刷新列表
    },
    /**
     * 列表查询
     */
    searchList:function(){
        var order="",spellName="";
        if(photographer.condition_z!=null&&photographer.condition_z!=""){
            spellName = photographer.condition_z;
        }
        if(photographer.pAndD_desc!=null&&photographer.pAndD_desc!=""){
            order = photographer.pAndD_desc;
        }
        if( photographer.page == photographer.listPage){
            return;//页数相同停止加载
        }
        $.ajax({
            url:"/sjcq/pAndD/list",    // 请求的url地址
            type:"post",   // 请求方式
            dataType:"json",   // 返回格式为json
            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
            data:{index:photographer.listPage,size:6,order:order,spellName:spellName,type:photographer.grapher_type},    // 参数值     
            success:function(data){
                if( photographer.page == photographer.listPage){
                    return;//页数相同停止加载
                }
                photographer.listPage ++;//查询一次 页数加一
                photographer.page = data.total;//获取 页数 下拉加载图片时使用
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
                    if(row.concern){//已关注
                        html = html + '<p class="artion"><a href="javascript:void(0)" onclick="in_browse.delConcern(\''+row.uuid+'\',\'pAndD_concern\',0,this)" class="cur"><i class="ico ico29"></i> 已关注</a></p>';
                    }else{//未关注
                        html = html + '<p class="artion"><a href="javascript:void(0)" onclick="in_browse.addConcern(\''+row.uuid+'\',\'pAndD_concern\',0,this)">+ 关注</a></p>';
                    }  
                    html = html + '</dd>';
                    html = html + '</dl>';
                    html = html + '</div>';
                    html = html + '<div class="ur_dd">  ';
                    html = html + '<div class="ur_outBox">';
                    html = html + '<div class="ur_itemBox">';

                    if(row.photo_pic!=null&&row.photo_pic.length>0){
                        var len = row.photo_pic.length;
                        var str = '<div class="ur_li" >';
                        str += '<ul class="clearfix" id="search_l">';
//                        for(var j = 0;j<len;j++){
//                            if(j==0){
//                                str = str + '<div class="ur_li" >';
//                            }
//                            str = str + '<img onclick="in_search.imgJump(\''+row.photo_pic[j].picXh+'\')" style="cursor:pointer;height:'+(260.00/1080)*getWinXY().Y+'px;" src="'+index_nav.PICURI+row.photo_pic[j].picLylys+'">';
//                            if((j+1)%3==0){
//                                str = str + '</div>';
//                                str = str + '<div class="ur_li" >';
//                            }
//                            if((j+1)==len){
//                                str = str + '</div>';
//                            }
//                        }
                        $(row.photo_pic).each(function(i,row1){
	                        str += '<li onclick="in_search.imgJump(\''+row1.picXh+'\')">';
	                        str += '<div class="img_info">';
	                        str += '<a href="javascript:void(0)">';
	                        str += '<p class="img">';
	                        str += '<img src="'+index_nav.PICURI+row1.picLylys+'" onload="this.clientHeight> this.clientWidth ? this.style.height = \'100%\' : this.style.width = \'100%\'"></p>';
	                        str += '</a>';
	                        str += '</div>';
	                        str += '</li>';
	                        
	                    	if((i+1)%3 ==0 && len>=(i+1)){
	                    		str += ' </ul></div><div class="ur_li" >';
	    					}else if((i+1)%3!=0 && len==(i+1)){
	    						str += ' </ul></div>';
	    					}
                        
                        });
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
                $("#pAndD_list").append(html);
                //图片轮换
                $("#pAndD_list .ur_dl").each(function(){
                    photographer.partBanner({
                        outBox:$(this).find('.ur_outBox'),//最外层显示三个内容的盒子
                        moveBox:$(this).find('.ur_itemBox'),//内部移动的整个盒子
                        leftBtn:$(this).find('.leftBtn'),//左按钮
                        rightBtn:$(this).find('.rightBtn')//右按钮
                    });
        		});
                $(window).resize(function(){
//            		$("#pAndD_list .ur_dd img").each(function(){
//            			this.style.height=((260.00/1920)*($(window).width()))+'px';
//            		});
            		//图片轮换
                    $("#pAndD_list .ur_dl").each(function(){
                        photographer.partBanner({
                            outBox:$(this).find('.ur_outBox'),//最外层显示三个内容的盒子
                            moveBox:$(this).find('.ur_itemBox'),//内部移动的整个盒子
                            leftBtn:$(this).find('.leftBtn'),//左按钮
                            rightBtn:$(this).find('.rightBtn')//右按钮
                        });
            		});
                });
            },
            error:function(){
                layer.msg('加载数据失败！');
            }
        });
    },
    //图片点击移动
    partBanner:function(options){
        var widObj=options.outBox;
        var moveObj=options.moveBox;
        var oneWid=widObj.width();//每次移动的距离
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

}   