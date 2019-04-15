/**
 * 图片信息审核管理页js
 */
var MODULEID_;// 模块id序号
var URL_="";
$(document).ready(function() {
	checksessoin();
	MODULEID_ = GetParamByRequest().MODULEID_;
	initTable();
	$("#dataSource").change(function(){
		searchAuditData();
	});
	$("#dataType").change(function(){
		if($("#dataType").val()=="tj"){
		    $('#taskType option').each(function(){
		    	if(this.value>2){		    		
		    		this.style='display:none'
		    }}); 
			$('#taskType').trigger("chosen:updated"); 
		}else {
			 $('#taskType option').each(function(){
			    	if(this.value>2){		    		
			    		this.style='display:list-item'
			    }}); 
			 $('#taskType').trigger("chosen:updated"); 
		}
		initTable();
	});
	$("#taskType").change(function(){
		initTable();
	});
	$("#auditType").change(function(){
		searchAuditData();
	});
	$('#searchWord').keydown(function(e){
		if(e.keyCode==13){
			searchAuditData();
		}
	})});
/**
 * 获取所有参数
 * @returns {___anonymous218_219}
 */
function getParams(){
	var searchName = $("#searchName").val();
	var auditStatus = $("#auditStatusSel").val();
	var auditType = $("#auditType").val();
	var audit={};
	audit.beanName="PhotoPicBean";
	audit.opreateType=auditType;
	audit.auditStatus=auditStatus;
	audit.searchName=searchName;
//	alert(JSON.stringify(audit));
	return audit;
}
/**
 * 初始化表格
 */
function initTable() {
	if($("#dataType").val()=="pic"){
		URL_="/sjcq/photoPicManage/getPicManagePageInfo";
	}else if($("#dataType").val()=="tj"){
		URL_="/sjcq/photoTjManage/getTjManagePageInfo";
	}
	if($("#taskType").val()==7){//关联轮播封面
		URL_="/sjcq/broadcastAudit/findAll";
	}
	$("#pictureAuditDataTable").bootstrapTable("destroy");
	$('#pictureAuditDataTable').bootstrapTable({
		url : URL_, // 请求后台的URL（*）
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
			var obj=getParams();
			var param = {
					manageType : $("#taskType").val(),
					photoSource : $("#dataSource").val(),
					tjSource : $("#dataSource").val(),
					manageState : $("#auditType").val(),
					picMc : $("#searchWord").val(),
					picName : $("#searchWord").val(),
					state : $("#auditType").val(),
					tjMc : $("#searchWord").val(),
					orderBy:"id",
					orderDesc:1,
					pageIndex : params.pageNumber,
					pageSize : params.pageSize
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
		columns : getCloumn()
	});
}
var timer=null;
//单击
function clickOne(path){
	clearTimeout(timer);
	timer = setTimeout(function () { //在单击事件中添加一个setTimeout()函数，设置单击事件触发的时间间隔
		//alert("单击事件");
		/*picLarge(path);*/
		var html='<img  src="' + PICURI + "/"+path + '" style="height:auto;width:auto;">';
		$box.promptBox('<div style="padding: 20px ;display:flex;align-items:center; justify-content:center;">'+html+'</div>',"图片显示");
	}, 400);
}
//双击显示图片详情
function clickdbl(picXh){
	clearTimeout(timer);
	var url = "../html/photoDetail/photoDetail.html";
	var tabId = "photoDetail";
	var name = "图片详情页";
	var param = JSON.stringify({
		"tabId" : "picDetail",
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"picXh" : picXh
	});
	pageAddNewTab("photoDetail", name, url, param)
}
//双击显示图片详情
function clickdbl1(tjXh){
	clearTimeout(timer);
	var url = "../html/photoDetail/photoDetail.html";
	var tabId = "photoDetail";
	var name = "图集详情页";
	var param = JSON.stringify({
		"tabId" : tabId,
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"tjXh" : tjXh,
		"type":1
	});
	pageAddNewTab(tabId, name, url, param)
}
function editPic(taskXh,updateType,taskId){
	//判断图片或者图集跳转页面
	var url = "../html/auditManage/photoAddOrUpdateEditEnd.html";
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
		"dataType":$("#dataType").val(),
		"updateType":updateType,
		"taskId":taskId
	});
	pageAddNewTab(tabId, name, url, param);
}

