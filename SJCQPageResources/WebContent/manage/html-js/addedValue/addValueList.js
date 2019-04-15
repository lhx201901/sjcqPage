/**
 * 增值服务
 */
var MODULEID_;// 模块id序号
$(document).ready(function() {
	checksessoin();
	MODULEID_ = GetParamByRequest().MODULEID_;
	initTable();
});

/**
 * 初始化表格
 */
function initTable() {
	$('#broadCastDataTable').bootstrapTable({
		url : "/sjcq/ptgyatv/searchAddedValueByPages", // 请求后台的URL（*）
		classes : "table table-no-bordered",
		responseHandler:function(res){
			return res.data;
		},
		striped : true, // 是否显示行间隔色
		pagination : true, // 是否显示分页（*）
		sortable : false, // 是否启用排序
		method : "post",
		contentType : "application/x-www-form-urlencoded; charset=UTF-8",
		sortOrder : "asc", // 排序方式
		sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
		queryParamsType : "",
		queryParams : function(params) {
			var searchWord = $("#searchName").val();
			var param = {
				//	searchWord : searchWord,
				//	orderDesc:1,
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
		onDblClickRow : function(row) {
			editInfo(row.id);
		},
		onLoadSuccess : setHeight,
		columns : [ {
			field : 'checdd',
			checkbox : true
		}, {
			field : 'savTitle',
			title : '标题',
		}, {
			field : 'savExplain',
			title : '说明',
		}, {
			field : 'savBgpic',
			title : '路径',
		},   {
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
	var html ="";
	html += '<input type="button" value="编辑"class="report_data_table_but btn btn-info" onclick="editInfo('+ row.id + ')" style="margin-right: 5px;"/>';

	return html;
}
/**
 * 修改html的高度
 */
function setHeight() {
	setIframeHeight("broadCast_content", MODULEID_);
}

/**
 * 检索
 */
function searchData() {
	$("#broadCastDataTable").bootstrapTable('getOptions').pageNumber = 1;
	$("#broadCastDataTable").bootstrapTable("refresh", {
		query : {
			pageIndex : 1,
			pageSize : function() {
				return $("#broadCastDataTable").bootstrapTable('getOptions').pageSize;
			}()
		}
	});
}

/**
 * 编辑
 * @param id
 */
function editInfo(id) {
	var url = "../html/addedValue/addedValue.html";
	var tabId = "editBroad";
	var name = "编辑增值服务信息";
	var param = JSON.stringify({
		"tabId" : tabId,
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"broadId" : id,
		"optType":"edit"
	});
	pageAddNewTab(tabId, name, url, param);
}

/**
 * 新增
 * @param id
 */
function addInfo() {
	var url = "../html/addedValue/addedValue.html";
	var tabId = "addBroad";
	var name = "新增增值服务";
	var param = JSON.stringify({
		"tabId" : tabId,
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"optType":"add"
	});
	pageAddNewTab(tabId, name, url, param);
}

/**
 * 批量删除
 */
function batchDel(){
	var getSelectRows = $("#broadCastDataTable").bootstrapTable('getSelections');
	if (getSelectRows.length <= 0) {
		$box.promptBox('请选择数据');
		return;
	}
	var ids = "";
	var flag=true;
	$.each(getSelectRows, function(i, val) {
		if (val.isUsed!=0) {
			flag=false;
		}
		ids += val.id + ",";
	});
	if(!flag){
		$box.promptBox('只有停用的轮播图片才能删除！');
		return;
	}
	ids = ids.substring(0, ids.length - 1);
	sureDel(ids);
}

/**
 * 确认删除
 * @param ids
 */
function  sureDel(ids){
	$box.promptSureBox("确认删除么？",'del',ids);
	$("#myModalLabel").html("确认提示");
}

/**
 * 删除
 */
function del(ids){
	$.ajax({
		url : "/sjcq/broadcast/delBroad", 
		dataType : "json", 
		async : true,
		data : {
			ids : ids
		}, 
		type : "post", 
		success : function(data) {
			$box.promptBox(data.resultInfo);
			$('#myModal').on('hidden.bs.modal', function () {
				searchData();
		    });
		},
		error : function() {
			alert("服务器错误！");
		}
	});
}


