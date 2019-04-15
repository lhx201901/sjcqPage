/**
 * 角色管理页js author lxw 2018/01/23
 */
var MODULEID_;// 模块id序号
$(document).ready(function() {
	checksessoin();
	MODULEID_ = GetParamByRequest().MODULEID_;

	initTable();
	// setIframeHeight("role_content",MODULEID_);
});

/**
 * 初始化表格
 * 
 * @param nodeId
 */
function initTable() {
	var roleName = $("#roleName").val();
	$('#roleDataTable').bootstrapTable({
		url : "/sjcq/manage/role/loadRoleByPage", // 请求后台的URL（*）
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
				roleName : roleName,
				pageIndex : params.pageNumber,
				pageSize : params.pageSize
			};
			return param;
			// return {
			// offset: params.pageNumber, //页码
			// limit: params.pageSize, //页面大小
			// search: obj,
			// sort: params.sortOrder, //排序
			// order: params.sortName //排序
			// }
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
		uniqueId : "roleId", // 每一行的唯一标识，一般为主键列
		cardView : false, // 是否显示详细视图
		detailView : false, // 是否显示父子表
		onDblClickRow : function(row) {
			searchRoleInfo(row.roleId);
		},
		onLoadSuccess : setHeight,
		columns : [ {
			field : 'checdd',
			checkbox : true
		},/*
			 * { field: 'opter', title: '操作栏', formatter: tableformatter },
			 */
		{
			field : 'roleCode',
			title : '角色代码',
			align:'center'
		}, {
			field : 'roleName',
			title : '角色名称',
			align:'center'
		}, {
			field : 'createTime',
			title : '创建时间',
			formatter : function(value, row, index) {
				if (value && value != null && value != 'null') {
					return new Date(value).format("yyyy-MM-dd hh:mm:ss");
				} else {
					return value;
				}
			},
			align:'center'
		}, {
			field : 'whoCreateName',
			title : '创建者',
			align:'center'
		}, {
			field : 'isUse',
			title : '是否启用',
			formatter : function(value, row, index) {
				var text = "";
				if (row.isUse == 1) {
					text = "启用";
				} else {
					text = "停用";
				}
				return text;
			},
			align:'center'
		}, {
			field : 'roleRemarks',
			title : '备注',
			align:'center'
		}, {
			title : '操作',
			field : 'operat',
			align : 'center',
			valign : 'middle',
			formatter : function(value, row, index) {
				return addOpter(row);
			}
		} ]
	});
}
function addOpter(row) {
	var html = "";
	html += '<input type="button" value="查看"class="report_data_table_but btn btn-primary" onclick="searchRoleInfo(\''
			+ row.roleId + '\')" style="margin-right: 5px;"/>';
	html += '<input type="button" value="权限"class="report_data_table_but btn btn-warning" onclick="changeRolePowerById(\''
			+ row.roleId + '\')" style="margin-right: 5px;"/>';
	html += '<input type="button" value="编辑"class="report_data_table_but btn btn-info" onclick="editRoleById(\''
			+ row.roleId + '\')" style="margin-right: 5px;"/>';
	html += '<input type="button" value="删除"class="report_data_table_but btn btn-danger" onclick="deleteRoleById(\''
			+ row.roleId + '\')" style="margin-right: 5px;"/>';
	return html;
}
/**
 * 修改html的高度
 */
function setHeight() {
	setIframeHeight("role_content", MODULEID_);
}

/**
 * 检索
 */
function searchRoleData() {
	var roleName = $("#roleName").val();
	$("#roleDataTable").bootstrapTable('getOptions').pageNumber = 1;
	$("#roleDataTable")
			.bootstrapTable(
					"refresh",
					{
						query : {
							roleName : roleName,
							pageIndex : 1,
							pageSize : function() {
								return $("#roleDataTable").bootstrapTable(
										'getOptions').pageSize;
							}()
						}
					});
}
/**
 * 新增角色
 */
function addRole() {
	var url = "../html/role/addRole.html";
	var tabId = "addRole";
	var name = "新增角色";
	var param = JSON.stringify({
		"tabId" : tabId,
		MODULEID_ : MODULEID_,
		MAIN_PAGE_ID_ : MODULEID_
	});

	pageAddNewTab(tabId, name, url, param)

}
/**
 * 根据删除
 */
function deleteRoleById(depId) {
	$box.promptSureBox("删除不能恢复，请慎重！", "sureDelete", depId);
	$("#myModalLabel").html("删除");
}
/**
 * 批量删除
 */
function batchDeleteRoleByIds() {
	var getSelectRows = $("#roleDataTable").bootstrapTable('getSelections');
	if (getSelectRows.length <= 0) {
		$box.promptBox('请选择有效数据');
		return;
	}
	var ids = "";
	$.each(getSelectRows, function(i, val) {
		ids += val.roleId + ","
	});
	ids = ids.substring(0, ids.length - 1);
	deleteRoleById(ids);
}
/**
 * 确认删除
 * 
 * @param ids
 */
function sureDelete(ids) {
	$.ajax({
		url : "/sjcq/manage/role/deleteRoleByIds", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {
			ids : ids
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
 * 刷新表格
 */
function refreshTable() {
	$("#roleDataTable")
			.bootstrapTable(
					"refresh",
					{
						query : {
							pageIndex : 1,
							pageSize : function() {
								return $("#roleDataTable").bootstrapTable(
										'getOptions').pageSize;
							}()
						}
					});
}
/**
 * 查看详情
 */
function searchRoleInfo(roleId) {
	var url = "../html/role/roleInfo.html";
	var tabId = "roleInfo";
	var name = "角色信息";
	var param = JSON.stringify({
		"tabId" : tabId,
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"roleId" : roleId,
		"opterType" : 1
	});
	pageAddNewTab(tabId, name, url, param)
}
/**
 * 改变权限
 * 
 * @param roleId
 */
function changeRolePowerById(roleId) {
	var url = "../../manage/html/role/rolePower.html";
	var tabId = "rolePower";
	var name = "编辑角色权限";
	var param = JSON.stringify({
		"tabId" : tabId,
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"roleId" : roleId
	});
	pageAddNewTab(tabId, name, url, param)
}
/**
 * 编辑
 * 
 * @param depId
 */
function editRoleById(roleId) {
	var url = "../html/role/roleInfo.html";
	var tabId = "roleEdit";
	var name = "编辑角色信息";
	var param = JSON.stringify({
		"tabId" : tabId,
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"roleId" : roleId,
		"opterType" : 2
	});
	pageAddNewTab(tabId, name, url, param)
}
