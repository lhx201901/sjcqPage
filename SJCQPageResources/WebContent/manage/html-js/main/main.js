/* 
 *
 */
var result_1;
var MAIN_MODULE_ID;
var APPCSS="";
var THEME_NOW="blue";
var user=null;
var USERID_="";
$(function() {
	GetRequest();
	loadResult(USERID_);
	var item = {'id':'0','name':'首页','url':'../html/frist.html','closable':false};
	closableTab.addTab(item);
	loadDH_SY();
	$("#menu > li").click(function() {
		addLiClass(this);
	});
	testSession();
	getUser();//从cookie中获取当前登录名
});
//检查session信息
function testSession() {
	$.ajax({
		url : "/sjcq/user/loginSession",
		dataType : "json",
		async : false,
		data : {},
		type : "post",
		success : function(data) {
			if(!data.resultStatus){
				$box.promptBox(data.resultInfo);
				$('#myModal').on('hidden.bs.modal', function () {
					window.location.href = "/manage/html/login.html";
			    });
	    	}
		},
		error : function() {
		}
	});
}
function GetRequest() {
	var url = location.href; // 获取url中"?"符后的字串
	var num = url.indexOf("?")
	str = url.substr(num + 1); // 取得所有参数 stringvar.substr(start [, length ]
	var name, value;
	var arr = str.split("&"); // 各个参数放到数组里
	for (var i = 0; i < arr.length; i++) {
		num = arr[i].indexOf("=");
		if (num > 0) {
			name = arr[i].substring(0, num);
			value = arr[i].substr(num + 1);
			if (name == "userId") {
				USERID_ = value;
			}
		}
	}
}
/**
 * 初始化页面风格和样式
 * @param mainCss
 * @param appCss
 */
function initTheme(mainCss,appCss){
	var loginName="";
	var themeHref="../html-css/main/default.css";
		$("#style_color").attr("href",mainCss);
}


/**
 * 加载 菜单
 * @author xzq
 */
function loadResult(id){
	var menu = document.getElementById("menu");
	$.ajax({
		url : "/sjcq/manage/role/findPowerByUserId", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {
			userId : id
		}, // 参数值
		type : "post", // 请求方式
        success:function(data){
        	//alert(1+"===="+data);
        	//result_1 = eval('('+data+')');
        	var obj=eval(data);
        	result_1 = obj.module;
        	//result_1 =data;
        	createMenu(menu, result_1);
        	var mainCss=obj.MainCss;
        	var appCss=obj.AppCss;
        	if(mainCss!=""&&appCss!=""){        		
        		initTheme(mainCss,appCss);
        		THEME_NOW=obj.theme;
        	}
        	//alert(JSON.stringify(result_1));
        	//document.getElementById("mainIframe").src = "frist.html";
        }
    });
}
/**
 * 加载首页
 * 
 * @param {[type]}
 *            url [description]
 * @param {[type]}
 *            _this [description]
 * @return {[type]} [description]
 */
function loadHomePage(url, _this) {
	/*$("#menu li").attr("class", "");
	$(_this).parents("li").attr("class", "active");
	$(_this).parents("li").siblings("li").find("ul").attr("style",
			"display: none;");
	$(_this).parents("li").siblings("li").find("a").find(
			"span[class='arrow open']").attr("class", "arrow");
	$("#mainIframe").empty();
	document.getElementById("mainIframe").src = "" + url + "";

	var xml;
	xml = $(".breadcrumb li ");
	for (var i = 0; i < (xml.length - 1); i++) {
		$(".breadcrumb li ")[xml.length - i - 1].remove();
	}
	;

	var html = "";
	html += "<li >";
	html += "<i class='icon-angle-right'></i>";
	html += "<a href='#'>首页</a>";
	html += "</li>";

	$(".breadcrumb").append(html);*/
	$("#menu li").attr("class", "");
	$(_this).parents("li").attr("class", "active");
	$(_this).parents("li").siblings("li").find("ul").attr("style",
			"display: none;");
	$(_this).parents("li").siblings("li").find("a").find(
			"span[class='arrow open']").attr("class", "arrow");
	$("#mainIframe").children().remove();
	closableTab.clearAllTab();
	var item = {'id':'0','name':'首页','url':url,'closable':false};
	closableTab.addTab(item);
	loadDH_SY();
}

/*
 * url:对应的模块路劲 _this: 调用该方法的组件对象 返回值：无。
 * 方法描述：加载对应的菜单模块到框架中(mainIframe),并调整菜单显示样式;
 */
