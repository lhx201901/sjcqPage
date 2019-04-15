/**
 * 图片分类管理js
 * author lxw
 * 2018/01/23
 */
var zTree; //树对象
var sortTreeNodes=null;//当前加载的树形节点
var zNodes  ; //模块树的初始化数据
var MODULEID_ ;//模块id序号
$(document).ready(function(){
	checksessoin();
	MODULEID_ = GetParamByRequest().MODULEID_;
	initSortTree();
	initTable();
});
/**
 * 修改页面高度
 */
function setHeight(){
	setIframeHeight("mou_content_div",MODULEID_);
}
/**
 * 模块树形属性设置
 * 创建人：lxw
 * 创建时间：2017/04/01
 * @type {{view: {dblClickExpand: boolean, showLine: boolean, selectedMulti: boolean}, data: {key: {url: string}, simpleData: {enable: boolean, idKey: string, pIdKey: string, rootPId: string}}, callback: {onClick: Function}}}
 */
var setting = {
    view: {
        dblClickExpand: true,
        showLine: false,
        selectedMulti: false
    },
    data: {
        key:{url:"noUrl"},
        simpleData: {
            enable:true,
            idKey: "xh",
            pIdKey: "pxh",
            rootPId: ""
        }
    },
    callback: {
        onClick:function(event,treeId,treeNode,clickFlag){
        	sortTreeNodes = treeNode;
        	$("#sort_name").val("");
        	searchSort();
        }
    }
};
/**
 * 加载模块树
 */
function initSortTree(){
    var ztree_parent = $("#sortTree").parent().html(' <ul id="sortTree" class="ztree leftTreeStyle "></ul>');//ztree的父节点
    var t = $("#sortTree");
    $.ajax({
        url:'/sjcq/manage/picSort/loadPicSortTree',
        type:'post',
        data:{},
        dataType:'JSON',
        async:false,
        success:function(data){
        	//alert(JSON.stringify(data));
        	zNodes = eval(data);
        	t = $.fn.zTree.init(t, setting, zNodes);
        	var zTree = $.fn.zTree.getZTreeObj("sortTree");
        	var sel_id="0";
        	if(sortTreeNodes){
        		sel_id=sortTreeNodes.id;
        	}
        	sortTreeNodes=zTree.getNodeByParam("id", sel_id);
        	zTree.selectNode(sortTreeNodes);
        	//展开所有节点
        	//t.expandAll(true);
        	zTree.expandNode(zTree.getNodes()[0], true);

        }
    });
}


/**
 * 初始化表格
 * @param nodeId
 */
