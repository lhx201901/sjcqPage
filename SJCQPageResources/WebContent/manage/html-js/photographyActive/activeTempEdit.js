var PARAM_OBJ=null;
var deleteTemps={};
var SURE_DELETE={};
$(function() {
	PARAM_OBJ= GetParamByRequest();
	 initEditData (PARAM_OBJ.activeId)
    var ue = UE.getEditor('editor');
	$(".upload_file").on("change",function(){
		var _this=this;
	
	    var fileObj=this.files;
	    $.each(fileObj,function(index,item){
	        var reads= new FileReader();
		    var imageType = /^image\//;
		    //是否是图片
		    if (!imageType.test(item.type)) {
		        alert("请选择图片！");
		        return;
		    }
		    //读取完成
		    reads.readAsDataURL(item);
		    reads.onload = function(e) {
		        //图片路径设置为读取的图片
		        $(_this).parents(".awards_item_add").before(
		        		'<div class="awards_item"><div class="awardsImg"><img style="height:210px" src="'+e.target.result+'" /></div><div class="awardsItem clearFloat"><span>奖项:</span><input type="text" /></div><div class="awardsObject"><span>奖品:</span><input type="text" /></div>			<div >'
					/*	+'<button class="btn btn_other">确定</button>'*/
						+'<button class="btn btn_other btn_space" onclick="deleteAwardsItem(this)">删除</button>'
					+'</div></div>'
		        	) ;
		    };
	    });

	});

	$(".audit_standard_img > .asi_imgLable").on("click",function(){
        $(this).parents(".audit_standard_item_up").before(
        		'<div class="audit_standard_item">'
    			+'<div class="audit_standard_img">'
    				+'<input  type="text" style="width:30px"/>'
    			+'</div>'
     			+'<div class="audit_standard_content">'
    				+'<div>'
    					+'<span>标题:</span>'
    					+'<input class="audit_standard_bt" type="text"/>'
    				+'</div>'
    					+'<span>说明:</span>'
    					+'<textarea></textarea>'
    					+'<div class="btn_group">'
    						/*+'<button class="btn btn_width">确定</button>'*/
    						+'<button onclick="deleteStandardItem(this)" class="btn btn_width">删除</button>'
    					+'</div>'
    			+'</div> '
    		+'</div>	'
        	) ;
	});
	
	$(".date_time_arrange_img > .asi_imgLable").on("click",function(){
        $(this).parents(".date_time_arrange_item_up").before(
        		'<div class="date_time_arrange_item">'
    			+'<div class="date_time_arrange_img">'
    				+'<input  type="text" style="width:30px"/>'
    			+'</div>'
     			+'<div class="date_time_arrange_content">'
    				+'<div>'
    					+'<span>计划	:</span>'
    					+'<input class="date_time_arrange_bt" type="text"/>'
    				+'</div>'
    					+'<span>时间:</span>'
    					+'<textarea></textarea>'
    					+'<div class="btn_group">'
    						/*+'<button class="btn btn_width">确定</button>'*/
    						+'<button onclick="deleteDateTimeArrangeItem(this)" class="btn btn_width">删除</button>'
    					+'</div>'
    			+'</div> '
    		+'</div>	'
        	) ;
	});
	
	
	
	$(".adt_uploadFile").on("change",function(){
		var _this=this;
	    var fileObj=this.files;
	    var imageType = /^image\//;
	    $.each(fileObj,function(index,item){
		    var reads= new FileReader();
		    //是否是图片
		    if (!imageType.test(item.type)) {
		        alert("请选择图片！");
		        return;
		    }
		    //读取完成
		    reads.readAsDataURL(item);
		    reads.onload = function(e) {
	        //图片路径设置为读取的图片
		        $(_this).parents(".auditor_item_up").before(
		        		'<div class="auditor_item">'
		    				+'<div class="auditor_img"><img style="height:145px" src="'+e.target.result+'"/></div>'
		    				+'<div class="auditor_content">'
		    				+'<span class="auditor_bt"><input class="auditor_bt" type="text"/></span>'
		    				+'<p class="auditor_gz"><textarea ></textarea></p>'
		    				+'<div class="btn_group"><button class="btn btn_width" onclick="deleteAuditorItem(this)" >删除</button></div>'
		    			+'</div>'
		    		
		    		+'</div>'
		        	) ;
		    };
	    });
	});
});




/**
 * 增加文本录入
 */
function addText(){
	hideOthersEditor("text");
	if( $(".contentGroup").has(' .activeItem').length>0){
	    $(".contentGroup .activeItem").removeClass("activeItem").after('<div class="item activeItem" data-id="" data-type="text" data-order="1"><div class="font_center title_style"><input type="text" class="order_item"/><span>文本标题</span><a href="javascript:void(0)" class="delete_this_item"   >删除</a></div><span class="titlebs">标题:</span>	<div class="bt"></div><span class="titlebs">内容:</span><div class="content"></div></div>');
		
	}else{
	    $(".contentGroup .activeItem").removeClass("activeItem");
		$(".contentGroup").append('<div class="item activeItem" data-id="" data-type="text" data-order="1"><div class="font_center title_style"><input type="text" class="order_item"/><span>文本标题</span><a href="javascript:void(0)" class="delete_this_item"   >删除</a></div><span class="titlebs">标题:</span>	<div class="bt"></div><span class="titlebs">内容:</span><div class="content"></div></div>');
	}

	$(".item").on("click",function(){
		$(this).siblings().removeClass("activeItem");
		$(this).addClass("activeItem");
		bindNewAddItemClick(this)
	});
	
	$(".activeItem .delete_this_item").on("click",function(e){
		 deleteThisItem(this);
		 e.stopPropagation();
	});
	contentToBottom();
}



