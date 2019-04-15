var PARAM={}; //前一个页面传递的参数对象
var MAIN_PAGE_WINDOW = {};//前一个页面对象
var ATYXh_ = "";//序号

var fileArray = [];
var textObjArray = [];
// 文件分割上传的间隙大小 10M
var fileSplitSize = 1024 * 1024 * 10;
var picTypeObj={};
/**
 * 上传图片js
 */
$(function() {
	PARAM= GetParamByRequest();
	ATYXh_ = PARAM.atyXh;
	var h= $("#up_actives").height();
	setIframeHeight2(PARAM.tabId,h);
	// 时间初始化
	initDate();
	// 初始化上传
	initFileUpload();
	// 关键字初始化
	initKeywordsTips();
	// 输入改变
	initInputChange();
	// 选择模板
	selectText();
	// 查询临时图片信息
	findPicsBySession();
	// 选择模板触发时间
	$("#selectText").change(function() {
		var fileId = $("#UploadImages").find(".active").attr("fileId");
		var textId = $("#selectText").val();
		textToData(fileId,textId);
	});
})

/**
 * 初始化上传
 */
function initFileUpload() {
	var deleteDom = null;
	$("#UploadFile").on("change", function() {
		var files = this.files;
		console.log(textObjArray);
		console.log(files);
		console.log("====");
		if(textObjArray.length+files.length>4){
			AlertBox.alert("选择的图片数量大于四张，请重新选择！");
			return;
		}
		$.each(files, function(key, val) {
			var file = val;
			var name = file.name;
			var size = file.size, type = file.type || "", 
			id = (file.lastModified + "").replace(/\W/g, '') + size + type.replace(/\W/g, '') + name.replace(/\s/g,"");;
			if (size > 1024 * 1024 * 1024 * 2) {// 大于2G
				AlertBox.alert("文件过大！");
				return;
			} else if (fileArray.indexOf(id) != -1) {
				AlertBox.alert("文件已存在！");
				return;
			} else {
				fileArray.push(id);
				fileArray[id] = file;
				textObjArray.push(id);
				var obj = {};
				obj.picXh = guid();
				obj.picFiletype=name.substring(name.lastIndexOf(".")+1).toUpperCase();
				obj.picFilesize=size;
				obj.atyXh = ATYXh_ ;
				obj.picMj=1;
				textObjArray[id] = obj;
			}
			// 图片添加显示
			var dealPic = html5Reader(file);
			var item = $('<li class="pic_item picn" fileId=' + id + '>' + '<div class="upload_img"><div class="ed_sel_ok"><i class="ico ico20"></i></div></div><img class="ed_sel_del" src="../../img/ico/close.png" />' + '</li>');
			item.find(".upload_img").append(dealPic);
			$("#UploadFile").parents(".up_adimg_bg").before(item);
		});
		limitBehaviour();
	})

	// 点击触发事件
	$("#UploadImages").on("click", ".pic_item", function() {
		if (!$(this).hasClass("active")) {
			getData(this);
		}
	})
	// 删除图片
	$("#UploadImages").on("click", ".ed_sel_del", function() {
		deleteDom = $(this).parents(".picn");
		AlertBox.confirm('<div style="padding: 0px 80px 20px;">确认删除图片？</div>', "", sureDelete, deleteDom);

	})
}

// 删除图片
function sureDelete(deleteDom) {
	if (deleteDom) {
		var fileId = deleteDom.attr('fileId');
		var fileIdx = deleteDom.attr('fileIdx');
		if (fileIdx != undefined && fileIdx != "") {
			$.ajax({
				url : "/sjcq/temporaryPic/deleteById",
				dataType : "json",
				async : true,
				data : {
					id : fileIdx
				},
				type : "post",
				success : function(data) {
					if (data) {
						AlertBox.alert("删除成功！");
					}
				},
				error : function() {
				}
			});
		} else {
			fileArray.splice(fileArray.indexOf(fileId), 1);
		}
		textObjArray.splice(textObjArray.indexOf(fileId), 1);
		deleteDom.remove();
		deleteDom = null;
		limitBehaviour();
		AlertBox.hide();
	}
}

/**
 * 限制图片数量为4
 */
