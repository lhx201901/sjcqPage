/**
 * 图片详情
 */
/**
 * 编辑区县信息
 * author cl
 */
var PARAM={}; //前一个页面传递的参数对象
var MAIN_PAGE_WINDOW = {};//前一个页面对象

$(document).ready(function(){
	laydate.render({
		  elem: '#picSysjEnd' //开始日期
	});
	PARAM= GetParamByRequest();
	
	searchBasicInfo(PARAM.id);
});
//获取基本信息
function searchBasicInfo(picId){
	$.ajax({
		url : "/sjcq/manage/getPicById", // 请求的url地址
		type : "post", // 请求方式
		dataType : "json", // 返回格式为json
		async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {
			picId : picId
		}, // 参数值
		success : function(data) {
			if(data!=null){				
				$("#picLyljm").attr("src",index_nav.PICURI+data.picLyljm);
				var endpic = data;
				$("#picXh").val(endpic.picXh);
				$("#picMcEnd").val(endpic.picMc);
				$("#picRemarkEnd").val(endpic.picRemark);
				$("#picFRemarkEnd").val(endpic.picFRemark);
				$("#picDdEnd").val(endpic.picDd);
				$("#picSyzEnd").val(endpic.picSyz);
				$("#picSysjEnd").val(endpic.picSysj==null?"":timecheck(endpic.picSysj));
				$("#picGjzEnd").val(endpic.picGjz);
				$("#picTypeEnd option[value='"+endpic.picType+"']").prop("selected", true);
				$("#picMjEnd option[value='"+endpic.picMj+"']").prop("selected", true);
				initSort(endpic,"contentUploadPicSortEnd");
			}
		},
		error : function() {
			layer.msg('查询加载失败！');
		}
	})
}
/**
 * 保存修改信息
 */