function addMenuUrl(str, _this) {
	//alert(str);

	var obj = eval('(' + str + ')');
	if( $(_this).parent().parent().is($("#menu"))){
		MAIN_MODULE_ID=obj.id;
	}
	$("#menu li").attr("class", "");
	$(_this).parents("li").attr("class", "active");
	$(_this).parents("li").siblings("li").find("ul").attr("style",
			"display: none;");
	$(_this).parents("li").siblings("li").find("a").find(
			"span[class='arrow open']").attr("class", "arrow");
	$("#mainIframe").children().remove();
	if(obj.url){
		//document.getElementById("mainIframe").src = "" + obj.url + "";
		closableTab.clearAllTab();
		var item= {'id':obj.id,'name':obj.name,'url':obj.url,'closable':false,'param':JSON.stringify({MODULEID_:obj.id})};
		closableTab.addTab(item);
	}
	
	loadDH(obj,_this);
}
function addMenuUrl1(str){
	var obj = eval('(' + str + ')');
	closableTab.clearAllTab();
	var item = {
		'id': obj.id,
		'name': obj.name,
		'url': obj.url,
		'closable': false,
		'param': JSON.stringify({MODULEID_: obj.id})
	};
	closableTab.addTab(item);
}
/*
 * _this:被点击的对象 方法描述：修改菜单样式
 */
function addLiClass(_this) {
	$(_this).children("a").append("<span class='selected'></span>");
	$(_this).siblings("li").children("a").remove("span[class='selected']");
}

/*
 * child_node : 当前的li节点 result:对应该节点及子节点的数据 方法描述：递归,加载菜单的数据及样式
 */
function createMenu(child_node, result) {
	if (result == null || result == "undefined" || child_node == null
			|| child_node == "undefined") {
	//	alert("菜单数据有误,加载失败!");
		return;
	}
	// 判断result是否是菜单节点所需的数据,如果是加载菜单
	if (Object.prototype.toString.call(result) == "[object Array]") {
		for (var i = 0; i < result.length; i++) {
			var new_li = document.createElement("li");
			var new_a = document.createElement("a");
			new_a.setAttribute("href", "javascript:void(0);");
			new_li.setAttribute("id", "li_" + result[i].id);//点击first页面图标，跳转样式
			// 对应的菜单项添加模块路径
			//if (result[i].url) {
				 str = JSON.stringify(result[i]);
				//var str = result[i];
				new_a.setAttribute("onclick", "javascript:addMenuUrl('" + str
						+ "',this);");
			//}
			var new_span_title = document.createElement("span");
			new_span_title.setAttribute("class", "title");
			var new_a_txt = document.createTextNode(result[i].name);
			var new_span_arrow = document.createElement("span");
			// 叶节点菜单不加载菜单展开图标
			if (result[i].children.length > 0) {
				new_span_arrow.setAttribute("class", "arrow");
			}
			var new_i = document.createElement("i");
			new_i.setAttribute("class", result[i].icon);
			child_node.appendChild(new_li);
			new_li.appendChild(new_a);
			new_a.appendChild(new_i);
			new_a.appendChild(new_span_title);
			new_span_title.appendChild(new_a_txt);
			new_a.appendChild(new_span_arrow);
			// 如果有子菜单,递归方式 加载子菜单
			if (result[i] && result[i].children.length > 0) {
				var new_ul = document.createElement("ul");
				new_ul.setAttribute("class", "sub-menu");
				new_ul.setAttribute("style", "display: none;");
				new_li.appendChild(new_ul);
				createMenu(new_ul, result[i].children);
			}
		}
	}
}
/**
 * 导航位置添加首页
 * 
 */
function loadDH_SY(){
	$(".breadcrumb").children().remove();
	$(".breadcrumb").append("<li><i class='icon-home'></i><a href='#'>起始</a></li><li ><i class='icon-angle-right'></i><a href='#'>首页</a></li>");
}
/**
 * j加载导航线
 * 
 * @param {[type]}
 *            obj [description]
 * @return {[type]} [description]
 */
function loadDH(obj,_this){
	loadDH_SY();
	var li_active= $(_this).parents("li[class='active']");
	for( var i=li_active.length-1;i>=0;i-- ){
		$(".breadcrumb").append("<li ><i class='icon-angle-right'></i><a href='#'>" +$(li_active[i]).children("a").children(".title").html() + "</a></li>");
	}
}

/**
 * @author 罗兴伟
 * @createTime 2016/03/25
 * @constructor 获得cookie
 */
function getUser() {
	var loginName = $.cookie("user");
	console.log( $.cookie("user"));
	$("#login_name").text("用户名："+loginName);
	user=loginName;
}

/**
 * @author WeiSiBin
 * @createTime 2017/08/14
 * @constructor 重置cookie中的用户名或密码
 */
function resetUser() {
	$.cookie("user",'',{expires: -1});
	$.cookie("pwd",'',{expires: -1});
	$.cookie("sessionNo",'',{expires: -1});
}

/**
 * 退出登录
 * @author WeiSiBin
 * @createTime 2017/08/214
 */