function limitBehaviour() {
	var items = $("#UploadImages").children(".pic_item");
	if (items.length == 0) {
		resetData();
	}
	if (items.length >= 4) {
		$(".up_adimg_bg").hide();
	} else {
		$(".up_adimg_bg").show();
	}
	$.each(items, function(k, v) {
		if (k == 0)
			getData(this);
		if (k > 3)
			$(this).remove();
	})
}

/**
 * 获取当前图片的信息
 * 
 * @param val
 */
function getData(val) {
	$("#selectText").val("");
	if (!$(val).hasClass("active")) {
		$(val).addClass("active").siblings("li.pic_item").removeClass("active");
	}
	var fileId = $(val).attr("fileId");
	var fileIdx = $(val).attr("fileIdx");
	if (textObjArray[fileId] != undefined && textObjArray[fileId] != null) {
		var obj = textObjArray[fileId];
		objToData(obj);
		// 左侧栏显示数据
		var tempBox = $("#TextTemplate");
		if (fileIdx != undefined && fileIdx != "") {
			var html = "";
			html += obj.picMc ? ("<p>标题：" + obj.picMc + "</p>") : "";
			html += obj.picZsm ? ("<p>主说明：" + obj.picZsm + "</p>") : "";
			html += obj.picFsm ? ("<p>分说明：" + obj.picFsm + "</p>") : "";
			html += obj.picDd ? ("<p>图片地点：" + obj.picDd + "</p>") : "";
			html += obj.picSyz ? ("<p>摄影作者：" + obj.picSyz + "</p>") : "";
			html += obj.picSysj != null ? ("<p>拍摄时间：" + dateFtt("yyyy-MM-dd", new Date(obj.picSysj)) + "</p>") : "";
			if (obj.typeOne != null && obj.typeOne != "") {
				html += "<p>图片分类：" + obj.typeOne + "  ";
				html += obj.typeTwo != null ? obj.typeTwo + "  " : "";
				html += obj.typeThree != null ? obj.typeThree + "  " : "";
				html += obj.typeFour != null ? obj.typeFour + "  " : "";
				html += obj.typeFive != null ? obj.typeFive + "  " : "";
				html += "</p>";
			}
			var picMj = obj.picMj == 1 ? "公开" : "非公开";
			html += obj.picMj ? ("<p>图片是否公开：" + picMj + "</p>") : "";
			var picType = obj.picType == 0 ? "横幅" : "竖幅"
			html += obj.picType ? ("<p>布局类型：" + picType + "</p>") : "";
			html += obj.picJg ? ("<p>价格："+obj.picJg+"元</p>"):"";
			var arr = obj.picGjz.split("@");
			var html1 = '';
			for (var i = 0; i < arr.length; i++) {
				if (arr[i].trim().length > 0) {
					html1 += arr[i] + " ";
				}
			}
			html += obj.picGjz ? ("<p>关键字：" + html1 + "</p>") : "";
			if (html) {
				tempBox.show();
			} else {
				tempBox.hide();
			}
			tempBox.html(html);
		} else {
			tempBox.empty();
			tempBox.hide();
		}
	}
	initTextareaTip();
}

/**
 * 界面赋值
 * 
 * @param obj
 */
