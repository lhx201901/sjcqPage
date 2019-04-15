$$ = MyPlug = {
	createA : function(pstrText, pstrClass, peventCallback, pbHand, pjsonCss) {
		var domA = document.createElement("a");
		if (undefined == pbHand || true == pbHand) {
			$(domA).attr("href", "javascript:void(0);");
		}
		$(domA).addClass(pstrClass);
		$(domA).text(pstrText);
		if(pstrText!=""){
			$(domA).attr("title",pstrText);
		}
		if (undefined != peventCallback) {
			$(domA).click(peventCallback);
		}
		if (undefined != pjsonCss) {
			for ( var x = 0; x < pjsonCss.length; x++) {
				$(domA).css(pjsonCss[x].name, pjsonCss[x].value);
			}
		}
		return domA;
	},
	createSpan : function(pstrText, pstrClass, peventCallback, pjsonCss) {
		var domSpan = document.createElement("span");
		$(domSpan).addClass(pstrClass);
		$(domSpan).text(pstrText);
		if (undefined != peventCallback) {
			$(domSpan).click(peventCallback);
		}
		if (undefined != pjsonCss) {
			for ( var x = 0; x < pjsonCss.length; x++) {
				$(domSpan).css(pjsonCss[x].name, pjsonCss[x].value);
			}
		}
		return domSpan;
	},
	createImg : function(pstrSrc, pstrClass, peventCallback, pjsonCss) {
		var domSpan = document.createElement("img");
		$(domSpan).addClass(pstrClass);
		$(domSpan).attr("src", pstrSrc);
		if (undefined != peventCallback) {
			$(domSpan).click(peventCallback);
		}
		if (undefined != pjsonCss) {
			for ( var x = 0; x < pjsonCss.length; x++) {
				$(domSpan).css(pjsonCss[x].name, pjsonCss[x].value);
			}
		}
		return domSpan;
	}
};

/*
 * 弹出窗体插件
 * 2012.9.1
 * DYL
 * V1.0.5
 */
