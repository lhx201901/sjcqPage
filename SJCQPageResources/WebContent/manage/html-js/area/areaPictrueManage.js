/**
 * 区县图片管理js 
 **/
var qx="";
var qxId="";
var MODULEID_ ;//模块id序号
$(document).ready(function(){
	checksessoin();
	initqXName();
	MODULEID_ = GetParamByRequest().MODULEID_;
	initTable();
	 $('#area_name').bind('keyup', function(event) {
	        if (event.keyCode == "13") {
	            //回车执行查询
	        	search();
	        }
	    });
});

/*
 * 初始化区县名称
 */
function initqXName(){
	$.ajax({
		url : "/sjcq/manage/area/findAll",
		dataType : "json",
		type : "post",
		//data : area,
		 async:false,
		success : function(data) {
			$.each(data,function(index,val){
				
				if(index==0){
					qx=val.aliasName;
					qxId=val.id;
					$("#qxName").append("<a  class='areaColor' id='"+val.id+"' style='margin-left:10px;' areaName='"+val.aliasName+"'>"+val.aliasName+"</a>");
				}else{
					$("#qxName").append("<a  class='' id='"+val.id+"' style='margin-left:10px;' areaName='"+val.aliasName+"'>"+val.aliasName+"</a>");
				}
			});
			$("#qxName a").click(function(){
				$("#qxName a").removeClass("areaColor");
				$(this).addClass("areaColor");
				qx=$(this).attr("areaName");
				qxId=$(this).attr("id");
				search();
			});
		},
		error : function(result, status) {
			$box.promptBox("系统异常，请联系管理员！");
		}
	});
}


/*
 *初始化区县信息列表 
 */
function initTable() {
    $('#areaDataTable').bootstrapTable({
        url: "/sjcq/retriebe/basicSolrSearch",  //请求后台的URL（*）
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
        			orderField:'id',
            	    orderType:'desc',
            	    searchWord:JSON.stringify({table:'d_photo_pic',term:qx,type_one:'',type_two:''}),
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
            checkbox: true,
            width : "2%",
        },
            {
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
                field: 'pic_mj',
                title: '密级',
                width:'8%',
    			align:'center',
    			formatter : function(value, row, index){
    				if(row.pic_mj==null || row.pic_mj ==undefined || row.pic_mj=='null'){
    					if(){
    						
    					}else{
    						
    					}
    				}else{
    					return "非公开";
    				}
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
              } 
         }]
    });
}

/*添加操作栏*/
function addOpter(row) {
	var html = "";
	html += '<input type="button" value="编辑" class="report_data_table_but btn btn-primary" onclick="editPic(\''+ row.pic_xh + '\',\''+row.id+'\')" style="margin-right: 5px;"/>';
	//html += '<input type="button" value="编辑" class="report_data_table_but btn btn-info" onclick="editInfo(\'' + row.id + '\',\'' + row.pic_xh + '\')" style="margin-right: 5px;"/>';
	//html += '<input type="button" value="加入精选" onclick="addChoose(\'' + row.id + '\',\'' + row.pic_xh + '\')" style="margin-right: 5px;"/>';
	//html += '<input type="button" value="加入活动" onclick="addActivty(\'' + row.id + '\',\'' + row.pic_xh + '\')" style="margin-right: 5px;"/>';
	html += '<input type="button" value="加入编辑精选" class="report_data_table_but btn btn-inverse" onclick="addEditSelect(\''+ row.pic_xh + '\',\''+row.id+'\')" style="margin-right: 5px;"/>';
	html += '<input type="button" value="加入活动图片" class="report_data_table_but btn btn-success" onclick="addEvent(\''+ row.pic_xh + '\',\''+row.id+'\')" style="margin-right: 5px;"/>';
	return html;
}


/*
 * 修改页面高度
 */
function setHeight(){
	setIframeHeight("area_content_div",MODULEID_);
}

/**
 * 新增
 * @param id
 */
function addAreaInfo() {
	var url = "../html/area/addOrEditArea.html";
	var tabId = "addArea";
	var name = "新增区县信息";
	var param = JSON.stringify({
		"tabId" : tabId,
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"optType":"add"
	});
	pageAddNewTab(tabId, name, url, param);
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
function editInfo() {
	var url = "../html/area/addOrEditArea.html";
	var tabId = "editArea";
	var name = "编辑区县信息";
	var param = JSON.stringify({
		"tabId" : tabId,
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"areaId" : ""+qxId+"",
		"optType":"edit"
	});
	pageAddNewTab(tabId, name, url, param);
}

/*删除区县信息*/
function deleteById(){
	$box.promptSureBox("是否确定删除区县信息！！",'sureDelete',qxId);
}
/*批量删除区县信息
function batchDelete(){
	var getSelectRows = $("#areaDataTable").bootstrapTable('getSelections');
	 if (getSelectRows.length <= 0) {
	      $box.promptBox('请选择有效数据');
	        return;
	   }
	var ids = "";
	$.each(getSelectRows, function(i,val){ 
		ids+=val.id+","
   });
	ids = ids.substring(0,ids.length-1);
	deleteById(ids);
}*/
function sureDelete(ids){
	$.ajax({
		url : "/sjcq/manage/area/deleteByids",
		dataType : "json",
		type : "post",
		data : {ids:ids},
		success : function(data) {
			$box.promptBox("删除成功");
			$('#myModal').on('hidden.bs.modal', function () {
				$("#qxName").html("");
				initqXName();
		    });
		},
		error : function(result, status) {
			$box.promptBox("系统异常，请联系管理员！");
		}
	});
}

/*检索*/
function search(){
	var areaName = $("#area_name").val();
	areaName = qx+" "+areaName;
	areaName = areaName.replace(/(^\s*)/g, "");//去掉左边空格
	areaName = areaName.replace(/(\s*$)/g, "");//去掉右边空格
	areaName = areaName.replace(/\s+/g, "@#@");	
    $("#areaDataTable").bootstrapTable('getOptions').pageNumber=1;
    $("#areaDataTable").bootstrapTable("refresh",{query: 
    	{ 
    	    orderField:'id',
    	    orderType:'desc',
    	    searchWord:JSON.stringify({table:'d_photo_pic',term:areaName,type_one:'',type_two:''}),
	    	pageIndex: 1,
	        pageSize: function(){
		       	 return $("#areaDataTable").bootstrapTable('getOptions').pageSize;
	        }()
    	}
      }
    );

}

function editPic(picXh,picid){
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
				search();
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
				search();
			}else{
				$box.promptBox("加入活动失败");
			}
		},
		error : function() {
			alert("服务器错误！");
		}
	});
}