function objToData(obj) {
	$("#picTypesSel").empty();
	$("#Title").val(obj.picMc);
	$("#MainExplain").val(obj.picZsm);
	$("#MinorExplain").val(obj.picFsm);
	$("#Adress").val(obj.picDd);
	$("#Author").val(obj.picSyz);
	$("#CreateTime").val(obj.picSysj != null ? dateFtt("yyyy-MM-dd", new Date(obj.picSysj)) : "");
	$("#contentUploadPicSort .img_sel").remove();
	//加载选中图片分类
	picSortLoad(0);
	if (obj.typeOne != null && obj.typeOne != "") {
		var sortpxh=$(".img_sel[data-level='1'] .sct option:contains('"+obj.typeOne+"')").val(); 
		$(".img_sel[data-level='1'] .sct").val(sortpxh);
		if (obj.typeTwo != null && obj.typeTwo != "") {
			picSortLoad(sortpxh);
		}
	}
	if (obj.typeTwo != null && obj.typeTwo != "") {
		var sortpxh=$(".img_sel[data-level='2'] .sct option:contains('"+obj.typeTwo+"')").val(); 
		$(".img_sel[data-level='2'] .sct").val(sortpxh);
		if (obj.typeThree != null && obj.typeThree != "") {
			picSortLoad(sortpxh);
		}
	}
	if (obj.typeThree != null && obj.typeThree != "") {
		var sortpxh=$(".img_sel[data-level='3'] .sct option:contains('"+obj.typeThree+"')").val(); 
		$(".img_sel[data-level='3'] .sct").val(sortpxh);
		if (obj.typeFour != null && obj.typeFour != "") {
			picSortLoad(sortpxh);
		}
	}
	if (obj.typeFour != null && obj.typeFour != "") {
		var sortpxh=$(".img_sel[data-level='4'] .sct option:contains('"+obj.typeFour+"')").val(); 
		$(".img_sel[data-level='4'] .sct").val(sortpxh);
		if (obj.typeFive != null && obj.typeFive != "") {
			picSortLoad(sortpxh);
		}
	}
	if (obj.typeFive != null && obj.typeFive != "") {
		var sortpxh=$(".img_sel[data-level='5'] .sct option:contains('"+obj.typeFive+"')").val(); 
		$(".img_sel[data-level='5'] .sct").val(sortpxh);
	}
	$("#picMjSel").val(obj.picMj);
	$("#picTypeSel").val(obj.picType);
	$("#picJg").val(obj.picJg);
	$("#KeywordTips").empty();
	if(obj.picGjz!=undefined && obj.picGjz!=""){
		var arr = obj.picGjz.split("@");
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].trim().length > 0) {
				$("#KeywordTips").append('<a>' + arr[i] + '<i class="ico ico17"></i></a>');
			}
		}
	}
}

/**
 * html5预览图片方法
 */
function html5Reader(file) {
	var pic = document.createElement("img");
	var reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = function() {
		pic.src = this.result;
	}
	return pic;
}

/**
 * 初始化input输入框事件
 */
function initInputChange() {
	$("#Title").blur(templateDeal);
	$("#MainExplain").keyup(templateDeal);
	$("#MinorExplain").keyup(templateDeal);
	$("#Adress").blur(templateDeal);
	$("#Author").blur(templateDeal);
	$("#CreateTime").change(templateDeal);
	$("#picMjSel .sct").change(templateDeal);
	$("#picTypeSel").change(templateDeal);
	$("#picJg").blur(templateDeal);
	$("#Keywords").keyup(templateDeal);
}

/**
 * 文字模板动态拼接
 */
function templateDeal() {
	var fileId = $("#UploadImages").find(".active").attr("fileId");
	var obj = {};
	if (textObjArray[fileId] != undefined && textObjArray[fileId] != null) {
		obj = textObjArray[fileId];
	}
	obj.picMc = $("#Title").val();
	obj.picZsm = $("#MainExplain").val();
	obj.picFsm = $("#MinorExplain").val();
	obj.picDd = $("#Adress").val();
	obj.picSyz = $("#Author").val();
	obj.picSysj = $("#CreateTime").val();
	obj.typeOne="";
	obj.typeTwo="";
	obj.typeFive="";
	obj.typeThree="";
	obj.typeFour="";
	var contentUploadPicSort= [];
	console.log(textObjArray);
	$.each($("#picTypesSel").find(".sct"),function(index,item){
		var level=$(item).parent().attr("data-level");
		var sortName=$(item).find("option:selected").text();
		if(sortName!='选择分类'){			
			if(level==1){
				obj.typeOne=sortName;
			}
			if(level==2){
				obj.typeTwo=sortName;
			}
			if(level==3){
				obj.typeThree=sortName;
			}
			if(level==4){
				obj.typeFour=sortName;
			}
			if(level==5){
				obj.typeFive=sortName;
			}
		}
	});
	obj.contentUploadPicSort = contentUploadPicSort;
	obj.picMj = $("#picMjSel").val();
	obj.picType = $("#picTypeSel").val();
	obj.picJg=$("#picJg").val();
	var picGjz = new Array();
	$("#KeywordTips a").each(function() {
		picGjz.push($(this).text());
	});
	obj.picGjz = picGjz.join("@");
	textObjArray[fileId] = obj;
	initTextareaTip();
}

/**
 * 绑定关键词添加
 */