function getCloumn(){
	if($("#taskType").val()==7){//关联轮播封面
		var cloumns=[ {
			field : 'checdd',
			checkbox : true
		},{// 表格结构配置
			title : "轮播封面",// 列title文字
			field : "pic_lylys",// 该列对应数据哪个字段
			width : "10%",// 列宽度设置,不设也没什么
			align:'center',
			formatter : function(value, row, index) {
				var html ="";
				html+='<div class="hill_img"><div class="hl_img"><img onclick=clickOne(\''+row.picPath+'\')  src="'+PICURI+"/"+row.picPath+'"></div></div>';
				console.log(html);
				return html;
			}
		}, {
			field : 'picAuthor',
			title : '封面作者',
			align :'center',
			width:'8%'
		},{
			field : 'picName',
			title : '图片名称',
			align :'center',
			width:'10%'
		}, {
			field : 'picContent',
			title : '图片内容',
			align :'center',
			width:'25%'
		},  {
			field : 'audit_statu',
			title : '审核状态',
			width:'8%',
			formatter : function(value, row, index) {
				var text = "无审核状态";
				if(row.state!=null && row.state!=undefined && row.state!="null" && row.state!="NULL"){
					if (row.state == 2) { 
						text = "待审核";
					} else if (row.state == 3) {
						text = "审核通过";
					} else if (row.state == 4) {
						text = "审核不通过";
					}
				}
				return text;
			},
			align:'center'
			
		}, {
			field : 'isUsed',
			title : '启用状态',
			align :'center',
			width:'8%',
			formatter : function(value, row, index) {
				var text = "";
				if (row.isUsed == 0) {
					text = "停用";
				} else if (row.isUsed == 1) {
					text = "启用";
				}
				return text;
			}
		},{
			title : '操作',
			field : 'operat',
			align : 'center',
			width:'18%',
			formatter : function(value, row, index) {
				var html="";
				if(row.state==2){//待审核
					if(row.releasedType==1){
						html='<input type="button" value="审核" class="report_data_table_but btn btn-primary" onclick="taskAudit(\''+row.id+'\')"/>';
					}else{
						html='<input type="button" value="审核" class="report_data_table_but btn btn-primary" disabled="disabled" onclick="taskAudit(\''+row.id+'\')"/>';
					}
				}else{
					html+='<input type="button" value="审核信息" class="report_data_table_but btn btn-inverse" onclick="auditInfo(\''+row.auditUserName+'\',\''+row.auditTime+'\',\''+row.auditRemark+'\')"/>';
				}
				return html;
			}
		}]
		return cloumns;
	}else if($("#dataType").val()=="pic"){
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
			width:'45%',
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
				return text;
			},
			align:'center'
			
		}, {
			field : 'fb_type',
			title : '发布状态',
			width:'8%',
			align:'center',
			formatter : function(value, row, index){
				if(row.releasedType!=null && row.releasedType!=undefined && row.releasedType==1){
					return "已发布到门户";
				}else{
					return "未发布";
				}
			}
		}, {
			field : 'bz',
			title : '备注',
			width:'15%',
			align:'center',
			formatter : function(value, row, index){
				var html="";
				if(row.manageType!=null && row.manageType!=undefined && row.manageType!="null" && row.manageType!="NULL"){
					if(row.manageType==3){
						html="关联轮播标题("+row.broaCastContent+")";
					}else if(row.manageType==4){
						html="关联精选分类("+row.editSelectSortName+")";
					}else if(row.manageType==5){
						html="关联区县("+row.areaName+")";
					}else if(row.manageType==8){
						html="关联活动标题("+row.atyTitle+")";
					}
				}
				return html;
			}
		}, {
			title : '操作',
			field : 'operat',
			align : 'center',
			width:'18%',
			formatter : function(value, row, index) {
				var html="";
				if(row.manageState==2){//待审核
					html='<input type="button" value="审核" class="report_data_table_but btn btn-primary" onclick="taskAudit(\''+row.id+'\')"/>';
					if(row.manageType==3||row.manageType==4||row.manageType==5||row.manageType==8){//数据成功发布后才能提交审核
						if(row.releasedType!=null && row.releasedType!=undefined && row.releasedType==1){
							html='<input type="button" value="审核" class="report_data_table_but btn btn-primary" onclick="taskAudit(\''+row.id+'\')"/>';
						}else{
							html='<input type="button" value="审核" class="report_data_table_but btn btn-primary" disabled="disabled" onclick="taskAudit(\''+row.id+'\')"/>';
						}
					}
					if((row.manageType==1||row.manageType==0)){//编辑
						html+='<input type="button" value="编辑" class="report_data_table_but btn btn-warning" onclick="editPic(\''+row.auditUuid+'\',\''+row.updateType+'\',\''+row.id+'\')"/>';
					}
				}else {
					if(row.manageType==1||row.manageType==0){						
						html='<input type="button" value="编辑详情" class="report_data_table_but btn btn-primary" onclick="editInfo(\''+row.auditUuid+'\',\''+row.updateType+'\',\''+row.id+'\')"/>';
					}
					html+='<input type="button" value="审核信息" class="report_data_table_but btn btn-inverse" onclick="auditInfo(\''+row.auditUserName+'\',\''+row.auditTime+'\',\''+row.auditRemark+'\')"/>';
				}
				html += '<input type="button" value="图片详情" class="report_data_table_but btn btn-info" onclick="clickdbl(\''+row.picXh+'\')" style="margin-right: 5px;"/>';
				return html;
			}
		}]
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
			width:'45%',
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
			
		},   {
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
				return text;
			},
			align:'center'
			
		}, {
			title : '操作',
			field : 'operat',
			align : 'center',
			width:'28%',
			formatter : function(value, row, index) {
				var html="";
				if(row.manageState==2){//待审核
					html='<input type="button" value="审核" class="report_data_table_but btn btn-primary" onclick="taskAudit(\''+row.id+'\')"/>';
					if(row.manageType==3||row.manageType==4||row.manageType==5||row.manageType==8){//数据成功发布后才能提交审核
						if(row.releasedType!=null && row.releasedType!=undefined && row.releasedType==1){
							html='<input type="button" value="审核" class="report_data_table_but btn btn-primary" onclick="taskAudit(\''+row.id+'\')"/>';
						}else{
							html='<input type="button" value="审核" class="report_data_table_but btn btn-primary" disabled="disabled" onclick="taskAudit(\''+row.id+'\')"/>';
						}
					}
					if((row.manageType==1||row.manageType==0)){//编辑
						html+='<input type="button" value="编辑" class="report_data_table_but btn btn-warning" onclick="editPic(\''+row.auditUuid+'\',\''+row.updateType+'\',\''+row.id+'\')"/>';
					}
				}else {
					if(row.manageType==1||row.manageType==0){						
						html='<input type="button" value="编辑详情" class="report_data_table_but btn btn-primary" onclick="editInfo(\''+row.auditUuid+'\',\''+row.updateType+'\',\''+row.id+'\')"/>';
					}
					html+='<input type="button" value="审核信息" class="report_data_table_but btn btn-inverse" onclick="auditInfo(\''+row.auditUserName+'\',\''+row.auditTime+'\',\''+row.auditRemark+'\')"/>';
				}
				html += '<input type="button" value="图集详情" class="report_data_table_but btn btn-info" onclick="clickdbl1(\''+row.tjXh+'\')" style="margin-right: 5px;"/>';
				return html;
			}
		}]
		return cloumns;
	}
}
function auditInfo(user,time,remark){
	var table = "";
	table += "<table style ='margin: 0 auto;' id='audit_table'>";
	table += "<tr><td>审核人:</td><td>"+user+"</td></tr>";
	table += "<tr><td>审核时间:</td><td>"+time+"</td></tr>";
	table += "<tr><td>审核备注:</td><td>";
	table += "<textarea id='remarks' rows='3' cols='20' >"+remark+"</textarea>";
	table += "</td></tr>"
	table += "</table>";
	$box.promptBox(table);
	$("#myModalLabel").html("审核详情");
}
function addOpter(row) {
	var html = '<input type="button" value="图片详情"class="report_data_table_but btn btn-primary" onclick="searchInfo(\''+ row.pic_xh + '\',\''+row.uuid+'\')" style="margin-right: 5px;"/>';
//	html += '<input type="button" value="编辑"class="report_data_table_but btn btn-info" onclick="editInfo('+ row.id + ')" style="margin-right: 5px;"/>';
	if(row.audit_statu==0){
		html+='<input type="button" value="审核"class="report_data_table_but btn btn-warning" onclick="auditById('+row.id+')" style="margin-right: 5px;"/>';
	}else{
		html+='<input type="button" value="审核信息"class="report_data_table_but btn btn-warning" onclick="auditDetail(\''+row.audit_remark+'\',\''+row.data_audit_person+'\',\''+row.audit_time+'\')" style="margin-right: 5px;"/>';
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
function searchAuditData() {
	$("#pictureAuditDataTable").bootstrapTable('getOptions').pageNumber = 1;
	$("#pictureAuditDataTable").bootstrapTable("refresh", {
		query : {
			manageType : $("#taskType").val(),
			photoSource : $("#dataSource").val(),
			tjSource : $("#dataSource").val(),
			manageState : $("#auditType").val(),
			picMc : $("#searchWord").val(),
			tjMc : $("#searchWord").val(),
			orderBy:"id",
			orderDesc:1,
			pageIndex : 1,
			pageSize : function() {
				return $("#pictureAuditDataTable").bootstrapTable('getOptions').pageSize;
			}()
		}
	});
}

/**
 * 刷新表格
 */
function refreshTable() {
	var obj=getParams();
	$("#pictureAuditDataTable").bootstrapTable("refresh", {
		query : {
			term : JSON.stringify(obj),
			orderType:1,
			pageIndex : 1,
			pageSize : function() {
				return $("#pictureAuditDataTable").bootstrapTable('getOptions').pageSize;
			}()
		}
	});
}
/**
 * 批量审核
 */
function batchAuditByIds() {
	var getSelectRows = $("#pictureAuditDataTable").bootstrapTable('getSelections');
	if (getSelectRows.length <= 0) {
		$box.promptBox('请选择数据');
		return;
	}
	var ids = "";
	var flag=true;
	$.each(getSelectRows, function(i, row) {
		if($("#taskType").val()==7){
			if(row.releasedType!=null && row.releasedType!=undefined && row.releasedType==1){
				ids += row.id + ",";
			}
		}else{			
			if (row.manageState==2) {
				if(row.manageType==3||row.manageType==4||row.manageType==5||row.manageType==8){//数据成功发布后才能提交审核
					if(row.releasedType!=null && row.releasedType!=undefined && row.releasedType==1){
						ids += row.id + ",";
					}
				}else{				
					ids += row.id + ",";
				}
			}
		}
	});
	if(ids.length==0){
		$box.promptBox('请选择有效的数据进行审核！');
		return;
	}else{		
		ids = ids.substring(0, ids.length - 1);
	}
	taskAudit(ids);
}
function taskAudit(ids){
	var table = "";
	table += "<table style ='margin: 0 auto;' id='audit_table'>";
	table += "<tr><td>备注:</td><td>";
	table += "<textarea id='remarks' rows='3' cols='20'></textarea>";
	table += "</td></tr>"
	table += "<tr><td colspan='2' align='center'>";
	table += '<input type="button" value="审核通过" class="report_data_table_but btn btn-primary" onclick="auditPass(\''+ids+'\',1)"/>';
	table += '<input type="button" value="审核不通过" class="report_data_table_but btn btn-danger" onclick="auditPass(\''+ids+'\',0)" style="margin-left: 10px;"/>';
	table += "</td></tr>";
	table += "</table>";
	$box.promptBox(table);
	$("#myModalLabel").html("审核");
}
/**
 * 审核详情
 * @param id
 */
function auditDetail(remark,person,time){
	var table = "";
	table += "<table style ='margin: 0 auto;' id='audit_table'>";
	table += "<tr><td>审核人:</td><td><input type='text' id='person'/></td></tr><tr><td>审核时间:</td><td><input type='text' id='time'/></td></tr>" +
			"<tr><td>审核备注:</td><td>";
	table += "<textarea id='remarks' rows='3' cols='20'></textarea>";
	table += "</td></tr>"
	table += "</table>";
	$box.promptBox(table);
	$("#myModalLabel").html("审核信息");
	$("#person").val(person);
	$("#time").val(timecheck(Number(time)));
	$("#remarks").val(remark);
}


/**
 * 根据序号审核
 * @param ids
 * @param passOrNo
 */
function auditPass(ids,passOrNo) {
	var nurl="";
	if($("#dataType").val()=="tj"){
		nurl="/sjcq/photoTjManage/picTaskAudit";
	}else{
		nurl="/sjcq/photoPicManage/picTaskAudit";
	}
	if($("#taskType").val()==7){
		nurl="/sjcq/broadcastAudit/taskAudit";
	}
	var remark=$("#remarks").val();
	$.ajax({
		url : nurl, 
		dataType : "json", 
		async : true,
		data : {
			tabskIds : ids,
			isPass : passOrNo,
			remark:remark,
			taskType:$("#taskType").val()
		}, 
		type : "post", 
		success : function(data) {$box.promptBox(data.resultInfo);
		if(data.resultStatus==true || data.resultStatus=="true"){		
			$('#myModal').on('hidden.bs.modal', function () {
				searchAuditData();
			});
		}},
		error : function() {
			alert("服务器错误！");
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
/**
 * 编辑
 * @param id
 */

function editInfo(taskXh,updateType,taskId){
	//判断图片或者图集跳转页面
	var url = "../html/auditManage/photoAddOrUpdateEditDetail.html";
	var tabId = "secondUpdate";
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
		"updateType":updateType,
		"taskId":taskId
	});
	pageAddNewTab(tabId, name, url, param);
}