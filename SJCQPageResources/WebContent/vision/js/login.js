/**
 * 登录
 */
var login = {
    phoneReg:/^1[345789][0-9]{9}$/,//手机验证正则
    cType:0,//判断验证码是否在发送时间内  0:不在 1:在
    code:"",
    /**
     * 初始化
     */
    init:function(){
        //忘记密码
        $("#forgetPass").click(function(){//绑定点击事件
           $("#login_div").hide();
           $("#forget_div").show();
        });
        //返回登录
        $("#loginPass").click(function(){//绑定点击事件
            $("#login_div").show();
            $("#forget_div").hide();
         });
         //获取验证码
         $("#w_codeOn").click(function(){//绑定点击事件
            login.code();
         });
        var v = getCookieValue("secondsremained") ? getCookieValue("secondsremained") : 0;// 获取cookie值
 		if (v > 0) {
 			settime($("#w_codeOn"));//开始倒计时
 		}
    },
    /**
     * 获取验证码 发送到手机上
     * 第二次需要延迟60S
     */
    code:function(){
        var phone = $("#w_phone").val();//忘记密码的手机号
        if(!login.phoneReg.test(phone.trim())){
            layer.msg("请输入正确的手机号！");
            return false;
        }
        if(login.cType==0){//通过状态 调用方法
            login.cType = 1;//修改状态 还在等带状态中
            codeTime.phone(phone,function(data){//发送验证码
                if(data=="error"){//发送验证码失败
                    layer.alert("查询加载数据失败！");
                }else{//发送验证码成功
                	if(data == "您的手机号码还未注册！"){
                		layer.msg(data);
                	}else{
                		layer.msg(data);
                		addCookie("secondsremained", 60, 60); // 添加cookie记录,有效时间60s
                		settime($("#w_codeOn"));//开始倒计时
                	}
                    //每60S只能发送一次
                   /* codeTime.setTime("w_codeOn",1,60,function(){//调用倒计时等待方法
                        login.cType = 0;//修改状态
                        $("#w_codeOn").text("获取验证码");
                    });*/
                }
            })
        }else{
            return false;
        } 


    },
    /**
     * 登录
     */
    login:function(){
    	if(!login.validateCode()){
    		return false;
    	}
        var phone = $("#phone").val();
        if(!login.phoneReg.test(phone.trim())){
            layer.msg("请输入正确的手机号！");
            return false;
        }
        var pass = $("#pass").val();
        if(pass==null||pass==""){
            layer.msg("密码不能为空！");
            return false;
        }
        $.ajax({
            url:"/sjcq/account/login",    // 请求的url地址
            type:"post",   // 请求方式
            dataType:"json",   // 返回格式为json
            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
            data:{phone:phone,pass:pass,state:0},    // 参数值     state 0:密码登录 1:验证码登录
            success:function(data){
                if(data.message=="登录成功！"){
                    /*console.log(data);*/
                    /**
                     * 登录后 展示 个人信息 父页面
                     */
                    $("#account_yes",parent.document).show();
                    $("#account_no",parent.document).hide();
                    //赋值
                    $("#yes_name",parent.document).text(data.user.realName);
                    if(data.user.actor!=null){
                       $("#yes_img",parent.document).attr("src",index_nav.PICURI+data.user.actor);
                    }else{
                        $("#yes_img",parent.document).attr("src","../util/images/man100.png");
                    }
//                    localStorage.setItem('user',JSON.stringify(data.user)); // 保存用户 localStorage
                    parent.USRSESSION=data.user;
                    parent.index_nav.close();//关闭弹出框
                    parent.index_nav.returnMysc();
                }else{
                    layer.alert(data.message);
                }
            },
            error:function(){
                layer.alert('查询加载失败！');
            }
        });
    },
    /**
     * 修改密码
     */
    up:function(){
        var phone = $("#w_phone").val();
        if(!login.phoneReg.test(phone.trim())){
            layer.msg("请输入正确的手机号！");
            return false;
        }
        var code = $("#w_code").val();
        if(code==null||code==""){
            layer.msg("请输验证码！");
            return false;
        }
        var pass = $("#w_pass").val();
        if(pass==null||pass==""||pass.length<6){
            layer.msg("密码少于6位！");
            return false;
        }
        var pass3 = $("#w_pass3").val(); 
        if(pass != pass3){
            layer.msg("两次输入密码不一致！");
            return false;
        }
        $.ajax({
            url:"/sjcq/account/resetPwd",    // 请求的url地址
            type:"post",   // 请求方式
            dataType:"text",   // 返回格式为json
            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
            data:{phone:phone,pass:pass,code:code,state:1},    // 参数值
            success:function(data){
                layer.alert(data);
                $("#login_div").show();
                $("#forget_div").hide();
                parent.index_nav.close();//关闭弹出框
            },
            error:function(){
                layer.alert('查询加载失败！');
            }
        });
    },
    /**
     * 验证码
     */
    tmcode: function(){
       // code = "";
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
        document.getElementById('code').style.color=login.color();
    },
    /**
     * 验证码
     * @returns {Boolean}
     */
    validateCode: function() {
        var input_code = $("input[name='inputCode']").val()
        //获取用户输入的验证码
        //alert(input_code+"----"+code);
        if (input_code.toLowerCase() == code.toLowerCase()) {
            //验证码正确(表单提交)
            return true;
        }
        layer.alert("请输入正确的验证码!");
        //验证码不正确,表单不允许提交
        return false;
    },
    color:function(){
    	var color = "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")";
    	return color;
    }
}
//发送验证码时添加cookie
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
//修改cookie的值
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
    countdown=getCookieValue("secondsremained");
    if (countdown == 0 ||countdown == undefined) { 
    	$("#w_codeOn").html("获取验证码");
    	login.cType = 0;// 修改状态
        return;
    } else { 
        $("#w_codeOn").html("重新发送("+countdown+")");
        countdown--;
        editCookie("secondsremained",countdown,countdown+1);
    } 
    setTimeout(function() { settime(obj) },1000) //每1000毫秒执行一次
} 