function saveModifyInfo(){
	var obj={};
	obj.id=PARAM.id;
	obj.picMc=$("#picMcEnd").val();
	obj.picRemark=$("#picRemarkEnd").val();
	obj.picFRemark=$("#picFRemarkEnd").val();
	obj.picDd=$("#picDdEnd").val();
	obj.picSyz=$("#picSyzEnd").val();
	if($("#picSysjEnd").val()&&$("#picSysjEnd").val().length>0){
	//	alert($("#picSysj").val());
		obj.picSysj=new Date($("#picSysjEnd").val().trim());
	}
	obj.picGjz=$("#picGjzEnd").val();
	obj.picMj=$("#picMjEnd").val();
	obj.picType=$("#picTypeEnd").val();
	obj.typeOne="";
	obj.typeTwo="";
	obj.typeThree="";
	obj.typeFour="";
	obj.typeFive="";
	var contentUploadPicSort= [];
	console.log($("#contentUploadPicSort"));
	$.each($("#contentUploadPicSortEnd").find(".sct"),function(index,item){
		console.log();
		if($(item).parent().attr("data-level")==1&&$(item).val()!='选择分类'){
			obj.typeOne=$(item).find("option:selected").text();
		}else if($(item).parent().attr("data-level")==2&&$(item).val()!='选择分类'){
			obj.typeTwo=$(item).find("option:selected").text();
		}else if($(item).parent().attr("data-level")==3&&$(item).val()!='选择分类'){
			obj.typeThree=$(item).find("option:selected").text();
		}else if($(item).parent().attr("data-level")==4&&$(item).val()!='选择分类'){
			obj.typeFour=$(item).find("option:selected").text();
		}else if($(item).parent().attr("data-level")==5&&$(item).val()!='选择分类'){
			obj.typeFive=$(item).find("option:selected").text();
		}
	})
	
	//执行数据编辑保存
	$.ajax({
	url : "/sjcq/manage/editAtvPic", // 请求的url地址
	type : "post", // 请求方式
	dataType : "json", // 返回格式为json
	async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
	data : JSON.stringify(obj) , // 参数值
	contentType:"application/json;charset=utf-8",
	success : function(data) {
		$box.promptBox(data.resultInfo);
/*		if(data.resultStatus==true || data.resultStatus=="true"){		
			$('#myModal').on('hidden.bs.modal', function () {
				parent.closableTab.closeThisTab(PARAM.tabId);
				MAIN_PAGE_WINDOW.searchAuditData();
			});
		}*/
	},
	error : function() {
		layer.msg('查询加载失败！');
	}
});
}
function search_tj_img(uuid){
    //获取图片列表
    var jsonstring = JSON.stringify({table:"d_photo_pic",term:"",tj_xh:uuid});
    in_search.search(1,100,"id","desc",jsonstring,function(data){
        console.log(data);
        var html = "";
        $(data.rows).each(function(i,row){
            html = html + '<li data-id="'+row.pic_jg+'">';
            html = html + '<div class="picn">';
            html = html + '<div class="picn_nbx">';
            html = html + '<p ><img src="'+index_nav.PICURI+row.pic_lylys+'"></p>';//onclick="photoDetail.search_img(\''+row.pic_xh+'\')"
            html = html + '<div class="ed_sel_ok"><i class="ico ico22"></i></div>';
            html = html + '</div>';
            html = html + '<div class="vjg">￥'+row.pic_jg+'</div>';
            html = html + '</div>';
            html = html + '</li>';   
        })
        $("#tj_pic").html(html);
    });
}
function appendPicSort(data,sortPxh,divId){
	var options='<option selected=selected>选择分类</option>';
	for(var i=0;i< data.length;i++){
		options=options+'<option value="'+data[i].sortXh+'">'+data[i].sortName+'</option>'
	}
	$("#"+divId).append(
		'<div class="img_sel" data-level="'+data[0].sortLevels+'" data-sortpxh="'+sortPxh+'">'
			+'<select class="sct" onchange=selectPicSort(this,'+data[0].sortLevels+',\''+sortPxh+'\',\''+divId+'\') >'
				+options
			+'</select> '
			+'<i class="ico ico60"></i>'
		+'</div>'	
	);

}
function picSortLoad(sortpxh,divId){
	var sortData= this.picTypeObj[sortpxh];
	if(sortData!=null||sortData!=undefined){
		this.appendPicSort(sortData,sortpxh,divId);
		return;
	}
	$.ajax({
	    url:"/sjcq/manage/picSort/findBySortPxh",    // 请求的url地址
	    type:"post",   // 请求方式
	    dataType:"json",   // 返回格式为json
	    async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
	    data:{sortPxh:sortpxh} ,    // 参数值     state 0:密码登录 1:验证码登录
	    success:function(data){
	    	if(data!=null&&data!=undefined&&data.length>0){
	    		picTypeObj[sortpxh]=data;
	    		appendPicSort(data,sortpxh,divId);
	    	}
	    },
	    error:function(){
	    	$box.promptBox('查询加载失败！');
	    }
	});
}
function timecheck(timestamp) {
	var term=Number(timestamp);
    var date = new Date(term);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    //return Y+M+D+h+m+s;
    return Y+M+D;
}
function selectPicSort(_this,sortLevels,sortpxh,divId){
	if(undefined==$(_this).val()||null==$(_this).val()||''==$(_this).val()){
		return false;
	}
	$(_this).parent().nextAll('.img_sel').remove();
	picSortLoad($(_this).val(),divId);
}
/**
 * 初始化分类
 */
