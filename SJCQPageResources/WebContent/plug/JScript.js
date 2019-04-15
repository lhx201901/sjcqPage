$(document).ready(function() {
	busy=$$.Busy.New();
	try{
		SetContentDivHeight();
	}catch(e){
	}
	SetItemListStyle();

});
$(window).resize(function() {
	SetContentDivHeight();
});
var VerificationItem = new Array();
function GetJSONStr(class_name, jsonpar) {
	var a = [];
	//文本框
	$("." + class_name + " :text").each(function(i) {
		if (this.name != undefined && this.name != "")
			a.push( {
				name : this.name,
				value : this.value
			});
	});
	//隐藏域
	$("." + class_name + " :hidden").each(function(i) {
		if (this.name != undefined && this.name != "")
			var value1 = this.value.replace(new RegExp(":", 'g'), "%");
		a.push( {
			name : this.name,
			value : value1
		});
	});
	//多行文本框
	$("." + class_name + " textarea").each(function(i) {
		if (this.name != undefined && this.name != "")
			a.push( {
				name : this.name,
				value : this.value
			});
	});
	//密码文本框
	$("." + class_name + " :password").each(function(i) {
		if (this.name != undefined && this.name != "")
			a.push( {
				name : this.name,
				value : this.value
			});
	});
	//下拉列表
	$("." + class_name + " select").each(function(i) {
		if (this.name != undefined && this.name != "")
			a.push( {
				name : this.name,
				value : this.value
			});
	});
	//单选框
	$("." + class_name + " :radio").filter(":checked").each(function(i) {
		if (this.name != undefined && this.name != "")
			a.push( {
				name : this.name,
				value : this.value
			});
	});
	//复选框开始 
	var temp_cb = "";
	$("." + class_name + " :checkbox").filter(":checked").each(function(i) {
		if (this.name != undefined && this.name != "") {
			if (temp_cb.indexOf(this.name) == -1) {
				temp_cb += this.name + ",";
			}
		}
	});
	var temp_cb_arr = temp_cb.split(",");
	var cb_name = "";
	var cb_value = "";
	for ( var temp_cb_i = 0; temp_cb_i < temp_cb_arr.length - 1; temp_cb_i++) {
		cb_name = temp_cb_arr[temp_cb_i];
		var cb_value_length = $("input[name='" + temp_cb_arr[temp_cb_i]
				+ "']:checked").length;
		$("input[name='" + temp_cb_arr[temp_cb_i] + "']:checked").each(
				function(i) {
					if (i == cb_value_length - 1)
						cb_value += this.value;
					else
						cb_value += this.value + ",";
				});
		a.push( {
			name : cb_name,
			value : cb_value
		});
	}
	var temp_json = "";
	if (jsonpar)
		temp_json += jsonpar + ",";
	for ( var json_i = 0; json_i < a.length; json_i++) {
		if (json_i != a.length - 1) {
			temp_json += '"' + a[json_i].name + '":"' + a[json_i].value + '",';
		} else {
			temp_json += '"' + a[json_i].name + '":"' + a[json_i].value + '"';
		}
	}
	return "{" + temp_json + "}";
}
function GetJSONStrByID(areaid, jsonpar) {
	var a = [];
	//文本框
	$("#" + areaid + " :text").each(function(i) {
		if (this.name != undefined && this.name != "")
			a.push( {
				name : this.name + "^*^" + this.valueType,
				value : this.value
			});
	});
	//隐藏域
	$("#" + areaid + " :hidden").each(function(i) {
		if (this.name != undefined && this.name != "")
			a.push( {
				name : this.name + "^*^" + this.valueType,
				value : this.value
			});
	});
	//多行文本框
	$("#" + areaid + " textarea").each(function(i) {
		if (this.name != undefined && this.name != "")
			a.push( {
				name : this.name + "^*^" + this.valueType,
				value : this.value
			});
	});
	//下拉列表
	$("#" + areaid + " select").each(function(i) {
		if (this.name != undefined && this.name != "")
			a.push( {
				name : this.name + "^*^" + this.valueType,
				value : this.value
			});
	});
	//单选框
	$("#" + areaid + " :radio").filter(":checked").each(function(i) {
		if (this.name != undefined && this.name != "")
			a.push( {
				name : this.name + "^*^" + this.valueType,
				value : this.value
			});
	});
	//复选框开始 
	var temp_cb = "";
	var temp_type = "";
	$("#" + areaid + " :checkbox").filter(":checked").each(function(i) {
		if (this.name != undefined && this.name != "") {
			if (temp_cb.indexOf(this.name) == -1) {
				temp_cb += this.name + ",";
				temp_type = this.valueType;
			}
		}
	});
	var temp_cb_arr = temp_cb.split(",");
	var cb_name = "";
	var cb_value = "";
	for ( var temp_cb_i = 0; temp_cb_i < temp_cb_arr.length - 1; temp_cb_i++) {
		cb_name = temp_cb_arr[temp_cb_i];
		var cb_value_length = $("input[name='" + temp_cb_arr[temp_cb_i]
				+ "']:checked").length;
		$("input[name='" + temp_cb_arr[temp_cb_i] + "']:checked").each(
				function(i) {
					if (i == cb_value_length - 1)
						cb_value += this.value;
					else
						cb_value += this.value + ",";
				});
		a.push( {
			name : cb_name + "^*^" + temp_type,
			value : cb_value
		});
	}
	var temp_json = "";
	if (jsonpar)
		temp_json += jsonpar + ",";
	for ( var json_i = 0; json_i < a.length; json_i++) {
		if (json_i != a.length - 1) {
			temp_json += '"' + a[json_i].name + '":"' + a[json_i].value + '",';
		} else {
			temp_json += '"' + a[json_i].name + '":"' + a[json_i].value + '"';
		}
	}
	return "{" + temp_json + "}";
}
function ResetArea(class_name) {
	//文本框
	$("." + class_name + " :text").each(function(i) {
		if (this.name != undefined && this.name != "")
			this.value = "";
	});
	//多行文本框
	$("." + class_name + " textarea").each(function(i) {
		if (this.name != undefined && this.name != "")
			this.value = "";
	});
	//单选框
	$("." + class_name + " :radio").filter(":checked").each(function(i) {
		// ll  2012.11.19
//		$("." + class_name + " :radio:first")
//		if (this.name != undefined && this.name != "")
//			this.value = "";
	});
	//复选框开始 
	$("." + class_name + " :checkbox").filter(":checked").each(function(i) {
		$("." + class_name + " :checkbox").attr("checked",false);   // ll  2012.11.19 
//		if (this.name != undefined && this.name != "") {
//			this.value = "";
//		}
	});
}
function ResetAreaByID(areaid) {
	//文本框
	$("#" + areaid + " :text").each(function(i) {
		if (this.name != undefined && this.name != "")
			this.value = "";
	});
	//多行文本框
	$("#" + areaid + " textarea").each(function(i) {
		if (this.name != undefined && this.name != "")
			this.value = "";
	});
	//单选框
	$("#" + areaid + " :radio").filter(":checked").each(function(i) {
		if (this.name != undefined && this.name != "")
			this.value = "";
	});
	//复选框开始 
	$("#" + areaid + " :checkbox").filter(":checked").each(function(i) {
		if (this.name != undefined && this.name != "") {
			this.value = "";
		}
	});
}
function ConvertDate(dateobj) {
	return dateobj.getFullYear() + "-" + (dateobj.getMonth() + 1) + "-"
			+ dateobj.getDate();
}
/*
 * 对必填项进行非空、非发字符验证
 */
