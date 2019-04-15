/**
 * 登录
 * 创建人：罗兴伟
 * 创建时间：2016/03/25
 */

$(document).ready(function () {
    document.getElementById("code").onclick = createCode;
    
    $(document).keydown(function (event) {
        //enter登录
        if (event.keyCode == 13) {
            login();
        }
    });
    $("#loginBtn").hover(
    		  function () {
    			    $(this).addClass("self-login-btn-active");
    			    $(this).removeClass("self-login-btn");
    			  },
    			  function () {
    			    $(this).removeClass("self-login-btn-active");
    			    $(this).addClass("self-login-btn");
    			  }
    			)
});
var num;
/**
 * 隐藏 验证码，密码三次错误显示
 */
function login() {
    num = $("#numbers").val();
    if (parseInt(num) <= 2) {
        var loginName = $("#loginName").val();
        var pwd = $("#pwd").val();
        $.ajax({
            url: '/sjcq/manage/user/login',
            type: 'post',
            data: {
            	 "loginName": loginName,
                 "password": pwd
            },
            dataType: 'json',
            success: function (data) {
            	 if (data.resultStatus == true){ 
                	 SetPwdAndChk();
//                	 window.location.href = "/photo/manage/main.html";
                	 window.location.href = "/manage/html/main.html?userId="+data.resultData.userId;
                 } else if (data.resultStatus == false) {
                	 alert(data.resultInfo);
                 } 
            }
        });
    } else {
        if (validateCode()) {
            var loginName = $("#loginName").val();
            var pwd = $("#pwd").val();
            $.ajax({
                url: '/sjcq/manage/user/login',
                type: 'post',
                data: {
                	 "loginName": loginName,
                     "password": pwd
                },
                dataType: 'json',
                success: function (data) { 
		             if (data.resultStatus == true){ 
		               	 SetPwdAndChk();
		//            	 window.location.href = "/photo/manage/main.html";
		            	 window.location.href = "/manage/html/main.html?userId="+data.resultData.userId;
		             } else if (data.resultStatus == false) {
		            	alert(data.resultInfo);
		             } }
            });
        } else {
           // alert("请输入验证码！");
            createCode();
        }
    }
}
function isChecked(_this){
    var exp = new Date();
    exp.setTime(exp.getTime() + 14 * (24 * 60 * 60 * 1000));
	if(_this.checked){
	  $.cookie("checked",true,{expires:exp});
	}else{
		$.cookie("checked",false,{expires:exp});
	}
}
/**
 * Created by WeiSiBin on 2017/7/10.
 * 获取cookie信息，若cookie信息存在则为登录名、密码框赋值
 */

/**
 * 创建人：罗兴伟
 * 创建时间：2016/03/25
 * 创建验证码
 */
var code;
function createCode() {
    code = "";
    var codeLength = 4 // 验证码的长度
    //alert("换图片");
    var arrays = new Array(
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
        'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
        'u', 'v', 'w', 'x', 'y', 'z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
        'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y', 'Z'
    );
    code = '';//重新初始化验证码
    //alert(arrays.length);
    //随机从数组中获取四个元素组成验证码
    for (var i = 0; i < 4; i++) {
        //随机获取一个数组的下标
        var r = parseInt(Math.random() * arrays.length);
        code += arrays[r];
        //alert(arrays[r]);
    }
    //alert(code);
    document.getElementById('code').innerHTML = code;//将验证码写入指定区域

}
/**
 * 创建人：罗兴伟
 * 创建时间：2016/03/25
 * 验证 验证码
 */
function validateCode() {
    var inputCode = $("#inputCode").val();
    //获取用户输入的验证码
    //alert(input_code+"----"+code);
    if (inputCode.toLowerCase() == code.toLowerCase()) {
        //验证码正确(表单提交)
        return true;
    }
    alert("请输入正确的验证码!");
    //验证码不正确,表单不允许提交
    return false;
}
/**
 * 创建人：罗兴伟
 * 创建时间：2016/03/25
 * 记住用户名密码
 */
function SetPwdAndChk(sessionNo) {
    // 取用户名
    var usr = document.getElementById('loginName').value;
    // 将最后一个用户信息写入到Cookie
    // SetLastUser(usr);
    // 如果记住密码选项被选中
    if (document.getElementById('rememberPwd').checked == true) {
        // 取密码值
        var pwd = document.getElementById('pwd').value;
        var expdate = new Date();
        expdate.setTime(expdate.getTime() + 14 * (24 * 60 * 60 * 1000));
        // 将用户名和密码写入到Cookie

        SetCookie(usr, pwd,sessionNo);
    } else {
        // 如果没有选中记住密码,则立即过期
        ResetCookie();
        var exp = new Date();
        exp.setTime(exp.getTime() + 14 * (24 * 60 * 60 * 1000));
        $.cookie("sessionNo",sessionNo,{expires:exp});
    }
}

/**
 * @author 罗兴伟
 * @createTime 2016/03/25
 * @param name 用户名
 * @param value 密码
 * @constructor 向cookie赋值
 */
function SetCookie(name, value,sessionNo) {
    var exp = new Date();
    exp.setTime(exp.getTime() + 14 * (24 * 60 * 60 * 1000));
    $.cookie("user",name,{expires:exp,path: '/'});
    $.cookie("pwd",value,{expires:exp,path: '/'});
}

/**
 * @author 罗兴伟
 * @createTime 2016/03/25
 * @constructor 重置cookie
 */
function ResetCookie() {
    var usr = document.getElementById('loginName').value;
    var expdate = new Date();
    SetCookie(usr, null, expdate);
}

/**
 * @author 罗兴伟
 * @createTime 2016/03/25
 * @constructor 获得cookie
 */
function getCookie() {
    var loginName = $.cookie("user");
    console.log(loginName);
    var pwd = $.cookie("pwd");
    if (typeof(loginName) != "undefined" && typeof(pwd) != "undefined"&& pwd!="null") {
        $("#loginName").val(loginName);
        $("#pwd").val(pwd);
        $("#rememberPwd").attr("checked", $.cookie("checked"));
    }
}