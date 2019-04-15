/**
 * 部门管理页js
 * author lxw
 * 2018/01/23
 */
var zTree; //树对象
var moudleTreeNodes=null;//当前加载的树形节点
var zNodes  ; //模块树的初始化数据
var MODULEID_ ;//模块id序号
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
		url : "/sjcq/manage/hotPicSort/getAll",
		dataType : "json",
		type : "post",
		data : {},
		success : function(data) {
			$.each(data, function(i, item) {
				$('#sortType').append(" <option value='"+item.uuid+"'>"+item.sortName+"</option>");
				if(i==0){
					initTable();
				}
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
        url: "/sjcq/manage/hotPicInfo/getPicPageInfo",  //请求后台的URL（*）
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
        			sortUUid:$("#sortType").val(),
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
    $("#hotPic").bootstrapTable('getOptions').pageNumber=1;
    $("#hotPic").bootstrapTable("refresh",{query: 
    	{ 
    		sortUUid:$("#sortType").val(),
	    	pageIndex: 1,
	        pageSize: function(){
		       	 return $("#hotPic").bootstrapTable('getOptions').pageSize;
	        }()
    	}
      }
    );
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
	
	var url = "../html/hotPicture/addHotPic.html";
	var tabId = "addHotPic";
	var name = "添加热门图片";
	var param = JSON.stringify({
		"tabId" : tabId,
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"uuid" : $("#sortType").val()
	});
	pageAddNewTab(tabId, name, url, param)
}
/**
 * 根据主键批量、单一删除
 * @param ids
 */
function sureDeleteById(ids){
	$.ajax({
		url : "/sjcq/manage/hotPicInfo/deleteByIdIn",
		dataType : "text",
		type : "post",
		data : {ids:ids},
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