function initKeywordsTips() {
	var cnt = false;
	$("#Keywords").on("keyup", function(e) {
		if (e.keyCode == 32 && $(this).val()) {
			if(cnt){
				if($(this).val().trim().length>0){
					$("#KeywordTips").append('<a>' + $(this).val() + '<i class="ico ico17"></i></a>');
					$(this).val("");
					templateDeal();
				}
			}
			cnt=!cnt;
		}
	})
	$("#KeywordTips").on("click", ".ico", function() {
		$(this).parent("a").remove();
		templateDeal();
	})
}

/**
 * 保存修改，保存临时图片表
 */
function saveEditPic() {
	AlertBox.alertNoClose('<img src="../../img/loading.gif"><p>图片上传中……</p>');
	// 保存数据
	var listData = [];
	for (var i = 0; i < textObjArray.length; i++) {
		var key = textObjArray[i];
		var picMc = textObjArray[key].picMc;
		if (picMc == undefined || picMc.trim().length == 0) {
			AlertBox.revert();
			AlertBox.alert("未完成全部图片标题设置！");
			return;
		}
		listData.push(textObjArray[key]);
	}
	$("#savePic").attr("onclick", "");
	$("#savePic").css("background", "#c0c1c0");
	// 上传图片
	funFileUpload(fileArray[0]);
	$.ajax({
		url : "/sjcq/temporaryPic/addActiveTempPic",
		dataType : "json",
		async : false,
		data : JSON.stringify(listData),
		contentType : "application/json;charset=UTF-8",
		type : "post",
		success : function(data) {
			AlertBox.hide();
			AlertBox.revert();
			if (data.status) {
				textObjArray = [];
				AlertBox.alert("保存修改成功！");
				AlertBox.onHide(function(){
					$('html').animate( {scrollTop: 0}, 500);
				});
			} else {
				AlertBox.alert('保存修改失败，请确认保存修改信息！');
			}
			$("#savePic").attr("onclick", "saveEditPic()");
			$("#savePic").css("background", "#d53638");
			findPicsBySession();
		},
		error : function() {

		}
	});

}

/**
 * 存为模板
 */
function saveTempText(){
	var html='';
	html+='<div style="padding: 25px;" >'  
		+ '<div style="width:500px;text-align:left;"><p>模板名称：</p></div>'
		+ '<div style="width:500px;text-align:left;padding-top:12px;">'
		+ '<input placeholder="请输入模板名称" class="text" style="width:98%;padding: 1%;border:1px solid #ddd" id="textName">'
		+ '</div>'
		+ "</div>";
	AlertBox.confirmIs(html,'存为模板', 
			function(){
				AlertBox.hide();
				var fileId = $("#UploadImages").find(".active").attr("fileId");
				var obj = {};
				if (textObjArray[fileId] != undefined && textObjArray[fileId] != null) {
					obj = textObjArray[fileId];
				}
				var textName=$("#textName").val();
				var newObj={};
				console.log(obj);
				newObj.name=textName;
				newObj.title=obj.picMc;
				newObj.mainRemark=obj.picZsm;
				newObj.secondRemark=obj.picFsm;
				newObj.picDd=obj.picDd;
				newObj.picSyz=obj.picSyz;
				if(obj.picSysj.trim().length!=0){
					newObj.picPssj=new Date(obj.picSysj);
				}
				newObj.picMj=obj.picMj;
				newObj.picType=obj.picType;
				newObj.picGjz=obj.picGjz;
				newObj.typeOne = obj.typeOne;
				newObj.typeTwo = obj.typeTwo;
				newObj.typeThree = obj.typeThree;
				newObj.typeFour = obj.typeFour;
				newObj.typeFive = obj.typeFive;
				newObj.picJg=obj.picJg;
				newObj.picGjz = obj.picGjz;
				$.ajax({
					url : "/sjcq/textTemplate/managerAdd", 
					dataType : "json", 
					async : true,
					data : newObj,
					type : "post",
					success : function(data) {
						if(data.resultStatus){
							AlertBox.alert("保存成功！");
							selectText();
						}else{
							AlertBox.alert("保存失败，请稍后重试！");
						}
					},
					error : function() {
						AlertBox.alert("系统错误！");
					}
				});
			},
			function(){
				AlertBox.hide();
			},{sureText:"保存",closeText:"取消"})
}

