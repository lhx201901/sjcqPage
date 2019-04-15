/**
 * 图集审核管理页js
 */
var MODULEID_;// 模块id序号
$(document).ready(function() {
	checksessoin();
	MODULEID_ = GetParamByRequest().MODULEID_;
	initTable();
//	$("#auditType").change(function(){
//		refreshTable();
//	});
	$('#searchName').keydown(function(e){
		if(e.keyCode==13){
			searchData();
		}
	})
});

/**
 * 获取参数
 * @returns
 */
function getParams(){
	var jsonstring ="";
	var searchName = $("#searchName").val();
	var select=$("#dataSource option:selected").val();
	if($("#readType option:selected").val()==2){		
		if(select==""){
			jsonstring = JSON.stringify({table:"d_photo_tj",term:searchName,"type_one":"","type_two":"",});
		}else{		
			jsonstring = JSON.stringify({table:"d_photo_tj",term:searchName,"type_one":"","type_two":"","tj_source":select});
		}
	}else{
		if(select==""){   	
	    	jsonstring = JSON.stringify({table:"d_photo_pic",term:searchName,"type_one":"","type_two":""});
	    }else{
	    	jsonstring = JSON.stringify({table:"d_photo_pic",term:searchName,"type_one":"","type_two":"","photo_source":select});
	    }
	}
	return jsonstring;
}

function changeReadType(){
	initTable();
}

/**
 * 初始化表格
 */
function initTable() {
	//var searchWord=getParams();
	$("#atlasDataTable").bootstrapTable("destroy");
	$('#atlasDataTable').bootstrapTable({
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
				orderField:"id",
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
		onDblClickRow : function(row) {
//			searchInfo(row.id);
		},
		onLoadSuccess : setHeight,
		columns : getCloumn()
	});
}
function addOpter(row) {
	var html = "";
	var type=$("#readType option:selected").val();
	if(type==1){		
		html += '<input type="button" value="编辑" class="report_data_table_but btn btn-primary" onclick="editInfo(\''+ row.pic_xh + '\',\''+row.pic_mc+'\',\''+row.pic_remark+'\',\''+type+'\',\''+row.id+'\')" style="margin-right: 5px;"/>';
		html += '<input type="button" value="加入编辑精选" class="report_data_table_but btn btn-inverse" onclick="tjaddEditSelect(\''+ row.pic_xh + '\',\''+row.id+'\',\''+type+'\')" style="margin-right: 5px;"/>';
		html += '<input type="button" value="加入活动图片" class="report_data_table_but btn btn-success" onclick="tjaddEvent(\''+ row.pic_xh + '\',\''+row.id+'\',\''+type+'\')" style="margin-right: 5px;"/>';
		html += '<input type="button" value="删除" class="report_data_table_but btn btn-danger" onclick="deleteByIds(\''+row.id+'\',\''+type+'\')" style="margin-right: 5px;"/>';
	}else{
		html += '<input type="button" value="编辑" class="report_data_table_but btn btn-primary" onclick="editInfo(\''+ row.tj_xh + '\',\''+row.tj_mc+'\',\''+row.tj_remark+'\',\''+type+'\',\''+row.id+'\')" style="margin-right: 5px;"/>';
		html += '<input type="button" value="加入编辑精选" class="report_data_table_but btn btn-inverse" onclick="tjaddEditSelect(\''+ row.tj_xh + '\',\''+row.id+'\',\''+type+'\')" style="margin-right: 5px;"/>';
		html += '<input type="button" value="加入活动图片" class="report_data_table_but btn btn-success" onclick="tjaddEvent(\''+ row.tj_xh+ '\',\''+row.id+'\',\''+type+'\')" style="margin-right: 5px;"/>';
		html += '<input type="button" value="删除" class="report_data_table_but btn btn-danger" onclick="deleteByIds(\''+row.id+'\',\''+type+'\')" style="margin-right: 5px;"/>';
	}
	return html;
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
	setIframeHeight("atlasAudit_content", MODULEID_);
}

/**
 * 检索
 */
