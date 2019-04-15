/**
 * 热门图片添加js
 * @author xzq	 
 * @Time 2018/09/19
 */
var MODULEID_="";
var PARAM={};
var sortUuid="";
var picXhChecd=[];//图片被选择过得信息
var MAIN_PAGE_WINDOW = {};//前一个页面对象
$(document).ready(function(){
	checksessoin();
	PARAM = GetParamByRequest();
	MODULEID_ = PARAM.MODULEID_;
	sortUuid=PARAM.uuid;
	getPicCheckInfo();
	MAIN_PAGE_WINDOW = parent.document.getElementById("tab_frame_"+PARAM.MAIN_PAGE_ID_).contentWindow;
});



	
/**
 * 修改页面高度
 */
function setHeight(){
	setIframeHeight("hotPic_content",MODULEID_);
}
/**
 * 初始化分类下被选中的图片
 */
function getPicCheckInfo(){
	$.ajax({
		url : "/sjcq/manage/hotPicInfo/findBySortUuid",
		dataType : "json",
		type : "post",
		data : {sortUuid:sortUuid},
		success : function(data) {
			$.each(data, function(i, item) {
				picXhChecd.push(item.picXh);
			});
			initTable();
		},
		error : function(result, status) {
			$box.promptBox("系统异常，请联系管理员！");
		}
	});
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
        			searchWord:JSON.stringify({'type':1,'term':$("#searchWord").val().trim()}),
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
/*        onDblClickRow: function (row) {
        	searchModuleInfo(row.modId);
        },
*/        onLoadSuccess:setHeight,
        onCheck:signChecked,
        onUncheck:signUnChecked,
        onCheckAll:allChecked,
        onUncheckAll:allUnChecked,
        onPageChange:onPageChange,
        columns: [{
            field: 'checdd',
            checkbox: true
        },
        {
			field : 'picScz',
			title : '图片所属者',
			width:'8%',
			align:'center'
		}, {
			field : 'picMc',
			title : '图片标题',
			width:'20%',
			align:'center'
		}, {
			field : 'picScsj',
			title : '上传时间',
			width:'20%',
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
			width:'40%',
			align:'center'
		},{
                title: '操作',
                field: 'operat',
                align: 'center',
                valign: 'middle',
                formatter:function(value,row,index){  
                	var html =  '<input type="button" value="图片详情"class="report_data_table_but btn btn-primary" onclick="showPicInfo(\'' + row.picXh + '\')" style="margin-right: 5px;"/>';
                  return html;  
              } 
         }]
    });
    onPageChange();
};
/**
 * 检索
 */
function search(){
    $("#hotPic").bootstrapTable('getOptions').pageNumber=1;
    $("#hotPic").bootstrapTable("refresh",{query: 
    	{ 
    		searchWord:JSON.stringify({'type':1,'term':$("#searchWord").val().trim()}),
	    	pageIndex: 1,
	        pageSize: function(){
		       	 return $("#hotPic").bootstrapTable('getOptions').pageSize;
	        }()
    	}
      }
    );
    onPageChange();
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
 * 单个勾选
 * @author xzq
 * @createTime 2018/09/19
 * @param row
 */
function signChecked(row){
		var isJoin=true;
		$.each(picXhChecd,function(index,item){
			if(item==row.picXh){
				isJoin=false;
				return false;
			}
		});
		if(isJoin){
			picXhChecd.push(row.picXh);
		}
}


/**
 * 单个取消勾选
 * @author xzq
 * @createTime 2018/09/19
 * @param row
 */
function signUnChecked(row){
	for(var i=0;i<picXhChecd.length;i++){
		if(picXhChecd[i]==row.picXh){
			picXhChecd.splice(i, 1);
		}
	}
}

/**
 * 全部勾选
 * @author xzq
 * @createTime 2018/09/19
 * @param rows
 */
function allChecked(rows){
	$.each(rows,function(index_row,item_row){
		var isJoin=true;
		$.each(picXhChecd,function(index,item){
			if(item==item_row.picXh){
				isJoin=false;
				return false;
			}
		});
		if(isJoin){
			picXhChecd.push(item_row.picXh);
		}
	});
}

/**
 * 全部取消勾选
 * @author xzq
 * @createTime 2018/09/19
 * @param rows
 */
function allUnChecked(rows){
	for(var j=0;j<rows.length;j++){
		for(var i=0;i<picXhChecd.length;i++){
			if(picXhChecd[i]==rows[j].picXh){
				picXhChecd.splice(i, 1);
			}
		}
	}
}

/**
 * 表头改变后勾选已选择多选框
 * @author xzq
 * @createTime 2018/09/19
 */
function checkedBoxWhenInit(){
	var get_data=$("#hotPic").bootstrapTable("getData");
	for(var i=0;i<picXhChecd.length;i++){
		for(var j=0;j<get_data.length;j++){
			if(picXhChecd[i]==get_data[j].picXh){
				$("#hotPic").bootstrapTable("check",j);
			}
		}
	}
}
/**
 * 翻页事件
 * @author xzq
 * @createTime 2018/09/19
 */
function onPageChange(){
	setTimeout("checkedBoxWhenInit()",200);
}
/**
 * 添加图片
 */
function addPicture(){
	if(picXhChecd.length==0){
		$box.promptBox("请先勾选热门图片！！");
	}else{
		$box.promptSureBox("是否将选中的图片设置为热门图片！！", "sureAdd", "");
	}
}
/**
 * 提交热门图片审核信息
 */
function sureAdd(){
	var picXhs="";
	$.each(picXhChecd, function(i, item) {
		if(i==0){
			picXhs=item;
		}else{
			picXhs+=","+item;
		}
	});
	$.ajax({
		url : "/sjcq/manage/hotPicInfo/addHotPicInfo",
		dataType : "text",
		type : "post",
		data : {'sortUuid':sortUuid,'picXhs':picXhs},
		success : function(data) {
			if(data=='true'){
				$box.promptBox("热门图片设置成功！！");
				MAIN_PAGE_WINDOW.search();
			}else{
				$box.promptBox("热门图片设置失败");
			}
			search();
		},
		error : function(result, status) {
			$box.promptBox("系统异常，请联系管理员！");
		}
	});

}