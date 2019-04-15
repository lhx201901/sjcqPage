var PARAM;
var MODULEID_;
var picXh;
var IFRAMEID_="";
var MAIN_PAGE_WINDOW={};
$(function(){
	PARAM = GetParamByRequest();
	MODULEID_ = PARAM.MODULEID_;
	picXh = PARAM.picXh;
	laydate.render({
		  elem: '#picSysj' //开始日期
		});
	modifyImg.init();
	modifyImg.setHeight();
	MAIN_PAGE_WINDOW = parent.document.getElementById("tab_frame_"+PARAM.MAIN_PAGE_ID_).contentWindow;
	IFRAMEID_="tab_seed_"+PARAM.tabId;
});

var modifyImg={
		//图片分类缓存数据,避免重复请求
		picTypeObj:{},
		paramObj:{},
		picObj:{},
		init:function(){
			modifyImg.paramObj=modifyImg.hrefObj();
			modifyImg.loadData();
		},
		setHeight:function (){
			setIframeHeight("picInfo", MODULEID_);
		},
		hrefObj:function() {
			var localhref = window.location.href;
			var localarr = localhref.split('?')[1].split('&');
			var tempObj = {};
			for (var i = 0; i < localarr.length; i++) {
			   tempObj[localarr[i].split('=')[0]] = localarr[i].split('=')[1];
			}
		  return tempObj;
		},
		//追加子分类数据
		appendPicSort:function(data,sortPxh){
        		var options='<option selected=selected>选择分类</option>';
        		for(var i=0;i< data.length;i++){
        			options=options+'<option value="'+data[i].sortXh+'">'+data[i].sortName+'</option>'
        		}
        		$("#contentUploadPicSort").append(
        			'<div class="img_sel" data-level="'+data[0].sortLevels+'" data-sortpxh="'+sortPxh+'">'
        				+'<select class="sct" onchange=modifyImg.selectPicSort(this,'+data[0].sortLevels+',\''+sortPxh+'\') >'
        					+options
        				+'</select> '
        				+'<i class="ico ico60"></i>'
        			+'</div>'	
        		);
        	
		},
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
	            		modifyImg.picTypeObj[sortpxh]=data;
	            		modifyImg.appendPicSort(data,sortpxh);
	            	}
	            },
	            error:function(){
	            	$box.promptBox('查询加载失败！');
	            }
	        });
		},
		loadData:function(){
		    $.ajax({
		        url:"/sjcq/photoPic/findByPicXh",    // 请求的url地址
		        type:"post",   //请求方式
		       // contentType : 'application/json;charset=utf-8',
		        dataType:"json",   // 返回格式为json
		        async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
		        data:{picXh:picXh} ,    // 参数值     state 0:密码登录 1:验证码登录
		        success:function(data){
		        	if(data.pic){
		        		modifyImg.picObj.picXh=data.pic.picXh;
		    			$("#contentUploadPicSort .img_sel").remove();
		    			if(data.pic!=null&&data.pic!=undefined){
		    				$("#picLyljm").attr("src",index_nav.PICURI+data.pic.picLyljm);
		    				$("#picMc").val(data.pic.picMc);
		    				$("#picRemark").val(data.pic.picRemark);
		    				$("#picFRemark").val(data.pic.picFRemark);
		    				$("#picDd").val(data.pic.picDd);
		    				$("#picSyz").val(data.pic.picSyz);
		    				$("#picSysj").val(data.pic.picSysj==null?"":modifyImg.timecheck(data.pic.picSysj));
		    				$("#picGjz").val(data.pic.picGjz);
		    				$("#picType option[value='"+data.pic.picType+"']").prop("selected", true);
		    				$("#picMj option[value='"+data.pic.picMj+"']").prop("selected", true);
		    				//加载选中图片分类
		    				var sortXhs=[];
		    				if(data.pic.typeOne){
		    					var sortObj={};
		    					sortObj.sortXh="0"+data.pic.typeOne;
		    					sortObj.sortPxh='0';
		    					sortObj.level=1;
		    					sortXhs.push(sortObj);
		    					if(data.pic.typeTwo){
		    						sortObj={};
		    						sortObj.sortXh="0"+data.pic.typeOne+data.pic.typeTwo;
			    					sortObj.sortPxh="0"+data.pic.typeOne;
			    					sortObj.level=2;
			    					sortXhs.push(sortObj);
			    					if(data.pic.typeThree){
			    						sortObj={};
			    						sortObj.sortXh="0"+data.pic.typeOne+data.pic.typeTwo+data.pic.typeThree;
				    					sortObj.sortPxh="0"+data.pic.typeOne+data.pic.typeTwo;
				    					sortObj.level=3;
				    					sortXhs.push(sortObj);
				    					if(data.pic.typeFour){
				    						sortObj={};
				    						sortObj.sortXh="0"+data.pic.typeOne+data.pic.typeTwo+data.pic.typeThree+data.pic.typeFour;
					    					sortObj.sortPxh="0"+data.pic.typeOne+data.pic.typeTwo+data.pic.typeThree;
					    					sortObj.level=4;
					    					sortXhs.push(sortObj);
					    					if(data.pic.typeFive){
					    						sortObj={};
					    						sortObj.sortXh="0"+data.pic.typeOne+data.pic.typeTwo+data.pic.typeThree+data.pic.typeFour+data.pic.typeFive;
						    					sortObj.sortPxh="0"+data.pic.typeOne+data.pic.typeTwo+data.pic.typeThree+data.pic.typeFour;
						    					sortObj.level=5;
						    					sortXhs.push(sortObj);
					    					}
				    					}
			    					}
		    					}
		    				}
		    				console.log(sortXhs);
		    				/**
		    				 * 分类最初未选择时不能重新输入分类
		    				 */
		    				if(sortXhs.length>0){
		    					$.each(sortXhs,function(index,item){
		    						var options='<option>选择分类</option>';
		    						//如果缓存为空则执行请求加载分类数据
		    						$.ajax({
		    							url:"/sjcq/manage/picSort/findBySortPxh",    // 请求的url地址
		    							type:"post",   // 请求方式
		    							dataType:"json",   // 返回格式为json
		    							async:false,// 请求是否异步，默认为异步，这也是ajax重要特性
		    							data:{sortPxh:item.sortPxh} ,    // 参数值     state 0:密码登录 1:验证码登录
		    							success:function(data){
		    								if(data!=null&&data!=undefined&&data.length>0){
		    									modifyImg.picTypeObj=data;
		    								}
		    							},
		    							error:function(){
		    								$box.promptBox('查询加载失败！');
		    							}
		    						});
		    						console.log(modifyImg.picTypeObj);
		    						
		    						//加载下拉选项
		    						$.each( modifyImg.picTypeObj,function(index1,item1){
		    							if(item1.sortXh==item.sortXh){
		    								options=options+'<option selected=selected value="'+item1.sortXh+'">'+item1.sortName+'</option>'
		    							}else{
		    								options=options+'<option  value="'+item1.sortXh+'">'+item1.sortName+'</option>'
		    							}
		    			        			
		    						})
		    		        		$("#contentUploadPicSort").append(
		    			        			'<div class="img_sel" data-level="'+item.level+'" data-sortpxh="'+item.sortPxh+'">'
		    			        				+'<select class="sct" onchange=modifyImg.selectPicSort(this,'+item.level+',\''+item.sortPxh+'\') >'
		    			        					+options
		    			        				+'</select> '
		    			        				+'<i class="ico ico60"></i>'
		    			        			+'</div>'	
		    			        	);
		    					})
		    				}else{
		    					var options='<option>选择分类</option>';
		    					 $.ajax({
	    					            url:"/sjcq/manage/picSort/findBySortPxh",    // 请求的url地址
	    					            type:"post",   // 请求方式
	    					            dataType:"json",   // 返回格式为json
	    					            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
	    					            data:{sortPxh:0} ,    // 参数值     state 0:密码登录 1:验证码登录
	    					            success:function(data){
	    					            	//加载下拉选项
	    		    						$.each( data,function(index1,item1){
	    		    							options=options+'<option  value="'+item1.sortXh+'">'+item1.sortName+'</option>'
	    		    			        			
	    		    						})
	    		    		        		$("#contentUploadPicSort").append(
	    		    			        			'<div class="img_sel" data-level="1" data-sortpxh="0">'
	    		    			        				+'<select class="sct" onchange=modifyImg.selectPicSort(this,1,0) >'
	    		    			        					+options
	    		    			        				+'</select> '
	    		    			        				+'<i class="ico ico60"></i>'
	    		    			        			+'</div>'	
	    		    			        	);
	    					            },
	    					            error:function(){
	    					            	$box.promptBox('查询加载失败！');
	    					            }
	    					        });
		    				}
		    			}else{
		    				$("#contentUploadPicSort .img_sel").remove();
		    				this.picSortLoad(0);//加载初始图片分类
		    			}
		        	}else{
		        		$box.promptBox('查询加载失败！');
		        	}
		        },
		        error:function(){
		        	$box.promptBox('查询加载失败！');
		        }
		    }); 
		},
		saveModifyInmg:function(){
			var obj={};
			modifyImg.picObj.picMc=$("#picMc").val();
			modifyImg.picObj.picRemark=$("#picRemark").val();
			modifyImg.picObj.picFRemark=$("#picFRemark").val();
			modifyImg.picObj.picDd=$("#picDd").val();
			modifyImg.picObj.picSyz=$("#picSyz").val();
			if($("#picSysj").val()&&$("#picSysj").val().length>0){
			//	alert($("#picSysj").val());
				modifyImg.picObj.picSysj=new Date($("#picSysj").val().trim());
			}
			modifyImg.picObj.picGjz=$("#picGjz").val();
			modifyImg.picObj.picMj=$("#picMj").val();
			modifyImg.picObj.picType=$("#picType").val();
			modifyImg.picObj.typeOne="";
			modifyImg.picObj.typeTwo="";
			modifyImg.picObj.typeThree="";
			modifyImg.picObj.typeFour="";
			modifyImg.picObj.typeFive="";
			var contentUploadPicSort= [];
			console.log($("#contentUploadPicSort"));
			$.each($("#contentUploadPicSort").find(".sct"),function(index,item){
				console.log();
				if($(item).parent().attr("data-level")==1&&$(item).val()!='选择分类'){
					modifyImg.picObj.typeOne=$(item).find("option:selected").text();
				}else if($(item).parent().attr("data-level")==2&&$(item).val()!='选择分类'){
					modifyImg.picObj.typeTwo=$(item).find("option:selected").text();
				}else if($(item).parent().attr("data-level")==3&&$(item).val()!='选择分类'){
					modifyImg.picObj.typeThree=$(item).find("option:selected").text();
				}else if($(item).parent().attr("data-level")==4&&$(item).val()!='选择分类'){
					modifyImg.picObj.typeFour=$(item).find("option:selected").text();
				}else if($(item).parent().attr("data-level")==5&&$(item).val()!='选择分类'){
					modifyImg.picObj.typeFive=$(item).find("option:selected").text();
				}
			})
			$box.promptSureBox("是否确定修改图片信息！！", 'modifyImg.updatePic', "");
		},
		updatePic:function(){
			//修改图片信息
			 $.ajax({
		            url:"/sjcq/photoPicManage/addUpdateTask",    // 请求的url地址
		            dataType:"json",   // 返回格式为json
		            type:"post",   // 请求方式
		           // async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
		            data: modifyImg.picObj ,    // 参数值     state 0:密码登录 1:验证码登录
		            success:function(data){
		            	$box.promptBox(data.resultInfo);
		            	$('#myModal').on('hidden.bs.modal', function () {
		            		parent.closableTab.closeThisTab(PARAM.tabId);
		            		console.log(MAIN_PAGE_WINDOW);
							MAIN_PAGE_WINDOW.searchAuditData();
					    });
		            },
		            error:function(){
		            	$box.promptBox('系统异常！');
		            }
		        });
		
		
		},
		closeThisWindow:function(){
			//console.log(layer.index);
			var index=parent.layer.getFrameIndex(window.name);
			parent.layer.close(index);
		},
		selectPicSort:function(_this,sortLevels,sortpxh){
			if(undefined==$(_this).val()||null==$(_this).val()||''==$(_this).val()){
				return false;
			}
			$(_this).parent().nextAll('.img_sel').remove();
			modifyImg.picSortLoad($(_this).val());
		},
		timecheck:function (timestamp) {
			var term=Number(timestamp);
		    var date = new Date(term);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
		    var Y = date.getFullYear() + '-';
		    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
		    var D = date.getDate() + ' ';
		    var h = date.getHours() + ':';
		    var m = date.getMinutes() + ':';
		    var s = date.getSeconds();
		    //return Y+M+D+h+m+s;
		    return Y+M+D;
		}
		
		,
		/**************************************时间格式化处理************************************/
		dateFtt :function(fmt, date) { //author: meizz   
			var o = {
				"M+" : date.getMonth() + 1, //月份   
				"d+" : date.getDate(), //日   
				"h+" : date.getHours(), //小时   
				"m+" : date.getMinutes(), //分   
				"s+" : date.getSeconds(), //秒   
				"q+" : Math.floor((date.getMonth() + 3) / 3), //季度   
				"S" : date.getMilliseconds()
			//毫秒   
			};
			if (/(y+)/.test(fmt))
				fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
			for ( var k in o)
				if (new RegExp("(" + k + ")").test(fmt))
					fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			return fmt;
		}

		
}

