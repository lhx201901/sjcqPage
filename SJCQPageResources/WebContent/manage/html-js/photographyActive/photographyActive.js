/**
 * 区县管理js 
 **/
var MODULEID_ ;//模块id序号
$(document).ready(function(){
	checksessoin();
	MODULEID_ = GetParamByRequest().MODULEID_;
	initDate();
	initTable();
});

function initDate(){
	 //初始化年度
    $(".searchDate").datetimepicker({
        startView: 'decade',
        minView: 'decade',
        format: 'yyyy',
        autoclose: true,
        language: 'zh-CN',
        todayBtn: true//显示今日按钮
    });
}
/*
 *初始化区县信息列表 
 */
function initTable() {
    $('#activeDataTable').bootstrapTable({
        url: "/sjcq/ptgyatv/searchActiveData",  //请求后台的URL（*）
        classes: "table table-no-bordered",
        striped: true,   //是否显示行间隔色
        pagination: true,   //是否显示分页（*）
        sortable: false,   //是否启用排序
        method: "post",
        contentType:"application/x-www-form-urlencoded; charset=UTF-8",
        sortOrder: "asc",   //排序方式
        sidePagination: "server",  //分页方式：client客户端分页，server服务端分页（*）
        queryParamsType: "",
        queryParams: function (params) {
        	var param = {
        			type:$("#activ_type").val(),
        			text:$("#area_name").val(),
//        			isDelete:$("#activ_isDelete").val(),
            		pageIndex: params.pageNumber,    
	            	pageSize: params.pageSize
	            };    
	            return param; 
        },
        maintainSelected: true,//设置为 true 在点击分页按钮或搜索按钮时，将记住checkbox的选择项
        clickToSelect: true,//设置true 将在点击行时，自动选择rediobox 和 checkbox
        selectItemName: "checdd",
        //  search:true,
        pageNumber: 1,   //初始化加载第一页，默认第一页
        pageSize: 10,   //每页的记录行数（*）
        pageList: [5, 10, 50, 100], //可供选择的每页的行数（*）
        smartDisplay:false,
        strictSearch: false,
        //height: 460,   //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "id",   //每一行的唯一标识，一般为主键列
        cardView: false,   //是否显示详细视图
        detailView: false,   //是否显示父子表
        onLoadSuccess:setHeight,
        columns: [{
            field: 'checdd',
            checkbox: true
        	},{
                field: 'atyTitle',
                title: '活动标题',
                align: 'center'
            },{
                field: 'atyAwards',
                title: '活动奖项',
                align: 'center'
            },{
                field: 'atyReleaseUnit',
                title: '活动发布单位',
                align: 'center'
            },{
                field: 'atyCtStartTime',
                title: '活动召集起始时间',
                align: 'center'
            },{
                field: 'atyCtEndTime',
                title: '活动召集终止时间',
                align: 'center'
            },{
                field: 'atyExecuteStartTime',
                title: '活动进行起始时间',
                align: 'center'
            },{
                field: 'atyExecuteEndTime',
                title: '活动进行结束时间',
                align: 'center'
            },{
                field: 'statusInfo',
                title: '活动状态',
                align: 'center'
            }/*,{
                field: 'isDelete',
                title: '删除状态',
                align: 'center',
                formatter:function(value, row, index){
                	if(row.isDelete==0){
                		return "正常";
                	}else if(row.isDelete==1){
                		return "已删除";
                	}
                }
            }*/
            /*,{
                field: 'atyPageUrl',
                title: '活动网页链接',
                align: 'center'
            },{
                field: 'atyCoverImg',
                title: '活动封面图片',
                align: 'center'
            }*/,{
                field: 'opt',
                title: '操作',
                align: 'center',
                formatter:function(value, row, index){
                	return addOpter(row);
                }
            }]
    });
}
/*添加操作栏*/
function addOpter(row) {
	var html ="";
	html += '<input type="button" value="编辑活动简介"class="searchBtn btn" onclick="editActiveInfo(\''+ row.atyXh + '\')" />';
/*	html += '<input type="button" value="上传活动图片" class="btn backBtn" onclick="toUpload(\''+ row.atyXh + '\')" />';
	html += '<input type="button" value="管理活动图片" class="restBtn btn" onclick="toManage(\''+ row.atyXh + '\')" />';*/
	html += '<input type="button" value="编辑"class="btn editBtn" onclick="editInfo('+ row.id + ')" />';
	html += '<input type="button" value="删除"class=" btn delBtn" onclick="deleteByIds('+ row.id + ')" />';
	return html;
}


/**
 * 新增
 * @param id
 */
function addAreaInfo() {
	var url = "../html/photographyActive/addOrEditPTA.html";
	var tabId = "addBroad";
	var name = "新增活动";
	var param = JSON.stringify({
		"tabId" : tabId,
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"optType":"add"
	});
	pageAddNewTab(tabId, name, url, param);
}



/**
 * 编辑
 * @param id
 */
function editInfo(id) {
	var url = "../html/photographyActive/addOrEditPTA.html";
	var tabId = "editBroad";
	var name = "编辑活动";
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
 * 检索
 */
function searchData() {
	$("#activeDataTable").bootstrapTable('getOptions').pageNumber = 1;
	$("#activeDataTable").bootstrapTable("refresh", {
		query : {
			type:$("#activ_type").val(),
			text:$("#area_name").val(),
//			isDelete:$("#activ_isDelete").val(),
			pageIndex : 1,
			pageSize : function() {
				return $("#activeDataTable").bootstrapTable('getOptions').pageSize;
			}()
		}
	});
}

/*
 * 修改页面高度
 */
function setHeight(){
	setIframeHeight("area_content_div",MODULEID_);
}

/**
 * 上传活动图片
 * @param id
 */
function toUpload(atyXh) {
	var url = "../html/photographyActive/upload.html";
	var tabId = "uploadActive";
	var name = "上传活动图片";
	var param = JSON.stringify({
		"tabId" : tabId,
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"atyXh" : atyXh
	});
	pageAddNewTab(tabId, name, url, param);
}

/**
 * 管理活动图片
 * @param id
 */
function toManage(atyXh) {
	var url = "../html/photographyActive/photoManage.html";
	var tabId = "photoManage";
	var name = "管理活动图片";
	var param = JSON.stringify({
		"tabId" : tabId,
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"atyXh" : atyXh
	});
	pageAddNewTab(tabId, name, url, param);
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
	var getSelectRows = $("#activeDataTable").bootstrapTable('getSelections');
	if (getSelectRows.length <= 0) {
		$box.promptBox('请选择数据');
		return;
	}
	var ids = "";
	var flag=true;
	$.each(getSelectRows, function(i, val) {
//		if (val.audit_statu==0) {
//			ids += val.id + ",";
//		}
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
		url : "/sjcq/ptgyatv/deleteDataByIds", //物理删除，逻辑删除logicDeleteByIds、物理删除deleteDataByIds
		dataType : "json", 
		async : true,
		data : {
			ids : ids
		},
		type : "post", 
		success : function(data) {
			if(data.resultStatus){
				$box.promptBox("删除成功");
				searchData();
			}else{
				$box.promptBox("删除失败！");
			}
		},
		error : function() {
			$box.promptBox("删除失败！");
		}
	});

}

/**
 * 编辑活动详情
 */

function editActiveInfo(id){
	var url = "../html/photographyActive/activeTempEdit.html";
	var tabId = "editActvEdit";
	var name = "编辑活动详情";
	var param = JSON.stringify({
		"tabId" : tabId,
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"activeId" : id,
		"optType":"edit"
	});
	pageAddNewTab(tabId, name, url, param);
}
