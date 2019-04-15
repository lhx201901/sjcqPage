/**
 * 编辑图片信息页js
 * author cl
 */
var PARAM={}; //前一个页面传递的参数对象
var MAIN_PAGE_WINDOW = {};//前一个页面对象
var PICTUREID_ = "";//序号
var IFRAMEID_="";//当前iframid
var PICTURE={};
$(document).ready(function(){
	checksessoin();
	PARAM= GetParamByRequest();
	IFRAMEID_="tab_seed_"+PARAM.tabId;
	PICTUREID_ = PARAM.pictureId;
	MAIN_PAGE_WINDOW = parent.document.getElementById("tab_frame_"+PARAM.MAIN_PAGE_ID_).contentWindow;
	findInfoById(PICTUREID_);
	init();
});
 
function showImg(){
	layer.photos({
		photos: '#person_info_table',
		shadeClose:false,
	    closeBtn:2,
	    anim: 0 
	});
}

function init(){
	$('.select-levelone').click(function() {
		var value = $(this).children('option:selected').val();
		initType(value);
	});
}

/**
 * 根据序号加载详情
 * @param pictureId
 */
function findInfoById(pictureId){
	$.ajax({
	    url:"/sjcq/picture/findPictureInfos",
	    dataType:"json",
	    async:true,
	    data:{id:pictureId},
	    type:"post",
	    success:function(data){
	    	PICTURE=data.picture;
	    	var atlas=data.atlas;
	    	if(atlas==null){
	    		$("#tjFmlj").attr('src','../../img/singlePicFm.jpg');
	    		$("#typeOne").parent().css("visibility","hidden");
	    		$("#typeOne").parent().prev().css("visibility","hidden");
	        	$("#typeTwo").parent().parent().css("visibility","hidden");
	        	$("#typeThree").parent().parent().css("visibility","hidden");
	        	$("#tjSm").parent().parent().css("display","none");
	        	$("#tjBt").text("单图相册");
	    	}else{
	    		if(atlas.tjFmlj!=null && atlas.tjFmlj!=""){
		    		$("#tjFmlj").attr('src','/sjcq/DATA/'+atlas.tjFmlj+'_s.jpg');
		    	}else{
		    		$("#tjFmlj").attr('src','../../img/tjFm.jpg');
		    	}
	    		if(atlas.typeOne!=null && atlas.typeOne.length>0){
	    			$("#typeOne").text(atlas.typeOne);
		        	$("#typeTwo").text(atlas.typeTwo);
		        	if(atlas.typeOne=="区县"){
		        		$("#typeThree").parent().parent().css("visibility","visible");
			    		$("#typeThree").text(atlas.typeThree);
			    	}else{
			    		$("#typeThree").parent().parent().css("visibility","hidden");
			    	}
	    		}else{
	    			$("#typeOne").parent().css("visibility","hidden");
		    		$("#typeOne").parent().prev().css("visibility","hidden");
		        	$("#typeTwo").parent().parent().css("visibility","hidden");
		        	$("#typeThree").parent().parent().css("visibility","hidden");
	    		}
	        	$("#tjBt").text(atlas.tjName);
	        	$("#tjSm").text(atlas.tjSm);
	    	}
	    	$("#picXdlj").attr('src','/sjcq/DATA/'+PICTURE.picXdlj+'_m.jpg');
	    	initType(PICTURE.typeOne);
	    	$(".select-levelone").val(PICTURE.typeOne);
	    	$(".select-leveltwo").val(PICTURE.typeTwo);
	    	if(PICTURE.typeOne=="区县"){
	    		$(".select-levelthree").val(PICTURE.typeThree);
	    	}else if(PICTURE.typeOne=="设计"){
	    		$(".select-levelthree").val(PICTURE.picGs);
	    	}
	    	$("#picBt").val(PICTURE.picBt);
	    	$("#picGjz").val(PICTURE.picGjz);
	    	$("#picSm").val(PICTURE.picSm);
	    	$("#picZz").val(PICTURE.picZz);
	    	$("#picRksj").val(PICTURE.picRksj);
	    	if(PICTURE.typeOne!="设计"){
	    		$("#picGq").val(PICTURE.picGq);
	    		$("#picKm").val(PICTURE.picKm);
	    		$("#picIos").val(PICTURE.picIos);
	    	}
	    	if(PICTURE.tjBh.length==0){
	    		$(".sync").css("display","none");
	    	}
	    	var h= $("#person_info_content").height();
	    	setIframeHeight2(PARAM.tabId,h);
	    	showImg();
	    },
	    error:function(){
	    	alert("服务器错误！");
	    }
	})
}

