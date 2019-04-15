/**
 * 图片信息审核管理页js
 */
var MODULEID_;// 模块id序号
var PARAM={};
var tjXh="";
var opType="";
$(document).ready(function() {
	PARAM = GetParamByRequest();
	MODULEID_=PARAM.MODULEID_;
	tjXh=PARAM.tjXh
	opType=PARAM.type;
	if(opType=="addBrocastCover"){//轮播封面
		$("#buttonDiv input").hide();
	}else if(opType=="addBrocast"){//轮播链接
		$("#buttonDiv input").hide();
		$("#batchAddBrocast").show();
	}else if(opType=="addEditSelect"){//编辑精选
		$("#buttonDiv input").hide();
		$("#batchAddEditSelect").show();
	}else if(opType=="addEvent"){//活动
		$("#buttonDiv input").hide();
		$("#batchAddEvent").show();
	}else if(opType=="addArea"){//区县
		$("#buttonDiv input").hide();
		$("#batchAddArea").show();
	}
	checksessoin();
	MODULEID_ = GetParamByRequest().MODULEID_;
	initTable();
});

/**
 * 获取参数
 * @returns
 */
function getParams(){
	//var searchWord = $("#searchName").val();
    var re_searchWord_array=[];
    var searchName="";
   /* if(searchWord.length>0){
        var searchWord_array=searchWord.split(" ");
        searchWord_array.remove("");
        searchName= searchWord_array.join("@#@");
    }else{
    	searchName="";
    }*/
	var jsonstring = JSON.stringify({table:"d_photo_pic",term:"","type_one":"","type_two":"","tj_xh":tjXh});
	return jsonstring;
}
/**
 * 初始化表格
 */