Verification = true;
function CheckInputValue(obj, Illegal) {
	if (obj.value != ""
			&& obj.validate != "false" && obj.style.display!='none' && false == $$.Regular.match(obj.value,
					$$.Regular.Expressions.IllegalStr, $$.Regular)) {
		if (true == Illegal) {
			VerificationItem[VerificationItem.length] = obj.name;
			Verification = false;
			top.messageBox.show( {
				"strMessage" : $(obj.parentNode).find("h5").text().replace(" ","")+ "中包含非法字符！" + $$.Regular.desc,
				"jsonCallback" : [ {
					callback : function() {
						$("#" + obj.id).select();
					}
				} ]
			});
		}
	} else {
		if (obj.validate != "false" && ($(obj.parentNode).find("span").text() == "*"
				|| $(obj.parentNode).find("h4").text() == "*")) {
			var index = $(VerificationItem).index(obj.name);
			if (obj.value == "") {
				if (index == -1) {
					VerificationItem[VerificationItem.length] = obj.name;
					Verification = false;
					$(obj.parentNode).find("h6").css("color", "#FF0000");
					$("#" + obj.id).select();
				}
			} else {
				if (index > -1) {
					VerificationItem.splice(
							$(VerificationItem).index(obj.name), 1);
				} else {
					return;
				}
				if (VerificationItem.length == 0) {
					Verification = true;
				}
				$(obj.parentNode).find("h6").css("color", "blue");
			}
		}
	}
}
function RemoveVerification(formName){
	var index = $(VerificationItem).index(formName);
	if (index > -1) {
		VerificationItem.splice(
				$(VerificationItem).index(formName), 1);
	} else {
		return;
	}
	if (VerificationItem.length == 0) {
		Verification = true;
	}
}
/*
 * 创建A对象
 */
