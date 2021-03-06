var ROLEID_ = "";// 序号
var MODULEOBJ_ = {};// 定义模块树
var USEROBJ_ = {};// 定义部门树
var PARAM = {}; // 前一个页面的参数对象
var MAIN_PAGE_WINDOW = {};// 前一个页面对象
$(document).ready(
		function() {
			checksessoin();
			PARAM = GetParamByRequest();
			MAIN_PAGE_WINDOW = parent.document.getElementById("tab_frame_"
					+ PARAM.MAIN_PAGE_ID_).contentWindow;
			//初始化
			application.init();
			//初始化供稿人信息
			application.initVerification(PARAM.uuid);
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
		//修改供稿人信息
		updateVerification:function(){
			var objParam={};
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
			objParam.picSczId=PARAM.uuid;
			objParam.vfctIdea=$(".raCur").attr("data");
			objParam.personType=$("#personType").val();
			console.log(objParam);
			 var phone = /^1[34578]\d{9}$/;//手机号码正则表达式
			 if (!phone.test(objParam.aplInfoBasicCellPhone.trim())) {
				 layer.alert("请输入正确的手机号码！");
				 return;
		      }
			$.ajax({
			    url:"/sjcq//pAndD/updateContributorInfo",    //请求的url地址
			    dataType:"json",   //返回格式为json
			    async:true,//请求是否异步，默认为异步，这也是ajax重要特性
			    data:{conInfo:JSON.stringify(objParam)},    //参数值
			    type:"post",   //请求方式
			    success:function(data){
			    	if(data.status=='success'){
			    		layer.alert("编辑供稿人信息成功");
			    		MAIN_PAGE_WINDOW.searchUserAuditData();
			    	}else{
			    		layer.alert(data.message);
			    	}
			    },
			    error:function(){
			        //请求出错处理
			    }
			});
			
		},
		//初始化供稿人信息
		initVerification:function(uuid){
			$.ajax({
			    url:"/sjcq//pAndD/findContributorDetailInfo",    //请求的url地址
			    dataType:"json",   //返回格式为json
			    async:true,//请求是否异步，默认为异步，这也是ajax重要特性
			    data:{uuid:uuid},    //参数值
			    type:"post",   //请求方式
			    success:function(data){
			    	$("input[name='aplInfoBasicRealName']").val(data.account.realName==null?"":data.account.realName);
        			$("input[name='aplInfoBasicNameSpell']").val(data.account.spellName==null?"":data.account.spellName);
        			$("input[name='aplInfoBasicCellPhone']").val(data.account.phone==null?"":data.account.phone);
        			$("input[name='aplInfoBasicCompany']").val(data.account.unit);
        			
        			if(data.account.sex=='1'){
        				$('.apl_sex').removeClass('selt').removeClass('raCur');
        				$($('.apl_sex').filter('span[data="1"]').get(0)).addClass('selt').addClass('raCur');;
        				$('.apl_sex i').removeClass('ico56').addClass('ico55');
        				$($('.apl_sex').filter('span[data="1"]').get(0)).find('i').removeClass('ico55').addClass('ico56');
        			}else if(data.account.sex=='0'){
        				$('.apl_sex').removeClass('selt').removeClass('raCur');
        				$($('.apl_sex').filter('span[data="0"]').get(0)).addClass('selt').addClass('raCur');;
        				$('.apl_sex i').removeClass('ico56').addClass('ico55');
        				$($('.apl_sex').filter('span[data="0"]').get(0)).find('i').removeClass('ico55').addClass('ico56');
        			}
        			$("input[name='address']").val(data.contract.address==null?"":data.contract.address);
        			$("input[name='region']").val(data.contract.region==null?"":data.contract.region);
        			$("input[name='postcode']").val(data.contract.postalCode==null?"":data.contract.postalCode);
        			$("input[name='bankCard']").val(data.contract.bankNumber==null?"":data.contract.bankNumber);
        			$("input[name='vfctIdentityCard']").val(data.contract.idnumber);
        			$("input[name='bankUserName']").val(data.contract.bankUser==null?"":data.contract.bankUser);
        			$("input[name='bankName']").val(data.contract.bankName==null?"":data.contract.bankName);
        			$("#personType").find("option[value = '"+data.account.userType+"']").attr("selected","selected");
			    },
			    error:function(){
			        //请求出错处理
			    }
			})

		}
}