function initTable() {
    $('#sortDataTable').bootstrapTable({
        url: "/sjcq/manage/picSort/loadPagePicSortByPxh",  //请求后台的URL（*）
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
        			pxh:sortTreeNodes.xh,
        			name:$("#sort_name").val(),
            		pageIndex: params.pageNumber,    
	            	pageSize: params.pageSize
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
        uniqueId: "id",   //每一行的唯一标识，一般为主键列
        cardView: false,   //是否显示详细视图
        detailView: false,   //是否显示父子表
        onDblClickRow: function (row) {
        	searchModuleInfo(row.modId);
        },
        onLoadSuccess:setHeight,
        columns: [{
            field: 'checdd',
            checkbox: true
        },{
                field: 'sortName',
                title: '栏目名称',
                align: 'center'
            }, {
                field: 'sortRemarks',
                title: '备注',
                align: 'center'
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
function addOpter(row) {
	var html = "";
	html += '<input type="button" value="查看"class="report_data_table_but btn btn-primary" onclick="searchSortInfo(\'' + row.id + '\')" style="margin-right: 5px;"/>';
	html += '<input type="button" value="编辑"class="report_data_table_but btn btn-info" onclick="editSortById(\'' + row.id + '\')" style="margin-right: 5px;"/>';
	html += '<input type="button" value="删除"class="report_data_table_but btn btn-danger" onclick="deleteSortByxh(\'' + row.sortXh + '\')" style="margin-right: 5px;"/>';
	return html;
}
/**
 * 检索
 */
function searchSort(){
	var sortName = $("#sort_name").val();
    $("#sortDataTable").bootstrapTable('getOptions').pageNumber=1;
    $("#sortDataTable").bootstrapTable("refresh",{query: 
    	{ 
    		pxh:sortTreeNodes.xh,
    		name:sortName,
	    	pageIndex: 1,
	        pageSize: function(){
		       	 return $("#sortDataTable").bootstrapTable('getOptions').pageSize;
	        }()
    	}
      }
    );
}

/**
 * 添加模块信息
 * 创建人：lxw
 * 创建时间：2017/07/11
 */
function addSort() {

	var table = "";
	table += "<table style ='margin-left:20%;' ><tr>";
	table += "<td>栏目名称：</td><td>";
	table += "<input type='text' class='form-control dep_info_table_td' id='sortName'/>";	
	table += "</td></tr><tr>";
	table += "<td>备注：</td><td>";
	table += "<textarea rows='3' cols='1' style='width: 206px' class='form-control report_data_table_td' id='sortRemarks'>";
	table += "</textarea></td></tr></table>";
	$box.promptSureBox(table,'saveSort',"");
	$("#myModalLabel").html("新增栏目");
	//initUploadify();
}

/**
 * 添加模块信息
 * 创建人：lxw
 * 创建时间：2017/07/11
 */
function saveSort() {
	var sort_obj = {};
	var pxh = sortTreeNodes.xh;
	var sortName = $("#sortName").val();
	var sortRemarks = $("#sortRemarks").val();
	var child = sortTreeNodes.children;
	var state = "";
	$.each(child,function(i,ite){
		if(ite.name==sortName.trim()){
			state = true;
			return false;
		}
	});
	if(state){
		$box.promptBox("添加失败，栏目名称已经存在！");
		return;
	}
	
	sort_obj.sortPxh = pxh;
	sort_obj.sortName = sortName;
	sort_obj.sortRemarks = sortRemarks;
	$.ajax({
		url : "/sjcq/manage/picSort/addSavePicSort",
		dataType : "json",
		type : "post",
		data : sort_obj,
		success : function(data) {
			$box.promptBox(data.resultInfo);
			if (data.resultStatus) {
				initSortTree();//刷新 树,不要注释掉
				searchSort();
			}
		},
		error : function(result, status) {
			$box.promptBox("系统异常，请联系管理员！");
		}
	});
}

/**
 * 查看详情
 * @param modId
 */
function searchSortInfo(modId){
	var obj = $("#sortDataTable").bootstrapTable('getData');
	var mo = {};
	$.each(obj,function(i,ite){
		if(ite.id==modId){
			mo = ite;
			return false;
		}
	});
	var table = "";
	table += "<table style ='margin-left:20%;' ><tr>";
	table += "<td>栏目名称：</td><td>";
	table += "<input type='text' class='form-control dep_info_table_td' id='sortName' readonly='readonly'/>";	
	table += "</td></tr><tr>";
	table += "<td>备注：</td><td>";
	table += "<textarea rows='3' cols='1' style='width: 206px' class='form-control report_data_table_td' id='sortRemarks' readonly='readonly'>";
	table += "</textarea></td></tr></table>";
	$box.promptBox(table);
	$("#myModalLabel").html("栏目信息");
	
	$("#sortRemarks").val(mo.sortRemarks);
	$("#sortName").val(mo.sortName);
}

/**
 * 编辑保存
 * @param modId
 */
function editSortById(modId){
	var obj = $("#sortDataTable").bootstrapTable('getData');
	var mo = {};
	$.each(obj,function(i,ite){
		if(ite.id==modId){
			mo = ite;
			return false;
		}
	});
	var table = "";
	table += "<table style ='margin-left:20%;' ><tr>";
	table += "<td>栏目名称：</td><td>";
	table += "<input type='text' class='form-control dep_info_table_td' id='sortXh' style='display: none'/>" +
			"<input type='text' class='form-control dep_info_table_td' id='sortPxh' style='display: none'/>" +
			"<input type='text' class='form-control dep_info_table_td' id='sortId' style='display: none'/>";	
	table += "<input type='text' class='form-control dep_info_table_td' id='sortName'/>";	
	table += "</td></tr><tr>";
	table += "<td>备注：</td><td>";
	table += "<textarea rows='3' cols='1' style='width: 206px' class='form-control report_data_table_td' id='sortRemarks'>";
	table += "</textarea></td></tr></table>";
	
	$box.promptSureBox(table,'sureAddSaveSort',"");
	$("#myModalLabel").html("编辑栏目");
	$("#sortPxh").val(mo.sortPxh);
	$("#sortXh").val(mo.sortXh);
	$("#sortId").val(mo.id);
	$("#sortName").val(mo.sortName);
	$("#sortRemarks").val(mo.sortRemarks);
}
/**
 * 确认编辑保存
 */
function sureAddSaveSort(){
	var sort_obj = {};
	var id =  $("#sortId").val();
	var sortName = $("#sortName").val();
	var sortPxh=$("#sortPxh").val();
	var sortXh=$("#sortXh").val();
	var sortRemarks = $("#sortRemarks").val();
	var child = sortTreeNodes.children;
	var state = "";
	$.each(child,function(i,ite){
		if(ite.name==sortName.trim()&&ite.id!=id){
			state = true;
			return false;
		}
	});
	if(state){
		$box.promptBox("修改失败，栏目名称已经存在！");
		return;
	}
	sort_obj.id = id;
	sort_obj.sortName = sortName;
	sort_obj.sortPxh = sortPxh;
	sort_obj.sortXh = sortXh;
	sort_obj.sortRemarks = sortRemarks;
	$.ajax({
		url : "/sjcq/manage/picSort/editSavePicSort",
		dataType : "json",
		type : "post",
		data : sort_obj,
		success : function(data) {
			$box.promptBox(data.resultInfo);
			if (data.resultStatus) {
				initSortTree();//刷新 树,不要注释掉
				searchSort();
			}
		},
		error : function(result, status) {
			$box.promptBox("系统异常，请联系管理员！");
		}
	});
}
/**
 * 批量删除
 */
function batchDeleteSortByxhs(){
	var getSelectRows = $("#sortDataTable").bootstrapTable('getSelections');
	 if (getSelectRows.length <= 0) {
	      $box.promptBox('请选择有效数据');
	        return;
	   }
	var xhs = "";
	$.each(getSelectRows, function(i,val){ 
		xhs+=val.sortXh+","
    });
	xhs = xhs.substring(0,xhs.length-1);
	deleteSortByxh(xhs);
}
/**
 * 删除
 * @param id
 */
function  deleteSortByxh(xh){
	$box.promptSureBox("删除后不能恢复，请慎重！",'sureDeleteSortByXh',xh);
	$("#myModalLabel").html("删除提示");
}

/**
 * 根据主键批量、单一删除
 * @param ids
 */
function sureDeleteSortByXh(xhs){
	$.ajax({
		url : "/sjcq/manage/picSort/deletePicSortByXhs",
		dataType : "json",
		type : "post",
		data : {ids:xhs},
		success : function(data) {
			$box.promptBox(data.resultInfo);
			if (data.resultStatus) {
				initSortTree();//刷新 树,不要注释掉
				searchSort();
			}
		},
		error : function(result, status) {
			$box.promptBox("系统异常，请联系管理员！");
		}
	});
}