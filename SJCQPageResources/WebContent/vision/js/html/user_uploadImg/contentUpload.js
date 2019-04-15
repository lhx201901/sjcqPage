var LOADDING;
var pageSize=12;
//我的上传 
var contentUpload={
		settingSize:10485760,
		picFile:{},
		//图片信息存储对象
		picInfo:{},
		//图片分类缓存数据,避免重复请求
		picTypeObj:{},
		//初始化我的上传
		init:function(){
			//初始化作者记录
			initAuthorBur();
			laydate.render({
				  elem: '#chooseDate' //开始日期
				});
				//选择内容
				$('.userContentUpload .contentUploadImgBox').on('click','.userItem',function(){
					if($(this).hasClass('cur')){
						contentUpload.cancelImgOpt($(this).attr('data-id'));
						$(this).removeClass('cur');
					}else{
						contentUpload.selectedImgOpt($(this).attr('data-id'));
						$('.userContentUpload .contentUploadImgBox .userItem').removeClass('cur');
						$(this).addClass('cur');
					}
				})
				//删除按钮
				$('.userContentUpload .contentUploadImgBox').on('click','.picn-del',function(){
					contentUpload.removeImgOpt($(this).parents('.userItem').attr('data-id'));//
					$(this).parents('.userItem').fadeOut(function(){
						$(this).remove();
					})
				});
				$(".uploadProduction").show();
				$(".uploadSatus").hide();
		},
		initPages:function(status,pageCount){
			$("#uploadPages").html("");
			$("#uploadPages").html('<div class="pages" id="uploadStatusImgPage'+status+'"></div>');
			$("#uploadStatusImgPage"+status).children().remove();
			$("#uploadStatusImgPage"+status).createPage({
				pageCount:pageCount,
				current:1,
				backFn:function(result){
					contentUpload.loadUploadSatusImg(status,result,pageSize,false);
				}
			})	
		},
		//加载上传图片
		userUpImg:function(that,imgName){
			var data_id=$('.userContentUpload .contentUploadImgBox .userItem').length;
			if(!data_id){
				data_id=0;
			}
		    var reads= new FileReader();
		    var fileObj=that.files[0];
		    var imageType = /^image\//;
		    //是否是图片
		    if (!imageType.test(fileObj.type)) {
		        alert("请选择图片！");
		        return;
		    }
		    //读取完成
		    reads.readAsDataURL(fileObj);
		    reads.onload = function(e) {
		        //图片路径设置为读取的图片
		        $('.userContentUpload>.contentUploadImgBox').append('<div class="userItem" data-id="'+data_id+'">'
		    		+'<div class="picn">'
		                +'<div class="picn_nbx">'
		                    +'<p><img class="upimg" src="'+e.target.result+'" onload="this.clientHeight/this.parentNode.clientHeight > this.clientWidth/this.parentNode.clientWidth ? this.style.height = \'100%\' : this.style.width = \'100%\'" ></p>'
		                +'</div>'
		                +'<div class="picn-del"><img src="../project/images/delete.png"/></div>'
		            +'</div>'
		    	+'</div>')
		    };
		    contentUpload.picFile[data_id]=that.files[0];
		}, 
		//图片分类
		picSortLoad:function(sortpxh){
			var sortData= this.picTypeObj[sortpxh];
			if(sortData!=null||sortData!=undefined){
				this.appendPicSort(sortData,sortpxh);
				return;
			}
	        $.ajax({
	            url:"/sjcq/manage/picSort/findBySortPxh",    // 请求的url地址
	            type:"post",   // 请求方式
	            dataType:"json",   // 返回格式为json
	            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
	            data:{sortPxh:sortpxh} ,    // 参数值     state 0:密码登录 1:验证码登录
	            success:function(data){
	            	if(data!=null&&data!=undefined&&data.length>0){
	            		contentUpload.picTypeObj[sortpxh]=data;
	            		contentUpload.appendPicSort(data,sortpxh);
	            	}
	            },
	            error:function(){
	                layer.alert('查询加载失败！');
	            }
	        });
		},
		//追加子分类数据
		appendPicSort:function(data,sortpxh){
        		var options='<option selected=selected>选择分类</option>';
        		for(var i=0;i< data.length;i++){
        			options=options+'<option value="'+data[i].sortXh+'">'+data[i].sortName+'</option>'
        		}
        		$("#contentUploadPicSort").append(
        			'<div class="img_sel" data-level="'+data[0].sortLevels+'" data-sortpxh="'+sortpxh+'">'
        				+'<select class="sct" onchange=contentUpload.selectPicSort(this,'+data[0].sortLevels+','+sortpxh+') >'
        					+options
        				+'</select> '
        				+'<i class="ico ico60"></i>'
        			+'</div>'	
        		);
        	
		},
		selectPicSort:function(_this,sortLevels,sortpxh){
			if(undefined==$(_this).val()||null==$(_this).val()||''==$(_this).val()){
				return false;
			}
			$(_this).parent().nextAll('.img_sel').remove();
			contentUpload.picSortLoad($(_this).val());
		},
		saveImg:function(){
			if(undefined==$("#contentUploadTitle").val()||null==$("#contentUploadTitle").val()||''==$("#contentUploadTitle").val()){
				layer.alert('标题不能为空!');
				return;
			}
			if(undefined==$("#contentUploadMainExplain").val()||null==$("#contentUploadMainExplain").val()||''==$("#contentUploadMainExplain").val()){
				layer.alert('主说明不能为空!');
				return;
			}
			if(undefined==$("#contentUploadShootAuthor").val()||null==$("#contentUploadShootAuthor").val()||''==$("#contentUploadShootAuthor").val()){
				layer.alert('摄影作者不能为空!');
				return;
			}
			var userItem=$('.userContentUpload .contentUploadImgBox .userItem').filter(".cur");
			if(userItem.length==1){
				var dataId=$(userItem.get(0)).attr("data-id");
				var obj={};
				//obj.src=$( userItem.find(".upimg")[0]).attr("src");
				obj.contentUploadTitle=$("#contentUploadTitle").val();
				obj.contentUploadMainExplain=$("#contentUploadMainExplain").val();
				obj.contentUploadBranchExplain=$("#contentUploadBranchExplain").val();
				obj.contentUploadPicAddr=$("#contentUploadPicAddr").val();
				obj.contentUploadShootAuthor=$("#contentUploadShootAuthor").val();
				obj.chooseDate=$("#chooseDate").val();
				obj.keyWord=$("#keyWord").val();
				obj.picIsPublic=$("#picIsPublic").val();
				obj.layoutType=$("#layoutType").val();
				var contentUploadPicSort= [];
				$.each($("#contentUploadPicSort").find(".sct"),function(index,item){
					contentUploadPicSort.push({
						level:$(item).parent().attr("data-level"),
						sortpxh:$(item).parent().attr("data-sortpxh"),
						sortxh:$(item).val()
					});
				})
				obj.contentUploadPicSort=contentUploadPicSort;
				this.picInfo[dataId]=obj ;
				layer.alert('保存成功!');
			}
			
		},
		//选中图片执行操作
		selectedImgOpt:function(dataId){
			$(".uploadProduction").find(".up_ins").show();
			$("#contentUploadPicSort .img_sel").remove();
			if(contentUpload.picInfo[dataId]){
				$("#contentUploadTitle").val(contentUpload.picInfo[dataId].contentUploadTitle);
				$("#contentUploadMainExplain").val(contentUpload.picInfo[dataId].contentUploadMainExplain);
				$("#contentUploadBranchExplain").val(contentUpload.picInfo[dataId].contentUploadBranchExplain);
				$("#contentUploadPicAddr").val(contentUpload.picInfo[dataId].contentUploadPicAddr);
				$("#contentUploadShootAuthor").val(contentUpload.picInfo[dataId].contentUploadShootAuthor);
				$("#chooseDate").val(contentUpload.picInfo[dataId].chooseDate);
				$("#keyWord").val(contentUpload.picInfo[dataId].keyWord);
				$("#layoutType option[value='"+$("#layoutType").val()+"']").prop("selected", true);
				$("#picIsPublic option[value='"+$("#picIsPublic").val()+"']").prop("selected", true);
				//加载选中图片分类
				if(contentUpload.picInfo[dataId].contentUploadPicSort!=null
						&&contentUpload.picInfo[dataId].contentUploadPicSort!=undefined
						&&contentUpload.picInfo[dataId].contentUploadPicSort.length>0){
					$.each(contentUpload.picInfo[dataId].contentUploadPicSort,function(index,item){
						var options='<option>选择分类</option>';
						$.each( contentUpload.picTypeObj[item.sortpxh],function(index1,item1){
							if(item1.sortXh==item.sortxh){
								options=options+'<option selected=selected value="'+item1.sortXh+'">'+item1.sortName+'</option>'
							}else{
								options=options+'<option  value="'+item1.sortXh+'">'+item1.sortName+'</option>'
							}
			        			
						})
					
		        		$("#contentUploadPicSort").append(
			        			'<div class="img_sel" data-level="'+item.level+'" data-sortpxh="'+item.sortpxh+'">'
			        				+'<select class="sct" onchange=contentUpload.selectPicSort(this,'+item.level+','+item.sortpxh+') >'
			        					+options
			        				+'</select> '
			        				+'<i class="ico ico60"></i>'
			        			+'</div>'	
			        	);
					})
				}
			}else{
				contentUpload.clearData();
			}
			contentUpload.initTextareaTip("#contentUploadMainExplain");
			contentUpload.initTextareaTip("#contentUploadBranchExplain");
		},
		clearData:function(){
			$("#contentUploadPicSort .img_sel").remove();
			$("#contentUploadTitle").val("");
			$("#contentUploadMainExplain").val("");
			$("#contentUploadBranchExplain").val("");
			$("#contentUploadPicAddr").val("重庆");
			$("#contentUploadShootAuthor").val("");
			var _today= new Date();
			$("#chooseDate").val(_today.getFullYear()+"-"+(_today.getMonth()+1)+"-"+_today.getDate());
			$("#keyWord").val("");
			this.picSortLoad(0);//加载初始图片分类
		},
		//取消图片执行操作
		cancelImgOpt:function(dataId){
			$(".uploadProduction").find(".up_ins").hide();
			$("#contentUploadPicSort .img_sel").remove();
			$("#contentUploadTitle").val("");
			$("#contentUploadMainExplain").val("");
			$("#contentUploadBranchExplain").val("");
			$("#contentUploadPicAddr").val("");
			$("#contentUploadShootAuthor").val("");
			
			$("#chooseDate").val("");
			$("#keyWord").val("");
			this.picSortLoad(0);//加载初始图片分类
		},
		//删除已上传图片数据
		removeImgOpt:function(dataId){
			delete this.picInfo[dataId];
			this.cancelImgOpt(dataId);
			delete this.picFile[dataId];
		},
		fileUpload:function(file,nowSize,settingSize,upInfo,tempImgId){
			var data = new FormData();
			var name = file.name;
			var fileType = name.substring(name.lastIndexOf(".") + 1).toLowerCase();
		//	data.append("fileName", encodeURIComponent(name));
			var endSize=settingSize;
			if(settingSize>file.size-nowSize){
				endSize=file.size;
			}else{
				endSize=nowSize+settingSize;
			}
			data.append("myFile", file.slice(nowSize,endSize));
		//	data.append("theSize", endSize + "");//当前端尺寸
		//	data.append("imgSize", file.size + "");//图片总大小
			
			data.append("upInfo", JSON.stringify(upInfo));
			data.append("imgInfo",JSON.stringify({"theSize":endSize,"imgSize":file.size+"","imgName":name,"imgType":file.type,"tempImgId":tempImgId}) );
			$.ajax({
			    url: '/sjcq/photoPic/uploadMyPic',
			    type: 'POST',
			    cache: false,
			    data: data,
			    async:false,
			    processData: false,
			    contentType: false
			}).done(function(res) {
//				layer.alert(res.message);
				if(endSize-nowSize>=settingSize){
					contentUpload.fileUpload(file,nowSize+settingSize,settingSize,upInfo,tempImgId);
				}
				if(settingSize==file.size){
//					 layer.alert('图片上传完成！');	
				}
			}).fail(function(res) {
				layer.close(LOADDING);
				layer.alert('图片上传失败！');
				return;
			});
		},
		//获取零时图片的命名服务器时间+用户的uuid
		getTempImgId:function(){
			var tempImgId=null;
	        $.ajax({
	            url:"/sjcq/photoPic/serviceTime",    // 请求的url地址
	            type:"post",   // 请求方式
	            dataType:"json",   // 返回格式为json
	            async:false,// 请求是否异步，默认为异步，这也是ajax重要特性
	            success:function(data){
	            	tempImgId=data.imgId;
	            },
	            error:function(){
	                layer.alert('查询加载失败！');
	            }
	        });
	        return tempImgId;
		},
		//执行图片上传
		submitContUploadImgs:function(){
			//判断标题不能为空
			for(var i in contentUpload.picFile){
				if(contentUpload.picInfo[i]==undefined){
					layer.alert("请确认每张图片是否填写信息并保存修改！");
					return;
				}else{
					var picMc = contentUpload.picInfo[i].contentUploadTitle;
					if (picMc == undefined || picMc.trim().length == 0) {
						layer.alert("未完成全部图片标题设置！");
						return;
					}
				}
			}
			LOADDING=layer.load(0,{content: "<font style='float: left;padding-top: 30px;width: 300px;font-size: 16px;margin-left: -35px;'>图片上传中，请等待！</font>",shade: [0.1,'#fff']}); 
			//上传及数据保存
			for(var i in contentUpload.picFile){
				var tempImgId=contentUpload.getTempImgId();
				contentUpload.fileUpload(contentUpload.picFile[i],0,contentUpload.settingSize,contentUpload.picInfo[i],tempImgId);
			}
			layer.close(LOADDING);
//			layer.alert("上传图片成功！");
			var index=layer.open({  
                content: "上传图片成功！",
                yes:function() {
                	layer.close(index);
                	$(".content_upload .user_zp").find("a").removeClass("cur");
                	$(".content_upload .user_zp").find("a").each(function(){
                		if($(this).text()=="上传状态"){
                			$(this).addClass("cur");
                		}
                	});
        			$(".uploadSatus").show();
        			$(".uploadProduction").hide();
        			contentUpload.picFile={};
        			contentUpload.picInfo={};
        			$('.userContentUpload .contentUploadImgBox').html("");
        			contentUpload.clearData();
        			contentUpload.loadUploadSatusImg("0",1,pageSize,true);
                },  
                cancel: function() { 
                	layer.close(index);
                }  
            });  
/*	        $.ajax({
	            url:"/sjcq/photoPic/submitContUploadImgs",    // 请求的url地址
	            type:"post",   // 请求方式
	            contentType : 'application/json;charset=utf-8',
	            dataType:"json",   // 返回格式为json
	            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
	            data:JSON.stringify(contentUpload.picInfo) ,    // 参数值     state 0:密码登录 1:验证码登录
	            success:function(data){
	            	if(data.status=="success"){
	            		layer.alert(data.message);
	            	}else{
	            		layer.alert(data.message);
	            	}
	            },
	            error:function(){
	                layer.alert('查询加载失败！');
	            }
	        });*/
		},
		//上传作品
		uploadProductionTab:function(_this){
			$(_this).parent().find("a").removeClass("cur");
			$(_this).addClass("cur");
			$(".uploadProduction").show();
			$(".uploadSatus").hide();
		},
		//上传状态
		uploadSatusTab:function(_this){
			$(_this).parent().find("a").removeClass("cur");
			$(_this).addClass("cur");
			$(".uploadSatus").show();
			$(".uploadProduction").hide();
		//	$('.cisoao .my_up_img').eq(0).fadeIn('fast').siblings().fadeOut('fast');
			contentUpload.loadUploadSatusImg("0",1,pageSize,true);
		},
		initUploadSatus:function(){
			$('.asoci>a').on('click',function(){
					var idx=$(this).index();
					$(this).addClass('cur').siblings().removeClass('cur');
					$('.cisoao .my_up_img').eq(idx).fadeIn('fast').siblings().fadeOut('fast');
					contentUpload.loadUploadSatusImg($(this).attr("upload-status"),1,pageSize,true);
			})
		},
		loadUploadSatusImg:function(status,pageIndex,pageSize,isInitialize){
			$(".uploadStatusImgShow li").remove();
	        $.ajax({
	            url:"/sjcq/retriebe/getPicByUploadAuditAndAcountId",    // 请求的url地址
	            type:"post",   // 请求方式
	          //  contentType : 'application/json;charset=utf-8',
	            dataType:"json",   // 返回格式为json
	            async:false,// 请求是否异步，默认为异步，这也是ajax重要特性
	            data:{pageIndex:pageIndex,pageSize:pageSize,type:status} ,    // 参数值     state 0:密码登录 1:验证码登录
	            success:function(data){
	            	var total=data.total;
            		if(isInitialize){
            			contentUpload.initPages(status,getPages(total,pageSize))//  total%pageSize==0? Math.ceil(total/pageSize): Math.ceil(total/pageSize)+1);
            		}
	            	//$(".uploadStatusImgShow li").remove();
	            	var html="";
	            	$.each(data.rows,function(index,item){
	            		html+='<li data-picXh=\''+item.pic_xh+'\'><div class="picn"> '
					            			+'<div class="picn_nbx"> '+
					            				'<p><img src="'+index_nav.PICURI+item.pic_lylys+'"></p> '
					            			+'</div>';
						            	if(item.in_audit==1){
						            		html+='<div class="vjg"> <div class="tis">'+item.pic_mc+'</div>'
						            		+'<div class="eds">'
						            		+'<i class="ico ico52 " onclick="in_search.imgJump(\''+item.pic_xh+'\')"></i>'
												+'<i class="ico ico50 ml10" onclick="upload.eidtTp(this)"></i>'
												+'<i class="ico ico51 ml10" onclick="upload.deleteThisImg(this)"></i>'
											+'</div>'
											+'</div>';
						            	}else if(item.in_audit==2){//审核不通过
						            		html+='<div class="vjg"> <div class="tis">'+item.pic_mc+'</div><div class="tis">未通过理由:'+item.audit_info+'</div>'
						            		+'<div class="eds">'
						            		+'<i class="ico ico52 " onclick="in_search.imgJump(\''+item.pic_xh+'\')"></i>'
												+'<i class="ico ico50 ml10" onclick="upload.eidtTp(this)"></i>'
												+'<i class="ico ico51 ml10" onclick="upload.deleteThisImg(this)"></i>'
											+'</div>'
											+'</div>';
						            	}else{
						            		html+='<div class="vjg"> <div class="tis">'+item.pic_mc+'</div>'
						            		+'<div class="eds">'
												+'<i class="ico ico52 " onclick="in_search.imgJump(\''+item.pic_xh+'\')"></i>'
											+'</div>'
											+'</div>';
						            	}
					            		html+='</div></li>';
	            	});
	            	$(".uploadStatusImgShow").html(html);
	            },
	            error:function(){
	                layer.alert('查询加载失败！');
	            }
	        });
		},
		initTextareaTip:function(_this){
			var max =parseInt($(_this).attr("max"));;
			if (max) {
				$(_this).siblings(".zsum").text($(_this).val().length + " / " + max);
				$(_this).on("keyup", function() {
					if ($(_this).val().length > max) {
						return false;
					}
					$(_this).siblings(".zsum").text($(_this).val().length + " / " + max);
				})
			}
		}
		
}



