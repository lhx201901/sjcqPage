function getCloumn(){
	if($("#dataType").val()=="pic"){
		var cloumns=[ {
			field : 'checdd',
			checkbox : true
		},{// 表格结构配置
			title : "图片",// 列title文字
			field : "pic_lylys",// 该列对应数据哪个字段
			width : "10%",// 列宽度设置,不设也没什么
			align:'center',
			formatter : function(value, row, index) {
				var html ="";
				html+='<div class="hill_img"><div class="hl_img"><img onclick=clickOne(\''+row.picLyljm+'\') ondblclick="clickdbl(\''+row.picXh+'\')" src="'+PICURI+row.picLylys+'"></div></div>';
				console.log(html);
				return html;
			}
		}, {
			field : 'pic_INFO',
			title : '图片信息',
			width:'35%',
			align:'left',
			formatter : function(value, row, index){
				var html ="";
				html+='<p><span style="font-weight: bold;">标题：</span>'+row.picMc+'</p>';
				html+='<p><span style="font-weight: bold;">作者：</span>'+row.picScz+'</p>';
				if(row.picRemark!=null&&row.picRemark.length>50){
					html+='<p><span style="font-weight: bold;">主说明：</span>'+row.picRemark.substring(0,50)+'</p>';
				}else{
					html+='<p><span style="font-weight: bold;">主说明：</span>'+row.picRemark+'</p>';
				}
				if(row.picFRemark!=null&&row.picFRemark.length>50){
					html+='<p><span style="font-weight: bold;">分说明：</span>'+row.picFRemark.substring(0,50)+'</p>';
				}else{
					html+='<p><span style="font-weight: bold;">分说明：</span>'+row.picFRemark+'</p>';
				}
				return html;
			}
			
		}, {
            field: 'pic_mj',
            title: '密级',
            width:'8%',
			align:'center',
			formatter : function(value, row, index){
				if(row.picMj==null || row.picMj ==undefined || row.picMj=='null'){
					if(row.picMj==1){
						return "公开";
					}else{
						return "非公开";
					}
				}else{
					return "非公开";
				}
			}
        }, {
			field : 'pic_jg',
			title : '图片价格',
			width:'8%',
			align:'center',
			formatter : function(value, row, index){
				if(row.picJg==null || row.picJg ==undefined || row.picJg=='null'){
					return "";
				}else{
					return "￥"+row.picJg;
				}
			}
		}, {
			field : 'task_type',
			title : '任务类型',
			width:'10%',
			align:'center',
			formatter : function(value, row, index) {
				var html="";
				if(row.manageType==null || row.manageType==undefined ||
						row.manageType=="null" || row.manageType=="NULL" || row.manageType=="-1"){
					return "无审核任务";
				}else if (row.manageType==0){
					return "图片新增";
				}else if(row.manageType==1){
					return "图片编辑";
				}else if(row.manageType==2){
					return "图片删除";
				}else if(row.manageType==6){
					return "图片上架";
				}
				return html;
			}
		},  {
			field : 'audit_statu',
			title : '审核状态',
			width:'8%',
			formatter : function(value, row, index) {
				var text = "无审核状态";
				if(row.manageState!=null && row.manageState!=undefined && row.manageState!="null" && row.manageState!="NULL"){
					if (row.manageState == 2) { 
						text = "待审核";
					} else if (row.manageState == 3) {
						text = "审核通过";
					} else if (row.manageState == 4) {
						text = "审核不通过";
					} else if (row.manageState==1){
						text="未提交";
					} else{
						text="无审核状态";
					}	
				}
				return "<span onclick='showEditInfo(\""+row.picXh+"\")'>"+text+"</span>";
			},
			align:'center'
			
		}, {
			title : '操作',
			field : 'operat',
			align : 'center',
			width:'8%',
			formatter : function(value, row, index) {
				var html="";
				if(row.manageType==null || row.manageType==undefined ||
						row.manageType=="null" || row.manageType=="NULL" || row.manageType=="-1"){
					html += '<input type="button" value="编辑" class="report_data_table_but btn btn-primary" onclick="editPic(\''+ row.picXh + '\',\''+row.id+'\')" style="margin-right: 5px;"/>';
					html +='<input type="button" value="删除"  class="report_data_table_but btn btn-warning" onclick="deletePic(\''+row.id+'\')" style="margin-right: 5px;"/>';
				}else if(row.manageState==1){//未提交
					//提交和编辑的再次编辑
					html += '<input type="button" value="提交审核" class="report_data_table_but btn btn-primary" onclick="taskSubmit(\''+ row.taskXh + '\')" style="margin-right: 5px;"/>';
					if(row.manageType==1||row.manageType==0){
						html += '<input type="button" value="修改" class="report_data_table_but btn btn-warning" onclick="secondUpdate(\''+ row.taskXh + '\')" style="margin-right: 5px;"/>';
					}
				}else if(row.manageType==1||row.manageType==0){
					//发布数据到门户
					html += '<input type="button" value="修改详情" class="report_data_table_but btn btn-primary" onclick="editPicDetail(\''+ row.taskXh + '\',\''+row.manageState+'\')" style="margin-right: 5px;"/>';
				}
				if(row.releasedType==0&&(row.manageState == 3||row.manageState == 4)){						
					html += '<input type="button" value="再次编辑" class="report_data_table_but btn btn-primary" onclick="editPic(\''+ row.picXh + '\',\''+row.id+'\')" style="margin-right: 5px;"/>';
					html += '<input type="button" value="发布" class="report_data_table_but btn btn-warning" onclick="taskRelase(\''+ row.taskXh + '\')" style="margin-right: 5px;"/>';
				}
				return html;
			}
		},{
			title : '分类加入',
			field : 'operat',
			align : 'center',
			width:'21%',
			formatter : function(value, row, index) {
				var html="";
				html += '<input type="button" value="加入轮播封面" class="report_data_table_but btn btn-primary" onclick="addBrocastCover(\''+ row.picXh + '\',\''+row.picYtlj+'\')" style="margin-right: 5px;"/>';
				html += '<input type="button" value="加入轮播链接" class="report_data_table_but btn btn-warning" onclick="addBrocast(\''+ row.picXh + '\',\''+row.id+'\')" style="margin-right: 5px;"/>';
				html += '<input type="button" value="加入编辑精选" class="report_data_table_but btn btn-inverse" onclick="addEditSelect(\''+ row.picXh + '\',\''+row.id+'\')" style="margin-right: 5px;"/>';
				html += '<input type="button" value="加入活动图片" class="report_data_table_but btn btn-success" onclick="addEvent(\''+ row.picXh + '\',\''+row.id+'\')" style="margin-right: 5px;"/>';
				html += '<input type="button" value="加入区县" class="report_data_table_but btn btn-info" onclick="addArea(\''+ row.picXh + '\',\''+row.id+'\')" style="margin-right: 5px;"/>';
				return html;
			}
		} ]
		return cloumns;
	}else{
		var cloumns=[ {
			field : 'checdd',
			checkbox : true
		} ,{// 表格结构配置
			title : "图集封面",// 列title文字
			field : "pic_lylys",// 该列对应数据哪个字段
			width : "10%",// 列宽度设置,不设也没什么
			align:'center',
			formatter : function(value, row, index) {
				var html ="";
				html+='<div class="hill_img"><div class="hl_img"><img onclick=clickOne(\''+row.tjFmlj+'\') ondblclick="clickdbl1(\''+row.tjXh+'\')" src="'+PICURI+row.tjFmlj+'"></div></div>';
				console.log(html);
				return html;
			}
		},{
			field : 'pic_INFO',
			title : '图集信息',
			width:'35%',
			align:'left',
			formatter : function(value, row, index){
				var html ="";
				html+='<p><span style="font-weight: bold;">标题：</span>'+row.tjMc+'</p>';
				html+='<p><span style="font-weight: bold;">作者：</span>'+row.tjScz+'</p>';
				if(row.tjRemark!=null&&row.tjRemark.length>50){
					html+='<p><span style="font-weight: bold;">说明：</span>'+row.tjRemark.substring(0,50)+'</p>';
				}else{
					html+='<p><span style="font-weight: bold;">说明：</span>'+row.tjRemark+'</p>';
				}
				return html;
			}
			
		}, {
			field : 'task_type',
			title : '任务类型',
			width:'10%',
			align:'center',
			formatter : function(value, row, index) {
				var html="";
				if(row.manageType==null || row.manageType==undefined ||
						row.manageType=="null" || row.manageType=="NULL" || row.manageType=="-1"){
					return "无审核任务";
				}else if (row.manageType==0){
					return "图集新增";
				}else if(row.manageType==1){
					return "图集编辑";
				}else if(row.manageType==2){
					return "图集删除";
				}else if(row.manageType==6){
					return "图集上架";
				}
				return html;
			}
		},  {
			field : 'audit_statu',
			title : '审核状态',
			width:'8%',
			formatter : function(value, row, index) {
				var text = "无审核状态";
				if(row.manageState!=null && row.manageState!=undefined && row.manageState!="null" && row.manageState!="NULL"){
					if (row.manageState == 2) { 
						text = "待审核";
					} else if (row.manageState == 3) {
						text = "审核通过";
					} else if (row.manageState == 4) {
						text = "审核不通过";
					} else if (row.manageState==1){
						text="未提交";
					} else{
						text="无审核状态";
					}	
				}
				return "<span onclick='showEditInfo(\""+row.tjXh+"\")'>"+text+"</span>";
			},
			align:'center'
			
		}, {
			title : '操作',
			field : 'operat',
			align : 'center',
			width:'8%',
			formatter : function(value, row, index) {
				var html="";
				if(row.manageType==null || row.manageType==undefined ||
						row.manageType=="null" || row.manageType=="NULL" || row.manageType=="-1"){
					html += '<input type="button" value="编辑" class="report_data_table_but btn btn-primary" onclick="editPic(\''+ row.tjXh + '\',\''+row.id+'\',\''+row.tjMc+'\',\''+row.tjRemark+'\')" style="margin-right: 5px;"/>';
					html +='<input type="button" value="删除"  class="report_data_table_but btn btn-warning" onclick="deletePic(\''+row.id+'\')" style="margin-right: 5px;"/>';
				}else if(row.manageState==1){//未提交
					//提交和编辑的再次编辑
					html += '<input type="button" value="提交" class="report_data_table_but btn btn-primary" onclick="taskSubmit(\''+ row.taskXh + '\')" style="margin-right: 5px;"/>';
					if(row.manageType==1||row.manageType==0){
						html += '<input type="button" value="修改" class="report_data_table_but btn btn-warning" onclick="secondUpdate(\''+ row.taskXh + '\')" style="margin-right: 5px;"/>';
					}
				}else if(row.manageType==1 || row.manageType==0){
					//发布数据到门户
					html += '<input type="button" value="修改详情" class="report_data_table_but btn btn-primary" onclick="editPicDetail(\''+ row.taskXh + '\',\''+row.manageState+'\')" style="margin-right: 5px;"/>';
				}
				if(row.releasedType==0&&(row.manageState == 3||row.manageState == 4)){						
					html += '<input type="button" value="再次编辑" class="report_data_table_but btn btn-primary" onclick="editPic(\''+ row.tjXh + '\',\''+row.id+'\',\''+row.tjMc+'\',\''+row.tjRemark+'\')" style="margin-right: 5px;"/>';
					html += '<input type="button" value="发布" class="report_data_table_but btn btn-warning" onclick="taskRelase(\''+ row.taskXh + '\')" style="margin-right: 5px;"/>';
				}
				return html;
			}
		},{
			title : '分类加入',
			field : 'operat',
			align : 'center',
			width:'31%',
			formatter : function(value, row, index) {
				var html="";
				html += '<input type="button" value="加入轮播封面" class="report_data_table_but btn btn-primary" onclick="tjaddBrocastCover(\''+ row.tjXh + '\',\''+row.id+'\')" style="margin-right: 5px;"/>';
				html += '<input type="button" value="加入轮播链接" class="report_data_table_but btn btn-warning" onclick="tjaddBrocast(\''+ row.tjXh + '\',\''+row.id+'\')" style="margin-right: 5px;"/>';
				html += '<input type="button" value="加入编辑精选" class="report_data_table_but btn btn-inverse" onclick="tjaddEditSelect(\''+ row.tjXh + '\',\''+row.id+'\')" style="margin-right: 5px;"/>';
				html += '<input type="button" value="加入活动图片" class="report_data_table_but btn btn-success" onclick="tjaddEvent(\''+ row.tjXh + '\',\''+row.id+'\')" style="margin-right: 5px;"/>';
				html += '<input type="button" value="加入区县" class="report_data_table_but btn btn-info" onclick="tjaddArea(\''+ row.tjXh + '\',\''+row.id+'\')" style="margin-right: 5px;"/>';
				return html;
			}
		} ]
		return cloumns;
	}
}
/**
 * 图集图片分类操作
 * @param tjXh
 * @param tjId
 */