function initSort(data,divId){

	console.log(data);
	console.log(divId);
	//加载选中图片分类
	var sortXhs=[];
	if(data.typeOne){
		var sortObj={};
		sortObj.sortXh="0"+data.typeOne;
		sortObj.sortPxh='0';
		sortObj.level=1;
		sortXhs.push(sortObj);
		if(data.typeTwo){
			sortObj={};
			sortObj.sortXh="0"+data.typeOne+data.typeTwo;
			sortObj.sortPxh="0"+data.typeOne;
			sortObj.level=2;
			sortXhs.push(sortObj);
			if(data.typeThree){
				sortObj={};
				sortObj.sortXh="0"+data.typeOne+data.typeTwo+data.typeThree;
				sortObj.sortPxh="0"+data.typeOne+data.typeTwo;
				sortObj.level=3;
				sortXhs.push(sortObj);
				if(data.typeFour){
					sortObj={};
					sortObj.sortXh="0"+data.typeOne+data.typeTwo+data.typeThree+data.typeFour;
					sortObj.sortPxh="0"+data.typeOne+data.typeTwo+data.typeThree;
					sortObj.level=4;
					sortXhs.push(sortObj);
					if(data.typeFive){
						sortObj={};
						sortObj.sortXh="0"+data.typeOne+data.typeTwo+data.typeThree+data.typeFour+data.typeFive;
    					sortObj.sortPxh="0"+data.typeOne+data.typeTwo+data.typeThree+data.typeFour;
    					sortObj.level=5;
    					sortXhs.push(sortObj);
					}
				}
			}
		}
	}
	console.log(sortXhs);
	/**
	 * 分类最初未选择时不能重新输入分类
	 */
	if(sortXhs.length>0){
		$.each(sortXhs,function(index,item){
			var options='<option>选择分类</option>';
			//如果缓存为空则执行请求加载分类数据
			$.ajax({
				url:"/sjcq/manage/picSort/findBySortPxh",    // 请求的url地址
				type:"post",   // 请求方式
				dataType:"json",   // 返回格式为json
				async:false,// 请求是否异步，默认为异步，这也是ajax重要特性
				data:{sortPxh:item.sortPxh} ,    // 参数值     state 0:密码登录 1:验证码登录
				success:function(data){
					if(data!=null&&data!=undefined&&data.length>0){
						picTypeObj=data;
					}
				},
				error:function(){
					$box.promptBox('查询加载失败！');
				}
			});
			console.log(picTypeObj);
			
			//加载下拉选项
			$.each( picTypeObj,function(index1,item1){
				if(item1.sortXh==item.sortXh){
					options=options+'<option selected=selected value="'+item1.sortXh+'">'+item1.sortName+'</option>'
				}else{
					options=options+'<option  value="'+item1.sortXh+'">'+item1.sortName+'</option>'
				}
        			
			})
    		$("#"+divId).append(
        			'<div class="img_sel" data-level="'+item.level+'" data-sortpxh="'+item.sortPxh+'">'
        				+'<select class="sct" onchange=selectPicSort(this,'+item.level+',\''+item.sortPxh+'\',\''+divId+'\') >'
        					+options
        				+'</select> '
        				+'<i class="ico ico60"></i>'
        			+'</div>'	
        	);
		})
	}else{
		var options='<option>选择分类</option>';
		 $.ajax({
	            url:"/sjcq/manage/picSort/findBySortPxh",    // 请求的url地址
	            type:"post",   // 请求方式
	            dataType:"json",   // 返回格式为json
	            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
	            data:{sortPxh:0} ,    // 参数值     state 0:密码登录 1:验证码登录
	            success:function(data){
	            	//加载下拉选项
					$.each( data,function(index1,item1){
						options=options+'<option  value="'+item1.sortXh+'">'+item1.sortName+'</option>'
		        			
					})
	        		$("#"+divId).append(
		        			'<div class="img_sel" data-level="1" data-sortpxh="0">'
		        				+'<select class="sct" onchange=selectPicSort(this,1,0,\''+divId+'\') >'
		        					+options
		        				+'</select> '
		        				+'<i class="ico ico60"></i>'
		        			+'</div>'	
		        	);
	            },
	            error:function(){
	            	$box.promptBox('查询加载失败！');
	            }
	        });
	}
}