function initTable() {
	//var searchWord=getParams();
	$('#pictureDataTable').bootstrapTable({
		url : "/sjcq/retriebe/allSolrSearch", // 请求后台的URL（*）
		classes : "table table-no-bordered",
		striped : true, // 是否显示行间隔色
		pagination : true, // 是否显示分页（*）
		sortable : false, // 是否启用排序
		method : "post",
		contentType : "application/x-www-form-urlencoded; charset=UTF-8",
		sortOrder : "asc", // 排序方式
		sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
		queryParamsType : "",
		queryParams : function(params) {
			var param = {
					searchWord :getParams(),
					pageIndex : params.pageNumber,
					pageSize : params.pageSize,
					orderField:"pic_scsj",
					orderType:"desc"
			};
			return param;
		},
		// strictSearch:true,//设置为 true启用 全匹配搜索，否则为模糊搜索
		// searchOnEnterKey:true,
		maintainSelected : true,// 设置为 true 在点击分页按钮或搜索按钮时，将记住checkbox的选择项
		clickToSelect : true,// 设置true 将在点击行时，自动选择rediobox 和 checkbox
		// showPaginationSwitch:true,
		// showColumns:true,
		selectItemName : "checdd",
		// search:true,
		pageNumber : 1, // 初始化加载第一页，默认第一页
		pageSize : 10, // 每页的记录行数（*）
		pageList : [ 5, 10, 50, 100 ], // 可供选择的每页的行数（*）
		smartDisplay : false,
		strictSearch : false,
		// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
		uniqueId : "id", // 每一行的唯一标识，一般为主键列
		cardView : false, // 是否显示详细视图
		detailView : false, // 是否显示父子表
		/*onDblClickRow : function(row) {
			searchInfo(row.id);
		},*/
		onLoadSuccess : setHeight,
		columns : [ {
			field : 'checdd',
			checkbox : true
		},{// 表格结构配置
			title : "图片",// 列title文字
			field : "pic_lylys",// 该列对应数据哪个字段
			width : "10%",// 列宽度设置,不设也没什么
			align:'center',
			formatter : function(value, row, index) {
				var html ="";
				html+='<div class="hill_img"><div class="hl_img"><img onclick=clickOne(\''+row.pic_lyljm+'\') ondblclick="clickdbl(\''+row.pic_xh+'\')" src="'+PICURI+row.pic_lylys+'"></div></div>';
				console.log(html);
				return html;
			}
		}, {
			field : 'pic_INFO',
			title : '图片信息',
			width:'45%',
			align:'left',
			formatter : function(value, row, index){
				var html ="";
				html+='<p><span style="font-weight: bold;">标题：</span>'+row.pic_mc+'</p>';
				html+='<p><span style="font-weight: bold;">作者：</span>'+row.pic_scz+'</p>';
				if(row.pic_remark!=null&&row.pic_remark.length>50){
					html+='<p><span style="font-weight: bold;">主说明：</span>'+row.pic_remark.substring(0,50)+'</p>';
				}else{
					html+='<p><span style="font-weight: bold;">主说明：</span>'+row.pic_remark+'</p>';
				}
				if(row.picfremark!=null&&row.picfremark.length>50){
					html+='<p><span style="font-weight: bold;">分说明：</span>'+row.picfremark.substring(0,50)+'</p>';
				}else{
					html+='<p><span style="font-weight: bold;">分说明：</span>'+row.picfremark+'</p>';
				}
				return html;
			}
			
		}, {
			field : 'pic_jg',
			title : '图片价格',
			width:'8%',
			align:'center',
			formatter : function(value, row, index){
				if(row.pic_jg==null || row.pic_jg ==undefined || row.pic_jg=='null'){
					return "";
				}else{
					return "￥"+row.pic_jg;
				}
			}
		}, {
			field : 'pic_mj',
			title : '图片密级',
			align : 'center',
			width:'5%',
			formatter : function(value, row, index) {
				var text = "";
				if (row.pic_mj == 0) {
					text = "非公开";
				} else if (row.pic_mj == 1) {
					text = "公开";
				}
				return text;
			}
		}, {
			field : 'is_shelves',
			title : '上架状态',
			align : 'center',
			width:'5%',
			formatter : function(value, row, index) {
				var text = "";
				if (row.is_shelves == 0) {
					text = "下架";
				} else if (row.is_shelves == 1) {
					text = "上架";
				}
				return text;
			}
		},{
			field : 'pic_scsj',
			title : '上传时间',
			formatter : function(value, row, index) {
				if (row.pic_scsj!= null && row.pic_scsj!= 'null') {
					return new Date(new Date(row.pic_scsj)).format("yyyy-MM-dd hh:mm:ss");
				} else {
					return "";
				}

			},
			width:'10%',
			align : 'center'
		} /*, {
			field : 'in_audit',
			title : '是否在审核中',
			align : 'center',
			width:'7%',
			formatter : function(value, row, index) {
				var text = "";
				if (row.in_audit == 0) {
					text = "否";
				} else if (row.in_audit == 1) {
					text = "是";
				}
				return text;
			}
		},{
			field : 'is_delete',
			title : '删除状态',
			align : 'center',
			width:'5%',
			formatter : function(value, row, index) {
				var text = "";
				if (row.is_delete == 0) {
					text = "正常";
				} else if (row.is_delete == 1) {
					text = "已删除";
				}
				return text;
			}
		}*/, {
			title : '操作',
			field : 'operat',
			align : 'center',
			valign : 'middle',
			width:'12%',
			formatter : function(value, row, index) {
				return addOpter(row);
			}
		} ]
	});
}
function addOpter(row) {
	//var html = '<input type="button" value="图片详情"class="report_data_table_but btn btn-primary" onclick="searchInfo(\''+ row.pic_xh + '\',\''+row.uuid+'\')" style="margin-right: 5px;"/>';
	var html="";
	if(opType=="addBrocastCover"){//轮播封面
		html += '<input type="button" value="加入轮播封面" class="report_data_table_but btn btn-warning" onclick="addBrocastCover(\''+ row.pic_xh + '\',\''+row.pic_ytlj+'\')" style="margin-right: 5px;"/>';
	}else if(opType=="addBrocast"){//轮播链接
		html += '<input type="button" value="加入轮播链接" class="report_data_table_but btn btn-warning" onclick="addBrocast(\''+ row.pic_xh + '\',\''+row.id+'\')" style="margin-right: 5px;"/>';
	}else if(opType=="addEditSelect"){//编辑精选
		html += '<input type="button" value="加入编辑精选" class="report_data_table_but btn btn-inverse" onclick="addEditSelect(\''+ row.pic_xh + '\',\''+row.id+'\')" style="margin-right: 5px;"/>';
	}else if(opType=="addEvent"){//活动
		html += '<input type="button" value="加入活动图片" class="report_data_table_but btn btn-success" onclick="addEvent(\''+ row.pic_xh + '\',\''+row.id+'\')" style="margin-right: 5px;"/>';
	}else if(opType=="addArea"){//区县
		html += '<input type="button" value="加入区县" class="report_data_table_but btn btn-info" onclick="addArea(\''+ row.pic_xh + '\',\''+row.id+'\')" style="margin-right: 5px;"/>';
	}
	return html;
}