function addAwardSetting(){
	hideOthersEditor("awardSetting");
	if( $(".contentGroup").has(' .activeItem').length>0){
	    $(".contentGroup .activeItem").removeClass("activeItem").after('<div class="item activeItem" data-id="" data-type="awardSetting" data-order="1"><div class="font_center title_style"><input type="text" class="order_item"/><span>获奖设置</span><a href="javascript:void(0)" class="delete_this_item"  >删除</a></div></div>');
		
	}else{
		$(".contentGroup .item").removeClass("activeItem");
		$(".contentGroup").append('<div class="item activeItem" data-id="" data-type="awardSetting" data-order="1"><div class="font_center title_style"><input type="text" class="order_item"/><span>获奖设置</span><a href="javascript:void(0)" class="delete_this_item"  >删除</a></div></div>');
		
	}
	
	$(".item").on("click",function(){
		$(this).siblings().removeClass("activeItem");
		$(this).addClass("activeItem");
		bindNewAddItemClick(this)
	});
	$(".activeItem .delete_this_item").on("click",function(e){
		 deleteThisItem(this);
		 e.stopPropagation();
	});
	 $(".awardSetting .awards_item").remove();
	contentToBottom();
}
function addAuditStandard(){
	hideOthersEditor("auditStandard");
	if( $(".contentGroup").has(' .activeItem').length>0){
	    $(".contentGroup .activeItem").removeClass("activeItem").after('<div class="item activeItem" data-id="" data-type="auditStandard" data-order="1"><div class="font_center title_style"><input type="text" class="order_item"/><span>评审标准</span><a href="javascript:void(0)" class="delete_this_item"  >删除</a></div></div>');
	}else{
		$(".contentGroup .item").removeClass("activeItem");
		$(".contentGroup").append('<div class="item activeItem" data-id="" data-type="auditStandard" data-order="1"><div class="font_center title_style"><input type="text" class="order_item"/><span>评审标准</span><a href="javascript:void(0)" class="delete_this_item"  >删除</a></div></div>');
	}
	
	
	$(".item").on("click",function(){
		$(this).siblings().removeClass("activeItem");
		$(this).addClass("activeItem");
		bindNewAddItemClick(this)
	});
	$(".activeItem .delete_this_item").on("click",function(e){
		 deleteThisItem(this);
		 e.stopPropagation();
	});
	$(".audit_standard .audit_standard_items .audit_standard_item").remove();
	contentToBottom();
}
function addAuditor(_this){
	hideOthersEditor("auditor");
	if( $(".contentGroup").has('.activeItem').length>0){
	    $(".contentGroup .activeItem").removeClass("activeItem").after('<div class="item activeItem" data-id="" data-type="auditor" data-order="1"><div class="font_center title_style"><input type="text" class="order_item"/><span>大赛评委</span><a href="javascript:void(0)" class="delete_this_item"  >删除</a></div></div>');
	}else{
		$(".contentGroup .item").removeClass("activeItem");
		$(".contentGroup").append('<div class="item activeItem" data-id="" data-type="auditor" data-order="1"><div class="font_center title_style"><input type="text" class="order_item"/><span>大赛评委</span><a href="javascript:void(0)" class="delete_this_item"  >删除</a></div></div>');
	}
	$(".item").on("click",function(){
		$(this).siblings().removeClass("activeItem");
		$(this).addClass("activeItem");
		bindNewAddItemClick(this)
	});
	$(".activeItem .delete_this_item").on("click",function(e){
		 deleteThisItem(this);
		 e.stopPropagation();
	});
	 $(".auditor  .auditor_item").remove();
	contentToBottom();

}

function addDateTimeArrange(){
	hideOthersEditor("dateTimeArrange");
	if( $(".contentGroup").has(' .activeItem').length>0){
	    $(".contentGroup .activeItem").removeClass("activeItem").after('<div class="item activeItem" data-id="" data-type="dateTimeArrange" data-order="1"><div class="font_center title_style"><input type="text" class="order_item"/><span>时间安排</span><a href="javascript:void(0)" class="delete_this_item"  >删除</a></div></div>');
	}else{
		$(".contentGroup .item").removeClass("activeItem");
		$(".contentGroup").append('<div class="item activeItem" data-id="" data-type="dateTimeArrange" data-order="1"><div class="font_center title_style"><input type="text" class="order_item"/><span>时间安排</span><a href="javascript:void(0)" class="delete_this_item"  >删除</a></div></div>');
	}
	
	
	$(".item").on("click",function(){
		$(this).siblings().removeClass("activeItem");
		$(this).addClass("activeItem");
		bindNewAddItemClick(this);
	});
	$(".activeItem .delete_this_item").on("click",function(e){
		 deleteThisItem(this);
		 e.stopPropagation();
	});
	$(".date_time_arrange .date_time_arrange_items .date_time_arrange_item").remove();
	contentToBottom();
}


function removeItem(){
	$(".contentGroup .activeItem").remove(".activeItem");
}
/**
 * 编辑文本录入
 * @param _this
 */
function editText(_this){
	
	$("[name='contentTitle']").val($(_this).find(".bt").html());
	 UE.getEditor('editor').setContent($(_this).find(".content").html(), false);
}

