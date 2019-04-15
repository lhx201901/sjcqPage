/**
 * 活动获奖设置
 */

var AWARDS_ITEMS=[];
$(document).ready(function(){
	$("#sureSearch").click(function(){
		AWARDS_ITEMS=getAwardsItemByActiveId($("#activ_items").val());
		 initTable() ;
		
	});
	 init();
	AWARDS_ITEMS=getAwardsItemByActiveId($("#activ_items").val());
	initTable();
	
});



/**
 * 初始化表格
 */
function initTable() {
    $("#actvieDataPre").empty();
    $("#actvieDataPre").html('<table id="activeDataTable"></table>');
	$('#activeDataTable').bootstrapTable({
		url : "/sjcq/manage/showPicByActive", // 请求后台的URL（*）
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
            return {
                pageNumber: params.pageNumber,  //页码
                pageSize: params.pageSize,   //页面大小
                searchWord: $("#searchWord").val(),
                sort: params.sortOrder, //排序
                order: params.sortName, //排序名称
                activeId:$("#activ_items").val()
            }
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
		/*onDblClickRow : function(row) {
			searchInfo(row.id);
		},*/
		//onLoadSuccess : setHeight,
		columns : [ {
            field: 'picLylys',
            title: '图片',
            align: 'center',
            formatter:function(value,row,index){
            return 	'<img src="'+index_nav.PICURI+value+'" style="height:50px;" onclick="showMiddleImg(\''+row.picLyljm+'\')">';
        }
/*            width:'125px'*/
        },{
            field: 'picMc',
            title: '图片名称',
            align: 'center',
            formatter:function(value,row,index){
                return 	value;
            }
        },{
            field: 'eMail',
            title: '邮箱',
            align: 'center'
        },{
            field: 'voteNum',
            title: '投票数量 ',
            align: 'center'
        },{
            field: 'isAllowSale',
            title: '是否允许代销 ',
            align: 'center',
            formatter:function(value,row,index){
            	if(value=="y"||value=="Y" ){
            		return "允许";
            	}
            	if(value=="n" ||value=="N" ){
            		return "不允许";
            	}
                return 	value;
            }
        },{
            field: 'realName',
            title: '作者',
            align: 'center'
        },{
            field: 'phone',
            title: '联系电弧',
            align: 'center'
        },{
            field: 'opter',
            title: '获奖设置',
            align: 'left',
            formatter:function(value,row,index){
            	//var buttons="<button class='btn' onclick='deleteActivePic("+row.id+")'>删除</button><button class='btn'  onclick='editActivePic("+row.id+",\""+row.picMc+"\")' >编辑</button>";
            return 	initAwardsCheckeItem(row.accountXh , row.atyXh, row.picXh);
        }
      }]
	});
}


function init(){
	//加载活动选项
	$.ajax({
		url : "/sjcq/manage/getPhotographyActiveList",
		dataType : "json",
		type : "post",
		async:false,
		//data : {id:id},
		success : function(data) {
		   if(undefined!=data&&null!=data){
			   $.each(data,function(_index,_item){
				   if(_index==0){
					   $("#activ_items").append("<option selected=selected value='"+_item.atyXh+"'>"+_item.atyTitle+" </option>");
				   }else{
					   $("#activ_items").append("<option value='"+_item.atyXh+"'>"+_item.atyTitle+" </option>");
				   }
			   })
		   }
		},
		error : function(result, status) {
			$box.promptBox("系统异常，请联系管理员！");
		}
	});
}

/**
 * 获取活动对应奖项
 * @param activeUUid
 * @returns {Array}
 */
function getAwardsItemByActiveId(activeUuid){
	var listItem=[];
	$.ajax({
		url : "/sjcq/manage/getAwardsCaseItems",
		dataType : "json",
		type : "post",
		async:false,
		data : {activeUuid:activeUuid},
		success : function(data) {
			listItem=data;
		},
		error : function(result, status) {
		}
	});
	return listItem;
}

/**
 * 获取该活动对应的图片的获奖数据
 * @param activeUUid
 * @param picXh
 */
function getAwardsCaseByActiveUUidAndPicXh(activeUUid,picXh){
	var awardsList=[];
	$.ajax({
		url : "/sjcq/manage/getAwardsCaseList",
		dataType : "json",
		type : "post",
		async:false,
		data : {activeUuid:activeUUid,picXh:picXh},
		success : function(data) {
			awardsList=data;
		},
		error : function(result, status) {
			
		}
	});
	return awardsList;
}

/**
 * 初始化选项
 * @param activeUUid
 * @param picXh
 * @returns {String}
 */

function initAwardsCheckeItem(personId,activeUUid,picXh){
	var checke="";
	var nowCheckedItem=   getAwardsCaseByActiveUUidAndPicXh(activeUUid,picXh);
	$.each(AWARDS_ITEMS,function(_index,_item){
		var ischecked="";
		$.each(nowCheckedItem,function(_indexa,_itema){
			if(	_itema.awardsSettingId==_item.id){//是否已选中该奖项
				ischecked="checked='checked'";
			}
		});
		checke=checke+ "<span> <input type='checkbox' "+ischecked+" onclick='cancleOrSetAwards(\""+personId+"\",\""+activeUUid+"\",\""+_item.id+"\",\""+picXh+"\",this)'  />"+_item.awardsItemName+" </span>"
		
	});
	return checke;
}

/**
 * 取消或设置奖项
 * @param activeUUid
 * @param awardsSettingId
 * @param picXh
 */
function  cancleOrSetAwards(personId,activeUUid,awardsSettingId,picXh,_this){
	var result=false;
	if(_this.checked){
		result= setAwards(personId,activeUUid,awardsSettingId,picXh);
		if(!result){
			_this.checked=false;
		}
	}else{
		result=  cancleAwards(activeUUid,awardsSettingId,picXh);
		if(!result){
			_this.checked=true;
		}
	}
}


function setAwards(personId,activeUUid,awardsSettingId,picXh){
	var result=false;
	$.ajax({
		url : "/sjcq/manage/addAwardsCase",
		dataType : "json",
		type : "post",
		async:false,
		data : {personId:personId,activeUUid:activeUUid,awardsSettingId:awardsSettingId ,picXh:picXh},
		success : function(data) {
			result=data;
		},
		error : function(result, status) {
			
		}
	});
	return result;
}

function cancleAwards(activeUUid,awardsSettingId,picXh){
	var result=false;
	$.ajax({
		url : "/sjcq/manage/deleteAwardsCaseByPicXhAndActiveUUidAndSysAtyAwards",
		dataType : "json",
		type : "post",
		async:false,
		data : {activeUUid:activeUUid,awardsSettingId:awardsSettingId,picXh:picXh},
		success : function(data) {
			result=data;
		},
		error : function(result, status) {
			
		}
	});
	
	return result;
}



