/**
 * 图集信息页js
 * author cl
 */
var PARAM={}; //前一个页面传递的参数对象
var MAIN_PAGE_WINDOW = {};//前一个页面对象
var ATLASID_ = "";//序号
var IFRAMEID_="";//当前iframid
$(document).ready(function(){
	checksessoin();
	PARAM= GetParamByRequest();
	IFRAMEID_="tab_seed_"+PARAM.tabId;
	ATLASID_ = PARAM.atlasId;
	MAIN_PAGE_WINDOW = parent.document.getElementById("tab_frame_"+PARAM.MAIN_PAGE_ID_).contentWindow;
	findInfoById(ATLASID_);
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
 * 根据序号加载详情
 * @param atlasId
 */
function findInfoById(atlasId){
	$.ajax({
	    url:"/sjcq/atlas/findAtlasInfo",
	    dataType:"json",
	    async:true,
	    data:{id:atlasId},
	    type:"post",
	    success:function(data){
	    	if(data.atlas.tjFmlj!=null && data.atlas.tjFmlj!=""){
	    		$("#tjFmlj").attr('src','/sjcq/DATA/'+data.atlas.tjFmlj+"_m.jpg");
	    		$("#tjFmmc").html(data.atlas.tjFmmc);
	    	}else{
	    		$("#tjFmlj").attr('src','../../img/tjFm.jpg');//设置默认图片
	    		$("#tjFmmc").parent().css("display","none");
	    	}
	    	if(data.atlas.typeOne!=null && data.atlas.typeOne.length>0){
	    		$("#typeOne").text(data.atlas.typeOne);
	        	$("#typeTwo").text(data.atlas.typeTwo);
	        	if(data.atlas.typeOne=="区县"){
	        		$("#typeThree").parent().parent().css("visibility","visible");
		    		$("#typeThree").text(data.atlas.typeThree);
		    	}else{
		    		$("#typeThree").parent().parent().css("visibility","hidden");
		    	}
	    	}else{
	    		$("#typeOne").parent().css("visibility","hidden");
	    		$("#typeOne").parent().prev().css("visibility","hidden");
	        	$("#typeTwo").parent().parent().css("visibility","hidden");
	        	$("#typeThree").parent().parent().css("visibility","hidden");
	    	}
	    	$("#tjBh").text(data.atlas.tjBh);
	    	$("#tjName").text(data.atlas.tjName);
	    	$("#tjSsz").text(data.atlas.tjSsz);
	    	$("#tjZl").text(data.atlas.tjZl);
	    	$("#tjSm").text(data.atlas.tjSm);
	    	$("#tjCjsj").text(data.atlas.tjCjsj);
	    	if(data.atlas.status==0){
	    		$("#status").text("待处理");
	    	}else if(data.atlas.status==1){
	    		$("#status").text("待审核");
	    	}else if(data.atlas.status==2){
	    		$("#status").text("审核通过");
	    	}else if(data.atlas.status==3){
	    		$("#status").text("审核不通过");
	    	}else if (data.atlas.status == 10) {
	    		$("#status").text("已删除");
			}
	    	if(data.atlas.status!=1 && data.atlas.status!=2 && data.atlas.status!=3){
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
		url : "/sjcq//atlas/auditAtlas", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {
			ids : ATLASID_,
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