/**
 * 修改html的高度
 */
function setHeight() {
	setIframeHeight("pictureAudit_content", MODULEID_);
}

/**
 * 检索
 */
function searchData() {
	var searchWord=getParams();
	$("#pictureDataTable").bootstrapTable('getOptions').pageNumber = 1;
	$("#pictureDataTable").bootstrapTable("refresh", {
		query : {
			searchWord :searchWord,
			pageIndex : 1,
			orderField:"pic_scsj",
			orderType:"desc",
			pageSize : function() {
				return $("#pictureDataTable").bootstrapTable('getOptions').pageSize;
			}()
		}
	});
}

/**
 * 刷新表格
 */
function refreshTable() {
	var searchWord=getParams();
	$("#pictureDataTable").bootstrapTable("refresh", {
		query : {
			searchWord :searchWord,
			pageIndex : 1,
			orderField:"pic_scsj",
			orderType:"desc",
			pageSize : function() {
				return $("#pictureDataTable").bootstrapTable('getOptions').pageSize;
			}()
		}
	});
}

/**
 * 确认删除
 */
function sureDelete(ids){
	$box.promptSureBox("确认删除么？删除数据不可恢复！",'deleteByIds',ids);
	$("#myModalLabel").html("确认提示");
}

/**
 * 批量删除
 */
function batchDeleteByIds() {
	var getSelectRows = $("#pictureDataTable").bootstrapTable('getSelections');
	if (getSelectRows.length <= 0) {
		$box.promptBox('请选择数据');
		return;
	}
	var ids = "";
	var flag=true;
	$.each(getSelectRows, function(i, val) {
		ids += val.id + ",";
	});
	if(ids.length==0){
		$box.promptBox('请选择有效的数据！');
		return;
	}else{		
		ids = ids.substring(0, ids.length - 1);
	}
	sureDelete(ids);
}

/**
 * 批量删除
 */
function deleteByIds(ids) {
	$.ajax({
		url : "/sjcq/photoPic/physicalDelByIds", 
		dataType : "json", 
		async : true,
		data : {
			ids : ids
		},
		type : "post", 
		success : function(data) {
			$box.promptBox(data.msg+"<br>特别提醒：删除数据会在1-2分钟之内更新，请稍后刷新查看！");
			refreshTable();
		},
		error : function() {
			alert("删除失败！");
		}
	});

}

/**
 * 查看详情
 * @param id
 */
function searchInfo(picXh,audituuid) {
	if($("#auditType").val()==2){
		var url = "../html/photoDetail/photoDetail2.html";
		var tabId = "photoDetail";
		var name = "图片详情页";
		var param = JSON.stringify({
			"tabId" : tabId,
			"MODULEID_" : MODULEID_,
			"MAIN_PAGE_ID_" : MODULEID_,
			"picXh" : picXh,
			"auditUuid":audituuid
		});
		pageAddNewTab(tabId, name, url, param)
	}else{//图片信息展示
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
	}
}


