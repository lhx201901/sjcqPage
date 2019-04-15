
//申请供稿
var application={
		imgId:1,
		imgs:{},
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
		    application.verificationImgs[imgName]=fileObj;
		    $(that).parent().siblings('.mino-box').hide();
		   	$(that).parent().siblings('.mino-img').show();
		},
		//下一步
		submitBasicInfo:function(){
			var objParam={};
			objParam.aplInfoBasicRealName=$("input[name='aplInfoBasicRealName']").val();
			objParam.aplInfoBasicNameSpell=$("input[name='aplInfoBasicNameSpell']").val();
			objParam.aplInfoBasicCellPhone=$("input[name='aplInfoBasicCellPhone']").val();
			objParam.aplSex=$('.selt').attr('data');
			objParam.aplInfoBasicCompany=$("input[name='aplInfoBasicCompany']").val();
			objParam.type=1;
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
				application.fileUpload("/sjcq/account/saveAplBaiscInfo", null, 0, application.settingSize, objParam, application.getTempImgId())
			}else{
				for(var i in application.imgs){
					sccs=sccs+1;
					objParam.imgCount=imgCount;
					objParam.sccs=sccs;
					application.fileUpload("/sjcq/account/saveAplBaiscInfo", application.imgs[i], 0, application.settingSize, objParam, application.getTempImgId())
				}
			}
			userUploadImg.initApplication(userUploadImg.getUserInfo());
			
/*			var objParam={};
			objParam.aplInfoBasicRealName=$("input[name='aplInfoBasicRealName']").val();
			objParam.aplInfoBasicNameSpell=$("input[name='aplInfoBasicNameSpell']").val();
			objParam.aplInfoBasicCellPhone=$("input[name='aplInfoBasicCellPhone']").val();
			objParam.aplSex=$('.selt').attr('data');
			objParam.aplInfoBasicCompany=$("input[name='aplInfoBasicCompany']").val();
			objParam.type=1;
			var imgs =[];
			var imgsElmt= $('.aplImgBox').find('img');
			//alert(imgsElmt.length);
			$.each(imgsElmt,function(indx,item){
				imgs.push(item.src);
			});
			if(imgsElmt.length<2){
				layer.alert("请先选择两张及以上的样品图！！");
				return ;
			}*/
