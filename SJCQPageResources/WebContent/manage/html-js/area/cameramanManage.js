/**
 * 设计师信息审核管理页js author cl 2018/05/17
 */
var MODULEID_;// 模块id序号
$(document).ready(function() {
	checksessoin();
	initDesigner();
	MODULEID_ = GetParamByRequest().MODULEID_;
	initTable();
	$('#area_name').bind('keyup', function(event) {
	       if (event.keyCode == "13") {
	           //回车执行查询
	    	   initTable();
	       }
	});
});

function initDesigner(){
	$.ajax({
		url : "/sjcq/pAndD/getContributorByUserType",
		dataType : "json",
		type : "post",
		data :{"userType":"1"},
		async:false,
		success : function(data) {
			console.log(data);
			//$("#auditStatusSel").append("<option value='all'>全部</option>");
			for(var a=0;a<data.length;a++){
				$("#auditStatusSel").append("<option value='"+data[a].uuid+"'>"+data[a].realName+"</option>");
			}
		},
		error : function(result, status) {
			$box.promptBox("系统异常，请联系管理员！");
		}
	});
}

/**
 * 切换数据类型
 * @returns
 */
/*function changeAuditStatu(){
	if($("#auditStatusSel").val()==0){
		//$("#auditButton").css('display','block'); 
		$("#auditButton").attr('disabled',false);
	}else{
		//$("#auditButton").css('display','none');
		$("#auditButton").attr('disabled',true);
	}
	refreshTable();
}*/
/**
 * 初始化表格
 */
function initTable() {
	$("#userAuditDataTable").bootstrapTable("destroy");
	var sczXh =$("#auditStatusSel option:selected").val();
	if(sczXh==undefined || sczXh ==null || sczXh.length==0){
		sczXh="无数据";
	}
	$('#userAuditDataTable').bootstrapTable({
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
					orderField:'id',
            	    orderType:'desc',
            	    searchWord:JSON.stringify({table:'d_photo_pic',term:$("#area_name").val(),type_one:'',type_two:'',pic_sczxh:sczXh}),
            		pageIndex: params.pageNumber,    
	            	pageSize: params.pageSize
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
		uniqueId : "personId", // 每一行的唯一标识，一般为主键列
		cardView : false, // 是否显示详细视图
		detailView : false, // 是否显示父子表
		onLoadSuccess : setHeight,
		columns : [{field: 'checdd',
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
/*添加操作栏*/
function addOpter(row) {
	var html = "";
	html += '<input type="button" value="编辑" class="report_data_table_but btn btn-primary" onclick="editInfo(\''+ row.pic_xh + '\',\''+row.id+'\')" style="margin-right: 5px;"/>';
	//html += '<input type="button" value="编辑" class="report_data_table_but btn btn-info" onclick="editInfo(\'' + row.id + '\',\'' + row.pic_xh + '\')" style="margin-right: 5px;"/>';
	//html += '<input type="button" value="加入精选" onclick="addChoose(\'' + row.id + '\',\'' + row.pic_xh + '\')" style="margin-right: 5px;"/>';
	//html += '<input type="button" value="加入活动" onclick="addActivty(\'' + row.id + '\',\'' + row.pic_xh + '\')" style="margin-right: 5px;"/>';
	html += '<input type="button" value="加入编辑精选" class="report_data_table_but btn btn-inverse" onclick="addEditSelect(\''+ row.pic_xh + '\',\''+row.id+'\')" style="margin-right: 5px;"/>';
	html += '<input type="button" value="加入活动图片" class="report_data_table_but btn btn-success" onclick="addEvent(\''+ row.pic_xh + '\',\''+row.id+'\')" style="margin-right: 5px;"/>';
	return html;
}
/**
 * 修改html的高度
 */
function setHeight() {
	setIframeHeight("userAudit_content", MODULEID_);
}

/**
 * 检索
 */
function searchUserAuditData() {
	var auditStatus = $("#auditStatusSel").val();
	$("#userAuditDataTable").bootstrapTable('getOptions').pageNumber = 1;
	$("#userAuditDataTable").bootstrapTable(
			"refresh",
			{
				query : {
					personType : 2,
					statu : auditStatus,
					pageIndex : 1,
					pageSize : function() {
						return $("#userAuditDataTable").bootstrapTable(
								'getOptions').pageSize;
					}()
				}
			});

}

/**
 * 刷新表格
 */
function refreshTable() {
	var auditStatus = $("#auditStatusSel").val();
	$("#userAuditDataTable").bootstrapTable(
			"refresh",
			{
				query : {
					personType : 2,
					statu : auditStatus,
					pageIndex : 1,
					pageSize : function() {
						return $("#userAuditDataTable").bootstrapTable(
								'getOptions').pageSize;
					}()
				}
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

/**
 * 查看设计师详情
 * 
 * @param personId
 */
function searchDesignerInfo(applyXh) {
	var url = "../html/userAudit/cameristInfo.html";
	var tabId = "designerInfo";
	var name = "设计师信息";
	var param = JSON.stringify({
		"tabId" : tabId,
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"applyXh" : applyXh
	});
	pageAddNewTab(tabId, name, url, param)
}

/**
 * 将时间戳转换成日期格式
 * 
 * @param timestamp
 * @returns {String}
 */
function timestampToTime(timestamp) {
	var date = new Date(timestamp);// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
	Y = date.getFullYear() + '-';
	M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date
			.getMonth() + 1)
			+ '-';
	D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
	h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
	m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
			+ ':';
	s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
	return Y + M + D + h + m + s;
}

/*检索*/
function searchUserAuditData(){
	var areaName = $("#area_name").val();
	areaName = areaName.replace(/(^\s*)/g, "");//去掉左边空格
	areaName = areaName.replace(/(\s*$)/g, "");//去掉右边空格
	areaName = areaName.replace(/\s+/g, "@#@");
    $("#userAuditDataTable").bootstrapTable('getOptions').pageNumber=1;
    $("#userAuditDataTable").bootstrapTable("refresh",{query: 
    	{ 
    	    orderField:'id',
    	    orderType:'desc',
    	    searchWord:JSON.stringify({table:'d_photo_pic',term:areaName,type_one:'',type_two:'',pic_sczxh:$("#auditStatusSel option:selected").val()}),
	    	pageIndex: 1,
	        pageSize: function(){
		       	 return $("#areaDataTable").bootstrapTable('getOptions').pageSize;
	        }()
    	}
      }
    );

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
