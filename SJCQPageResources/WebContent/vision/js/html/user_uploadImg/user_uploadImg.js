var myurl;
$(function(){
	initUserUploadInmg();
	// 获取参数
	var url = window.location.search;
	// 正则筛选地址栏
	var reg = new RegExp("(^|&)"+ "type" +"=([^&]*)(&|$)");
	// 匹配目标参数
	var result = url.substr(1).match(reg);
	//返回参数值
	myurl= result ? decodeURIComponent(result[2]) : null;
	$(".user_qh_tab").show();
	if(myurl==1){
		$("#production").removeClass("cur");
		$("#upload").addClass("cur");
		$(".content_production").hide();
		$(".content_upload").show();
		/*$(".content_production").css("display","none");*/
		/*userUploadImg.initData(type);*/
		/*$("#contentUploadPicSort .img_sel").remove();
		$("#contentUploadTitle").val("");
		$("#contentUploadMainExplain").val("");
		$("#contentUploadBranchExplain").val("");
		$("#contentUploadPicAddr").val("重庆");
		$("#contentUploadShootAuthor").val("");
		var _today= new Date();
		$("#chooseDate").val(_today.getFullYear()+"-"+(_today.getMonth()+1)+"-"+_today.getDate());
		$("#keyWord").val("");
		this.picSortLoad(0);//加载初始图片分类
*/	}
});

//初始化操作权限
function initUserUploadInmg(){
	
	if(USRSESSION==null){
        layer.alert("请先登录！");
        window.location.href="index.html";
        return;
    }
	
	$( "div[class^='content_']").hide();
	$( ".user_qh_tab").hide();
	userUploadImg.init();
    $.ajax({
        url:"/sjcq/account/getUserInfo",    // 请求的url地址
        type:"post",   // 请求方式
        dataType:"json",   // 返回格式为json
        async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
       // data:{},    // 参数值     state 0:密码登录 1:验证码登录
        success:function(data){
        	if(data.status){
        		if(data.account.user_type==1||data.account.user_type==2){
            		$(".content_application").remove();
            		//$(".content_accountmanage").remove();
            		$("#application").remove();
            	//	$("#accountmanage").remove();
            		laydate.render({
            		  elem: '#chooseDate' //开始日期
            		});
            		contentUpload.init();//我的上传初始化
    				contentUpload.initUploadSatus();
    				user_content.init();//关注初始化
    				user_collect.init();//收藏初始化
            		buy.init();//我的购买初始化
            		upload.init();
            	}else if(data.account.user_type==0){
            		$(".content_upload").remove();
            		$(".content_production").remove();
            		$(".content_onShelves").remove();
            		$(".content_information").remove();
            		$("#upload").remove();
            		$("#production").remove();
            		$("#onShelves").remove();
            		$("#information").remove();
            		user_content.init();//关注初始化
    				user_collect.init();//收藏初始化
            		buy.init();//我的购买初始化
            		var initVfctToggleRadio= function (){//申请供稿
            			var radioStatu=true;//初始是同意协议
            			$('.vfctToggleRadio').on('click','span',function(){
            				$(this).addClass('raCur').siblings().removeClass('raCur');
            				$(this).find('i').addClass('ico56').removeClass('ico55');
            				$(this).siblings().find('i').removeClass('ico56').addClass('ico55');
            				if($(this).hasClass('radioLeft')){
            					$(".vfctBtn").show();
            					radioStatu=true;
            				}else{
            					$(".vfctBtn").hide();
            					radioStatu=false;
            				}
            			})
            		}
            		initVfctToggleRadio();
            		$('.apl_sex').on('click',function(){//申请供稿
            			$('.apl_sex').removeClass('selt');
            			$(this).addClass('selt');
            			$('.apl_sex i').removeClass('ico56').addClass('ico55');
            			$(this).find('i').removeClass('ico55').addClass('ico56');
            		});
            		/*accountmanage.initHtml();*/
            		userUploadImg.initApplication(userUploadImg.getUserInfo());
            	}else{
            		$(".content_upload").remove();
            		$(".content_production").remove();
            		$(".content_application").remove();
            		$(".content_attention").remove();
            		$(".content_collect").remove();
            		$(".content_buy").remove();
            		$(".content_information").remove();
            		$(".content_accountmanage").remove();
            		$("#upload").remove();
            		$("#production").remove();
            		$("#attention").remove();
            		$("#collect").remove();
            		$("#buy").remove();
            		$("#information").remove();
            		$("#application").remove();
            		$("#accountmanage").remove();
            	}
            	$( ".user_qh_tab").show();
            	if(myurl==1){
            		$( "div[class^='content_']").first().hide();
            	}else{
            		$( "div[class^='content_']").first().show();
            	}
        	}else{
        		layer.alert('登录失效!');
//    			localStorage.setItem('user',""); // 保存用户 localStorage
    			window.location.href="index.html";
        	}
        },
        error:function(){
			layer.alert('系统错误!');
//			localStorage.setItem('user',""); // 保存用户 localStorage
			window.location.href="index.html";
        }
    });
}

