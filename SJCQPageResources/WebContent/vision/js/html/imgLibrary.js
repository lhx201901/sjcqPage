var qxX=390.00;
var qxY=310.00;
var qxPage=8;
var qxRowNum=4;

var picX=285.00;
var picY=256.00;
var picTotle=12;
var picNum=6;
/**
 * 图库
 */
var imgLibrary = {
    init:function(){
    	$('#inp_search').keydown(function(e){
    		if(e.keyCode==13){
    			index_nav.search();
    		}
    	});
    	in_search.loadFirstLevelPicSort();
        imgLibrary.search_q();//加载区县信息
       // imgLibrary.search_l()//加载老照片
        imgLibrary.search_pic("老照片","search_l");
        imgLibrary.search_pic("企业图片","tu_qy");//图集 企业
        imgLibrary.search_pic("创意图片","tj_cy");
        imgLibrary.search_pic("重要图片","pic_zy");
        imgLibrary.search_pic("图片故事","pic_gs");
        //imgLibrary.search_pic("新华图片","pic_xh");
        $(window).resize(function(){//分辨率修改重新调用该方法
            partBanner({
                outBox:$('.qu_outBox'),//最外层显示三个内容的盒子
                moveBox:$('.qu_moveBox'),//内部移动的整个盒子
                leftBtn:$('.quxn .qlt'),//左按钮
                rightBtn:$('.quxn .qrt')//右按钮
            });
        })
    },
    /**
     * 加载 所有区县信息
     * 
     */
    search_q:function(){
        $.ajax({
            url:"/sjcq//manage/area/findAll",    // 请求的url地址
            type:"post",   // 请求方式
            dataType:"json",   // 返回格式为json
            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
            data:{broType:1},    // 参数值     broType 轮播类型
            success:function(data){
                //console.log(data);
                var html_str = "";//标签
                var html_img = '<ul class="qu_item">';//图片
                var len = data.length;//获取总长度
                $(data).each(function(i,row){
                    //标签加载
                	
//                	if(i==0){
//                		html_img += '<ul class="qu_item">';
//                	}
					html_img += '<li onclick="index_nav.search_a(\'\',\'\',\''+row.aliasName+'\')">';
					html_img += '<div class="imgcis">';
					html_img += '<p class="img">';
					html_img += '<img src="'+index_nav.PICURI+row.coverPicMidPath+'"></p>';
					html_img += '<p class="adti">'+row.aliasName+'</p>';
					html_img += '<p class="adci">'+row.engName+'</p>';
					html_img += '</div>';
					html_img += '</li>';
                	
					if((i+1)%8 ==0 && len>=(i+1)){
						html_img += ' </ul><ul class="qu_item">';
					}else if((i+1)%8!=0 && len==(i+1)){
						html_img += ' </ul>';
					}
					
                    html_str = html_str + '<a href="javascript:void(0)" onclick="index_nav.search_a(\'\',\'\',\''+row.aliasName+'\')" >'+row.aliasName+'</a>';
                    
//                    if(i==0){
//                        html_img = html_img + '<ul class="qu_item">';
//                    }
//                    html_img = html_img + '<li onclick="index_nav.search_a(\'\',\'\',\''+row.aliasName+'\')">';
//                    html_img = html_img + '<div class="imgcis">';
//                    html_img = html_img + '<p class="img">';
//                    html_img +='<img src="'+index_nav.PICURI+row.coverPicMidPath+'" style="width:100%;height:100%;"></p>';
//                    html_img = html_img + '<p class="adti">'+row.aliasName+'</p>';
//                    html_img = html_img + '<p class="adci">'+row.engName+'</p>';
//                    html_img = html_img + '</div>';
//                    html_img = html_img + '</li>';
//                    //图片加载
//                    if((i+1)%8==0){
//                        if(len==(i+1)){//
//                            html_img = html_img + ' </ul>';
//                        }else{
//                            html_img = html_img + ' </ul><ul class="qu_item">';
//                        }
//                    }
//                    if(len==(i+1)&&(i+1)%8!=0){//最后不满足8个 结束
//                        html_img = html_img + ' </ul>';
//                    }
                })
                $("#qx_mc").html(html_str);
                $("#qx_img").html(html_img);
               // $(".qu_outBox").css("width",(((qxX/1920)*((getWinXY().X))+20)*qxRowNum+5)+"px");
                //下面这个方法在public.js里  
                //区县左右加载 必须要样式加载完后调用方法
                partBanner({ 
                    outBox:$('.qu_outBox'),//最外层显示三个内容的盒子
                    moveBox:$('.qu_moveBox'),//内部移动的整个盒子
                    leftBtn:$('.quxn .qlt'),//左按钮
                    rightBtn:$('.quxn .qrt')//右按钮
                });
                $(window).resize(function(){
//	               	 $(".qu_outBox").css("width",((((qxX/1920)*($(window).width()))+20)*qxRowNum+5)+"px");
//	               	 $(".qu_item .img").css("width",(qxX/1920)*($(window).width())+"px");
//	               	 $(".qu_item .img").css("height",(qxY/1920)*($(window).width())+"px");
	               	partBanner({ 
	                    outBox:$('.qu_outBox'),//最外层显示三个内容的盒子
	                    moveBox:$('.qu_moveBox'),//内部移动的整个盒子
	                    leftBtn:$('.quxn .qlt'),//左按钮
	                    rightBtn:$('.quxn .qrt')//右按钮
	                });
               });
            },
            error:function(){
                layer.alert('查询加载失败！');
            }
        });
    },
    /**
     * 老照片数据加载
     */
    search_l:function(){
        var jsonstring = JSON.stringify({table:"d_photo_pic",term:"","type_one":"老照片"});
        in_search.search(1,12,"id","desc",jsonstring,function(data){
            //console.log(data)
            var html = "";
            $(data.rows).each(function(i,row){
                html = html + "<li>";
                html = html + "<div class=\"imgcis\" style='padding-top: 8px;'>";
                html = html + "<p class=\"img\" onclick=\"in_search.imgJump('"+row.pic_xh+"')\" style=\"width:"+(picX/1920)*(getWinXY().X)+"px;height:"+(picY/1080)*(getWinXY().Y)+"px;\">" +
                		"<img src=\""+index_nav.PICURI+row.pic_lylys+"\" onload=\"this.clientHeight/this.parentNode.clientHeight > this.clientWidth/this.parentNode.clientWidth ? this.style.height = \'100%\' : this.style.width = \'100%\'\"></p>";
                html = html + "<p class=\"adti\">"+row.pic_mc+"</p>";
                html = html + "</div>";
                html = html + "</li>";
            });
            $("#search_l").html(html);
            $("#search_l").css("width",((picX/1920)*(getWinXY().X)+11)*picNum+"px");
            $(window).resize(function(){
           	 $("#search_l").css("width",(((picX/1920)*($(window).width()))+11)*picNum+"px");
           	 $("#search_l .img").css("width",(picX/1920)*($(window).width())+"px");
           	 $("#search_l .img").css("height",(picY/1920)*($(window).width())+"px");
           });
        });
    },
    /**
     *  图集加载
     * @param type_one 一级分类
     * @param id 标签
     */
    search_tj:function(type_one,id){
        var jsonstring = JSON.stringify({table:"d_photo_tj",term:"",type_one:type_one});
        in_search.search(1,picTotle,"id","desc",jsonstring,function(data){
            var html = "";
            $(data.rows).each(function(i,row){
                html = html + '<li onclick="in_search.imgJumpTj(\''+row.tj_xh+'\')">';
                html = html + '<div class="img_info">';
                html = html + '<a href="javascript:void(0)">';
                html = html + '<p class="img" style=\"width:"+(picX/1920)*(getWinXY().X)+"px;height:"+(picY/1080)*(getWinXY().Y)+"px;\">'
                +'<img src="'+index_nav.PICURI+row.tj_fmlj+'"  onload="this.clientHeight> this.clientWidth  ? this.style.height = \'100%\' : this.style.width = \'100%\'"></p>';
                html = html + '</a>';
                html = html + '<div class="atr_info">';
                html = html + '<div class="atit"></div>';
                html = html + '<div class="atime">'+row.tj_mc+'</div>';
                html = html + '<div class="sesum"><i class=\"ico ico40\"></i></div>';
                html = html + '</div>';
                html = html + '</div>';
                html = html + '</li>';
            });
            $("#"+id).html(html);
            $("#"+id).css("width",((picX/1920)*(getWinXY().X)+11)*picNum+"px");
            $(window).resize(function(){
           	 $("#"+id).css("width",(((picX/1920)*($(window).width()))+11)*picNum+"px");
           	 $("#"+id+" .img").css("width",(picX/1920)*($(window).width())+"px");
           	 $("#"+id+" .img").css("height",(picY/1920)*($(window).width())+"px");
           });
        })
    },
    
    /**
     *  图集加载
     * @param type_one 一级分类
     * @param id 标签
     */
    search_pic:function(type_one,id){
        var jsonstring = JSON.stringify({table:"d_photo_tj",term:"",type_one:type_one});
        in_search.search(1,picTotle,"id","desc",jsonstring,function(data){
            var str = "";
            $(data.rows).each(function(i,row){
//            	str += '<li onclick="in_search.imgJump(\'' + row.pic_xh + '\')">';
//                str += '<div class="img_info">';
//                str += '<a href="javascript:void(0)">';
//                str += '<p class="img">'
//                +'<img src="'+index_nav.PICURI+row.pic_lylys+'" onload="this.clientHeight> this.clientWidth ? this.style.height = \'100%\' : this.style.width = \'100%\'"></p>';
//                str += '</a>';
//                str += '</div>';
//                str += '<div class="atr_info">';
//                str += '<a href="javascript:void(0)">';
//                str += '<div class="atime">'+getUtil.getTimetrans(row.pic_scsj)+'</div>';
//                str += '<div class="sesum"><i class="ico ico21 mr5"></i>'+getUtil.nullR(row.look_number)+'</div>';
//                if(getUtil.nullR(row.pic_mc).length > 40){
//                	 str += '<div class="atit">'+row.pic_mc.substring(0,43)+'……</div>';
//                }else{
//                	 str += '<div class="atit">'+getUtil.nullR(row.pic_mc)+'</div>';
//                }
//                str += '</a>';
//                str += '</div>';
//                str += '</li>';
            	str += '<li onclick="in_search.imgJumpTj(\'' + row.tj_xh + '\')">';
                str += '<div class="img_info">';
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
                	 str += '<div class="atit">'+row.tj_remark.substring(0,43)+'……</div>';
                }else{
                	 str += '<div class="atit">'+getUtil.nullR(row.tj_remark)+'</div>';
                }
                str += '</a>';
                str += '</div>';
                str += '</li>';
            });
            $("#"+id).html(str);
//            $("#"+id).css("width",((picX/1920)*(getWinXY().X)+11)*picNum+"px");
//            $(window).resize(function(){
//           	 $("#"+id).css("width",(((picX/1920)*($(window).width()))+11)*picNum+"px");
//           	 $("#"+id+" .img").css("width",(picX/1920)*($(window).width())+"px");
//           	 $("#"+id+" .img").css("height",(picY/1920)*($(window).width())+"px");
//           });
        })
    }
}