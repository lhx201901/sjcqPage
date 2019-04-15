/**
 * 设计师信息审核管理页js author cl 2018/05/17
 */
var MODULEID_;// 模块id序号
$(document).ready(function() {
	checksessoin();
	MODULEID_ = GetParamByRequest().MODULEID_;
	initTable();

});

/**
 * 切换数据类型
 * @returns
 */
function changeAuditStatu(){
	if($("#auditStatusSel").val()==0){
		//$("#auditButton").css('display','block'); 
		$("#auditButton").attr('disabled',false);
	}else{
		//$("#auditButton").css('display','none');
		$("#auditButton").attr('disabled',true);
	}
	refreshTable();
}
/**
 * 初始化表格
 */
function initTable() {
	var auditStatus = $("#auditStatusSel").val();
	$('#userAuditDataTable').bootstrapTable({
		url : "/sjcq/contributorApply/findByStatuAndPersonType", // 请求后台的URL（*）
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
				personType : 2,
				statu : auditStatus,
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
		uniqueId : "personId", // 每一行的唯一标识，一般为主键列
		cardView : false, // 是否显示详细视图
		detailView : false, // 是否显示父子表
		onLoadSuccess : setHeight,
		columns : [ {
			field : 'checdd',
			checkbox : true
		},
		{
			field : 'real_name',
			title : '真实姓名',
			align : 'center'
		}, {
			field : 'spell_name',
			title : '姓名拼音',
			align : 'center'
		}, {
			field : 'sex',
			title : '性别',
			formatter : function(value, row, index) {
				if(row.sex==1){
					return '男';
				}else{
					return '女';
				}
			},
			align : 'center'
		}, {
			field : 'id_number',
			title : '身份证号',
			align : 'center'
		}, {
			field : 'birth_day',
			title : '出生年月',
			align : 'center'
		},  {
			field : 'region',
			title : '所在地区',
			align : 'center'
		}, {
			field : 'unit',
			title : '所在单位',
			align : 'center'
		}, {
			field : 'address',
			title : '联络地址',
			align : 'center'
		}, {
			field : 'applyTime',
			title : '提交审核时间',
			align : 'center'
		}, {
			field : 'auditStatus',
			title : '审核状态',
			width:'100',
			formatter : function(value, row, index) {
				var text = "";
				if ($("#auditStatusSel").val() == 0) {
					text = "待审核";
				} else if ($("#auditStatusSel").val() == 1) {
					text = "审核通过";
				} else if ($("#auditStatusSel").val() == 2) {
					text = "审核不通过";
				}
				return text;
			},
			align : 'center'
		}, {
			title : '操作',
			field : 'operat',
			align : 'center',
			valign : 'middle',
			width:'300',
			formatter : function(value, row, index) {
				return addOpter(row);
			}
		} ]
	});

}
function addOpter(row) {
	var html = '<input type="button" value="查看详情"class="report_data_table_but btn btn-primary" onclick="searchDesignerInfo(\''+ row.applyXh + '\')" style="margin-right: 5px;"/>';
	if($("#auditStatusSel").val()==0){		
		html+='<input type="button" value="审核"class="report_data_table_but btn btn-info" onclick="userAuditById('+row.applyId+')" style="margin-right: 5px;"/>';
	}
	//	html+='<input type="button" value="审核"class="report_data_table_but btn btn-info" onclick="userAuditById('+row.personId+')" style="margin-right: 5px;"/>';
//	html+='<input type="button" value="权限"class="report_data_table_but btn btn-warning" onclick="userPowerById('+row.personId+','+row.downPower+')" style="margin-right: 5px;"/>';
	return html;
}
/**
 * 修改html的高度
 */
function setHeight() {
	setIframeHeight("userAudit_content", MODULEID_);
}

/**
 * 检索
 */
function searchUserAuditData() {
	var auditStatus = $("#auditStatusSel").val();
	$("#userAuditDataTable").bootstrapTable('getOptions').pageNumber = 1;
	$("#userAuditDataTable").bootstrapTable(
			"refresh",
			{
				query : {
					personType : 2,
					statu : auditStatus,
					pageIndex : 1,
					pageSize : function() {
						return $("#userAuditDataTable").bootstrapTable(
								'getOptions').pageSize;
					}()
				}
			});

}

/**
 * 刷新表格
 */
function refreshTable() {
	var auditStatus = $("#auditStatusSel").val();
	$("#userAuditDataTable").bootstrapTable(
			"refresh",
			{
				query : {
					personType : 2,
					statu : auditStatus,
					pageIndex : 1,
					pageSize : function() {
						return $("#userAuditDataTable").bootstrapTable(
								'getOptions').pageSize;
					}()
				}
			});
}

/**
 * 批量审核
 */
