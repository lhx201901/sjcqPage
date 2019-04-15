/**
 * 注册
 */
var register = {
	phoneReg : /^1[345789][0-9]{9}$/,// 手机验证正则
	cType : 0,// 判断验证码是否在发送时间内 0:不在 1:在
	/**
	 * 初始化页面加载的东西
	 */
	init : function() {
		$("#codeOn").click(function() {// 绑定点击事件
			register.code();
		});

		var v = getCookieValue("secondsremained") ? getCookieValue("secondsremained") : 0;// 获取cookie值
		if (v > 0) {
			settime($("#codeOn"));// 开始倒计时
		}
	},
	/**
	 * 获取验证码 发送到手机上 第二次需要延迟60S
	 */
	code : function() {
		var phone = $("#phone").val();
		if (!register.phoneReg.test(phone.trim())) {
			layer.msg("请输入正确的手机号！");
			return false;
		}
		if (register.cType == 0) {// 通过状态 调用方法
			register.cType = 1;// 修改状态 还在等带状态中
			codeTime.phone2(phone, function(data) {// 发送验证码
				if (data == "error") {// 发送验证码失败
					layer.alert("查询加载数据失败！");
				} else {// 发送验证码成功
					layer.msg(data);
					/*
					 * //每60S只能发送一次
					 * codeTime.setTime("codeOn",1,60,function(){//调用倒计时等待方法
					 * register.cType = 0;//修改状态 $("#codeOn").text("获取验证码"); });
					 */
					addCookie("secondsremained", 60, 60); // 添加cookie记录,有效时间60s
					settime($("#codeOn"));// 开始倒计时
				}
			})
		} else {
			return false;
		}
	},
	/**
	 * 注册用户
	 */
	add : function() {
		if (!$("#isgree").is(":checked")) {
			layer.msg("请阅读并勾选服务条款！");
			return false;
		}
		var phone = $("#phone").val();
		if (!register.phoneReg.test(phone.trim())) {
			layer.msg("请输入正确的手机号！");
			return false;
		}
		var code = $("#code").val();
		if (code == null || code == "") {
			layer.msg("请输验证码！");
			return false;
		}
		var pass = $("#pass").val();
		if (pass == null || pass == "" || pass.length < 6) {
			layer.msg("密码少于6位！");
			return false;
		}
		$.ajax({
			url : "/sjcq/regist/account", // 请求的url地址
			type : "post", // 请求方式
			dataType : "text", // 返回格式为json
			async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
			data : {
				phone : phone,
				password : pass,
				code : code
			}, // 参数值
			success : function(data) {
				layer.open({
					content : data,
					closeBtn : 0,
					yes : function(index, layero) {
						parent.index_nav.close();
					/*	parent.index_nav.open('../login.html');*/
						location.href="../login.html";
					}
				});

			},
			error : function() {
				layer.alert('查询加载失败！');
			}
		});
	},
	/**
	 * 快速注册用户
	 */
	add2 : function(active) {
		var writerName = $("#writerName").val();
		if (writerName == null || writerName == "") {
			layer.msg("请输入正确的姓名！");
			return false;
		}
		var email = $("#email").val();
		var address = $("#address").val();
		/*	var email = $("#email").val();
		var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); // 正则表达式
		if (email == "") { // 输入不能为空
			layer.msg("请输入正确的邮箱！");
			return false;
		} else if (!reg.test(email)) { // 正则验证不通过，格式不对
			layer.msg("请输入正确的邮箱！");
			return false;
		}

		var address = $("#address").val();
		if (address == "" || address == null) {
			layer.msg("请输入正确的家庭住址！");
			return false;
		}*/

		var phone = $("#phone").val();
		if (!register.phoneReg.test(phone.trim())) {
			layer.msg("请输入正确的手机号！");
			return false;
		}
		var code = $("#code").val();
		if (code == null || code == "") {
			layer.msg("请输验证码！");
			return false;
		}
		var pass1 = $("#pass1").val();
		if (pass1 == null || pass1 == "" || pass1.length < 6) {
			layer.msg("密码少于6位！");
			return false;
		}
		var pass2 = $("#pass2").val();
		if(pass1 != pass2){
			layer.msg("两次输入密码不一致！");
			return false;
		}
		$.ajax({
			url : "/sjcq/regist/account2", // 请求的url地址
			type : "post", // 请求方式
			dataType : "text", // 返回格式为json
			async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
			data : {
				realName : writerName,
				eMail : email,
				address : address,
				phone : phone,
				password : pass1,
				code : code
			}, // 参数值
			success : function(data) {
				layer.alert(data);
				if(data == "注册成功!"){
					 $.ajax({
				            url:"/sjcq/account/login",    // 请求的url地址
				            type:"post",   // 请求方式
				            dataType:"json",   // 返回格式为json
				            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
				            data:{phone:phone,pass:pass1,state:0},    // 参数值     state 0:密码登录 1:验证码登录
				            success:function(data){
				                if(data.message=="登录成功！"){
				                	if(active == "active"){
				                		window.parent.closeQuickRegister();
				                		window.parent.location.reload();
				                	}else{
				                		window.location.reload();
				                	}
				                }else{
				                    layer.alert(data.message);
				                }
				            },
				            error:function(){
				                layer.alert('查询加载失败！');
				            }
				        });
				}
			},
			error : function() {
				layer.alert('查询加载失败！');
			}
		});
	},
	showServiceTerms : function() {
		window.open("html/serviceTerms.html");
	}

}

// 发送验证码时添加cookie
function addCookie(name, value, expiresHours) {
	var cookieString = name + "=" + escape(value);
	// 判断是否设置过期时间,0代表关闭浏览器时失效
	if (expiresHours > 0) {
		var date = new Date();
		date.setTime(date.getTime() + expiresHours * 1000);
		cookieString = cookieString + ";expires=" + date.toUTCString();
	}
	document.cookie = cookieString;
}
// 修改cookie的值
function editCookie(name, value, expiresHours) {
	var cookieString = name + "=" + escape(value);
	if (expiresHours > 0) {
		var date = new Date();
		date.setTime(date.getTime() + expiresHours * 1000); // 单位是毫秒
		cookieString = cookieString + ";expires=" + date.toGMTString();
	}
	document.cookie = cookieString;
}
// 根据名字获取cookie的值
function getCookieValue(name) {
	var strCookie = document.cookie;
	var arrCookie = strCookie.split("; ");
	for (var i = 0; i < arrCookie.length; i++) {
		var arr = arrCookie[i].split("=");
		if (arr[0] == name) {
			return unescape(arr[1]);
			break;
		}
	}
}
var countdown;
function settime(obj) {
	countdown = getCookieValue("secondsremained");
	if (countdown == 0 || countdown == undefined) {
		$("#codeOn").html("获取验证码");
		register.cType = 0;// 修改状态
		return;
	} else {
		$("#codeOn").html("重新发送(" + countdown + ")");
		countdown--;
		editCookie("secondsremained", countdown, countdown + 1);
	}
	setTimeout(function() {
		settime(obj)
	}, 1000) // 每1000毫秒执行一次
}