(function($$) {
	var moveX = 0;
	var moveY = 0;
	function FloatWindow(penumBoxType, opts) {
		var _this = this;
		this.status=1;
		this.m_enumBoxType = penumBoxType;
		this.m_strPlugName;
		this.m_strTitle;
		this.m_strMessage;
		this.m_objContent;
		this.m_blZoom = true;
		this.m_enumBoxButtons = $$.FloatWindow.enumBoxButtons.OK;
		this.m_jsonButtonsCallback;
		this.m_enumBoxIcon;
		this.m_domBox;
		this.m_domMask;
		this.m_jsonCustomButtons;
		this.m_enumMode = $$.FloatWindow.enumBoxMode.ModeDialog;
		this.m_funHotkeys;
		this.m_jsonSize = {
			width : 480,
			height : 320
		};

		for (i in opts) {
			if (i.charAt(0) != '_') {
				eval('this.' + i + ' = opts[\'' + i + '\'];');
			}
		}
		this.m_izIndex = 100;
		if (this.m_enumBoxType == $$.FloatWindow.enumBoxType.Message) {
			this.m_izIndex = 200;
		}
		this.m_thAutoHide;
		this.m_jsonSize.width = this.m_jsonSize.width - 20;
		this.m_jsonSize.height = this.m_jsonSize.height - 76;
		this.m_alWindows = new Array();
		this.m_alShowWindows = new Array();
		this.m_iTopIndex = this.m_iIndex = -1;
		this.defaultBoxIcon = this.m_enumBoxIcon;
		this.defaultBoxButtons = this.m_enumBoxButtons;
		this.defaultTitle = this.m_strTitle;
		this.m_domBox = createBox(_this);
		this.m_domMask = creatMask();
		this.m_bShow = false;
		this.m_contentName = this.m_strPlugName + "ContentBox"
				+ (this.m_iIndex);
		this.m_domBox.strWindowID = this.m_contentName;
		this.m_alWindows[this.m_contentName] = this.m_domBox;
		this.m_strMessageTitle = [];
		this.m_strMessageTitle["Information"] = "系统提示";
		this.m_strMessageTitle["Error"] = "系统错误";
		this.m_strMessageTitle["Warning"] = "系统警告";
		this.m_strMessageTitle["Question"] = "系统提示";
		this.m_strMessageTitle["None"] = "系统消息";
		$(document.body).append(_this.m_domBox);
	}
	;
	function newWindow(obj) {
		obj.m_domBox = createBox(obj);
		$(document.body).append(obj.m_domBox);
		obj.m_domBox.strWindowID = obj.m_strPlugName + "ContentBox"
				+ (obj.m_iIndex);
		obj.m_alWindows[obj.m_strPlugName + "ContentBox" + (obj.m_iIndex)] = obj.m_domBox;
		return obj.m_strPlugName + "ContentBox" + (obj.m_iIndex);
	}
	function createBox(obj) {
		obj.m_iIndex++;
		var strWindowID = obj.m_strPlugName + "ContentBox" + (obj.m_iIndex);
		var domTr, domTd, domDiv, domDiv1, domA, domSpan;
		var domBox = document.createElement("div");
		if (obj.m_enumBoxType == $$.FloatWindow.enumBoxType.Notice) {
			$(domBox).mouseover(function() {
				clearTimeout(obj.m_thAutoHide);
			});
		}
		if (obj.m_enumBoxType == $$.FloatWindow.enumBoxType.Handle) {
			$(domBox).click(
					function() {
						if (null != event && undefined != event.srcElement
								&& event.srcElement.tagName != "A") {
							obj.m_iIndex++;
							$(domBox).css("z-index",1000);
						}
					});
		}
		$(domBox).addClass("floatWindow");
		$(domBox).css("z-index", 1000);
		var domTable = document.createElement("table");
		$(domBox).append(domTable);
		$(domTable).addClass("fwTable");
		$(domTable).attr("cellpadding", "0");
		$(domTable).attr("cellspacing", "0");
		$(domTable).attr("width","100%");
		domTr = document.createElement("tr");
		$(domTable).append(domTr);
		//$(domTr).attr("title", "按住鼠标左键可拖动，双击缩放");
		$(domTr).attr("id", "titleTR");
		$(domTr).mousedown(function() {
			moveDown(domBox);
		});
		if (obj.m_enumBoxType == $$.FloatWindow.enumBoxType.Handle
				&& obj.m_blZoom == true) {
			$(domTr).dblclick(function() {
				obj.zoom(strWindowID);
			});
		}
		domTd = document.createElement("td");
		$(domTr).append(domTd);
		$(domTd).addClass("tipLeft");
		domTd = document.createElement("td");
		$(domTr).append(domTd);
		$(domTd).addClass("tipTitle");
		domDiv = document.createElement("div");
		$(domTd).append(domDiv);
		domDiv1 = document.createElement("div");
		$(domDiv).append(domDiv1);
		$(domDiv1).addClass("fwTitle");
		$(domDiv1).text(obj.m_strTitle);
		domDiv1 = document.createElement("div");
		$(domDiv).append(domDiv1);
		$(domDiv1).addClass("fwTool");
		if (obj.m_enumBoxType == $$.FloatWindow.enumBoxType.Handle
				&& obj.m_blZoom == true) {
			domA = document.createElement("a");
			$(domDiv1).append(domA);
			$(domA).attr("href", "javascript:void(0);");
			/*domSpan = document.createElement("span");
			$(domA).append(domSpan);
			$(domSpan).addClass("fwZoom");
			$(domSpan).attr("title", "缩放");
			$(domSpan).click(function() {
				obj.zoom(strWindowID);
			});*/
		}
		domA = document.createElement("a");
		$(domDiv1).append(domA);
		$(domA).attr("href", "javascript:void(0);");
		domSpan = document.createElement("span");
		$(domA).append(domSpan);
		$(domSpan).addClass("fwClose");
		$(domSpan).attr("title", "关闭");
		$(domSpan).click(function() {
			obj.hide(strWindowID);
		});

		domTd = document.createElement("td");
		$(domTr).append(domTd);
		$(domTd).addClass("tipRight");

		domTr = document.createElement("tr");
		$(domTable).append(domTr);
		domTd = document.createElement("td");
		$(domTr).append(domTd);
		$(domTd).addClass("boxLeft");
		$(domTd).html("&nbsp;");
		domTd = document.createElement("td");
		$(domTr).append(domTd);

		$(domTd).addClass("ftBox");
		domDiv = document.createElement("div");
		$(domTd).append(domDiv);
		if (obj.m_enumBoxType == $$.FloatWindow.enumBoxType.Message) {
			$(domDiv).addClass("ftBoxMessage");
			if (obj.m_enumBoxIcon != $$.FloatWindow.enumBoxIcon.None) {
				$(domDiv).addClass(obj.m_enumBoxIcon);
			}
			$(domDiv).text(obj.m_strMessage);
		} else if (obj.m_enumBoxType == $$.FloatWindow.enumBoxType.Notice) {
			$(domDiv).addClass("ftBoxMessage");
			$(domDiv).text(obj.m_strMessage);
			var jsTemp = getWindowNoticeLocation(obj.m_jsonSize);
			$(domBox).css("left", jsTemp.left + obj.m_jsonSize.width);
			$(domBox).css("top", jsTemp.top + obj.m_jsonSize.height);
			domBox.jsLocation = {
				left : jsTemp.left + obj.m_jsonSize.width,
				top : jsTemp.top + obj.m_jsonSize.height
			}
			$(domDiv).width(0);
			$(domDiv).height(0);
		} else {
			$(domDiv).attr("id", strWindowID);

			$(domDiv).addClass("ftBoxContent");
			$(domDiv).width(0);
			$(domDiv).height(0);
			$(domDiv).width(obj.m_jsonSize.width);
			$(domDiv).height(obj.m_jsonSize.height);
			$(domDiv).append(obj.m_objContent);
	 
		}
		domTd = document.createElement("td");
		$(domTr).append(domTd);
		$(domTd).addClass("boxRight");
		$(domTd).html("&nbsp;");

		domTr = document.createElement("tr");
		$(domTable).append(domTr);
		domTd = document.createElement("td");
		$(domTr).append(domTd);
		$(domTd).addClass("bottomLeft");
		domTd = document.createElement("td");
		$(domTr).append(domTd);
		$(domTd).addClass("bottomTd");
		domDiv = document.createElement("div");
		$(domTd).append(domDiv);
		$(domDiv).addClass("ftButton");

		initialButton(obj, domDiv);

		domTd = document.createElement("td");
		$(domTr).append(domTd);
		$(domTd).addClass("bottomRight");
		domBox.jsSize = obj.m_jsonSize;
		return domBox;
	}
	function creatMask(name) {
		var domMaskDiv = document.createElement("div");
		$(document.body).append(domMaskDiv);
		$(domMaskDiv).addClass("floatWindowMask");
		var blIE6;
		if (top.m_jsUser == undefined) {
			//blIE6 = CheckBrowserIE6();
		} else {
			blIE6 = top.m_jsUser.IE6;
		}
		if (document.getElementsByTagName("select")) {
			var L = document.createElement("IFRAME");
			L.className = "floatWindowMaskIF";
			L.style.width = "100%";
			L.style.height = "100%";
			//L.style.display = "";
			L.style.zIndex = (91);
			$(domMaskDiv).append(L);

			/*var mask = document.createElement("div");
			mask.style.height = "100%";
			mask.style.width = "100%";
			mask.style.background = "#cccccc";
			mask.style.filter = "alpha(opacity=50)";
			mask.style.position = "absolute";
			mask.style.zIndex = (92);
			mask.style.top = "0px";
			mask.style.left = "0px";
			$(domMaskDiv).append(mask);*/
		}
		return domMaskDiv;
	}
	function customButtons(obj) {
		var domDiv = $(obj.m_domBox).find(".ftButton");
		$(domDiv).empty();
		if (undefined != obj.m_jsonCustomButtons
				&& obj.m_jsonCustomButtons.length > 0) {
			createButtons(obj, domDiv);
		}
		initialButton(obj, domDiv);
	}
	function initialButton(obj, domDiv) {
		switch (obj.m_enumBoxButtons) {
		case $$.FloatWindow.enumBoxButtons.YesNo:
			if (undefined != obj.m_jsonButtonsCallback) {
				$(domDiv).append(
						createButton(obj, "是",
								obj.m_jsonButtonsCallback[0].callback));
				$(domDiv).append(
						createButton(obj, "否",
								obj.m_jsonButtonsCallback[1].callback));
			} else {
				$(domDiv).append(createButton(obj, "确定"));
			}
			break;
		case $$.FloatWindow.enumBoxButtons.YesNoCancel:
			if (undefined != obj.m_jsonButtonsCallback) {
				$(domDiv).append(
						createButton(obj, "是",
								obj.m_jsonButtonsCallback[0].callback));
				$(domDiv).append(
						createButton(obj, "否",
								obj.m_jsonButtonsCallback[1].callback));
				$(domDiv).append(
						createButton(obj, "取消",
								obj.m_jsonButtonsCallback[2].callback));
			} else {
				$(domDiv).append(createButton(obj, "确定"));
			}
			break;
		case $$.FloatWindow.enumBoxButtons.OKCancel:
			if (undefined != obj.m_jsonButtonsCallback) {
				$(domDiv).append(
						createButton(obj, "确定",
								obj.m_jsonButtonsCallback[0].callback));
				$(domDiv).append(
						createButton(obj, "取消",
								obj.m_jsonButtonsCallback[1].callback));
			} else {
				$(domDiv).append(createButton(obj, "确定"));
			}
			break;
		case $$.FloatWindow.enumBoxButtons.RetryCancel:
			if (undefined != obj.m_jsonButtonsCallback) {
				$(domDiv).append(
						createButton(obj, "重试",
								obj.m_jsonButtonsCallback[0].callback));
				$(domDiv).append(
						createButton(obj, "取消",
								obj.m_jsonButtonsCallback[1].callback));
			} else {
				$(domDiv).append(createButton(obj, "确定"));
			}
			break;
		case $$.FloatWindow.enumBoxButtons.AbortRetryIgnore:
			if (undefined != obj.m_jsonButtonsCallback) {
				$(domDiv).append(
						createButton(obj, "中止",
								obj.m_jsonButtonsCallback[0].callback));
				$(domDiv).append(
						createButton(obj, "重试",
								obj.m_jsonButtonsCallback[1].callback));
				$(domDiv).append(
						createButton(obj, "取消",
								obj.m_jsonButtonsCallback[2].callback));
			} else {
				$(domDiv).append(createButton(obj, "确定"));
			}
			break;
		case $$.FloatWindow.enumBoxButtons.SubmitOkCancel:
			if (undefined != obj.m_jsonButtonsCallback) {
				$(domDiv).append(
						createButton(obj, "提交",
								obj.m_jsonButtonsCallback[0].callback));
				$(domDiv).append(
						createButton(obj, "确定",
								obj.m_jsonButtonsCallback[1].callback));
				$(domDiv).append(
						createButton(obj, "取消",
								obj.m_jsonButtonsCallback[2].callback));
			} else {
				$(domDiv).append(createButton(obj, "确定"));
			}
			break;
		case $$.FloatWindow.enumBoxButtons.SaveCancel:
			if (undefined != obj.m_jsonButtonsCallback) {
				$(domDiv).append(
						createButton(obj, "保存",
								obj.m_jsonButtonsCallback[0].callback));
				$(domDiv).append(
						createButton(obj, "取消",
								obj.m_jsonButtonsCallback[1].callback));
			} else {
				$(domDiv).append(createButton(obj, "确定"));
			}
			break;
		case $$.FloatWindow.enumBoxButtons.None:
			break;
		default:
			if (obj.m_enumBoxType == $$.FloatWindow.enumBoxType.Message) {
				if (undefined != obj.m_jsonButtonsCallback) {
					$(domDiv).append(
							createButton(obj, "确定",
									obj.m_jsonButtonsCallback[0].callback));
				} else {
					$(domDiv).append(createButton(obj, "确定"));
				}
			} else {
				if (undefined != obj.m_jsonButtonsCallback) {
					$(domDiv).append(
							createButton(obj, "确定",
									obj.m_jsonButtonsCallback[0].callback));
				} else {
					$(domDiv).append(createButton(obj, "确定"));
				}
			}
			break;
		}
	}
	function createButton(obj, pstrText, peventCallback) {
		var strWindowID = obj.m_strPlugName + "ContentBox" + (obj.m_iIndex);
		if (undefined != obj.m_domBox) {
			strWindowID = obj.m_domBox.strWindowID;
		}
		var domA = document.createElement("a");
		$(domA).attr("href", "javascript:void(0);");
		$(domA).text(pstrText);
		if (undefined != peventCallback) {
			$(domA).click(function() {
				if (peventCallback() != false && obj.status==1) {
					obj.hide(strWindowID);
				}
			});
		} else {
			$(domA).click(function() {
				obj.hide(strWindowID);
			});
		}
		return domA;
	}
	function createButtons(obj, domDiv) {
		var strWindowID = obj.m_domBox.strWindowID;
		for ( var x = 0; x < obj.m_jsonCustomButtons.length; x++) {
			if (undefined != obj.m_jsonCustomButtons[x]) {
				var domA = document.createElement("a");
				$(domA).attr("href", "javascript:void(0);");
				$(domA).text(obj.m_jsonCustomButtons[x].text);
				$(domA).click(obj.m_jsonCustomButtons[x].callback);
				if (undefined == obj.m_jsonCustomButtons[x].hide
						|| true == obj.m_jsonCustomButtons[x].hide) {
					$(domA).click(function() {
						/*obj.hide(strWindowID);*/
					});
				}
				$(domDiv).append(domA);
			}
		}
	}
	function centerScreen(obj) {
		try {
			var sH = $(document.body).height();
			var sW = $(document.body).width();

			var ch = sH / 2;
			var cw = sW / 2;
			if (((sW - $(obj).width()) / 2) > 0)
				if (undefined != top.menuFrame) {
					moveX = (sW - $(obj).width()) / 2
							+ document.body.scrollLeft
							- ($(top.menuFrame.document.body).width() / 2);
				} else {
					moveX = (sW - $(obj).width()) / 2
							+ document.body.scrollLeft;
				}
			else
				moveX = 0;
			if (((sH - $(obj).height()) / 2) > 0)
				if (undefined != top.logoFrame) {
					moveY = (sH - $(obj).height()) / 2
							+ document.body.scrollTop
							- ($(top.logoFrame.document.body).height() / 2);
				} else {
					moveY = (sH - $(obj).height()) / 2
							+ document.body.scrollTop;
				}
			else
				moveY = 0;
			$(obj).css("left", moveX);
			$(obj).css("top", moveY);
			//$(obj).css("z-index", $(obj).css("z-index") + 1);
		} catch (e) {

		}
	}
	//移动窗体的方法
	function moveDown(obj) {
		if (event.srcElement != null && event.srcElement.tagName != "A"
				&& event.srcElement.tagName != "SPAN") {
			$(document).mousemove(function() {
				moveing(obj);
			});
			$(document).mouseup(function() {
				moveUp(obj);
			});
			$(obj).css("cursor", "move");
			var offset = $(obj).offset();
			moveX = event.x - offset.left;
			moveY = event.y - offset.top;
		}
	}
	function moveing(obj) {
		if (obj != null) {
			if((event.x - moveX)<=0){
				$(obj).css("left", 0);
			}else if((event.x - moveX)>=($(window).width()-obj.offsetWidth-30)){
				$(obj).css("left", ($(window).width()-obj.offsetWidth-30));
			}else{
				$(obj).css("left", event.x - moveX);
			}
			
			if((event.y - moveY)<=0){
				$(obj).css("top", 0);
			}else if((event.y - moveY)>=($(window).height()-obj.offsetHeight)){
				$(obj).css("top", ($(window).height()-obj.offsetHeight));
			}else{
				$(obj).css("top", event.y - moveY);
			}
		}
	}
	function moveUp(obj) {
		if (obj != null) {
			$(document).unbind("mousemove");
			$(document).unbind("mouseup");
			$(obj).css("cursor", "");
		}
	}
	function setIcon(obj, penumIcon) {
		var domMessageBox = $(obj.m_domBox).find(".ftBoxMessage");
		domMessageBox.removeClass();
		domMessageBox.addClass("ftBoxMessage");
		domMessageBox.addClass(penumIcon);
	}
	function hotkeys(obj) {
		/*if (BGDiv && event.keyCode == 32)
		{
		event.returnValue = false;
		}
		else*/
		var strWindowID = obj.m_domBox.strWindowID;
		if (obj.m_enumBoxType == $$.FloatWindow.enumBoxType.Message
				&& true == obj.m_bShow && event.keyCode == 13
				&& event.srcElement.tagName != "TEXTAREA") {//obj.m_enumMode == $$.FloatWindow.enumBoxMode.ModeDialog && 
			var objAButton = $(obj.m_domBox).find(".ftButton > a");
			if (objAButton.length > 0) {
				objAButton[0].click();
			}
		} else if (true == obj.m_bShow && event.keyCode == 27) {//obj.m_enumMode == $$.FloatWindow.enumBoxMode.ModeDialog && 
			obj.hide(strWindowID);
		} else if (event.ctrlKey && event.altKey && event.keyCode == 69
				&& true == obj.m_bShow) {
			obj.centerScreen();
		}
	}
	function getWindowSize() {
		return {
			width : $(document.body).width() - 15,
			height : $(document.body).height() - 76
		}
	}
	function getWindowNoticeLocation(jsWindowSize) {
		return {
			left : $(document.body).width() - jsWindowSize.width - 20,
			top : $(document.body).height() - jsWindowSize.height - 82
		}
	}
	function getWindowCenterLocation(jsWindowSize, obj) {
		if (undefined == jsWindowSize) {
			return {
				left : ($(document.body).width() - 260) / 2,
				top : ($(document.body).height() - 156) / 2
			}
		} else {
			return {
				left : ($(document.body).width() - jsWindowSize.width - 20) / 2
						+ (obj.m_alShowWindows.length * 5),
				top : ($(document.body).height() - jsWindowSize.height - 76)
						/ 2 + (obj.m_alShowWindows.length * 5)
			}
		}
	}
	function zoom(pdomBox, pdomContent, jsLocation, jsWindowSize, pfnCallback) {
		$(pdomBox).animate( {
			left : jsLocation.left,
			// 2015年10月15日16:56:44  liuyaozheng 弹出成位置设置
			top : jsLocation.top
			/*top:"150px"*/
		}, 200, "swing", pfnCallback);
		$(pdomContent).animate( {
			width : jsWindowSize.width,
			height : jsWindowSize.height
		}, 200, "swing");
	}
	function autoHide(obj, strWindowID) {
		if (undefined != obj.m_thAutoHide) {
			clearTimeout(obj.m_thAutoHide);
		}
		obj.m_thAutoHide = setTimeout(function() {
			obj.hide(strWindowID)
		}, 10000);
	}
	FloatWindow.prototype = {
		/*initial : function() {
		var _this = this;
		},*/

		/*
		 * 显示对话框
		 * 提示消息内容、窗体标题、图标、默认按钮、自定义按钮、默认按钮自定义回调函数、展示指定ID的窗体、窗体初始大小、窗体缩放回调函数、是否以最大化方式显示、窗体关闭时是否自动销毁
		 */
		show : function(opts, strTitle, enumIcon, enumButton,
				jsonCustomButtons, jsonCallback, strActiveID, jsonWindowSize,
				funZoomCallBack, blMaximize, blDispose) {
			var _this = this;
			var strMessage = "";
			var FlowWindowBox = _this.m_domBox;
			if (typeof (opts) == "object") {
				for (i in opts) {
					if (i.charAt(0) != '_') {
						eval('' + i + ' = opts[\'' + i + '\'];');
					}
				}
			} else {
				strMessage = opts;
			}
			if (undefined != strActiveID && "" != strActiveID) {
				if (undefined != _this.m_alWindows[strActiveID]) {
					_this.m_domBox = _this.m_alWindows[strActiveID];
					/*$(_this.m_domBox).css("z-index",_this.m_izIndex + 1 + _this.m_iIndex);*/
					$(_this.m_domBox).css("z-index",1000);
				}
			}
			if (_this.m_enumBoxType == $$.FloatWindow.enumBoxType.Message) {
				if (undefined == enumIcon) {
					enumIcon = _this.defaultBoxIcon;
				}
				strTitle = _this.m_strMessageTitle[enumIcon];
				//延迟3秒后关闭消息提示框
				/*setTimeout(function() {
					$(FlowWindowBox).hide();
				}, 3000);*/
			}

			$(_this.m_domBox).find(".ftBoxMessage").html(strMessage);
			if (strTitle != undefined && strTitle != "") {
				$(_this.m_domBox).find(".fwTitle").text(strTitle);
			} else {
				$(_this.m_domBox).find(".fwTitle").text(_this.defaultTitle);
			}
			if (undefined != enumIcon) {
				if (enumIcon != $$.FloatWindow.enumBoxIcon.None) {
					setIcon(_this, enumIcon);
				}
			} else {
				setIcon(_this, _this.defaultBoxIcon);
			}
			if (undefined != jsonCallback) {
				_this.m_jsonButtonsCallback = jsonCallback;
			} else {
				_this.m_jsonButtonsCallback = undefined;
			}
			if (undefined != enumButton) {
				_this.m_enumBoxButtons = enumButton;
			} else {
				_this.m_enumBoxButtons = _this.defaultBoxButtons;
			}
			if (undefined != jsonCustomButtons && 0 < jsonCustomButtons.length) {
				_this.m_jsonCustomButtons = jsonCustomButtons;
				//customButtons(_this, );
			} else {
				_this.m_jsonCustomButtons = undefined;
				//customButtons(_this);
			}
			customButtons(_this);
			if (_this.m_enumBoxType != $$.FloatWindow.enumBoxType.Notice) {
				centerScreen(_this.m_domBox);
			}

			if (_this.m_enumMode == $$.FloatWindow.enumBoxMode.ModeDialog) {
				$(_this.m_domMask).show();
			}
			var jsonSize = _this.m_jsonSize;
			if (true == blMaximize) {
				jsonSize = getWindowSize();
				if (undefined != jsonWindowSize) {
					_this.m_domBox.jsLocation = getWindowCenterLocation(
							jsonWindowSize, _this);
				} else {
					_this.m_domBox.jsLocation = getWindowCenterLocation(
							_this.m_jsonSize, _this);
				}
			} else if (undefined != jsonWindowSize) {
				jsonWindowSize.width -= 20;
				jsonWindowSize.height -= 76;
				jsonSize = jsonWindowSize;
			}
			if (undefined != jsonWindowSize) {
				_this.m_domBox.jsSize = jsonWindowSize;
			} else {
				_this.m_domBox.jsSize = _this.m_jsonSize;
			}
			if (undefined != funZoomCallBack) {
				_this.m_domBox.ZoomCallBack = funZoomCallBack;
			}
			_this.m_domBox.AutoDispose = blDispose;
			if (_this.m_enumBoxType == $$.FloatWindow.enumBoxType.Handle) {
				$(_this.m_domBox).show();
				zoom(_this.m_domBox, $(_this.m_domBox).find(".ftBoxContent"),
						getWindowCenterLocation(jsonSize, _this), jsonSize,
						_this.m_domBox.ZoomCallBack);
			} else if (_this.m_enumBoxType == $$.FloatWindow.enumBoxType.Notice) {
				$(_this.m_domBox).show();
				zoom(_this.m_domBox, $(_this.m_domBox).find(".ftBoxMessage"),
						getWindowNoticeLocation(jsonSize), jsonSize);
			} else {
				$(_this.m_domBox).show();
			}
			if ($(_this.m_alShowWindows).index(_this.m_domBox) == -1) {
				_this.m_alShowWindows[_this.m_alShowWindows.length] = _this.m_domBox;
			}
			_this.m_bShow = true;
			_this.m_funHotkeys = function() {
				hotkeys(_this);
			}
			setTimeout(function() {
				$(document).keyup(_this.m_funHotkeys);
			}, 100);
			if (_this.m_enumBoxType == $$.FloatWindow.enumBoxType.Notice)
				autoHide(_this, _this.m_domBox.strWindowID);
		},
		hide : function(strWindowID) {
			var _this = this;
			var domBox = this.m_alWindows[strWindowID];
			if (undefined != _this.m_thAutoHide) {
				clearTimeout(_this.m_thAutoHide);
			}
			_this.m_domBox = this.m_alWindows[strWindowID];
			$(document).unbind("keyup", _this.m_funHotkeys);
			_this.m_bShow = false;
			if (_this.m_enumBoxType == $$.FloatWindow.enumBoxType.Handle) {
				zoom(_this.m_domBox, $(_this.m_domBox).find(".ftBoxContent"),
						getWindowCenterLocation(), {
							width : 0,
							height : 0
						}, function() {
							$(domBox).hide();
						});
			} else if (_this.m_enumBoxType == $$.FloatWindow.enumBoxType.Notice) {
				zoom(_this.m_domBox, $(_this.m_domBox).find(".ftBoxMessage"),
						_this.m_domBox.jsLocation, {
							width : 0,
							height : 0
						}, function() {
							$(domBox).hide();
						});
			} else {
				$(_this.m_domBox).hide();
			}
			var iIndex = $(_this.m_alShowWindows).index(_this.m_domBox);
			if (iIndex != -1) {
				_this.m_alShowWindows.splice(iIndex, 1);
				if (_this.m_alShowWindows.length > 0) {
					_this.m_domBox = _this.m_alShowWindows[_this.m_alShowWindows.length - 1];
					setTimeout(function() {
						_this.m_bShow = true;
					}, 100);
				}
			}
			if (_this.m_alShowWindows.length == 0
					&& _this.m_enumMode == $$.FloatWindow.enumBoxMode.ModeDialog) {
				$(_this.m_domMask).hide();
			}
			if (true == domBox.AutoDispose) {
				_this.dispose(strWindowID);
			}
		},
		zoom : function(strWindowID) {
			var _this = this;
			var jsWindowSize = getWindowSize();
			_this.m_domBox = this.m_alWindows[strWindowID];
			var jqTemp = $(_this.m_domBox).find(".ftBoxContent");
			if ($(jqTemp).width() < jsWindowSize.width) {
				_this.m_domBox.jsLocation = {
					left : $(_this.m_domBox).css("left"),
					top : $(_this.m_domBox).css("top")
				}
				zoom(_this.m_domBox, jqTemp, {
					left : 0,
					top : 0
				}, jsWindowSize, _this.m_domBox.ZoomCallBack);
			} else {
				zoom(_this.m_domBox, jqTemp, _this.m_domBox.jsLocation,
						_this.m_domBox.jsSize, _this.m_domBox.ZoomCallBack);
			}

		},
		centerScreen : function() {
			var _this = this;
			centerScreen(_this.m_domBox);
		},
		customButtons : function(pjsonCustomButtons) {
			var _this = this;
			customButtons(_this, pjsonCustomButtons);
		},
		create : function() {
			var _this = this;
			return newWindow(_this);
		},
		dispose : function(strWindowID) {
			var _this = this;
			if (undefined != strWindowID) {
				if (_this.m_alShowWindows[strWindowID] != undefined) {
					_this.hide(strWindowID);
				}
				$(_this.m_alWindows[strWindowID]).remove();
				_this.m_alWindows.splice($(_this.m_alWindows)
						.index(strWindowID), 1);
			} else {
				$(_this.m_domMask).remove();
				$("div[id^='" + _this.m_strPlugName + "']").each(function() {
					$(_this.m_alWindows[this.id]).remove();
				});
				_this.m_alWindows = new Array();
			}
		}
	};
	$$.FloatWindow = {
		New : function(opts) {
			return new FloatWindow($$.FloatWindow.enumBoxType.Handle, opts);
		},
		NewMessage : function(opts) {
			return new FloatWindow($$.FloatWindow.enumBoxType.Message, opts);
		},
		NewNotice : function(opts) {
			return new FloatWindow($$.FloatWindow.enumBoxType.Notice, opts);
		}
	};
	$$.FloatWindow.enumBoxButtons = {
		AbortRetryIgnore : 'AbortRetryIgnore', //消息框包含“中止”、“重试”和“忽略”按钮。
		OK : 'OK', //消息框包含“确定”按钮
		OKCancel : 'OKCancel', //消息框包含“确定”和“取消”按钮。
		RetryCancel : 'RetryCancel', //消息框包含“重试”和“取消”按钮。
		YesNo : 'YesNo', //消息框包含“是”和“否”按钮。
		YesNoCancel : 'YesNoCancel', //消息框包含“是”、“否”和“取消”按钮。
		SubmitOkCancel:'SubmitOkCancel',
		None : 'None'//消息框未包含任何默认按钮。
	};
	$$.FloatWindow.enumBoxIcon = {
		Information : 'Information', //该符号是由一个圆圈及其中的小写字母 i 组成的。
		Error : 'Error', //该符号是由一个红色背景的圆圈及其中的白色X组成的。
		Warning : 'Warning', //该符号是由一个黄色背景的三角形及其中的一个感叹号组成的。
		Question : 'Question', //该符号是由一个圆圈及其中的一个问号组成。
		None : 'None'//消息框未包含符号。
	};
	$$.FloatWindow.enumBoxType = {
		Message : 'Message', //用于消息展示的对话框。
		Handle : 'Handle', //用于业务操作的浮动窗体。
		Notice : 'Notice'//用于右下角弹出的即时提示框。
	};
	$$.FloatWindow.enumBoxMode = {
		ModeDialog : 'ModeDialog', //模式对话框。
		Dialog : 'Dialog'//非模式对话框。
	};
	return FloatWindow;
})($$);

