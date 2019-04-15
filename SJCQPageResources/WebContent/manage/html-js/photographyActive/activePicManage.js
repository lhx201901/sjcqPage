/**
 * 活动图片管理
 */
var MODULE_ID="";
var FIRST_MODULE_ID="";
var myColumns=[];
$(document).ready(function(){
	$("#sureSearch").click(function(){
		getDataList();
	});
	init();
	getDataList();
});


/**
 *数据管理列表详情
 */
function getDataList(){
    $("#activePicDiv").empty();
    $("#activePicDiv").html('<table id="activePic"></table>');
    $("#activePic").bootstrapTable({
        classes:"table table-no-bordered",
        //url: "../../../../../templateData/stockArrangement/dataManage/catalogueDataEdit/editApply/searchEditDataApply.json",  //后台 URL 链接
        url: "/sjcq/manage/showPicByActive",
        contentType:"application/x-www-form-urlencoded",
        striped: true,   //是否显示行间隔色
        pagination: true,   //是否显示分页（*）
        sortable: true,   //是否启用排序
        method: "post",
        sortOrder: "asc",   //排序方式
        sidePagination: "server",  //分页方式：client客户端分页，server服务端分页（*）
        queryParamsType: "",
        queryParams: function (params) {
            return {
                pageNumber: params.pageNumber,  //页码
                pageSize: params.pageSize,   //页面大小
                searchWord:$("#searchWord").val(),
                activeId:$("#activ_items").val(),//
                persionId:"",//
                sort: params.sortOrder, //排序
                order: params.sortName, //排序
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
/*            formatter:function(value,row,index){
                return 	'<img src="'+value+'" onclick="showMiddleImg(\''+row.picLyljm+'\')">';
            }*/
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
            field: 'sysAtyAwards',
            title: '获奖情况',
            align: 'center',
            formatter:function(value,row,index){
            	var awardsCase=  getAwardsCaseByActiveUUidAndPicXh($("#activ_items").val(),row.picXh);
            	var jx=[];
            	$.each(awardsCase,function(_index,_item){
            		jx.push(_item.awardsItemName);
            	});
            return 	jx.join(',') ;
        }
        },{
            field: 'opter',
            title: '操作',
            align: 'left',
            formatter:function(value,row,index){
            	var buttons="<button class='btn editBtn'  onclick='editActivePic("+row.id+",\""+row.picMc+"\")' >编辑</button><button class='btn delBtn' onclick='deleteActivePic("+row.id+")'>删除</button>";
            return 	buttons;
        }
      }]
    });
}



/**
 * 删除活动图片
 * @param id
 */
function deleteActivePic(id){
	$.ajax({
		url : "/sjcq/manage/deleteActivePic",
		dataType : "json",
		type : "post",
		data : {id:id},
		success : function(data) {
		    getDataList({});
		},
		error : function(result, status) {
			$box.promptBox("系统异常，请联系管理员！");
		}
	});
}	

/**
 * 编辑图片
 */	
function editActivePic(id,name) {
    var item = {
            'id': id + 'editActivePic',
            'name': "编辑-"+name,
            'url': 'photographyActive/activePicEdit.html',
            'closable': true,
            'param': JSON.stringify({id:id})
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



/**
删除单张图片
* @param id
*/
function deleteActivePic(id){
$.ajax({
	url : "/sjcq/manage/deleteActivePic",
	dataType : "json",
	type : "post",
	data : JSON.stringify([id]),
	contentType:"application/json;charset=utf-8",
	success : function(data) {
	    getDataList({});
	},
	error : function(result, status) {
		$box.promptBox("系统异常，请联系管理员！");
	}
});
}



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
