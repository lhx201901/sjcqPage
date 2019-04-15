/**
 * 图片信息审核管理页js
 */
var MODULEID_;// 模块id序号
$(document).ready(function() {
	checksessoin();
	MODULEID_ = GetParamByRequest().MODULEID_;
	initTable();
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
	var select=$("#dataSource option:selected").val();
	var searchWord = $("#searchName").val();
    var re_searchWord_array=[];
    var searchName="";
    if(searchWord.length>0){
        var searchWord_array=searchWord.split(" ");
        searchWord_array.remove("");
        searchName= searchWord_array.join("@#@");
    }else{
    	searchName="";
    }
    if(select==""){   	
    	jsonstring = JSON.stringify({table:"d_photo_pic",term:searchName,"type_one":"","type_two":""});
    }else{
    	jsonstring = JSON.stringify({table:"d_photo_pic",term:searchName,"type_one":"","type_two":"","photo_source":select});
    }
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
			searchInfo(row.id);
		},
		onLoadSuccess : setHeight,
		columns : [/* {
			field : 'checdd',
			checkbox : true
		},{// 表格结构配置
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
		} */{field: 'checdd',
            checkbox: true,
            width : "2%",
	    },{
	            field: 'pic_lylys',
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
	            field: 'pic_INFO',
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
					return html;
				} 
	        }, {
	            field: 'pic_jg',
	            title: '价格',
	            width:'8%',
				align:'center',
				formatter : function(value, row, index){
					if(row.pic_jg==null || row.pic_jg ==undefined || row.pic_jg=='null'){
						return "";
					}else{
						return "￥"+row.pic_jg;
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
	          } }]
	});
}
function addOpter(row) {
	/*var html = '<input type="button" value="图片详情"class="report_data_table_but btn btn-primary" onclick="searchInfo(\''+ row.pic_xh + '\',\''+row.uuid+'\')" style="margin-right: 5px;"/>';
	html+='<input type="button" value="删除"class="report_data_table_but btn  btn-danger" onclick="sureDelete('+row.id+')" style="margin-right: 5px;"/>';
	return html;*/
	var html = "";
	html += '<input type="button" value="编辑" class="report_data_table_but btn btn-primary" onclick="editInfo(\''+ row.pic_xh + '\',\''+row.id+'\')" style="margin-right: 5px;"/>';
	//html += '<input type="button" value="编辑" class="report_data_table_but btn btn-info" onclick="editInfo(\'' + row.id + '\',\'' + row.pic_xh + '\')" style="margin-right: 5px;"/>';
	//html += '<input type="button" value="加入精选" onclick="addChoose(\'' + row.id + '\',\'' + row.pic_xh + '\')" style="margin-right: 5px;"/>';
	//html += '<input type="button" value="加入活动" onclick="addActivty(\'' + row.id + '\',\'' + row.pic_xh + '\')" style="margin-right: 5px;"/>';
	html += '<input type="button" value="加入编辑精选" class="report_data_table_but btn btn-inverse" onclick="addEditSelect(\''+ row.pic_xh + '\',\''+row.id+'\')" style="margin-right: 5px;"/>';
	html += '<input type="button" value="加入活动图片" class="report_data_table_but btn btn-success" onclick="addEvent(\''+ row.pic_xh + '\',\''+row.id+'\')" style="margin-right: 5px;"/>';
	html += '<input type="button" value="删除" class="report_data_table_but btn btn-danger" onclick="deleteByIds(\''+row.id+'\')" style="margin-right: 5px;"/>';
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

/**
 * 编辑图片信息
 * @param id
 */
function editInfo(picXh,picid) {
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
	table += '<input type="button" value="加入该组" class="report_data_table_but btn btn-primary" onclick="addPicToEditSelect(\''+PicId+'\',1)"/>';
	table += "</td></tr>";
	table += "</table>";
	$box.promptBox(table);
	$("#myModalLabel").html("加入精选");
*/}
var URL1="";
function addPicToEditSelect(picIds){
	URL1="/sjcq/photoPicManage/addPicToEditSelect";
	var options="";
	$.ajax({
		url : URL1, 
		dataType : "json", 
		async : false,
		data : {picIds:picIds,editSelectSortXh:$("#selectSortXh").val(),editSelectSortName:$("#selectSortXh").find("option:selected").text()
		}, 
		type : "post", 
		success : function(data) {
			if(data==true || data=="true"){
				$box.promptBox("加入编辑精选成功");
				searchUserAuditData();
			}else{
				$box.promptBox("加入编辑精选失败");
			}
		},
		error : function() {
			alert("服务器错误！");
		}
	});
}
function addEvent(picXh,PicId){
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
	table += '<input type="button" value="加入活动" class="report_data_table_but btn btn-primary" onclick="addPicToEvent(\''+PicId+'\',1)"/>';
	table += "</td></tr>";
	table += "</table>";
	$box.promptBox(table);
	$("#myModalLabel").html("加入活动链接");
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
				searchUserAuditData();
			}else{
				$box.promptBox("加入活动失败");
			}
		},
		error : function() {
			alert("服务器错误！");
		}
	});
}
