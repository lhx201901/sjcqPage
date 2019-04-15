/**
 * 个人信息js
 * author lxw
 */
var PARAMOBJ_ = null;
var USERID_ = "";//用户序号
var MODULEID_ = "";
var PARAM={}; //前一个页面的参数对象
$(document).ready(function(){
	checksessoin();
	PARAM= GetParamByRequest();
	USERID_ = PARAM.MODULEID_.split("_")[2]
//	console.log(PARAM.MODULEID_.split("_")[2]);
	$("#userId").val(USERID_);
});


/**
 * 编辑确认提示
 */
function editSavaPassword() {
	if($("#newPwd").val()!= $("#dobuleNewPwd").val()){
		 $box.promptBox("两次输入密码不一致，请重新输入！");
	}else{
		$box.promptSureBox("是否确认修改登录密码！","editSaveUserPassword","");
		
	}
}
/**
 * 编辑登录密码
 */
function editSaveUserPassword(){
	var obj = {};
	obj.userId = USERID_;
	obj.password = $("#newPwd").val();
	$.ajax({
	    url:"/sjcq/manage/user/editSaveUserPassword",    //请求的url地址
	    dataType:"json",   //返回格式为json
	    async:true,//请求是否异步，默认为异步，这也是ajax重要特性
	    data:obj,    //参数值
	    type:"post",   //请求方式
	    success:function(data){
	    	 $box.promptBox(data.resultInfo);
	    	 setTimeout(function(){
	    		 if(data.resultStatus){
	    			 sout();
		    	 }
	    	 },2000);
	    },
	    error:function(){
	        //请求出错处理
	    }
	})
}
/**
 * 重置
 */
function restDeptData(){
	$("#oldPwd").val("");
	$("#newPwd").val("");
	$("#dobuleNewPwd").val("");
}

/**
 * 返回部门管理页面
 */
function returnDepartmentManage(){
	parent.location.href = "/manage/main.html?userId="+USERID_;
}
function sout(){
	$.ajax({
		url : "/sjcq/manage/user/loginOut",
		dataType : "json",
		type : "post",
		data : {},
		success : function(data) {
			if(data){
				parent.window.location.href = "/manage/html/login.html";
			}
		},
		error : function(result, status) {
			$box.promptBox("系统异常，请联系管理员！");
		}
	});
}