/**
 * 编辑评审标准
 * @param _this
 */
function editAuditStandard(_this){
	$(".audit_standard .audit_standard_items .audit_standard_item").remove();
	$(_this).find(".audit_standard_item").each(function(i){
		var yx=	$(this).find(".psbz_img .audit_standard_yx span")[0].innerHTML;
		var bt=	$(this).find(".psbz_content .audit_standard_bt")[0].innerHTML;	
		var gz=	$(this).find(".psbz_content .audit_standard_gz")[0].innerHTML;	
	    $(".audit_standard .audit_standard_item_up").before(
        	'<div class="audit_standard_item" data-id="'+$(this).attr("data-id")+'">'
    			+'<div class="audit_standard_img">'
    				+'<input  type="text" style="width:30px" value="'+setNoToNoStr(yx)  +'" />'
    			+'</div>'
     			+'<div class="audit_standard_content">'
    				+'<div>'
    					+'<span>标题:</span>'
    					+'<input class="audit_standard_bt" type="text" value="'+setNoToNoStr(bt)  +'" />'
    				+'</div>'
    					+'<span>说明:</span>'
    					
    					+'<textarea value="'+setNoToNoStr(gz) +'" >'+ setNoToNoStr(gz)+'</textarea>'
    					+'<div class="btn_group">'
    						/*+'<button class="btn btn_width">确定</button>'*/
    						+'<button onclick="deleteStandardItem(this)" class="btn btn_width">删除</button>'
    					+'</div>'
    			+'</div> '
    		+'</div>	'
	    ) ;
    
	})
}

/**
 * 编辑奖项设置
 * @param _this
 */
function editAwardSetting(_this){
	$(".awardSetting .awards_item").remove();
	$(_this).find(".award_setting_item").each(function(i){
		var src=	$(this).find(".award_setting_img img")[0].src;
		var jx=	$(this).find(".award_setting_content .jx span")[0].innerHTML;	
		var jp=	$(this).find(".award_setting_content .jp span")[0].innerHTML;	
	    $(".awardSetting .awards_item_add").before(
	    		'<div class="awards_item" data-id="'+$(this).attr("data-id")+'"><div class="awardsImg"><img style="height:210px" src="'+src+'" /></div><div class="awardsItem clearFloat"><span>奖项:</span><input type="text" value="'+setNoToNoStr(jx) +'" /></div><div class="awardsObject"><span>奖品:</span><input type="text" value="'+setNoToNoStr(jp) +'" /></div>			<div >'
				/*+'<button class="btn btn_other">确定</button>'*/
				+'<button class="btn btn_other  btn_space" onclick="deleteAwardsItem(this)">删除</button>'
			+'</div></div>'
	    ) ;
    
	})
	
}


/**
 * 编辑评审人
 * @param _this
 */
function editAuditor(_this){
	 $(".auditor  .auditor_item").remove();
		$(_this).find(".auditor_item").each(function(i){
			var src=	$(this).find(".auditor_img img")[0].src;
			var jx=	$(this).find(".auditor_content .auditor_bt")[0].innerHTML;	
			var jp=	$(this).find(".auditor_content .auditor_gz")[0].innerHTML;	
		    $(".auditor .auditor_item_up").before(
	        		'<div class="auditor_item" data-id="'+$(this).attr("data-id")+'">'
    				+'<div class="auditor_img"><img style="height:145px" src="'+src+'"/></div>'
    				+'<div class="auditor_content">'
    				+'<span class="auditor_bt"><input class="auditor_bt" type="text" value="'+jx+'" /></span>'
    				+'<p class="auditor_gz"><textarea value="'+jp+'" >'+jp+'</textarea></p>'
    				+'<div class="btn_group"><button class="btn btn_width" onclick="deleteAuditorItem(this)" >删除</button></div>'
    			+'</div>'
    		
    		+'</div>'
		    ) ;
		})
}


/**
 * 编辑时间安排
 * @param _this
 */
function editDateTimeArrange(_this){
	$(".date_time_arrange .date_time_arrange_items .date_time_arrange_item").remove();
	$(_this).find(".date_time_arrange_item").each(function(i){
		var yx=	$(this).find(".sjap_img .date_time_arrange_yx span")[0].innerHTML;
		var bt=	$(this).find(".sjap_content .date_time_arrange_bt")[0].innerHTML;	
		var gz=	$(this).find(".sjap_content .date_time_arrange_gz")[0].innerHTML;	
	    $(".date_time_arrange .date_time_arrange_item_up").before(
        	'<div class="date_time_arrange_item" data-id="'+$(this).attr("data-id")+'">'
    			+'<div class="date_time_arrange_img">'
    				+'<input  type="text" style="width:30px" value="'+setNoToNoStr(yx)  +'" />'
    			+'</div>'
     			+'<div class="date_time_arrange_content">'
    				+'<div>'
    					+'<span>标题:</span>'
    					+'<input class="date_time_arrange_bt" type="text" value="'+setNoToNoStr(bt)  +'" />'
    				+'</div>'
    					+'<span>说明:</span>'
    					
    					+'<textarea value="'+setNoToNoStr(gz) +'" >'+ setNoToNoStr(gz)+'</textarea>'
    					+'<div class="btn_group">'
    						/*+'<button class="btn btn_width">确定</button>'*/
    						+'<button onclick="deleteDateTimeArrangeItem(this)" class="btn btn_width">删除</button>'
    					+'</div>'
    			+'</div> '
    		+'</div>	'
	    ) ;
    
	})
}




