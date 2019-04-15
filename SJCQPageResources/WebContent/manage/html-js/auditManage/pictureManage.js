/**
 * 图片信息审核管理页js
 */
var MODULEID_;// 模块id序号
var URL_="";
$(document).ready(function() {
	checksessoin();
	MODULEID_ = GetParamByRequest().MODULEID_;
	initTable();
	$("#dataSource").change(function(){
		searchAuditData();
	});
	$("#dataType").change(function(){
		initTable();
		if($("#dataType").val()=="pic"){
			$("#buttonDiv input").show();
		}else{
			$("#buttonDiv input").hide();
			$("#se").show();
			$("#fb").show();
			$("#tj").show();
		}
	});
	$("#taskType").change(function(){
		searchAuditData();
	});
	$("#auditType").change(function(){
		searchAuditData();
	});
	$('#searchWord').keydown(function(e){
		if(e.keyCode==13){
			searchAuditData();
		}
	})});

/**
 * 获取所有参数
 * @returns {___anonymous218_219}
 */
function getParams(){
	var searchName = $("#searchWord").val();
	var auditStatus = $("#auditStatusSel").val();
	var auditType = $("#auditType").val();
	var audit={};
	audit.beanName="PhotoPicBean";
	audit.opreateType=auditType;
	audit.auditStatus=auditStatus;
	audit.searchName=searchName;
//	alert(JSON.stringify(audit));
	return audit;
}
/**
 * 初始化表格
 */
function initTable() {
	if($("#dataType").val()=="pic"){
		URL_="/sjcq/photoPic/findPhotoPicPageForManage";
	}else if($("#dataType").val()=="tj"){
		URL_="/sjcq/photoTj/findPhotoPicPageForManage";
	}
	$("#pictureAuditDataTable").bootstrapTable("destroy");
	$('#pictureAuditDataTable').bootstrapTable({
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
					manageType : $("#taskType").val(),
					photoSource : $("#dataSource").val(),
					tjSource : $("#dataSource").val(),
					manageState : $("#auditType").val(),
					picMc : $("#searchWord").val(),
					tjMc : $("#searchWord").val(),
					orderBy:"id",
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
	setIframeHeight("pictureAudit_content", MODULEID_);
}
/**
 * 检索
 */
function searchAuditData() {
	$("#pictureAuditDataTable").bootstrapTable('getOptions').pageNumber = 1;
	$("#pictureAuditDataTable").bootstrapTable("refresh", {
		query : {
			manageType : $("#taskType").val(),
			photoSource : $("#dataSource").val(),
			tjSource : $("#dataSource").val(),
			manageState : $("#auditType").val(),
			picMc : $("#searchWord").val(),
			tjMc : $("#searchWord").val(),
			orderBy:"id",
			orderDesc:1,
			pageIndex : 1,
			pageSize : function() {
				return $("#pictureAuditDataTable").bootstrapTable('getOptions').pageSize;
			}()
		}
	});
}
/**
 * 根据序号审核
 * @param ids
 * @param passOrNo
 */
function auditPass(ids,passOrNo) {
	var remark=$("#remarks").val();
	$.ajax({
		url : "/sjcq/manage/audit/taskAudit", 
		dataType : "json", 
		async : true,
		data : {
			auditIds : ids,
			statu : passOrNo,
			remark:remark
		}, 
		type : "post", 
		success : function(data) {
			var statu="审核失败！！";
			if(data==true){
				statu="审核成功！！";
			}
			$box.promptBox(statu);
			$("#myModal").on("hidden",function(){		
			});
			refreshTable();
		},
		error : function() {
			alert("服务器错误！");
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
function editPic(picXh,picid,tjMc,tjRemark){
	if($("#dataType").val()=="pic"){
		var url = "../html/auditManage/modifyImg.html";
		var tabId = "editPicture";
		var name = "编辑图片信息";
		var param = JSON.stringify({
			"tabId" : tabId,
			"MODULEID_" : MODULEID_,
			"MAIN_PAGE_ID_" : MODULEID_,
			"picXh" : picXh,
			"picid":picid
		});
		pageAddNewTab(tabId, name, url, param);
	}else if($("#dataType").val()=="tj"){
		//图集编辑
		var table = "";
		table += "<table style ='margin: 0 auto;' id='edit_table'>";
		table += "<tr><td>图集名称:</td><td>";
		table += "<input type='text' id='tjMc' value='"+tjMc+"'>";
		table += "</td></tr>"
		table += "<tr><td>图集说明:</td><td>";
		table +="<textarea  style='height:auto;' id='myTjRemark'>"+tjRemark+"</textarea>";
		table += "</td></tr>";
		table += "</table>";
		$box.promptSureBox(table, "updateTj", picXh,"图集编辑")
	}
}
function updateTj(tjXh){
	var tjObj={};
	tjObj.tjXh=tjXh;
	tjObj.tjMc=$("#tjMc").val();
	tjObj.tjRemark=$("#myTjRemark").val();
	$.ajax({
		url : "/sjcq/photoTjManage/addUpdateTask", 
		dataType : "json", 
		async : false,
		data : tjObj, 
		type : "post", 
		success : function(data) {
			$box.promptBox(data.resultInfo);
			if(data.resultStatus == true || data.resultStatus=="true"){
				searchAuditData();
			}
		},
		error : function() {
			alert("服务器错误！");
		}
	});
}
function deletePic(id){
	var url="";
	if($("#dataType").val()=="pic"){
		console.log("图片"+id);
		url="/sjcq/photoPicManage/addDeleteTask";
	}else{
		console.log("图集"+id);
		url="/sjcq/photoTjManage/addDeleteTask";
	}
	$.ajax({
		url : url, 
		dataType : "json", 
		async : false,
		data : {
			picIds : id
		}, 
		type : "post", 
		success : function(data) {
			$box.promptBox(data.resultInfo);
			if(data.resultStatus == true || data.resultStatus=="true"){
				searchAuditData();
			}
		},
		error : function() {
			alert("服务器错误！");
		}
	});
}
/**
 * 查看图片或者图集的历史审核信息
 * @param Xh
 */
function showEditInfo(Xh){
	//图片信息展示
	var url = "../html/auditManage/picAuditHistory.html";
	var tabId = "showEditInfo";
	var name = "图片任务记录";
	if($("#dataType").val()=="tj"){
		name = "图集任务记录";
	}
	var param = JSON.stringify({
		"tabId" : tabId,
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"dataXh" : Xh,
		"dataType" : $("#dataType").val()
	});
	pageAddNewTab(tabId, name, url, param)

}