/**
 * 获取当前用户的临时上传列表
 */
function findPicsBySession() {
	$.ajax({
		url : "/sjcq/temporaryPic/loadTempPicByAtyXh",
		dataType : "json",
		async : true,
		data : {
			atyXh:ATYXh_
		},
		type : "post",
		success : function(data) {
			var items = $("#UploadImages").children(".pic_item");
			$.each(items, function(k, v) {
				$(this).remove();
			})
			if(data!=null && data.length>0){
				AlertBox.confirmIs(
				'<div style="padding: 0px 80px 20px;">有'+data.length+'张图片未上传，是否选择继续上传？</div>',null, 
				function(){
					AlertBox.hide();
					$.each(data, function(key, val) {
						var item = $('<li class="pic_item picn" fileId=' + val.picXh + ' fileIdx="' + val.id + '">' + '<div class="upload_img"><div class="ed_sel_ok"><i class="ico ico20"></i></div></div><img class="ed_sel_del" src="../../img/ico/close.png" />' + '</li>');
						item.find(".upload_img").append('<img src="' + PICURI+ val.picYtlj + '" />');
						$("#UploadFile").parents(".up_adimg_bg").before(item);
						textObjArray.push(val.picXh);
						textObjArray[val.picXh] = val;
					});
					limitBehaviour();
					$(".up_img_btn").show();
				},
				function(){
					AlertBox.hide();
					textObjArray=[];
					$.ajax({
						url : "/sjcq/temporaryPic/deleteTempPicByAtyXh",
						dataType : "json",
						async : true,
						data : {
							atyXh:ATYXh_
						},
						type : "post",
						success : function(data) {
							
						},
						error : function() {
						}
					});
					
				},{sureText:"是",closeText:"否"})
			}else{
				picSortLoad(0);
			}
			
		},
		error : function() {

		}
	});
}

/**
 * 上传文件--临时文件上传tempPic至pic
 */
function saveToUpload() {
	AlertBox.alertNoClose('<img src="../../img/loading.gif"><p>图片上传中……</p>');
	$("#saveToUpload").attr("onclick", "");
	$("#saveToUpload").css("background", "#c0c1c0");
	$.ajax({
		url : "/sjcq/photoPic/addActivePics",
		dataType : "json",
		async : true,
		data : {
			atyXh:ATYXh_
		},
		type : "post",
		success : function(data) {
			AlertBox.hide();
			AlertBox.revert();
			if (data.resultStatus) {
				AlertBox.confirm('<div style="padding: 0px 80px 20px;">' + data.resultInfo + '</div>', "", reloadThis, "");
			}
		},
		error : function(data) {
			AlertBox.hide();
			AlertBox.revert();
			AlertBox.alert("系统异常！");
		}
	});
}

/**
 * 重新加载当前页
 */
function reloadThis() {
	window.location.reload();
	AlertBox.hide();
}

/**
 * 重置数据，置空
 */
function resetData() {
	$("#TextTemplate").empty();
	$("#TextTemplate").hide();
	$(".up_img_btn").hide();
	$("#Title").val("");
	$("#MainExplain").val("");
	$("#MinorExplain").val("");
	$("#Adress").val("");
	$("#Author").val("");
	$("#CreateTime").val("");
	$("#picType1").val("");
	$("#picMjSel").val();
	$("#picTypeSel").val();
	$("#KeywordTips").empty();
	picSortLoad(0);//加载初始图片分类
}

/**
 * 用于生成uuid
 * 
 * @returns
 */