(function($$) {
	function Tab(opts) {
		var _this = this;
		this.m_strContainerID;
		for (i in opts) {
			if (i.charAt(0) != '_') {
				eval('this.' + i + ' = opts[\'' + i + '\'];');
			}
		}
		bindEvent(_this);
	}
	function bindEvent(_this) {
		$("#" + _this.m_strContainerID + " > a").addClass("tab_select");
		$("#" + _this.m_strContainerID + " > a").click(function() {
			_this.select(this);
		});
		$("#" + _this.m_strContainerID + " > span").addClass("tab_select");
		$("#" + _this.m_strContainerID + " > span").click(function() {
			_this.select(this);
		});
	}
	function select(_this, obj) {
		$("#" + _this.m_strContainerID).find(".tab_selected").removeClass(
				"tab_selected");
		$(obj).addClass("tab_selected");
	}
	Tab.prototype = {
		select : function(obj) {
			select(this, obj);
		}
	};
	$$.Tab = {
		New : function(opts) {
			return new Tab(opts);
		}
	};
	return Tab;
})($$);

(function($$) {
	function Busy() {
		this.m_domBusy = create();
	}
	function create() {
		var odiv = document.createElement("DIV");
		document.body.insertBefore(odiv);
		$(odiv).addClass("Busy");
		$(odiv).hide();
		return odiv;
	}
	function show(_this, strContainerID) {
		if (undefined != strContainerID) {
			$("#" + this.strContainerID).css("filter", "alpha(opacity=25)");
		}
		if (undefined != strContainerID) {
			$(_this.m_domBusy).get(0).style.left = $("#" + strContainerID)
					.offset().left
					+ ($("#" + strContainerID).get(0).offsetWidth / 2) - 73;
			$(_this.m_domBusy).get(0).style.top = $("#" + strContainerID)
					.offset().top
					+ ($("#" + strContainerID).get(0).offsetHeight / 2) - 20;
			$(_this.m_domBusy).show();
		} else {
			$(_this.m_domBusy).get(0).style.left = ($(document.body).get(0).clientWidth / 2) - 73;
			$(_this.m_domBusy).get(0).style.top = ($(document.body).get(0).clientHeight / 2) - 20;
			$(_this.m_domBusy).show();
		}
	}
	function hide(_this) {
		$(_this.m_domBusy).hide();
	}
	Busy.prototype = {
		show : function(strContainerID) {
			show(this, strContainerID);
		},
		hide : function() {
			hide(this);
		}
	};
	$$.Busy = {
		New : function() {
			return new Busy();
		}
	};
	return Busy;
})($$);

