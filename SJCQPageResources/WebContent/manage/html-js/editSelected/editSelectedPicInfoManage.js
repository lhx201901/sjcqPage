/**
 * 部门管理页js
 * author lxw
 * 2018/01/23
 */
var zTree; //树对象
var moudleTreeNodes=null;//当前加载的树形节点
var zNodes  ; //模块树的初始化数据
var MODULEID_ ;//模块id序号
var uuid;//精选uuid
var ids;//精选id
var sortName;
var createUser;
var createTime;
$(document).ready(function(){
	checksessoin();
	MODULEID_ = GetParamByRequest().MODULEID_;
	initHotPicSort();
});
/**
 * 初始化热门图片分类
 */
function initHotPicSort(){
	$.ajax({
		url : "/sjcq/manage/editSelectedSort/getAll",
		dataType : "json",
		type : "post",
		data : {},
		async :false,
		success : function(data) {
			$.each(data, function(i, item) {
				if(i==0){
					$('#typeTable').append(" <tr class='areaColor' sortName='"+item.sortName+"' createUser='"+item.createUser+"' createTime='"+item.createTime+"' id='"+item.id+"' name='"+item.uuid+"'><td><a>"+item.sortName+"</a></td></tr>");
					uuid=item.uuid;
					ids=item.id;
					sortName=item.sortName;
					createUser=item.createUser;
					createTime=item.createTime;
					initTable();
				}else{
					$('#typeTable').append(" <tr class='' sortName='"+item.sortName+"' createUser='"+item.createUser+"' createTime='"+item.createTime+"' id='"+item.id+"' name='"+item.uuid+"'><td><a>"+item.sortName+"</a></td></tr>");

				}
			});
			$("#typeTable tr").click(function(){
				$("#typeTable tr").removeClass("areaColor");
				$(this).addClass("areaColor");
				uuid=$(this).attr("name");
				ids=$(this).attr("id");
				sortName=$(this).attr("sortName");
				createUser=$(this).attr("createUser");
				createTime=$(this).attr("createTime");
				search();
			});
		},
		error : function(result, status) {
			$box.promptBox("系统异常，请联系管理员！");
		}
	});
}
/**
 * 修改页面高度
 */
function setHeight(){
	setIframeHeight("hotPic_content",MODULEID_);
}

/**
 * 初始化表格
 * @param nodeId
 */