function S4() {
	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
/**
 * 生成uuid
 * 
 * @returns {String}
 */
function guid() {
	return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

/**
 * 单文件上传
 */
var funFileUpload = function(fileid, onsuccess, onerror, onpause) {
	var file = fileArray[fileid], now = performance.now();
	if (!fileid || !file)
		return;
	onsuccess = onsuccess || function() {
		funFileUpload(fileArray[0]);
	};

	onerror = onerror || function() {
		funFileUpload(fileArray[fileArray.indexOf(fileid) + 1]);
	};
	onpause = onpause || function() {
		funFileUpload(fileArray[fileArray.indexOf(fileid) + 1]);
	};
	if (file.flagPause == true) {
		onpause.call(fileid);
		return;
	}
	// objStateElement.wait(fileid);
	// 文件分割上传
	// 文件大小和分割起点
	// 注释的是本地存储实现
	var size = file.size, start = localStorage[fileid] * 1 || 0;
	// start = $("filelist_" + fileid).filesize;
	if (size == start) {
		// 已经传过了
		fileArray.shift();
		if (delete fileArray[fileid])
		// objStateElement.success(fileid, now);
		// 回调
		onsuccess.call(fileid, {});
		localStorage.clear();
		return;
	}

	var funFileSize = function() {
		if (file.flagPause == true) {
			onpause.call(fileid);
			return;
		}
		var data = new FormData();
		var picXh = textObjArray[fileid].picXh;
		var name = file.name;
		var fileType = name.substring(name.lastIndexOf(".") + 1).toLowerCase();
		var fileName = picXh + "." + fileType
		data.append("fileName", encodeURIComponent(fileName));
		data.append("fileid", fileid);
		data.append("myFile", file.slice(start, start + fileSplitSize));
		data.append("start", start + "");
		data.append("flag",(start + fileSplitSize)>=size?"COMPLETE":"UPLOAD");
		var p = "?name=" + encodeURIComponent(file.name) + "&fileid" + fileid + "&start" + start;
		// XMLHttpRequest 2.0 请求
		var xhr = new XMLHttpRequest();
		xhr.open("post", "/sjcq/temporaryPic/uploadActives", false);
		// .setRequestHeader("X_Requested_With",
		// location.href.split("/")[5].replace(/[^a-z]+/g,"$"));
		// xhr.setRequestHeader("Content-type", "multipart/form-data");
		// 上传进度中
		xhr.upload.addEventListener("progress", function(e) {
			// objStateElement.backgroundSize(fileid, (e.loaded + start) / size
			// * 100);
		}, false);
		// ajax成功后
		xhr.onreadystatechange = function(e) {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					try {
						var json = JSON.parse(xhr.responseText);
						temp = 2;
					} catch (e) {
						// objStateElement.error(fileid);
						return;
					}
					// var json = JSON.parse(xhr.responseText);
					if (!json || !json.succ) {
						// objStateElement.error(fileid);
						onerror.call(fileid, json);
						return;
					}

					if (start + fileSplitSize >= size) {
						// 超出，说明全部分割上传完毕
						// 上传队列中清除者一项
						fileArray.shift();
						if (delete fileArray[fileid])
						// objStateElement.success(fileid, now);
						// 回调
						onsuccess.call(fileid, json);
						filePath = json.data.savePath;
						var _EXIF = json.data.exif;
						textObjArray[fileid].picYtlj = filePath;
						if (_EXIF != undefined) {
							textObjArray[fileid].picFbl = _EXIF.picFbl;
							textObjArray[fileid].picXjxh = _EXIF.picXjxh;
							textObjArray[fileid].picGqz = _EXIF.picGqz;
							textObjArray[fileid].picBgsj = _EXIF.picBgsj;
							textObjArray[fileid].picJj = _EXIF.picJj;
							textObjArray[fileid].picIso = _EXIF.picIso;
						}
						localStorage.clear();
					} else {
						// 尚未完全上传完毕
						// 改变下一部分文件的起点位置
						start += fileSplitSize;
						// 存储上传成功的文件点，以便出现意外的时候，下次可以断点续传
						localStorage.setItem(fileid, start + "");
						// 上传下一个分割文件
						funFileSize();

					}
				} else {
					// objStateElement.error(fileid);
				}
			}
		};

		xhr.send(data);
	};
	// 文件分割上传开始
	funFileSize();
};

/**
 * 选择文字模板
 */
function selectText() {
	var obj = {};
	obj.orderBy = "id";
	obj.pageSize = 50;
	$.ajax({
		url : "/sjcq/textTemplate/findLyByManager",
		dataType : "json",
		async : true,
		data : obj,
		type : "post",
		success : function(data) {
			var html = '<option value="">选择文字模板</option>';
			if (data.resultStatus) {
				$.each(data.resultData.rows, function(i, val) {
					html += '<option value="' + val.id + '">' + val.name + '</option>';
				});
			} else {
				AlertBox.alert(data.resultInfo);
			}
			$("#selectText").html(html);
		},
		error : function() {
		}
	});
}

