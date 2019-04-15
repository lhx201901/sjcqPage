/**
 * 企业信息页js
 * author lxw
 */
var PARAM={}; //前一个页面传递的参数对象
var MAIN_PAGE_WINDOW = {};//前一个页面对象
var ENTERID_= "";//序号
var IFRAMEID_="";//当前iframid

$(document).ready(function(){
	checksessoin();
	PARAM= GetParamByRequest();
	IFRAMEID_="tab_seed_"+PARAM.tabId;
	ENTERID_ = PARAM.enterId;
	MAIN_PAGE_WINDOW = parent.document.getElementById("tab_frame_"+PARAM.MAIN_PAGE_ID_).contentWindow;
	findEnterInfoById(ENTERID_);
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
 * @param enterId
 */
function findEnterInfoById(enterId){
	$.ajax({
	    url:"/sjcq/enter/findEnterBasicbyId",    //请求的url地址
	    dataType:"json",   //返回格式为json
	    async:true,//请求是否异步，默认为异步，这也是ajax重要特性
	    data:{id:enterId},    //参数值
	    type:"post",   //请求方式
	    success:function(data){
	    	$("#loginName").text(data.account.loginName);
	    	$("#phone").text(data.account.phone);
	    	$("#enterName").text(data.enter.enterName);
	    	$("#organizationCode").text(data.enter.organizationCode);
	    	$("#legalPerson").text(data.enter.legalPerson);
	    	$("#liaison").text(data.enter.liaison);
	    	$("#contactPhone").text(data.enter.contactPhone);
	    	$("#address").text(data.enter.address);
	    	$("#unitProperties").text(data.enter.unitProperties);
	    	$("#manuscriptType").text(data.enter.manuscriptType);
	    	$("#positive").attr('src','/sjcq/DATA/'+data.enter.licensePositive);
	    	$("#oposite").attr('src','/sjcq/DATA/'+data.enter.licenseOpposite);
	    	if(data.enter.auditStatus==0){
	    		$("#auditStatus").text("待审核");
	    	}else if(data.enter.auditStatus==1){
	    		$("#auditStatus").text("审核通过");
	    	}else if(data.enter.auditStatus==2){
	    		$("#auditStatus").text("审核不通过");
	    	}
	    	
	    	$("#userRemarks").val(data.enter.auditRemark);
	    	var photos=data.samplePhotos;
	    	var html='';
	    	if(photos){
                 for(var i = 0;i<photos.length;i++){
                    var photo = photos[i];
                    html+='<p>图片'+(i+1)+'</p>';
                    html+='<p><img src="/sjcq/DATA/'+photo.photoPath+'" style="width: 120px; height: 160px;border: 1px solid #C0C1C0;"/></p>';
                    html+='<p>文字说明：'+photo.photoSm+'</p>';
                 }
	    	}
	    	$("#samplePhoto").empty();
	    	$("#samplePhoto").html(html);
	    	showImg();
	    	var h= $("#person_info_content").height();
	    	setIframeHeight2(PARAM.tabId,h);
	    },
	    error:function(){
	        //请求出错处理
	    }
	})
}

/**
 * 确认
 * @param passOrNo
 */
function  sureAudit(passOrNo){
	var msg="";
	if(passOrNo==1){
		msg="确认审核通过吗？";
	}else if(passOrNo==2){
		msg="确认审核不通过吗？审核不通过，信息将被删除！";
	}
	$box.promptSureBox(msg,'auditPass',passOrNo);
	$("#myModalLabel").html("确认提示");
}

/**
 * 审核
 * @param ids
 * @param passOrNo
 */
function auditPass(passOrNo) {
	var remark=$("#userRemarks").val();
	$.ajax({
		url : "/sjcq/enter/auditEnter", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {
			ids : ENTERID_,
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
		    })
			
//			parent.location.reload();
//			window.location.href="/photo/manage/html/userAudit/cameristAuditManage.html";
		},
		error : function() {
			alert("服务器错误！");
		}
	});

}
