/**
 * 图片详情
 */
var photoDetail = {
	picXh:'',
	PARAM:{},
	MODULEID_:'',
	tjXh:'',
    init:function(){
    	PARAM = GetParamByRequest();
    	MODULEID_=PARAM.MODULEID_;
    	picXh=PARAM.picXh;
    	tjXh=PARAM.tjXh
        if(PARAM.type){
        	photoDetail.search_tj();
        	$("#tj_pic_list").show();
        	$("#sjcq_tj").show();
        	$("#sjcq_pic").hide();
        }else if(PARAM.auditType){//获取推送审核图片信息
        	$("#tj_pic_list").hide();
        	$("#sjcq_tj").hide();
        	$("#sjcq_pic").show();
        	photoDetail.searchAudit();
    	}else{
        	$("#tj_pic_list").hide();
        	$("#sjcq_tj").hide();
        	$("#sjcq_pic").show();
        	photoDetail.search();
        }
    	
    },
    /**
     * 加载图集详情
     * @param uuid 图集uuid
     */
    search_tj:function(){
    	var uuid=tjXh;
        $("#sjcq_tj").show();
        $("#sjcq_pic").hide();
        in_search.tjDetail(uuid,function(data){
            if(data!=null){
                $("#tjFmlj").attr("src",index_nav.PICURI+data.tjFmlj);//带水印的图片
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
        in_search.searchAll(1,100,"id","desc",jsonstring,function(data){
            console.log(data);
            var html = "";
            $(data.rows).each(function(i,row){
            	html += '<li  onclick="photoDetail.imgJump(\'' + row.pic_xh + '\')">';
            	html += '<div class="img_info">';
            	html += '<a href="javascript:void(0)">';
            	html += '<p class="img">'
		          +'<img src="'+index_nav.PICURI+row.pic_lylys+'" onload="this.clientHeight> this.clientWidth ? this.style.height = \'100%\' : this.style.width = \'100%\'"></p>';
            	html += '</a>';
            	html += '</div>';
            	html += '<div class="atr_info">';
            	html += '<a href="javascript:void(0)">';
            	html += '<div class="atime">'+getUtil.getTimetrans(row.pic_scsj)+'</div>';
            	html += '<div class="sesum">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="ico ico21 mr5"></i>'+getUtil.nullR(row.look_number)+'</div>';
		          if(getUtil.nullR(row.pic_mc).length > 40){
		        	  html += '<div class="atit">'+row.pic_mc.substring(0,43)+'……</div>';
		          }else{
		        	  html += '<div class="atit">'+getUtil.nullR(row.pic_mc)+'</div>';
		          }
		          html += '</a>';
		          html += '</div>';
		          html += '</li>';
            })
            $("#tj_pic").html(html);
        });
    },
    imgJump:function(picXh){
    	var url = "../html/photoDetail/photoDetail.html";
		var tabId = "photoDetail";
		var name = "图片详情页";
		var param = JSON.stringify({
			"tabId" : tabId,
			"MODULEID_" : MODULEID_,
			"MAIN_PAGE_ID_" : MODULEID_,
			"picXh" : picXh
		});
		pageAddNewTab(tabId, name, url, param)
    },
    //添加浏览量
   borrow:function(){ $.ajax({
              url:"/sjcq/photoPic/lookNumber",    // 请求的url地址
              type:"post",   // 请求方式
              dataType:"text",   // 返回格式为json
              async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
              data:{picXh:picXh},    // 参数值
              success:function(data){
                  console.log(data);
                  return data;
              },
              error:function(){
                  layer.msg('查询加载失败！');
              }
          })
          },
    /**
     * 加载图片详情
     */
    search:function(){
        var uuid =   picXh;
        photoDetail.borrow();
        console.log(uuid);
        //获取图片详情
        in_search.imgDetail(uuid,function(data){
            console.log(data);
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

             //   $("#picDX").text("大小: "+getUtil.null_W(data.pic.picDX));
                var fileSize="无";
            	// 如果大小大于1M使用'M'为单位表示, 1位小数点
                if(data.pic.picFilesize){                	
                	if(data.pic.pic_filesize > 1024 * 1024 * 1024){
                		// 如果大小大于1G使用'G'为单位表示, 1位小数点
                		fileSize = Math.round(data.pic.picFilesize / (1024 * 1024* 1024) * 100) / 100 + "G";
                	}else if (data.pic.picFilesize > 1024 * 1024) {
                		fileSize = Math.round(data.pic.picFilesize / (1024 * 1024) * 10) / 10 + "M";
                	} else if (data.pic.pic_filesize > 1024) {
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
                $("#picJg").text("¥"+getUtil.null_W(data.pic.picJg));//图片价格
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
                if(data.pic.picGjz!=null&&data.pic.picGjz!=""){
                    var tem = data.pic.picGjz.split("@");
                    $(tem).each(function(i,row){
                        picGjz = picGjz + "<a href=\"#\">"+row+"</a>";//
                        if(i==0){
                            XS_pic = XS_pic + row;
                        }else{
                            XS_pic = XS_pic +"@#@"+row;
                        }
                    });
                }else{
                    picGjz = picGjz + "<a href=\"#\">无</a>";//
                }
                $("#picGjz").html(picGjz);
                //查询相似图片
                //photoDetail.searchXS(XS_pic);
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

                //是否收藏
                if(data.collect){//已收藏
                    $("#pic_collect").html('<a href="javascript:void(0)" class="btn btn_ok">'+
                                           '<i class="ico ico23 mr5"></i>加入购物车</a>'+
                                           '<a onclick=\"in_browse.delCollect(\''+data.pic.picXh+'\',\'pic_collect\')\"  href="javascript:void(0)" class="btn ml10">'+
                                           '<i class="ico ico24f mr5"></i>收藏</a>');
                }else{//未收藏
                    $("#pic_collect").html('<a href="javascript:void(0)" class="btn btn_ok">'+
                                           '<i class="ico ico23 mr5"></i>加入购物车</a>'+
                                           '<a onclick=\"in_browse.addCollect(\''+data.pic.picXh+'\',\'pic_collect\')\"  href="javascript:void(0)" class="btn ml10">'+
                                           '<i class="ico ico24 mr5"></i>收藏</a>');
                }

            }else{
                layer.msg('加载数据失败！');
            }
        });
        
    },
    searchAudit:function(){

        var uuid =   picXh;
        photoDetail.imgDetail(uuid,function(data){
            console.log(data);
            if(data!=null&&data!=""){//图片信息
                $("#picMc").text(data.picMc);
                $("#picScsj").text("上传时间：" + getUtil.getTimetrans(data.picScsj));
                $("#lookNumber").text(data.lookNumber);
                $("#picLyljm").attr("src",index_nav.PICURI+data.picLyljm);//带水印的图片
                
                $("#picMc_2").text(data.picMc);//右边的标题
                $("#picFRemark").text(getUtil.null_W(data.picFsm));//分说明
                $("#picDd").html("<span>图片地点：</span>"+getUtil.null_W(data.picDd));//
                $("#picSyz").html("<span>摄影作者：</span>"+getUtil.null_W(data.picSyz));//
                $("#picSysj").html("<span>拍摄时间：</span>"+getUtil.getTimetrans(data.picSysj));//
                $("#picScz").html("<span>上传者：</span>"+getUtil.null_W(data.picScz));//


                $("#picFbl").text("分辨率: "+getUtil.null_W(data.picFbl));
                $("#picBgsj").text("曝光时间: "+getUtil.null_W(data.picBgsj));

             //   $("#picDX").text("大小: "+getUtil.null_W(data.picDX));
                var fileSize="无";
            	// 如果大小大于1M使用'M'为单位表示, 1位小数点
                if(data.picFilesize){                	
                	if(data.pic_filesize > 1024 * 1024 * 1024){
                		// 如果大小大于1G使用'G'为单位表示, 1位小数点
                		fileSize = Math.round(data.picFilesize / (1024 * 1024* 1024) * 100) / 100 + "G";
                	}else if (data.picFilesize > 1024 * 1024) {
                		fileSize = Math.round(data.picFilesize / (1024 * 1024) * 10) / 10 + "M";
                	} else if (data.pic_filesize > 1024) {
                		// 如果大小大于1KB使用'KB'为单位表示, 1位小数点
                		fileSize = Math.round(data.picFilesize / 1024 * 10) / 10 + "KB";
                	}
                }
                $("#picDX").text("大小: "+fileSize);
                $("#photoType").text("图片类型: "+getUtil.null_W(data.picFiletype));
                $("#picISO").text("ISO速度："+getUtil.null_W(data.picIso));
                $("#picXjxh").text("相机型号:"+getUtil.null_W(data.picXjxh));
                $("#picJj").text("焦距: "+getUtil.null_W(data.picJj));
                $("#picGqz").text("光圈值:"+getUtil.null_W(data.picGqz));
                $("#picJg").text("¥"+getUtil.null_W(data.picJg));//图片价格
                $("#picRemark").text(getUtil.null_W(data.picZsm));//主说明
                
                //图片分类
                var pic_type = "<span>图片分类：</span>全部图片";//<a href=\"#\"></a>
                if(data.typeOne!=null&&data.typeOne!=""){
                    pic_type = pic_type + "<u>></u>"+data.typeOne;//<a href=\"#\"></a>
                }
                if(data.typeTwo!=null&&data.typeTwo!=""){
                    pic_type = pic_type + "<u>></u>"+data.typeTwo;//<a href=\"#\"></a>
                }
                $("#pic_type").html(pic_type);
                //关键词 
                var picGjz = "<span>关键词：</span>";
                var XS_pic = "";//@#@ 相似图片查询条件
                if(data.picGjz!=null&&data.picGjz!=""){
                    var tem = data.picGjz.split("@");
                    $(tem).each(function(i,row){
                        picGjz = picGjz + "<a href=\"#\">"+row+"</a>";//
                        if(i==0){
                            XS_pic = XS_pic + row;
                        }else{
                            XS_pic = XS_pic +"@#@"+row;
                        }
                    });
                }else{
                    picGjz = picGjz + "<a href=\"#\">无</a>";//
                }
                $("#picGjz").html(picGjz);
                //查询相似图片
                //photoDetail.searchXS(XS_pic);
                

            }else{
                layer.msg('加载数据失败！');
            }
        });
        
    
    },
    imgDetail:function(id,callback){
        $.ajax({
            url:"/sjcq/pushInternalAudit/findById",    // 请求的url地址
            type:"post",   // 请求方式
            dataType:"json",   // 返回格式为json
            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
            data:{id:id},    // 参数值     
            success:function(data){
               //console.log(data);
               callback(data);
            },
            error:function(){
                layer.msg('加载数据失败！');
            }
        });
    },
    /**
     * 查询相似图片
     */
    searchXS:function(inp_search){
        var jsonstring = JSON.stringify({table:"d_photo_pic",term:inp_search});
        //获取图片列表
        in_search.search(1,12,"id","desc",jsonstring,function(data){
            if(data!=null&&data!=""){
                var str = "";
                $(data.rows).each(function(i,row){
                    str = str + '<li onclick="in_search.imgJump(\''+row.pic_xh+'\')">';
                    str = str + '<div class="img_info">';
                    str = str + '<a href="javascript:void(0)">';
                    str = str + '<p class="img"><img src="'+index_nav.PICURI+row.pic_lylys+'"></p>';
                    str = str + '</a>';
                    str = str + '<div class="atr_info">';
                    str = str + '<div class="atit">'+getUtil.nullR(row.pic_mc)+'</div>';
                    str = str + '<div class="atime">'+getUtil.getTimetrans(row.pic_scsj)+'</div>';
                    str = str + '<div class="sesum"><i class="ico ico20 mr5"></i>'+getUtil.nullR(row.look_number)+'</div>';
                    str = str + '</div>';
                    str = str + '</div>';
                    str = str + '</li>';
                });
            }
            str = str + '<li class="pd-clear">&nbsp;</li><li class="pd-clear">&nbsp;</li><li class="pd-clear">&nbsp;</li>';
            $("#pic_list").append(str);
        })
    }
}
 