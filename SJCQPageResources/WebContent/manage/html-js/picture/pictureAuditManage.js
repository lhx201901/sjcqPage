/**
 * 图片信息审核管理页js
 */
var MODULEID_;// 模块id序号
$(document).ready(function() {
	checksessoin();
	MODULEID_ = GetParamByRequest().MODULEID_;
	initTable();
	$("#auditType").change(function(){
		refreshTable();
	});
	$('#searchName').keydown(function(e){
		if(e.keyCode==13){
			searchAuditData();
		}
	})
});
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
	
	$('#pictureAuditDataTable').bootstrapTable({
		url : "/sjcq/manage/audit/findAuditPageInfo", // 请求后台的URL（*）
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
					term :JSON.stringify(getParams()),
					orderType:1,
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
				html+='<div class="hill_img"><div class="hl_img"><img src="'+PICURI+row.pic_lylys+'"></div></div>';
			console.log(html);
				return html;
			}
		}, {
			field : 'pic_scz',
			title : '图片所属者',
			width:'8%',
			align:'center'
		}, {
			field : 'pic_mc',
			title : '图片标题',
			width:'12%',
			align:'center'
		}, {
			field : 'pic_remark',
			title : '图片说明',
			width:'40%',
			align:'center'
		}, {
			field : 'pic_jg',
			title : '图片价格',
			width:'12%',
			align:'center'/*,
			formatter : function(value, row, index) {
				var text = "";
				var type=$("#auditType").val();	
				if (type == 3) { 
					return "上架价格："+row.pic_prices;
				} else{
					return row.pic_jg;
				}
			},*/
		}, {
			field : 'submit_time',
			title : '申请时间',
			width:'12%',
			align:'center'
		}, {
			field : 'audit_statu',
			title : '审核状态',
			width:'8%',
			formatter : function(value, row, index) {
				var text = "";
				if (row.audit_statu == 0) { 
					text = "待审核";
				} else if (row.audit_statu == 1) {
					text = "审核通过";
				} else if (row.audit_statu == 2) {
					text = "审核不通过";
				}
				return text;
			},
			align:'center'
			
		}, {
			title : '操作',
			field : 'operat',
			align : 'center',
			valign : 'middle',
			width:'240',
			formatter : function(value, row, index) {
				return addOpter(row);
			}
		} ]
	});
}
function addOpter(row) {
	var html = "";
	html += '<input type="button" value="图片详情"class="report_data_table_but btn btn-primary" onclick="showPicInfo(\'' + row.pic_xh + '\')" style="margin-right: 5px;"/>';
	html += '<input type="button" value="添加"class="report_data_table_but btn btn-danger" onclick="addPicture(\'' + row.hotPid + '\')" style="margin-right: 5px;"/>';
	return html;
}

/**
 * 查看详情
 * @param picXh
 */
function showPicInfo(picXh){
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
	var obj=getParams();
	$("#pictureAuditDataTable").bootstrapTable('getOptions').pageNumber = 1;
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
	$.each(getSelectRows, function(i, val) {
		if (val.audit_statu==0) {
			ids += val.id + ",";
		}
	});
	if(ids.length==0){
		$box.promptBox('请选择有效的数据审核！');
		return;
	}else{		
		ids = ids.substring(0, ids.length - 1);
	}
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
	$("#myModalLabel").html("批量审核");
}

/**
 * 单个审核
 * @param id
 */
function auditById(id) {
	var table = "";
	table += "<table style ='margin: 0 auto;' id='audit_table'>";
	table += "<tr><td>备注:</td><td>";
	table += "<textarea id='remarks' rows='3' cols='20'></textarea>";
	table += "</td></tr>"
	table += "<tr><td colspan='2' align='center'>";
	table += '<input type="button" value="审核通过" class="report_data_table_but btn btn-primary" onclick="auditPass('+id+',1)"/>';
	table += '<input type="button" value="审核不通过" class="report_data_table_but btn btn-danger" onclick="auditPass('+id+',0)" style="margin-left: 10px;"/>';
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
	var remark=$("#remarks").val();
	$.ajax({
		url : "/sjcq/manage/audit/taskAudit", 
		dataType : "json", 
		async : true,
		data : {
			auditIds : ids,
			statu : passOrNo,
			remark:remark
		}, 
		type : "post", 
		success : function(data) {
			var statu="审核失败！！";
			if(data==true){
				statu="审核成功！！";
			}
			$box.promptBox(statu);
			$("#myModal").on("hidden",function(){		
			});
			refreshTable();
		},
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
function editInfo(id) {
	var url = "../html/picture/editPicture.html";
	var tabId = "editPicture";
	var name = "编辑图片信息";
	var param = JSON.stringify({
		"tabId" : tabId,
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"pictureId" : id
	});
	pageAddNewTab(tabId, name, url, param);
}