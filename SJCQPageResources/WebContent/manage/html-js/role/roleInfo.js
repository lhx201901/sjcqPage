/**
 * 角色信息页js
 * author lxw
 */
var PARAM={}; //前一个页面传递的参数对象
var MAIN_PAGE_WINDOW = {};//前一个页面对象

var ROLEID_ = "";//序号
var OPTERTYPE_ = "";//操作类型 1为查看，2为编辑
var DEPOBJ_= {};//定义一个部门实体的全局，用于比编辑重置
$(document).ready(function(){
	checksessoin();
	PARAM= GetParamByRequest();
	ROLEID_ = PARAM.roleId;
	OPTERTYPE_ = PARAM.opterType;
	
	MAIN_PAGE_WINDOW = parent.document.getElementById("tab_frame_"+PARAM.MAIN_PAGE_ID_).contentWindow;
	
	changCss(OPTERTYPE_);
	findRoleInfoById(ROLEID_);
});
/**
 * 根据页面点击 切换样式  1为查看 2为编辑
 * @param opterType
 */
function changCss(opterType){
	if(opterType==2){
		$("#edit_role_info").show();
		$("#rest_table_data").show();
		$("#friendship_hints").show();
//    	$("#depType").removeAttr("disabled");
    	$("#roleName").removeAttr("readonly");
    	$("#roleRemark").removeAttr("readonly");
    	$("input:radio").removeAttr("disabled");
	}
}
/**
 * 根据序号加载详情
 * @param depId
 */
function findRoleInfoById(roleId){
	$.ajax({
	    url:"/sjcq/manage/role/findRoleById",    //请求的url地址
	    dataType:"json",   //返回格式为json
	    async:true,//请求是否异步，默认为异步，这也是ajax重要特性
	    data:{id:roleId},    //参数值
	    type:"post",   //请求方式
	    success:function(data){
	    	DEPOBJ_ = data;
	    	$("#roleId").val(data.roleId);
	    	$("#roleCode").val(data.roleCode);
	    	$("#roleName").val(data.roleName);
	    	$("#roleRemark").val(data.roleRemarks);
	    	$("input:radio[value='"+data.isUse+"']").attr('checked','true');
	    },
	    error:function(){
	        //请求出错处理
	    }
	})
}

/**
 * 编辑确认提示
 */
function editSavaDeptData() {
	if($("#roleName").val().length == 0 ){
		$box.promptBox("角色代码或者角色名称不能为空！");
	}else{
		
		$box.promptSureBox("是否确认修改！！","sureEditSavaRoleData","");
	}
}
/**
 * 编辑部门
 */
function sureEditSavaRoleData(){
	var obj = {};
	obj.roleId = $("#roleId").val();
	obj.isUse = $("input[name='isUse']:checked").val();
	obj.roleName = $("#roleName").val();
	obj.roleRemarks = $("#roleRemark").val();
	$.ajax({
	    url:"/sjcq/manage/role/editSaveRole",    //请求的url地址
	    dataType:"json",   //返回格式为json
	    async:true,//请求是否异步，默认为异步，这也是ajax重要特性
	    data:obj,    //参数值
	    type:"post",   //请求方式
	    success:function(data){
	    	 $box.promptBox(data.resultInfo);
	    	 if(data.resultStatus == true){
	    		 DEPOBJ_ = data.resultData;
		    		restTableData();
		    		MAIN_PAGE_WINDOW.refreshTable();
		    }
	    },
	    error:function(){
	        //请求出错处理
	    }
	})
}
/**
 * 重置
 */
function restTableData(){
	$("#roleId").val(DEPOBJ_.roleId);
	$("#roleCode").val(DEPOBJ_.roleCode);
	$("#roleName").val(DEPOBJ_.roleName);
	$("#roleRemark").val(DEPOBJ_.roleRemarks);
	$("input:radio[value='"+DEPOBJ_.isUse+"']").attr('checked','true');
}

/**
 * 返回角色管理页面
 */
function returnRoletManage(){
	window.location.href = "../../manage/role/roleManage.html";
}