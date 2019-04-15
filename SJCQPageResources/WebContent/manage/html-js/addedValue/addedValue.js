/**
 * 增值服务
 * author cl
 */
var PARAM={}; //前一个页面传递的参数对象
var MAIN_PAGE_WINDOW = {};//前一个页面对象
var BROADID_ = "";//序号
var IFRAMEID_="";//当前iframid
var BROAD={};
var OPTTYPE;
var IMGFILE=null;
$(document).ready(function(){
	checksessoin();
	PARAM= GetParamByRequest();
	IFRAMEID_="tab_seed_"+PARAM.tabId;
	BROADID_ = PARAM.broadId;
	OPTTYPE=PARAM.optType;
	if("edit"==OPTTYPE){
		$(".panel-heading label").html("编辑增值服务");
		findInfoById(BROADID_);
	}else if("add"==OPTTYPE){
		$(".panel-heading label").html("新增增值服务");
	}
	MAIN_PAGE_WINDOW = parent.document.getElementById("tab_frame_"+PARAM.MAIN_PAGE_ID_).contentWindow;
	init();
});


function init() {
	// 实时展示图片
	$(".pic-file").change(function() {
		var $file = $(this);
		var fileObj = $file[0];
		IMGFILE=fileObj.files[0];
		var windowURL = window.URL || window.webkitURL;
		var dataURL;
		var $img = $("#picPath");
		if (fileObj && fileObj.files && fileObj.files[0]) {
			dataURL = windowURL.createObjectURL(fileObj.files[0]);
			$img.attr('src', dataURL);
		}
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
	    url:"/sjcq/ptgyatv/findSingleAddedValue",
	    dataType:"json",
	    async:true,
	    data:{id:broadId},
	    type:"post",
	    success:function(data){
	    	if("success"==data.status){
	    		$("#savTitle").val(data.data.savTitle); 
	    		$("#savExplain").val(data.data.savExplain); 
	    		$("#picPath").attr("src",index_nav.PICURI+data.data.savBgpic); 
	    	}else{
	    		alert(data.message);
	    	}

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
	if("edit"!=OPTTYPE&&IMGFILE==null){
		$box.promptBox("请选择图片！");
		return;
	}
	if(!OPTTYPE){
		$box.promptBox("操作类型错误！");
		return;
	}
	var data = new FormData();
	var name = IMGFILE.name;
	var fileType = name.substring(name.lastIndexOf(".") + 1).toLowerCase();
//	data.append("fileName", encodeURIComponent(name));
	var BROAD={};
	BROAD.id=PARAM.broadId;
	BROAD.savTitle=$("#savTitle").val();
	BROAD.savExplain=$("#savExplain").val();
	BROAD.type=OPTTYPE;
	data.append("savBgpic", IMGFILE.slice(0,IMGFILE.size));
	data.append("upInfo", JSON.stringify(BROAD));
	data.append("imgInfo",JSON.stringify({"imgName":name,"imgType":fileType,"tempImgId":getTempImgId()}));
	$.ajax({
	    url: "/sjcq/ptgyatv/saveAddedValue",
	    type: 'POST',
	    cache: false,
	    data: data,
	    async:false,
	    processData: false,
	    contentType: false
	}).done(function(res) {
		if(res.status=="success"){
			layer.alert("保存成功!");
			MAIN_PAGE_WINDOW.searchData();
		}else{
			layer.alert("保存失败!");
		}
	}).fail(function(res) {
		alert(res)
	});
}


/**
 * 重置
 */
function reset(){

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

function getTempImgId(){
	var tempImgId=null;
    $.ajax({
        url:"/sjcq/photoPic/serviceTimeServer",    // 请求的url地址
        type:"post",   // 请求方式
        dataType:"json",   // 返回格式为json
        async:false,// 请求是否异步，默认为异步，这也是ajax重要特性
        success:function(data){
        	tempImgId=data.imgId;
        },
        error:function(){
            layer.alert('获取图片零时id失败！');
        }
    });
    return tempImgId;
}
