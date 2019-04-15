/**
 * 轮播管理页js
 */
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
 * 初始化表格
 */
function initTable() {
	$('#broadCastDataTable').bootstrapTable({
		url : "/sjcq/broadcast/loadAll", // 请求后台的URL（*）
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
			var searchName = $("#searchName").val();
			var isUsed = $("#isUsedSel").val();
			var broType = $("#broTypeSel").val();
			var param = {
					picName : searchName,
					broType : broType,
					isUsed:isUsed,
					orderBy:"orderNum",
					orderDesc:0,
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
		uniqueId : "id", // 每一行的唯一标识，一般为主键列
		cardView : false, // 是否显示详细视图
		detailView : false, // 是否显示父子表
		onDblClickRow : function(row) {
			//editInfo(row.id);
		},
		onLoadSuccess : setHeight,
		columns : [ {
			field : 'checdd',
			checkbox : true
		},{// 表格结构配置
			title : "轮播封面",// 列title文字
			field : "pic_lylys",// 该列对应数据哪个字段
			width : "10%",// 列宽度设置,不设也没什么
			align:'center',
			formatter : function(value, row, index) {
				var html ="";
				html+='<div class="hill_img"><div class="hl_img"><img onclick=clickOne(\''+row.picPath+'\')  ondblclick="clickdbl1(\''+row.broadcastXh+'\')" src="'+PICURI+"/"+row.picPath+'"></div></div>';
				console.log(html);
				return html;
			}
		}, {
			field : 'picName',
			title : '图片名称',
			align :'center',
			width:'10%'
		}/*, {
			field : 'picXh',
			title : '是否关联',
			align :'center',
			width:'8%',
			formatter : function(value, row, index) {
				if(row.picXh!=null && row.picXh!=undefined && row.picXh!='null'&&row.picXh.trim().length>0){
					return "是";
				}else{
					return '否';
				}
			}
		}*/, {
			field : 'picContent',
			title : '图片内容',
			align :'center',
			width:'25%'
		}/*, {
			field : 'broType',
			title : '轮播类型',
			align :'center',
			width:'10%',
			formatter : function(value, row, index) {
				// 类型：1、首页；2、图片；3、区县；4、企业；5、首页区县轮播；6、老照片；7、区县详情页轮播
				var text = "";
				if (row.broType == 1) {
					text = "首页";
				} else if (row.broType == 2) {
					text = "图片";
				} else if (row.broType == 3) {
					text = "区县";
				} else if (row.broType == 4) {
					text = "企业";
				}else if (row.broType == 5) {
					text = "首页区县轮播";
				}else if (row.broType == 6) {
					text = "老照片";
				}else if (row.broType == 7) {
					text = "区县详情页轮播";
				}
				return text;
			}
		}, {
			field : 'districtName',
			title : '区县名称',
			align :'center',
			width:'6%'
		}*/, {
			field : 'isUsed',
			title : '启用状态',
			align :'center',
			width:'8%',
			formatter : function(value, row, index) {
				var text = "";
				if (row.isUsed == 0) {
					text = "停用";
				} else if (row.isUsed == 1) {
					text = "启用";
				}
				return text;
			}
		}, {
			field : 'state',
			title : '审核状态',
			align :'center',
			width:'8%',
			formatter : function(value, row, index) {
				var text = "待审核";
				if (row.state == 1) {
					text = "审核通过";
				} else if (row.state == 2) {
					text = "审核不通过";
				}
				return text;
			}
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
				var html = '<input type="button" value="加入该组" class="report_data_table_but btn btn-info" onclick="addPicTobroadCast(\''+ row.broadcastXh + '\',\''+ row.picName + '\')" style="margin-right: 5px;"/>';
				return html;
			}
		}, {
			title : '操作',
			field : 'operat',
			align : 'center',
			valign : 'middle',
			width:'340',
			formatter : function(value, row, index) {
				return addOpter(row);
			}
		} ]
	});
}
/**
 * 加入轮播链接
 * @param broXh
 * @param picName
 */
