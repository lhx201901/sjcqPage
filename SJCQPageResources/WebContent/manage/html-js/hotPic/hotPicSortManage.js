/**
 * 热门图片分类管理js
 * author xzq
 * 2018/09/18
 */
var zTree; //树对象
var moudleTreeNodes=null;//当前加载的树形节点
var zNodes  ; //模块树的初始化数据
var MODULEID_ ;//模块id序号
$(document).ready(function(){
	checksessoin();
	MODULEID_ = GetParamByRequest().MODULEID_;
	initTable();
});
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
        url: "/sjcq/manage/hotPicSort/getHotPicSortPageInfo",  //请求后台的URL（*）
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
        onDblClickRow: function (row) {
        	searchModuleInfo(row.modId);
        },
        onLoadSuccess:setHeight,
        columns: [{
            field: 'checdd',
            checkbox: true
        },
            {
                field: 'sortName',
                title: '分类名称',
                align:'center'
            },  {
                field: 'createUser',
                title: '创建人',
                align:'center'
            }, {
                field: 'createTime',
                title: '创建时间',
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
	html += '<input type="button" value="编辑"class="report_data_table_but btn btn-info" onclick="editById(\'' + row.id + '\')" style="margin-right: 5px;"/>';
	html += '<input type="button" value="删除"class="report_data_table_but btn btn-danger" onclick="deleteById(\'' + row.id + '\')" style="margin-right: 5px;"/>';
	return html;
}
/**
 * 检索
 */
function searchData(){
    $("#hotPic").bootstrapTable('getOptions').pageNumber=1;
    $("#hotPic").bootstrapTable("refresh",{query: 
    	{ 
	    	pageIndex: 1,
	        pageSize: function(){
		       	 return $("#hotPic").bootstrapTable('getOptions').pageSize;
	        }()
    	}
      }
    );
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
	$("#myModalLabel").html("新增热门图片分类");
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
			url : "/sjcq/manage/hotPicSort/addHotPicSort",
			dataType : "text",
			type : "post",
			data : obj,
			success : function(data) {
				$box.promptBox(data);
				searchData();
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
function editById(id){
	var obj = $("#hotPic").bootstrapTable('getData');
	var mo = {};
	$.each(obj,function(i,ite){
		if(ite.id==id){
			mo = ite;
			return false;
		}
	});
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
	$("#sortId").val(mo.id);
	$("#sortName").val(mo.sortName);
	$("#createUser").val(mo.createUser);
	$("#createTime").val(mo.createTime);
	$("#uuid").val(mo.uuid);
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
	obj.id=$("#sortId").val();
	obj.sortName=$("#sortName").val();
	obj.createUser=$("#createUser").val();
	obj.createTime=$("#createTime").val();
	obj.uuid=$("#uuid").val();
	$.ajax({
		url : "/sjcq/manage/hotPicSort/updateHotPicSort",
		dataType : "text",
		type : "post",
		data : obj,
		success : function(data) {
			$box.promptBox(data);
			searchData();
		},
		error : function(result, status) {
			$box.promptBox("系统异常，请联系管理员！");
		}
	});
}
/**
 * 批量删除
 */
function delHotPicSort(){
	var getSelectRows = $("#hotPic").bootstrapTable('getSelections');
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
/**
 * 删除
 * @param id
 */
function  deleteById(id){
	$box.promptSureBox("删除后不能恢复，请慎重！",'sureDeleteById',id);
	$("#myModalLabel").html("删除提示");
}

/**
 * 根据主键批量、单一删除
 * @param ids
 */
function sureDeleteById(ids){
	$.ajax({
		url : "/sjcq/manage/hotPicSort/deleteBySortIdIn",
		dataType : "text",
		type : "post",
		data : {id:ids},
		success : function(data) {
			var info="";
			if(data=='true'){
				info="操作成功";
			}else{
				info="操作失败";
			}
			$box.promptBox(info);
			searchData();
		},
		error : function(result, status) {
			$box.promptBox("系统异常，请联系管理员！");
		}
	});
}