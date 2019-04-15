/**
 * 编辑区县信息
 * author cl
 */
var PARAM={}; //前一个页面传递的参数对象
var MAIN_PAGE_WINDOW = {};//前一个页面对象
var IFRAMEID_="";//当前iframid
var AREAID_ = "";//序号
var AREA={};
var IMGFILE=null;
var OPTTYPE;
$(document).ready(function(){
	checksessoin();
	PARAM= GetParamByRequest();
	IFRAMEID_="tab_seed_"+PARAM.tabId;
	AREAID_ = PARAM.areaId;
	OPTTYPE=PARAM.optType;
	MAIN_PAGE_WINDOW = parent.document.getElementById("tab_frame_"+PARAM.MAIN_PAGE_ID_).contentWindow;
	if("edit"==OPTTYPE && AREAID_.trim().length>0){
		findInfoById();
	}
	init();
	var h= $("#person_info_content").height();
	setIframeHeight2(PARAM.tabId,h);
});


function init() {
	// 实时展示图片
	$(".pic-file").change(function() {
		var fileObj = this.files[0];
		var size = fileObj.size, type = fileObj.type || "";
		if (size > 1024 * 100) {// 大于100kb
			layer.alert("文件过大！");
			return;
		}else {
			IMGFILE=fileObj;
			var windowURL = window.URL || window.webkitURL;
			var dataURL;
			var $img = $("#picPath");
			if (fileObj) {
				dataURL = windowURL.createObjectURL(fileObj);
				$img.attr('src', dataURL);
			}
		}
	});
	//展示大图
	 $("#picPath").click(function() {
		 showImg();
	 });
}

/**
 * 根据序号加载详情
 */
function findInfoById(){
	$.ajax({
	    url:"/sjcq/manage/area/findById",
	    dataType:"json",
	    async:true,
	    data:{id:AREAID_},
	    type:"post",
	    success:function(data){
	    	AREA=data;
			$("#aliasName").val(data.aliasName);
			$("#engName").val(data.engName);
			$("#remark").val(data.remark);
			$("#picPath").attr("src",index_nav.PICURI+data.coverPicMidPath); 
	    },
	    error:function(){
	    	alert("查询加载错误！");
	    }
	})
}

/**
 * 保存
 */
function save(){
	if("edit"!=OPTTYPE && IMGFILE==null){
		$box.promptBox("请选择图片！");
		return;
	}
	var BROAD={};
	AREA.aliasName=$("#aliasName").val();
	AREA.engName=$("#engName").val();
	AREA.remark=$("#remark").val();
	if(IMGFILE!=undefined && IMGFILE.size>0){
		var name = IMGFILE.name;
		var fileType = name.substring(name.lastIndexOf(".") + 1).toLowerCase();
		var fileName=AREA.engName+ Math.ceil(Math.random() * 10) + "."+fileType;
		var fileYPath="";
		if(AREA.coverPicMidPath!=undefined && AREA.coverPicMidPath!=null && AREA.coverPicMidPath.trim().length>0){
			fileYPath=AREA.coverPicMidPath;
		}
		var data = new FormData();
		data.append("fileName", encodeURIComponent(fileName));
		data.append("filePath", encodeURIComponent("area/"));
		data.append("fileYPath", encodeURIComponent(fileYPath));
		data.append("areaFile", IMGFILE);
		$.ajax({
			contentType : "multipart/form-data",
			url : "/sjcq/pic/uploadMinPic",
			type : "POST",
			async:true,
			data : data,
			dataType : "text",
			processData : false, // 告诉jQuery不要去处理发送的数据
			contentType : false, // 告诉jQuery不要去设置Content-Type请求头
			success : function(data) {
				var json = JSON.parse(data);
				if(json.succ){
					AREA.coverPicMidPath=json.data.savePath;
					saveData(AREA);
				}else{
					$box.promptBox("文件上传失败！");
				}
			},
		    error:function(data){
		    	if(data.status==503){
		    		$box.promptBox("当前上传人数过多,请稍后重试！");
		    		return;
		    	}else{
		    		alert("服务异常！");
		    		return;
		    	}
		    }
		});
	}else{
		saveData(AREA);
	}
}

function saveData(AREA){
	var url="";
	if("add"==OPTTYPE){
		url="/sjcq//manage/area/addSaveArea";
	}else if("edit"==OPTTYPE){
		url="/sjcq/manage/area/editSaveArea";
	}
	$.ajax({
	    url:url,
	    dataType:"json",
	    async:true,
	    data:AREA,
	    type:"post",
	    success:function(data){
	    	if(data.resultStatus){
	    		$box.promptBox(data.resultInfo);
				$('#myModal').on('hidden.bs.modal', function () {
//			    	closeTab(IFRAMEID_);
			    	parent.closableTab.closeThisTab(PARAM.tabId);
					MAIN_PAGE_WINDOW.search();
			    });
	    	}else{
	    		$box.promptBox(data.resultInfo);
	    	}
	    },
	    error:function(){
	    	alert("服务异常！");
	    }
	});
}

function showImg(){
	var json=[],that =$("#picPath");
	var img = {},imgurl = $("#picPath").attr('src');
	img.src = imgurl; //大图
	img.thumb = imgurl; //缩略图，我这里就用大图，你有小图就用小图
	json.push(img);
	var index = $('#picPath').index(that);
	layer.photos({
		photos: {
			"start": index,
			"data": json
			},
		shadeClose:false,
	    closeBtn:2,
	    anim: 0 
	});
}