/**
 * 写入文本录入
 */
function writeToText(){
	$(".activeItem .bt").html($("[name='contentTitle']").val())  ;
	$(".activeItem .content").html(UE.getEditor('editor').getAllHtml())  ;
}



function uploadImg(that,imgName){
    var reads= new FileReader();
    var fileObj=that.files[0];
    var imageType = /^image\//;
    //是否是图片
    if (!imageType.test(fileObj.type)) {
        alert("请选择图片！");
        return;
    }
    //读取完成
    reads.readAsDataURL(fileObj);
    reads.onload = function(e) {
        //图片路径设置为读取的图片
        $("#"+imgName).attr('src',e.target.result) ;
    };
    $(that).parent().siblings('.mino-box').hide();
   	$(that).parent().siblings('.mino-img').show();
}

/**
 * 增加奖项设置--废除  
 * 
 */
function addAwardsItem(){
	$(".awardItems").append('		<div class="awards_item">'
			+'<div class="awardsImg">'
			+'<label class="imgLable" for="uploadFile1">'
			+		'<span class="up_adimg">图片上传</span>'
			+		'<input accept="image/*" class="upload_file" id="uploadFile1"  multiple="multiple"  hidden="hidden" type="file"/>'
			+	'<a>'
		
			+	'</a>'
			+'</label>'
		+'</div>'
		+'<div class="awardsItem"><span>奖项:</span><input type="text" /></div>'
		+'<div class="awardsObject"><span>奖品:</span><input type="text" /></div>'
	+'</div>');
	
}
/**
 * 删除奖项设置
 * @param _this
 */
function deleteAwardsItem(_this){
	
	$(_this).parents(".awards_item").hide(200,function(){
		 var tempId=$(".contentGroup .activeItem").attr("data-id");
		 var itemId=$(_this).parents(".awards_item").attr("data-id"); 
		 $(_this).parents(".awards_item").remove();
		 if(tempId!=undefined&&tempId!=null&&itemId!=undefined&&itemId!=null){
			 temDeleteTemporary(tempId,itemId);
		 }
	});

}

function deleteStandardItem(_this){
	$(_this).parents(".audit_standard_item").hide(200,function(){
		 var tempId=$(".contentGroup .activeItem").attr("data-id");
		 var itemId=$(_this).parents(".audit_standard_item").attr("data-id"); 
		$(_this).parents(".audit_standard_item").remove();
		 if(tempId!=undefined&&tempId!=null&&itemId!=undefined&&itemId!=null){
			 temDeleteTemporary(tempId,itemId);
		 }
	});

	
}

function deleteDateTimeArrangeItem(_this){
	$(_this).parents(".date_time_arrange_item").hide(200,function(){
		 var tempId=$(".contentGroup .activeItem").attr("data-id");
		 var itemId=$(_this).parents(".date_time_arrange_item").attr("data-id"); 
		$(_this).parents(".date_time_arrange_item").remove();
		 if(tempId!=undefined&&tempId!=null&&itemId!=undefined&&itemId!=null){
			 temDeleteTemporary(tempId,itemId);
		 }
	});

	
}



function deleteAuditorItem(_this){
	$(_this).parents(".auditor_item").hide(200,function(){
		 var tempId=$(".contentGroup .activeItem").attr("data-id");
		 var itemId=$(_this).parents(".auditor_item").attr("data-id"); 
		$(_this).parents(".auditor_item").remove();
		 if(tempId!=undefined&&tempId!=null&&itemId!=undefined&&itemId!=null){
			 temDeleteTemporary(tempId,itemId);
		 }
	});
}


function deleteThisItem(_this){
	$(_this).parents(".item").hide(200,function(){
		$(_this).parents(".item").remove();
		var tempId= $(_this).parents(".item").attr("data-id");
		if(tempId!=undefined&&tempId!=null){
			SURE_DELETE[tempId]={deleteAll:true,item:[]};//删除对象 deleteAll 是否全删(true-全删, false-只删除item中的数据)
		}
		showActiveEdit();
	});
	return false;
}

/**
 * 切换编辑器
 * @param type
 */
function hideOthersEditor(type){
	switch(type){
	case "text":
		$(".text_eitor").show(200);
		$(".auditor").hide();
		$(".audit_standard").hide();
		$(".awardSetting").hide();
		$(".date_time_arrange").hide();
		break;
	case "awardSetting":
		$(".text_eitor").hide();
		$(".auditor").hide();
		$(".audit_standard").hide();
		$(".awardSetting").show(200);
		$(".date_time_arrange").hide();
		break;
	case "auditStandard":
		$(".text_eitor").hide();
		$(".auditor").hide();
		$(".audit_standard").show(200);
		$(".awardSetting").hide();
		$(".date_time_arrange").hide();
		break;
	case "auditor":
		$(".text_eitor").hide();
		$(".auditor").show(200);
		$(".audit_standard").hide();
		$(".awardSetting").hide();
		$(".date_time_arrange").hide();
		break;
	case "dateTimeArrange":
		$(".text_eitor").hide();
		$(".auditor").hide();
		$(".audit_standard").hide();
		$(".awardSetting").hide();
		$(".date_time_arrange").show(200);
		break;	
	case "no":
		$(".text_eitor").hide();
		$(".auditor").hide();
		$(".audit_standard").hide();
		$(".awardSetting").hide();
		$(".date_time_arrange").hide();
		break;
	}
	
}

/**
 * 确定添加获奖设置
 */
