/**
 * 轮播管理页js
 */
var PARAM={}; //前一个页面传递的参数对象
var MAIN_PAGE_WINDOW = {};//前一个页面对象
var BROADID_ = "";//序号
var IFRAMEID_="";//当前iframid
var BROAD={};
var FILE;
var broadCastXh="";
$(document).ready(function() {
	checksessoin();
	PARAM= GetParamByRequest();
	IFRAMEID_="tab_seed_"+PARAM.tabId;
	BROADID_ = PARAM.broadId;
	MAIN_PAGE_WINDOW = parent.document.getElementById("tab_frame_"+PARAM.MAIN_PAGE_ID_).contentWindow;
	broadCastXh = PARAM.broadCastXh;
	MODULEID_ = PARAM.MODULEID_;
	initTable();

});

/**
 * 初始化表格
 */
function initTable() {
	$('#broadCastDataTable').bootstrapTable({
		url : "/sjcq/broadcastPicInfo/findPicPage", // 请求后台的URL（*）
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
					broadcastXh : broadCastXh,
					isShelves : 0,
					orderBy:"orderNum",
					orderDesc:0,
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
		},{// 表格结构配置
			title : "图片",// 列title文字
			field : "pic_lylys",// 该列对应数据哪个字段
			width : "10%",// 列宽度设置,不设也没什么
			align:'center',
			formatter : function(value, row, index) {
				var html ="";
				html+='<div class="hill_img"><div class="hl_img"><img onclick=clickOne(\''+row.pic_lyljm+'\') ondblclick="clickdbl(\''+row.pic_xh+'\')" src="'+PICURI+row.pic_lylys+'"></div></div>';
				console.log(html);
				return html;
			}
		}, {
			field : 'pic_INFO',
			title : '图片信息',
			width:'65%',
			align:'left',
			formatter : function(value, row, index){
				var html ="";
				html+='<p><span style="font-weight: bold;">标题：</span>'+row.pic_mc+'</p>';
				html+='<p><span style="font-weight: bold;">作者：</span>'+row.pic_scz+'</p>';
				if(row.pic_remark!=null&&row.pic_remark.length>50){
					html+='<p><span style="font-weight: bold;">主说明：</span>'+row.pic_remark.substring(0,50)+'</p>';
				}else{
					html+='<p><span style="font-weight: bold;">主说明：</span>'+row.pic_remark+'</p>';
				}
				if(row.picfremark!=null&&row.picfremark.length>50){
					html+='<p><span style="font-weight: bold;">分说明：</span>'+row.picfremark.substring(0,50)+'</p>';
				}else{
					html+='<p><span style="font-weight: bold;">分说明：</span>'+row.picfremark+'</p>';
				}
				return html;
			}
			
		}, {
			field : 'pic_jg',
			title : '图片价格',
			width:'10%',
			align:'center',
			formatter : function(value, row, index){
				if(row.pic_jg==null || row.pic_jg ==undefined || row.pic_jg=='null'){
					return "";
				}else{
					return "￥"+row.pic_jg;
				}
			}
		}, {
			title : '操作',
			field : 'operat',
			align : 'center',
			width:'15%',
			formatter : function(value, row, index) {
				var html ="";
				html += '<input type="button" value="查看图片" class="report_data_table_but btn btn-info" onclick="showPic(\''+ row.pic_xh + '\')" style="margin-right: 5px;"/>';
				html += '<input type="button" value="删除"class="report_data_table_but btn btn-danger" onclick="sureDel('+ row.broPicId + ')" style="margin-right: 5px;"/>';
				return html;
			}
		} ]
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

function showPic(picXh){
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
			broadcastXh : broadCastXh,
			isShelves : 0,
			orderBy:"orderNum",
			orderDesc:0,
			pageIndex : 1,
			pageSize : function() {
				return $("#broadCastDataTable").bootstrapTable('getOptions').pageSize;
			}()
		}
	});
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
		ids += val.broPicId + ",";
	});
	ids = ids.substring(0, ids.length - 1);
	sureDel(ids);
}

/**
 * 确认删除
 * @param ids
 */
function  sureDel(ids){
	$box.promptSureBox("确认删除轮播链接图片么？",'del',ids);
	$("#myModalLabel").html("确认提示");
}

/**
 * 删除
 */
function del(ids){
	$.ajax({
//		url : "/sjcq/broadcast/delBroad", 
		url : "/sjcq/broadcastPicInfo/deleteByIdIn", 
		dataType : "json", 
		async : true,
		data : {
			id : ids
		}, 
		type : "post", 
		success : function(data) {
			$box.promptBox("操作成功！");
			$('#myModal').on('hidden.bs.modal', function () {
				searchData();
		    });
		},
		error : function() {
			alert("服务器错误！");
		}
	});
}