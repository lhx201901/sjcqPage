/**
 * 图片信息审核管理页js
 */
var PARAM={}; //前一个页面传递的参数对象
var MAIN_PAGE_WINDOW = {};//前一个页面对象
var BROADID_ = "";//序号
var IFRAMEID_="";//当前iframid
var MODULEID_;// 模块id序号
var BROAD={};
$(document).ready(function() {
	checksessoin();
	PARAM= GetParamByRequest();
	IFRAMEID_="tab_seed_"+PARAM.tabId;
	BROADID_ = PARAM.broadId;
	MAIN_PAGE_WINDOW = parent.document.getElementById("tab_frame_"+PARAM.MAIN_PAGE_ID_).contentWindow;
	findInfoById(BROADID_);
	MODULEID_ = PARAM.MODULEID_;
	initTable();
});
/**
 * 数据交互，保存修改数据
 * @param BROAD
 */
function save(picXh){
	$box.promptSureBox("是否确定将本图片和轮播图关联？", "saveData",picXh);
}
function saveData(picXh){
	BROAD.picXh=picXh;
	BROAD.updateDate=new Date();
	$.ajax({
	    url:"/sjcq/broadcast/setBroadcast",
	    dataType:"json",
	    async:true,
	    data:BROAD,
	    type:"post",
	    success:function(data){
	    	if(data){
	    		$box.promptBox("保存成功！");
				$('#myModal').on('hidden.bs.modal', function () {
			    	//closeTab(IFRAMEID_);
					parent.closableTab.closeThisTab(PARAM.tabId);
					MAIN_PAGE_WINDOW.searchData();
			    });
	    	}
	    },
	    error:function(){
	    	alert("服务异常！");
	    }
	});
}
/**
 * 根据序号加载详情
 * @param broadId
 */
function findInfoById(broadId){
	if(broadId=="" || broadId==null || broadId==undefined){
		return;
	}
	$.ajax({
	    url:"/sjcq/broadcast/findBroadById",
	    dataType:"json",
	    async:true,
	    data:{id:broadId},
	    type:"post",
	    success:function(data){
	    	if(data){
	    		BROAD=data;
	    	}
	    	console.log(BROAD);
	    },
	    error:function(){
	    	alert("查询加载错误！");
	    }
	})
}
/**
 * 获取参数
 * @returns
 */
function getParams(){
	var searchName = $("#searchName").val();
	var jsonstring = JSON.stringify({table:"d_photo_pic",term:searchName,"type_one":"","type_two":""});
	return jsonstring;
}
/**
 * 初始化表格
 */
function initTable() {
	//var searchWord=getParams();
	$('#pictureDataTable').bootstrapTable({
		url : "/sjcq/retriebe/allSolrSearch", // 请求后台的URL（*）
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
					searchWord :getParams(),
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
		onLoadSuccess : setHeight,
		columns : [ {// 表格结构配置
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
			width:'20%',
			align:'center'
		}, {
			field : 'pic_jg',
			title : '图片价格',
			width:'5%',
			align:'center',
			formatter : function(value, row, index) {
				var text = "";
				var type=$("#auditType").val();	
				if (type == 3) { 
					return "上架价格："+row.pic_prices;
				} else{
					return row.pic_jg;
				}
			},
		},{
			field : 'pic_scsj',
			title : '上传时间',
			formatter : function(value, row, index) {
				if (row.pic_scsj!= null && row.pic_scsj!= 'null') {
					return new Date(new Date(row.pic_scsj)).format("yyyy-MM-dd hh:mm:ss");
				} else {
					return "";
				}

			},
			width:'10%',
			align : 'center'
		}, {
			field : 'pic_mj',
			title : '图片密级',
			align : 'center',
			width:'5%',
			formatter : function(value, row, index) {
				var text = "";
				if (row.pic_mj == 0) {
					text = "非公开";
				} else if (row.pic_mj == 1) {
					text = "公开";
				}
				return text;
			}
		}, {
			field : 'is_shelves',
			title : '上架状态',
			align : 'center',
			width:'5%',
			formatter : function(value, row, index) {
				var text = "";
				if (row.is_shelves == 0) {
					text = "下架";
				} else if (row.is_shelves == 1) {
					text = "上架";
				}
				return text;
			}
		}, {
			field : 'in_audit',
			title : '是否在审核中',
			align : 'center',
			width:'7%',
			formatter : function(value, row, index) {
				var text = "";
				if (row.in_audit == 0) {
					text = "否";
				} else if (row.in_audit == 1) {
					text = "是";
				}
				return text;
			}
		},{
			field : 'is_delete',
			title : '删除状态',
			align : 'center',
			width:'5%',
			formatter : function(value, row, index) {
				var text = "";
				if (row.is_delete == 0) {
					text = "正常";
				} else if (row.is_delete == 1) {
					text = "已删除";
				}
				return text;
			}
		}, {
			title : '操作',
			field : 'operat',
			align : 'center',
			valign : 'middle',
			width:'8%',
			formatter : function(value, row, index) {
				return addOpter(row);
			}
		} ]
	});
}
function addOpter(row) {
	var html = '<input type="button" value="图片详情"class="report_data_table_but btn btn-primary" onclick="searchInfo(\''+ row.pic_xh + '\',\''+row.uuid+'\')" style="margin-right: 5px;"/>';
	html+='<input type="button" value="关联"class="report_data_table_but btn  btn-danger" onclick="save(\''+row.pic_xh+'\')" style="margin-right: 5px;"/>';
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
function searchData() {
	var searchWord=getParams();
	$("#pictureDataTable").bootstrapTable('getOptions').pageNumber = 1;
	$("#pictureDataTable").bootstrapTable("refresh", {
		query : {
			searchWord :searchWord,
			pageIndex : 1,
			orderField:"pic_scsj",
			orderType:"desc",
			pageSize : function() {
				return $("#pictureDataTable").bootstrapTable('getOptions').pageSize;
			}()
		}
	});
}

/**
 * 刷新表格
 */
function refreshTable() {
	var searchWord=getParams();
	$("#pictureDataTable").bootstrapTable("refresh", {
		query : {
			searchWord :searchWord,
			pageIndex : 1,
			orderField:"pic_scsj",
			orderType:"desc",
			pageSize : function() {
				return $("#pictureDataTable").bootstrapTable('getOptions').pageSize;
			}()
		}
	});
}

/**
 * 确认删除
 */
function sureDelete(ids){
	$box.promptSureBox("确认删除么？删除数据不可恢复！",'deleteByIds',ids);
	$("#myModalLabel").html("确认提示");
}

/**
 * 批量删除
 */
function batchDeleteByIds() {
	var getSelectRows = $("#pictureDataTable").bootstrapTable('getSelections');
	if (getSelectRows.length <= 0) {
		$box.promptBox('请选择数据');
		return;
	}
	var ids = "";
	var flag=true;
	$.each(getSelectRows, function(i, val) {
		ids += val.id + ",";
	});
	if(ids.length==0){
		$box.promptBox('请选择有效的数据！');
		return;
	}else{		
		ids = ids.substring(0, ids.length - 1);
	}
	sureDelete(ids);
}

/**
 * 批量删除
 */
function deleteByIds(ids) {
	$.ajax({
		url : "/sjcq/photoPic/physicalDelByIds", 
		dataType : "json", 
		async : true,
		data : {
			ids : ids
		},
		type : "post", 
		success : function(data) {
			$box.promptBox(data.msg+"<br>特别提醒：删除数据会在1-2分钟之内更新，请稍后刷新查看！");
			refreshTable();
		},
		error : function() {
			alert("删除失败！");
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