//======================================================//
function batchAddEditSelect(){
	var getSelectRows = $("#pictureDataTable").bootstrapTable('getSelections');
	if (getSelectRows.length <= 0) {
		$box.promptBox('请选择数据');
		return;
	}
	var ids = "";
	var flag=true;
	$.each(getSelectRows, function(i, val) {
		ids += val.id + ",";
	});
	ids = ids.substring(0, ids.length - 1);
	addEditSelect("",ids);
}
function addEditSelect(picXh,PicId){
	var url = "../html/editSelected/editSelectSortManagePicAdd.html";
	var tabId = "addBroadCastPic";
	var name = "加入编辑精选";
	var param = JSON.stringify({
		"tabId" : "addBroadCastPic",
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"PicId" : PicId
	});
	pageAddNewTab("addBroadCastPic", name, url, param)
	
	/*
	var options="";
	$.ajax({
		url : "/sjcq/manage/editSelectedSort/getAll", 
		dataType : "json", 
		async : false,
		data : {
		}, 
		type : "post", 
		success : function(data) {
			$.each(data, function(i, val) {
				options+="<option value=\""+val.uuid+"\">"+val.sortName+"</option>";
			});
		},
		error : function() {
			alert("服务器错误！");
		}
	});
	var table = "";
	table += "<table style ='margin: 0 auto;' id='audit_table'>";
	table += "<tr><td>精选分类:</td><td>";
	table += "<select class='select-width' id='selectSortXh'>"+options+"<select>";
	table += "</td></tr>"
	table += "<tr><td colspan='2' align='center'>";
	table += "</td></tr>";
	table += "</table>";
	$box.promptBox(table);
	$("#myModalLabel").html("加入精选");
*/}
var URL1="";
function addPicToEditSelect(picIds){
	URL1="/sjcq/photoPicManage/addPicToEditSelect";
	var options="";
	$.ajax({
		url : URL1, 
		dataType : "json", 
		async : false,
		data : {picIds:picIds,editSelectSortXh:$("#selectSortXh").val(),editSelectSortName:$("#selectSortXh").find("option:selected").text()
		}, 
		type : "post", 
		success : function(data) {
			if(data==true || data=="true"){
				$box.promptBox("加入编辑精选成功");
				searchData();
			}else{
				$box.promptBox("加入编辑精选失败");
			}
		},
		error : function() {
			alert("服务器错误！");
		}
	});
}
function batchAddArea(){
	var getSelectRows = $("#pictureDataTable").bootstrapTable('getSelections');
	if (getSelectRows.length <= 0) {
		$box.promptBox('请选择数据');
		return;
	}
	var ids = "";
	var flag=true;
	$.each(getSelectRows, function(i, val) {
		ids += val.id + ",";
	});
	ids = ids.substring(0, ids.length - 1);
	addArea("",ids);
}
function addArea(picXh,PicId){
	var options="";
	$.ajax({
		url : "/sjcq/manage/area/findAll", 
		dataType : "json", 
		async : false,
		data : {
		}, 
		type : "post", 
		success : function(data) {
			$.each(data, function(i, val) {
				options+="<option value=\""+val.aliasName+"\">"+val.aliasName+"</option>";
			});
		},
		error : function() {
			alert("服务器错误！");
		}
	});
	var table = "";
	table += "<table style ='margin: 0 auto;' id='audit_table'>";
	table += "<tr><td>选择区县:</td><td>";
	table += "<select class='select-width' id='areaName'>"+options+"<select>";
	table += "</td></tr>"
	table += "<tr><td colspan='2' align='center'>";
	table += '<input type="button" value="加入该区县" class="report_data_table_but btn btn-primary" onclick="addPicToArea(\''+PicId+'\',1)"/>';
	table += "</td></tr>";
	table += "</table>";
	$box.promptBox(table);
	$("#myModalLabel").html("加入区县");
}
var URL1="";
function addPicToArea(picIds){
	URL1="/sjcq/photoPicManage/addPicToArea";
	var options="";
	$.ajax({
		url : URL1, 
		dataType : "json", 
		async : false,
		data : {picIds:picIds,areaName:$("#areaName").val()}, 
		type : "post", 
		success : function(data) {
			if(data==true || data=="true"){
				$box.promptBox("加入区县成功");
				searchData();
			}else{
				$box.promptBox("加入区县失败");
			}
		},
		error : function() {
			alert("服务器错误！");
		}
	});
}
function batchAddBrocast(){
	var getSelectRows = $("#pictureDataTable").bootstrapTable('getSelections');
	if (getSelectRows.length <= 0) {
		$box.promptBox('请选择数据');
		return;
	}
	var ids = "";
	var flag=true;
	$.each(getSelectRows, function(i, val) {
		ids += val.id + ",";
	});
	ids = ids.substring(0, ids.length - 1);
	addBrocast("",ids);
}
function addBrocast(picXh,PicId){
	var url = "../html/broadCast/broadCastManagePicAdd.html";
	var tabId = "addBroadCastPic";
	var name = "加入轮播链接";
	var param = JSON.stringify({
		"tabId" : "addBroadCastPic",
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"PicId" : PicId
	});
	pageAddNewTab("addBroadCastPic", name, url, param);
	/*
	var options="";
	$.ajax({
		url : "/sjcq/broadcast/findAll", 
		dataType : "json", 
		async : false,
		data : {
		}, 
		type : "post", 
		success : function(data) {
			$.each(data, function(i, val) {
				options+="<option value=\""+val.broadcastXh+"\">"+val.picName+"</option>";
			});
		},
		error : function() {
			alert("服务器错误！");
		}
	});
	var table = "";
	table += "<table style ='margin: 0 auto;' id='audit_table'>";
	table += "<tr><td>轮播图片名称:</td><td>";
	table += "<select class='select-width' id='broadCastXh'>"+options+"<select>";
	table += "</td></tr>"
	table += "<tr><td colspan='2' align='center'>";
	table += '<input type="button" value="加入轮播" class="report_data_table_but btn btn-primary" onclick="addPicTobroadCast(\''+PicId+'\',1)"/>';
	table += "</td></tr>";
	table += "</table>";
	$box.promptBox(table);
	$("#myModalLabel").html("加入轮播链接");
*/}

