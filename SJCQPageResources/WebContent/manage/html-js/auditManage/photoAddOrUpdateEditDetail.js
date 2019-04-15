/**
 * 图片详情
 */
/**
 * 编辑区县信息
 * author cl
 */
var PARAM={}; //前一个页面传递的参数对象
var MAIN_PAGE_WINDOW = {};//前一个页面对象
var IFRAMEID_="";//当前iframid
var taskXh="";
var MODULEID_="";
var dataType="";
var url="";
var updateType="";
var picTypeObj={};
var taskId="";
var manageState="";
$(document).ready(function(){
	checksessoin();
	PARAM= GetParamByRequest();
	IFRAMEID_="tab_seed_"+PARAM.tabId;
	AREAID_ = PARAM.areaId;
	OPTTYPE=PARAM.optType;
	MAIN_PAGE_WINDOW = parent.document.getElementById("tab_frame_"+PARAM.MAIN_PAGE_ID_).contentWindow;
	MODULEID_ = PARAM.MODULEID_;
	taskXh = PARAM.taskXh;
	taskId = PARAM.taskId;
	updateType=PARAM.updateType;
	manageState=PARAM.manageState;
	if(updateType!=undefined&&updateType==1){
		$("#middleContent").hide();
		$("#middleContent0").hide();
	}
	if(manageState!=undefined && manageState==2){//待审核
		$("#middleContent2").hide();
		$("#middleContent22").hide();
	}
	dataType=PARAM.dataType;
	var h= $("#person_info_content").height();
	setIframeHeight2(PARAM.tabId,h);
	if(dataType=="tj"){//显示图集信息
		$("#tj_pic_list").show();
		$("#tj_info").show();
		$("#pic_info").hide();
		url="/sjcq/photoTjManage/findByTaskXhAndType";
		searchBasicInfo();
	}else{//显示图片信息
		$("#tj_pic_list").hide();
		$("#tj_info").hide();
		$("#pic_info").show();
		url="/sjcq/photoPicManage/findByTaskXhAndType";
		searchBasicInfo();
	}
	laydate.render({
		  elem: '#picSysj' //开始日期
	});
	laydate.render({
		  elem: '#picSysjOld' //开始日期
	});
});
//获取基本信息
function searchBasicInfo(){
	$.ajax({
		url : url, // 请求的url地址
		type : "post", // 请求方式
		dataType : "json", // 返回格式为json
		async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {
			taskXh : taskXh
		}, // 参数值
		success : function(data) {
			console.log(data);
			if(data.pic!=null){				
				if(dataType=="tj"){//显示图集信息
					search_tj_img(data.pic.tjXh);
					$("#tjLyljm").attr("src",index_nav.PICURI+data.pic.tjFmlj);
					var selfPic=data.selfpic;
					$("#tjMc").val(selfPic.tjMc);
    				$("#tjRemark").val(selfPic.tjRemark);
					var pic = data.secondpic;
					$("#tjMcOld").val(pic.tjMc);
    				$("#tjRemarkOld").val(pic.tjRemark);
    				var endpic = data.endpic;
					$("#tjXh").val(endpic.tjXh);
					$("#tjMcEnd").val(endpic.tjMc);
    				$("#tjRemarkEnd").val(endpic.tjRemark);
				}else{//pic
					$("#picLyljm").attr("src",index_nav.PICURI+data.pic.picLyljm);
					var selfPic=data.selfpic;
					$("#picMc").val(selfPic.picMc);
    				$("#picRemark").val(selfPic.picRemark);
    				$("#picFRemark").val(selfPic.picFRemark);
    				$("#picDd").val(selfPic.picDd);
    				$("#picSyz").val(selfPic.picSyz);
    				$("#picSysj").val(selfPic.picSysj==null?"":timecheck(selfPic.picSysj));
    				$("#picGjz").val(selfPic.picGjz);
    				$("#picType option[value='"+selfPic.picType+"']").prop("selected", true);
    				$("#picMj option[value='"+selfPic.picMj+"']").prop("selected", true);
    				initSort(selfPic,"contentUploadPicSort");
    				var pic = data.secondpic;
    				$("#picMcOld").val(pic.picMc);
    				$("#picRemarkOld").val(pic.picRemark);
    				$("#picFRemarkOld").val(pic.picFRemark);
    				$("#picDdOld").val(selfPic.picDd);
    				$("#picSyzOld").val(pic.picSyz);
    				$("#picSysjOld").val(pic.picSysj==null?"":timecheck(pic.picSysj));
    				$("#picGjzOld").val(pic.picGjz);
    				$("#picTypeOld option[value='"+pic.picType+"']").prop("selected", true);
    				$("#picMjOld option[value='"+pic.picMj+"']").prop("selected", true);
    				initSort(pic,"contentUploadPicSortOld");
    				var endpic = data.endpic;
    				$("#picXh").val(endpic.picXh);
    				$("#picMcEnd").val(endpic.picMc);
    				$("#picRemarkEnd").val(endpic.picRemark);
    				$("#picFRemarkEnd").val(endpic.picFRemark);
    				$("#picDdEnd").val(endpic.picDd);
    				$("#picSyzEnd").val(endpic.picSyz);
    				$("#picSysjEnd").val(endpic.picSysj==null?"":timecheck(endpic.picSysj));
    				$("#picGjzEnd").val(endpic.picGjz);
    				$("#picTypeEnd option[value='"+endpic.picType+"']").prop("selected", true);
    				$("#picMjEnd option[value='"+endpic.picMj+"']").prop("selected", true);
    				initSort(endpic,"contentUploadPicSortEnd");
				}
			}
		},
		error : function() {
			layer.msg('查询加载失败！');
		}
	})
}
/**
 * 保存修改信息
 */