/**
 * 显示历史记录框
 */
function selectAuthorRecordShow(){
	var data=readFromCookie();
	$(".authorRecord div").remove();
	$.each(data,function(indxe, item){
		$(".authorRecord").prepend('<div onclick="writeIntoInput(\''+item+'\')"><a  class="record_info_font"> '+item+'</a></div>');
	});
	$(".authorRecord").show();
}


function writeIntoInput(item){
	$("#contentUploadShootAuthor").val(item);
}
/**
 * 隐藏历史框
 */
function selectAuthorRecordHide(){
	$(".authorRecord").hide();
}

/**
 * 向cookie写入数据
 * @param _value
 */
function writeIntoCookie(_value){
	if(_value==null||_value==undefined||''==_value||''==$.trim(_value)){
		return;
	}
	var ishave=false;
	var ard= $.cookie('authorRecordSjcq');
	if(ard==null){
		$.cookie('authorRecordSjcq', _value, { expires:  365  });
		return;
	}else{
		var arrayArd= ard.split("@");
		$.each(arrayArd,function(index,item){
			if(item==_value){
				ishave=true;
			}
		});
		if(ishave)
			return;
		if(arrayArd.length>=10){
			ard=ard.substring(ard.indexOf("@")+1,ard.length);
		}
		$.cookie('authorRecordSjcq', ard+"@"+_value, { expires:  365  });
	}
}

/**
 * 失去焦点触发的事件
 */
function authorFocusout(){
	writeIntoCookie($("#contentUploadShootAuthor").val());
    setTimeout(function(){  
        // input框失去焦点，隐藏下拉框  
    	selectAuthorRecordHide();
    }, 200);  
}
/**
 * 读取cookie数据返回数组
 * @returns
 */
function readFromCookie(){
	var ard= $.cookie('authorRecordSjcq');
	if(ard==null||ard==undefined){
		 return [];
	}else{
		return ard.split("@");
	}
	
}
/**
 * 初始化作者历史记录事件
 */
function initAuthorBur(){
	$(".btn_clean").click(function(){
		$.cookie('authorRecordSjcq', null, { expires:  365  });
	});
	$("#contentUploadShootAuthor").focusin(selectAuthorRecordShow);
	$("#contentUploadShootAuthor").focusout(authorFocusout);
	
}


