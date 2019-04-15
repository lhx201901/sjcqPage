/**
 * 字典管理页js
 * author lxw
 * 2018/01/23
 */
var zTree; //树对象
var dicTreeNodes=null;//当前加载的树形节点
var zNodes  ; //模块树的初始化数据
var MODULEID_ ;//模块id序号
$(document).ready(function(){
	checksessoin();
	MODULEID_ = GetParamByRequest().MODULEID_;
	initDictionaryTree();
	initTable();
});
/**
 * 修改页面高度
 */
function setHeight(){
	setIframeHeight("dic_content_div",MODULEID_);
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
        	dicTreeNodes = treeNode;
        	$("#dic_name").val("");
        	searchDictionary();
        }
    }
};
/**
 * 加载模块树
 */
function initDictionaryTree(){
    var ztree_parent = $("#dictionaryTree").parent().html(' <ul id="dictionaryTree" class="ztree leftTreeStyle "></ul>');//ztree的父节点
    var t = $("#dictionaryTree");
    $.ajax({
        url:'/sjcq/manage/dictionary/loadDicTree',
        type:'post',
        data:{},
        dataType:'JSON',
        async:false,
        success:function(data){
        	//alert(JSON.stringify(data));
        	zNodes = eval(data);
        	t = $.fn.zTree.init(t, setting, zNodes);
        	var zTree = $.fn.zTree.getZTreeObj("dictionaryTree");
        	var sel_id="0";
        	if(dicTreeNodes){
        		sel_id=dicTreeNodes.id;
        	}
        	dicTreeNodes=zTree.getNodeByParam("id", sel_id);
        	zTree.selectNode(dicTreeNodes);
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
    $('#dictionaryDataTable').bootstrapTable({
        url: "/sjcq/manage/dictionary/loadDataTotable",  //请求后台的URL（*）
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
        			dicParentId:dicTreeNodes.id,
        			dicName:"",
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
        uniqueId: "dicId",   //每一行的唯一标识，一般为主键列
        cardView: false,   //是否显示详细视图
        detailView: false,   //是否显示父子表
        onDblClickRow: function (row) {
        	searchDictionaryInfo(row.dicId);
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
                field: 'dicCode',
                title: '字典代码'
            }, { 
            	field: 'dicName',
                title: '字典名称'
            }, {
            	field: 'dicTypes',
                title: '字典大类',
                formatter:function(value,row,index){  
                    var text = "";
                    text = "第"+row.dicTypes+"类";
                  return text;
                }
            }, {
                field: 'dicRemarks',
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
	html += '<input type="button" value="查看"class="report_data_table_but btn btn-primary" onclick="searchDictionaryInfo(\'' + row.dicId + '\')" style="margin-right: 5px;"/>';
	html += '<input type="button" value="编辑"class="report_data_table_but btn btn-info" onclick="editDictionayById(\'' + row.dicId + '\')" style="margin-right: 5px;"/>';
	html += '<input type="button" value="删除"class="report_data_table_but btn btn-danger" onclick="deleteDictionaryById(\'' + row.dicId + '\')" style="margin-right: 5px;"/>';
	return html;
}
/**
 * 检索
 */
function searchDictionary(){
	var dicName = $("#dic_name").val();
    $("#dictionaryDataTable").bootstrapTable('getOptions').pageNumber=1;
    $("#dictionaryDataTable").bootstrapTable("refresh",{query: 
    	{ 
    		dicParentId:dicTreeNodes.id,
    		dicName:dicName,
	    	pageIndex: 1,
	        pageSize: function(){
		       	 return $("#dictionaryDataTable").bootstrapTable('getOptions').pageSize;
	        }()
    	}
      }
    );
}

/**
 * 添加字典信息
 * 创建人：lxw
 * 创建时间：2017/07/11
 */
function addDictionary() {
	
	var table = "";
	table += "<table style ='margin-left:20%;' >";
	table += "<tr><td>父级名称：</td><td>";
	table += "<input type='text' class='form-control dep_info_table_td' id='pName'readonly='readonly'/>";
	table += "</td></tr>";
	table += "<tr><td>字典代码：</td><td>";
	table += "<input type='text' class='form-control dep_info_table_td' id='dicCode'/>";	
	table += "</td></tr><tr>";	
	table += "<td>字典名称：</td><td>";		
	table += "<input type='text' class='form-control dep_info_table_td' id='dicName'/>";
	table += "</td></tr><tr style='display:none;'>";
	table += "<td>是否默认显示：</td><td>";
	table += "<input type='radio' name='is_default' value='0' checked='checked'>是";
	table += "<input type='radio' name='is_default' value='1'>否";
	table += "</td></tr><tr>";
	table += "<td>备注：</td><td>";
	table += "<textarea rows='3' cols='1' style='width: 206px' class='form-control report_data_table_td' id='dicRemarks'>";
	table += "</textarea></td></tr></table>";
	$box.promptSureBox(table,'sureSaveDic',"");
	$("#myModalLabel").html("新增字典项");
	//initUploadify();
	$("#pName").val(dicTreeNodes.name);
	
}

/**
 * 确认添加字典信息
 * 创建人：lxw
 * 创建时间：2017/07/11
 */
function sureSaveDic() {
	var dic_obj = {};
	var dicParentId = dicTreeNodes.id;
	var dicCode = $("#dicCode").val();
	var dicName = $("#dicName").val();
	var isDefault = $("input[name='is_default']:checked").val();
	var dicRemarks = $("#dicRemarks").val();
//	var child = dicTreeNodes.children;
//	var state = "";
//	$.each(child,function(i,ite){
//		if(ite.name==moduleName.trim()){
//			state = true;
//			return false;
//		}
//	});
//	if(state){
//		$box.promptBox("添加失败，模块名称已经存在！");
//		return;
//	}
	
	dic_obj.dicParentId = dicParentId;
	dic_obj.dicCode = dicCode;
	dic_obj.dicName = dicName;
	dic_obj.isDefault = isDefault;
	dic_obj.dicRemarks = dicRemarks;
	$.ajax({
		url : "/sjcq/manage/dictionary/addSaveDic",
		dataType : "json",
		type : "post",
		data : dic_obj,
		success : function(data) {
			$box.promptBox(data.resultInfo);
			
			if (data.resultStatus) {
				initDictionaryTree();//刷新 树,不要注释掉
				searchDictionary();
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
function searchDictionaryInfo(dicId){
	var obj = $("#dictionaryDataTable").bootstrapTable('getData');
	var mo = {};
	$.each(obj,function(i,ite){
		if(ite.dicId==dicId){
			mo = ite;
			return false;
		}
	});
	var table = "";
	table += "<table style ='margin-left:20%;' >";
	table += "<tr><td>父级名称：</td><td>";
	table += "<input type='text' class='form-control dep_info_table_td' id='pName'readonly='readonly'/>";
	table += "</td></tr>";
	table += "<tr><td>字典代码：</td><td>";
	table += "<input type='text' class='form-control dep_info_table_td' id='dicCode' readonly='readonly'/>";	
	table += "</td></tr><tr>";	
	table += "<td>字典名称：</td><td>";		
	table += "<input type='text' class='form-control dep_info_table_td' id='dicName' readonly='readonly'/>";
	table += "</td></tr><tr style='display:none;'>";
	table += "<td>是否默认显示：</td><td>";
	table += "<input type='radio' name='is_default' value='0' checked='checked'>是";
	table += "<input type='radio' name='is_default' value='1'>否";
	table += "</td></tr><tr>";
	table += "<td>备注：</td><td>";
	table += "<textarea rows='3' cols='1' style='width: 206px' class='form-control report_data_table_td' id='dicRemarks' readonly='readonly'>";
	table += "</textarea></td></tr></table>";
	
	$box.promptBox(table);
	$("#myModalLabel").html("字典项信息");
	
	$("#dicCode").val(mo.dicCode);
	$("input:radio[value='"+mo.isDefault+"']").attr('checked','true');
	$("input:radio").attr("disabled", true);
	$("#dicName").val(mo.dicName);
	$("#dicRemarks").val(mo.dicRemarks);
	$("#pName").val(dicTreeNodes.name);
}

/**
 * 编辑保存
 * @param modId
 */
function editDictionayById(dicId){
	var obj = $("#dictionaryDataTable").bootstrapTable('getData');
	var mo = {};
	$.each(obj,function(i,ite){
		if(ite.dicId==dicId){
			mo = ite;
			return false;
		}
	});
	var table = "";
	table += "<table style ='margin-left:20%;' >";
	table += "<tr><td>父级名称：</td><td>";
	table += "<input type='text' class='form-control dep_info_table_td' id='pName'readonly='readonly'/>";
	table += "</td></tr>";
	table += "<tr><td>字典代码：</td><td>";
	table += "<input type='text' class='form-control dep_info_table_td' id='dicId' style='display: none'/>";
	table += "<input type='text' class='form-control dep_info_table_td' id='dicCode'/>";	
	table += "</td></tr><tr>";	
	table += "<td>字典名称：</td><td>";		
	table += "<input type='text' class='form-control dep_info_table_td' id='dicName'/>";
	table += "</td></tr><tr style='display:none;'>";
	table += "<td>是否默认显示：</td><td>";
	table += "<input type='radio' name='is_default' value='0' checked='checked'>是";
	table += "<input type='radio' name='is_default' value='1'>否";
	table += "</td></tr><tr>";
	table += "<td>备注：</td><td>";
	table += "<textarea rows='3' cols='1' style='width: 206px' class='form-control report_data_table_td' id='dicRemarks'>";
	table += "</textarea></td></tr></table>";
	
	
	$box.promptSureBox(table,'sureAddSaveModule',"");
	$("#myModalLabel").html("编辑模块");
	
	$("#pName").val(dicTreeNodes.name);
	$("#dicId").val(mo.dicId);
	$("#dicCode").val(mo.dicCode);
	$("#dicName").val(mo.dicName);
	$("input:radio[value='"+mo.isDefault+"']").attr('checked','true');
	$("#dicRemarks").val(mo.dicRemarks);
}
/**
 * 确认编辑保存
 */
function sureAddSaveModule(){
	var dic_obj = {};
	var dicId =  $("#dicId").val();
	var dicCode = $("#dicCode").val();
	var isDefault = $("input[name='is_default']:checked").val();
	var dicName = $("#dicName").val();
	var dicRemarks = $("#dicRemarks").val();
	
	dic_obj.dicId = dicId;
	dic_obj.dicCode = dicCode;
	dic_obj.dicName = dicName;
	dic_obj.isDefault = isDefault;
	dic_obj.dicRemarks = dicRemarks;
	dic_obj.dicParentId=dicTreeNodes.id;
	$.ajax({
		url : "/sjcq/manage/dictionary/editSaveDic",
		dataType : "json",
		type : "post",
		data : dic_obj,
		success : function(data) {
			$box.promptBox(data.resultInfo);
			if (data.resultStatus) {
				initDictionaryTree();//刷新 树,不要注释掉
				searchDictionary();
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
	var getSelectRows = $("#dictionaryDataTable").bootstrapTable('getSelections');
	 if (getSelectRows.length <= 0) {
	      $box.promptBox('请选择有效数据');
	        return;
	   }
	var ids = "";
	$.each(getSelectRows, function(i,val){ 
    	ids+=val.dicId+","
    });
    ids = ids.substring(0,ids.length-1);
    deleteDictionaryById(ids);
}
/**
 * 删除
 * @param id
 */
function  deleteDictionaryById(id){
	$box.promptSureBox("删除后不能恢复，请慎重！",'sureDeleteDicById',id);
	$("#myModalLabel").html("删除提示");
}

/**
 * 根据主键批量、单一删除
 * @param ids
 */
function sureDeleteDicById(ids){
	$.ajax({
		url : "/sjcq/manage/dictionary/deleteDICByIds",
		dataType : "json",
		type : "post",
		data : {ids:ids},
		success : function(data) {
			$box.promptBox(data.resultInfo);
			if (data.resultStatus) {
				initDictionaryTree();//刷新 树,不要注释掉
				searchDictionary();
			}
		},
		error : function(result, status) {
			$box.promptBox("系统异常，请联系管理员！");
		}
	});
}