var obj={};
function taskSubmit(){
	var url="";
	obj.auditUUID=taskXh;
	if(dataType=="tj"){
		obj.tjMc = $("#tjMcEnd").val();
		obj.tjRemark=$("#tjRemarkEnd").val();
		url="/sjcq/photoTjManage/picUpdateAudit";
	}else{
		obj.picMc=$("#picMcEnd").val();
		obj.picRemark=$("#picRemarkEnd").val();
		obj.picFRemark=$("#picFRemarkEnd").val();
		obj.picDd=$("#picDdEnd").val();
		obj.picSyz=$("#picSyzEnd").val();
		if($("#picSysjEnd").val()&&$("#picSysjEnd").val().length>0){
		//	alert($("#picSysj").val());
			obj.picSysj=new Date($("#picSysjEnd").val().trim());
		}
		obj.picGjz=$("#picGjzEnd").val();
		obj.picMj=$("#picMjEnd").val();
		obj.picType=$("#picTypeEnd").val();
		obj.typeOne="";
		obj.typeTwo="";
		obj.typeThree="";
		obj.typeFour="";
		obj.typeFive="";
		var contentUploadPicSort= [];
		console.log($("#contentUploadPicSort"));
		$.each($("#contentUploadPicSortEnd").find(".sct"),function(index,item){
			console.log();
			if($(item).parent().attr("data-level")==1&&$(item).val()!='选择分类'){
				obj.typeOne=$(item).find("option:selected").text();
			}else if($(item).parent().attr("data-level")==2&&$(item).val()!='选择分类'){
				obj.typeTwo=$(item).find("option:selected").text();
			}else if($(item).parent().attr("data-level")==3&&$(item).val()!='选择分类'){
				obj.typeThree=$(item).find("option:selected").text();
			}else if($(item).parent().attr("data-level")==4&&$(item).val()!='选择分类'){
				obj.typeFour=$(item).find("option:selected").text();
			}else if($(item).parent().attr("data-level")==5&&$(item).val()!='选择分类'){
				obj.typeFive=$(item).find("option:selected").text();
			}
		})
		url="/sjcq/photoPicManage/picUpdateAudit";
	}
	//提交审核
	var html='<table style="text-align:center;"><tr><td>审核状态：</td><td><select id="isPass"><option value="1">审核通过</option><option value="0">审核不通过</option></select></td>'
		+'</tr><tr><td>审核备注：</td><td><textarea class="text" placeholder="填写审核备注" id="Remark" style="height:100px"></textarea></td></tr><tr><td colspan="2"><span style="color:red;">*审核提交后数据将以当前修改后的数据为准</span></td></tr></table>';
	$box.promptSureBox(html, "sureSubmit", url,"审核提交")
}
function sureSubmit(url_){
	console.log(1);
	console.log(obj);
	alert(taskId);
	obj.taskId=taskId;
	obj.isPass =$("#isPass").val();
	obj.remark=$("#Remark").val();
	$.ajax({
		url : url_, // 请求的url地址
		type : "post", // 请求方式
		dataType : "json", // 返回格式为json
		async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : obj, // 参数值
		success : function(data) {
			$box.promptBox(data.resultInfo);
			if(data.resultStatus==true || data.resultStatus=="true"){		
				$('#myModal').on('hidden.bs.modal', function () {
					parent.closableTab.closeThisTab(PARAM.tabId);
					MAIN_PAGE_WINDOW.searchAuditData();
				});
			}
		},
		error : function() {
			layer.msg('查询加载失败！');
		}
	})

}
function search_tj_img(uuid){
    //获取图片列表
    var jsonstring = JSON.stringify({table:"d_photo_pic",term:"",tj_xh:uuid});
    in_search.search(1,100,"id","desc",jsonstring,function(data){
        console.log(data);
        var html = "";
        $(data.rows).each(function(i,row){
            html = html + '<li data-id="'+row.pic_jg+'">';
            html = html + '<div class="picn">';
            html = html + '<div class="picn_nbx">';
            html = html + '<p ><img src="'+index_nav.PICURI+row.pic_lylys+'"></p>';//onclick="photoDetail.search_img(\''+row.pic_xh+'\')"
            html = html + '<div class="ed_sel_ok"><i class="ico ico22"></i></div>';
            html = html + '</div>';
            html = html + '<div class="vjg">￥'+row.pic_jg+'</div>';
            html = html + '</div>';
            html = html + '</li>';   
        })
        $("#tj_pic").html(html);
    });
}
function appendPicSort(data,sortPxh,divId){
	var options='<option selected=selected>选择分类</option>';
	for(var i=0;i< data.length;i++){
		options=options+'<option value="'+data[i].sortXh+'">'+data[i].sortName+'</option>'
	}
	$("#"+divId).append(
		'<div class="img_sel" data-level="'+data[0].sortLevels+'" data-sortpxh="'+sortPxh+'">'
			+'<select class="sct" onchange=selectPicSort(this,'+data[0].sortLevels+',\''+sortPxh+'\',\''+divId+'\') >'
				+options
			+'</select> '
			+'<i class="ico ico60"></i>'
		+'</div>'	
	);

}
function picSortLoad(sortpxh,divId){
	var sortData= this.picTypeObj[sortpxh];
	if(sortData!=null||sortData!=undefined){
		this.appendPicSort(sortData,sortpxh,divId);
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
	    		picTypeObj[sortpxh]=data;
	    		appendPicSort(data,sortpxh,divId);
	    	}
	    },
	    error:function(){
	    	$box.promptBox('查询加载失败！');
	    }
	});
}
function timecheck(timestamp) {
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
function selectPicSort(_this,sortLevels,sortpxh,divId){
	if(undefined==$(_this).val()||null==$(_this).val()||''==$(_this).val()){
		return false;
	}
	$(_this).parent().nextAll('.img_sel').remove();
	picSortLoad($(_this).val(),divId);
}
/**
 * 初始化分类
 */
function initSort(data,divId){

	console.log(data);
	console.log(divId);
	//加载选中图片分类
	var sortXhs=[];
	if(data.typeOne){
		var sortObj={};
		sortObj.sortXh="0"+data.typeOne;
		sortObj.sortPxh='0';
		sortObj.level=1;
		sortXhs.push(sortObj);
		if(data.typeTwo){
			sortObj={};
			sortObj.sortXh="0"+data.typeOne+data.typeTwo;
			sortObj.sortPxh="0"+data.typeOne;
			sortObj.level=2;
			sortXhs.push(sortObj);
			if(data.typeThree){
				sortObj={};
				sortObj.sortXh="0"+data.typeOne+data.typeTwo+data.typeThree;
				sortObj.sortPxh="0"+data.typeOne+data.typeTwo;
				sortObj.level=3;
				sortXhs.push(sortObj);
				if(data.typeFour){
					sortObj={};
					sortObj.sortXh="0"+data.typeOne+data.typeTwo+data.typeThree+data.typeFour;
					sortObj.sortPxh="0"+data.typeOne+data.typeTwo+data.typeThree;
					sortObj.level=4;
					sortXhs.push(sortObj);
					if(data.typeFive){
						sortObj={};
						sortObj.sortXh="0"+data.typeOne+data.typeTwo+data.typeThree+data.typeFour+data.typeFive;
    					sortObj.sortPxh="0"+data.typeOne+data.typeTwo+data.typeThree+data.typeFour;
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
						picTypeObj=data;
					}
				},
				error:function(){
					$box.promptBox('查询加载失败！');
				}
			});
			console.log(picTypeObj);
			
			//加载下拉选项
			$.each( picTypeObj,function(index1,item1){
				if(item1.sortXh==item.sortXh){
					options=options+'<option selected=selected value="'+item1.sortXh+'">'+item1.sortName+'</option>'
				}else{
					options=options+'<option  value="'+item1.sortXh+'">'+item1.sortName+'</option>'
				}
        			
			})
    		$("#"+divId).append(
        			'<div class="img_sel" data-level="'+item.level+'" data-sortpxh="'+item.sortPxh+'">'
        				+'<select class="sct" onchange=selectPicSort(this,'+item.level+',\''+item.sortPxh+'\',\''+divId+'\') >'
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
	        		$("#"+divId).append(
		        			'<div class="img_sel" data-level="1" data-sortpxh="0">'
		        				+'<select class="sct" onchange=selectPicSort(this,1,0,\''+divId+'\') >'
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
}