function exit(){
	resetUser();
	window.location.href = "/manage/html/login.html";
}


/**
 * 根据用户名获取未完成任务
 *
 * @param loginName
 */
function getTaskByUser() {// getTaskByUserInfo
	$.ajax({
		url : '/DZZLXT/getTaskByUserInfo',
		type : 'post',
		async: false,
		dataType : 'json',
		success : function(data) {
			$("#badge").text(0);
			$("#taskList").find("li").remove();
			if(data.length>0){
				//添加任务
				$("#badge").text(data.length);
				$("#taskList").append("<li><p style='font-size: 18px;font-weight: 400'>您目前有"+data.length+"个未完成任务</p></li>");
				$.each(data,function(index,item){
					//alert(JSON.stringify(item.url));
					$("#taskList").append("<li><a style='padding: 5px;font-size: 16px;font-weight: 300' href=\"javascript:\" onclick=\"addMenuUrl2('"+item.id+"','"+item.name+"','"+item.url+"','"+item.firstMoudleId+"');\"><i class=\"icon-user\"></i>&nbsp;"+item.name+"<span style='color: red'>&nbsp;("+item.total+")</span></a></li>");
				});
			}
		},
		error : function() {

		}
	});
}




function addMenuUrl2(id,name,url,firstModdleId){

	//moduleSelected(id,firstModdleId);

	//alert(id+"="+name+""+url);
	closableTab.clearAllTab();
	parent.MAIN_MODULE_ID=firstModdleId;
	var item = {
		'id' : id,
		'name' :name,
		'url' : url,
		'closable' : false,
		'param' : JSON.stringify({
			MODULEID_ : id
		})

	};
	closableTab.addTab(item);
}

/*pwdid:模块id
 方法描述:改变对应主菜单及子菜单的样式
 */
function moduleSelected(id,pwdid){
	if(pwdid==null||pwdid==undefined){
		return;
	}
	MAIN_MODULE_ID=pwdid;
	$("#li_"+pwdid, document).attr("class","active");
	$("#li_"+pwdid+" >a >.arrow", document).attr("class","arrow open");
	$("#li_"+pwdid+" >a", document).append("<span class='selected'></span>");
	$("#li_"+pwdid+" >ul", document).attr("style","");
	$("#li_"+pwdid, document).siblings("li").attr("class","");
	for(var i=0;i<result_1.length;i++){
		if(result_1[i].id==pwdid&& result_1[i].children){
			skipToSunPage(id,result_1[i].children);
			break;
		}
	}
	//改变子菜单中的样式
	function  skipToSunPage(id,result){
		if(result[0]==null||result[0]==undefined){
			return;
		}
		$("#li_"+result[0].id, document).attr("class","active");
		$("#li_"+result[0].id+" >a >.arrow", document).attr("class","arrow open");
		$("#li_"+result[0].id+" >ul", document).attr("style","");
		$("#li_"+result[0].id, document).siblings("li").attr("class","");
		if(result[0].children==null||result[0].children=="undefined"||result[0].children.length==0){
			//window.location.href=result[0].url;
			var item = {'id':result[0].id,'name':result[0].name,'url':result[0].url,'closable':false,'param':JSON.stringify({MODULEID_:result[0].id})};
			loadDH(result[0],$("#li_"+result[0].id+">a", document));
			closableTab.addTab(item);
			closableTab.clearTabNotThis(result[0].id);
		}else{
			skipToSunPage(result[0].children);
		}
	}
}
//h获取未处理条数
function getSmsNotDealCount(){
	$.ajax({
		url : '/DZZLXT/getSmsNotDealCount',
		type : 'post',
		async: false,
		dataType : 'json',
		success : function(data) {
			$("#smsInfo span[class='badge']").html(data.data);
		}
	});
	
}
/**
 * 原文浏览器下载
 */
function uploadYWLLQ(){
	var fromSize = $("#downLoadForm").length;
    if(fromSize==0){
        var html = '<form id="downLoadForm" action="/DZZLXT/uploadYW" target=""   method="post">'
            +'<input id="downLoadParam"  name="downLoadParam" type="hidden" value="" /></form>';
        $(document.body).append(html);
    }
    $("#downLoadParam").val();
    document.getElementById("downLoadForm").submit();
}

