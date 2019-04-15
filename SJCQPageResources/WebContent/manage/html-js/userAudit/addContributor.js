var ROLEID_ = "";// 序号
var MODULEOBJ_ = {};// 定义模块树
var USEROBJ_ = {};// 定义部门树
var PARAM = {}; // 前一个页面的参数对象
var MAIN_PAGE_WINDOW = {};// 前一个页面对象
$(document).ready(
		function() {
			checksessoin();
			PARAM = GetParamByRequest();
			MAIN_PAGE_WINDOW = parent.document.getElementById("tab_frame_"+ PARAM.MAIN_PAGE_ID_).contentWindow;
			//初始化
			application.init();
});

/**
 * 图片信息
 */
var application={
		imgId:1,
		imgs:{},
		imgPathObj:{},
		sczId:'',
		//初始化
		init:function(){
			$('.apl_sex').on('click',function(){//申请供稿
    			$('.apl_sex').removeClass('selt');
    			$(this).addClass('selt');
    			$('.apl_sex i').removeClass('ico56').addClass('ico55');
    			$(this).find('i').removeClass('ico55').addClass('ico56');
    		});
		},
		verificationImgs:{
			
		},
		initHtml:function(){
			
		},
		//清除缓存页面数据
		clearData:function(){
			
		},
		//验证信息上传图片插件
		verificationUploadImg:function(that,imgName){
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
		    console.log(fileObj);
		    fileObj.fileType='合同';
		    application.verificationImgs[imgName]=fileObj;
		    console.log( application.verificationImgs);
		    $(that).parent().siblings('.mino-box').hide();
		   	$(that).parent().siblings('.mino-img').show();
		},
		//下一步
		submitBasicInfo:function(){
			var objParam=application.imgPathObj;
			objParam.aplInfoBasicRealName=$("input[name='aplInfoBasicRealName']").val();
			objParam.aplInfoBasicNameSpell=$("input[name='aplInfoBasicNameSpell']").val();
			objParam.aplInfoBasicCellPhone=$("input[name='aplInfoBasicCellPhone']").val();
			objParam.aplSex=$('.selt').attr('data');
			objParam.aplInfoBasicCompany=$("input[name='aplInfoBasicCompany']").val();
			objParam.vfctIdentityCard=$("input[name='vfctIdentityCard']").val();
			objParam.address=$("input[name='address']").val();
			objParam.region=$("input[name='region']").val();
			objParam.postcode=$("input[name='postcode']").val();
			objParam.bankCard=$("input[name='bankCard']").val();
			objParam.bankUserName=$("input[name='bankUserName']").val();
			objParam.bankName=$("input[name='bankName']").val();
			objParam.picSczId=application.sczId;
			objParam.vfctIdea=$(".raCur").attr("data");
			objParam.personType=$("#personType").val();
			console.log(objParam);
			var imgCount=0;
			 var phone = /^1[34578]\d{9}$/;//手机号码正则表达式
			 if (!phone.test(objParam.aplInfoBasicCellPhone.trim())) {
				 layer.alert("请输入正确的手机号码！");
				 return;
		      }
			for(var i in application.imgs){
				imgCount++;
			}
			if($('.aplImgBox .imgItem').length<2){
				layer.alert("请先选择两张及以上的样品图！！");
				return ;
			}
			var sccs=0;
			if(imgCount==0){
				objParam.imgCount=0;
				objParam.sccs=0;
				fileUploadPlug.fileUpload("/sjcq/account/saveContributorInfo", null, 0, fileUploadPlug.settingSize, objParam, fileUploadPlug.getTempImgId())
			}else{
				for(var i in application.imgs){
					sccs=sccs+1;
					objParam.imgCount=imgCount;
					objParam.sccs=sccs;
					fileUploadPlug.fileUpload("/sjcq/account/saveContributorInfo", application.imgs[i], 0, fileUploadPlug.settingSize, objParam, fileUploadPlug.getTempImgId())
				}
				//弹出提示框
				//$box.promptSureBox(, fun, param)
			}
		},
		//查询申请基本信息
		displayBasicInfo:function(){},
		upSampleImg:function(that,imgName){
			this.imgId=this.imgId+1;
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
		        $('.user_update>.aplImgBox').append('<div class="imgItem" data-id="'+application.imgId+'" style="display:inline-block;padding:5px"><img src="'+e.target.result+'" style="width:100px;height:100px"/><div class="ed_sel_ok" style="background-color:red"><i class="ico ico48" style="float:right" onclick="application.deleteImg(this)"></i></div></div>')
		    	if($('.aplImgBox .imgItem').length>=5){
		    		$('.aplInputFile').hide();
		    	}
		    };
		    fileObj.fileType="样品";
		    console.log(fileObj);
		    application.imgs[application.imgId]=fileObj;
		},
		deleteImg:function(_this,dataBaseId){
			//如果以保存的图片则执行后台删除
			if(dataBaseId!=undefined&&dataBaseId!=null){
		        $.ajax({
		            url:"/sjcq/account/deleteThisImg",    // 请求的url地址
		            type:"post",   // 请求方式
		            contentType : 'application/json;charset=utf-8',
		            dataType:"json",   // 返回格式为json
		            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
		            data:JSON.stringify({uuid:dataBaseId}) ,
		            success:function(data){
		            	if(data){
		            		$(_this).parent().parent(".imgItem").remove();
		        	    	if($('.aplImgBox .imgItem').length<5){
		        	    		$('.aplInputFile').show();
		        	    	}
		            	}else{
		            		layer.alert("删除失败!");
		            	}
		            },
		            error:function(){
		            	layer.alert("系统异常!");
		            }
		        });
		        return;
			}
			$(_this).parent().parent(".imgItem").remove();
			var dataid= $(_this).parent().parent(".imgItem").attr("data-id");
			delete application.imgs[dataid];
	    	if($('.aplImgBox .imgItem').length<5){
	    		$('.aplInputFile').show();
	    	}
		},
		applyAgain:function(){//再次申请
			changeTabStyle("application");//页签样式重置
			this.restBasicInfo();//数据重置
			applicationTab("basic")
		},
		//显示验证保存信息
		displayVerification:function(){},
		submitVerification:function(){//验证信息提交
			if($('.aplImgBox .imgItem').length<2){
				layer.alert("请先选择两张及以上的样品图！！");
				return ;
			}
			var obj={};
			obj.vfctIdentityCard=$("input[name='vfctIdentityCard']").val();
			obj.address=$("input[name='address']").val();
			obj.postcode=$("input[name='postcode']").val();
			obj.bankCard=$("input[name='bankCard']").val();
			obj.bankUserName=$("input[name='bankUserName']").val();
			obj.bankName=$("input[name='bankName']").val();
			obj.vfctIdea=$(".raCur").attr("data");
			obj.personType=$("#personType").val();
			if($("input[name='sczid']").val()&&$("input[name='sczid']").val().length>0){
				application.sczId=$("input[name='sczid']").val()+"";
			}else{
				application.sczId=(new Date()).valueOf()+"";
			}
			obj.picSczId=application.sczId;
			obj.type=0;
			var imgInfo={}
			var data = new FormData();
			for(var i in application.verificationImgs ){
				var file=application.verificationImgs[i];
				data.append(i , file.slice(0,file.size));
				imgInfo[i]={"field":i,"fileName":file.name} 
			}
			data.append("upInfo", JSON.stringify(obj));
			data.append("imgInfo",JSON.stringify(imgInfo));
			layer.alert("开始上传供稿人信息！");
			$.ajax({
			    url: "/sjcq/account/saveVerificationPhoto",
			    type: 'POST',
			    cache: false,
			    data: data,
			    async:false,
			    processData: false,
			    contentType: false
			}).done(function(res) {
				console.log(res);
            	if(res.status=="success"){
            		layer.alert("身份验证图片上传成功！");
            		if(res.data){            			
            			application.imgPathObj.behindeImg=res.data.behindeImg;
            			application.imgPathObj.frontImg=res.data.frontImg;
            			application.imgPathObj.BankCardImg=res.data.BankCardImg;
            			application.imgPathObj.actorImg=res.data.actorImg;
            			application.imgPathObj.coverImg=res.data.coverImg;
            			console.log(res.data);
            			console.log("===============================");
            			console.log(application.imgPathObj);
            		}else{
            			application.imgPathObj.behindeImg="";
            			application.imgPathObj.frontImg="";
            			application.imgPathObj.BankCardImg="";
            			application.imgPathObj.actorImg="";
            			application.imgPathObj.coverImg="";
            		}
            		application.submitBasicInfo();
            	}else{
            		layer.alert(res.message);
            	}
			}).fail(function(res) {
				layer.alert(res.message)
			});		
			
		}
}
//断点续传
var fileUploadPlug={
		settingSize:10485760,
		fileUpload:function(url,file,nowSize,settingSize,upInfo,tempImgId){
			
			var data = new FormData();

			if(file==null){
				data.append("upInfo", JSON.stringify(upInfo));
				data.append("imgInfo",JSON.stringify({"theSize":0,"imgSize":0+"","imgName":"","imgType":"","tempImgId":tempImgId}) );
			}else{
				var name = file.name;
				var fileType = name.substring(name.lastIndexOf(".") + 1).toLowerCase();
			//	data.append("fileName", encodeURIComponent(name));
				var endSize=settingSize;

				if(settingSize>file.size-nowSize){
					endSize=file.size;
				}else{
					endSize=nowSize+settingSize;
				}
				data.append("myFile", file.slice(nowSize,endSize));
					data.append("upInfo", JSON.stringify(upInfo));
					data.append("imgInfo",JSON.stringify({"theSize":endSize,"imgSize":file.size+"","imgName":name,"imgType":file.type,"tempImgId":tempImgId}) );
					
			}
			$.ajax({
			    url: url,
			    type: 'POST',
			    cache: false,
			    data: data,
			    async:false,
			    processData: false,
			    contentType: false
			}).done(function(res) {
				if(endSize-nowSize>=settingSize){
					fileUploadPlug.fileUpload(url,file,nowSize+settingSize,settingSize,upInfo,tempImgId);
				}
				try {
					if(endSize==file.size){
						layer.alert("保存成功!");
						MAIN_PAGE_WINDOW.searchUserAuditData();
					}
				} catch (e) {
					// TODO: handle exception
					console.log(e);
				}
				if(upInfo.imgsCount==0&&res.status=="success"){
					layer.alert("保存成功!");
				}
			}).fail(function(res) {
				alert(res);
			});
		},
		//获取零时图片的命名服务器时间
		getTempImgId:function(){

			var timestamp = (new Date()).valueOf();
			console.log("imgId=="+timestamp);
	        return timestamp;
		}
		
}