function addPicTobroadCast(broXh,picName){
	var options="";
	$.ajax({
		url : "/sjcq/photoPicManage/addPicTobroadCast", 
		dataType : "json", 
		async : false,
		data : {picIds:picId,broadCastXh:broXh,broaCastContent:picName}, 
		type : "post", 
		success : function(data) {
			if(data==true || data=="true"){
				$box.promptBox("加入轮播链接成功");
				$('#myModal').on('hidden.bs.modal', function () {
					parent.closableTab.closeThisTab(PARAM.tabId);
					//MAIN_PAGE_WINDOW.searchData();
			    });
			}else{
				$box.promptBox("加入轮播链接失败");
			}
		},
		error : function() {
			alert("服务器错误！");
		}
	});
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
		url : "/sjcq/broadcast/changeDataOrder", 
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
var timer=null;
//单击
function clickOne(path){
	clearTimeout(timer);
	timer = setTimeout(function () { //在单击事件中添加一个setTimeout()函数，设置单击事件触发的时间间隔
		//alert("单击事件");
		/*picLarge(path);*/
		var html='<img  src="' + PICURI + "/"+path + '" style="height:auto;width:auto;">';
		$box.promptBox('<div style="padding: 20px ;display:flex;align-items:center; justify-content:center;">'+html+'</div>',"图片显示");
	}, 400);
}
//双击显示图片详情
function clickdbl1(broadCastXh){
	clearTimeout(timer);
	var url = "../html/broadCast/broadCastPicInfo.html";
	var tabId = "broadCastPic";
	var name = "轮播组图";
	var param = JSON.stringify({
		"tabId" : "broadCastPic",
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"broadCastXh" : broadCastXh
	});
	pageAddNewTab("broadCastPic", name, url, param)
}
function showPic(broadCastXh){
	var url = "../html/broadCast/broadCastPicInfo.html";
	var tabId = "broadCastPic";
	var name = "轮播组图";
	var param = JSON.stringify({
		"tabId" : "broadCastPic",
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"broadCastXh" : broadCastXh
	});
	pageAddNewTab("broadCastPic", name, url, param)
}
function addOpter(row) {
	var html ="";
	html += '<input type="button" value="编辑"class="report_data_table_but btn btn-info" onclick="editInfo('+ row.id + ','+ row.state + ')" style="margin-right: 5px;"/>';
	html += '<input type="button" value="查看组图"class="report_data_table_but btn btn-danger" onclick="showPic(\''+row.broadcastXh+'\')" style="margin-right: 5px;"/>';
	if (row.isUsed == 0) {
		html+= '<input type="button" value="启用"class="report_data_table_but btn btn-primary" onclick="setUse('+ row.id + ')" style="margin-right: 5px;"/>';
		if ( row.state==1 ||  row.state==2 ) {
			html+= '<input type="button" value="删除"class="report_data_table_but btn btn-danger" onclick="sureDel('+ row.id + ')" style="margin-right: 5px;"/>';
		}
		
	}else if (row.isUsed == 1) {
		html+= '<input type="button" value="停用"class="report_data_table_but btn btn-primary" onclick="setUse('+ row.id + ')" style="margin-right: 5px;"/>';
	}
	return html;
}

/**
 * 修改html的高度
 */
function setHeight() {
	setIframeHeight("broadCast_content", MODULEID_);
}

/**
 * 检索
 */
function searchData() {
	var searchName = $("#searchName").val();
	var isUsed = $("#isUsedSel").val();
	var broType = $("#broTypeSel").val();
	$("#broadCastDataTable").bootstrapTable('getOptions').pageNumber = 1;
	$("#broadCastDataTable").bootstrapTable("refresh", {
		query : {
			picName : searchName,
			broType : broType,
			isUsed:isUsed,
			orderBy:"orderNum",
			orderDesc:0,
			pageIndex : 1,
			pageSize : function() {
				return $("#broadCastDataTable").bootstrapTable('getOptions').pageSize;
			}()
		}
	});
}

/**
 * 编辑
 * @param id
 */
function editInfo(id,state) {/*
	var url = "../html/broadCast/editBroad.html";
	var tabId = "editBroad";
	var name = "编辑轮播信息";
	var param = JSON.stringify({
		"tabId" : tabId,
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"broadId" : id
	});
	pageAddNewTab(tabId, name, url, param);
*/
	if(state !=undefined && state !=null && state !==0){
		var url = "../html/cutImage/cutImage.html";
		var tabId = "updateBroadCover";
		var name = "修改轮播封面";
		var param = JSON.stringify({
			"tabId" : tabId,
			"MODULEID_" : MODULEID_,
			"MAIN_PAGE_ID_" : MODULEID_,
			"type":"updateFile",
			"dataId":id
		});
		pageAddNewTab(tabId, name, url, param);

	}else{
		$box.promptBox("封面在审核过程中不能再次修改！");
	}
}
/**
 * 通过id与图片进行关联
 * @param id
 */
function associatedPic(id){
	var url = "../html/broadCast/photoManage.html";
	var tabId = "editBroadPic";
	var name = "轮播图片关联";
	var param = JSON.stringify({
		"tabId" : tabId,
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"broadId" : id
	});
	pageAddNewTab(tabId, name, url, param);
}
/**
 * 新增
 * @param id
 */
function addInfo() {
	var url = "../html/cutImage/cutImage.html";
	var tabId = "addBroadCover";
	var name = "新增轮播封面";
	var param = JSON.stringify({
		"tabId" : tabId,
		"MODULEID_" : MODULEID_,
		"MAIN_PAGE_ID_" : MODULEID_,
		"type":"addFile"
	});
	pageAddNewTab(tabId, name, url, param);
}

/**
 * 批量删除
 */
function batchDel(){
	var getSelectRows = $("#broadCastDataTable").bootstrapTable('getSelections');
	if (getSelectRows.length <= 0) {
		$box.promptBox('请选择数据');
		return;
	}
	var ids = "";
	var flag=true;
	$.each(getSelectRows, function(i, val) {
		if ((val.state==null || val.state=="null" || val.state==0) || val.isUsed!=0 ) {
			flag=false;
		}
		ids += val.id + ",";
	});
	if(!flag){
		$box.promptBox('只有停用且不处于审核过程中的的轮播封面才能删除！');
		return;
	}
	ids = ids.substring(0, ids.length - 1);
	sureDel(ids);
}

/**
 * 确认删除
 * @param ids
 */
function  sureDel(ids){
	$box.promptSureBox("确认删除么？",'del',ids);
	$("#myModalLabel").html("确认提示");
}

/**
 * 删除
 */
function del(ids){
	$.ajax({
//		url : "/sjcq/broadcast/delBroad", 
		url : "/sjcq/broadcast/deleteByIdIn", 
		dataType : "json", 
		async : true,
		data : {
			ids : ids
		}, 
		type : "post", 
		success : function(data) {
			$box.promptBox(data.resultInfo);
			$('#myModal').on('hidden.bs.modal', function () {
				searchData();
		    });
		},
		error : function() {
			alert("服务器错误！");
		}
	});
}

/**
 * 启用停用
 */
function setUse(ids){
	$.ajax({
		url : "/sjcq/broadcast/setUse", 
		dataType : "json", 
		async : true,
		data : {
			ids : ids
		}, 
		type : "post", 
		success : function(data) {
			$box.promptBox(data.resultInfo);
			$('#myModal').on('hidden.bs.modal', function () {
				searchData();
		    });
		},
		error : function() {
			alert("服务器错误！");
		}
	});
}

