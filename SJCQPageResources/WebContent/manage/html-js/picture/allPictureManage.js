/**
 * 全部图片管理
 */

$(document).ready(function() {
	allPictureManage();
});


/**
 * 全部图片管理表格展示
 */
function allPictureManage(){
	$('#pictureDataTable').bootstrapTable({
		url : "/sjcq/photoPic/findAll", // 请求后台的URL（*）
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
					searchWord :$("#searchName").val(),
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
		//onLoadSuccess : setHeight,
		columns : [ /*{
			field : 'checdd',
			checkbox : true
		},*/{// 表格结构配置
			title : "图片",// 列title文字
			field : "pic_lylys",// 该列对应数据哪个字段
			//width : "10%",// 列宽度设置,不设也没什么
			align:'center',
			formatter : function(value, row, index) {
				var html ="";
				html+='<div class="hill_img"><div class="hl_img"><img src="'+PICURI+row.pic_lylys+'"></div></div>';
			console.log(html);
				return html;
			}
		}, {
			field : 'pic_scz',
			title : '图片信息',
			//width:'8%',
			align:'center'
		}, {
			field : 'picJg',
			title : '价格',
			//width:'12%',
			align:'center'
		}, {
			field : 'picScsj',
			title : '申请时间',
			width:'20%',
			align:'center'
		}, {
			field : '',
			title : '操作',
			width:'30%',
			align:'center',
			formatter : function(value, row, index) {
				return addOpter(row);
			},
		}]
	});

}

/**
 * 操作栏
 * @param row
 * @returns {String}
 */
function addOpter(row) {
	var html ="";
	html += '<input type="button" value="编辑"class="report_data_table_but btn btn-info" onclick="editInfo('+ row.id + ')" style="margin-right: 5px;"/>';
	html += '<input type="button" value="加入精选"class="report_data_table_but btn btn-danger" onclick="associatedPic('+ row.id + ')" style="margin-right: 5px;"/>';
	html += '<input type="button" value="加入活动"class="report_data_table_but btn btn-primary" onclick="setUse('+ row.id + ')" style="margin-right: 5px;"/>';
	return html;
}

/**
 *条件检索
 */
function searchData(){
	allPictureManage();
}

/**
 * 编辑
 * @param id
 */
function editInfo(id){
	
}

/*
 * 加入精选
 */
function associatedPic(id){
	
}

/*
 * 加入活动
 */
function setUse(id){
	
}