/**
 * 部门管理页js author lxw 2018/01/23
 */
var MODULEID_;// 模块id序号
var PARAM={}; //前一个页面传递的参数对象
var MAIN_PAGE_WINDOW = {};//前一个页面对象
var dataXh="";
var dataType="";
var URL_="";
$(document).ready(function() {
	checksessoin();
	PARAM= GetParamByRequest();
	IFRAMEID_="tab_seed_"+PARAM.tabId;
	AREAID_ = PARAM.areaId;
	OPTTYPE=PARAM.optType;
	MAIN_PAGE_WINDOW = parent.document.getElementById("tab_frame_"+PARAM.MAIN_PAGE_ID_).contentWindow;
	MODULEID_ = PARAM.MODULEID_;
	dataXh = PARAM.dataXh;
	dataType = PARAM.dataType;
	initTable();
	// setIframeHeight("user_content",MODULEID_);
});

/**
 * 初始化表格
 * 
 * @param nodeId
 */
function initTable() {
	if(dataType=="pic"){
		URL_="/sjcq/photoPicManage/getPicManageHistoryPageInfo";
	}else if(dataType=="tj"){
		URL_="/sjcq/photoTjManage/getTjManageHistoryPageInfo";
	}
	$("#userDataTable").bootstrapTable("destroy");
	$('#userDataTable').bootstrapTable({
		url : URL_, // 请求后台的URL（*）
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
					/*manageType : $("#taskType").val(),
					photoSource : $("#dataSource").val(),
					tjSource : $("#dataSource").val(),
					manageState : $("#auditType").val(),
					picMc : $("#searchWord").val(),
					tjMc : $("#searchWord").val(),*/
					orderBy:"id",
					tjXh:dataXh,
					picXh:dataXh,
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
		uniqueId : "id", // 每一行的唯一标识，一般为主键列
		cardView : false, // 是否显示详细视图
		detailView : false, // 是否显示父子表
		/*onDblClickRow : function(row) {
			searchInfo(row.id);
		},*/
		onLoadSuccess : setHeight,
		columns : getCloumn()
	});
}
function getCloumn(){
	if(dataType=="pic"){
		var cloumns=[ {// 表格结构配置
			title : "图片",// 列title文字
			field : "pic_lylys",// 该列对应数据哪个字段
			width : "10%",// 列宽度设置,不设也没什么
			align:'center',
			formatter : function(value, row, index) {
				var html ="";
				html+='<div class="hill_img"><div class="hl_img"><img onclick=clickOne(\''+row.picLyljm+'\') ondblclick="clickdbl(\''+row.picXh+'\')" src="'+PICURI+row.picLylys+'"></div></div>';
				console.log(html);
				return html;
			}
		}, {
			field : 'pic_INFO',
			title : '图片信息',
			width:'35%',
			align:'left',
			formatter : function(value, row, index){
				var html ="";
				html+='<p><span style="font-weight: bold;">标题：</span>'+row.picMc+'</p>';
				html+='<p><span style="font-weight: bold;">作者：</span>'+row.picScz+'</p>';
				if(row.picRemark!=null&&row.picRemark.length>50){
					html+='<p><span style="font-weight: bold;">主说明：</span>'+row.picRemark.substring(0,50)+'</p>';
				}else{
					html+='<p><span style="font-weight: bold;">主说明：</span>'+row.picRemark+'</p>';
				}
				if(row.picFRemark!=null&&row.picFRemark.length>50){
					html+='<p><span style="font-weight: bold;">分说明：</span>'+row.picFRemark.substring(0,50)+'</p>';
				}else{
					html+='<p><span style="font-weight: bold;">分说明：</span>'+row.picFRemark+'</p>';
				}
				return html;
			}
			
		}, {
			field : 'pic_jg',
			title : '图片价格',
			width:'8%',
			align:'center',
			formatter : function(value, row, index){
				if(row.picJg==null || row.picJg ==undefined || row.picJg=='null'){
					return "";
				}else{
					return "￥"+row.picJg;
				}
			}
		}, {
			field : 'task_type',
			title : '任务类型',
			width:'10%',
			align:'center',
			formatter : function(value, row, index) {
				var html="";
				if(row.manageType==null || row.manageType==undefined ||
						row.manageType=="null" || row.manageType=="NULL" || row.manageType=="-1"){
					return "无审核任务";
				}else if (row.manageType==0){
					return "图片新增";
				}else if(row.manageType==1){
					return "图片编辑";
				}else if(row.manageType==2){
					return "图片删除";
				}else if(row.manageType==6){
					return "图片上架";
				}else if(row.manageType==3){
					html="关联轮播";
				}else if(row.manageType==4){
					html="关联编辑精选";
				}else if(row.manageType==5){
					html="加入区县";
				}else if(row.manageType==8){
					html="加入活动";
				}
				return html;
			}
		},  {
			field : 'audit_statu',
			title : '审核状态',
			width:'8%',
			formatter : function(value, row, index) {
				var text = "无审核状态";
				if(row.manageState!=null && row.manageState!=undefined && row.manageState!="null" && row.manageState!="NULL"){
					if (row.manageState == 2) { 
						text = "待审核";
					} else if (row.manageState == 3) {
						text = "审核通过";
					} else if (row.manageState == 4) {
						text = "审核不通过";
					} else if (row.manageState==1){
						text="未提交";
					} else{
						text="无审核状态";
					}	
				}
				return text;
			},
			align:'center'
			
		}, {
			field : 'bz',
			title : '备注',
			width:'10%',
			align:'center',
			formatter : function(value, row, index){
				var html="";
				if(row.manageType!=null && row.manageType!=undefined && row.manageType!="null" && row.manageType!="NULL"){
					if(row.manageType==3){
						html="关联轮播标题("+row.broaCastContent+")";
					}else if(row.manageType==4){
						html="关联精选分类("+row.editSelectSortName+")";
					}else if(row.manageType==5){
						html="关联区县("+row.areaName+")";
					}else if(row.manageType==8){
						html="关联活动标题("+row.atyTitle+")";
					}
				}
				return html;
			}
		}, {
			title : '操作',
			field : 'operat',
			align : 'center',
			width:'18%',
			formatter : function(value, row, index) {
				var html="";
				if(row.manageType==1||row.manageType==0){						
					html='<input type="button" value="编辑详情" class="report_data_table_but btn btn-primary" onclick="editInfo(\''+row.auditUuid+'\',\''+row.updateType+'\',\''+row.id+'\',\''+row.manageState+'\')"/>';
				}
				if(row.manageState!=2){
					html+='<input type="button" value="审核信息" class="report_data_table_but btn btn-inverse" onclick="auditInfo(\''+row.auditUserName+'\',\''+row.auditTime+'\',\''+row.auditRemark+'\')"/>';
				}
				html += '<input type="button" value="图片详情" class="report_data_table_but btn btn-info" onclick="clickdbl(\''+row.picXh+'\')" style="margin-right: 5px;"/>';
				return html;
			}
		}]
		return cloumns;
	}else{
		var cloumns=[ {// 表格结构配置
			title : "图集封面",// 列title文字
			field : "pic_lylys",// 该列对应数据哪个字段
			width : "10%",// 列宽度设置,不设也没什么
			align:'center',
			formatter : function(value, row, index) {
				var html ="";
				html+='<div class="hill_img"><div class="hl_img"><img onclick=clickOne(\''+row.tjFmlj+'\') ondblclick="clickdbl1(\''+row.tjXh+'\')" src="'+PICURI+row.tjFmlj+'"></div></div>';
				console.log(html);
				return html;
			}
		},{
			field : 'pic_INFO',
			title : '图集信息',
			width:'35%',
			align:'left',
			formatter : function(value, row, index){
				var html ="";
				html+='<p><span style="font-weight: bold;">标题：</span>'+row.tjMc+'</p>';
				html+='<p><span style="font-weight: bold;">作者：</span>'+row.tjScz+'</p>';
				if(row.tjRemark!=null&&row.tjRemark.length>50){
					html+='<p><span style="font-weight: bold;">说明：</span>'+row.tjRemark.substring(0,50)+'</p>';
				}else{
					html+='<p><span style="font-weight: bold;">说明：</span>'+row.tjRemark+'</p>';
				}
				return html;
			}
			
		}, {
			field : 'task_type',
			title : '任务类型',
			width:'10%',
			align:'center',
			formatter : function(value, row, index) {
				var html="";
				if(row.manageType==null || row.manageType==undefined ||
						row.manageType=="null" || row.manageType=="NULL" || row.manageType=="-1"){
					return "无审核任务";
				}else if (row.manageType==0){
					return "图集新增";
				}else if(row.manageType==1){
					return "图集编辑";
				}else if(row.manageType==2){
					return "图集删除";
				}else if(row.manageType==6){
					return "图集上架";
				}
				return html;
			}
		},   {
			field : 'audit_statu',
			title : '审核状态',
			width:'8%',
			formatter : function(value, row, index) {
				var text = "无审核状态";
				if(row.manageState!=null && row.manageState!=undefined && row.manageState!="null" && row.manageState!="NULL"){
					if (row.manageState == 2) { 
						text = "待审核";
					} else if (row.manageState == 3) {
						text = "审核通过";
					} else if (row.manageState == 4) {
						text = "审核不通过";
					} else if (row.manageState==1){
						text="未提交";
					} else{
						text="无审核状态";
					}	
				}
				return text;
			},
			align:'center'
			
		}, {
			title : '操作',
			field : 'operat',
			align : 'center',
			width:'20%',
			formatter : function(value, row, index) {
				var html="";
				if(row.manageType==1||row.manageType==0){						
					html='<input type="button" value="编辑详情" class="report_data_table_but btn btn-primary" onclick="editInfo(\''+row.auditUuid+'\',\''+row.updateType+'\',\''+row.id+'\',\''+row.manageState+'\')"/>';
				}
				if(row.manageState!=2){
					html+='<input type="button" value="审核信息" class="report_data_table_but btn btn-inverse" onclick="auditInfo(\''+row.auditUserName+'\',\''+row.auditTime+'\',\''+row.auditRemark+'\')"/>';
				}
				html += '<input type="button" value="图集详情" class="report_data_table_but btn btn-info" onclick="clickdbl1(\''+row.tjXh+'\')" style="margin-right: 5px;"/>';
				return html;
			}
		}]
		return cloumns;
	}
}