(function($$) {
	function FloatMenu(penumMenuType, opts) {
		var _this = this;
		this.m_strPlugName;
		for (i in opts) {
			if (i.charAt(0) != '_') {
				eval('this.' + i + ' = opts[\'' + i + '\'];');
			}
		}
		this.m_fnEvent;
		this.m_domFocus;//右键菜单时触发事件的对象
		this.m_blFlag = false;
		this.m_enumMenuType = penumMenuType;
		this.m_domBox = create();
		this.m_domSubBox = create();
		this.m_alMenu = new Array();
	}
	function create(_this) {
		var domDiv, domUl;
		domDiv = document.createElement("div");
		$(document.body).append(domDiv);
		$(domDiv).addClass("floatMenu");
		domUl = document.createElement("ul");
		$(domDiv).append(domUl);
		return domDiv;
	}
	function initMenu(_this, pdomBox, pjsonData, obj) {
		$(pdomBox).find("ul").empty();
		add(_this, pdomBox, pjsonData, obj);
	}
	function add(_this, pdomBox, pjsonData, obj) {
		var domLi;
		var css;
		var blSub = false;
		$(pjsonData)
				.each(
						function() {
							var data = this;
							domLi = document.createElement("li");
							$(pdomBox).find("ul").append(domLi);
							if (data.subMenus != undefined
									&& data.subMenus.length > 0) {
								blSub = true;
								$(domLi).addClass("subMenus");
							} else {
								blSub = false;
							}
							css = [ {
								name : "background-image",
								value : "url(" + this.url + ")"
							} ]
							if (this.enable == false) {
								/*css[css.length] = {
								name : "filter",
								value : "Gray"
								}*/
								css[css.length] = {
									name : "color",
									value : "#A09F9F"
								}
							}
							var domA;
							if (blSub == false) {
								domA = $$
										.createA(
												this.name,
												"",
												function() {
													if (this.enable != false
															&& typeof data.callback == "string") {
														eval(data.callback);
													} else {
														data.callback();
													}
													_this.m_blFlag = false;
													_this.hide();
												}, true, css);
							} else {
								domA = $$.createA(this.name, "", function() {
									_this.m_blFlag = false;
								}, true, css);
								$(domA).mouseover(
										function() {
											_this.show(data.subMenus,
													_this.m_domSubBox, this,
													true)
										});
							}
							if (data.ready != undefined) {
								if (typeof data.ready == "string") {
									eval(data.ready);
								} else {
									data.ready();
								}
							}
							$(domLi).append(domA);
						});
	}
	function clear(_this) {
		$(_this.m_domBox).find("ul").empty();
		$(_this.m_domSubBox).find("ul").empty();
	}
	function zoom(pdomContent, jsWindowSize, pfnCallback) {
		$(pdomContent).stop(true, true);
		$(pdomContent).animate( {
			width : jsWindowSize.width,
			height : jsWindowSize.height
		}, 100, "swing", pfnCallback);
	}
	FloatMenu.prototype = {
		bind : function(pjsonData, obj) {
			var _this = this;
			if (_this.m_enumMenuType == $$.FloatMenu.enumMenuType.ButtonMenu) {
				$(obj).mouseover(function() {
					_this.m_blFlag = true;
					_this.show(pjsonData, _this.m_domBox, this);
				});
				$(obj).mouseout(function() {
					_this.m_blFlag = false;
					setTimeout(function() {
						_this.hide();
					}, 300);
				});
			} else if (_this.m_enumMenuType == $$.FloatMenu.enumMenuType.RightMenu) {
				$(obj).bind("mousedown", function(e) {
					if (e.which == 3) {
						_this.m_domFocus = e.srcElement;
						_this.hide();
						//$(document).unbind("click", _this.m_fnEvent);
						_this.m_blFlag = true;
						_this.show(pjsonData, _this.m_domBox, this);
						_this.m_fnEvent = function(e) {
							if (e.srcElement != obj) {
								_this.m_blFlag = false;
								_this.hide();
							}
						}
						setTimeout(function() {
							$(document).bind("click", _this.m_fnEvent)
						}, 100);
					}
				});

			} //[_this.m_domBox, _this.m_domSubBox]
			$( [ _this.m_domBox, _this.m_domSubBox ]).mouseover(function() {
				_this.m_blFlag = true;

			});
			$( [ _this.m_domBox, _this.m_domSubBox ]).mouseout(function() {
				_this.m_blFlag = false;
				setTimeout(function() {
					_this.hide();
				}, 500);
			});
		},
		show : function(pjsonData, pdomBox, obj, pblSub) {
			var _this = this;
			if (pjsonData.length != 0) {
				initMenu(_this, pdomBox, pjsonData, obj);
			}
			//二级菜单显示
		if (pblSub == true) {
			if ($(obj).offset().left + 150 + 150 + 9 < $(document).width()) {
				//if ($(obj).offset().left + $(_this.m_domBox).width() + $(pdomBox).width() + 9 < $(document).width()) {
				$(pdomBox).css("left",
						$(obj).offset().left + $(_this.m_domBox).width() + 3);
			} else {
				$(pdomBox).css("left", $(obj).offset().left - 150 - 6);
			}
			if ($(obj).offset().top + $(pdomBox).height() + 3 < $(document)
					.height()) {
				$(pdomBox).css("top", $(obj).offset().top - 3);
			} else {
				$(pdomBox).css(
						"top",
						$(obj).offset().top - $(pdomBox).height()
								+ $(obj).height());
			}
		} else {
			if (_this.m_enumMenuType == $$.FloatMenu.enumMenuType.ButtonMenu) {
				$(pdomBox).css("left", $(obj).offset().left);
				if (($(obj).offset().top + $(obj).height())
						+ $(pdomBox).height() >= $(
						"#TabArea").height()) {
					$(pdomBox).css("top",
							$(obj).offset().top - $(pdomBox).height());
				} else {
					$(pdomBox)
							.css("top", $(obj).offset().top + $(obj).height());
				}
			} else if (_this.m_enumMenuType == $$.FloatMenu.enumMenuType.RightMenu) {
				if (event.x + 150 < document.body.clientWidth) {
					$(pdomBox).css("left", event.x);
				} else {
					$(pdomBox).css("left", event.x - 150);
				}
				if (event.y + $(pdomBox).height() < document.body.clientHeight) {
					$(pdomBox).css("top", event.y);
				} else {
					$(pdomBox).css("top", event.y - $(pdomBox).height());
				}
			}
		}
		$(pdomBox).show();
		zoom(pdomBox, {
			width : 150,
			height : $(pdomBox).find("ul").height()
		});
	},
	hide : function() {
		var _this = this;
		if (_this.m_enumMenuType == $$.FloatMenu.enumMenuType.RightMenu && _this.m_fnEvent!=undefined) {
			$(document).unbind("click", _this.m_fnEvent);
		}
		if (_this.m_blFlag == false) {
			zoom(_this.m_domBox, {
				width : 0,
				height : 0
			}, function() {
				$(_this.m_domBox).hide();
			});
			zoom(_this.m_domSubBox, {
				width : 0,
				height : 0
			}, function() {
				$(_this.m_domSubBox).hide();
			});
		}
	},
	addItem : function(pjsonData) {
		var _this = this;
		add(_this, pjsonData);
	},
	clear : function() {
		var _this = this;
		clear(_this);
	}
	};
	$$.FloatMenu = {
		NewFloat : function(opts) {
			return new FloatMenu($$.FloatMenu.enumMenuType.FloatMenu, opts);
		},
		NewButton : function(opts) {
			return new FloatMenu($$.FloatMenu.enumMenuType.ButtonMenu, opts);
		},
		NewRightMenu : function(opts) {
			return new FloatMenu($$.FloatMenu.enumMenuType.RightMenu, opts);
		}
	};
	$$.FloatMenu.enumMenuType = {
		FloatMenu : 'FloatMenu', //浮动菜单。
		ButtonMenu : 'ButtonMenu', //按钮菜单。
		RightMenu : 'RightMenu' //右键菜单
	};
	return FloatMenu;
})($$)