function textToData(fileId,textId){
	if (textId.trim().length == 0) {
		resetData();
		return;
	}
	$.ajax({
		url : "/sjcq/textTemplate/findById",
		dataType : "json",
		async : true,
		data : {
			id : textId
		},
		type : "post",
		success : function(data) {
			var obj = {};
			if (textObjArray[fileId] != undefined && textObjArray[fileId] != null) {
				obj = textObjArray[fileId];
			}
			obj.picMc = data.title;
			obj.picZsm = data.mainRemark;
			obj.picFsm = data.secondRemark;
			obj.picDd = data.picDd;
			obj.picSyz = data.picSyz;
			obj.picSysj = data.picPssj;
			obj.typeOne = data.typeOne;
			obj.typeTwo = data.typeTwo;
			obj.typeThree = data.typeThree;
			obj.typeFour = data.typeFour;
			obj.typeFive = data.typeFive;
			obj.picMj = data.picMj;
			obj.picType = data.picType;
			obj.picJg=data.picJg;
			obj.picGjz = data.picGjz;
			textObjArray[fileId] = obj;
			objToData(obj);
			initTextareaTip();
		},
		error : function() {
		}
	});
}

/**
 * 初始化时间
 */
function initDate(){
  $(".searchDate").datetimepicker({
	   todayHighlight: true,
      language: 'zh-CN',//显示中文
      format: 'yyyy-mm-dd',//显示格式
      minView: "month",//设置只显示到月份
      initialDate: new Date(),//初始化当前日期
      autoclose: true,//选中自动关闭
      todayBtn: true//显示今日按钮
  });
}

/**
 * 图片分类
 * @param sortpxh
 */
function picSortLoad(sortpxh){
	var sortData= this.picTypeObj[sortpxh];
	if(sortData!=null||sortData!=undefined){
		this.appendPicSort(sortData,sortpxh);
		return;
	}
    $.ajax({
        url:"/sjcq/manage/picSort/findBySortPxh",    // 请求的url地址
        type:"post",   // 请求方式
        dataType:"json",   // 返回格式为json
        async:false,// 请求是否异步，默认为异步，这也是ajax重要特性
        data:{sortPxh:sortpxh} ,    // 参数值     state 0:密码登录 1:验证码登录
        success:function(data){
        	if(data!=null&&data!=undefined&&data.length>0){
        		picTypeObj[sortpxh]=data;
        		templateDeal();
        		appendPicSort(data,sortpxh);
        	}
        },
        error:function(){
            layer.alert('查询加载失败！');
        }
    });
}

/**
 * 追加子分类数据
 * @param data
 * @param sortpxh
 */
function appendPicSort(data,sortpxh){
		var options='<option selected=selected>选择分类</option>';
		for(var i=0;i< data.length;i++){
			options=options+'<option value="'+data[i].sortXh+'">'+data[i].sortName+'</option>'
		}
		$("#picTypesSel").append(
			'<div class="img_sel" data-level="'+data[0].sortLevels+'" data-sortpxh="'+sortpxh+'">'
				+'<select class="sct" onchange=selectPicSort(this,'+data[0].sortLevels+',\''+sortpxh+'\') >'
					+options
				+'</select> '
				+'<i class="ico ico60"></i>'
			+'</div>'	
		);
}

/**
 * 选择分类
 * @param _this
 * @param sortLevels
 * @param sortpxh
 */
function selectPicSort(_this,sortLevels,sortpxh){
	templateDeal();
	if(undefined==$(_this).val()||null==$(_this).val()||''==$(_this).val()){
		return false;
	}
	$(_this).parent().nextAll('.img_sel').remove();
	picSortLoad($(_this).val());
}

//有文字限制的文本框初始化
function initTextareaTip() {
	$(".limit_text").each(function() {
		var max = parseInt($(this).attr("max"));
		if (max) {
			$(this).siblings(".zsum").text($(this).val().length + " / " + max);
			$(this).on("keydown", function() {
				if ($(this).val().length > max) {
					return false;
				}
				$(this).siblings(".zsum").text($(this).val().length + " / " + max);
			})
		}
	})
}