/**
 * 保存
 */
function save(){
	var typeOne=$(".select-levelone").val();
	if(typeOne==null || typeOne.length==0){
		$box.promptBox("请选择导航分类！");
		return;
	}
	var typeTwo=$(".select-leveltwo").val();
	if(typeOne=="区县"){
		PICTURE.typeThree=$(".select-levelthree").val();
	}else if(typeOne=="设计"){
		PICTURE.picGs=$(".select-levelthree").val();
		PICTURE.typeThree="";
	}else{
		PICTURE.typeThree="";
	}
	PICTURE.typeOne=typeOne;
	PICTURE.typeTwo=typeTwo;
	PICTURE.picBt=$("#picBt").val();
	if(PICTURE.picBt.length==0){
		$box.promptBox("请输入图片标题！");
		return;
	}
	PICTURE.picSm=$("#picSm").val();
	if(PICTURE.picSm.length==0){
		$box.promptBox("请输入图片说明！");
		return;
	}
	if(typeOne!="设计"){
		PICTURE.picGq=$("#picGq").val();
		PICTURE.picKm=$("#picKm").val();
		PICTURE.picIos=$("#picIos").val();
	}
	PICTURE.picGjz=$("#picGjz").val();
	if(PICTURE.picGjz.length==0){
		$box.promptBox("请输入关键字！");
		return;
	}
	$.ajax({
	    url:"/sjcq/picture/savePicture",
	    dataType:"json",
	    async:true,
	    data:PICTURE,
	    type:"post",
	    success:function(data){
	    	if(data){
	    		$box.promptBox("保存成功！");
	    		$('#myModal').on('hidden.bs.modal', function () {
	    			findInfoById(PICTUREID_);
			    });
	    	}
	    },
	    error:function(){
	    	alert("查询加载失败！");
	    }
	});
}

/**
 * 同步全集
 */
function sync(){
	var typeOne=$(".select-levelone").val();
	if(typeOne==null || typeOne.length==0){
		$box.promptBox("请选择导航分类！");
		return;
	}
	var typeTwo=$(".select-leveltwo").val();
	if(typeOne=="区县"){
		PICTURE.typeThree=$(".select-levelthree").val();
	}else if(typeOne=="设计"){
		PICTURE.picGs=$(".select-levelthree").val();
		PICTURE.typeThree="";
	}else{
		PICTURE.typeThree="";
	}
	PICTURE.typeOne=typeOne;
	PICTURE.typeTwo=typeTwo;
	PICTURE.picBt=$("#picBt").val();
	if(PICTURE.picBt.length==0){
		$box.promptBox("请输入图片标题！");
		return;
	}
	PICTURE.picSm=$("#picSm").val();
	if(PICTURE.picSm.length==0){
		$box.promptBox("请输入图片说明！");
		return;
	}
	if(typeOne!="设计"){
		PICTURE.picGq=$("#picGq").val();
		PICTURE.picKm=$("#picKm").val();
		PICTURE.picIos=$("#picIos").val();
	}
	PICTURE.picGjz=$("#picGjz").val();
	if(PICTURE.picGjz.length==0){
		$box.promptBox("请输入关键字！");
		return;
	}
	$.ajax({
	    url:"/sjcq/picture/syncAtlasPicture",
	    dataType:"json",
	    async:true,
	    data:PICTURE,
	    type:"post",
	    success:function(data){
	    	if(data){
	    		$box.promptBox("同步全集成功！");
	    		$('#myModal').on('hidden.bs.modal', function () {
	    			findInfoById(PICTUREID_);
			    });
	    	}
	    },
	    error:function(){
	    	alert("查询加载失败！");
	    }
	});
}

