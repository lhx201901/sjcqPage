
/**
 * 编辑申请
 * @author wt
 * @createTime 2017/11/28
 */

var MODULE_ID="";
var FIRST_MODULE_ID="";
var myColumns=[];
$(document).ready(function(){
	$("#sureSearch").click(function(){
		getDataList();
	});
	$("#downLoadExcel").click(function(){
		downLoadPicAndPersonInfoExcel();
	});
	init();
	getDataList();
});


/**
 *活动参与人员管理
 */
function getDataList(){
    $("#editDataDiv").empty();
    $("#editDataDiv").html('<table id="editDataApply"></table>');
    $("#editDataApply").bootstrapTable({
        classes:"table table-no-bordered",
        //url: "../../../../../templateData/stockArrangement/dataManage/catalogueDataEdit/editApply/searchEditDataApply.json",  //后台 URL 链接
        url: "/sjcq/manage/searchActiveParticipator",
        striped: true,   //是否显示行间隔色
        pagination: true,   //是否显示分页（*）
        sortable: true,   //是否启用排序
        method: "post",
        contentType:"application/x-www-form-urlencoded",
        sortOrder: "asc",   //排序方式
        sidePagination: "server",  //分页方式：client客户端分页，server服务端分页（*）
        queryParamsType: "",
        queryParams: function (params) {
            return {
                pageNumber: params.pageNumber,  //页码
                pageSize: params.pageSize,   //页面大小
                search: $("#searchWord").val(),
                sort: params.sortOrder, //排序
                order: params.sortName, //排序名称
                active:$("#activ_items").val()
            }
        },
        // strictSearch:true,//设置为 true启用 全匹配搜索，否则为模糊搜索
        //  searchOnEnterKey:true,
        maintainSelected: true,//设置为 true 在点击分页按钮或搜索按钮时，将记住checkbox的选择项
        //  showPaginationSwitch:true,
        //  showColumns:true,
        selectItemName: "checked",
        //  search:true,
        pageNumber: 1,   //初始化加载第一页，默认第一页
        pageSize: 20,   //每页的记录行数（*）
        pageList: [20, 30, 50, 100], //可供选择的每页的行数（*）
        strictSearch: false,
        clickToSelect: true,  //是否启用点击选中行
        //height: 460,   //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "id",   //每一行的唯一标识，一般为主键列
        cardView: false,   //是否显示详细视图
        detailView: false,   //是否显示父子表
        columns:[ {
            field: 'realName',
            title: '姓名',
            align: 'center'
/*            width:'125px'*/
        },{
            field: 'phone',
            title: '联系方式',
            align: 'center'
        },{
            field: 'eMail',
            title: '邮箱',
            align: 'center'
        },{
            field: 'address',
            title: '地址 ',
            align: 'center'
        },{
            field: 'opter',
            title: '操作',
            align: 'left',
            formatter:function(value,row,index){
            	var buttons="<button class='btn backBtn' onclick='showImgManage("+row.ActiveParticipatorId+",\""+row.realName+"\")' >查看上传活动图片</button><button class='btn delBtn' onclick='deleteActiveParticipator("+row.ActiveParticipatorId+")'  >删除</button>";
            return 	buttons;
        }
      }]
    });
}

/**
 * 检索条件
 */
function searchBootom(){

    getDataList();
    //alert(JSON.stringify(searchParam));
}

/**
 * 删除活动参与者
 * @param id
 */
function deleteActiveParticipator(id){
	$.ajax({
		url : "/sjcq/manage/deleteActiveParticipator",
		dataType : "json",
		type : "post",
		data : JSON.stringify([id]),
		contentType:"application/json;charset=utf-8",
		success : function(data) {
			$box.promptBox(data.resultInfo);
			searchBootom();
		},
		error : function(result, status) {
			$box.promptBox("系统异常，请联系管理员！");
		}
	});
}	
	
/**
 * 显示该人员参加活动的图片列表
 */	
function showImgManage(id,personName) {
    var item = {
            'id': id + 'showImgManage',
            'name': personName,
            'url': 'photographyActive/personPic.html',
            'closable': true,
            'param': JSON.stringify({id:id,activeId:$("#activ_items").val()})
        };
    parent.closableTab.addTab(item);
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

function downLoadPicAndPersonInfoExcel(){
	var url = "";
	// 构造隐藏的form表单
	var $form = $("<form id='download' method='post'></form>");
	$form.attr("action","/sjcq/manage/downLoadPicAndPersonInfoExcel");
	$form.attr("target","");
	$("body").append($form);
	// 添加提交参数
	var $input1 = $("<input name='searchWord' type='hidden'></input>");
	$input1.attr("value",$("#searchWord").val());
	$("#download").append($input1);
	var $input2 = $("<input name='activeId'  type='hidden'></input>");
	$input2.attr("value",$("#activ_items").val());
	

	$("#download").append($input2);
	// 提交表单
	$form.submit();
}





