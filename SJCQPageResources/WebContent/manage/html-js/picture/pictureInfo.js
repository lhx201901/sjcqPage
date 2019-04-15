/**
 * 图片信息页js
 * author cl
 */
var PARAM={}; //前一个页面传递的参数对象
var MAIN_PAGE_WINDOW = {};//前一个页面对象
var PICTUREID_ = "";//序号
var IFRAMEID_="";//当前iframid
$(document).ready(function(){
	checksessoin();
	PARAM= GetParamByRequest();
	IFRAMEID_="tab_seed_"+PARAM.tabId;
	PICTUREID_ = PARAM.pictureId;
	MAIN_PAGE_WINDOW = parent.document.getElementById("tab_frame_"+PARAM.MAIN_PAGE_ID_).contentWindow;
	findInfoById(PICTUREID_);
	setHeight();
});
 
function showImg(){
	layer.photos({
		photos: '#person_info_table',
		shadeClose:false,
	    closeBtn:2,
	    anim: 0 
	});
}

/**
 * 修改html的高度
 */
function setHeight() {
	var h=$("#person_info_content").offsetHeight;
	setIframeHeight2(PARAM.tabId);
}

/**
 * 根据序号加载详情
 * @param pictureId
 */
function findInfoById(pictureId){
	$.ajax({
	    url:"/sjcq/picture/findPictureInfo",
	    dataType:"json",
	    async:true,
	    data:{id:pictureId},
	    type:"post",
	    success:function(data){
	    	$("#picXdlj").attr('src','/sjcq/DATA/'+data.picture.picXdlj+'_m.jpg');
	    	$("#typeOne").text(data.picture.typeOne!=null?data.picture.typeOne:"");
	    	$("#typeTwo").text(data.picture.typeTwo!=null?data.picture.typeTwo:"");
	    	if(data.picture.typeOne=="设计"){
	    		$("#typeThree").prev().text("文件格式");
	    		$("#typeThree").text(data.picture.picGs);
	    	}else if(data.picture.typeOne=="区县"){
//	    		.prev("*")
	    		$("#typeThree").text(data.picture.typeThree);
	    	}else{
	    		$("#typeThree").parent().parent().css("display","none");
	    	}
	    	$("#picZz").text(data.picture.picZz);
	    	$("#picBt").text(data.picture.picBt!=null?data.picture.picBt:"");
	    	$("#picGjz").text(data.picture.picGjz!=null?data.picture.picGjz:"");
	    	$("#picRksj").text(data.picture.picRksj);
	    	$("#picSm").text(data.picture.picSm!=null?data.picture.picSm:"");
	    	if(data.picture.typeOne!="设计" && data.picture.typeOne!="区县"){
	    		$("#picSm").parent().parent().after('<tr><td></td></tr>');
	    	}
//	    	$("#picJg").text(data.picture.picJg);
//	    	$("#picCjsj").text(data.picture.picCjsj);
//	    	$("#picCcxx").text(data.picture.picCcxx);
//	    	$("#picGs").text(data.picture.picGs);
	    	if(data.picture.typeOne=="设计" || data.picture.typeOne==null){
	    		$("#picGq").parent().parent().css("display","none");
		    	$("#picKm").parent().parent().css("display","none");
		    	$("#picIos").parent().parent().css("display","none");
	    	}else{
	    		$("#picGq").text(data.picture.picGq!=null?data.picture.picGq:"");
		    	$("#picKm").text(data.picture.picKm!=null?data.picture.picKm:"");
		    	$("#picIos").text(data.picture.picIos!=null?data.picture.picIos:"");
	    	}
//	    	$("#downLoadNum").text(data.picture.downLoadNum);
//	    	if(data.picture.shelves==0){
//	    		$("#shelves").text("下架");
//	    	}else if(data.picture.shelves==1){
//	    		$("#shelves").text("上架");
//	    	}
	    	if(data.picture.status==0){
	    		$("#status").text("待处理");
	    	}else if(data.picture.status==1){
	    		$("#status").text("待审核");
	    	}else if(data.picture.status==2){
	    		$("#status").text("审核通过");
	    	}else if(data.picture.status==3){
	    		$("#status").text("审核不通过");
	    	}else if (data.picture.status == 10) {
	    		$("#status").text("已删除");
			}
	    	if(data.picture.status!=1 && data.picture.status!=2 && data.picture.status!=3){
	    		$("#remarks").parent().parent().css("display","none");
	    		$("#auditBtn").css("display","none");
	    	}
	    	var list=data.auditList;
	    	if(list.length>0){
	    		html='<table class="auditList">';
	    		html+='<tr>';
    			html+='<th style="padding-left:0px;">审核状态</th>';
    			html+='<th>审核人</th>';
    			html+='<th>审核时间</th>';
    			html+='<th class="remark">审核备注</th>';
    			html+='</tr>';
	    		$.each(list, function(i,val){
	    			html+='<tr>';
	    			html+='<td>'+val.operate+'</td>';
	    			html+='<td>'+val.dataAuditPerson+'</td>';
	    			html+='<td>'+val.dataTime+'</td>';
	    			html+='<td class="remark">'+val.dataRemark+'</td>';
	    			html+='</tr>';
	    		});
	    		html+='</table>';
	    		$("#historyAudit").empty();
		    	$("#historyAudit").html(html);
	    	}else{
	    		$("#historyAudit").parent().css("display","none");
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
 * 审核
 * @param passOrNo
 */
function auditPass(passOrNo) {
	var remark=$("#remarks").val();
	$.ajax({
		url : "/sjcq/picture/auditPicture", 
		dataType : "json", 
		async : true,
		data : {
			ids : PICTUREID_,
			passOrNo : passOrNo,
			remark:remark
		}, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			$box.promptBox(data.resultInfo);
			$('#myModal').on('hidden.bs.modal', function () {
		    	//closeTab(IFRAMEID_);
				parent.closableTab.closeThisTab(PARAM.tabId);
				MAIN_PAGE_WINDOW.refreshTable();
		    });
		},
		error : function() {
			alert("服务器错误！");
		}
	});

}