function tjaddBrocastCover(tjXh,tjId){
	var url = "../html/auditManage/tjPictureManage.html";
	var tabId = "addBrocastCover"+tjXh;
	var name = "图片列表页";
	var param = JSON.stringify({
		"tabId" : "picDetail"+tjXh,
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"tjXh" : tjXh,
		"type" :"addBrocastCover"
	});
	pageAddNewTab(tabId, name, url, param)

}
function tjaddBrocast(tjXh,tjId){
	var url = "../html/auditManage/tjPictureManage.html";
	var tabId = "addBrocast"+tjXh;
	var name = "图片列表页";
	var param = JSON.stringify({
		"tabId" : "addBrocast"+tjXh,
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"tjXh" : tjXh,
		"type" :"addBrocast"
	});
	pageAddNewTab(tabId, name, url, param)

}
function tjaddEditSelect(tjXh,tjId){
	var url = "../html/auditManage/tjPictureManage.html";
	var tabId = "addEditSelect"+tjXh;
	var name = "图片列表页";
	var param = JSON.stringify({
		"tabId" : "addEditSelect"+tjXh,
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"tjXh" : tjXh,
		"type" :"addEditSelect"
	});
	pageAddNewTab(tabId, name, url, param)

}
function tjaddEvent(tjXh,tjId){
	var url = "../html/auditManage/tjPictureManage.html";
	var tabId = "addEvent"+tjXh;
	var name = "图片列表页";
	var param = JSON.stringify({
		"tabId" : "addEvent"+tjXh,
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"tjXh" : tjXh,
		"type" :"addEvent"
	});
	pageAddNewTab(tabId, name, url, param)

}
function tjaddArea(tjXh,tjId){
	var url = "../html/auditManage/tjPictureManage.html";
	var tabId = "addArea"+tjXh;
	var name = "图片列表页";
	var param = JSON.stringify({
		"tabId" : "addArea"+tjXh,
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"tjXh" : tjXh,
		"type" :"addArea"
	});
	pageAddNewTab(tabId, name, url, param)

}
function batchAddEditSelect(){
	var getSelectRows = $("#pictureAuditDataTable").bootstrapTable('getSelections');
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
	table += '<input type="button" value="加入该组" class="report_data_table_but btn btn-primary" onclick="addPicToEditSelect(\''+PicId+'\',1)"/>';
	table += "</td></tr>";
	table += "</table>";
	$box.promptBox(table);
	$("#myModalLabel").html("加入精选");
*/}
var URL1="";
function addPicToEditSelect(picIds){
	if($("#dataType").val()=="pic"){
		URL1="/sjcq/photoPicManage/addPicToEditSelect";
	}else if($("#dataType").val()=="tj"){
		URL1="/sjcq/photoTjManage/addPicToEditSelect";
	}
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
				searchAuditData();
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
	var getSelectRows = $("#pictureAuditDataTable").bootstrapTable('getSelections');
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

function addPicToArea(picIds){
	if($("#dataType").val()=="pic"){
		URL1="/sjcq/photoPicManage/addPicToArea";
	}else if($("#dataType").val()=="tj"){
		URL1="/sjcq/photoTjManage/addPicToArea";
	}
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
				searchAuditData();
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
	var getSelectRows = $("#pictureAuditDataTable").bootstrapTable('getSelections');
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
	pageAddNewTab("addBroadCastPic", name, url, param)
	/*var options="";
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
	$("#myModalLabel").html("加入轮播链接");*/
}

function addPicTobroadCast(picIds){
	if($("#dataType").val()=="pic"){
		URL1="/sjcq/photoPicManage/addPicTobroadCast";
	}else if($("#dataType").val()=="tj"){
		URL1="/sjcq/photoTjManage/addPicTobroadCast";
	}
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
				searchAuditData();
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
	var getSelectRows = $("#pictureAuditDataTable").bootstrapTable('getSelections');
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
	if($("#dataType").val()=="pic"){
		URL1="/sjcq/photoPicManage/addPicToPtgyatv";
	}else if($("#dataType").val()=="tj"){
		URL1="/sjcq/photoTjManage/addPicToPtgyatv";
	}
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
				searchAuditData();
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
 * 新增任务的二次操作
 * @param taskXh
 */
function secondUpdate(taskXh){
	//判断图片或者图集跳转页面
	var url = "../html/auditManage/photoAddOrUpdateEdit.html";
	var tabId = "secondUpdate";
	var name = "编辑图片信息";
	if($("#dataType").val()=="tj"){
		name="编辑图集信息";
	}
	var param = JSON.stringify({
		"tabId" : tabId,
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"taskXh" : taskXh,
		"dataType":$("#dataType").val()
	});
	pageAddNewTab(tabId, name, url, param);
}
/**
 * 审核成功后的编辑详情
 * @param taskXh
 */
function editPicDetail(taskXh,manageState){
	//判断图片或者图集跳转页面
	var url = "../html/auditManage/photoAddOrUpdateEditDetail.html";
	var tabId = "editPicDetail";
	var name = "图片编辑信息";
	if($("#dataType").val()=="tj"){
		name="图集编辑信息";
	}
	var param = JSON.stringify({
		"tabId" : tabId,
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"taskXh" : taskXh,
		"dataType":$("#dataType").val(),
		"updateType":0,
		"taskId":"",
		"manageState":manageState
	});
	pageAddNewTab(tabId, name, url, param);

}
/**
 * 任务提交
 * @param taskXh
 */
function taskSubmit(taskXh){
	if($("#dataType").val()=="pic"){
		URL1="/sjcq/photoPicManage/batchSubmitTask";
	}else if($("#dataType").val()=="tj"){
		URL1="/sjcq/photoTjManage/batchSubmitTask";
	}
	$box.promptSureBox("是否确定将选中的数据提交审核！", "taskUserAjax", taskXh);
}
function taskUserAjax(taskXh){
	$.ajax({
		url : URL1, 
		dataType : "json", 
		async : false,
		data : {taskXhs:taskXh}, 
		type : "post", 
		success : function(data) {
			$box.promptBox(data.resultInfo);
			if(data.resultStatus==true || data.resultStatus=="true"){		
				$('#myModal').on('hidden.bs.modal', function () {
					searchAuditData();
				});
			}
		},
		error : function() {
			alert("服务器错误！");
		}
	});
}
/**
 * 批量提交任务
 */
function batchTaskSubmit(){
	//获取taskXh
	var getSelectRows = $("#pictureAuditDataTable").bootstrapTable('getSelections');
	if (getSelectRows.length <= 0) {
		$box.promptBox('请选择数据');
		return;
	}
	var xhs = "";
	var flag=true;
	$.each(getSelectRows, function(i, val) {
		if(val.manageState==1){			
			xhs += val.taskXh + ",";
		}
	});
	if(xhs.length==0){
		$box.promptBox('请选择待提交的数据！！');
		return;
	}else{
		xhs = xhs.substring(0, xhs.length - 1);
		taskSubmit(xhs);
	}
}
/**
 * 任务发布---和任务提交相同使用统一方法
 * @param taskXh
 */
function taskRelase(taskXhs){
	if($("#dataType").val()=="pic"){
		URL1="/sjcq/photoPicManage/picDataReleased";
	}else if($("#dataType").val()=="tj"){
		URL1="/sjcq/photoTjManage/picDataReleased";
	}
	$box.promptSureBox("是否确定将选中的数据发布到门户网站！", "taskUserAjax1", taskXhs);
}
function taskUserAjax1(taskXh){
	$.ajax({
		url : URL1, 
		dataType : "json", 
		async : false,
		data : {taskXhs:taskXh}, 
		type : "post", 
		success : function(data) {
			if(data===true || data==="true"){		
				$box.promptBox("操作成功！");
				$('#myModal').on('hidden.bs.modal', function () {
					searchAuditData();
				});
			}else{
				$box.promptBox("操作失败！");
			}
		},
		error : function() {
			alert("服务器错误！");
		}
	});
}
function batchRelase(){
	var getSelectRows = $("#pictureAuditDataTable").bootstrapTable('getSelections');
	if (getSelectRows.length <= 0) {
		$box.promptBox('请选择数据');
		return;
	}
	var xhs = "";
	var flag=true;
	$.each(getSelectRows, function(i, val) {
		if(val.manageState==3 || val.manageState==4){			
			xhs += val.taskXh + ",";
		}
	});
	if(xhs.length==0){
		$box.promptBox('请选择待发布的数据！！');
		return;
	}else{
		xhs = xhs.substring(0, xhs.length - 1);
		taskRelase(xhs);
	}
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