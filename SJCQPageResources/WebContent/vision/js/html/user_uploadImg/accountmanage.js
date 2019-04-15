//修改个人资料
var accountmanage={
		imgs:{},
		uploadImg:function (that,imgName){
		    var reads= new FileReader();
		    var fileObj=that.files[0];
		    var imageType = /^image\//;
		    //是否是图片
		    if (!imageType.test(fileObj.type)) {
		        alert("请选择图片！");
		        return;
		    }
		    //限制大小
		    if(fileObj.size>1024*2048){
		    	alert("图片大小不能大于2M");
		    	 return false;
		    }
		    //读取完成
		    reads.readAsDataURL(fileObj);
		    reads.onload = function(e) {
		        //图片路径设置为读取的图片
		        $("#"+imgName).attr('src',e.target.result) ;
		    };
		    accountmanage.imgs[imgName]=fileObj;
		    $(that).parent().siblings('.mino-box').hide();
		   	$(that).parent().siblings('.mino-img').show();
		},
		initHtml:function(){
			$("#aniu").show();
				$(".content_accountmanage").children().remove();
				$(".content_accountmanage").append(' <div class="w_auto"> <div class="inboxn"> <p class="in_title">修改个人信息</p> <p class="mt10 gray9">昵称修改一周之内只能修改一次，请谨慎修改</p> <div class="mt50"> <div class="in_text"> <span class="itic">昵称</span> <div class="intxts"><input id="atmngNickName" type="text" class="text" placeholder="请输入昵称"></div> </div> <div class="in_text"> <span class="itic">头像</span> <div class="txmsgt"> <span class="img"><img src="" id="headImg"></span> <a href="javascript:void(0)" class="seked"> 选择文件 <form action="" method="post" enctype="multipart/form-data"> <input type="file" onchange="accountmanage.uploadImg(this,\'headImg\')" class="comFileBtn" accept="image/*"> </form> </a> </div> </div> <div class="in_text"> <span class="itic">封面</span> <div class="txmsgt"> <span class="img"><img src="" id="atmngcover"></span> <a href="javascript:void(0)" class="seked"> 选择文件 <form action="" method="post" enctype="multipart/form-data"> <input type="file" onchange="accountmanage.uploadImg(this,\'atmngcover\')" class="comFileBtn" accept="image/*"> </form> </a> </div> </div><div class="in_text"> <span class="itic">性别</span> <div class="pt10 toggleRadio"> <span class="atmng_sex radioMan raCur selt" data="1"><i class="ico ico56 mr5"></i>男</span> <span class="atmng_sex ml20 radioWoman" data="0"><i class="ico ico55 mr5"></i>女</span> </div> </div> <div class="in_text"> <span class="itic">手机号码</span> <div class="intxts"><input id="atmngCellPhone" type="text" class="text" placeholder="请输入手机号码"></div> </div> <div class="in_text"> <span class="itic">关于您</span> <div class="tareabx"> <textarea class="tarea" id="remarkSelf" placeholder=""></textarea> </div> </div> </div> </div> <div class="svtsd"> <button class="btn btn_ok" onclick="accountmanage.savaAccountManage()">保存</button>'
//						+'<a href="#" class="btn ml20">取消</a> '
						+'</div> </div>');
				accountmanage.init();
				accountmanage.showAccountManage();
		},
		//初始化
		init:function(){
			$('.atmng_sex').on('click',function(){
				$('.atmng_sex').removeClass('selt');
				$('.atmng_sex').removeClass('raCur');
				$(this).addClass('selt');
				$(this).addClass('raCur');
				$('.atmng_sex i').removeClass('ico56').addClass('ico55');
				$(this).find('i').removeClass('ico55').addClass('ico56');
			});
		},
		//保存修改个人信息
		savaAccountManage:function(){
			
			var actor= $("#headImg").attr("src");
			var cover= $("#atmngcover").attr("src");
			var nickName=$("#atmngNickName").val();
			var sex=$($(".atmng_sex").filter(".selt").get(0)).attr("data");
			var phone=$("#atmngCellPhone").val();
			var remark=$("#remarkSelf").val();
			if("man"==sex){
				sex=0;
			}else{
				sex=1;
			}
			var obj= {"nickName":nickName,"phone":phone,"sex":sex,"remark":remark}
			
			var imgsCount=0;
			for(var j in accountmanage.imgs){
				imgsCount++;
			}
			var sccs=0;//上传次数
			for(var i in accountmanage.imgs){
				sccs=sccs+1;
				obj.sccs=sccs;
				obj.imgsCount=imgsCount;
				obj.type=i;
				accountmanage.fileUpload("/sjcq/account/updateAcountInfo",accountmanage.imgs[i], 0, application.settingSize, obj, application.getTempImgId());
			}
			if(imgsCount==0){
				obj.sccs=0;
				obj.imgsCount=0;
				accountmanage.fileUpload("/sjcq/account/updateAcountInfo",accountmanage.imgs[i], 0, application.settingSize, obj, application.getTempImgId());
			
			}
			layer.alert("保存成功！");
		},
		//显示个人信息
		showAccountManage:function(){
			var userInfo= userUploadImg.getUserInfo();
			if(userInfo!=null){
     			$("#headImg").attr("src",index_nav.PICURI+userInfo.actor);
     			$("#atmngcover").attr("src",index_nav.PICURI+userInfo.cover);
    			$("#atmngNickName").val(userInfo.nick_name);
    			if(userInfo.sex=='0'){
    				$('.atmng_sex').removeClass('selt').removeClass('raCur');
    				$($('.atmng_sex').filter('span[data="1"]').get(0)).addClass('selt').addClass('raCur');;
    				$('.atmng_sex i').removeClass('ico56').addClass('ico55');
    				$($('.atmng_sex').filter('span[data="1"]').get(0)).find('i').removeClass('ico55').addClass('ico56');
    			}else if(userInfo.sex=='1'){
    				$('.atmng_sex').removeClass('selt').removeClass('raCur');
    				$($('.atmng_sex').filter('span[data="0"]').get(0)).addClass('selt').addClass('raCur');;
    				$('.atmng_sex i').removeClass('ico56').addClass('ico55');
    				$($('.atmng_sex').filter('span[data="0"]').get(0)).find('i').removeClass('ico55').addClass('ico56');
    			}
    			$($(".atmng_sex").filter(".selt").get(0)).attr("data");
    			$("#atmngCellPhone").val(userInfo.phone);
    			$("#remarkSelf").val(userInfo.remark);
			}
/*	        $.ajax({
	            url:"/sjcq/account/showAccountManage",    // 请求的url地址
	            type:"post",   // 请求方式
	            contentType : 'application/json;charset=utf-8',
	            dataType:"json",   // 返回格式为json
	            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
	            data:JSON.stringify(obj) ,    // 参数值     state 0:密码登录 1:验证码登录
	            success:function(data){
	            	 if(data.status=="success"){
	         			$("#headImg").attr("src",data.data.headImg);
	         			$("#atmngcover").attr("src",data.data.atmngcover);
	        			$("#atmngNickName").val(data.data.atmngNickName);
	        			if(data.data.sex=='man'){
	        				$('.atmng_sex').removeClass('selt').removeClass('raCur');
	        				$($('.atmng_sex').filter('span[data="man"]').get(0)).addClass('selt').addClass('raCur');;
	        				$('.atmng_sex i').removeClass('ico56').addClass('ico55');
	        				$($('.atmng_sex').filter('span[data="man"]').get(0)).find('i').removeClass('ico55').addClass('ico56');
	        			}else if(data.data.sex=='wman'){
	        				$('.atmng_sex').removeClass('selt').removeClass('raCur');
	        				$($('.atmng_sex').filter('span[data="wman"]').get(0)).addClass('selt').addClass('raCur');;
	        				$('.atmng_sex i').removeClass('ico56').addClass('ico55');
	        				$($('.atmng_sex').filter('span[data="wman"]').get(0)).find('i').removeClass('ico55').addClass('ico56');
	        			}
	        			$($(".atmng_sex").filter(".selt").get(0)).attr("data");
	        			$("#atmngCellPhone").val(data.data.atmngCellPhone);
	        			$("#remarkSelf").val(data.data.remarkSelf);
	            	 }else{
	            		 layer.alert('查询加载失败！');
	            	 }
	            },
	            error:function(){
	                layer.alert('查询加载失败！');
	            }
	        });*/
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
					if(endSize==file.size){//本文件上传成功
//						layer.alert("保存成功!");
						if(url=='/sjcq/account/updateAcountInfo'){						
							if(res.data){
								//重新设置session
								console.log(res.data);
//								localStorage.setItem('user',JSON.stringify(res.data)); // 保存用户 localStorage
								index_nav.init();
							}
						}
					}
				} catch (e) {
					// TODO: handle exception
					console.log(e);
				}
				if((upInfo.imgsCount==0||upInfo.imgsCount==upInfo.sccs)&&res.status=="success"){
//					layer.alert("保存成功!");
					if(url=='/sjcq/account/updateAcountInfo'){						
						if(res.data){
							//重新设置session
							console.log(res.data);
//							localStorage.setItem('user',JSON.stringify(res.data)); // 保存用户 localStorage
							index_nav.init();
						}
					}
				}else if(res.status=="failure"){
					alert(name+",保存失败!");
				}
			}).fail(function(res) {
				alert(res)
			});
		},
};