function sureAwardSettingItems(){
	$(".contentGroup .activeItem .award_setting_item").remove();
	$(".awards_item").each(function(i){
		var src= $(this).find("img")[0].src;
		var jx= $(this).find(".awardsItem input")[0].value;
		var jp=$(this).find(".awardsObject input")[0].value;
		
		$(".contentGroup .activeItem").append( 		
	    '<div class="award_setting_item"  data-id="'+$(this).attr("data-id")+'">'
			+	'<div class="award_setting_img">'
			        +'<img style="height:210px" src="'+src+'" >'
			    +'</div>'
		+	'<div class="award_setting_content">'
			+	'<div class="jx"><span>'+setNoInfo(jx)+'</span></div>'
		+		'<div class="jp"><span>'+setNoInfo(jp)+'</span></div>'
		+	'</div>	'
		+'</div>');
	});
}



/**
 * 确定添加评审标准
 */
function sureAuditStandardItems(){
	$(".contentGroup .activeItem .audit_standard_item").remove();
	$(".audit_standard_items .audit_standard_item").each(function(i){
		var yx= $(this).find(".audit_standard_img input")[0].value;
		var jx= $(this).find(".audit_standard_content .audit_standard_bt")[0].value;
		var jp=$(this).find(".audit_standard_content textarea")[0].value;
		$(".contentGroup .activeItem").append( 		
				 '<div class="audit_standard_item" data-id="'+$(this).attr("data-id")+'">'
				+	'<div class="psbz_img">'
				+		'<div class="audit_standard_yx">'
				+			'<span>'+yx+'</span>'
				+		'</div>'
				+	'</div>'
		 		+	'<div class="psbz_content">'
				+		'<span class="audit_standard_bt">'+setNoInfo(jx)+'</span>'
				+		'<p class="audit_standard_gz">'+setNoInfo(jp)+'</p>'
				+	'</div> '
				+'</div>' 	
		);
	});
}
/**
 * 确定添加大赛评委
 */
function sureAuditorItems(){
	$(".contentGroup .activeItem .auditor_item").remove();
	
	$(".auditor .auditor_items .auditor_item").each(function(i){
		var yx= $(this).find(".auditor_img img")[0].src;
		var jx= $(this).find(".auditor_content input")[0].value;
		var jp=$(this).find(".auditor_gz textarea")[0].value;
		$(".contentGroup .activeItem").append( 		
		   		' <div class="auditor_item" data-id="'+$(this).attr("data-id")+'">'
	  				+'<div class="auditor_img"><img style="height:145px" src="'+yx+'"/></div>'
	  				+'<div class="auditor_content">'
	  					+'<span class="auditor_bt">'+setNoInfo(jx)+'</span>'
	  					+'<p class="auditor_gz">'+setNoInfo(jp)+'</p>'
	  				+'</div>'
	   		+'</div>'	);
	});
}



/**
 * 确定添加评审标准
 */
function sureDateTimeArrangeItems(){
	$(".contentGroup .activeItem .date_time_arrange_item").remove();
	$(".date_time_arrange_items .date_time_arrange_item").each(function(i){
		var yx= $(this).find(".date_time_arrange_img input")[0].value;
		var jx= $(this).find(".date_time_arrange_content .date_time_arrange_bt")[0].value;
		var jp=$(this).find(".date_time_arrange_content textarea")[0].value;
		$(".contentGroup .activeItem").append( 		
				 '<div class="date_time_arrange_item" data-id="'+$(this).attr("data-id")+'">'
				+	'<div class="sjap_img">'
				+		'<div class="date_time_arrange_yx">'
				+			'<span>'+yx+'</span>'
				+		'</div>'
				+	'</div>'
		 		+	'<div class="sjap_content">'
				+		'<span class="date_time_arrange_bt">'+setNoInfo(jx)+'</span>'
				+		'<p class="date_time_arrange_gz">'+setNoInfo(jp)+'</p>'
				+	'</div> '
				+'</div>' 	
		);
	});
}

/**
 * 确定编辑内容
 */
function sureInfo(){
  var dataType=	$(".contentGroup .activeItem").attr("data-type");
	if(dataType=="text"){
		writeToText();
	}else if(dataType=="awardSetting"){
		sureAwardSettingItems();
	}else if(dataType=="auditStandard"){
		sureAuditStandardItems();
	}else if(dataType=="auditor"){
		sureAuditorItems();
	}else if(dataType=="dateTimeArrange"){
		sureDateTimeArrangeItems();
	}
	sureDeleteItem();  
}

/**
 * 设置为无
 */
function setNoInfo(info){
	if(info==undefined)
		return "无"
	if(info==null)
		return "无"	
	if(info=="")
		return "无"
		
	return 	info
}

/**
 * 设置为""
 */
function setNoToNoStr(info){
	if(info=="无")
		return ""
	if(info==null)
		return ""	
	if(info==undefined)
		return ""
		
	return 	info
}


/**
 * 点击左边的item触发事件
 * @param _this
 */
function bindNewAddItemClick(_this){
		deleteTemps={};
		if($(_this).attr("data-type")=="text"){
			hideOthersEditor("text");
			editText(_this);
		}else if($(_this).attr("data-type")=="awardSetting"){
			hideOthersEditor("awardSetting");
			editAwardSetting(_this);
		}else if($(_this).attr("data-type")=="auditStandard"){
			hideOthersEditor("auditStandard");
			editAuditStandard(_this);
		}else if($(_this).attr("data-type")=="auditor"){
			hideOthersEditor("auditor");
			editAuditor(_this);
		}else if($(_this).attr("data-type")=="dateTimeArrange"){
			hideOthersEditor("dateTimeArrange");
			editDateTimeArrange(_this);
		}
}




