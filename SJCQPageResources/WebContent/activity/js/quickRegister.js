$(function() {
	getSessoin();
	$(".close").click(function(){
		window.parent.closeQuickRegister();
	});
	$("#notAgree").click(function(){
		window.parent.closeQuickSale();
	});
	
	$("#agree").click(function(){
		var user = USRSESSION; // 获取用户
		if (user == null || user == "null") {
			alert("请先登录！");
		} else {
			var userType = user.userType;
			if(userType == 0){
				alert("您还未成为供稿用户，请先通过审核！");
				parent.window.notAgree();
				window.parent.location.href="../vision/html/user_uploadImg.html?type=0";
				window.parent.closeQuickSale();
				//$("input[name='wt'][value='N']").attr("checked",true);
			}else{
				parent.window.agree();
				$("input[name='wt'][value='Y']").attr("checked",true)
				$("input[name='wt']").each(function(index, element) {
					if($(this).val()=="Y"){
						$(this).prop("checked",true);
					}
				})
				window.parent.closeQuickSale();
			}
		}
		
	});
	
	$("#notAgree").click(function(){
		window.parent.closeQuickSale();
		window.parent.notAgree();
	});
	
	$("#landing").click(function(){
		window.parent.closeQuickRegister();
		index_nav.open('../vision/login.html');
		window.parent.index_nav.open('../vision/login.html');
	});
});
/**
 * 
 * 得到session
 */
function getSessoin() {
	$.ajax({
		url : "/sjcq/account/getBasic",
		dataType : "json",
		async : false,
		data : {},
		type : "post",
		success : function(data) {
			if (data.status) {
				USRSESSION = data.account;
			}
		},
		error : function() {
		}
	});
}