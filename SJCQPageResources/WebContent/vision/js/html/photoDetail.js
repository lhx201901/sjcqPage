/**
 * 图片详情
 */
var photoDetail = {
    init:function(){
//    	$(".vt_maximg").css("height",((700.00/1920)*$(window).width())+"px");
//    	$(".vt_maximg").css("min-height",((700.00/1920)*1024)+"px");
//    	$(window).resize(function(){
//    		$(".vt_maximg").css("height",((700.00/1920)*$(window).width())+"px");
//    		$(".vt_maximg").css("min-height",((700.00/1920)*1024)+"px");
//    	});
        photoDetail.search();
        $('#inp_search').keydown(function(e){
    		if(e.keyCode==13){
    			index_nav.search();
    		}
    	});
    },
    /**
     * 加载详情
     */
    search:function(){
        var uuid = getUtil.getUrlParam("img");//获取url上的参数
        var tj =  getUtil.getUrlParam("tj");//获取url上的参数
        if(tj=="sjcq"){
            $("#tj_pic_list").show();//图集下图片的列表
            $("#pic_xs_list").hide();//相似图片
            photoDetail.search_tj(uuid);
        }else{
            $("#tj_pic_list").hide();//图集下图片的列表
            photoDetail.search_img(uuid);
        }
        
    },
    /**
     * 加载图集详情
     * @param uuid 图集uuid
     */
    search_tj:function(uuid){
        $("#sjcq_tj").show();
        $("#sjcq_pic").hide();
        in_search.tjDetail(uuid,function(data){
            //console.log(data);
            if(data!=null){
                $("#tjFmlj").attr("src",index_nav.PICURI+data.tjFmlj.replace("_s.","_m."));//带水印的图片
                $("#tjMc").text(data.tjMc);//右边的标题
                $("#tjRemark").text(getUtil.null_W(data.tjRemark));//说明
                $("#tjSl").html("<span>图片数量：</span>"+getUtil.null_W(data.tjSl));//
                $("#tjSyz").html("<span>摄影作者：</span>"+getUtil.null_W(data.tjSyz));//
                $("#tjScsj").html("<span>上传时间：</span>"+getUtil.getTimetrans(data.tjScsj));//
                $("#tjScz").html("<span>上传者：</span>"+getUtil.null_W(data.tjScz));//
                //图片分类
                var tj_type = "<span>图集分类：</span>全部图集";//<a href=\"#\"></a>
                if(data.typeOne!=null&&data.typeOne!=""){
                    tj_type = tj_type + "<u>></u>"+data.typeOne;//<a href=\"#\"></a>
                }
                if(data.typeTwo!=null&&data.typeTwo!=""){
                    tj_type = tj_type + "<u>></u>"+data.typeTwo;//<a href=\"#\"></a>
                }
                $("#tj_type").html(tj_type);
                //关键词 
                var tjGjz = "<span>关键词：</span>";
                if(data.tjGjz!=null&&data.tjGjz!=""){
                    var tem = data.tjGjz.split("@");
                    $(tem).each(function(i,row){
                        tjGjz = tjGjz + "<a href=\"#\">"+row+"</a>";//
                    });
                }else{
                    tjGjz = tjGjz + "<a href=\"#\">无</a>";//
                }
                $("#tjGjz").html(tjGjz);

                photoDetail.search_tj_img(uuid);//加载图集下的图片
            }
        });
    },
    /**
     * 查询图集下的图片
     * @param uuid 图集序号
     */
    search_tj_img:function(uuid){
        //获取图片列表
        var jsonstring = JSON.stringify({table:"d_photo_pic",term:"",tj_xh:uuid});
        in_search.search(1,100,"id","desc",jsonstring,function(data){
            console.log(data);
            var str = "";
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
		          str += '<div class="sesum">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="ico ico21 mr5"></i>'+getUtil.nullR(row.look_number)+'</div>';
		          if(getUtil.nullR(row.pic_mc).length > 40){
		          	 str += '<div class="atit">'+row.pic_mc.substring(0,43)+'……</div>';
		          }else{
		          	 str += '<div class="atit">'+getUtil.nullR(row.pic_mc)+'</div>';
		          }
		          str += '</a>';
		          str += '</div>';
		          str += '</li>';
            })
            $("#tj_pic").html(str);
        });

        //选择内容
        // var curSelectArray=[];//已选择内容的id
        // $('.my_up_img').on('click','li',function(){
        //     var curID=$(this).attr('data-id');
        //     var curLen=curSelectArray.length;
        //     if($(this).hasClass('cur')){
        //         $(this).removeClass('cur');
        //         for(var i=0;i<curLen;i++){
        //             if(curSelectArray[i]===curID){
        //                 curSelectArray.splice(i,1);
        //             }
        //         }
        //     }else{
        //         $(this).addClass('cur');
        //         curSelectArray.push(curID);
        //     }
        //     $('.nowSelct').text(curSelectArray.length)
        // })
        // //取消选择
        // $('.cancleSelect').on('click',function(){
        //     $('.my_up_img').find('li').removeClass('cur');
        //     curSelectArray=[];
        //     $('.nowSelct').text(0)
        // })
    },
    /**
     * 加载图片详情
     * @param uuid 图片uuid
     */
    search_img:function(uuid){
        $("#sjcq_pic").show();
        $("#sjcq_tj").hide();
        $("#pic_xs_list").show();//相似图片
        //console.log(uuid);
        //获取图片详情
        in_search.imgDetail(uuid,function(data){
            console.log(data);
            $("#pAndD").hide();//隐藏
            if(data.pic!=null&&data.pic!=""){//图片信息
                $("#picMc").text(data.pic.picMc);
                $("#picScsj").text("上传时间：" + getUtil.getTimetrans(data.pic.picScsj));
                $("#lookNumber").text(data.pic.lookNumber);
                $("#picLyljm").attr("src",index_nav.PICURI+data.pic.picLyljm);//带水印的图片
                
                $("#picMc_2").text(data.pic.picMc);//右边的标题
                $("#picFRemark").text(getUtil.null_W(data.pic.picFRemark));//分说明
                $("#picDd").html("<span>图片地点：</span>"+getUtil.null_W(data.pic.picDd));//
                $("#picSyz").html("<span>摄影作者：</span>"+getUtil.null_W(data.pic.picSyz));//
                $("#picSysj").html("<span>拍摄时间：</span>"+getUtil.getTimetrans(data.pic.picSysj));//
                $("#picScz").html("<span>上传者：</span>"+getUtil.null_W(data.pic.picScz));//


                $("#picFbl").text("分辨率: "+getUtil.null_W(data.pic.picFbl));
                $("#picBgsj").text("曝光时间: "+getUtil.null_W(data.pic.picBgsj));

               // $("#picDX").text("大小: "+getUtil.null_W(data.pic.picDX));
                var fileSize="无";
            	// 如果大小大于1M使用'M'为单位表示, 1位小数点
                if(data.pic.picFilesize){                	
                	if(data.pic.picFilesize > 1024 * 1024 * 1024){
                		// 如果大小大于1G使用'G'为单位表示, 1位小数点
                		fileSize = Math.round(data.pic.picFilesize / (1024 * 1024* 1024) * 100) / 100 + "G";
                	}else if (data.pic.picFilesize > 1024 * 1024) {
                		fileSize = Math.round(data.pic.picFilesize / (1024 * 1024) * 10) / 10 + "M";
                	} else if (data.pic.picFilesize > 1024) {
                		// 如果大小大于1KB使用'KB'为单位表示, 1位小数点
                		fileSize = Math.round(data.pic.picFilesize / 1024 * 10) / 10 + "KB";
                	}
                }
                $("#picDX").text("大小: "+fileSize);
                $("#photoType").text("图片类型: "+getUtil.null_W(data.pic.picFiletype));
                $("#picISO").text("ISO速度："+getUtil.null_W(data.pic.picISO));
                $("#picXjxh").text("相机型号:"+getUtil.null_W(data.pic.picXjxh));
                $("#picJj").text("焦距: "+getUtil.null_W(data.pic.picJj));
                $("#picGqz").text("光圈值:"+getUtil.null_W(data.pic.picGqz));
                $("#picJg").text("价格: ¥"+getUtil.null_W(data.pic.picJg));//图片价格
                $("#picRemark").text(getUtil.null_W(data.pic.picRemark));//主说明
                
                //图片分类
                var pic_type = "<span>图片分类：</span>全部图片";//<a href=\"#\"></a>
                if(data.pic.typeOne!=null&&data.pic.typeOne!=""){
                    pic_type = pic_type + "<u>></u>"+data.pic.typeOne;//<a href=\"#\"></a>
                }
                if(data.pic.typeTwo!=null&&data.pic.typeTwo!=""){
                    pic_type = pic_type + "<u>></u>"+data.pic.typeTwo;//<a href=\"#\"></a>
                }
                $("#pic_type").html(pic_type);
                //关键词 
                var picGjz = "<span>关键词：</span>";
                var XS_pic = "";//@#@ 相似图片查询条件
                if(data.pic.picGjz!=null&&data.pic.picGjz!=""&&data.pic.picGjz!=undefined){
                    var tem = data.pic.picGjz.split("@");
                    $(tem).each(function(i,row){
                        picGjz = picGjz + "<a href=\"javascript:void(0)\" onclick=\"index_nav.search_gjc('"+row+"')\">"+row+"</a>";//
                        if(i==0){
                            XS_pic = XS_pic + row;
                        }else{
                            XS_pic = XS_pic +"@#@"+row;
                        }
                    });
                }else{
                    picGjz = picGjz + "暂无关键词数据！";//
                    //picGjz = ""
                }
                //if(data.pic.picGjz!=null&&data.pic.picGjz!=""){//关键字为空时 不展示
                $("#picGjz").html(picGjz);
                //}
                //查询相似图片
                // photoDetail.searchXS(XS_pic);
                photoDetail.searchXS(XS_pic,uuid);
                if(data.pAndD!=null){//设计师或摄影师信息
                    $("#pAndD").show();
                    $("#pAndD_img").attr("src",index_nav.PICURI+data.pAndD.actor);
                    $("#pAndD_realName").text(data.pAndD.realName);//姓名
                    $("#pAndD_numberOfWorks").text("作品："+getUtil.number(data.pAndD.numberOfWorks));//作品数
                    $("#pAndD_focusOnNum").text("关注量："+getUtil.number(data.pAndD.focusOnNum));//关注数

                    var padUuidC = data.pAndD.uuid;//摄影师或设计师uuid
                    //是否关注
                    if(data.pAndD.concern){//已关注
                        $("#pAndD_concern").attr("class","artion");
                        $("#pAndD_concern").html("<a href=\"javascript:void(0)\" onclick=\"in_browse.delConcern('"+padUuidC+"','pAndD_concern')\" class=\"cur\"><i class=\"ico ico29\"></i> 已关注</a>");
                    }else{//未关注
                        $("#pAndD_concern").attr("class","snb");
                        $("#pAndD_concern").html("<a href=\"javascript:void(0)\" onclick=\"in_browse.addConcern('"+padUuidC+"','pAndD_concern')\">+ 关注</a>");
                    }
                }

                var dow_html = "";
                if(data.dowPower){//是否购买 照片
                    dow_html = '<a href="javascript:void(0)" onclick="index_nav.dowPic(\''+data.pic.picXh+'\')" class="btn btn_ok">'+
                               '下载</a>';
                }else{
                    dow_html = '<a href="javascript:void(0)" onclick="in_pay.add(\''+data.pic.picXh+'\')" class="btn btn_ok">'+
                               '<i class="ico ico23 mr5"></i>加入购物车</a>';
                }
                if(data.isMyPic){//是否是自己的 照片
                     $("#pic_collect").html('<a href="javascript:void(0)" onclick="index_nav.dowPic(\''+data.pic.picXh+'\')" class="btn btn_ok">下载</a>');
                }else{
                    //是否收藏
                    if(data.collect){//已收藏
                        $("#pic_collect").html(dow_html+
                                    '<a onclick=\"in_browse.delCollect(\''+data.pic.picXh+'\',\'pic_collect\')\"  href="javascript:void(0)" class="btn ml10">'+
                                    '<i class="ico ico24f mr5"></i>收藏</a>');
                    }else{//未收藏
                        $("#pic_collect").html(dow_html+
                                    '<a onclick=\"in_browse.addCollect(\''+data.pic.picXh+'\',\'pic_collect\')\"  href="javascript:void(0)" class="btn ml10">'+
                                    '<i class="ico ico24 mr5"></i>收藏</a>');
                    }
                }
                

            }else{
                layer.msg('加载数据失败！');
            }
        });
    },
    
    /**
     * 查询相似图片
     */
    searchXS:function(inp_search,uuid){
        //$("#pic_list").append(str);
        var jsonstring = JSON.stringify({table:"d_photo_pic",term:inp_search});
        //获取图片列表
        in_search.search(1,12,"id","desc",jsonstring,function(data){
            if(data!=null&&data!=""){
                var str = "";
                $(data.rows).each(function(i,row){
                	if(row.pic_xh==uuid){//屏蔽当前图片展示
                		return true
                	}
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
	  		        str += '<div class="sesum">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="ico ico21 mr5"></i>'+getUtil.nullR(row.look_number)+'</div>';
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
            $("#pic_list").html(str);
        })
    }
}
 