function addPicTobroadCast(picIds){
	URL1="/sjcq/photoPicManage/addPicTobroadCast";
	var options="";
	$.ajax({
		url : URL1, 
		dataType : "json", 
		async : false,
		data : {picIds:picIds,broadCastXh:$("#broadCastXh").val(),broaCastContent:$("#broadCastXh").find("option:selected").text()}, 
		type : "post", 
		success : function(data) {
			if(data==true || data=="true"){
				$box.promptBox("加入轮播成功");
				searchData();
			}else{
				$box.promptBox("加入轮播失败");
			}
		},
		error : function() {
			alert("服务器错误！");
		}
	});
}
function batchAddEvent(){
	var getSelectRows = $("#pictureDataTable").bootstrapTable('getSelections');
	if (getSelectRows.length <= 0) {
		$box.promptBox('请选择数据');
		return;
	}
	var ids = "";
	var flag=true;
	$.each(getSelectRows, function(i, val) {
		ids += val.id + ",";
	});
	ids = ids.substring(0, ids.length - 1);
	addEvent("",ids);
}
function addEvent(picXh,PicId){
	var options="";
	$.ajax({
		url : "/sjcq/ptgyatv/getAll", 
		dataType : "json", 
		async : false,
		data : {
		}, 
		type : "post", 
		success : function(data) {
			$.each(data, function(i, val) {
				options+="<option value=\""+val.atyXh+"\">"+val.atyTitle+"</option>";
			});
		},
		error : function() {
			alert("服务器错误！");
		}
	});
	var table = "";
	table += "<table style ='margin: 0 auto;' id='audit_table'>";
	table += "<tr><td>活动名称:</td><td>";
	table += "<select class='select-width' id='eventXh'>"+options+"<select>";
	table += "</td></tr>"
	table += "<tr><td colspan='2' align='center'>";
	table += '<input type="button" value="加入活动" class="report_data_table_but btn btn-primary" onclick="addPicToEvent(\''+PicId+'\',1)"/>';
	table += "</td></tr>";
	table += "</table>";
	$box.promptBox(table);
	$("#myModalLabel").html("加入活动链接");
}

function addPicToEvent(picIds){
	URL1="/sjcq/photoPicManage/addPicToPtgyatv";
	var options="";
	$.ajax({
		url : URL1, 
		dataType : "json", 
		async : false,
		data : {picIds:picIds,atyXh:$("#eventXh").val(),atyTitle:$("#eventXh").find("option:selected").text()}, 
		type : "post", 
		success : function(data) {
			if(data==true || data=="true"){
				$box.promptBox("加入活动成功");
				searchData();
			}else{
				$box.promptBox("加入活动失败");
			}
		},
		error : function() {
			alert("服务器错误！");
		}
	});
}
/**
 * 加入轮播封面
 * @param picXh
 * @param picId
 */
function addBrocastCover(picXh,picYtlj){
	var param = JSON.stringify({
		"tabId" : "addBroadCover",
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"type":"oldFile",
		"picXh":picXh,
		"ytLj":picYtlj
	});
	pageAddNewTab("addBroadCover", "新增轮播封面", "../html/cutImage/cutImage.html", param);
}