/**
 * 部门管理页js author lxw 2018/01/23
 */
var MODULEID_;// 模块id序号
$(document).ready(function() {
	checksessoin();
	MODULEID_ = GetParamByRequest().MODULEID_;
	initTable();
	// setIframeHeight("user_content",MODULEID_);
});

/**
 * 初始化表格
 * 
 * @param nodeId
 */
function initTable() {
	var userName = $("#depName").val();
	$('#userDataTable').bootstrapTable({
		url : "/sjcq/manage/user/loadUserPageByTearm", // 请求后台的URL（*）
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
				userName : userName,
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
		uniqueId : "userId", // 每一行的唯一标识，一般为主键列
		cardView : false, // 是否显示详细视图
		detailView : false, // 是否显示父子表
		onDblClickRow : function(row) {
			searchDepInfo(row.userId);
		},
		onLoadSuccess : setHeight,
		columns : [ {
			field : 'checdd',
			checkbox : true
		}, {
			field : 'loginName',
			title : '登录名',
			align:'center'
		}, {
			field : 'userName',
			title : '用户名称',
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
			field : 'lastLoginTime',
			title : '上次登陆时间',
			formatter : function(value, row, index) {
				if (value && value != null && value != 'null') {
					return new Date(value).format("yyyy-MM-dd hh:mm:ss");
				} else {
					return value;
				}

			},
			align:'center'
		}, {
			field : 'userRemarks',
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
	html += '<input type="button" value="查看详情"class="report_data_table_but btn btn-primary" onclick="searchDepInfo(\''
			+ row.userId + '\')" style="margin-right: 5px;"/>';
	html += '<input type="button" value="编辑"class="report_data_table_but btn btn-info" onclick="editDepartmentById(\''
			+ row.userId + '\')" style="margin-right: 5px;"/>';
	html += '<input type="button" value="删除"class="report_data_table_but btn btn-danger" onclick="deleteDepartmentById(\''
			+ row.userId + '\')" style="margin-right: 5px;"/>';
	return html;
}
/**
 * 修改html的高度
 */
function setHeight() {
	setIframeHeight("user_content", MODULEID_);
}
/**
 * 检索
 */
function searchDepartment() {
	var userName = $("#depName").val();
	$("#userDataTable").bootstrapTable('getOptions').pageNumber = 1;
	$("#userDataTable")
			.bootstrapTable(
					"refresh",
					{
						query : {
							userName : userName,
							pageIndex : 1,
							pageSize : function() {
								return $("#userDataTable").bootstrapTable(
										'getOptions').pageSize;
							}()
						}
					});
}
/**
 * 新增用户
 */
function addDepartment() {
	var table = "";
	table += "<table style ='margin-left:20%;' id='login_table'>";
	table += "<tr><td>登录名:</td><td>";
	table += '<p id ="news_hint" class = "news_hint"> </p>';
	table += "<input type='text' id='login_name' />";
	table += "</td></tr>";
	table += "<tr><td>用户名:</td><td>";
	table += "<input type='text'  id='userName'/>";
	table += "</td></tr>"
	table += "<tr><td>备注:</td><td>";
	table += "<input type='text'  id='userRemarks'/>";
	table += "</td></tr>"
	table += "</table>";
	$box.promptSureBox(table, "sureAddSave", "");
	$("#myModalLabel").html("新增用户");
}
function sureAddSave() {
	var obj = {};
	var loginName = $("#login_name").val();
	if (loginName.length == 0) {
		$("#news_hint").css("display", "block");
		$("#news_hint").html("登录名不能为空")
		return;
	}
	var userName = $("#userName").val();
	if (userName.length == 0) {
		$("#news_hint").css("display", "block");
		$("#news_hint").html("用户名不能为空")
		return;
	}
	var userRemarks = $("#userRemarks").val();
	obj.loginName = loginName;
	obj.userName = userName;
	obj.userRemarks = userRemarks;
	$.ajax({
		url : "/sjcq/manage/user/addSaveUser", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : obj, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			if (!data.resultStatus) {
				$("#news_hint").css("display", "block");
				$("#news_hint").html(data.resultInfo)
			} else {
				$box.promptBox(data.resultInfo);
				refreshTable();
			}
		},
		error : function() {
			alert("服务器错误！");
		}
	});
}
/**
 * 根据删除
 */
function deleteDepartmentById(depId) {
	$box.promptSureBox("删除不能恢复，请慎重！", "sureDelete", depId);
	$("#myModalLabel").html("删除");
}
/**
 * 批量删除
 */
function batchDeleteDepartmentByIds() {
	var getSelectRows = $("#userDataTable").bootstrapTable('getSelections');
	if (getSelectRows.length <= 0) {
		$box.promptBox('请选择有效数据');
		return;
	}
	var ids = "";
	$.each(getSelectRows, function(i, val) {
		ids += val.userId + ","
	});
	ids = ids.substring(0, ids.length - 1);
	deleteDepartmentById(ids);
}
/**
 * 确认删除
 * 
 * @param ids
 */
function sureDelete(ids) {

	$.ajax({
		url : "/sjcq/manage/user/deleteUserByIds", // 请求的url地址
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
	$("#userDataTable")
			.bootstrapTable(
					"refresh",
					{
						query : {
							pageIndex : 1,
							pageSize : function() {
								return $("#userDataTable").bootstrapTable(
										'getOptions').pageSize;
							}()
						}
					});
}

/**
 * 查看详情
 */
function searchDepInfo(userId) {
	$
			.ajax({
				url : "/sjcq/manage/user/findById", // 请求的url地址
				dataType : "json", // 返回格式为json
				async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
				data : {
					userId : userId
				}, // 参数值
				type : "post", // 请求方式
				success : function(data) {
					var table = "";
					table += "<table style ='margin-left:20%;' id='login_table'>";
					table += "<tr><td>登录名:</td><td>";
					table += '<p id ="news_hint" class = "news_hint"> </p>';
					table += "<input type='text'readonly='readonly' id='login_name' />";
					table += "</td></tr>";
					table += "<tr><td>用户名:</td><td>";
					table += "<input type='text' readonly='readonly' id='userName'/>";
					table += "</td></tr>"
					table += "<tr><td>创建时间:</td><td>";
					table += "<input type='text' readonly='readonly' id='createTime'/>";
					table += "</td></tr>"
					table += "<tr><td>上次登陆时间:</td><td>";
					table += "<input type='text' readonly='readonly' id='lastLoginTime'/>";
					table += "</td></tr>"
					table += "<tr><td>备注:</td><td>";
					table += "<input type='text' readonly='readonly' id='userRemarks'/>";
					table += "</td></tr>"
					table += "</table>";
					$box.promptBox(table);
					$("#myModalLabel").html("用户信息");
					$("#login_name").val(data.loginName);
					$("#userName").val(data.userName);
					$("#createTime").val(
							new Date(data.createTime)
									.format("yyyy-MM-dd hh:mm:ss"));
					if (data.lastLoginTime && data.lastLoginTime != null
							&& data.lastLoginTime != 'null') {
						$("#lastLoginTime").val(
								new Date(data.lastLoginTime)
										.format("yyyy-MM-dd hh:mm:ss"));
					}
					$("#userRemarks").val(data.userRemarks);
				},
				error : function() {
					alert("服务器错误！");
				}
			});

}

/**
 * 编辑
 * 
 * @param depId
 */
function editDepartmentById(userId) {
	$
			.ajax({
				url : "/sjcq/manage/user/findById", // 请求的url地址
				dataType : "json", // 返回格式为json
				async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
				data : {
					userId : userId
				}, // 参数值
				type : "post", // 请求方式
				success : function(data) {
					var table = "";
					table += "<table style ='margin-left:20%;' id='login_table'>";
					table += "<tr><td>登录名:</td><td>";
					table += '<p id ="news_hint" class = "news_hint"> </p>';
					table += "<input type='text'readonly='readonly' id='userId' style='display: none;'/>";
					table += "<input type='text'readonly='readonly' id='login_name' />";
					table += "</td></tr>";
					table += "<tr><td>用户名:</td><td>";
					table += "<input type='text' id='userName'/>";
					table += "</td></tr>"
					table += "<tr><td>备注:</td><td>";
					table += "<input type='text' id='userRemarks'/>";
					table += "</td></tr>"
					table += "</table>";
					$box.promptSureBox(table, "sureEdidSave", "");
					$("#myModalLabel").html("编辑用户");
					$("#userId").val(data.userId);
					$("#login_name").val(data.loginName);
					$("#userName").val(data.userName);
					$("#userRemarks").val(data.userRemarks);
				},
				error : function() {
					alert("服务器错误！");
				}
			});
}
function sureEdidSave() {
	var obj = {};
	var userId = $("#userId").val();
	var loginName = $("#login_name").val();
	var userName = $("#userName").val();
	if (userName.length == 0) {
		$("#news_hint").css("display", "block");
		$("#news_hint").html("用户名不能为空")
		return;
	}
	var userRemarks = $("#userRemarks").val();
	obj.userId = userId;
	obj.loginName = loginName;
	obj.userName = userName;
	obj.userRemarks = userRemarks;
	$.ajax({
		url : "/sjcq/manage/user/editSaveUser", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : obj, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			if (!data.resultStatus) {
				$("#news_hint").css("display", "block");
				$("#news_hint").html(data.resultInfo)
			} else {
				$box.promptBox(data.resultInfo);
				refreshTable();
			}
		},
		error : function() {
			alert("服务器错误！");
		}
	});
}