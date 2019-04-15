/**
 * 编辑轮播信息页js
 * author cl
 */
var PARAM={}; //前一个页面传递的参数对象
var MAIN_PAGE_WINDOW = {};//前一个页面对象
var BROADID_ = "";//序号
var IFRAMEID_="";//当前iframid
var BROAD={};
var FILE;
$(document).ready(function(){
	checksessoin();
	PARAM= GetParamByRequest();
	IFRAMEID_="tab_seed_"+PARAM.tabId;
	BROADID_ = PARAM.broadId;
	MAIN_PAGE_WINDOW = parent.document.getElementById("tab_frame_"+PARAM.MAIN_PAGE_ID_).contentWindow;
	findInfoById(BROADID_);
	init();
});


function init() {
	$('#broTypeSel').click(function() {
		var value = $(this).children('option:selected').val();
		if(value==7){
			$("#districtName").val(BROAD.districtName);
    		$("#districtEngName").val(BROAD.districtEngName);
    		$("#districtName").parent().parent().css("display","");
    		$("#districtEngName").parent().parent().css("display","");
		}else if(value==3 || value==5){
			$("#districtName").val(BROAD.districtName);
			$("#districtName").parent().parent().css("display","");
			$("#districtEngName").parent().parent().css("display","none");
		}else{
			$("#districtName").parent().parent().css("display","none");
        	$("#districtEngName").parent().parent().css("display","none");
		}
	});
	// 实时展示图片
	$(".pic-file").change(function() {
		var $file = $(this);
		var fileObj = $file[0];
		FILE=fileObj.files[0];
		/*if(FILE.size>1024*1024){
			 alert("图片过大,请上传小于1M的图片!");
			 return false;
		}*/
        var reader = new FileReader;
        reader.onload = function (evt) {
            var image = new Image();
            image.onload = function () {
                var width = this.width;
                var height = this.height;
                /*if(width*9-height*16>=20||width*9-height*16<=-20){
                	   alert("宽:"+width+"高:"+height+"比例不等于16/9请重新上传!");
                	return false;
                }*/
        		var windowURL = window.URL || window.webkitURL;
        		var dataURL;
        		var $img = $("#picPath");
        		var $img1 = $("#picPath1");
        		if (fileObj && fileObj.files && fileObj.files[0]) {
        			dataURL = windowURL.createObjectURL(fileObj.files[0]);
        			$img.attr('src', dataURL);
        			$img1.attr('src', dataURL);
        		}
            };
            image.src = evt.target.result;
        };
        reader.readAsDataURL(FILE);
	});
	//展示大图
	 $("#picPath").click(function() {
		 showImg();
	 });
}

/**
 * 根据序号加载详情
 * @param broadId
 */
function findInfoById(broadId){
	if(broadId=="" || broadId==null || broadId==undefined){
		return;
	}
	$.ajax({
	    url:"/sjcq/broadcast/findBroadById",
	    dataType:"json",
	    async:true,
	    data:{id:broadId},
	    type:"post",
	    success:function(data){
	    	if(data){
	    		BROAD=data;
	    		$("#picPath").attr('src',index_nav.PICURI+data.picPath);
	    		$("#broTypeSel").val(data.broType);
	    		$("#picName").val(data.picName);
	    		$("#picContent").val(data.picContent);
	    		if(data.broType==7){
	    			$("#districtName").val(data.districtName);
		    		$("#districtEngName").val(data.districtEngName);
		    		$("#districtName").parent().parent().css("display","");
		    		$("#districtEngName").parent().parent().css("display","");
	    		}else if(data.broType==3 || data.broType==5){
	    			$("#districtName").val(data.districtName);
	    			$("#districtName").parent().parent().css("display","");
	    			$("#districtEngName").parent().parent().css("display","none");
	    		}else{
	    			$("#districtName").parent().parent().css("display","none");
		        	$("#districtEngName").parent().parent().css("display","none");
	    		}
	    		$("#updateDate").text(dateFtt("yyyy-MM-dd hh:mm:ss",new Date(data.updateDate)));
	    		$("#updateDate").parent().parent().css("display","");
	    		$(":radio[name='isUsed'][value='" + data.isUsed + "']").prop("checked", "checked");
	    	}
	    	var h= $("#person_info_content").height();
	    	setIframeHeight2(PARAM.tabId,h+60);
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
	BROAD.broType=$("#broTypeSel").val();
	BROAD.picName=$("#picName").val();
	BROAD.picContent=$("#picContent").val();
	if(BROAD.broType==7){
		BROAD.districtName=$("#districtName").val();
		BROAD.districtEngName=$("#districtEngName").val();
	}else if(BROAD.broType==3 || BROAD.broType==5){
		BROAD.districtName=$("#districtName").val();
	}
	BROAD.isUsed=$(':radio[name="isUsed"]:checked').val();
	BROAD.updateDate=new Date();
	var picPath=$("#picPath").attr('src');
	if(picPath.trim()==""){
		$box.promptBox("请选择图片！");
		return;
	}
	if(FILE!=undefined && FILE.size>0){
		var data = new FormData();
		data.append("pic", FILE);
		var picYtlj="";
		if(BROAD.picPath!=undefined && BROAD.picPath!=null){
			picYtlj=BROAD.picPath;
		}
		$.ajax({
			contentType : "multipart/form-data",
			url : "/sjcq/broadcast/uploadBroad?broType="+BROAD.broType+"&picYtlj="+encodeURIComponent(picYtlj),
			type : "POST",
			async:true,
			data : data,
			dataType : "text",
			processData : false, // 告诉jQuery不要去处理发送的数据
			contentType : false, // 告诉jQuery不要去设置Content-Type请求头
			success : function(data) {
//				alert(data);
//				alert(JSON.stringify(data));
				var json = JSON.parse(data);
				if(json.succ){
					BROAD.picPath=json.pic;
					saveData(BROAD);
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
		saveData(BROAD);
	}
}

/**
 * 数据交互，保存修改数据
 * @param BROAD
 */
function saveData(BROAD){
	$.ajax({
	    url:"/sjcq/broadcast/setBroadcast",
	    dataType:"json",
	    async:true,
	    data:BROAD,
	    type:"post",
	    success:function(data){
	    	if(data){
	    		$box.promptBox("保存成功！");
				$('#myModal').on('hidden.bs.modal', function () {
//			    	closeTab(IFRAMEID_);
					parent.closableTab.closeThisTab(PARAM.tabId);
					MAIN_PAGE_WINDOW.searchData();
			    });
	    	}
	    },
	    error:function(){
	    	alert("服务异常！");
	    }
	});
}

/**
 * 重置
 */
function reset(){
	if(BROAD.broType==7){
		$("#districtName").val(BROAD.districtName);
		$("#districtEngName").val(BROAD.districtEngName);
	}else if(BROAD.broType==3 || BROAD.broType==5){
		$("#districtName").val(BROAD.districtName);
		$("#districtEngName").parent().parent().css("display","none");
	}else{
		$("#districtName").parent().parent().css("display","none");
    	$("#districtEngName").parent().parent().css("display","none");
	}
	$("#picPath").attr('src','/sjcq/DATA/'+BROAD.picPath);
	$("#broTypeSel").val(BROAD.broType);
	$("#picName").val(BROAD.picName);
	$("#picContent").val(BROAD.picContent);
	$(":radio[name='isUsed'][value='" + BROAD.isUsed + "']").prop("checked", "checked");
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
