/**
 * 用户管理js
 * 
 * @author lxw
 */
var MODULE_ID="";
var Table_Obj;//表格对象
$(function() {
	checksessoin();
	MODULEID_ = GetParamByRequest().MODULEID_;
	initDatePicker();	
	initTable();
	$("#state").change(function(){
		refreshTable();
	});
})
/**
 * 日期初始化
 */
function initDatePicker() {
	laydate.render({
		elem: '#startTime'
	});
	laydate.render({
		elem: '#endTime'
	});
}
/**
 * 检索获取条件
 */
function getParam() {
	 var obj = {};
	 obj.pageIndex = 1;
	 var startTime = $("#startTime").val();
	 var endTime = $("#endTime").val();
	 if((startTime.length>0&&endTime.length>0)&&(startTime>endTime)){
			$box.promptBox("起始时间不能大于结束时间！", "");
			return;
	}
	 var pageSize=$("#page_size").val();
	 obj.pageSize = pageSize; 
	 var term = $("#searchW_words").val().replace(/\s/g,'');
	 obj.keyWords=term;
	 obj.stateType=$("#state").val();
	 obj.startTime=startTime;
	 obj.endTime=endTime;
	return obj;
}
/**
 * 刷新表格
 */
function refreshTable() {
	//var obj=getParam();
	$("#atlasAuditDataTable").bootstrapTable("refresh", {
		query : {
			term :JSON.stringify(getParam()),
			orderType:1,
			pageIndex : 1,
			pageSize : function() {
				return $("#atlasAuditDataTable").bootstrapTable('getOptions').pageSize;
			}()
		}
	});
}
/**
 * 初始加载
 */
function initTable(){
	//var  obj = getParam();
	$('#atlasAuditDataTable').bootstrapTable({
		url : "/sjcq/pushInternalAudit/findPageInfo", // 请求后台的URL（*）
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
				term :JSON.stringify(getParam()),
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
		columns : [ {
			field : 'checdd',
			checkbox : true,
			width:'5%'
		},
		{// 表格结构配置
			title : "图片",// 列title文字
			field : "picLylys",// 该列对应数据哪个字段
			width : "10%",// 列宽度设置,不设也没什么
			formatter : function(value, data, index) {
				var html ="";
				html+='<div class="hill_img"><div class="hl_img"><img src="'+index_nav.PICURI+data.picLylys+'"></div></div>';
				return html;
			}
		},
		{
			title : "图片信息",
			field : "picMc",
			width : "30%",
			formatter : function(value, data, index) {
				console.log(data);
				var html ="";
				html+='<p><span style="font-weight: bold;">标题：</span>'+data.picMc+'</p>';
				html+='<p><span style="font-weight: bold;">作者：</span>'+data.picScz+'</p>';
				if(data.picZsm && data.picZsm!=null && data.picZsm!='null'&&data.picZsm.length>50){
					html+='<p><span style="font-weight: bold;">图片说明：</span>'+data.picZsm.substring(0,50)+'</p>';
				}else{
					html+='<p><span style="font-weight: bold;">图片说明：</span>'+data.picZsm+'</p>';
				}
				return html;
			}
			
		},
		{
			title : "价格(人名币:元)",
			field : "picJg",
			width : "8%"
		},
		{
			title : "审核状态",
			field : "state",
			width : "10%",
			formatter : function(value, data, index) {
				if(data.state==1){
					return "待审核";
				}else if(data.state==2){
					return "审核通过";
				}else{
					return "审核不通过";
				}
			}
		},
		{
			title : "操作",
			field : 'operat',
			align : 'center',
			valign : 'middle',
			width:'20%',
			formatter : function(value, data, index) {
				return loadOperater(data);
			}
		}  ]
	});
}
/**
 * 修改html的高度
 */
function setHeight() {
	setIframeHeight("atlasAudit_content", MODULEID_);
}
/**
 * 加载方法
 * @param data
 * @returns {String}
 */
function loadOperater(data){
	var html ="";
	var html = '<input type="button" value="查看"class="report_data_table_but btn btn-primary" onclick="toDetail(\''+data.id+'\')" style="margin-right: 5px;"/>';
	if(data.state==1){
		html+='<input type="button" value="审核"class="report_data_table_but btn btn-info" onclick="dataAudit('+data.id+')" style="margin-right: 5px;"/>';
	}else{
		html+='<input type="button" value="审核信息"class="report_data_table_but btn btn-info" onclick="showAuditInfo(\''+data.auditInfo+'\',\''+data.auditUserName+'\',\''+data.auditTime+'\')" style="margin-right: 5px;"/>';
		html+='<input type="button" value="删除"class="report_data_table_but btn btn-danger" onclick="deleteById('+data.id+')" style="margin-right: 5px;"/>';
	}
	return html;
}
/**
 * 通过id审核
 * @param id
 */