var userUploadImg={
		init:function (){
			this.loadUserInfo();
			$( "div[class^='content_']").hide();
			$( "div[class^='content_']").first().show();
			applicationTab("verify");
		},
		getUserInfo:function(){
			var userInfo=null;
		    $.ajax({
		        url:"/sjcq/account/getUserInfo",    // 请求的url地址
		        type:"post",   // 请求方式
		        dataType:"json",   // 返回格式为json
		        async:false,// 请求是否异步，默认为异步，这也是ajax重要特性
		       // data:{},    
		        success:function(data){
		        	if(data.status){
		        		userInfo=data.account;
		        	}else{
		        		layer.alert('登录失效!');
		        	}
		        },
		        err:function(){
		        	layer.alert('系统错误!');
		        }
		    });
		    return userInfo;
		},
		loadUserInfo:function(){//加载作者个人信息
	        $.ajax({
	            url:"/sjcq/account/getUserInfo",    // 请求的url地址
	            type:"post",   // 请求方式
	            dataType:"json",   // 返回格式为json
	            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
	           // data:{},    // 参数值     state 0:密码登录 1:验证码登录
	            success:function(data){
	            	if(data.status){
            			$("#cover").attr("src",index_nav.PICURI+data.account.cover);
            			$("#actor").attr("src",index_nav.PICURI+data.account.actor);
            			$("#realName").html(data.account.real_name);
            			$("#remark").html(data.account.remark);
	            		if(null!=data.account.photographerAndDesigner&&undefined!=data.account.photographerAndDesigner){
	            			$(".user_vt").html(
	            		        	'<span>'+data.account.region+'</span><u>|</u>'+
	            		            '<span>作品 '+data.account.numberOfWorks+'</span><u>|</u>'+
	            		            '<span>关注量'+data.account.focusOnNum+'</span><u>|</u>'+
	            		            '<span>被浏览数 '+data.account.viewed+'</span>'
	            			);
	            		}else{
	            			$(".user_vt").html(
	            					'<span>'+data.account.region+'</span>'
	            			);
	            		}
	            	}else{
	            		layer.alert('登录失效！');
	            	}
	            },
	            error:function(){
	                layer.alert('查询加载失败！');
	            }
	        });
		},
		initApplication:function (userInfo){
			var status=userInfo.applyType;
			if(status==1){//没有填写基本信息
				applicationTab("basic");
			}else if(status==2){//填写了基本信息
				applicationTab("verify");
			}else if(status==3){//已提交审核
				applicationTab("result");
				application.displayAuditResult();
			}else if(status==4){//保存了基本信息
				applicationTab("basic");
				application.displayBasicInfo();
			}else if(status==5){//保存了验证信息
				applicationTab("verify");
				application.displayVerification();
			}
		},
		initData:function (type){
			if(type=="production"){
				/*location.href="/vision/html/user_uploadImg.html";*/
			}else if(type=="upload"){
				//初始化
				contentUpload.clearData();
			}else if(type=="onShelves"){
				loadMyPhoto();
			}else if(type=="application"){
			    this.initApplication(this.getUserInfo());
			}else if(type=="attention"){
				user_content.init();
			}else if(type=="collect"){
				user_collect.init();
			}else if(type=="buy"){
				
			}else if(type=="information"){
				getMyMessage();
			}else if(type=="accountmanage"){
				accountmanage.initHtml();
				//accountmanage.showAccountManage();
			}
		}
}

function getMyMessage(){
	//$("#myMess_ul").children().remove();
	$.ajax({
        url:"/sjcq/mess/getCollect",    // 请求的url地址
        type:"post",   					// 请求方式
        dataType:"json",   				// 返回格式为json
        async:true,						// 请求是否异步，默认为异步，这也是ajax重要特性
        data:{
        	page:1,
        	pageSize:6,
        },    					// 参数值     state 0:密码登录 1:验证码登录
        success:function(data){
        	$("#myMess_ul").empty();
        	var mess = data.rows;
        	var totalPage = data.totalPage;
        	initMessagePage(1,totalPage);
			$.each(mess,function(i,item){
					
				$("#myMess_ul").append("<li><i class='ico ico65'></i><div class='misa'><span>"+item.title+"</span><span>"+item.dateAndTime+"</span></div><div class='misc'>"+item.content+"</div></li>");
			})
        },
        error:function(){
            layer.alert('查询加载失败！');
        }
    });
}

function initMessagePage(currentPage,pageCount){
	$("#messagePages").children().remove();
	$("#messagePages").createPage({
        pageCount:pageCount,
        current:currentPage,
        backFn:function(result){
        		upload.loadMyMess(result,6,false);  // 我的信息
        }
    })
}


//上传图片
//that是该input，imgName是图片要显示的src的位置
function userUpImg(that,imgName){
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
        $('.user_update>.imgBox').append('<div class="userItem" data-id="60">'
    		+'<div class="picn">'
                +'<div class="picn_nbx">'
                    +'<p><img src="'+e.target.result+'"></p>'
                    +'<div class="ed_sel_ok"><i class="ico ico22"></i></div>'
                +'</div>'
            +'</div>'
    	+'</div>')
    };
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
					fileUploadPlug.fileUpload(url,file,nowSize+settingSize,settingSize,upInfo,tempImgId);
				}
				try {
					if(endSize==file.size){
						layer.alert("保存成功!");
					}
				} catch (e) {
					// TODO: handle exception
				}
				if(upInfo.imgsCount==0&&res.status=="success"){
					layer.alert("保存成功!");
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
		
}



//选项卡切换样式
function changeTab(_this,type){
	$(".user_qh_tab a").removeClass("cur");
	$(_this).addClass("cur");
	$( "div[class^='content_']").hide();
	$(".content_"+type).show();
	userUploadImg.initData(type);
}

//切换样式
function changeTabStyle(id){
	$(".user_qh_tab a").removeClass("cur");
	$("#"+id).addClass("cur");
	$( "div[class^='content_']").hide();
	$(".content_"+id).show();
}

function applicationTab(type){
	$( "div[class^='application_']").hide();
	$(".application_"+type).show();
}

function getPages(totle,size){
	if(totle<=size){
		return 1;
	}
	if(totle%size==0){
		return Math.ceil(totle/size);
	}else{

		return  Math.ceil(totle/size);
	}
}