function batchUserAuditByIds() {
	var getSelectRows = $("#userAuditDataTable").bootstrapTable('getSelections');
	if (getSelectRows.length <= 0) {
		$box.promptBox('请选择数据');
		return;
	}
	var ids = "";
	var flag=true;
	$.each(getSelectRows, function(i, val) {
		if (val.auditStatus!=0) {
			flag=false;
		}
		ids += val.applyId + ",";
	});
	ids = ids.substring(0, ids.length - 1);
	/*if(!flag){
		$box.promptBox('请选择待审核的数据');
		return;
	}*/
	var table = "";
	table += "<table style ='margin: 0 auto;' id='audit_table'>";
	table += "<tr><td>备注:</td><td>";
	table += "<textarea id='userRemarks' rows='3' cols='20'></textarea>";
	table += "</td></tr>"
	table += "<tr><td colspan='2' align='center'>";
	table += '<input type="button" value="审核通过" class="report_data_table_but btn btn-primary" onclick="sureAudit(\''+ids+'\',1)"/>';
	table += '<input type="button" value="审核不通过" class="report_data_table_but btn btn-danger" onclick="sureAudit(\''+ids+'\',2)" style="margin-left: 10px;"/>';
	table += "</td></tr>";
	table += "</table>";
	$box.promptBox(table);
	$("#myModalLabel").html("批量审核");
}

/**
 * 单个直接审核
 */
function userAuditById(id) {
	var table = "";
	table += "<table style ='margin: 0 auto;' id='audit_table'>";
	table += "<tr><td>备注:</td><td>";
	table += "<textarea id='userRemarks' rows='3' cols='20'></textarea>";
	table += "</td></tr>"
	table += "<tr><td colspan='2' align='center'>";
	table += '<input type="button" value="审核通过" class="report_data_table_but btn btn-primary" onclick="sureAudit('+id+',1)"/>';
	table += '<input type="button" value="审核不通过" class="report_data_table_but btn btn-danger" onclick="sureAudit('+id+',2)" style="margin-left: 10px;"/>';
	table += "</td></tr>";
	table += "</table>";
	$box.promptBox(table);
	$("#myModalLabel").html("审核");
}

/**
 * 确认
 * @param ids
 * @param passOrNo
 */
function  sureAudit(ids,passOrNo){
	var msg="";
	if(passOrNo==1){
		msg="确认审核通过吗？";
	}else if(passOrNo==2){
		msg="确认审核不通过吗？";
	}
	var param=ids+"\",\""+passOrNo;
	$box.promptSureBox(msg,'auditPass',param);
	$("#myModalLabel").html("确认提示");
}

/**
 * 确认
 * @param ids
 * @param passOrNo
 */
function auditPass(ids,passOrNo) {
	var remark=$("#userRemarks").val();
	$.ajax({
		url : "/sjcq/contributorApply/taskAudit", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {
			ids : ids,
			statu : passOrNo,
			remark:remark
		}, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			$box.promptBox(data.resultInfo);
			refreshTable();
		},
		error : function() {
			alert("服务器错误！");
		}
	});

}

/**
 * 确认授权
 * @param ids
 */
function  surePower(ids){
	var power=$(':radio[name="downPower"]:checked').val();
	if(power==1){
		msg="确认授予下载权限吗？授权的用户可以下载视觉重庆图片源文件。";
		var power=$(':radio[name="downPower"]:checked').val();
		var param=ids+"\",\""+power;
		$box.promptSureBox(msg,'downPower',param);
		$("#myModalLabel").html("确认提示");
	}else{
		var power=$(':radio[name="downPower"]:checked').val();
		downPower(ids,power);
	}
	
}

/**
 * 权限
 */
function userPowerById(id,downPower) {
	var table = "";
	table += "<table style ='margin: 0 auto;' id='audit_table'>";
	table += "<tr><td style='padding-bottom: 20px;'>下载权限:</td><td style='padding-bottom: 20px;'>";
	table += '<input type="radio" name="downPower" value="1">启用';
	table += '<input type="radio" name="downPower" value="0">停用';
	table += "</td></tr>"
	table += "<tr><td colspan='2' align='center'>";
	table += '<input type="button" value="确定" class="report_data_table_but btn btn-primary" onclick="surePower('+id+')"/>';
	table += '<input type="button" value="重置" class="report_data_table_but btn" onclick="resetPower()" style="margin-left: 10px;"/>';
	table += "</td></tr>";
	table += "</table>";
	$box.promptBox(table);
	$(":radio[name='downPower'][value='" + downPower + "']").prop("checked", "checked");
	$("#myModalLabel").html("权限");
}

/**
 * 授权
 * @param ids
 * @param power
 */
function downPower(ids,power) {
	$.ajax({
		url : "/sjcq/person/downPower", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {
			ids : ids,
			downPower: power
		}, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			$box.promptBox(data.resultInfo);
			refreshTable();
		},
		error : function() {
			alert("服务器错误！");
		}
	});

}

/**
 * 查看设计师详情
 * 
 * @param personId
 */
function searchDesignerInfo(applyXh) {
	var url = "../html/userAudit/cameristInfo.html";
	var tabId = "designerInfo";
	var name = "设计师信息";
	var param = JSON.stringify({
		"tabId" : tabId,
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"applyXh" : applyXh
	});
	pageAddNewTab(tabId, name, url, param)
}

/**
 * 将时间戳转换成日期格式
 * 
 * @param timestamp
 * @returns {String}
 */
function timestampToTime(timestamp) {
	var date = new Date(timestamp);// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
	Y = date.getFullYear() + '-';
	M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date
			.getMonth() + 1)
			+ '-';
	D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
	h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
	m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
			+ ':';
	s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
	return Y + M + D + h + m + s;
}
