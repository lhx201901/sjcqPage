/**
 * 设置区县封面图片js
 * @author xzq	 
 * @Time 2018/09/19
 */
var MODULEID_="";
var PARAM={};
var areaName="";
var MAIN_PAGE_WINDOW = {};//前一个页面对象
var xh,paths,pathm;
$(document).ready(function(){
	checksessoin();
	PARAM = GetParamByRequest();
	MODULEID_ = PARAM.MODULEID_;
	areaName=PARAM.aliasName;
	MAIN_PAGE_WINDOW = parent.document.getElementById("tab_frame_"+PARAM.MAIN_PAGE_ID_).contentWindow;
	initTable();
});
/**
 * 修改页面高度
 */
function setHeight(){
	setIframeHeight("hotPic_content",MODULEID_);
}
/**
 * 初始化图片列表
 */
function initTable(){
    $('#hotPic').bootstrapTable({
        url: "/sjcq/photoPic/findAll",  //请求后台的URL（*）
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
        			searchWord:JSON.stringify({'type':2,'term':$("#searchWord").val().trim(),'ssdw':areaName}),
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
        uniqueId: "modId",   //每一行的唯一标识，一般为主键列
        cardView: false,   //是否显示详细视图
        detailView: false,   //是否显示父子表
        onLoadSuccess:setHeight,
        columns: [
        {
			field : 'picScz',
			title : '图片所属者',
			align:'center'
		}, {
			field : 'picMc',
			title : '图片标题',
			align:'center'
		}, {
			field : 'picScsj',
			title : '上传时间',
			formatter : function(value, row, index) {
				if (value && value != null && value != 'null') {
					return new Date(value).format("yyyy-MM-dd hh:mm:ss");
				} else {
					return value;
				}

			},
			align:'center'
		}, {
			field : 'picRemark',
			title : '图片说明',
			align:'center'
		},{
                title: '操作',
                field: 'operat',
                align: 'center',
                valign: 'middle',
                formatter:function(value,row,index){  
                	var html =  '<input type="button" value="图片详情"class="report_data_table_but btn btn-primary" onclick="showPicInfo(\'' + row.picXh + '\')" style="margin-right: 5px;"/>';
                	html +=  '<input type="button" value="设置封面"class="report_data_table_but btn btn-info" onclick="setCoverInfo(\'' + row.picXh + '\',\'' + row.picLylys + '\',\'' + row.picLyljm + '\')" style="margin-right: 5px;"/>';
                  return html;  
              } 
         }]
    });
};

/**
 * 检索
 */
function search(){
    $("#hotPic").bootstrapTable('getOptions').pageNumber=1;
    $("#hotPic").bootstrapTable("refresh",{query: 
    	{ 
    		searchWord:JSON.stringify({'type':2,'term':$("#searchWord").val().trim(),'ssdw':areaName}),
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

function setCoverInfo(pxh,ppaths,ppathm){ 
	xh=pxh;
	paths=ppaths;
	pathm=ppathm;
	var area={};
	$box.promptSureBox("是否确定将当前图片设置为封面", "suerSet");
}
function suerSet(){
	var area={};
	area.aliasName=PARAM.aliasName;
	area.engName=PARAM.engName;
	area.remark=PARAM.remark;
	area.coverPicMidPath=pathm;
	area.coverPicSmallPath=paths;
	area.haveCover=1;
	area.id=PARAM.id;
	$.ajax({
		url : "/sjcq/manage/area/editSaveArea",
		dataType : "json",
		type : "post",
		data : area,
		success : function(data) {
			if (data.resultStatus) {
				$box.promptBox("封面信息设置成功！！");
				MAIN_PAGE_WINDOW.search();
			}else{
				$box.promptBox(data.resultInfo);
			}
		},
		error : function(result, status) {
			$box.promptBox("系统异常，请联系管理员！");
		}
	});
}