function changePassword() {
	$(".content-wrapper").hide();
	$(".container_div").show();
	$(".nav-tabs").empty();
	$(".tab-content").empty();
	$(".tab-content").css('overflow', 'visible');
	addNewTab("edit_pwd_"+USERID_, "修改密码", "../../manage/html/oneselfSetting/changePassword.html");
	//$("#ifrPage").attr("src", "../html/oneselfSetting/changePassword.html?userId=" + USERID_);

}
function searchDepInfo() {
	$
			.ajax({
				url : "/sjcq/manage/user/findById", // 请求的url地址
				dataType : "json", // 返回格式为json
				async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
				data : {
					userId : USERID_
				}, // 参数值
				type : "post", // 请求方式
				success : function(data) {
					var table = "";
					table += "<table style ='margin-left:20%;' id='login_table'>";
					table += "<tr><td>登录名:</td><td>";
					table += '<p id ="news_hint" class = "news_hint"> </p>';
					table += "<input type='text'readonly='readonly' id='login_name' />";
					table += "</td></tr>";
					table += "<tr><td>用户名:</td><td>";
					table += "<input type='text' readonly='readonly' id='userName'/>";
					table += "</td></tr>"
					table += "<tr><td>创建时间:</td><td>";
					table += "<input type='text' readonly='readonly' id='createTime'/>";
					table += "</td></tr>"
					table += "<tr><td>上次登陆时间:</td><td>";
					table += "<input type='text' readonly='readonly' id='lastLoginTime'/>";
					table += "</td></tr>"
					table += "<tr><td>备注:</td><td>";
					table += "<input type='text' readonly='readonly' id='userRemarks'/>";
					table += "</td></tr>"
					table += "</table>";
					$box.promptBox(table);
					$("#myModalLabel").html("用户信息");
					$("#login_name").val(data.loginName);
					$("#userName").val(data.userName);
					$("#createTime").val(
							new Date(data.createTime)
									.format("yyyy-MM-dd hh:mm:ss"));
					$("#lastLoginTime").val(
							new Date(data.lastLoginTime)
									.format("yyyy-MM-dd hh:mm:ss"));
					$("#userRemarks").val(data.userRemarks);
				},
				error : function() {
					alert("服务器错误！");
				}
			});
}
function editDepInfo() {
	$.ajax({
	    url:"/sjcq/manage/user/findById",    //请求的url地址
	    dataType:"json",   //返回格式为json
	    async:true,//请求是否异步，默认为异步，这也是ajax重要特性
	    data:{userId:USERID_},    //参数值
	    type:"post",   //请求方式
	    success:function(data){
	    	var table = "";
	    	table += "<table style ='margin-left:20%;' id='login_table'>";
	    	table += "<tr><td>登录名:</td><td>";
	    	table += '<p id ="news_hint" class = "news_hint"> </p>';
	    	table += "<input type='text'readonly='readonly' id='userId' style='display: none;'/>";
	    	table += "<input type='text'readonly='readonly' id='login_name' />";
	    	table += "</td></tr>";
	    	table += "<tr><td>用户名:</td><td>";
	    	table += "<input type='text' id='userName'/>";	
	    	table += "</td></tr>"
	    	table += "<tr><td>备注:</td><td>";
	    	table += "<input type='text' id='userRemarks'/>";	
	    	table += "</td></tr>"
	    	table += "</table>";
	    	$box.promptSureBox(table,"sureEdidSave","");
	    	$("#myModalLabel").html("编辑用户");
	    	$("#userId").val(data.userId);
	    	$("#login_name").val(data.loginName);
	    	$("#userName").val(data.userName);
	    	$("#userRemarks").val(data.userRemarks);
	    },
	    error:function(){
	        alert("服务器错误！");
	    }
	});
}
function sureEdidSave(){
	var obj = {};
	var userId = $("#userId").val();
	var loginName = $("#login_name").val();
	var userName = $("#userName").val();
	if (userName.length == 0) {
		$("#news_hint").css("display", "block");
		$("#news_hint").html("用户名不能为空")
		return;
	}
	var userRemarks = $("#userRemarks").val();
	obj.userId = userId;
	obj.loginName = loginName;
	obj.userName = userName;
	obj.userRemarks = userRemarks;
	$.ajax({
	    url:"/sjcq/manage/user/editSaveUser",    //请求的url地址
	    dataType:"json",   //返回格式为json
	    async:true,//请求是否异步，默认为异步，这也是ajax重要特性
	    data:obj,    //参数值
	    type:"post",   //请求方式
	    success:function(data){
	    	if(!data.resultStatus){
	    		$("#news_hint").css("display", "block");
	    		$("#news_hint").html(data.resultInfo)
	    	}else{
	    		$box.promptBox(data.resultInfo);
	    		setTimeout(function(){
		    		 if(data.resultStatus){
		    			 signOut();
			    	 }
		    	 },2000);
	    	}
	    },
	    error:function(){
	        alert("服务器错误！");
	    }
	});
}
function signOut() {
	$.ajax({
		url : "/sjcq/manage/user/loginOut",
		dataType : "json",
		type : "post",
		data : {},
		success : function(data) {
			if (data) {
				window.location.href = "/manage/html/login.html";
			}
		},
		error : function(result, status) {
			$box.promptBox("系统异常，请联系管理员！");
		}
	});
}