function auditInfo(user,time,remark){
	var table = "";
	table += "<table style ='margin: 0 auto;' id='audit_table'>";
	table += "<tr><td>审核人:</td><td>"+user+"</td></tr>";
	table += "<tr><td>审核时间:</td><td>"+time+"</td></tr>";
	table += "<tr><td>审核备注:</td><td>";
	table += "<textarea id='remarks' rows='3' cols='20' >"+remark+"</textarea>";
	table += "</td></tr>"
	table += "</table>";
	$box.promptBox(table);
	$("#myModalLabel").html("审核详情");
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
//双击显示图片详情
function clickdbl1(tjXh){
	clearTimeout(timer);
	var url = "../html/photoDetail/photoDetail.html";
	var tabId = "tjDetail";
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
/**
 * 修改html的高度
 */
function setHeight() {
	setIframeHeight("user_content", MODULEID_);
}
/**
 * 编辑
 * @param id
 */
function editInfo(taskXh,updateType,taskId,manageState){
	//判断图片或者图集跳转页面
	var url = "../html/auditManage/photoAddOrUpdateEditDetail.html";
	var tabId = "secondUpdate";
	var name = "图片编辑信息";
	if(dataType=="tj"){
		name="图集编辑信息";
	}
	var param = JSON.stringify({
		"tabId" : tabId,
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"taskXh" : taskXh,
		"dataType":dataType,
		"updateType":updateType,
		"taskId":taskId,
		"manageState":manageState
	});
	pageAddNewTab(tabId, name, url, param);
}