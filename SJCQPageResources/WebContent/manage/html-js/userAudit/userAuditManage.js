/**
 * 注册信息审核管理页js
 * author cl
 * 2018/05/17
 */
var MODULEID_ ;//模块id序号
var userType;
$(document).ready(function() {
	checksessoin();
	MODULEID_ = GetParamByRequest().MODULEID_;
	userType=parseInt($("#userTypeSel").val());
	$("#userTypeSel").change(function(){
		userType=parseInt($(this).val());
		if(userType==1 || userType==2){
			$("#typeText").text("真实姓名：");
			$("#searchName").val("");
			$("#auditStatusSel").val("");
		}else if(userType==3){
			$("#typeText").text("企业名称：");
			$("#searchName").val("");
			$("#auditStatusSel").val("");
		}
		initTable();
	});
	initTable();
	
});

/**
 * 初始化表格
 */
function initTable() {
	var searchName = $("#searchName").val();
	var auditStatus = $("#auditStatusSel").val();
	if(userType==1 || userType==2){
		$(".userAuditDataTablePre").empty();
		$(".userAuditDataTablePre").html('<table id="userAuditDataTable" class="table-bordered table-hover"></table>');
		$('#userAuditDataTable').bootstrapTable({
	        url: "/sjcq/person/loadPersonToPage",  //请求后台的URL（*）
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
	        			realName:searchName,
	        			personType:userType,
	        			auditStatus:auditStatus,
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
	        uniqueId: "personId",   //每一行的唯一标识，一般为主键列
	        cardView: false,   //是否显示详细视图
	        detailView: false,   //是否显示父子表
	        onDblClickRow: function (row) {
	        	searchPersonInfo(row.personId);
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
	                field: 'realName',
	                title: '真实姓名'
	            }, {
	                field: 'namePy',
	                title: '姓名拼音'
	            }, {
	                field: 'IDNumber',
	                title: '身份证号'
	            }, {
	                field: 'sex',
	                title: '性别'
	            },  {
	                field: 'birthDay',
	                title: '出生年月'
	            },{
	                field: 'industry',
	                title: '行业'
	            }, {
	                field: 'region',
	                title: '所在地区'
	            }, {
	                field: 'unit',
	                title: '所在单位'
	            },{
	                field: 'createTime',
	                title: '提交审核时间',
	                formatter:function(value,row,index){  
	                   return timestampToTime(row.createTime);
	                }
	            },{
	                field: 'auditStatus',
	                title: '审核状态',
	                formatter:function(value,row,index){  
	                     var text = "";
	                     if(row.auditStatus==0){
	                   	  	text = "待审核";
	                     }else if(row.auditStatus==1){
	                   	  	text = "审核通过";
	                     }else if(row.auditStatus==2){
	                        text = "审核不通过";
	                     }
	                   return text;
	                }
	            },{
	                field: 'auditRemark',
	                title: '审核备注'
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
	}else if(userType==3){
		$(".userAuditDataTablePre").empty();
		$(".userAuditDataTablePre").html('<table id="userAuditDataTable" class="table-bordered table-hover"></table>');
		$('#userAuditDataTable').bootstrapTable({
	        url: "/sjcq/enter/loadEnterToPage",  //请求后台的URL（*）
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
	        			enterName:searchName,
	        			auditStatus:auditStatus,
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
	        uniqueId: "enterId",   //每一行的唯一标识，一般为主键列
	        cardView: false,   //是否显示详细视图
	        detailView: false,   //是否显示父子表
	        onDblClickRow: function (row) {
	        	searchPersonInfo(row.enterId);
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
	                field: 'enterName',
	                title: '企业名称'
	            }, {
	                field: 'organizationCode',
	                title: '组织代码'
	            }, {
	                field: 'legalPerson',
	                title: '法人'
	            }, {
	                field: 'liaison',
	                title: '联络人'
	            },  {
	                field: 'contactPhone',
	                title: '联络电话'
	            },{
	                field: 'address',
	                title: '联络地址'
	            }, {
	                field: 'unitProperties',
	                title: '单位性质'
	            }, {
	                field: 'manuscriptType',
	                title: '稿件类型'
	            },{
	                field: 'createTime',
	                title: '提交审核时间',
	                formatter:function(value,row,index){  
		                   return timestampToTime(row.createTime);
		                }
	            },{
	                field: 'auditStatus',
	                title: '审核状态',
	                formatter:function(value,row,index){  
	                     var text = "";
	                     if(row.auditStatus==0){
	                   	  	text = "待审核";
	                     }else if(row.auditStatus==1){
	                   	  	text = "审核通过";
	                     }else if(row.auditStatus==2){
	                        text = "审核不通过";
	                     }
	                   return text;
	                }
	            },{
	                field: 'auditRemark',
	                title: '审核备注'
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
    
}
function addOpter(row) {
	var html = "";
	if(userType==1 || userType==2){
		html += '<input type="button" value="查看详情"class="report_data_table_but btn btn-primary" onclick="searchPersonInfo(\'' + row.personId + '\')" style="margin-right: 5px;"/>';
	}else if(userType==3){
		html += '<input type="button" value="查看详情"class="report_data_table_but btn btn-primary" onclick="searchEnterInfo(\'' + row.enterId + '\')" style="margin-right: 5px;"/>';
	}
	return html;
}
/**
 * 修改html的高度
 */
function setHeight(){
	setIframeHeight("userAudit_content",MODULEID_);
}

/**
 * 检索
 */
function searchUserAuditData(){
	var searchName = $("#searchName").val();
	var auditStatus = $("#auditStatusSel").val();
	$("#userAuditDataTable").bootstrapTable('getOptions').pageNumber=1;
	if(userType==1 || userType==2){
		$("#userAuditDataTable").bootstrapTable("refresh",{query:{ 
			realName:searchName,
			personType:userType,
			auditStatus:auditStatus,
	    	pageIndex: 1,    
	        pageSize: function(){
		       	 return $("#userAuditDataTable").bootstrapTable('getOptions').pageSize;
	        }()
    	}
		});
	}else if(userType==3){
		$("#userAuditDataTable").bootstrapTable("refresh",{query:{ 
			enterName:searchName,
			auditStatus:auditStatus,
	    	pageIndex: 1,    
	        pageSize: function(){
		       	 return $("#userAuditDataTable").bootstrapTable('getOptions').pageSize;
	        }()
    	}
		});
	}
}

/**
 * 刷新表格
 */
function refreshTable(){
	$("#userAuditDataTable").bootstrapTable("refresh", {
		query : {
	    	pageIndex: 1,    
	        pageSize: function(){
		       	 return $("#userAuditDataTable").bootstrapTable('getOptions').pageSize;
	        }()
		}
	});
}

/**
 * 批量审核
 */
function batchUserAuditByIds(){
	var table = "";
	table += "<table style ='margin-left:20%;' id='audit_table'>";
	table += "<tr><td>备注:</td><td>";
	table += "<textarea id='userRemarks' rows='3' cols='20'></textarea>";	
	table += "</td></tr>"
	table += "<tr><td colspan='2'>";
	table += '<input type="button" value="审核通过" class="report_data_table_but btn btn-primary" onclick="auditPassData()"/>';	
	table += '<input type="button" value="审核不通过" class="report_data_table_but btn btn-danger" onclick="auditRejectData()"/>';	
	table += "</td></tr>";
	table += "</table>";
	$box.promptSureBox(table);
//	$box.promptSureBox("删除不能恢复，请慎重！","sureDelete",depId);
	$("#myModalLabel").html("审核");
}

/**
 * 得到ids
 */
function getIds(){
	var getSelectRows = $("#userAuditDataTable").bootstrapTable('getSelections');
	 if (getSelectRows.length <= 0) {
	      $box.promptBox('请选择有效数据');
	        return;
	   }
	var ids = "";
	$.each(getSelectRows, function(i,val){
		if(val.auditStatus!= 0){
			$box.promptBox('请选择待审核的数据');
		    return;
		}
		ids+=val.roleId+",";
  });
  ids = ids.substring(0,ids.length-1);
  return ids;
}

/**
 * 确认审核
 * @param ids
 */
function auditPass(ids){
	var ids=getIds();
	if(userType==1 || userType==2){
		$.ajax({
		    url:"/sjcq/manage/role/deleteRoleByIds",    //请求的url地址
		    dataType:"json",   //返回格式为json
		    async:true,//请求是否异步，默认为异步，这也是ajax重要特性
		    data:{ids:ids},    //参数值
		    type:"post",   //请求方式
		    success:function(data){
		    	$box.promptBox(data.resultInfo);
		    	refreshTable();
		    },
		    error:function(){
		        alert("服务器错误！");
		    }
		});
	}else if(userType==3){
		$.ajax({
		    url:"/sjcq/manage/role/deleteRoleByIds",    //请求的url地址
		    dataType:"json",   //返回格式为json
		    async:true,//请求是否异步，默认为异步，这也是ajax重要特性
		    data:{ids:ids},    //参数值
		    type:"post",   //请求方式
		    success:function(data){
		    	$box.promptBox(data.resultInfo);
		    	refreshTable();
		    },
		    error:function(){
		        alert("服务器错误！");
		    }
		});
	}
	
}

/**
 * 查看详情--个人信息
 * @param personId
 */
function searchPersonInfo(personId){
	var url = "../manage/userAudit/personInfo.html";
	var tabId = "personInfo";
	var name = "";
	if(userType==1){
		name="摄影师信息"
	}else if(userType==2){
		name="设计师信息"
	}
	var param =JSON.stringify({"tabId":tabId,"MODULEID_":MODULEID_,"MAIN_PAGE_ID_":MODULEID_,"personId":personId,"userType":userType});
	pageAddNewTab(tabId, name, url,param)
}

/**
 * 查看详情--企业信息
 * @param enterId
 */
function searchEnterInfo(enterId){
	var url = "../manage/userAudit/enterInfo.html";
	var tabId = "personInfo";
	var name = "企业信息";
	var param =JSON.stringify({"tabId":tabId,"MODULEID_":MODULEID_,"MAIN_PAGE_ID_":MODULEID_,"enterId":enterId});
	pageAddNewTab(tabId, name, url,param)
}

/**
 * 将时间戳转换成日期格式
 * @param timestamp
 * @returns {String}
 */
function timestampToTime(timestamp) {
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = (date.getDate()< 10 ? '0'+ date.getDate() : date.getDate()) + ' ';
    h = (date.getHours() < 10 ? '0'+ date.getHours() : date.getHours()) + ':';
    m = (date.getMinutes() < 10 ? '0'+ date.getMinutes() : date.getMinutes()) + ':';
    s = (date.getSeconds() < 10 ? '0'+ date.getSeconds() : date.getSeconds());
    return Y+M+D+h+m+s;
}
