/**
 * 图片支付信息管理页js 
 */
var MODULEID_;// 模块id序号
var payXhs=[];
$(document).ready(function() {
	checksessoin();
	MODULEID_ = GetParamByRequest().MODULEID_;
	//initTable();
	initPicScz();
});
/**
 * 初始化图片上传者
 */
function initPicScz(){
	$.ajax({
		url : "/sjcq/photoPay/getPicSczInfo", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {}, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			$("#picScz option").remove();
			var html="<option value=''>全部</option>";
			$.each(data,function(index,item){
				html+="<option value='"+item+"'>"+item+"</option>";
			});
			$("#picScz").append(html);
			initTable();
		},
		error : function() {
			alert("服务器错误！");
		}
	});
}
/**
 * 切换数据类型
 * @returns
 */
function changeAuditStatu(){
	refreshTable();
}
/**
 * 初始化表格
 */
function initTable() {
	$('#userAuditDataTable').bootstrapTable({
		url : "/sjcq/photoPay/getPhotoPayPageInfo", // 请求后台的URL（*）
		classes : "table table-no-bordered",
		striped : true, // 是否显示行间隔色
		pagination : true, // 是否显示分页（*）
		sortable : false, // 是否启用排序
		method : "post",
		contentType : "application/x-www-form-urlencoded; charset=UTF-8",
		sortOrder : "asc", // 排序方式
		sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
		queryParamsType : "",
		queryParams : function(params) {
			var param = {
				term : $("#term").val(),
				settlementType : $("#picPay").val(),
				pciScz:$("#picScz").val(),
				pageIndex : params.pageNumber,
				pageSize : params.pageSize
			};
			return param;
		},
		// strictSearch:true,//设置为 true启用 全匹配搜索，否则为模糊搜索
		// searchOnEnterKey:true,
		maintainSelected : true,// 设置为 true 在点击分页按钮或搜索按钮时，将记住checkbox的选择项
		clickToSelect : true,// 设置true 将在点击行时，自动选择rediobox 和 checkbox
		// showPaginationSwitch:true,
		// showColumns:true,
		selectItemName : "checdd",
		// search:true,
		pageNumber : 1, // 初始化加载第一页，默认第一页
		pageSize : 10, // 每页的记录行数（*）
		pageList : [ 5, 10, 50, 100 ], // 可供选择的每页的行数（*）
		smartDisplay : false,
		strictSearch : false,
		// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
		uniqueId : "personId", // 每一行的唯一标识，一般为主键列
		cardView : false, // 是否显示详细视图
		detailView : false, // 是否显示父子表
		onDblClickRow : function(row) {
			searchDesignerInfo(row.applyXh);
		},
		onLoadSuccess : setHeight,
		columns : [ {
			field : 'checdd',
			checkbox : true
		},
		{
			field : 'pic_mc',
			title : '图片名称',
			align : 'center'
		},{
			field : 'ssdw',
			title : '所属单位',
			align : 'center'
		},{
			field : 'pic_scz',
			title : '上传者',
			align : 'center'
		}, {
			field : 'pay_acount_name',
			title : '购买者',
			align : 'center'
		}, {
			field : 'pay_date',
			title : '支付时间',
			align : 'center'
		}, {
			field : 'have_settlement',
			title : '是否结算',
			formatter : function(value, row, index) {
				if(row.have_settlement==1){
					return '已结算';
				}else{
					return '未结算';
				}
			},
			align : 'center'
		}, {
			field : 'settlement_date',
			title : '结算时间',
			align : 'center'
		}, {
			title : '操作',
			field : 'operat',
			align : 'center',
			valign : 'middle',
			width:'300',
			formatter : function(value, row, index) {
				return addOpter(row);
			}
		} ]
	});

}
function addOpter(row) {
	var html = '<input type="button" value="查看详情"class="report_data_table_but btn btn-primary" onclick="searchInfo(\''+ row.pic_xh + '\')" style="margin-right: 5px;"/>';
	if(row.have_settlement==0){		
		html+='<input type="button" value="结算"class="report_data_table_but btn btn-info" onclick="singlePicPay(\''+row.pay_xh+'\')" style="margin-right: 5px;"/>';
	}
	//	html+='<input type="button" value="审核"class="report_data_table_but btn btn-info" onclick="userAuditById('+row.personId+')" style="margin-right: 5px;"/>';
//	html+='<input type="button" value="权限"class="report_data_table_but btn btn-warning" onclick="userPowerById('+row.personId+','+row.downPower+')" style="margin-right: 5px;"/>';
	return html;
}
/**
 * 修改html的高度
 */
function setHeight() {
	setIframeHeight("userAudit_content", MODULEID_);
}

/**
 * 检索
 */
function searchData() {
	$("#userAuditDataTable").bootstrapTable('getOptions').pageNumber = 1;
	$("#userAuditDataTable").bootstrapTable(
			"refresh",
			{
				query : {
					term : $("#term").val(),
					settlementType : $("#picPay").val(),
					pciScz:$("#picScz").val(),
					pageIndex : 1,
					pageSize : function() {
						return $("#userAuditDataTable").bootstrapTable(
								'getOptions').pageSize;
					}()
				}
			});

}

/**
 * 刷新表格
 */
function refreshTable() {
	$("#userAuditDataTable").bootstrapTable(
			"refresh",
			{
				query : {
					term : $("#term").val(),
					settlementType : $("#picPay").val(),
					pciScz:$("#picScz").val(),
					pageIndex : 1,
					pageSize : function() {
						return $("#userAuditDataTable").bootstrapTable(
								'getOptions').pageSize;
					}()
				}
			});
}

/**
 * 批量审核
 */
function batchPay() {
	var getSelectRows = $("#userAuditDataTable").bootstrapTable('getSelections');
	if (getSelectRows.length <= 0) {
		$box.promptBox('请选择待结算的数据！！');
		return;
	}
	payXhs=[];
	$.each(getSelectRows, function(i, val) {
		if(val.have_settlement==0){			
			payXhs.push(val.pay_xh);
		}
	});
	$box.promptSureBox("是否确定结算当前选中数据", "surePay",'');
}

function singlePicPay(payXh){
	$box.promptSureBox("是否确定结算当前数据", "sureAudit", payXh);
}
/**
 * 确认
 * @param ids
 * @param passOrNo
 */
function  sureAudit(xh){
	payXhs=[];
	payXhs.push(xh);
	surePay();
}
function surePay(){
	$.ajax({
		url : "/sjcq/photoPay/photoSettlement", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
		type : "post", // 请求方式
		data : JSON.stringify(payXhs), // 参数值
		contentType : "application/json;charset=UTF-8",
		success : function(data) {
			if(data.statu==true||data.statu=='true'){
				payXhs=[];
				$box.promptBox("结算成功！");
				refreshTable();
			}else{
				$box.promptBox(data.data);
			}
		},
		error : function() {
			alert("服务器错误！");
		}
	});

}
/**
 * 确认
 * @param ids
 * @param passOrNo
 */
function auditPass(ids,passOrNo) {
	var remark=$("#userRemarks").val();
	$.ajax({
		url : "/sjcq/contributorApply/taskAudit", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {
			ids : ids,
			statu : passOrNo,
			remark:remark
		}, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			$box.promptBox(data.resultInfo);
			refreshTable();
		},
		error : function() {
			alert("服务器错误！");
		}
	});

}
/**
 * 查看详情
 * @param id
 */
function searchInfo(picXh) {
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
