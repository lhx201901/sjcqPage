/**
 * 区县管理js 
 **/
var MODULEID_ ;//模块id序号
$(document).ready(function(){
	checksessoin();
	MODULEID_ = GetParamByRequest().MODULEID_;
	initTable();
});

/*
 *初始化区县信息列表 
 */
function initTable() {
    $('#areaDataTable').bootstrapTable({
        url: "/sjcq/manage/area/loadPageAreaByTerm",  //请求后台的URL（*）
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
        			aliasName:$("#area_name").val(),
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
        },
            {
                field: 'aliasName',
                title: '区县名称',
                align: 'center'
            }, {
                field: 'engName',
                title: '英文名称',
                align: 'center'
            }, {
                field: 'coverPicMidPath',
                title: '封面路径',
                align: 'center',
                width: '30%'
            }, {
                field: 'remark',
                title: '备注',
                align: 'center',
                width: '20%'
            }, {
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

/*添加操作栏*/
function addOpter(row) {
	var html = "";
	html += '<input type="button" value="编辑"class="report_data_table_but btn btn-info" onclick="editInfo(\'' + row.id + '\')" style="margin-right: 5px;"/>';
	html += '<input type="button" value="删除"class="report_data_table_but btn btn-danger" onclick="deleteById(\'' + row.id + '\')" style="margin-right: 5px;"/>';
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



/**
 * 编辑
 * @param id
 */
function editInfo(id) {
	var url = "../html/area/addOrEditArea.html";
	var tabId = "editArea";
	var name = "编辑区县信息";
	var param = JSON.stringify({
		"tabId" : tabId,
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"areaId" : id,
		"optType":"edit"
	});
	pageAddNewTab(tabId, name, url, param);
}

/*删除区县信息*/
function deleteById(id){
	$box.promptSureBox("是否确定删除区县信息！！",'sureDelete',id);
}
/*批量删除区县信息*/
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
}
function sureDelete(ids){
	$.ajax({
		url : "/sjcq/manage/area/deleteByids",
		dataType : "json",
		type : "post",
		data : {ids:ids},
		success : function(data) {
			$box.promptBox("删除成功");
			$('#myModal').on('hidden.bs.modal', function () {
				search();
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
    $("#areaDataTable").bootstrapTable('getOptions').pageNumber=1;
    $("#areaDataTable").bootstrapTable("refresh",{query: 
    	{ 
    		aliasName:areaName,
	    	pageIndex: 1,
	        pageSize: function(){
		       	 return $("#areaDataTable").bootstrapTable('getOptions').pageSize;
	        }()
    	}
      }
    );

}