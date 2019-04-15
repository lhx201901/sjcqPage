/**
 * 图集审核管理页js
 */
var MODULEID_;// 模块id序号
$(document).ready(function() {
	checksessoin();
	MODULEID_ = GetParamByRequest().MODULEID_;
	initTable();
	$("#auditType").change(function(){
		refreshTable();
	});
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
	audit.beanName="PhotoTjBean";
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
	//var obj=getParams();
	$('#atlasAuditDataTable').bootstrapTable({
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
			var param = {
				term :JSON.stringify(getParams()),
				pageIndex : params.pageNumber,
				pageSize : params.pageSize,
				orderType:1
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
		},/*
			 * { field: 'opter', title: '操作栏', formatter: tableformatter },
			 */
		{
			field : 'tj_scz',
			title : '图集上传者',
			align : 'center'
		}, {
			field : 'tj_mc',
			title : '图集标题',
			width:'15%',
			align : 'center'
		}, {
			field : 'tj_remark',
			title : '图集说明',
			width:'30%',
			align : 'center'
		}, {
			field : 'tj_sl',
			title : '图片总量',
			width:'6%',
			align : 'center'
		}, {
			field : 'submit_time',
			title : '申请时间',
			/*formatter : function(value, row, index) {
				if (value && value != null && value != 'null') {
					alert(new Date("1536656057000").format("yyyy-MM-dd hh:mm:ss"));
					return new Date(value.trim()).format("yyyy-MM-dd hh:mm:ss");
				} else {
					return value;
				}

			},*/
			align : 'center'
		}, {
			field : 'status',
			title : '审核状态',
			align : 'center',
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
			}
		}, {
			title : '操作',
			field : 'operat',
			align : 'center',
			valign : 'middle',
			width:'200',
			formatter : function(value, row, index) {
				return addOpter(row);
			}
		} ]
	});
}
function addOpter(row) {
	var html = '<input type="button" value="图集详情"class="report_data_table_but btn btn-primary" onclick="searchInfo(\''+ row.tj_xh + '\',\''+row.uuid+'\')" style="margin-right: 5px;"/>';
	if(row.audit_statu==0){
		html+='<input type="button" value="审核"class="report_data_table_but btn btn-info" onclick="auditById('+row.id+')" style="margin-right: 5px;"/>';
	}else{
		html+='<input type="button" value="审核信息"class="report_data_table_but btn btn-warning" onclick="auditDetail(\''+row.audit_remark+'\',\''+row.data_audit_person+'\',\''+row.audit_time+'\')" style="margin-right: 5px;"/>';
	}
	return html;
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
 * 修改html的高度
 */
function setHeight() {
	setIframeHeight("atlasAudit_content", MODULEID_);
}

/**
 * 检索
 */
function searchAuditData() {
	var obj=getParams();
	$("#atlasAuditDataTable").bootstrapTable('getOptions').pageNumber = 1;
	$("#atlasAuditDataTable").bootstrapTable("refresh", {
		query : {
			term : JSON.stringify(obj),
			pageIndex : 1,
			orderType:1,
			pageSize : function() {
				return $("#atlasAuditDataTable").bootstrapTable('getOptions').pageSize;
			}()
		}
	});
}

/**
 * 刷新表格
 */
function refreshTable() {
	var obj=getParams();
	$("#atlasAuditDataTable").bootstrapTable("refresh", {
		query : {
			term : JSON.stringify(obj),
			orderType:1,
	    	pageIndex: 1,
			pageSize : function() {
				return $("#atlasAuditDataTable").bootstrapTable('getOptions').pageSize;
			}()
		}
	});
}

/**
 * 批量审核
 */
function batchAuditByIds() {
	var getSelectRows = $("#atlasAuditDataTable").bootstrapTable('getSelections');
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
 * 根据序号审核
 * @param ids
 * @param passOrNo
 */
function auditPass(ids,passOrNo) {
	//alert(ids);
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
function searchInfo(tjXh,audituuid) {
	if($("#auditType").val()==2){
		var url = "../html/photoDetail/photoDetail2.html";
		var tabId = "photoDetail";
		var name = "图集详情页";
		var param = JSON.stringify({
			"tabId" : tabId,
			"MODULEID_" : MODULEID_,
			"MAIN_PAGE_ID_" : MODULEID_,
			"tjXh" : tjXh,
			"auditUuid":audituuid
		});
		pageAddNewTab(tabId, name, url, param)
	}else{//图片信息展示
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
}