function dataAudit(ids){
	var table = "";
	table += "<table style ='margin: 0 auto;' id='audit_table'>";
	table += "<tr><td>备注:</td><td>";
	table += "<textarea id='remarks' rows='3' cols='20'></textarea>";
	table += "</td></tr>"
	table += "<tr><td colspan='2' align='center'><input type='hidden' id='dataId' >";
	table += '<input type="button" value="审核通过" class="report_data_table_but btn btn-primary" onclick="auditPass(2)"/>';
	table += '<input type="button" value="审核不通过" class="report_data_table_but btn btn-danger" onclick="auditPass(3)" style="margin-left: 10px;"/>';
	table += "</td></tr>";
	table += "</table>";
	$box.promptBox(table);
	$("#myModalLabel").html("批量审核");		
	$("#dataId").val(ids);
}
/**
 * 审核数据
 * @param type
 */
function auditPass(type){
	var id=$("#dataId").val(),
	remark=$("#remarks").val();
	$box.promptBox("审核过程中！", "消息提示");
	var obj = {};
	obj.auditIds=id;
	obj.statu=type;
	obj.remark=remark;
	$.ajax({
		url : "/sjcq/pushInternalAudit/taskAudit", // 请求的url地址
		dataType : "text", // 返回格式为json
		async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : obj, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			console.log(data)
			if(data || data=='true'){
				$box.promptBox("审核成功！");
				searchData();
			}else{
				$box.promptBox("审核失败！");
			}
		},
		error : function() {
			$box.promptBox("系统错误！", "");
		}
	})

	
}
/**
 * 查看审核信息
 * @param info
 */
function showAuditInfo(info,user,auditTime){
	var html="";
	if(info!=null && 'null'!=info){
		$box.promptBox("审核人："+user+"<br><br>审核时间："+auditTime+"<br><br>审核备注："+info, "审核信息");
	}else{
		$box.promptBox("审核备注：", "审核信息");		
	}
}
/**
 * 查看详情
 * @param twq
 */
function toDetail(id){
	var url = "../html/photoDetail/photoDetail.html";
	var tabId = "photoDetail";
	var name = "图片详情页";
	var param = JSON.stringify({
	"tabId" : tabId,
	"MODULEID_" : MODULEID_,
	"MAIN_PAGE_ID_" : MODULEID_,
	"picXh" : id,
	"auditType" : 1 
});
pageAddNewTab(tabId, name, url, param)}
/**
 * 检索审核信息列表
 */
function searchData(){
	//var obj=getParam();
	$("#atlasAuditDataTable").bootstrapTable('getOptions').pageNumber = 1;
	$("#atlasAuditDataTable").bootstrapTable("refresh", {
		query : {
			term : JSON.stringify(getParam()),
			pageIndex : 1,
			orderType:1,
			pageSize : function() {
				return $("#atlasAuditDataTable").bootstrapTable('getOptions').pageSize;
			}()
		}
	});
}

/**
 * 查看详情
 * @param twq
 */
function lookDetails(id){
	parent.createPage("图片详情", "../../html/photoManage/picEdit.html?id="+id, true, "picEdit");
}
/**
 * 编辑图片
 * @param id
 */
function editUser(id){
	parent.createPage("图片详情", "../../html/photoManage/picEdit.html?id="+id, true, "picEdit");
}

function beacthAudit(){ 
	var getSelectRows = $("#atlasAuditDataTable").bootstrapTable('getSelections');
	if (getSelectRows.length <= 0) {
		$box.promptBox('请选择数据');
		return;
	}
	var ids = "";
	var flag=true;
	var arr = new Array();
	$.each(getSelectRows, function(key, val) {
		if(val.state==1){			
			arr.push( val.id);
		}
	});
	if(arr.length==0){
		$box.promptBox("未选择未审核数据！", "");
		return;
	}
	var ids = arr.join(",");
	dataAudit(ids)
}

/**
 * 通过id删除数据
 * @param id
 */
function deleteById(id){
	var title ="消息提示";
	var content = '删除后不可恢复，请确认操作？';
	$box.promptSureBox(content, 'sureDelete', id);
}
//批量删除
function beacthDelete(){ 
	 
	var getSelectRows = $("#atlasAuditDataTable").bootstrapTable('getSelections');
	if (getSelectRows.length <= 0) {
		$box.promptBox('请选择数据');
		return;
	}
	var ids = "";
	var flag=true;
	var arr = new Array();
	$.each(getSelectRows, function(key, val) {
		if(val.state!=1){			
			arr.push( val.id);
		}
	});
	if(arr.length==0){
		$box.promptBox("未选择未审核数据,未审核数据不能删除！", "");
		return;
	}
	var ids = arr.join(",");
	deleteById(ids)
}
/**
 * 审核数据
 * @param type
 */
function sureDelete(dataId){
	$.ajax({
		url : "/sjcq/pushInternalAudit/deleteByIds", // 请求的url地址
		dataType : "text", // 返回格式为json
		async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {dataId:dataId}, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			console.log(data)
			if(data || data=='true'){
				$box.promptBox("数据删除成功！");
				searchData();
			}else{
				$box.promptBox("数据删除失败！");
			}
		},
		error : function() {
			$box.promptBox("系统错误！", "");
		}
	})

	
}