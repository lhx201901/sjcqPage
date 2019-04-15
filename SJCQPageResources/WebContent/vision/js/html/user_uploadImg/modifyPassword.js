//修改密码
var modifyPassword={
	initHtml:function(){
		$(".user_qh_tab a").removeClass("cur");
		$("#accountmanage").addClass("cur");
		$( "div[class^='content_']").hide();
		$(".content_accountmanage").show();
		$(".content_accountmanage").children().remove();
		$(".content_accountmanage").append('<div class="w_auto"> <div class="inboxn"> <p class="in_title">更改密码</p> <div class="mt50"> <div class="in_text"> <span class="itic">旧密码</span> <div class="intxts"><input type="text" class="text" id="newPassword" placeholder="请输入旧密码"></div> </div>  <div class="in_text"> <span class="itic">新密码</span> <div class="intxts"><input type="text" class="text" id="newPasswordAgain" placeholder="请输入新密码"></div> </div> <div class="in_text"> <span class="itic">确认新密码</span> <div class="intxts"><input type="text" class="text" id="newTwoPasswordAgain" placeholder="请再次输入新密码"></div> </div> </div> </div> <div class="svtsd"> <button class="btn btn_ok" onclick="modifyPassword.savePassword()">保存</button> <a href="javascript:void(0)" onclick="modifyPassword.resetPassword()" class="btn ml20">重置</a> </div> </div>');
	},
	//修改密码
	savePassword:function(){//newTwoPasswordAgain
		var newPassword1=$("#newPassword").val();
		if(undefined==newPassword1||""==newPassword1){
			layer.alert("旧密码不能为空!");
			return;
		}
		var newPassword=$("#newTwoPasswordAgain").val();
		var newPasswordAgain=$("#newPasswordAgain").val();
		if(undefined==newPassword||undefined==newPassword||""==newPassword){
			layer.alert("新密码不能为空!");
			return;
		}
		if(!modifyPassword.Password()){
			layer.alert("旧密码错误");
			return;
		}
		if(newPassword!=newPasswordAgain){
			layer.alert("两次密码输入不一致");
			return;
		}
        $.ajax({
            url:"/sjcq/account/savePassword",    // 请求的url地址
            type:"post",   // 请求方式
            contentType : 'application/json;charset=utf-8',
            dataType:"json",   // 返回格式为json
            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
            data:JSON.stringify({password:newPassword}) ,    // 参数值     state 0:密码登录 1:验证码登录
            success:function(data){
            	if(data){
            		layer.alert("密码修改成功!");
            	}else{
            		 layer.alert('密码修改失败!');
            	}
            },
            error:function(){
                layer.alert('系统异常！');
            }
        }); 
	},
	/**
	 * 重置密码
	 */
	resetPassword:function(){
		$("#newPassword").val("");
		$("#newPasswordAgain").val("");
		$("#newTwoPasswordAgain").val("");
	},
	/**
	 * 原密码验证
	 */
	Password:function(){
		var retule="";
		var newPassword=$("#newPassword").val();
		$.ajax({
            url:"/sjcq/account/oldPassword",    // 请求的url地址
            type:"post",   // 请求方式
           // contentType : 'application/json;charset=utf-8',
            dataType:"json",   // 返回格式为json
            async:false,// 请求是否异步，默认为异步，这也是ajax重要特性
            data:{password:newPassword} ,    // 参数值     state 0:密码登录 1:验证码登录
            success:function(data){
            	retule=data;
            },
            error:function(){
                layer.alert('系统异常！');
            }
        }); 
		return retule;
	}
};