/**
 * 追加
 *//*
function appendInfo(){
	$(".zxdz .btn").removeClass("active");
	$(".zxdz button[name='appendInfo']").addClass("active");
}
*//**
 * 修改
 *//*
function editInfo(){
	$(".zxdz .btn").removeClass("active");
	$(".zxdz button[name='editInfo']").addClass("active");
}*/

/**
 * 沉底
 */
function contentToBottom(){
	 $('.contentGroup').animate({scrollTop:$(".activeItem").offset().top}, 800);
}

/**
 * 显示激活的编辑
 */
function showActiveEdit(){
	var dataType= $(".contentGroup .activeItem").attr("data-type");
	if(dataType){
		hideOthersEditor(dataType);
	}else{
		hideOthersEditor("no");
		
	}
}

/**
 * 确定提交
 */
function sureSubmitInfo(){
	var data=[];
	$(".contentGroup .item").each(function(i){
		_this=this;
		var obj={};
		obj.atyXh=PARAM_OBJ.activeId;
		obj.id=$(this).attr("data-id");
		if(undefined==$(this).find(".order_item")[0].value||null==$(this).find(".order_item")[0].value||""==$.trim($(_this).find(".order_item")[0].value)){
			obj.contentOrder=0;
		}else{
			obj.contentOrder=$(this).find(".order_item")[0].value;
		}
		
		if($(this).attr("data-type")=="text"){
			obj.type="text";
			obj.id=$(this).attr("data-id");
			obj.textTitle=$(this).find(".bt")[0].innerHTML;
			obj.textContent= $(this).find(".content")[0].innerHTML;
			obj.textId= $($(this).find(".bt")).attr("data-id"); 
		}else if($(this).attr("data-type")=="awardSetting"){
			obj.type="awardSetting";
			var awardSettingList=[];
			var oneItem={};
			$(this).find(".award_setting_item").each(function(i){
				oneItem={};
				oneItem.awardsettingPic=$(this).find(".award_setting_img img")[0].src;
				oneItem.awardsettingItemName=$(this).find(".award_setting_content .jx span")[0].innerHTML;	
				oneItem.awardsettingPrize=	$(this).find(".award_setting_content .jp span")[0].innerHTML;
				oneItem.id=$(this).attr("data-id");
				awardSettingList.push(oneItem);
			});
			obj.content=awardSettingList;
		}else if($(this).attr("data-type")=="auditStandard"){
			obj.type="auditStandard";
			var auditStandardList=[];
			var oneItem={};
			$(this).find(".audit_standard_item").each(function(i){
				oneItem={};
				var yx=	$(this).find(".psbz_img .audit_standard_yx span")[0].innerHTML;
				var bt=	$(this).find(".psbz_content .audit_standard_bt")[0].innerHTML;	
				var gz=	$(this).find(".psbz_content .audit_standard_gz")[0].innerHTML;
				oneItem.standardType=$(this).find(".psbz_img .audit_standard_yx span")[0].innerHTML;
				oneItem.standardTitle=$(this).find(".psbz_content .audit_standard_bt")[0].innerHTML;	
				oneItem.standardContent=$(this).find(".psbz_content .audit_standard_gz")[0].innerHTML;	
				oneItem.id=$(this).attr("data-id");
				auditStandardList.push(oneItem);
			})
			obj.content=auditStandardList;
		}else if($(this).attr("data-type")=="auditor"){
			obj.type="auditor";
			var auditorList=[];
			var oneItem={};
			$(this).find(".auditor_item").each(function(i){
				 oneItem={};
				oneItem.auditorPic=$(this).find(".auditor_img img")[0].src;
				oneItem.auditorName=$(this).find(".auditor_content .auditor_bt")[0].innerHTML;	
				oneItem.auditorIntroduce=$(this).find(".auditor_content .auditor_gz")[0].innerHTML;	
				oneItem.id=$(this).attr("data-id");
				auditorList.push(oneItem);
			})
			obj.content=auditorList;
		}else if($(this).attr("data-type")=="dateTimeArrange"){
			obj.type="dateTimeArrange";
			var dateTimeArrangeList=[];
			var oneItem={};
			$(this).find(".date_time_arrange_item").each(function(i){
				oneItem={};
				var yx=	$(this).find(".sjap_img .date_time_arrange_yx span")[0].innerHTML;
				var bt=	$(this).find(".sjap_content .date_time_arrange_bt")[0].innerHTML;	
				var gz=	$(this).find(".sjap_content .date_time_arrange_gz")[0].innerHTML;
				oneItem.arrangeSeq=$(this).find(".sjap_img .date_time_arrange_yx span")[0].innerHTML;
				oneItem.arrangeThing=$(this).find(".sjap_content .date_time_arrange_bt")[0].innerHTML;	
				oneItem.arrangeTime=$(this).find(".sjap_content .date_time_arrange_gz")[0].innerHTML;	
				oneItem.id=$(this).attr("data-id");
				dateTimeArrangeList.push(oneItem);
			})
			obj.content=dateTimeArrangeList;
		}
		data.push(obj);
	});
	 goSubmit(data);
	console.log(data);
}