/**
 * 重置
 */
function reset(){
	initType(PICTURE.typeOne);
	$(".select-levelone").val(PICTURE.typeOne);
	$(".select-leveltwo").val(PICTURE.typeTwo);
	if(PICTURE.typeOne=="区县"){
		$(".select-levelthree").val(PICTURE.typeThree);
	}else if(PICTURE.typeOne=="设计"){
		$(".select-levelthree").val(PICTURE.picGs);
	}
	$("#picBt").val(PICTURE.picBt);
	$("#picSm").val(PICTURE.picSm);
	if(PICTURE.typeOne!="设计"){
		$("#picGq").val(PICTURE.picGq);
		$("#picKm").val(PICTURE.picKm);
		$("#picIos").val(PICTURE.picIos);
	}
	$("#picGjz").val(PICTURE.picGjz);
}


function getTypeAll(value){
	var types=new Array();
	types['图片']='纪实|风光|人文|城市|创意|其他';
	types['区县']=' 渝中|大渡口|江北|沙坪坝|九龙坡|南岸|北碚|渝北|巴南|万州|黔江|涪陵|长寿|江津|合川|永川|南川|綦江|'
	    +'大足|潼南|铜梁|荣昌|璧山|梁平|城口|丰都|垫江|武隆|忠县|开县|云阳|奉节|巫山|巫溪|酉阳|秀山|彭水|石柱';
	types['企业']='工业|农业|汽摩|IT|化医|地产|旅游|环保|手工|服务业|外企|港澳台企';
	types['老照片']='城市|交通|人文|大事件|其他';
	types['设计']='插画|漫画|平面设计|GIF';
	var str=types[value];
	if(str==undefined || str=="" || str==null ){
		str=types['图片'];
	}
	var arr=str.split("|");
	var html="";
	for(var i=0;i<arr.length;i++){
		var type=arr[i];
		html+='<option value="'+type+'">'+type+'</option>';
	}
	return html;
}

function getAreaTypeThree(){
	var str='政治经济|科技文体|教育民生|艺术旅游|民俗趣闻';
	var arr=str.split("|");
	var html="";
	for(var i=0;i<arr.length;i++){
		var type=arr[i];
		html+='<option value="'+type+'">'+type+'</option>';
	}
	return html;
}

function getdesignGs(){
	var str='Psd、cdr、ai、fla、jpg、png、pdf、esp、tiff';
	var arr=str.split("、");
	var html="";
	for(var i=0;i<arr.length;i++){
		var type=arr[i];
		html+='<option value="'+type+'">'+type+'</option>';
	}
	return html;
}

function initType(value){
	var typeAll=getTypeAll(value);
	$('.select-leveltwo').html(typeAll);
	if (value === '区县') {
		$("#picGq").parent().parent().css("display","");
    	$("#picKm").parent().parent().css("display","");
    	$("#picIos").parent().parent().css("display","");
		var typeThree=getAreaTypeThree();
		$('.select-levelthree').html(typeThree);
		$('.levelthree').html("三级页面分类：");
		$('.levelthree').css("visibility","visible");
		$('.select-levelthree').css("visibility","visible");
	} else if (value === '设计'){
		$("#picGq").parent().parent().css("display","none");
    	$("#picKm").parent().parent().css("display","none");
    	$("#picIos").parent().parent().css("display","none");
		var typeThree=getAreaTypeThree();
		$('.select-leveltwo').html(typeThree);
		var designGs=getdesignGs();
		$('.select-levelthree').html(designGs);
		$('.levelthree').html("文件格式：");
		$('.levelthree').css("visibility","visible");
		$('.select-levelthree').css("visibility","visible");
	} else {
		$("#picGq").parent().parent().css("display","");
    	$("#picKm").parent().parent().css("display","");
    	$("#picIos").parent().parent().css("display","");
		$('.key-word textarea').removeClass('large');
		$('.levelthree').css("visibility","hidden");
		$('.select-levelthree').css("visibility","hidden");
	}
}