/*			objParam.imgs=imgs;
	        $.ajax({
	            url:"/sjcq/account/saveAplBaiscInfo",    // 请求的url地址
	            type:"post",   // 请求方式
	            contentType : 'application/json;charset=utf-8',
	            dataType:"json",   // 返回格式为json
	            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
	            data:JSON.stringify(objParam) ,    // 参数值     state 0:密码登录 1:验证码登录
	            success:function(data){
	            	if(data.status=="success"){
	            		applicationTab("verify");
	            	}else{
	            		layer.alert(data.message);
	            	}
	            },
	            error:function(){
	                layer.alert('查询加载失败！');
	            }
	        });*/
			
		},
		//保存申请
		saveBasicInfo:function(){
			var objParam={};
			objParam.aplInfoBasicRealName=$("input[name='aplInfoBasicRealName']").val();
			objParam.aplInfoBasicNameSpell=$("input[name='aplInfoBasicNameSpell']").val();
			objParam.aplInfoBasicCellPhone=$("input[name='aplInfoBasicCellPhone']").val();
			objParam.aplSex=$('.selt').attr('data');
			objParam.aplInfoBasicCompany=$("input[name='aplInfoBasicCompany']").val();
			objParam.type=2;
			var imgCount=0;
			 var phone = /^1[34578]\d{9}$/;//手机号码正则表达式
			 if (!phone.test(objParam.aplInfoBasicCellPhone.trim())) {
				 layer.alert("请输入正确的手机号码！");
				 return;
		      }
			for(var i in application.imgs){
				imgCount++;
			}
			var sccs=0;
			for(var i in application.imgs){
				sccs=sccs+1;
				objParam.imgCount=imgCount;
				objParam.sccs=sccs;
				application.fileUpload("/sjcq/account/saveAplBaiscInfo", application.imgs[i], 0, application.settingSize, objParam, application.getTempImgId())
			}
			
			
/*			var imgs =[];
			var imgsElmt= $('.aplImgBox').find('img');
			$.each(imgsElmt,function(indx,item){
				imgs.push(item.src);
			});
			objParam.imgs=imgs;
	        $.ajax({
	            url:"/sjcq/account/saveAplBaiscInfo",    // 请求的url地址
	            type:"post",   // 请求方式
	            contentType : 'application/json;charset=utf-8',
	            dataType:"json",   // 返回格式为json
	            async:false,// 请求是否异步，默认为异步，这也是ajax重要特性
	            data:JSON.stringify(objParam) ,    // 参数值     state 0:密码登录 1:验证码登录
	            success:function(data){
	            	if(data.status=="success"){
	            		applicationTab("basic");
	            		layer.alert(data.data.result);
	            	}else{
	            		layer.alert(data.data.result);
	            	}
	            },
	            error:function(){
	                layer.alert('程序异常！');
	            }
	        });*/
		},
		//查询申请基本信息
		displayBasicInfo:function(){
			this.restBasicInfo();
	        $.ajax({
	            url:"/sjcq/account/getAplBasicInfo",    // 请求的url地址
	            type:"post",   // 请求方式
	            dataType:"json",   // 返回格式为json
	            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
	           // data:{},    // 参数值     state 0:密码登录 1:验证码登录
	            success:function(data){
	            	if(data.status=="success"){
	        			$("input[name='aplInfoBasicRealName']").val(data.data.aplInfoBasicRealName);
	        			$("input[name='aplInfoBasicNameSpell']").val(data.data.aplInfoBasicNameSpell);
	        			$("input[name='aplInfoBasicCellPhone']").val(data.data.aplInfoBasicCellPhone);
	        			$("input[name='aplInfoBasicCompany']").val(data.data.aplInfoBasicCompany);
	        			if(data.data.aplSex=='0'){
	        				$('.apl_sex').removeClass('selt').removeClass('raCur');
	        				$($('.apl_sex').filter('span[data="0"]').get(0)).addClass('selt').addClass('raCur');;
	        				$('.apl_sex i').removeClass('ico56').addClass('ico55');
	        				$($('.apl_sex').filter('span[data="0"]').get(0)).find('i').removeClass('ico55').addClass('ico56');
	        				
/*	        				
	        				$('.apl_sex').removeClass('selt');
	        				$('span[data="man"]').addClass('selt');
	        				$('.apl_sex i').removeClass('ico56').addClass('ico55');
	        				$('span[data="man"]').find('i').removeClass('ico55').addClass('ico56');*/
	        			}else if(data.data.aplSex=='1'){
	        				$('.apl_sex').removeClass('selt').removeClass('raCur');
	        				$($('.apl_sex').filter('span[data="1"]').get(0)).addClass('selt').addClass('raCur');;
	        				$('.apl_sex i').removeClass('ico56').addClass('ico55');
	        				$($('.apl_sex').filter('span[data="1"]').get(0)).find('i').removeClass('ico55').addClass('ico56');
/*	        				$('.apl_sex').removeClass('selt');
	        				$('span[data="wman"]').addClass('selt');
	        				$('.apl_sex i').removeClass('ico56').addClass('ico55');
	        				$('span[data="wman"]').find('i').removeClass('ico55').addClass('ico56');*/
	        			}
	        			$.each(data.data.imgs,function(index,item){
	        				var uri=index_nav.PICURI;
	        				 $('.user_update>.aplImgBox').append('<div class="imgItem"  style="display:inline-block;padding:5px"><img src="'+uri+item.photoPath+'" style="width:100px;height:100px"/><div class="ed_sel_ok" style="background-color:red"><i class="ico ico48" style="float:right" onclick="application.deleteImg(this,\''+item.uuid+'\')"></i></div></div>')
	        			});
	    		    	if($('.aplImgBox .imgItem').length>=5){
	    		    		$('.aplInputFile').hide();
	    		    	}
	            	}else{
	            		layer.alert('基本信息加载失败！');
	            	}
	            },
	            error:function(){
	                layer.alert('查询加载失败！');
	            }
	        });
		},
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
		        $('.user_update>.aplImgBox').append('<div class="imgItem" data-id="'+application.imgId+'" style="display:inline-block;padding:5px"><img src="'+e.target.result+'" style="width:100px;height:100px;border: 1px solid #ddd;"/><div class="ed_sel_ok" style="background-color:red"><i class="ico ico48" style="float:right" onclick="application.deleteImg(this)"></i></div></div>')
		    	if($('.aplImgBox .imgItem').length>=5){
		    		$('.aplInputFile').hide();
		    	}
		    };
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
		restBasicInfo:function(){//重置基本信息
			$("input[name='aplInfoBasicRealName']").val("");
			$("input[name='aplInfoBasicNameSpell']").val("");
			$("input[name='aplInfoBasicCellPhone']").val("");
			$("input[name='aplInfoBasicCompany']").val("");
			$('.apl_sex').removeClass('selt');
			$('span[data="1"]').addClass('selt');
			$('.apl_sex i').removeClass('ico56').addClass('ico55');
			$('span[data="1"]').find('i').removeClass('ico55').addClass('ico56');
			 $('.user_update>.aplImgBox').html("");
			$('.aplInputFile').show();
		},
		//显示验证保存信息
		displayVerification:function(){
	        $.ajax({
	            url:"/sjcq/account/getVerification",    // 请求的url地址
	            type:"post",   // 请求方式
	            contentType : 'application/json;charset=utf-8',
	            dataType:"json",   // 返回格式为json
	            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
	            success:function(data){
	            

	            	if(data.status=="success"){
	        			$("input[name='address']").val(data.data.address);
	        			$("input[name='region']").val(data.data.region);
	        			$("input[name='postcode']").val(data.data.postcode);
	        			$("input[name='bankCard']").val(data.data.bankCard);
	        			$("input[name='vfctIdentityCard']").val(data.data.vfctIdentityCard);
	        			$("input[name='bankUserName']").val(data.data.bankUserName);
	        			$(".raCur").attr("data");
	        			$("input[name='bankName']").val(data.data.bankName);
	        			if(data.data.bankCardImg){
	        				$("#BankCardImg").attr("src",	index_nav.PICURI+data.data.bankCardImg);
	        				$("#BankCardImg").parent().siblings('.mino-box').hide();
	        				$("#BankCardImg").parent().siblings('.mino-img').show();
	        				$("#BankCardImg").parent().attr("style","display:block");
	        			}
	        			if(data.data.frontImg){
		        			$("#frontImg").attr("src",	index_nav.PICURI+data.data.frontImg);
		        			$("#frontImg").parent().siblings('.mino-box').hide();
		        			$("#frontImg").parent().siblings('.mino-img').show();
		        			$("#frontImg").parent().attr("style","display:block");
	        			}
	        			if(data.data.behindeImg){
		        			$("#behindeImg").attr("src",index_nav.PICURI+data.data.behindeImg);
		        			$("#behindeImg").parent().siblings('.mino-box').hide();
		        			$("#behindeImg").parent().siblings('.mino-img').show();
		        			$("#behindeImg").parent().attr("style","display:block");
	        			}
	        			

	        			$("#personType").val(data.data.personType);
	            	}else{
	            		layer.alert(data.message);
	            	}
	            },
	            error:function(){
	                layer.alert('查询加载失败！');
	            }
	        });
			
			

		},
		submitVerification:function(){//验证信息提交
			var obj={};
			obj.vfctIdentityCard=$("input[name='vfctIdentityCard']").val();
//			obj.addrProvince=$("input[name='addrProvince']").val();
//			obj.addrCity=$("input[name='addrCity']").val();
			obj.address=$("input[name='address']").val();
			obj.region=$("input[name='region']").val();
			obj.postcode=$("input[name='postcode']").val();
			obj.bankCard=$("input[name='bankCard']").val();
			obj.bankUserName=$("input[name='bankUserName']").val();
			obj.bankName=$("input[name='bankName']").val();
			obj.vfctIdea=$(".raCur").attr("data");
/*			obj.bankCardImg=$("#BankCardImg").attr("src");
			obj.frontImg=$("#frontImg").attr("src");
			obj.behindeImg=$("#behindeImg").attr("src");*/
			obj.personType=$("#personType").val();
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
			$.ajax({
			    url: "/sjcq/account/saveVerification",
			    type: 'POST',
			    cache: false,
			    data: data,
			    async:false,
			    processData: false,
			    contentType: false
			}).done(function(res) {
            	if(res.status=="success"){
				userUploadImg.initApplication(userUploadImg.getUserInfo());
            	}else{
            		layer.alert(res.message);
            	}
			}).fail(function(res) {
				layer.alert(res.message)
			});		
			
/*			var obj={};
			obj.vfctIdentityCard=$("input[name='vfctIdentityCard']").val();
//			obj.addrProvince=$("input[name='addrProvince']").val();
//			obj.addrCity=$("input[name='addrCity']").val();
			obj.address=$("input[name='address']").val();
			obj.postcode=$("input[name='postcode']").val();
			obj.bankCard=$("input[name='bankCard']").val();
			obj.bankUserName=$("input[name='bankUserName']").val();
			obj.vfctIdea=$(".raCur").attr("data");
			obj.bankName=$("input[name='bankName']").val();
			obj.bankCardImg=$("#BankCardImg").attr("src");
			obj.frontImg=$("#frontImg").attr("src");
			obj.behindeImg=$("#behindeImg").attr("src");
			obj.personType=$("#personType").val();
			obj.type=0;//提交申请
	        $.ajax({
	            url:"/sjcq/account/saveVerification",    // 请求的url地址
	            type:"post",   // 请求方式
	            contentType : 'application/json;charset=utf-8',
	            dataType:"json",   // 返回格式为json
	            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
	            data:JSON.stringify(obj) ,    // 参数值     state 0:密码登录 1:验证码登录
	            success:function(data){
	            	if(data.status=="success"){
	            		userUploadImg.initApplication(userUploadImg.getUserInfo());
	            		applicationTab("result");
	            		if("success"==data.data.status){
	            			$(".auditResult").html("审核通过!请等待管理员更新...");
	            		}else if("fail"==data.data.status){
	            			$(".auditResult").html("审核不通过!"+"失败原因:"+"data.data.result+... 请点击重新申请");
	            			$(".auditResultBtn").html('<button class="btn btn_ok" onclick="application.applyAgain()">重新申请</button>');
	            		}else if("wait"==data.data.status){
	            			$(".auditResult").html("审核中,请等待.....");
	            		}
	            	}else{
	            		layer.alert(data.message);
	            	}
	            },
	            error:function(){
	                layer.alert('查询加载失败！');
	            }
	        });*/
		},
		//保存
		saveVerification:function(){
			var obj={};
			obj.vfctIdentityCard=$("input[name='vfctIdentityCard']").val();
//			obj.addrProvince=$("input[name='addrProvince']").val();
//			obj.addrCity=$("input[name='addrCity']").val();
			obj.address=$("input[name='address']").val();
			obj.region=$("input[name='region']").val();
			obj.postcode=$("input[name='postcode']").val();
			obj.bankCard=$("input[name='bankCard']").val();
			obj.bankUserName=$("input[name='bankUserName']").val();
			obj.bankName=$("input[name='bankName']").val();
			obj.vfctIdea=$(".raCur").attr("data");
/*			obj.bankCardImg=$("#BankCardImg").attr("src");
			obj.frontImg=$("#frontImg").attr("src");
			obj.behindeImg=$("#behindeImg").attr("src");*/
			obj.personType=$("#personType").val();
			obj.type=1;
			var imgInfo={}
			var data = new FormData();
			for(var i in application.verificationImgs ){
				var file=application.verificationImgs[i];
				data.append(i , file.slice(0,file.size));
				imgInfo[i]={"field":i,"fileName":file.name} 
			}
			data.append("upInfo", JSON.stringify(obj));
			data.append("imgInfo",JSON.stringify(imgInfo));
			$.ajax({
			    url: "/sjcq/account/saveVerification",
			    type: 'POST',
			    cache: false,
			    data: data,
			    async:false,
			    processData: false,
			    contentType: false
			}).done(function(res) {
            	if(res.status=="success"){
            		applicationTab("verify");
            		layer.alert("保存成功!");
            		application.displayVerification();
            	}else{
            		layer.alert(res.message);
            	}
			}).fail(function(res) {
				layer.alert(res.message)
			});			
			
/*	        $.ajax({
	            url:"/sjcq/account/saveVerification",    // 请求的url地址
	            type:"post",   // 请求方式
	            contentType : 'application/json;charset=utf-8',
	            dataType:"json",   // 返回格式为json
	            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
	            data:JSON.stringify(obj) ,    // 参数值     state 0:密码登录 1:验证码登录
	            success:function(data){
	            	if(data.status=="success"){
	            		applicationTab("verify");
	            		layer.alert("保存成功!");
	            		application.displayVerification();
	            	}else{
	            		layer.alert("保存失败!");
	            	}
	            },
	            error:function(){
	                layer.alert('查询加载失败！');
	            }
	        });*/
		},
		//显示审核结果信息
		displayAuditResult:function(){
			 var  userInfo= userUploadImg.getUserInfo();
			if("success"==userInfo.statu){
    			$(".auditResult").html(userInfo.result);
    		}else if("fail"==userInfo.statu){
    			$(".auditResult").html(userInfo.result);
    			$(".auditResultBtn").html('<button class="btn btn_ok" onclick="application.applyAgain()">重新申请</button>');
    		}else if("wait"==userInfo.statu){
    			$(".auditResult").html(userInfo.result);
    		}
		},
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
				//	data.append("theSize", endSize + "");//当前端尺寸
				//	data.append("imgSize", file.size + "");//图片总大小
					
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
					application.fileUpload(url,file,nowSize+settingSize,settingSize,upInfo,tempImgId);
				}
				try {
					if(endSize==file.size){
					//	layer.alert("保存成功!");
					}
				} catch (e) {
					// TODO: handle exception
					console.log(e);
				}
				if((upInfo.imgCount==0||upInfo.sccs==upInfo.imgCount) &&res.status=="success"){
					layer.alert("保存成功!");
				}else if(res.status=="failure"){
					alert(name+ ",保存失败!");
				}
			}).fail(function(res) {
				alert(res)
			});
		},
		//获取零时图片的命名服务器时间+用户的uuid
		getTempImgId:function(){
			var tempImgId=null;
	        $.ajax({
	            url:"/sjcq/photoPic/serviceTime",    // 请求的url地址
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
};