function  goSubmit(subData){
	$.ajax({
		url : "/sjcq/manage/deleteTemplateItems", 
		dataType : "json", 
		async : false,
		data :  JSON.stringify( SURE_DELETE),
		type : "post", 
		contentType : 'application/json;charset=utf-8',
		success : function(data) {
			
		},
		error : function() {
			
		}
	});

	
	$.ajax({
		url : "/sjcq/manage/submitActiveDetail", //物理删除，逻辑删除logicDeleteByIds、物理删除deleteDataByIds
		dataType : "json", 
		async : true,
		data :  JSON.stringify( subData),
		type : "post", 
	   contentType : 'application/json;charset=utf-8',
		success : function(data) {
			alert(data.resultInfo);
			location.reload();
		},
		error : function() {
			
		}
	});
}


/**
 * 初始化编辑数据
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
					if("text"==item.contentType){
						textAddContent(item.contentXh,item.contentOrder);
					}else if("awardSetting"==item.contentType){
						awardSettingAddContent(item.contentXh,item.contentOrder);
					}else if("auditStandard"==item.contentType){
						auditStandardAddContent(item.contentXh,item.contentOrder);
					}else if("auditor"==item.contentType){
						auditorAddContent(item.contentXh,item.contentOrder);
					}else if("dateTimeArrange"==item.contentType){
						dateTimeArrangeAddContent(item.contentXh,item.contentOrder);
					}
				});
			}
		},
		error : function() {
			
		}
	});
}

function textAddContent(atContentXh,contentOrder){
	$(".contentGroup").append('<div class="item" data-id="'+atContentXh+'" data-type="text" data-order="1"><div class="font_center title_style"><input type="text" value="'+contentOrder+'" class="order_item"/><span>文本标题</span><a href="javascript:void(0)" class="delete_this_item"   >删除</a></div><span class="titlebs">标题:</span>	<div class="bt"></div><span class="titlebs">内容:</span><div class="content"></div></div>');
	$.ajax({
		url : "/sjcq/manage/getActiveTemplateTextList",
		dataType : "json", 
		async : true,
		data :  {atContentXh:atContentXh},
		type : "post", 
/*	    contentType : 'application/json;charset=utf-8',*/
		success : function(data) {
			if(null!=data&&undefined!=data){
				$('.contentGroup > div[data-id="'+atContentXh+'"] .bt').html(data[0].textTitle);
				$('.contentGroup > div[data-id="'+atContentXh+'"] .content').html(data[0].textContent);
				$('.contentGroup > div[data-id="'+atContentXh+'"] .bt').attr("data-id",data[0].id);
			}
			$(".item").on("click",function(){
				$(this).siblings().removeClass("activeItem");
				$(this).addClass("activeItem");
				bindNewAddItemClick(this)
			});
			
			$(".delete_this_item").on("click",function(e){
				 deleteThisItem(this);
				 e.stopPropagation();
			});
		},
		error : function() {
			
		}
	});
}
function awardSettingAddContent(atContentXh,contentOrder){
	$(".contentGroup").append('<div class="item" data-id="'+atContentXh+'" data-type="awardSetting" data-order="1"><div class="font_center title_style"><input type="text" value="'+contentOrder+'" class="order_item"/><span>获奖设置</span><a href="javascript:void(0)" class="delete_this_item"  >删除</a></div></div>');
	$.ajax({
		url : "/sjcq/manage/getActiveTemplateAwardSettingList",
		dataType : "json", 
		async : true,
		data :  {atContentXh:atContentXh},
		type : "post", 
/*	    contentType : 'application/json;charset=utf-8',*/
		success : function(data) {
			if(null!=data&&undefined!=data){
				$.each(data,function(index,item){
					$('.contentGroup > div[data-id="'+atContentXh+'"]').append( 		
						    '<div class="award_setting_item" data-id="'+item.id+'">'
							+	'<div class="award_setting_img">'
							        +'<img style="height:210px" src="'+item.awardsettingPic+'" >'
							    +'</div>'
						+	'<div class="award_setting_content">'
							+	'<div class="jx"><span>'+setNoInfo(item.awardsettingItemName)+'</span></div>'
							+	'<div class="jp"><span>'+setNoInfo(item.awardsettingPrize)+'</span></div>'
						+	'</div>	'
						+'</div>');
				});
				$(".item").on("click",function(){
					$(this).siblings().removeClass("activeItem");
					$(this).addClass("activeItem");
					bindNewAddItemClick(this)
				});
				
				$(".delete_this_item").on("click",function(e){
					 deleteThisItem(this);
					 e.stopPropagation();
				});
			}
		},
		error : function() {
			
		}
	});
}
function auditStandardAddContent(atContentXh,contentOrder){
	$(".contentGroup").append('<div class="item" data-id="'+atContentXh+'" data-type="auditStandard" data-order="1"><div class="font_center title_style"><input type="text" value="'+contentOrder+'" class="order_item"/><span>评审标准</span><a href="javascript:void(0)" class="delete_this_item"  >删除</a></div></div>');
	$.ajax({
		url : "/sjcq/manage/getActiveTemplateAuditStandardList",
		dataType : "json", 
		async : true,
		data :  {atContentXh:atContentXh},
		type : "post", 
/*	    contentType : 'application/json;charset=utf-8',*/
		success : function(data) {
			if(null!=data&&undefined!=data){
				$.each(data,function(index,item){
					$('.contentGroup > div[data-id="'+atContentXh+'"]').append( 
							 '<div class="audit_standard_item" data-id="'+item.id+'">'
							+	'<div class="psbz_img">'
							+		'<div class="audit_standard_yx">'
							+			'<span>'+item.standardType+'</span>'
							+		'</div>'
							+	'</div>'
					 		+	'<div class="psbz_content">'
							+		'<span class="audit_standard_bt">'+setNoInfo(item.standardTitle)+'</span>'
							+		'<p class="audit_standard_gz">'+setNoInfo(item.standardContent)+'</p>'
							+	'</div> '
							+'</div>' 			
					);
				});
				$(".item").on("click",function(){
					$(this).siblings().removeClass("activeItem");
					$(this).addClass("activeItem");
					bindNewAddItemClick(this)
				});
				
				$(".delete_this_item").on("click",function(e){
					 deleteThisItem(this);
					 e.stopPropagation();
				});
			}
		},
		error : function() {
		}
	});
}


