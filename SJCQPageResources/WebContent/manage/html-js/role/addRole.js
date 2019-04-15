/**
 * 角色数据填报页js
 * author lxw
 */
var PARAM={}; //前一个页面的参数对象
var MAIN_PAGE_WINDOW = {};//前一个页面对象
$(document).ready(function(){
	checksessoin();
	PARAM= GetParamByRequest();
	MAIN_PAGE_WINDOW = parent.document.getElementById("tab_frame_"+PARAM.MAIN_PAGE_ID_).contentWindow;
	
});
/**
 * 新增确认提示
 */
function addSavaRole() {
	
	if( $("#roleCode").val().length == 0 || $("#roleName").val().length == 0 ){
		$box.promptBox("角色代码或者角色名称不能为空！");
	}else{
		$box.promptSureBox("保存后角色代码不能修改，请确认！","sureAddSavaRole","");
	}
}
/**
 * 新增用户
 */
function sureAddSavaRole(){
	var obj = {};
	obj.roleCode = $("#roleCode").val();
	obj.isUse = $("input[name='isUse']:checked").val();
	obj.roleName = $("#roleName").val();
	obj.roleRemarks= $("#roleRemark").val();
	$.ajax({
	    url:"/sjcq/manage/role/addSaveRole",    //请求的url地址
	    dataType:"json",   //返回格式为json
	    async:true,//请求是否异步，默认为异步，这也是ajax重要特性
	    data:obj,    //参数值
	    type:"post",   //请求方式
	    success:function(data){
	    	 $box.promptBox(data.resultInfo);
	    	if(data.resultStatus == true){
	    		restTableData();
	    		MAIN_PAGE_WINDOW.refreshTable();
	    	}
	    },
	    error:function(){
	    	$box.promptBox("系统或者网络错误！");
	    }
	})
}
/**
 * 重置
 */
function restTableData(){
	$("#roleCode").val("");
	$("input:radio[value='1']").attr('checked','true');
	$("#roleName").val("");
	$("#roleRemark").val("")
}