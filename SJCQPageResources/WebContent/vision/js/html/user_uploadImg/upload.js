var pageSize = 12;
var tjPageSize=60;//wc 图集的每页大小
/*//获取参数
var url = window.location.search;
// 正则筛选地址栏
var reg = new RegExp("(^|&)"+ "type" +"=([^&]*)(&|$)");
// 匹配目标参数
var result = url.substr(1).match(reg);
//返回参数值
myurl= result ? decodeURIComponent(result[2]) : null;*/

//我的作品
var upload={
		//选中的图片
		curSelectTp:[],
		//选中的图集
		curSelectTj:[],
		nowTjXh:'',
		nowTjTpStat:'',
		init:function(){
			//取消选择
			$('.cancleSelect').on('click',function(){
				$('.my_up_img').find('li').removeClass('cur');
				upload.curSelectTp=[];
				$('.nowSelct').text(0);
			});
			
			$('.myproduction a').on('click',function(){
				$('.myproduction a').removeClass('cur');
				$(this).addClass('cur');
				var type= $(this).attr('data');
				if("tj"==type){
					$('.u_zp_edit').hide();
					upload.initTj();
					upload.loadMytj(1,tjPageSize,true);
				}else if("tp"==type){
					$('.u_zp_edit').show();
					upload.initDbz();
					upload.loadMyMagnumOpus(1,pageSize,true);
				}
			})
			upload.loadMyMagnumOpus(1,pageSize,true);
		},
		
		/**
		 * 初始化分页控件
		 * @param type
		 * @param pageCount
		 */
		initPages:function(type,pageCount){
			$("#wdzp_loadPage").html('<div class="pages" id="persionInfoPages'+type+'"></div>');
			$("#persionInfoPages"+type).createPage({
		        pageCount:pageCount,
		        current:1,
		        backFn:function(result){
		        	if("tpdbz"==type){//代表作
		        		upload.loadMyMagnumOpus(result,pageSize,false);
		        	}else if("tjtp"==type){//图集图片
		        		upload.showTjById(upload.nowTjXh,result,pageSize,false);
		        	}else if("tj"==type){//图集
		        		upload.loadMytj(result,tjPageSize,false);
		        	}
		        
		        }
		    })
		},
		//初始化数据
		initData:function(){
			upload.curSelectTp=[];
			upload.curSelectTj=[];
			$('.nowSelct').text(0);
			 
		},
		initTjTp:function(){
			   upload.initData();
			   $('.qxdbz').hide();
			   $('.szdbz').show();
			   $('#shelves').hide();
			   $('.returnTj').show();
			   $('.u_zp_edit').show();
			   $('.nowSelct').text(0);
			   $(".myUpImgContent li").remove();
			   upload.curSelectTp=[];
			   upload.curSelectTj=[];
		},
		initDbz:function(){
			   upload.initData();
			   $('.qxdbz').show();
			   $('.szdbz').hide();
			   $('#shelves').hide();
			   $('.returnTj').hide();
			   $('.u_zp_edit').show();
			   $('.nowSelct').text(0);
			   $(".myUpImgContent li").remove();
			   upload.curSelectTp=[];
			   upload.curSelectTj=[];
		},
		initTj:function(){
			upload.initData();
		  	$('.u_zp_edit').hide();
		  	$('.nowSelct').text(0);
			$(".myUpImgContent li").remove();
		},
		
		/**
		 * 加载我的代表作品
		 * @param pageIndex 当前页
		 * @param pageSize 每页大小
		 * @param isInitialize 是否需要初始化插件 
		 */
		loadMyMagnumOpus:function(pageIndex,pageSize,isInitialize){
			upload.initDbz();
		  //清空内容
		   $(".myUpImgContent li").remove();
		  //加载图片
	        $.ajax({
	            url:"/sjcq/retriebe/getMagnumOpusByAcountId",    // 请求的url地址
	            type:"post",   // 请求方式
	         //   contentType : 'application/json;charset=utf-8',
	            dataType:"json",   // 返回格式为json
	            async:false,// 请求是否异步，默认为异步，这也是ajax重要特性
	            data:{pageIndex:pageIndex,pageSize:pageSize,type:1,acountUuid:''} ,    // 参数值     state 0:密码登录 1:验证码登录
	            success:function(data){
	            	if(data.statu){
	            		layer.alert("登录过期请重新登录！！");
	            	}else{
	            		var total=data.total;
	            		if(isInitialize){
	            			upload.initPages("tpdbz",getPages(total, pageSize) );
	            		}
	            		var wdzp_html="";
	            		$.each(data.rows, function(index, val) {
	            			wdzp_html += '<li data-id="'+val.id+'" data-picXh="'+val.pic_xh+'">';
	            			wdzp_html += '<div class="picn">';
	            			wdzp_html += '<div class="picn_nbx" onclick="upload.selectMyMagnumOpus(this)">';
	            			wdzp_html += '<p><img src="'+index_nav.PICURI+val.pic_lylys+'"></p> ';
	            			wdzp_html += '<div class="ed_sel_ok">';
	            			wdzp_html += '<i class="ico ico22"></i>';
	            			wdzp_html += '</div>';
	            			wdzp_html += '</div>';
	            			wdzp_html += '<div class="vjg">';
	            			wdzp_html += '<div class="tis">'+val.pic_mc+'</div>';
	            			wdzp_html += '<div class="eds">';
	            			wdzp_html += '<i class="ico ico52 " onclick="in_search.imgJump(\''+val.pic_xh+'\')"></i>';
	            			wdzp_html += '<i class="ico ico50 ml10" onclick="upload.eidtTp(this)"></i>';
	            			wdzp_html += '<i class="ico ico51 ml10" onclick="upload.deleteThisImg(this)"></i>';
	            			wdzp_html += '</div></div></div>';
	            			wdzp_html += '</li>';
	            			
	            		});
	            		$(".myUpImgContent").html(wdzp_html);
	            	}
	            },
	            error:function(){
	                layer.alert('查询加载失败！');
	            }
	        }); 
	  },
	 /**
	  * 加载我的图集
	  * @param pageIndex 当前页
	  * @param pageSize 每页大小
	  * @param isInitialize 是否需要初始化插件 
	  */
	  loadMytj:function(pageIndex,pageSize,isInitialize){
		  //清空内容
		  $('#shelves').hide();
		   $(".myUpImgContent li").remove();
		  //加载图集
	        $.ajax({
	            url:"/sjcq/retriebe/getPhotoTjByAcountId",
	            type:"post",
	         //   contentType : 'application/json;charset=utf-8',
	            dataType:"json",
	            async:true,
	            data:{pageIndex:pageIndex,pageSize:pageSize,type:1,acountUuid:''} ,    // 参数值     state 0:密码登录 1:验证码登录
	            success:function(data){
	            	if(data.statu){
	            		layer.alert("登录过期，请重新登录！！");
	            	}else{
	            		var total=data.total;
	            		if(isInitialize){
	            			upload.initPages("tj",getPages(total, pageSize) );
	            		}
	            		var wdzp_html=""; 
	            		$.each(data.rows, function(index, val) {
	            			wdzp_html += '<li data-id="'+val.id+'" data-tjxh="'+val.tj_xh+'" >';
	            			wdzp_html += '<div class="picn" >';
	            			wdzp_html += '<div class="picn_nbx" onclick="upload.selectTjOpt(this)">';
	            			wdzp_html += '<p><img src="'+index_nav.PICURI+val.tj_fmlj+'"></p> ';
	            			wdzp_html += '<div class="tuji_con"><em class="tjc">'+val.tj_sl+'</em></div>';
	            			wdzp_html += '<div class="ed_sel_ok">';
	            			wdzp_html += '<i class="ico ico22"></i>';
	            			wdzp_html += '</div></div>';
	            			wdzp_html += '<div class="vjg">';
	            			wdzp_html += '<div class="tis">'+val.tj_mc+'</div>';
	            			wdzp_html += '<div class="eds">';
	            			wdzp_html += '<i class="ico ico50 mr5" onclick="upload.editThisTj(\''+val.tj_xh+'\',\''+val.tj_mc+'\',\''+val.tj_remark+'\')"></i>';
	            			wdzp_html += '<i class="ico ico51 ml10" onclick="upload.deleteThisTj(this)"></i>';
	            			wdzp_html += '</div></div></div>';
	            			wdzp_html += '</li>';
	            		});
	            		$(".myUpImgContent").html(wdzp_html);
	            	}
	            },
	            error:function(){
	                layer.alert('查询加载失败！');
	            }
	        });
	  },
	  //加载我的消息
	  loadMyMess:function(pageIndex,pageSize,isInitialize){
		  $.ajax({
		        url:"/sjcq/mess/getCollect",    // 请求的url地址
		        type:"post",   					// 请求方式
		        dataType:"json",   				// 返回格式为json
		        async:true,						// 请求是否异步，默认为异步，这也是ajax重要特性
		        data:{
		        	page:pageIndex,
		        	pageSize:pageSize,
		        },    					// 参数值     state 0:密码登录 1:验证码登录
		        success:function(data){
		        	$("#myMess_ul").empty();    //清空原来
		        	var totalPage = data.totalPage;
		        	//initMessagePage(pageIndex,totalPage);
		        	var mess = data.rows;
					$.each(mess,function(i,item){
							
						$("#myMess_ul").append("<li><i class='ico ico65'></i><div class='misa'><span>"+item.title+"</span><span>"+item.dateAndTime+"</span></div><div class='misc'>"+item.content+"</div></li>");
					})
		        },
		        error:function(){
		            layer.alert('查询加载失败！');
		        }
		    });
	  },
	  
	  //选中图片执行操作
	  selectMyMagnumOpus:function(_thisDiv){
		    var _this=$(_thisDiv).parents("li").get(0);
			var idx=$(_this).index();
			var curID=$(_this).attr('data-picXh');
			var curLen=upload.curSelectTp.length;
			if($(_this).hasClass('cur')){
				$(_this).removeClass('cur');
				for(var i=0;i<curLen;i++){
					if(upload.curSelectTp[i]===curID){
						upload.curSelectTp.splice(i,1);
					}
				}
			}else{
				$(_this).addClass('cur');
				upload.curSelectTp.push(curID);
			}
			$('.nowSelct').text(upload.curSelectTp.length);
	  },
	
	  //删除代表作数据
	  executeDeleteTp:function(ids,type){//type 为1代表作品处，type为2 图集处，type为3我的作品处
			 layer.confirm('是否确定删除图片信息？', {
					btn : [ '确定', '取消' ]
				// 按钮
				},  function (index){
					layer.close(index);
					  var xhs="";
					  $.each(ids, function(indexNum, val) {
						  if(indexNum==0){
							  xhs=val;
						  }else{
							  xhs+=","+val;
						  }
					  });
				        $.ajax({
				           // url:"/sjcq/photoPic/logicDeleteByIds",    // 请求的url地址
				            url : "/sjcq/photoPicManage/addContributorDeleteTask",
				            type:"post",   // 请求方式
				          //  contentType : 'application/json;charset=utf-8',
				            dataType:"text",   // 返回格式为json
				            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
				            data:{xhs:xhs} ,    // 参数值     state 0:密码登录 1:验证码登录
				            success:function(data){
				            	layer.alert(data);
				            	if(type==1){				            			
				            		upload.loadMyMagnumOpus(1,pageSize,true);
				            		upload.curSelectTp=[];
				            	}else if(type==2){
				            		upload.showTjById(upload.nowTjXh,1,pageSize,true);
				            		upload.curSelectTp=[];
				            	}
				            },
				            error:function(){
				                layer.alert('查询加载失败！');
				            }
				        }); 
				});
		
	  },	 
	  //删除当前图片
	  deleteThisImg:function(_this){
		 var dataId= $($(_this).parents("li").get(0)).attr("data-picXh");
		 upload.executeDeleteTp([dataId],1);
	  },
	//删除当前图片
	  deleteThisImgForTj:function(_this){
		 var dataId= $($(_this).parents("li").get(0)).attr("data-picXh");
		 upload.executeDeleteTp([dataId],2);
	  },
	  //删除选中的图片
	  deleteSelectImgs:function(){
		  var type=$($(".myproduction").find(".cur").get(0)).attr("data")
		  if("tp"==type){
			 upload.executeDeleteTp(upload.curSelectTp,1);
		  }else if("tj"==type){
			  upload.executeDeleteTp(upload.curSelectTp,2);
		  }
	  },
	  //编辑图片
	  eidtTp:function(_this){
		  var picXh= $($(_this).parents("li").get(0)).attr("data-picXh");
		  layer.open({
			  type: 2,
			  area: ['100%', '100%'],
			  skin: 'layui-layer-rim', //加上边框
			  content: './modifyImg.html?picXh='+picXh
			});
	  },
	  //触发取消代表作品
	  cancelMagnumOpus:function(){
			 layer.confirm('确定删除代表作品吗？', {
					btn : [ '确定', '取消' ]
				// 按钮
				},  function (index){
					layer.close(index);
					  var xhs="";
					  $.each(upload.curSelectTp, function(indexNum, val) {
						  if(indexNum==0){
							  xhs=val;
						  }else{
							  xhs+=","+val;
						  }
					  });
				        $.ajax({
				            url:"/sjcq/photoPic/updatePicIsMagnumOpusStatu",    // 请求的url地址
				            type:"post",   // 请求方式
				          //  contentType : 'application/json;charset=utf-8',
				            dataType:"text",   // 返回格式为json
				            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
				            data:{type:0,picXh:xhs} ,    // 参数值     state 0:密码登录 1:验证码登录
				            success:function(data){
				            	if(data=="true"||data==true){
				            		upload.loadMyMagnumOpus(1,pageSize,true);
				            		upload.curSelectTp=[];
				            		layer.alert("删除代表作品成功！！！");
				            	}else{
				            		layer.alert("删除代表作品失败！！！");
				            	}
				            	
				            },
				            error:function(){
				                layer.alert('查询加载失败！');
				            }
				        }); 
				});
	  },
	//设置代表作品
	  setMagnumOpus:function(){
			 layer.confirm('确定设置代表作品吗？', {
					btn : [ '确定', '取消' ]
				// 按钮
				},  function (index){
					layer.close(index);
					  var xhs="";
					  $.each(upload.curSelectTp, function(indexNum, val) {
						  if(indexNum==0){
							  xhs=val;
						  }else{
							  xhs+=","+val;
						  }
					  });
				        $.ajax({
				            url:"/sjcq/photoPic/updatePicIsMagnumOpusStatu",    // 请求的url地址
				            type:"post",   // 请求方式
				          //  contentType : 'application/json;charset=utf-8',
				            dataType:"text",   // 返回格式为json
				            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
				            data:{type:1,picXh:xhs} ,    // 参数值     state 0:密码登录 1:验证码登录
				            success:function(data){
				            	if(data=="true"||data==true){
				            		layer.alert("设置代表作品成功！！！");
				            	}else{
				            		layer.alert("设置代表作品失败！！！");
				            	}
				            	
				            },
				            error:function(){
				                layer.alert('查询加载失败！');
				            }
				        }); 
				});
	  },
	  //选中图集
	  selectTjOpt:function(_thisDiv){
		//.parents("li").get(0)  .parent().parent()   .parents("li")--获取父级第一个li
	    var _this = $(_thisDiv).parents("li").get(0);
		var curID=$(_this).attr('data-tjxh');
		upload.showTjById(curID,1,pageSize,true);
	  },
	  //删除图集
	  deleteThisTj:function(_thisDiv){
		 var dataId= $($(_thisDiv).parents("li").get(0)).attr("data-tjxh");
		 layer.confirm("是否确定删除当前图集！！", {
				btn : [ '确定', '取消' ],
				title:'删除图集'
			// 按钮
			},  function (index){
				var tjObj={};
				layer.close(index);
				  var xhs="";
			        $.ajax({
			            url:"/sjcq/photoTjManage/addContributorDeleteTask",    // 请求的url地址
//			            url:"/sjcq/photoTj/logicDeleteByIds",    // 请求的url地址
			            type:"post",   // 请求方式
			          //  contentType : 'application/json;charset=utf-8',
			            dataType:"text",   // 返回格式为json
			            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
			            data: {xhs:dataId},    // 参数值     state 0:密码登录 1:验证码登录
			            success:function(data){
			            	layer.alert(data);
			            	upload.loadMytj(1,tjPageSize,true);
			            },
			            error:function(){
			                layer.alert('查询加载失败！');
			            }
			        }); 
			});
	  },
	  editThisTj:function(tjxh,tjmc,tjremark){
		  var html='<div style="height:320px;">'
			  +'<dl><dt>图集名称：</dt><dd><input type="text" class="text" value='+tjmc+' id="myTjMc" style="width: 560px;height: 30px;">'
			  +'</dd></dl><dl><dt>图集说明：</dt><dd>'
			  +'<textarea class="text" style="height:200px;width: 560px;" id="myTjRemark">'+tjremark
			  +'</textarea></dd></dl></div>';
		  layer.confirm(html, {
				btn : [ '确定', '取消' ],
				title:'编辑图集信息',
				btnAlign: 'c',
				area: ['600px', '440px'], //宽高
			// 按钮
			},  function (index){
				var tjObj={};
				tjObj.tjXh=tjxh;
				tjObj.tjMc=$("#myTjMc").val();
				tjObj.tjRemark=$("#myTjRemark").val();
				layer.close(index);
				  var xhs="";
			        $.ajax({
//			            url:"/sjcq/photoTj/editPhotoTj",    // 请求的url地址
			        	url:"/sjcq/photoTjManage/contributorTjUpdate",    // 请求的url地址
			            type:"post",   // 请求方式
			          //  contentType : 'application/json;charset=utf-8',
			            dataType:"text",   // 返回格式为json
			            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
			            data: tjObj,    // 参数值     state 0:密码登录 1:验证码登录
			            success:function(data){
			            	layer.alert(data);
			            	upload.loadMytj(1,tjPageSize,true);
			            },
			            error:function(){
			                layer.alert('查询加载失败！');
			            }
			        }); 
			});
	  },
	  /**
	   * 图集图片状态切换
	   * @param _this
	   * @param type
	   */
	  changeTJTp:function(_this,type){
		$(_this).parent().children().removeClass("cur");
		$(_this).addClass("cur");
		upload.nowTjTpStat = type;
		upload.showTjById(upload.nowTjXh,1,pageSize,true);
	  },
	  /**
	   * 展示图集信息通过图集id
	   * @param tjxh 图集序号
	   * @param pageIndex 当前页
	   * @param pageSize 每页大小
	   * @param isInitialize 是否是否初始化分页控件
	   */
		//	$('#testDiv').attr("style","display:block;");
	  showTjById:function(tjxh,pageIndex,pageSize,isInitialize){
		    
		  	upload.nowTjXh=tjxh;
		  	upload.initTjTp();
		  	$("#shelves").show();
		  	var total=0;
	        $.ajax({
	            url:"/sjcq/retriebe/findPicByTjxh",    // 请求的url地址
	            type:"post",   // 请求方式
	           // contentType : 'application/json;charset=utf-8',
	            dataType:"json",   // 返回格式为json
	            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
	            data:{pageIndex:pageIndex,pageSize:pageSize,type:1,tjxh:tjxh,isShelves:upload.nowTjTpStat} ,    // 参数值     state 0:密码登录 1:验证码登录
	            success:function(data){
	            	total=data.total;
            		if(isInitialize){
            			upload.initPages("tjtp",getPages(total,pageSize) );//total%pageSize==0?Math.ceil(total/pageSize):Math.ceil(total/pageSize)+1
            		}
	            	$(".myUpImgContent li").remove();
	            	var wdzp_html = "";
	            	$.each(data.rows,function(index,val){
	            		wdzp_html += '<li data-id="'+val.id+'" data-picxh="'+val.pic_xh+'"> ';
	            		wdzp_html += '<div class="picn">';
	            		wdzp_html += '<div class="picn_nbx" onclick="upload.selectMyMagnumOpus(this)">';
	            		wdzp_html += '<p><img src="'+index_nav.PICURI+val.pic_lylys+'"></p> ';
	            		wdzp_html += '<div class="ed_sel_ok">';
	            		wdzp_html += '<i class="ico ico22"></i>';
	            		wdzp_html += '</div></div>';
	            		wdzp_html += '<div class="vjg">';
	            		wdzp_html += '<div class="tis" style="padding:0 120px 0 10px;">'+val.pic_mc+'</div>';
	            		wdzp_html += '<div class="eds">';
	            		wdzp_html += '<i class="ico ico49 " onclick="upload.setCover(\''+val.pic_xh+'\',\''+val.tj_xh+'\')"></i>';
	            		wdzp_html += '<i class="ico ico52 ml10" onclick="in_search.imgJump(\''+val.pic_xh+'\')"></i>';
	            		wdzp_html += '<i class="ico ico50 ml10" onclick="upload.eidtTp(this)"></i>';
	            		wdzp_html += '<i class="ico ico51 ml10" onclick="upload.deleteThisImgForTj(this)"></i>';
	            		wdzp_html += '</div></div></div>';
	            		wdzp_html += '</li>';
	            	});
	            	$(".myUpImgContent").html(wdzp_html);
	            },
	            error:function(){
	                layer.alert('查询加载失败！');
	            }
	        }); 
	  },
	  returnTj:function(){
			upload.initTj();
			upload.loadMytj(1,tjPageSize,true);
	  },
	  //设置图集封面信息
	  setCover:function(picXh,tjXh){
		  layer.confirm('是否确认修改图集封面！', {
				btn : [ '确定', '取消' ],
				title:'编辑图集封面信息'
			// 按钮
			},  function (index){
				layer.close(index);
				 $.ajax({
			            url:"/sjcq/photoTj/setTjCover",    // 请求的url地址
			            type:"post",   // 请求方式
			           // contentType : 'application/json;charset=utf-8',
			            dataType:"json",   // 返回格式为json
			            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
			            data:{picXh:picXh,tjXh:tjXh} ,    // 参数值     state 0:密码登录 1:验证码登录
			            success:function(data){
			            	if(data==true||data=='true'){
			            		layer.alert('设置封面成功！');
			            		upload.initTj();
			            		upload.loadMytj(1,tjPageSize,true);
			            	}else{
			            		 layer.alert('设置封面失败！');
			            	}
			            },
			            error:function(){
			                layer.alert('系统异常！');
			            }
			        }); 
			});
		 
		  
		  
	  }
	  ,
	  shelvesUp:function(){
		  var html="<div>"
			  +"<dl><dt>图片价格：</dt><dd><input type=\"text\" class=\"text\" value='' " +
			  		"id=\"picPrice\" onkeyup=\"if(!/^\\d+(\\.\\d{0,2})?$/.test(this.value)){this.value='';}\"" +
			  		" onafterpaste=\"if(!/^\\d+(\\.\\d{0,2})?$/.test(this.value)){this.value='';}\"   value='请输入图片价格' />￥（元）"
			  +"</dd></dl></div>";
			 layer.confirm(html, {
					btn : [ '确定', '取消' ],
					title:'设置图片价格',
					btnAlign: 'c',
					area: ['300px', '200px'], //宽高
				// 按钮
				},  function (index){
					layer.close(index);
					var picXh="";
					if($("#picPrice").val()=='请输入图片价格'||$("#picPrice").val()==''){
						alert("请输入图片价格");
						return ;
					}
					$.each(upload.curSelectTp,function(index,val){
						if(index==0){
							picXh=val;
						}else{
							picXh+=","+val;
						}
					});
				        $.ajax({
				            url:"/sjcq/photoPic/picShelvesUp",    // 请求的url地址
				            type:"post",   // 请求方式
				           // contentType : 'application/json;charset=utf-8',
				            dataType:"text",   // 返回格式为json
				            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
				            data:{picXh:picXh,picPices:$("#picPrice").val()} ,    // 参数值     state 0:密码登录 1:验证码登录
				            success:function(data){
				            	layer.alert(data);
				            },
				            error:function(){
				                layer.alert('查询加载失败！');
				            }
				        }); 
				});
	  
	  },
	  shelvesDown:function(){
			 layer.confirm('确定将选中的图片下架吗？', {
					btn : [ '确定', '取消' ]
				// 按钮
				},  function (index){
					layer.close(index);
				        $.ajax({
				            url:"/sjcq/photoPic/picShelvesDown",    // 请求的url地址
				            type:"post",   // 请求方式
				            contentType : 'application/json;charset=utf-8',
				            dataType:"text",   // 返回格式为json
				            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
				            data:JSON.stringify(upload.curSelectTp) ,    // 参数值     state 0:密码登录 1:验证码登录
				            success:function(data){
				            	layer.alert(data);
				            },
				            error:function(){
				                layer.alert('查询加载失败！');
				            }
				        }); 
				});
	  
	  },
	  showContract:function(){
		  layer.open({
			  type: 2,
			  area: ['100%', '100%'],
			  skin: 'layui-layer-rim', //加上边框
			  content: './contract.html'
			});
	  }
};