function dateTimeArrangeAddContent(atContentXh,contentOrder){
	$(".contentGroup").append('<div class="item" data-id="'+atContentXh+'" data-type="dateTimeArrange" data-order="1"><div class="font_center title_style"><input type="text" value="'+contentOrder+'"  class="order_item"/><span>时间安排</span><a href="javascript:void(0)" class="delete_this_item"  >删除</a></div></div>');
	$.ajax({
		url : "/sjcq/manage/getActiveTemplateDateTimeArrangeList",
		dataType : "json", 
		async : true,
		data :  {atContentXh:atContentXh},
		type : "post", 
/*	    contentType : 'application/json;charset=utf-8',*/
		success : function(data) {
			if(null!=data&&undefined!=data){
				$.each(data,function(index,item){
					$('.contentGroup > div[data-id="'+atContentXh+'"]').append( 
							 '<div class="date_time_arrange_item" data-id="'+item.id+'">'
							+	'<div class="sjap_img">'
							+		'<div class="date_time_arrange_yx">'
							+			'<span>'+item.arrangeSeq+'</span>'
							+		'</div>'
							+	'</div>'
					 		+	'<div class="sjap_content">'
							+		'<span class="date_time_arrange_bt">'+setNoInfo(item.arrangeThing)+'</span>'
							+		'<p class="date_time_arrange_gz">'+setNoInfo(item.arrangeTime)+'</p>'
							+	'</div> '
							+'</div>' 			
					);
				});
				$(".item").on("click",function(){
					$(this).siblings().removeClass("activeItem");
					$(this).addClass("activeItem");
					bindNewAddItemClick(this)
				});
				
				$(".delete_this_item").on("click",function(e){
					 deleteThisItem(this);
					 e.stopPropagation();
				});
			}
		},
		error : function() {
		}
	});
}

function auditorAddContent(atContentXh,contentOrder){
	$(".contentGroup").append('<div class="item" data-id="'+atContentXh+'" data-type="auditor" data-order="1"><div class="font_center title_style"><input type="text" value="'+contentOrder+'" class="order_item"/><span>大赛评委</span><a href="javascript:void(0)" class="delete_this_item"  >删除</a></div></div>');
	$.ajax({
		url : "/sjcq/manage/getActiveTemplateAuditorList",
		dataType : "json", 
		async : true,
		data :  {atContentXh:atContentXh},
		type : "post", 
/*	    contentType : 'application/json;charset=utf-8',*/
		success : function(data) {
			if(null!=data&&undefined!=data){
				$.each(data,function(index,item){
					$('.contentGroup > div[data-id="'+atContentXh+'"]').append( 		
					   		' <div class="auditor_item" data-id="'+item.id+'">'
				  				+'<div class="auditor_img"><img style="height:145px" src="'+item.auditorPic+'"/></div>'
				  				+'<div class="auditor_content">'
				  					+'<span class="auditor_bt">'+setNoInfo(item.auditorName)+'</span>'
				  					+'<p class="auditor_gz">'+setNoInfo(item.auditorIntroduce)+'</p>'
				  				+'</div>'
				   		+'</div>'	);
				});
				$(".item").on("click",function(){
					$(this).siblings().removeClass("activeItem");
					$(this).addClass("activeItem");
					bindNewAddItemClick(this)
				});
				
				$(".delete_this_item").on("click",function(e){
					 deleteThisItem(this);
					 e.stopPropagation();
				});
			}
		},
		error : function() {
			
		}
	});
}
/**
 * 删除文本
 */
function deleteTemplate(ids,isDeleteAll){
	$.ajax({
		url : "/sjcq/manage/deleteText",
		dataType : "json", 
		async : true,
		data :  {isDeleteAll:isDeleteAll,delIds:ids},
		type : "post", 
		success : function(data) {

		},
		error : function() {
			
		}
	});
}

/**
 * 临时删除的数据
 * @param tempId
 * @param itemId
 */
function temDeleteTemporary(tempId,itemId){
	if(undefined==deleteTemps[tempId]||null==deleteTemps[tempId]){
		deleteTemps[tempId]=[];
	}
	deleteTemps[tempId].push(itemId);
}

/**
 * 确定要删除的数据
 */
function sureDeleteItem(){
	for(var tempId  in deleteTemps){
		if(undefined==SURE_DELETE[tempId]||null==SURE_DELETE[tempId]){
			SURE_DELETE[tempId]={};
			SURE_DELETE[tempId].deleteAll=false;
			SURE_DELETE[tempId].item=[];
		}
		SURE_DELETE[tempId].item=SURE_DELETE[tempId].item.concat(deleteTemps[tempId]);
	}
}