function initTable() {
    $('#hotPic').bootstrapTable({
        url: "/sjcq/manage/editSelectedPicInfo/getPicPageInfoBySortUuidAndSearch",  //请求后台的URL（*）
    	//url:"/sjcq/retriebe/basicSolrSearch",
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
        			sortUUid:uuid,
        			searchWord:$("#searchName").val(),
            		pageIndex: params.pageNumber,    
	            	pageSize: params.pageSize,
	            	type:1
	            };    
	            return param; 
        },
        // strictSearch:true,//设置为 true启用 全匹配搜索，否则为模糊搜索
        //  searchOnEnterKey:true,
        maintainSelected: true,//设置为 true 在点击分页按钮或搜索按钮时，将记住checkbox的选择项
        clickToSelect: true,//设置true 将在点击行时，自动选择rediobox 和 checkbox
        //  showPaginationSwitch:true,
        //  showColumns:true,
        selectItemName: "checdd",
        //  search:true,
        pageNumber: 1,   //初始化加载第一页，默认第一页
        pageSize: 10,   //每页的记录行数（*）
        pageList: [5, 10, 50, 100], //可供选择的每页的行数（*）
        smartDisplay:false,
        strictSearch: false,
        //height: 460,   //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "modId",   //每一行的唯一标识，一般为主键列
        cardView: false,   //是否显示详细视图
        detailView: false,   //是否显示父子表
        onDblClickRow: function (row) {
        	searchModuleInfo(row.modId);
        },
        onLoadSuccess:setHeight,
        columns: [{
            field: 'checdd',
            checkbox: true
        },
        {
			field : 'pic_lylys',
			title : '图片',
			width:'8%',
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
			width:'12%',
			align:'center',
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
			field : 'pic_jg',
			title : '价格',
			width:'8%',
			align:'center',
			formatter : function(value, row, index){
				if(row.pic_jg==null || row.pic_jg ==undefined || row.pic_jg=='null'){
					return "";
				}else{
					return "￥"+row.pic_jg;
				}
			}
		},{
			field : 'pic_scsj',
			title : '申请时间',
			width:'40%',
			align:'center'
		},{
                title: '操作',
                field: 'operat',
                align: 'center',
                valign: 'middle',
                formatter:function(value,row,index){  
                  return addOpter(row);  
              } 
         }]
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

function addOpter(row) {
	var html = "";
	html += '<input type="button" value="图片详情"class="report_data_table_but btn btn-primary" onclick="showPicInfo(\'' + row.pic_xh + '\')" style="margin-right: 5px;"/>';
	html += '<input type="button" value="删除"class="report_data_table_but btn btn-danger" onclick="deleteById(\'' + row.hotPid + '\')" style="margin-right: 5px;"/>';
	return html;
}
/**
 * 检索
 */
function search(){
	var areaName = $("#searchName").val();
	areaName = areaName.replace(/(^\s*)/g, "");//去掉左边空格
	areaName = areaName.replace(/(\s*$)/g, "");//去掉右边空格
	areaName = areaName.replace(/\s+/g, "@#@");
    $("#hotPic").bootstrapTable('getOptions').pageNumber=1;
    $("#hotPic").bootstrapTable("refresh",{query: 
    	{ 
    		sortUUid:uuid,
    		searchWord:areaName,
    		type:1,
	    	pageIndex: 1,
	        pageSize: function(){
		       	 return $("#hotPic").bootstrapTable('getOptions').pageSize;
	        }()
    	}
      }
    );
}

//添加编辑精选图片
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
 * 查看详情
 * @param picXh
 */
function showPicInfo(picXh){
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
/**
 * 批量删除
 */
function batchDeleteByIds(){
	var getSelectRows = $("#hotPic").bootstrapTable('getSelections');
	 if (getSelectRows.length <= 0) {
	      $box.promptBox('请选择有效数据');
	        return;
	   }
	var ids = "";
	$.each(getSelectRows, function(i,val){ 
    	ids+=val.hotPid+","
    });
    ids = ids.substring(0,ids.length-1);
    deleteById(ids);
}
/**
 * 删除
 * @param id
 */
function  deleteById(id){
	$box.promptSureBox("删除后不能恢复，请慎重！",'sureDeleteById',id);
	$("#myModalLabel").html("删除提示");
}
/**
 * 添加图片
 */
function addPicture(){
	var url = "../html/editSelected/addEditSelectPic.html";
	var tabId = "addEditSelectedPic";
	var name = "添加编辑精选图片";
	var param = JSON.stringify({
		"tabId" : tabId,
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"uuid" : uuid
	});
	pageAddNewTab(tabId, name, url, param)
}
/**
 * 根据主键批量、单一删除
 * @param ids
 */
function sureDeleteById(idss){
	$.ajax({
		url : "/sjcq/manage/editSelectedPicInfo/deleteByIdIn",
		dataType : "text",
		type : "post",
		data : {ids:idss},
		success : function(data) {
			if(data=='true'){
				$box.promptBox("删除成功！！");
			}else{
				$box.promptBox("删除失败！！");
			}
			
			search();
		},
		error : function(result, status) {
			$box.promptBox("系统异常，请联系管理员！");
		}
	});
}

/**
 * 添加分类信息
 * 创建人：lxw
 * 创建时间：2017/07/11
 */
function addHotPicSort() {

	var table = "";
	table += "<table style ='margin-left:20%;' ><tr>";
	table += "<td>分类名称：</td><td>";
	table += "<input type='text' class='form-control dep_info_table_td' id='sortName'/>";	
	table += "</td></tr></table>";
	$box.promptSureBox(table,'save',"");
	$("#myModalLabel").html("新增编辑精选图片分类");
	//initUploadify();
}

/**
 * 添加模块信息
 * 创建人：lxw
 * 创建时间：2017/07/11
 */
function save() {
	var obj={};
	var sortName=$("#sortName").val();
	if(sortName.trim().length==0){
		$box.promptBox("请输入分类名称！！");
		return;
	}else{		
		obj.sortName=sortName;
		$.ajax({
			url : "/sjcq/manage/editSelectedSort/addHotPicSort",
			dataType : "text",
			type : "post",
			data : obj,
			success : function(data) {
				$box.promptBox(data);
				$("#typeTable").html("");  
	      	    initHotPicSort();
			},
			error : function(result, status) {
				$box.promptBox("系统异常，请联系管理员！");
			}
		});
	}
}

/**
 * 编辑保存
 * @param modId
 */
function editById(){
	var table = "";
	table += "<table style ='margin-left:20%;' ><tr>";
	table += "<td style='margin-bottom:5px;'>分类名称：</td><td>";
	table += "<input type='text' class='form-control dep_info_table_td' id='createUser' style='display: none'/>";
	table += "<input type='text' class='form-control dep_info_table_td' id='uuid' style='display: none'/>";
	table += "<input type='text' class='form-control dep_info_table_td' id='createTime' style='display: none'/>";
	table += "<input type='text' class='form-control dep_info_table_td' id='sortId' style='display: none'/>";	
	table += "<input type='text' class='form-control dep_info_table_td' id='sortName'/>";	
	table += "</td></tr><tr></table>";
	
	$box.promptSureBox(table,'sureAddSave',"");
	$("#myModalLabel").html("编辑分类信息");
	$("#sortId").val(ids);
	$("#sortName").val(sortName);
	$("#createUser").val(createUser);
	$("#createTime").val(createTime);
	$("#uuid").val(uuid);
}

/**
 * 确认编辑保存
 */
function sureAddSave(){
	var sortName=$("#sortName").val();
	if(sortName.trim().length==0){
		$box.promptBox("请输入分类名称！！");
		return;
	}
	var obj={};
	obj.id=ids;
	obj.sortName=$("#sortName").val();
	obj.createUser=$("#createUser").val();
	obj.createTime=$("#createTime").val();
	obj.uuid=uuid;
	$.ajax({
		url : "/sjcq/manage/editSelectedSort/updateHotPicSort",
		dataType : "text",
		type : "post",
		data : obj,
		success : function(data) {
			$box.promptBox(data);
			$("#typeTable").html("");  
      	    initHotPicSort();
		},
		error : function(result, status) {
			$box.promptBox("系统异常，请联系管理员！");
		}
	});
}

/*
 * 删除精选分类
 */
function deteleType(){
	$.ajax({
		url : "/sjcq/manage/editSelectedSort/deleteBySortIdIn",
		dataType : "json",
		type : "post",
		data : {id:ids},
        async :false,
		success : function(data) {
          if(data==true){
        	  $box.promptBox('删除成功!');
              $("#typeTable").html("");  
        	  initHotPicSort();
          }
		},
		error : function(result, status) {
			$box.promptBox("系统异常，请联系管理员！");
		}
	});
}