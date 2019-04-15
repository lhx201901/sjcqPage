var picX=285.00;
var picY=256.00;
var picTotle=24;
var picNum=6;
/**
 * 图片列表
 */
var pictureList = {
    // --下拉加载图片
    page:10,//页数 
    listPage:0,//加载 一次列表增加一页
    searchALL:"",//全文搜索字段
    typeOne:"",//一级目录
    typeTwo:"",//二级目录
    ssdw : "",
    state:"",
    EditSelectedUUID:"",
    searchType:"",
    // --下拉加载图片
    /**
     * 初始化
     */
    init:function(){
    	 $('#inp_search').keydown(function(e){
      		if(e.keyCode==13){
      			pictureList.search(1);
      		}
      	});
    	
    	var inp_search= getUtil.getUrlParam("inp_search");//获取url上的参数 文字搜索
    	if(inp_search!=null && inp_search.trim().length>0){
    		$("#inp_search").val(inp_search);
    	}
    	var sel_cls = getUtil.getUrlParam("sel_cls");//获取url上的参数 一级目录
    	if(sel_cls!=null && sel_cls.trim().length>0){
    		$('.search_box .sel_cls>span').text(sel_cls);
    	}else{
    		$('.search_box .sel_cls>span').text("全部图片");
    	}
    	var sel_cls_two = getUtil.getUrlParam("sel_cls_two");//获取url上的参数 二级目录
    	if(sel_cls_two!=null && sel_cls_two.trim().length>0){
    		 pictureList.search(0,sel_cls_two);
    	}else{
    		 pictureList.search(0);//进入页面 加载 图片列表
    	}
        pictureList.scroll();
        //Math.ceil(data.total/20);
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
        		if(pictureList.searchType=="编辑精选"){
        			pictureList.editSelectedSearchImg(pictureList.EditSelectedUUID);
        		}else{     
        			console.log(pictureList);
        			if(pictureList.state==0){//区县检索
        				 pictureList.searchImg("d_photo_tj",pictureList.searchALL,pictureList.typeOne,"");
	               	}else{
	               		 pictureList.searchImg("d_photo_tj",pictureList.searchALL,pictureList.typeOne,pictureList.typeTwo,"");
	               	}
        		}
        	});
        })
    },
    brocastPicSearchImg :function(uuid){
    	pictureList.listPage = pictureList.listPage + 1;//加载的页数
        in_search.broadCastPicSearch(pictureList.listPage,picTotle,uuid,function(data){
            pictureList.page = Math.ceil(data.total/picTotle);//获取 页数 下拉加载图片时使用
            if(pictureList.page==null||pictureList.page==0){
            	pictureList.page = 1;
            }
            var str = "";//添加字段
            if(data!=null&&data!=""){
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
                    str += '<div class="sesum" style="float:right;"><i class="ico ico21 mr5"></i>'+getUtil.nullR(row.look_number)+'</div>';
                    if(getUtil.nullR(row.pic_mc).length > 40){
                    	 str += '<div class="atit">'+row.pic_mc.substring(0,43)+'……</div>';
                    }else{
                    	 str += '<div class="atit">'+getUtil.nullR(row.pic_mc)+'</div>';
                    }
                    str += '</a>';
                    str += '</div>';
                    str += '</li>';
                });
            }
            $("#pic_list").append(str);
        })
    
    },
    editSelectedSearchImg:function(uuid){
    	pictureList.listPage = pictureList.listPage + 1;//加载的页数
        in_search.editSelectedSearch(pictureList.listPage,picTotle,uuid,function(data){
            pictureList.page = Math.ceil(data.total/picTotle);//获取 页数 下拉加载图片时使用
            if(pictureList.page==null||pictureList.page==0){
            	pictureList.page = 1;
            }
            var str = "";//添加字段
            if(data!=null&&data!=""){
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
                    str += '<div class="sesum" style="float:right;"><i class="ico ico21 mr5"></i>'+getUtil.nullR(row.look_number)+'</div>';
                    if(getUtil.nullR(row.pic_mc).length > 40){
                    	 str += '<div class="atit">'+row.pic_mc.substring(0,43)+'……</div>';
                    }else{
                    	 str += '<div class="atit">'+getUtil.nullR(row.pic_mc)+'</div>';
                    }
                    str += '</a>';
                    str += '</div>';
                    str += '</li>';
                });
            }
            $("#pic_list").append(str);
        })
    },
    /**
     * 搜索编辑精选图片
     */
    editSelectedSearch : function(uuid,_this){
    	 pictureList.page = 10;
         pictureList.listPage = 0;
         pictureList.EditSelectedUUID=uuid;
         pictureList.editSelectedSearchImg(uuid);
         if(_this){        	
        	$(".img_sel_tab a").removeClass("cur");
        	$(_this).addClass("cur");
         }
         $("#pic_list").html("");
    },
    brocastPicSearch : function(uuid){
    	 pictureList.page = 10;
         pictureList.listPage = 0;
         pictureList.brocastPicSearchImg(uuid);
         /*if(_this){        	
        	$(".img_sel_tab a").removeClass("cur");
        	$(_this).addClass("cur");
         }*/
         $("#pic_list").html("");
    },
    /**
     * 搜索图片
     * @param state 0:获取url上的数据 1:获取该页面的数据查询 
     * @param type_two 二级目录，查询图片是传入的值
     * @param qx_search 判断是哪个区县
     */
    search:function(state,type_two,qx_search){
        //重新加载 下拉加载数据初始化
        pictureList.searchALL= "";//全文搜索字段
        pictureList.searchType="";
        pictureList.typeOne = "";//一级目录
        pictureList.typeTwo = "";//二级目录
        pictureList.page = 10;
        pictureList.state = state;
        pictureList.ssdw=qx_search;
        pictureList.listPage = 0;
        //重新加载 下拉加载数据初始化
        $(".img_sel_tab").html("");//加载二级目录 前清空二级目录
        $("#pic_list").html("");//加载二级目录 清空图片
        var inp_search = $("#inp_search").val();// 全文搜索字段
        var sel_cls = $('.sel_cls>span').text();//一级目录
        if(state==0){//获取url上的数据
            inp_search = getUtil.getUrlParam("inp_search");//获取url上的参数  全文搜索字段
            sel_cls = getUtil.getUrlParam("sel_cls");//获取url上的参数 一级目录
        }
        qx_search = getUtil.getUrlParam("qx_search");//获取url上的参数 区县
        if(qx_search==null||qx_search==""||qx_search==undefined||qx_search=="undefined"){
        	qx_search = "";
        }else{ 
        	if(state==0){
        		inp_search =qx_search;
        	}
        }
        //判断是否有值
        if(inp_search==null||inp_search==""||inp_search==undefined||inp_search=="undefined"){
            inp_search = "";
        }
        if(sel_cls!=null&&sel_cls!=""&&sel_cls!="全部图片"){//判断是否展示 二级目录
            //console.log(sel_cls);
            //var type_two = "";
            //获取二级目录方法  in_search.js
        	if(sel_cls=='轮播组图'){
        		var broadXh=getUtil.getUrlParam("broadCastXh");
        		pictureList.brocastPicSearch(broadXh);
        	}else if(sel_cls=='编辑精选'){
        		pictureList.searchType="编辑精选";
        		in_search.catalogForEditSelected(function(data){
                    var html = "";
                    $(data).each(function(i,row){
                    	 if(i==0){//判断 是否已有二级目录 没有就默认第一个改变样式
                    		  EditSelectedUUID = row.uuid;//获取 第一个二级目录
                              html = html + '<a href="javascript:void(0)" class="cur"'
                                      + 'onclick="pictureList.editSelectedSearch(\''+row.uuid+'\',this)" >'+row.sortName+'</a>';
                         }else{
                        	  html = html + '<a href="javascript:void(0)"'
                             		+ 'onclick="pictureList.editSelectedSearch(\''+row.uuid+'\',this)" >'+row.sortName+'</a>';
                         }
                    })
                    $(".img_sel_tab").html(html);
                    //加载图片列表
                    pictureList.editSelectedSearch(EditSelectedUUID);
        		});
        	}else{
        		 in_search.catalog(sel_cls,1,function(data){
                     var html = "";
                     $(data).each(function(i,row){
                         if(row.type_two!=null&&row.type_two!=""){
                             if(type_two==row.type_two){//判断 是否有二级目录 有就改变样式
                                 html = html + '<a href="javascript:void(0)" class="cur"'
                                                 + 'onclick="pictureList.search('+state+',\''+row.type_two+'\')" >'+row.type_two+'</a>';
                             }else{
                                 if(i==0){//判断 是否已有二级目录 没有就默认第一个改变样式
                                     if(type_two==null||type_two==""){
                                         type_two = row.type_two;//获取 第一个二级目录
                                         html = html + '<a href="javascript:void(0)" class="cur"'
                                                 + 'onclick="pictureList.search('+state+',\''+row.type_two+'\')" >'+row.type_two+'</a>';
                                     }else{
                                         html = html + '<a href="javascript:void(0)"'
                                                 + 'onclick="pictureList.search('+state+',\''+row.type_two+'\')" >'+row.type_two+'</a>';
                                     }
                                 }else{
                                     html = html + '<a href="javascript:void(0)"'
                                                 + 'onclick="pictureList.search('+state+',\''+row.type_two+'\')" >'+row.type_two+'</a>';
                                 }
                             }
                         }
                     })
                     $(".img_sel_tab").html(html);
                     //加载图片列表
                     if(state==0){
                    	 pictureList.searchImg("d_photo_tj",inp_search,sel_cls,type_two,"");
                     }else{
                    	 pictureList.searchImg("d_photo_tj",inp_search,sel_cls,type_two,"");
                     }
                 });
        	}
        }else{
            //加载图片列表
        	if(state==0){
        		 pictureList.searchImg("d_photo_tj",inp_search,"","","");
        	}else{
        		 pictureList.searchImg("d_photo_tj",inp_search,"","","");
        	}
           
        }
    },
    /**
     * 列表中展示图片
     * @param table 表名
     * @param inp_search 全文检索字段
     * @param sel_cls 一级目录
     * @param type_two 二级目录
     * @param ssdw 区县
     */
    searchImg:function(table,inp_search,sel_cls,type_two,ssdw){
        pictureList.searchALL= inp_search;//全文搜索字段
        pictureList.typeOne = sel_cls;//一级目录
        pictureList.typeTwo = type_two;//二级目录
        pictureList.ssdw = ssdw;
        //console.log( pictureList.page,"==========", pictureList.listPage);
        if( pictureList.page == pictureList.listPage){
            return false;//页数相同停止加载
        }
        var jsonstring = JSON.stringify({table:table,term:inp_search,"type_one":sel_cls,"type_two":type_two});
        if(ssdw && ssdw.length>0){
        	jsonstring = JSON.stringify({table:table,term:inp_search,"type_one":sel_cls,"type_two":type_two,"ssdw":ssdw});
        }
        console.log(jsonstring)
        //查询 图片 in_search.js
        pictureList.listPage = pictureList.listPage + 1;//加载的页数
        
        in_search.search(pictureList.listPage,picTotle,"id","desc",jsonstring,function(data){
            //console.log(data)
            pictureList.page = Math.ceil(data.total/picTotle);//获取 页数 下拉加载图片时使用
            if(pictureList.page==null||pictureList.page==0){
            	pictureList.page = 1;
            }
            var str = "";//添加字段
            if(data!=null&&data!=""){
                $(data.rows).each(function(i,row){
//					str += '<li onclick="in_search.imgJump(\'' + row.pic_xh + '\')">';
//                    str += '<div class="img_info">';
//                    str += '<a href="javascript:void(0)">';
//                    str += '<p class="img">'
//                    +'<img src="'+index_nav.PICURI+row.pic_lylys+'" onload="this.clientHeight> this.clientWidth ? this.style.height = \'100%\' : this.style.width = \'100%\'"></p>';
//                    str += '</a>';
//                    str += '</div>';
//                    str += '<div class="atr_info">';
//                    str += '<a href="javascript:void(0)">';
//                    str += '<div class="atime">'+getUtil.getTimetrans(row.pic_scsj)+'</div>';
//                    str += '<div class="sesum"><i class="ico ico21 mr5"></i>'+getUtil.nullR(row.look_number)+'</div>';
//                    if(getUtil.nullR(row.pic_mc).length > 40){
//                    	 str += '<div class="atit">'+row.pic_mc.substring(0,43)+'……</div>';
//                    }else{
//                    	 str += '<div class="atit">'+getUtil.nullR(row.pic_mc)+'</div>';
//                    }
//                    str += '</a>';
//                    str += '</div>';
//                    str += '</li>';
                	
                	str += '<li ondblclick="in_search.imgJumpTj(\'' + row.tj_xh + '\')" onclick="in_search.clickOne(\''+row.tj_fmlj+'\')">';
                    str += '<div class="img_info" title="'+row.tj_remark+'">';
                    str += '<a href="javascript:void(0)">';
                    str += '<p class="img">'
                    +'<img src="'+index_nav.PICURI+row.tj_fmlj+'" onload="this.clientHeight> this.clientWidth ? this.style.height = \'100%\' : this.style.width = \'100%\'"></p>';
                    str += '</a>';
                    str += '</div>';
                    str += '<div class="atr_info">';
                    str += '<a href="javascript:void(0)">';
                    str += '<div class="atime">'+getUtil.getTimetrans(row.tj_scsj)+'</div>';
                    str += '<div class="sesum">&nbsp;&nbsp;|&nbsp;&nbsp;共'+getUtil.nullR(row.tj_sl)+'张</div>';
                    if(getUtil.nullR(row.tj_remark).length > 40){
                    	 str += '<div class="atit">'+row.tj_mc.substring(0,43)+'……</div>';
                    }else{
                    	 str += '<div class="atit">'+getUtil.nullR(row.tj_mc)+'</div>';
                    }
                    str += '</a>';
                    str += '</div>';
                    str += '</li>';
                    
                });
            }
            $("#pic_list").append(str);
//            $("#pic_list").css("width",((picX/1920)*(getWinXY().X)+21)*picNum+"px");
//            $(window).resize(function(){
//              	 $("#pic_list").css("width",(((picX/1920)*($(window).width()))+21)*picNum+"px");
//              	 $("#pic_list .img").css("width",(picX/1920)*($(window).width())+"px");
//              	 $("#pic_list .img").css("height",(picY/1920)*($(window).width())+"px");
//            });
        })
    }
}