function CreateAObj(href, text, target, onclick, className, style) {
	var oa = document.createElement("A");
	var oatext = document.createTextNode("TEXT");
	oa.insertBefore(oatext);
	oatext.nodeValue = text;
	if (href != "")
		oa.href = href;
	$(oa).attr("target", target);
	$(oa).attr("title", text);
	$(oa).css(style);
	$(oa).addClass(className);
	$(oa).click(function() {
		eval(onclick)
	});
	return oa;
}
/*
 * 创建IMG对象
 */
function CreateIMGObj(src, alt, onclick, className, style) {
	var oimg = document.createElement("IMG");
	$(oimg).attr("src", src);
	$(oimg).attr("alt", alt);
	$(oimg).css(style);
	$(oimg).addClass(className);
	$(oimg).click(function() {
		eval(onclick)
	});
	return oimg;
}
/*
 * 创建SPAN对象
 */
function CreateSPANObj(text, onclick, className, style) {
	var ospan = document.createElement("SPAN");
	$(ospan).text(text);
	$(ospan).attr("title", text);
	$(ospan).css(style);
	$(ospan).addClass(className);
	if (onclick != undefined && onclick != "")
		$(ospan).click(function() {
			eval(onclick)
		});
	return ospan;
}
//检索用户信息
function Search() {
	var regstr = /['"]/;
	if ($("#searchQuery").val().match(regstr)) {
		top.messageBox.show("检索词中存在非法字符！", "提示",
				$$.FloatWindow.enumBoxIcon.Warning,
				$$.FloatWindow.enumBoxButtons.OK);
		$("#searchQuery").focus();
		return;
	} else {
		table.queryText = $("#searchQuery").val();
		table.pageNum = 0;
		table.Refresh();
	}
}

function SetContentDivHeight() {
	$("#middleArea").height(document.body.clientHeight - 104);
	if ($("#TabArea").length != 0)
		$("#TabArea").height(document.body.clientHeight - 30);
	if ($(".content").length != 0) {
		var height;
		height = document.body.clientHeight - 105;
		if ($("#mainnav").length != 0)
			height -= $("#mainnav").height();
		$(".content").css("min-height", height);
		$(".content").css("_height", height);
		$(".content").css("height", height);
	}
	if ($("#treeDiv").length != 0) {
		$("#treeDiv").css("height", height);
		var width = $("#content").width() - 205;
		$("#treeContainer").width(width);
	}
	if($("iframe[formLabel='FormFrame']").length>0){
		$("iframe[formLabel='FormFrame']").height(document.body.clientHeight - 105-65);
	}
	if($("iframe[formLabel='GrapFrame']").length>0){
		$("iframe[formLabel='GrapFrame']").height(document.body.clientHeight - 105);
	}
}
var TimeObj;
function GetTreeSelectNode() {
	if (tree != null && tree != undefined)
		return tree._selected;
}
function DeleteLeftTreeNode(value) {
	if (tree != null && tree != undefined)
		tree._aNodes[tree.GetCodeByPostValue(value)].AjaxGetChildNode(tree
				.GetNodeByPostValue(value)._parent, false, true, false);
	//parent.LeftFarme.frames[num - 1].tree.RemoveNodeIdByPostValue(value);
}
function RefreshSelectNode() {
	if (tree != null && tree != undefined)
		tree._selected.AjaxGetChildNode(tree._selected, false, true, false);
}
function RefreshTreeNode(value) {
	if (tree != null && tree != undefined)
		tree._aNodes[tree.GetCodeByPostValue(value)].AjaxGetChildNode(tree
				.GetNodeByPostValue(value), false, true, false);
}
function ClickTreeNode(value) {
	$("#l" + tree._aNodes[tree.GetCodeByPostValue(value)].id).click();
}
function GetTwoParentNodeValue(value) {
	var num = top.LeftFarme.$(".CurrentMenu").get(0).id.replace("DivMenuTitle",
			"");
	if (num > 0) {
		var node = top.LeftFarme.frames[num - 1].tree.GetNodeByPostValue(value);
		if (node != null && node._parent != undefined) {
			node = node._parent;
			if (node != null && node._parent != undefined) {
				return node._parent.postvalue;
			} else
				return node.postvalue;
		} else
			return node.postvalue;
	}
}function SelectOpenNode(value) {
	try {
		var num = top.LeftFarme.$(".CurrentMenu").get(0).id.replace(
				"DivMenuTitle", "");
		if (num > 0) {
			top.LeftFarme.frames[num - 1].tree.GetNodeByPostValue(value)
					._select();
			top.LeftFarme.frames[num - 1].tree.GetNodeByPostValue(value)
					.showNode();
		}
	} catch (e) {
	}
}
function SelectOpenNodeSubId(value, parlength) {
	var num = top.LeftFarme.$(".CurrentMenu").get(0).id.replace("DivMenuTitle",
			"");
	if (num > 0) {
		top.LeftFarme.frames[num - 1].tree.GetNodeByPostValue(
				value.substring(0, value.length - parlength))._select();
		top.LeftFarme.frames[num - 1].tree.GetNodeByPostValue(
				value.substring(0, value.length - parlength)).showNode();
	}
}
function FrameSetContentDivHeight() {
	try {
		var height;
		if (ContentFarme.$("#TabTitleUL").length != 0)
			height = self.parent.document.body.clientHeight - 164;
		else
			height = self.parent.document.body.clientHeight - 139;
		ContentFarme.$("#ContentDiv").height(height);
		try {
			ContentFarme.$("#iframename").get(0).style.width = document.body.clientWidth - 210;
			ContentFarme.$("#iframename").get(0).style.height = (height - 40)
					+ "px";
		} catch (e) {
		}
	} catch (e) {

	}
}
function CheckBrowserIE6() {
	if (window.ActiveXObject) {
		var ua = navigator.userAgent.toLowerCase();
		var ie = ua.match(/msie ([\d.]+)/)[1];
		if (ie == 6.0) {
			return true;
			//alert("您的浏览器版本过低，在本系统中不能达到良好的视觉效果，建议你升级到ie8以上！");
		}
	}
	return false;
}
var nowTitle = "";
var treeTitleTemp = "";
function TreeChangeNavigation(title, id, temp) {
	//alert(title+"  "+id+"   "+temp);
	var nowtitle = $("#breadcrumb").html();
	if (treeTitleTemp == "" || treeTitleTemp != temp) {
		if (nowTitle == "")
			nowTitle = nowtitle;
		treeTitleTemp = temp;
		var count = 0;
		var ss = nowTitle;
		nowtitle = nowTitle;
		while (ss.indexOf("&gt;") != -1) {
			ss = ss.replace("&gt;", "");
			count++;
		}
		if (count > 1)
			nowtitle = nowtitle.substr(0, nowtitle.lastIndexOf("&gt;") + 8);
	}
	//var FirstMenuId = parent.$(".CurrentMenu").get(0).id.replace("DivMenuTitle", "ContentFarme");
	var oldtitle = title;
	if (title.length > 10)
		title = title.substr(0, 10) + "...";
	$("#breadcrumb").html(
			nowtitle + " >> <a href='#' onclick=\"$('#" + id
					+ "').click();\" title='" + oldtitle + "'>" + title
					+ "</a>"); //+" -> <span onclick=\""+click+"\">"+title+"</span>");
}


//设置首页
function setHomePage(urlStr) {
	if (document.all) {
		document.body.style.behavior = 'url(#default#homepage)';
		document.body.setHomePage(urlStr);
	}
}
//关闭该窗体
function closeWindow() {
	window.opener = null;
	if (confirm("是否退出系统?"))
		window.close();
}
//注销
function logout(path) {
	if (confirm("注销后将回到登陆页面，确定注销?"))
		window.location.replace(path + "login.jsp?logout=1");
}

//根据对象name属性获取复选框选中的值
//获取选择的功能模块id多个用逗号隔开
function getCheckBoxsSelectValue(objName) {
	try {
		var obj = document.getElementsByName(objName);
		var value = "";
		for ( var x = 0; x < obj.length; x++) {
			if (obj[x].checked && obj[x].value != "")
				value += obj[x].value + ",";
		}
		if (value.length != 0)
			value = value.substr(0, value.length - 1);
		/* value=value.substr(0,value.length-1);
		 value=value.replace("true,","");*/
		//value=value.substr(0,value.length-1);
		return value;
	} catch (e) {
		return "";
	}
}
//根据对象name属性获取复选框选中的文本内容
function getCheckBoxsSelectText(objName) {
	try {
		var obj = document.getElementsByName(objName);
		var text = "";
		for ( var x = 0; x < obj.length; x++) {
			if (obj[x].checked && obj[x].value != ""
					&& obj[x].nextSibling.data != "")
				text += obj[x].nextSibling.data.replace(" ", "") + ",";
		}
		if (text.length != 0)
			text = text.substr(0, text.length - 1);
		return text;
	} catch (e) {
		return "";
	}
}

//替换字符串中的特殊符号
function ReplaceCode(ss) {
	while (ss.indexOf("\"") != -1)
		ss = ss.replace("\"", "%^1");
	while (ss.indexOf("'") != -1)
		ss = ss.replace("'", "%^2");
	while (ss.indexOf("<") != -1)
		ss = ss.replace("<", "%^3");
	while (ss.indexOf(">") != -1)
		ss = ss.replace(">", "%^4");
	while (ss.indexOf("&") != -1)
		ss = ss.replace("&", "%^5");
	while (ss.indexOf("/") != -1)
		ss = ss.replace("/", "%^6");
	while (ss.indexOf("\\\\") != -1)
		ss = ss.replace("\\\\", "%^7");
	while (ss.indexOf("\\n") != -1) {
		ss = ss.replace("\\n", "%^8");
	}
	while (ss.indexOf("\\r") != -1)
		ss = ss.replace("\\r", "%^9");
	return ss;
}
//还原字符串中的特殊符号
function UnReplaceCode(ss) {
	while (ss.indexOf("%^1") != -1)
		ss = ss.replace("%^1", "\"");
	while (ss.indexOf("%^2") != -1)
		ss = ss.replace("%^2", "'");
	while (ss.indexOf("%^3") != -1)
		ss = ss.replace("%^3", "<");
	while (ss.indexOf("%^4") != -1)
		ss = ss.replace("%^4", ">");
	while (ss.indexOf("%^5") != -1)
		ss = ss.replace("%^5", "&");
	return ss;
}

//还原字符串中的特殊符号   add by ZhouShuhua time 2011.10.25
function UnReplaceCode2(ss) {
	while (ss.indexOf("%^1") != -1)
		ss = ss.replace("%^1", "\"");
	while (ss.indexOf("%^2") != -1)
		ss = ss.replace("%^2", "'");
	while (ss.indexOf("%^3") != -1)
		ss = ss.replace("%^3", "<");
	while (ss.indexOf("%^4") != -1)
		ss = ss.replace("%^4", ">");
	while (ss.indexOf("%^5") != -1)
		ss = ss.replace("%^5", "&");
	while (ss.indexOf("%^6") != -1)
		ss = ss.replace("%^6", "/");
	while (ss.indexOf("%^7") != -1)
		ss = ss.replace("%^7", "\\\\");
	while (ss.indexOf("%^8") != -1)
		ss = ss.replace("%^8", "\\n");
	while (ss.indexOf("%^9") != -1)
		ss = ss.replace("%^9", "\\r");
	return ss;
}

function UnReplaceCode3(ss) {
	while (ss.indexOf("%^1") != -1)
		ss = ss.replace("%^1", "\"");
	while (ss.indexOf("%^2") != -1)
		ss = ss.replace("%^2", "'");
	while (ss.indexOf("%^3") != -1)
		ss = ss.replace("%^3", "<");
	while (ss.indexOf("%^4") != -1)
		ss = ss.replace("%^4", ">");
	while (ss.indexOf("%^5") != -1)
		ss = ss.replace("%^5", "&");
	while (ss.indexOf("%^6") != -1)
		ss = ss.replace("%^6", "/");
	while (ss.indexOf("%^7") != -1)
		ss = ss.replace("%^7", "\\\\");
	while (ss.indexOf("%^8") != -1)
		ss = ss.replace("%^8", "<p>");
	while (ss.indexOf("%^9") != -1)
		ss = ss.replace("%^9", "");
	return ss;
}

function UnReplaceCode4(ss) {
	while (ss.indexOf("%^1") != -1)
		ss = ss.replace("%^1", "\"");
	while (ss.indexOf("%^2") != -1)
		ss = ss.replace("%^2", "'");
	while (ss.indexOf("%^3") != -1)
		ss = ss.replace("%^3", "<");
	while (ss.indexOf("%^4") != -1)
		ss = ss.replace("%^4", ">");
	while (ss.indexOf("%^5") != -1)
		ss = ss.replace("%^5", "&");
	while (ss.indexOf("%^6") != -1)
		ss = ss.replace("%^6", "/");
	while (ss.indexOf("%^7") != -1)
		ss = ss.replace("%^7", "\\\\");
	while (ss.indexOf("%^8") != -1)
		ss = ss.replace("%^8", "<br/>");
	while (ss.indexOf("%^9") != -1)
		ss = ss.replace("%^9", "");
	return ss;
}

//JS时钟
function showTime() {
	TimeObj = setTimeout('JSClock()', 1000);
}
function JSClock() {
	try {
		var now = new Date();
		var hours = now.getHours();
		var minutes = now.getMinutes();
		var seconds = now.getSeconds();
		document.all.show.innerHTML = "" + hours + ":" + minutes + ":"
				+ seconds + "";
		TimeObj = setTimeout('JSClock()', 1000);
	} catch (e) {
	}
}
//跳转翻页(页码框id为PageText)
function ChangePage(pageUrl, nowpage, maxPage) {
	window.location = GetUrlPar(pageUrl, nowpage);
}
//判断输入的是否是数字
function checkAllFloat(objtext) {
	var reg = /^0?$/;
	if (objtext.value.match(reg))
		return true;
	reg = /^0[.]\d*$/;
	if (objtext.value.match(reg))
		return true;
	reg = /^[1-9]\d*[.]?\d*$/;
	if (objtext.value.match(reg))
		return true;
	top.contentFrame.messageBox.show("输入页码有误！");
	objtext.select();
	return false;
}
function GetUrlPar(url, nowpage) {
	if (((GetValue(window.location.href, "nowpage") == null || GetValue(
			window.location.href, "nowpage") == "") && nowpage != 0)
			|| (GetValue(window.location.href, "nowpage") != null && GetValue(
					window.location.href, "nowpage") != "")
			&& nowpage + "" != GetValue(window.location.href, "nowpage")) {
		var reg = /nowpage=\d*/;
		if (url.match(reg))
			url = url.replace(url.match(reg)[0], "nowpage=" + nowpage);
		else {
			if (url.indexOf("?") != -1)
				url += "&nowpage=" + nowpage;
			else
				url += "?nowpage=" + nowpage;
		}
		if (url.indexOf("&TabId") != -1)
			url = url.substring(0, url.indexOf("&TabId"));
		if ($(".CurrentTitle").length != 0) {
			var id = $(".CurrentTitle").get(0).id.replace("CurrentTitleLI", "");
			url += "&TabId=HyperLink"
					+ id
					+ "&Click="
					+ $("#CurrentTitleLI" + id).get(0).TabClick.replace("this",
							"document.getElementById('CurrentTitleLI" + id
									+ "')");
		}
		return url;
	} else
		return "";
}
//复选框全选或取消
function checkAll(obj, name) {
	try {
		for ( var i = 0; i < $("."+name+":visible").length; i++) {
			var e = $("."+name+":visible")[i];
			if (e.name == name) {
				e.checked = obj.checked;
				/*if (e.checked){
					$(e).click();
				}*/
				/*CheckboxClick(e)*/
				//$(e).click();
			}
		}
	} catch (e) {
	}
}
activeId = "";
var ReturnPageFunction = "";
function GoPage(changepageurl, nowpage, maxpage) {
	var obj = null;
	if ($(".CurrentTitle").length == 0)
		obj = document.getElementById("PageText");
	else {
		var num = $(".CurrentTitle").get(0).id.replace("CurrentTitleLI", "");
		obj = $("#PageText" + num).get(0);
	}
	if (checkAllFloat(obj)) {
		if (maxpage != null) {
			if (obj.value == "") {
				top.contentFrame.messageBox.show("请输入跳转页码！");
				obj.select();
			} else if ((obj.value * 1) > (maxpage * 1)) {
				top.contentFrame.messageBox.show("请输入小于总页数的页码！");
				obj.select();
			} else if ((obj.value * 1) < 1) {
				top.contentFrame.messageBox.show("请输入大于零的页码！");
				obj.select();
			} else {
				var newurl = GetUrlPar(window.location.href, obj.value * 1 - 1);
				if (newurl != "")
					window.location = newurl;
				//send_postrequest(PostUrl,"returnPageFun","page="+(document.all.PageText.value*1-1)+Query+serverPar+"&activeId="+activeid);
			}
		} else {
			send_postrequest(PostUrl, "returnPageFun", "page=" + page + Query
					+ serverPar + "&activeId=" + activeid);
			openWinDiv("getPageDiv");
		}
	}

}
function returnPageFun(obj) {
	if (obj.readyState == 4) {
		if (obj.status == 200) {
			try {
				HideWinDiv("getPageDiv");
				eval(ReturnPageFunction + "(obj)");
			} catch (e) {
				HideWinDiv("getPageDiv");
			}
		}
	}
}
function SetItemListStyle(itemjqname) {
	if (itemjqname == undefined || itemjqname == "") {
		itemjqname = ".ItemList";
	}
	if ($(itemjqname).length > 0) {
		var a = "SingleLine";//"#FFFFFF";
		var b = "TwoLine";//"#FAF7E7";
		var strCount = 0;
		var obj = $(itemjqname).find("li");
		for ( var i = 0; i < obj.length; i++) {
			$(obj[i]).addClass(((i % 2 == 0) ? a : b));//style.backgroundColor
		}
	}
}
function AjaxError(XMLHttpRequest, textStatus, errorThrown) {
	var ErrorInfo = new Array();
	ErrorInfo["parsererror"] = "请求时分析器错误！";
	ErrorInfo["timeout"] = "请求超时，请检查网络后重试！";
	ErrorInfo["error"] = "请求时发生异常请检查后重试！";
	ErrorInfo["notmodified"] = "请求时网络异常请检查后重试！";
	top.messageBox.show({"strMessage":ErrorInfo[textStatus],"enumIcon":$$.FloatWindow.enumBoxIcon.Error});
}

function correctPNG() {
	for ( var i = 0; i < document.images.length; i++) {
		var img = document.images[i]
		var imgName = img.src.toUpperCase()
		if (imgName.substring(imgName.length - 3, imgName.length) == "PNG") {
			var imgID = (img.id) ? "id='" + img.id + "' " : ""
			var imgClass = (img.className) ? "class='" + img.className + "' "
					: ""
			var imgTitle = (img.title) ? "title='" + img.title + "' "
					: "title='" + img.alt + "' "
			var imgStyle = "display:inline-block;" + img.style.cssText
			if (img.align == "left")
				imgStyle = "float:left;" + imgStyle
			if (img.align == "right")
				imgStyle = "float:right;" + imgStyle
			if (img.parentElement.href)
				imgStyle = "cursor:hand;" + imgStyle
			var strNewHTML = "<span "
					+ imgID
					+ imgClass
					+ imgTitle
					+ " style=\""
					+ "width:"
					+ img.width
					+ "px; height:"
					+ img.height
					+ "px;"
					+ imgStyle
					+ ";"
					+ "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader"
					+ "(src=\'" + img.src
					+ "\', sizingMethod='scale');\"></span>"
			img.outerHTML = strNewHTML
			i = i - 1
		}
	}
}

/**   
 *    
 * @param {} obj 当前对象，一般是使用this引用。   
 * @param {} vrl 主页URL   
 */
function SetHome(obj, vrl) {
	try {
		obj.style.behavior = 'url(#default#homepage)';
		obj.setHomePage(vrl);
	} catch (e) {
		if (window.netscape) {
			try {
				netscape.security.PrivilegeManager
						.enablePrivilege("UniversalXPConnect");
			} catch (e) {
				top.contentFrame.messageBox.show("此操作被浏览器拒绝！");
			}
			var prefs = Components.classes['@mozilla.org/preferences-service;1']
					.getService(Components.interfaces.nsIPrefBranch);
			prefs.setCharPref('browser.startup.homepage', vrl);
		}
	}
}
/**   
 *    
 * @param {} sURL 收藏链接地址   
 * @param {} sTitle 收藏标题   
 */
function AddFavorite(sURL, sTitle) {
	try {
		window.external.addFavorite(sURL, sTitle);
	} catch (e) {
		try {
			window.sidebar.addPanel(sTitle, sURL, "");
		} catch (e) {
			top.contentFrame.messageBox.show("加入收藏失败，请使用Ctrl+A进行添加！");
		}
	}
}
/*
 * AJAX读取效果DIV
 */
function LoadingDiv() {
	this.objDiv = null;
	if (this.objDiv == null) {
		this.objDiv = document.createElement("Div");
		$(this.objDiv).attr("id", "LoadingDivSmall");
		$(this.objDiv).hide();
		document.body.insertBefore(this.objDiv);
	}
	this.Show = function(target) {
		if (target) {
			$(loadingDiv.objDiv).get(0).style.left = getLeft(target)
					+ (target.offsetWidth / 2) - 40;
			$(loadingDiv.objDiv).get(0).style.top = getTop(target)
					+ (target.offsetHeight / 2) - 8;
			$(loadingDiv.objDiv).show();
		} else {
			$(loadingDiv.objDiv).get(0).style.left = (document.body.clientWidth / 2) - 40;
			$(loadingDiv.objDiv).get(0).style.top = (document.body.clientHeight / 2) - 8;
			$(loadingDiv.objDiv).show();
		}
	}
	this.Hide = function() {
		$(loadingDiv.objDiv).hide();
	}
	function getLeft(e) {
		var offset = e.offsetLeft;
		if (e.offsetParent != null)
			offset += getLeft(e.offsetParent);
		return offset;
	}
	function getTop(e) {
		var offset = e.offsetTop;
		if (e.offsetParent != null)
			offset += getTop(e.offsetParent);
		return offset;
	}
}
function pagesetup_null() {
	var hkey_root, hkey_path, hkey_key
	hkey_root = "HKEY_CURRENT_USER "
	hkey_path = "\\Software\\Microsoft\\Internet Explorer\\PageSetup\\ "
	try {
		var RegWsh = new ActiveXObject("WScript.Shell")
		hkey_key = "header "
		RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, " ")
		hkey_key = "footer "
		RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, " ")
	} catch (e) {
	}
}
/**
 * 将json转换为连接字符串
 * @param {Object} strData
 */
function replaceString(strdata) {
	strdata = strdata.replace(new RegExp(",", 'g'), "&");
	strdata = strdata.replace("{", "");
	strdata = strdata.replace("}", "");
	strdata = strdata.replace(new RegExp(":", 'g'), "=");
	strdata = strdata.replace(new RegExp("\"", 'g'), "");
	strdata = strdata.replace(new RegExp("\\\\", 'g'), "");
	strdata = strdata.replace(new RegExp("%", 'g'), ":");
	return strdata;
}
