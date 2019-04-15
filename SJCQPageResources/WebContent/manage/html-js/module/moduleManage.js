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
	initModuleTree();
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
            idKey: "id",
            pIdKey: "parentId",
            rootPId: ""
        }
    },
    callback: {
        onClick:function(event,treeId,treeNode,clickFlag){
        	moudleTreeNodes = treeNode;
        	$("#module_name").val("");
        	searchModule();
        }
    }
};
/**
 * 加载模块树
 */
function initModuleTree(){
    var ztree_parent = $("#moduleTree").parent().html(' <ul id="moduleTree" class="ztree leftTreeStyle "></ul>');//ztree的父节点
    var t = $("#moduleTree");
    $.ajax({
        url:'/sjcq/manage/module/loadModuleTree',
        type:'post',
        data:{},
        dataType:'JSON',
        async:false,
        success:function(data){
        	//alert(JSON.stringify(data));
        	zNodes = eval(data);
        	t = $.fn.zTree.init(t, setting, zNodes);
        	var zTree = $.fn.zTree.getZTreeObj("moduleTree");
        	var sel_id="0";
        	if(moudleTreeNodes){
        		sel_id=moudleTreeNodes.id;
        	}
        	moudleTreeNodes=zTree.getNodeByParam("id", sel_id);
        	zTree.selectNode(moudleTreeNodes);
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
    $('#moduleDataTable').bootstrapTable({
        url: "/sjcq/manage/module/loadPageModuleByPid",  //请求后台的URL（*）
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
        			pid:moudleTreeNodes.id,
        			name:$("#module_name").val(),
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
        },/* {
            field: 'opter',
            title: '操作栏',
            formatter: tableformatter
        },*/
            {
                field: 'modName',
                title: '模块名称'
            }, {
                field: 'modTypes',
                title: '模块类型',
                formatter:function(value,row,index){  
                    var text = "";
                    if(row.modTypes == 1){
                  	  text = "功能";
                    }else{
                       text = "按钮";
                    }
                  return text;
                }
            }, {
                field: 'modUrl',
                title: '模块连接'
            }, {
                field: 'modRemarks',
                title: '备注'
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
	html += '<input type="button" value="查看"class="report_data_table_but btn btn-primary" onclick="searchModuleInfo(\'' + row.modId + '\')" style="margin-right: 5px;"/>';
	html += '<input type="button" value="编辑"class="report_data_table_but btn btn-info" onclick="editModuleById(\'' + row.modId + '\')" style="margin-right: 5px;"/>';
	html += '<input type="button" value="删除"class="report_data_table_but btn btn-danger" onclick="deleteModuleById(\'' + row.modId + '\')" style="margin-right: 5px;"/>';
	return html;
}
/**
 * 检索
 */
function searchModule(){
	var moduleName = $("#module_name").val();
    $("#moduleDataTable").bootstrapTable('getOptions').pageNumber=1;
    $("#moduleDataTable").bootstrapTable("refresh",{query: 
    	{ 
    		pid:moudleTreeNodes.id,
    		name:moduleName,
	    	pageIndex: 1,
	        pageSize: function(){
		       	 return $("#moduleDataTable").bootstrapTable('getOptions').pageSize;
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
function addModule() {

	var table = "";
	table += "<table style ='margin-left:20%;' ><tr>";
	table += "<td>模块名称：</td><td>";
	table += "<input type='text' class='form-control dep_info_table_td' id='moduleName'/>";	
	table += "</td></tr>";	
	table += "<tr style='display:none;'><td>模块类型：</td><td>";		
	table += "<input type='radio' name='module_type' value='1' checked='checked'>模块";
	table += "<input type='radio' name='module_type' value='2'>按钮";
	table += "</td></tr>";
	table += "<tr><td>模块链接：</td><td>";
	table += "<input type='text' class='form-control dep_info_table_td' id='modUrl'/>";
	table += "</td></tr><tr>";
	table += "<td>备注：</td><td>";
	table += "<textarea rows='3' cols='1' style='width: 206px' class='form-control report_data_table_td' id='modRemarks'>";
	table += "</textarea></td></tr></table>";
	$box.promptSureBox(table,'saveModule',"");
	$("#myModalLabel").html("新增模块");
	//initUploadify();
}

/**
 * 添加模块信息
 * 创建人：lxw
 * 创建时间：2017/07/11
 */
function saveModule() {
	var module_obj = {};
	var modParentId = moudleTreeNodes.id;
	var moduleName = $("#moduleName").val();
	var modTypes = $("input[name='module_type']:checked").val();
	var modUrl = $("#modUrl").val();
	var modRemarks = $("#modRemarks").val();
	var child = moudleTreeNodes.children;
	var state = "";
	$.each(child,function(i,ite){
		if(ite.name==moduleName.trim()){
			state = true;
			return false;
		}
	});
	if(state){
		$box.promptBox("添加失败，模块名称已经存在！");
		return;
	}
	
	module_obj.modPid = modParentId;
	module_obj.modName = moduleName;
	module_obj.modTypes = modTypes;
	module_obj.modUrl = modUrl;
	module_obj.modRemarks = modRemarks;
	$.ajax({
		url : "/sjcq/manage/module/addSaveModule",
		dataType : "json",
		type : "post",
		data : module_obj,
		success : function(data) {
			$box.promptBox(data.resultInfo);
			
			if (data.resultStatus) {
				initModuleTree();//刷新 树,不要注释掉
				searchModule();
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
function searchModuleInfo(modId){
	var obj = $("#moduleDataTable").bootstrapTable('getData');
	var mo = {};
	$.each(obj,function(i,ite){
		if(ite.modId==modId){
			mo = ite;
			return false;
		}
	});
	var table = "";
	table += "<table style ='margin-left:20%;' ><tr>";
	table += "<td>模块名称：</td><td>";
	table += "<input type='text' class='form-control dep_info_table_td' id='moduleName' readonly='readonly'/>";	
	table += "</td></tr><tr>";	
	table += "<td style='display:none;'>模块类型：</td><td style='display:none;'>";		
	table += "<input type='radio' name='module_type' value='1' checked='checked'>模块";
	table += "<input type='radio' name='module_type' value='2'>按钮";
	table += "</td></tr><tr>";
	table += "<td>模块链接：</td><td>";
	table += "<input type='text' class='form-control dep_info_table_td' id='modUrl' readonly='readonly'/>";
	table += "</td></tr><tr>";
	table += "<td>备注：</td><td>";
	table += "<textarea rows='3' cols='1' style='width: 206px' class='form-control report_data_table_td' id='modRemarks' readonly='readonly'>";
	table += "</textarea></td></tr></table>";
	$box.promptBox(table);
	$("#myModalLabel").html("模块信息");
	
	$("#moduleName").val(mo.modName);
	$("input:radio[value='"+mo.modTypes+"']").attr('checked','true');
	$("input:radio").attr("disabled", true);
	$("#modUrl").val(mo.modUrl);
	$("#modRemarks").val(mo.modRemarks);
}

/**
 * 编辑保存
 * @param modId
 */
function editModuleById(modId){
	var obj = $("#moduleDataTable").bootstrapTable('getData');
	var mo = {};
	$.each(obj,function(i,ite){
		if(ite.modId==modId){
			mo = ite;
			return false;
		}
	});
	var table = "";
	table += "<table style ='margin-left:20%;' ><tr>";
	table += "<td>模块名称：</td><td>";
	table += "<input type='text' class='form-control dep_info_table_td' id='modId' style='display: none'/>";	
	table += "<input type='text' class='form-control dep_info_table_td' id='moduleName'/>";	
	table += "</td></tr><tr>";	
	table += "<td style='display:none;'>模块类型：</td><td style='display:none;'>";		
	table += "<input type='radio' name='module_type' value='1' checked='checked'>模块";
	table += "<input type='radio' name='module_type' value='2'>按钮";
	table += "</td></tr><tr>";
	table += "<td>模块链接：</td><td>";
	table += "<input type='text' class='form-control dep_info_table_td' id='modUrl'/>";
	table += "</td></tr><tr>";
	table += "<td>备注：</td><td>";
	table += "<textarea rows='3' cols='1' style='width: 206px' class='form-control report_data_table_td' id='modRemarks'>";
	table += "</textarea></td></tr></table>";
	
	$box.promptSureBox(table,'sureAddSaveModule',"");
	$("#myModalLabel").html("编辑模块");
	
	$("#modId").val(mo.modId);
	$("#moduleName").val(mo.modName);
	$("input:radio[value='"+mo.modTypes+"']").attr('checked','true');
	$("#modUrl").val(mo.modUrl);
	$("#modRemarks").val(mo.modRemarks);
}
/**
 * 确认编辑保存
 */
function sureAddSaveModule(){
	var module_obj = {};
	var modId =  $("#modId").val();
	var modName = $("#moduleName").val();
	var modTypes = $("input[name='module_type']:checked").val();
	var modUrl = $("#modUrl").val();
	var modRemarks = $("#modRemarks").val();
	var child = moudleTreeNodes.children;
	var state = "";
	$.each(child,function(i,ite){
		if(ite.name==modName.trim()&&ite.id!=modId){
			state = true;
			return false;
		}
	});
	if(state){
		$box.promptBox("添加失败，模块名称已经存在！");
		return;
	}
	
	module_obj.modId = modId;
	module_obj.modName = modName;
	module_obj.modTypes = modTypes;
	module_obj.modUrl = modUrl;
	module_obj.modRemarks = modRemarks;
	$.ajax({
		url : "/sjcq/manage/module/editSaveModule",
		dataType : "json",
		type : "post",
		data : module_obj,
		success : function(data) {
			$box.promptBox(data.resultInfo);
			if (data.resultStatus) {
				initModuleTree();//刷新 树,不要注释掉
				searchModule();
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
function batchDeleteModuleByIds(){
	var getSelectRows = $("#moduleDataTable").bootstrapTable('getSelections');
	 if (getSelectRows.length <= 0) {
	      $box.promptBox('请选择有效数据');
	        return;
	   }
	var ids = "";
	$.each(getSelectRows, function(i,val){ 
    	ids+=val.modId+","
    });
    ids = ids.substring(0,ids.length-1);
    sureDeleteModuleById(ids);
}
/**
 * 删除
 * @param id
 */
function  deleteModuleById(id){
	$box.promptSureBox("删除后不能恢复，请慎重！",'sureDeleteModuleById',id);
	$("#myModalLabel").html("删除提示");
}

/**
 * 根据主键批量、单一删除
 * @param ids
 */
function sureDeleteModuleById(ids){
	$.ajax({
		url : "/sjcq/manage/module/deleteModuleByIds",
		dataType : "json",
		type : "post",
		data : {ids:ids},
		success : function(data) {
			$box.promptBox(data.resultInfo);
			if (data.resultStatus) {
				initModuleTree();//刷新 树,不要注释掉
				searchModule();
			}
		},
		error : function(result, status) {
			$box.promptBox("系统异常，请联系管理员！");
		}
	});
}