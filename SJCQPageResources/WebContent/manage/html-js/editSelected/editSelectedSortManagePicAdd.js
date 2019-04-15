/**
 * 编辑精选分类管理js
 * author xzq
 * 2018/09/18
 */
var zTree; //树对象
var moudleTreeNodes=null;//当前加载的树形节点
var zNodes  ; //模块树的初始化数据
var MODULEID_;// 模块id序号
var PARAM={}; //前一个页面传递的参数对象
var MAIN_PAGE_WINDOW = {};//前一个页面对象
var BROADID_ = "";//序号
var IFRAMEID_="";//当前iframid
var BROAD={};
var FILE;
var picId="";
$(document).ready(function() {
	checksessoin();
	PARAM= GetParamByRequest();
	IFRAMEID_="tab_seed_"+PARAM.tabId;
	BROADID_ = PARAM.broadId;
	MAIN_PAGE_WINDOW = parent.document.getElementById("tab_frame_"+PARAM.MAIN_PAGE_ID_).contentWindow;
	picId = PARAM.PicId;
	MODULEID_ =PARAM.MODULEID_;
	initTable();
});
/**
 * 修改页面高度
 */
function setHeight(){
	setIframeHeight("hotPic_content",MODULEID_);
}
function addPicToSelectSort(uuid,name){
	URL1="/sjcq/photoPicManage/addPicToEditSelect";
	var options="";
	$.ajax({
		url : URL1, 
		dataType : "json", 
		async : false,
		data : {picIds:picId,editSelectSortXh:uuid,editSelectSortName:name
		}, 
		type : "post", 
		success : function(data) {
			if(data==true || data=="true"){
				$box.promptBox("加入编辑精选成功");
				$('#myModal').on('hidden.bs.modal', function () {
					parent.closableTab.closeThisTab(PARAM.tabId);
			    });
			}else{
				$box.promptBox("加入编辑精选失败");
			}
		},
		error : function() {
			alert("服务器错误！");
		}
	});
}
/**
 * 初始化表格
 * @param nodeId
 */
function initTable() {
    $('#hotPic').bootstrapTable({
        url: "/sjcq/manage/editSelectedSort/getHotPicSortPageInfo",  //请求后台的URL（*）
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
        	showFile(row.uuid);
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
            }, {
    			field : 'updateDate',
    			title : '排序',
    			width:'13%',
    			align :'center',
    			formatter : function(value, row, index) {
    				//1置顶，2上移，3下移，4置底，5设置特定的数值
    				var text = "<select style='width: 100px;' id='Order' dataId='"+row.id+"' onchange=\"changeOrder(this,'"+row.id+"',this.options[this.options.selectedIndex].value)\">"
    				+"<option value='0'>不修改</option><option value='1'>置顶</option><option value='2'>上移</option><option value='3'>下移</option><option value='4'>置底</option><option value='5'>设定数值</option></select>";
    				return text;
    			}
    		}, {
    			field : 'picAuthor',
    			title : '加入该组',
    			align :'center',
    			width:'13%',
    			formatter : function(value, row, index) {
    				var html = '<input type="button" value="加入该组" class="report_data_table_but btn btn-info" onclick="addPicToSelectSort(\''+ row.uuid + '\',\''+ row.sortName + '\')" style="margin-right: 5px;"/>';
    				return html;
    			}
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
function showFile(uuid){
	var url = "../html/editSelected/editSelectPicInfoManagePic.html";
	var tabId = "selectedFile";
	var name = "精选组图";
	var param = JSON.stringify({
		"tabId" : "selectedFile",
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"uuid" : uuid
	});
	pageAddNewTab("selectedFile", name, url, param)

}
function changeOrder(_this,dataId,val){
//	alert(_this.options[_this.options.selectedIndex].value)
//	alert(_this.getAttribute("dataId")+"=="+dataId+"=="+$("#Order option:selected").text()+"="+val);
	var html="";
	if(val==0){
		return;
	}if(val==5){
		html = "<div><span>排序号：</span><input type=\"text\" class=\"text\" value='' id=\"orderNum\" onkeyup=\"if(!/^\\d+(\\d{0,2})?$/.test(this.value)){this.value='';}\"" + " onafterpaste=\"if(!/^\\d+(\\d{0,2})?$/.test(this.value)){this.value='';}\"   value='' /> </div>";
	}else{
		html="是否修改排序规则！";
	}
	$box.promptSureBox(html,"sureChange",dataId+","+val);
}
function sureChange(data){
	var obj ={};
	var dataId=data.split(",")[0]
	var orderType=data.split(",")[1];
	obj.dataId = dataId;
	obj.orderType = orderType;
	if(orderType==5){
		if($("#orderNum").val()==""){
			alert("请输入排序号！");
			return;
		}else{
			obj.orderNum = $("#orderNum").val();
		}
	}
	$.ajax({
		url : "/sjcq/editSelectedSort/changeDataOrder", 
		dataType : "json", 
		async : true,
		data : obj, 
		type : "post", 
		success : function(data) {
			if(data==true || data=="true"){
				$box.promptBox("修改成功！");
				$('#myModal').on('hidden.bs.modal', function () {
					searchData();
			    });
			}else{
				$box.promptBox("修改失败！");
			}
			
		},
		error : function() {
			alert("服务器错误！");
		}
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
		url : "/sjcq/manage/editSelectedSort/updateHotPicSort",
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
		url : "/sjcq/manage/editSelectedSort/deleteBySortIdIn",
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