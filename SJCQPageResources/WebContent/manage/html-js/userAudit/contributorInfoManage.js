/**
 * 供稿人信息管理页（改）js author xzq 2018/05/17
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
	refreshTable();
}
/**
 * 初始化表格
 */
function initTable() {
	$('#userAuditDataTable').bootstrapTable({
		url : "/sjcq/pAndD/getContributorPage", // 请求后台的URL（*）
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
				personType : $("#personType").val(),
				statu : 1,
				orderDesc:1,
				searchWord:$("#area_name").val(),
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
		onDblClickRow : function(row) {
			searchDesignerInfo(row.uuid);
		},
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
	var html = '<input type="button" value="查看详情"class="report_data_table_but btn btn-primary" onclick="searchDesignerInfo(\''+ row.uuid + '\')" style="margin-right: 5px;"/>';
	html+='<input type="button" value="编辑"class="report_data_table_but btn btn-success" onclick="updateContributorInfo(\''+row.uuid+'\')" style="margin-right: 5px;"/>';
	html+='<input type="button" value="删除"class="report_data_table_but btn btn-danger" onclick="deleteById(\''+row.uuid+'\')" style="margin-right: 5px;"/>';
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
	var searchWord=$("#area_name").val();
	searchWord = searchWord.replace(/(^\s*)/g, "");//去掉左边空格
	searchWord = searchWord.replace(/(\s*$)/g, "");//去掉右边空格
	searchWord = searchWord.replace(/\s+/g, "@#@");
	$("#userAuditDataTable").bootstrapTable('getOptions').pageNumber = 1;
	$("#userAuditDataTable").bootstrapTable(
			"refresh",
			{
				query : {
					personType : $("#personType").val(),
					statu : 1 ,
					searchWord:searchWord,
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
	var searchWord=$("#area_name").val();
	searchWord = searchWord.replace(/(^\s*)/g, "");//去掉左边空格
	searchWord = searchWord.replace(/(\s*$)/g, "");//去掉右边空格
	searchWord = searchWord.replace(/\s+/g, "@#@");	
	$("#userAuditDataTable").bootstrapTable(
			"refresh",
			{
				query : {
					personType : $("#personType").val(),
					statu : 1,
					searchWord:searchWord,
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
function batchDeleteContributor() {
	var getSelectRows = $("#userAuditDataTable").bootstrapTable('getSelections');
	if (getSelectRows.length <= 0) {
		$box.promptBox('请选择数据');
		return;
	}
	var ids = "";
	var flag=true;
	$.each(getSelectRows, function(i, val) {
		ids+=val.uuid+",";
	});
	ids = ids.substring(0, ids.length - 1);
	$box.promptSureBox("删除不可恢复，是否确定删除当前选中的数据！", "sureDelete", ids);
}

/**
 * 单个直接审核
 */
function deleteById(uuid) {
	$box.promptSureBox("删除不可恢复，是否确定删除当前选中的数据！", "sureDelete", uuid);
}

/**
 * 确认
 * @param ids
 * @param passOrNo
 */
function  sureDelete(uuid){
	$.ajax({
		url : "/sjcq/pAndD/deletePhotographerAndDesigner", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {uuid:uuid}, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			if(data==true||data=='true'){				
				$box.promptBox("删除供稿人信息成功！！");
				refreshTable();
			}else{
				$box.promptBox("删除供稿人信息失败！！");
			}
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
function searchDesignerInfo(uuid) {
	var url = "../html/userAudit/cameristInfo.html";
	var tabId = "designerInfo";
	var name = "供稿人信息";
	var param = JSON.stringify({
		"tabId" : tabId,
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"uuid" : uuid,
		"type":1
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

/**
 * 添加供稿人信息
 * 
 * @param roleId
 */
function addContributor() {
	var url = "../html/userAudit/addContributor.html";
	var tabId = "addCon";
	var name = "添加供稿人信息";
	var param = JSON.stringify({
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_
	});
	pageAddNewTab(tabId, name, url, param)
}
/**
 * 修改供稿人信息
 * @param conXh
 */
function updateContributorInfo(conXh){
	var url = "../html/userAudit/updateContributor.html";
	var tabId = "addCon";
	var name = "编辑供稿人信息";
	var param = JSON.stringify({
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		uuid:conXh
	});
	pageAddNewTab(tabId, name, url, param)
}