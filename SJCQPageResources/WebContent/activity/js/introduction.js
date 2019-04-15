$(function() {
/*	var atuid = "43392ad9-8515-4d43-86c6-9651634819f6";*/
	//获取参数
	var url = window.location.search;
	// 正则筛选地址栏
	var reg = new RegExp("(^|&)"+ "atyXh" +"=([^&]*)(&|$)");
	// 匹配目标参数
	var result = url.substr(1).match(reg);
	//返回参数值
	atuid= result ? decodeURIComponent(result[2]) : null;
	//加载活动简介
	initEditData (atuid);
})



/**
 *  加载简介
 * @param activeId
 */
function initEditData (activeId){
	$.ajax({
		url : "/sjcq/manage/getActiveDetailInfo",
		dataType : "json", 
		async : true,
		data :  {activeId:activeId},
		type : "post", 
/*	    contentType : 'application/json;charset=utf-8',*/
		success : function(data) {
			if(null!=data&&undefined!=data){
				$.each(data,function(index,item){
					$(".hdis").append('<div id="'+item.contentXh+'" style="display:none"></div>');
					if("text"==item.contentType){
						textAddContent(item.contentXh);
					}else if("awardSetting"==item.contentType){
						awardSettingAddContent(item.contentXh);
					}else if("auditStandard"==item.contentType){
						auditStandardAddContent(item.contentXh);
					}else if("auditor"==item.contentType){
						auditorAddContent(item.contentXh);
					}else if("dateTimeArrange"==item.contentType){
						dateTimeArrangeAddContent(item.contentXh);
					}
				});
			}
		},
		error : function() {
			
		}
	});
}

//加载文本
function textAddContent(atContentXh){
	$.ajax({
		url : "/sjcq/manage/getActiveTemplateTextList",
		dataType : "json", 
		async : true,
		data :  {atContentXh:atContentXh},
		type : "post", 
/*	    contentType : 'application/json;charset=utf-8',*/
		success : function(data) {
			if(null!=data&&undefined!=data){
				$('#'+atContentXh).show();
				$('#'+atContentXh).append('<div class="tit">'+data[0].textTitle+'</div>');
				$('#'+atContentXh). append('<div class="con"> <iframe id="'+data[0].id+'"  style="width:100%"></iframe> </div>');
				$("#"+data[0].id).contents().find("body").append(data[0].textContent);
				$("#"+data[0].id).contents().find("body").attr("style","margin:0px");
				$("#"+data[0].id).contents().find("body").height("auto");
				$("#"+data[0].id).height($("#"+data[0].id).contents().find("body").height()+10);
			}
		},
		error : function() {
			
		}
	});
}

/**
 * 加载获奖设置
 * @param atContentXh
 */
function awardSettingAddContent(atContentXh){
	$.ajax({
		url : "/sjcq/manage/getActiveTemplateAwardSettingList",
		dataType : "json", 
		async : true,
		data :  {atContentXh:atContentXh},
		type : "post", 
/*	    contentType : 'application/json;charset=utf-8',*/
		success : function(data) {
			if(null!=data&&undefined!=data&&data.length>0){
				$('#'+atContentXh).show();
				$('#'+atContentXh).append('<div class="tit mt20">奖项设置</div>');
				var awardsItem="";
				$.each(data,function(index,item){
					awardsItem=awardsItem+'<li><p><img src="'+item.awardsettingPic+'"></p> <p class="f16">'+item.awardsettingItemName+'</p> <p class="gray9">'+item.awardsettingPrize+'</p></li>';
				});
				$('#'+atContentXh).append('<div class="jxshe"><ul class="clearfix">'+awardsItem+'</ul> </div>');
			}
		},
		error : function() {
			
		}
	});
}


/**
 * 加载审核标准
 * @param atContentXh
 */
function auditStandardAddContent(atContentXh){
	$.ajax({
		url : "/sjcq/manage/getActiveTemplateAuditStandardList",
		dataType : "json", 
		async : true,
		data :  {atContentXh:atContentXh},
		type : "post", 
/*	    contentType : 'application/json;charset=utf-8',*/
		success : function(data) {
			if(null!=data&&undefined!=data&&data.length>0){
				$('#'+atContentXh).show();
				$('#'+atContentXh).append('<div class="tit mt20">评审标准</div>');
				var auditStandard="";
				$.each(data,function(index,item){
					auditStandard=auditStandard+'<li><em>'+item.standardType+'</em> <p class="f16">'+item.standardTitle+'</p> <p class="mt5 gray9">'+item.standardContent+'</p></li>'
				});
				$('#'+atContentXh).append('<div class="timgap timgap2"><ul class="clearfix">'+auditStandard+'</ul> </div>');
			}
		},
		error : function() {
		}
	});
}


/**
 * 加载时间安排
 * @param atContentXh
 */
function dateTimeArrangeAddContent(atContentXh){
	$.ajax({
		url : "/sjcq/manage/getActiveTemplateDateTimeArrangeList",
		dataType : "json", 
		async : true,
		data :  {atContentXh:atContentXh},
		type : "post", 
/*	    contentType : 'application/json;charset=utf-8',*/
		success : function(data) {
			if(null!=data&&undefined!=data){
				$('#'+atContentXh).show();
				$('#'+atContentXh).append('<div class="tit mt20">时间安排</div>');
				var dateTimeArrange="";
				$.each(data,function(index,item){
					dateTimeArrange=dateTimeArrange+'<li><em>'+item.arrangeSeq+'</em> <p class="f16">'+item.arrangeThing+'</p> <p class="mt5 gray9">'+item.arrangeTime+'</p> </li>';
				});
				$('#'+atContentXh).append('<div class="timgap"><ul class="clearfix">'+dateTimeArrange+'</ul> </div>');
			}
		},
		error : function() {
		}
	});
}


/**
 * 加载审核者
 * @param atContentXh
 */
function auditorAddContent(atContentXh){
	$.ajax({
		url : "/sjcq/manage/getActiveTemplateAuditorList",
		dataType : "json", 
		async : true,
		data :  {atContentXh:atContentXh},
		type : "post", 
/*	    contentType : 'application/json;charset=utf-8',*/
		success : function(data) {
			if(null!=data&&undefined!=data){
				$('#'+atContentXh).show();
				$('#'+atContentXh).append('<div class="tit mt20">大赛评委</div>');
				var auditor="";
				$.each(data,function(index,item){
					
					auditor=auditor+'<li><div class="pwsr"><div class="pwimg"><img src="'+item.auditorPic+'" width="145" height="145"></div> <p class="name">'+item.auditorName+'</p> <p class="js">'+item.auditorIntroduce+'</p></div></li>';
				});
				$('#'+atContentXh).append('<div class="pwusr"><ul class="clearfix">'+auditor+'</ul> </div>');
			}
		},
		error : function() {
			
		}
	});
}
