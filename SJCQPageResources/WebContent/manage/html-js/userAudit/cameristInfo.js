/**
 * 摄影师信息页js
 * author lxw
 */
var PARAM={}; //前一个页面传递的参数对象
var MAIN_PAGE_WINDOW = {};//前一个页面对象
var IFRAMEID_="";//当前iframid
var applyXh="";//申请序号
var PERSONID_="";
$(document).ready(function(){
	checksessoin();
	PARAM= GetParamByRequest();
	IFRAMEID_="tab_seed_"+PARAM.tabId;
	MAIN_PAGE_WINDOW = parent.document.getElementById("tab_frame_"+PARAM.MAIN_PAGE_ID_).contentWindow;
	if(PARAM.type){
		findContributorInfoById(PARAM.uuid);
	}else{
		findCameristInfoById(PARAM.applyXh);
	}
	
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
 * @param personId
 */
function findContributorInfoById(uuid){
	$.ajax({
	    url:"/sjcq//pAndD/findContributorDetailInfo",    //请求的url地址
	    dataType:"json",   //返回格式为json
	    async:true,//请求是否异步，默认为异步，这也是ajax重要特性
	    data:{uuid:uuid},    //参数值
	    type:"post",   //请求方式
	    success:function(data){
	    	$("#loginName").text(data.account.nickName==null?"":data.account.nickName);
	    	$("#phone").text(data.account.phone==null?"":data.account.phone);
	    	$("#realName").text(data.account.realName==null?"":data.account.realName);
	    	$("#namePy").text(data.account.spellName==null?"":data.account.spellName);
	    //	alert(data.contract.idnumber);
	    	$("#IDNumber").text(data.contract.idnumber==null?"":data.contract.idnumber);
	    	$("#sex").text(data.account.sex==1?"男":"女");
	    	$("#birthDay").text(data.account.birthDay==null?"":data.account.birthDay);
	    	$("#unit").text(data.account.unit==null?"":data.account.unit);
	    	$("#region").text(data.contract.region==null?"":data.contract.region);
	    	$("#address").text(data.contract.address==null?"":data.contract.address);
	    	$("#majorType").text(data.account.majorType==null?"":data.account.majorType);
	    	$("#experience").text(data.account.experience==null?"":data.account.experience);
	    	$("#postalCode").text(data.contract.postalCode==null?"":data.contract.postalCode);
	    	$("#bankName").text(data.contract.bankName==null?"":data.contract.bankName);
	    	$("#bankUser").text(data.contract.bankUser==null?"":data.contract.bankUser);
	    	$("#bankNumber").text(data.contract.bankNumber==null?"":data.contract.bankNumber);
	    	$("#actor").attr('src',index_nav.PICURI+data.account.actor);
	    	$("#cover").attr('src',index_nav.PICURI+data.account.cover);
	    	$("#IDPhotoZ").attr('src',index_nav.PICURI+data.contract.idphotoZ);
	    	$("#IDPhotoF").attr('src',index_nav.PICURI+data.contract.idphotoF);
	    	$("#bankCard").attr('src',index_nav.PICURI+data.contract.bankCard);
	    	/*if(data.apply.statu==0){
	    		$("#auditStatus").text("待审核");
	    	}else if(data.apply.statu==1){
	    		$("#auditStatus").text("审核通过");
	    	}else if(data.apply.statu==2){
	    		$("#auditStatus").text("审核不通过");
	    	}
	    	$("#userRemarks").val(data.apply.auditInfo);*/
	    	var photos=data.SamplePhoto;
	    	var html='';
	    	if(photos){
                 for(var i = 0;i<photos.length;i++){
                    var photo = photos[i];
                   // html+='<p>图片'+(i+1)+'</p><p>';
                    html+='<img src="'+index_nav.PICURI+photo.photoPath+'" style="width: 120px; height: 160px;border: 1px solid #C0C1C0;"/>';
                   // html+='</p><p>文字说明：'+photo.photoSm+'</p>';
                 }
	    	}
	    	$("#samplePhoto").empty();
	    	$("#samplePhoto").html(html);
	    	showImg();
	    	$("#shtr").css('display','none'); 
	    	$("#info1").css('display','none'); 
	    	$("#info2").css('display','none'); 
	    	var h= $("#person_info_content").height();
	    	setIframeHeight2(PARAM.tabId,h);
	    },
	    error:function(){
	        //请求出错处理
	    }
	})
}
/**
 * 根据序号加载详情
 * @param personId
 */
function findCameristInfoById(applyXh){
	$.ajax({
	    url:"/sjcq/contributorApply/getContributorApplyDetail",    //请求的url地址
	    dataType:"json",   //返回格式为json
	    async:true,//请求是否异步，默认为异步，这也是ajax重要特性
	    data:{applyXh:applyXh},    //参数值
	    type:"post",   //请求方式
	    success:function(data){
	    	PERSONID_=data.apply.id;
	    	$("#loginName").text(data.account.nickName==null?"":data.account.nickName);
	    	$("#phone").text(data.account.phone==null?"":data.account.phone);
	    	$("#realName").text(data.account.realName==null?"":data.account.realName);
	    	$("#namePy").text(data.account.spellName==null?"":data.account.spellName);
	    	$("#IDNumber").text(data.contract.idnumber==null?"":data.contract.idnumber);
	    	$("#sex").text(data.account.sex==1?"男":"女");
	    	$("#birthDay").text(data.account.birthDay==null?"":data.account.birthDay);
	    	$("#unit").text(data.account.unit==null?"":data.account.unit);
	    	$("#region").text(data.contract.region==null?"":data.contract.region);
	    	$("#address").text(data.contract.address==null?"":data.contract.address);
	    	$("#majorType").text(data.account.majorType==null?"":data.account.majorType);
	    	$("#experience").text(data.account.experience==null?"":data.account.experience);
	    	$("#postalCode").text(data.contract.postalCode==null?"":data.contract.postalCode);
	    	$("#bankName").text(data.contract.bankName==null?"":data.contract.bankName);
	    	$("#bankUser").text(data.contract.bankUser==null?"":data.contract.bankUser);
	    	$("#bankNumber").text(data.contract.bankNumber==null?"":data.contract.bankNumber);
	    	$("#actor").attr('src',index_nav.PICURI+data.account.actor);
	    	$("#cover").attr('src',index_nav.PICURI+data.account.cover);
	    	$("#IDPhotoZ").attr('src',index_nav.PICURI+data.contract.idphotoZ);
	    	$("#IDPhotoF").attr('src',index_nav.PICURI+data.contract.idphotoF);
	    	$("#bankCard").attr('src',index_nav.PICURI+data.contract.bankCard);
	    	if(data.apply.statu==0){
	    		$("#auditStatus").text("待审核");
	    	}else if(data.apply.statu==1){
	    		$("#auditStatus").text("审核通过");
	    	}else if(data.apply.statu==2){
	    		$("#auditStatus").text("审核不通过");
	    	}
	    	$("#userRemarks").val(data.apply.auditInfo);
	    	var photos=data.SamplePhoto;
	    	var html='';
	    	if(photos){
                 for(var i = 0;i<photos.length;i++){
                    var photo = photos[i];
                   // html+='<p>图片'+(i+1)+'</p><p>';
                    html+='<img src="'+index_nav.PICURI+photo.photoPath+'" style="width: 120px; height: 160px;border: 1px solid #C0C1C0;"/>';
                   // html+='</p><p>文字说明：'+photo.photoSm+'</p>';
                 }
	    	}
	    	$("#samplePhoto").empty();
	    	$("#samplePhoto").html(html);
	    	showImg();
	    	if(data.apply.statu==0){
	    		//$("#shtr").attr('disabled',true);
	    		//$("#shtr").css('display','block'); 
	    		$("#shtr").css('display','none'); 
	    	}else{
	    		//$("#shtr").attr('disabled',true);
	    		$("#shtr").css('display','none'); 
	    	}
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
		msg="确认审核不通过吗？";
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
	//var power=$(':radio[name="downPower"]:checked').val();
	$.ajax({
		url : "/sjcq/contributorApply/taskAudit", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {
			ids : PERSONID_,
			statu : passOrNo,
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