function searchData() {
	var searchWord=getParams();
	var orderField="";
	if($("#readType option:selected").val()==1){
		orderField="tj_scsj";
	}else{
		orderField="pic_scsj";
	}
	$("#atlasDataTable").bootstrapTable('getOptions').pageNumber = 1;
	$("#atlasDataTable").bootstrapTable("refresh", {
		query : {
			searchWord :searchWord,
			pageIndex : 1,
			orderField:orderField,
			orderType:"desc",
			pageSize : function() {
				return $("#atlasDataTable").bootstrapTable('getOptions').pageSize;
			}()
		}
	});
}

/**
 * 刷新表格
 */
function refreshTable() {
	var searchWord=getParams();
	var orderField="";
	if($("#readType option:selected").val()==1){
		orderField="tj_scsj";
	}else{
		orderField="pic_scsj";
	}
	$("#atlasDataTable").bootstrapTable("refresh", {
		query : {
			searchWord :searchWord,
			pageIndex : 1,
			orderField:orderField,
			orderType:"desc",
			pageSize : function() {
				return $("#atlasDataTable").bootstrapTable('getOptions').pageSize;
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
	var getSelectRows = $("#atlasDataTable").bootstrapTable('getSelections');
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
	var url1="";
	var typeq=$("#readType option:selected").val();
	if(typeq==2){
		url1="/sjcq/photoTjManage/addDeleteTask";
	}else{
		url1="/sjcq/photoPicManage/addDeleteTask";
	}
	$.ajax({
		url : url1, 
		dataType : "json", 
		async : true,
		data : {
			picIds : ids
		},
		type : "post", 
		success : function(data) {
			$box.promptBox(data.resultInfo);
			if(data.resultStatus == true || data.resultStatus=="true"){
				searchData();
			}
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
function searchInfo(tjXh,audituuid) {
	if($("#auditType").val()==2){
		var url = "../html/photoDetail/photoDetail2.html";
		var tabId = "photoDetail";
		var name = "图集详情页";
		var param = JSON.stringify({
			"tabId" : tabId,
			"MODULEID_" : MODULEID_,
			"MAIN_PAGE_ID_" : MODULEID_,
			"tjXh" : tjXh,
			"auditUuid":audituuid
		});
		pageAddNewTab(tabId, name, url, param)
	}else{//图片信息展示
		var url = "../html/photoDetail/photoDetail.html";
		var tabId = "photoDetail";
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
}


/**
* 编辑图片信息
* @param id
*/
function editInfo(picXh,tjMc,tjRemark,type,id) {
	if(type==1){//图片编辑
		var url = "../html/auditManage/modifyImg.html";
		var tabId = "editPicture";
		var name = "编辑图片信息";
		var param = JSON.stringify({
			"tabId" : tabId,
			"MODULEID_" : MODULEID_,
			"MAIN_PAGE_ID_" : MODULEID_,
			"picXh" : picXh,
			"picid":id
		});
		pageAddNewTab(tabId, name, url, param);
	}else{	//图集编辑	
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
				searchData();
			}
		},
		error : function() {
			alert("服务器错误！");
		}
	});
}

function addEditSelect(picXh,PicId){
	var url = "../html/editSelected/editSelectSortManagePicAdd.html";
	var tabId = "addBroadCastPic";
	var name = "加入编辑精选";
	var param = JSON.stringify({
		"tabId" : "addBroadCastPic",
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"PicId" : PicId
	});
	pageAddNewTab("addBroadCastPic", name, url, param)
	/*
	var options="";
	$.ajax({
		url : "/sjcq/manage/editSelectedSort/getAll", 
		dataType : "json", 
		async : false,
		data : {
		}, 
		type : "post", 
		success : function(data) {
			$.each(data, function(i, val) {
				options+="<option value=\""+val.uuid+"\">"+val.sortName+"</option>";
			});
		},
		error : function() {
			alert("服务器错误！");
		}
	});
	var table = "";
	table += "<table style ='margin: 0 auto;' id='audit_table'>";
	table += "<tr><td>精选分类:</td><td>";
	table += "<select class='select-width' id='selectSortXh'>"+options+"<select>";
	table += "</td></tr>"
	table += "<tr><td colspan='2' align='center'>";
	table += '<input type="button" value="加入该组" class="report_data_table_but btn btn-primary" onclick="addPicToEditSelect(\''+tjId+'\',1)"/>';
	table += "</td></tr>";
	table += "</table>";
	$box.promptBox(table);
	$("#myModalLabel").html("加入精选");
*/}
var URL1="";
function addPicToEditSelect(tjIds){
	URL1="/sjcq/photoPicManage/addPicToEditSelect";
	var options="";
	$.ajax({
		url : URL1, 
		dataType : "json", 
		async : false,
		data : {picIds:tjIds,editSelectSortXh:$("#selectSortXh").val(),editSelectSortName:$("#selectSortXh").find("option:selected").text()
		}, 
		type : "post", 
		success : function(data) {
			if(data==true || data=="true"){
				$box.promptBox("加入编辑精选成功");
				searchData();
			}else{
				$box.promptBox("加入编辑精选失败");
			}
		},
		error : function() {
			alert("服务器错误！");
		}
	});
}
function addEvent(tjXh,tjId){
	var options="";
	$.ajax({
		url : "/sjcq/ptgyatv/getAll", 
		dataType : "json", 
		async : false,
		data : {
		}, 
		type : "post", 
		success : function(data) {
			$.each(data, function(i, val) {
				options+="<option value=\""+val.atyXh+"\">"+val.atyTitle+"</option>";
			});
		},
		error : function() {
			alert("服务器错误！");
		}
	});
	var table = "";
	table += "<table style ='margin: 0 auto;' id='audit_table'>";
	table += "<tr><td>活动名称:</td><td>";
	table += "<select class='select-width' id='eventXh'>"+options+"<select>";
	table += "</td></tr>"
	table += "<tr><td colspan='2' align='center'>";
	table += '<input type="button" value="加入活动" class="report_data_table_but btn btn-primary" onclick="addPicToEvent(\''+tjId+'\',1)"/>';
	table += "</td></tr>";
	table += "</table>";
	$box.promptBox(table);
	$("#myModalLabel").html("加入活动链接");
}

function addPicToEvent(tjIds){
	URL1="/sjcq/photoPicManage/addPicToPtgyatv";
	var options="";
	$.ajax({
		url : URL1, 
		dataType : "json", 
		async : false,
		data : {picIds:tjIds,atyXh:$("#eventXh").val(),atyTitle:$("#eventXh").find("option:selected").text()}, 
		type : "post", 
		success : function(data) {
			if(data==true || data=="true"){
				$box.promptBox("加入活动成功");
				searchData();
			}else{
				$box.promptBox("加入活动失败");
			}
		},
		error : function() {
			alert("服务器错误！");
		}
	});
}
/**
 * 图片或图集加入精选
 * @param tjXh
 * @param tjId
 * @param type
 */
function tjaddEditSelect(tjXh,tjId,type){
	if(type==1){
		var url = "../html/editSelected/editSelectSortManagePicAdd.html";
		var tabId = "addBroadCastPic";
		var name = "加入编辑精选";
		var param = JSON.stringify({
			"tabId" : "addBroadCastPic",
			"MODULEID_" : MODULEID_,
			"MAIN_PAGE_ID_" : MODULEID_,
			"PicId" : tjId
		});
		pageAddNewTab("addBroadCastPic", name, url, param)
	}else{		
		var url = "../html/auditManage/tjPictureManage.html";
		var tabId = "addEditSelect"+tjXh;
		var name = "图片列表页";
		var param = JSON.stringify({
			"tabId" : "addEditSelect"+tjXh,
			"MODULEID_" : MODULEID_,
			"MAIN_PAGE_ID_" : MODULEID_,
			"tjXh" : tjXh,
			"type" :"addEditSelect"
		});
		pageAddNewTab(tabId, name, url, param)
	}

}
/***
 * 图片或图集加入活动
 * @param tjXh
 * @param tjId
 */
function tjaddEvent(tjXh,tjId,type){
	if(type==1){
		var options="";
		$.ajax({
			url : "/sjcq/ptgyatv/getAll", 
			dataType : "json", 
			async : false,
			data : {
			}, 
			type : "post", 
			success : function(data) {
				$.each(data, function(i, val) {
					options+="<option value=\""+val.atyXh+"\">"+val.atyTitle+"</option>";
				});
			},
			error : function() {
				alert("服务器错误！");
			}
		});
		var table = "";
		table += "<table style ='margin: 0 auto;' id='audit_table'>";
		table += "<tr><td>活动名称:</td><td>";
		table += "<select class='select-width' id='eventXh'>"+options+"<select>";
		table += "</td></tr>"
		table += "<tr><td colspan='2' align='center'>";
		table += '<input type="button" value="加入活动" class="report_data_table_but btn btn-primary" onclick="addPicToEvent(\''+tjId+'\',1)"/>';
		table += "</td></tr>";
		table += "</table>";
		$box.promptBox(table);
		$("#myModalLabel").html("加入活动链接");
	}else{		
		var url = "../html/auditManage/tjPictureManage.html";
		var tabId = "addEvent"+tjXh;
		var name = "图片列表页";
		var param = JSON.stringify({
			"tabId" : "addEvent"+tjXh,
			"MODULEID_" : MODULEID_,
			"MAIN_PAGE_ID_" : MODULEID_,
			"tjXh" : tjXh,
			"type" :"addEvent"
		});
		pageAddNewTab(tabId, name, url, param)
	}

}

function addPicToEvent(picIds){
	URL1="/sjcq/photoPicManage/addPicToPtgyatv";
	var options="";
	$.ajax({
		url : URL1, 
		dataType : "json", 
		async : false,
		data : {picIds:picIds,atyXh:$("#eventXh").val(),atyTitle:$("#eventXh").find("option:selected").text()}, 
		type : "post", 
		success : function(data) {
			if(data==true || data=="true"){
				$box.promptBox("加入活动成功");
				searchData();
			}else{
				$box.promptBox("加入活动失败");
			}
		},
		error : function() {
			alert("服务器错误！");
		}
	});
}
function getCloumn(){
	if($("#readType option:selected").val()==1){	//图片
		return [{field: 'checdd',
            checkbox: true,
            width : "2%",
	    },{
	            field: 'tj_fmlj',
	            title: '图片',
	            width : "10%",
	            align: 'center',
	            formatter : function(value, row, index) {
					var html ="";
					html+='<div class="hill_img"><div class="hl_img"><img onclick=clickOne(\''+row.pic_lyljm+'\') ondblclick="clickdbl(\''+row.pic_xh+'\')" src="'+PICURI+row.pic_lylys+'"></div></div>';
					console.log(html);
					return html;
				}
	        }, {
	            field: 'tj_INFO',
	            title: '图片信息',
	            width:'35%',
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
	            field: 'tj_jg',
	            title: '价格',
	            width:'8%',
				align:'center',
				formatter : function(value, row, index){
					if(row.tj_jg==null || row.tj_jg ==undefined || row.tj_jg=='null'){
						return "";
					}else{
						return "￥"+row.tj_jg;
					}
				}
	        }, {
	            title: '操作',
	            field: 'operat',
	            align: 'center',
	            valign: 'middle',
	            width:'29%',
	            formatter:function(value,row,index){  
	              return addOpter(row);  
	          } }];
	}else{	//图集
		return [{field: 'checdd',
            checkbox: true,
            width : "2%",
	    },{
	            field: 'tj_fmlj',
	            title: '图集封面',
	            width : "10%",
	            align: 'center',
	            formatter : function(value, row, index) {
					var html ="";
					html+='<div class="hill_img"><div class="hl_img"><img onclick=clickOne(\''+row.tj_fmlj+'\') ondblclick="clickdbl1(\''+row.tj_xh+'\')" src="'+PICURI+row.tj_fmlj+'"></div></div>';
					console.log(html);
					return html;
				}
	        }, {
	            field: 'tj_INFO',
	            title: '图集信息',
	            width:'35%',
	            align:'left',
				formatter : function(value, row, index){
					var html ="";
					html+='<p><span style="font-weight: bold;">标题：</span>'+row.tj_mc+'</p>';
					html+='<p><span style="font-weight: bold;">作者：</span>'+row.tj_scz+'</p>';
					if(row.tj_remark!=null&&row.tj_remark.length>50){
						html+='<p><span style="font-weight: bold;">主说明：</span>'+row.tj_remark.substring(0,50)+'</p>';
					}else{
						html+='<p><span style="font-weight: bold;">主说明：</span>'+row.tj_remark+'</p>';
					}
					return html;
				} 
	        }, {
	            title: '操作',
	            field: 'operat',
	            align: 'center',
	            valign: 'middle',
	            width:'29%',
	            formatter:function(value,row,index){  
	              return addOpter(row);  
	          } }];
	}
}