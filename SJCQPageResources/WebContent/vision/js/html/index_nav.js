var USRSESSION=null;
/**
 * 公用 方法
 * 首页 顶部导航栏
 */
var index_nav = {
	//
	PICURI:"http://127.0.0.1:8083/photo/upload/DATA/",
//	PICURI:"http://192.168.1.178:8083/photo/upload/DATA/",
	//PICURI:"/sjcq/DATA/",

    init:function(){
    	index_nav.searchNewsType();
    	getSessoin();
        if(USRSESSION!=null){
            var user = USRSESSION; // 获取用户
            $("#account_yes").show();
            $("#account_no").hide();
            //赋值
            if(user.realName==null||user.realName=="null"||user.realName=="Null"||user.realName==undefined){
            	$("#yes_name").text("完善资料");
            }else{
            	$("#yes_name").text(user.realName);
            }
            if(user.actor!=null){
                $("#yes_img",parent.document).attr("src",index_nav.PICURI+user.actor);
             }else{
                $("#yes_img",parent.document).attr("src","../util/images/man100.png");
            }
        }else{
            $("#account_yes").hide();
            $("#account_no").show();
        }
        index_nav.carNum();
    },
    /**
     * 跳转 中间 页面
     */
    // Jump:function(url,_this){
    //     $("#centre_div").load(url,function(){
    //         console.log($(_this).parent())
    //         $(_this).parent().attr("class","cur");
    //     });

    // },
    dowPic:function(ID){
        var form = $("<form id='imgForm'>");   	
        $('body').append(form);         
        form.attr('style','display:none');          
        //form.attr('target','/sjcq/account/downLoadImgById');        
        form.attr('method','post');       
        form.attr('action','/sjcq/photoPic/dowPic');//下载文件的请求路径                        
        var input1 = $('<input>');         
        input1.attr('type','hidden');         
        input1.attr('name','picXh');         
        input1.attr('value',ID);        
        form.append(input1);                     
        form.submit(); 
    },
    /**
     * 获取购物车数量
     */
    carNum:function(){
        $.ajax({
            url:"/sjcq/shoppingCart/num",    // 请求的url地址
            type:"post",   // 请求方式
            dataType:"text",   // 返回格式为json
            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
            data:{},    // 参数值     broType 轮播类型
            success:function(data){
                $("#yes_num").text(data)
                //console.log(data,"====",$("#yes_num"));
            },
            error:function(){
                layer.alert('购物车查询数量失败！');
            }
        });
    },
    /**
     * 退出登录
     */
    loginOut:function(isAty){
        $.ajax({
            url:"/sjcq/account/loginOut",    // 请求的url地址
            type:"post",   // 请求方式
            dataType:"text",   // 返回格式为json
            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
            data:{},    // 参数值     broType 轮播类型
            success:function(data){
                layer.alert(data);
//                localStorage.setItem('user',"");//刷新localStorage
                if(isAty == "active"){
                	window.location.href="../vision/html/index.html";
                }else{
                	window.location.href="index.html";
                }
                //index_nav.init();//刷新
            },
            error:function(){
                layer.alert('退出成功！');
//                localStorage.setItem('user',"");//刷新localStorage
                window.location.href="index.html";
                //index_nav.init();//刷新
                //layer.alert('退出失败！');
            }
        });
        
    },
    /**
     * 跳转购物车
     */
    car_jump:function(){
        if(USRSESSION==null){
            layer.alert("请先登录！");
            return;
        }
        window.location.href="shoppingCart.html";
    },
    /**
     * 跳转 到 用详情
     */
    user_jump:function(){
        if(USRSESSION==null){
            layer.alert("请先登录！");
            return;
        }
        window.location.href="user_uploadImg.html";
    },
    /**
     * 点击搜索框 按钮
     */
    search:function(){
        var inp_search = $("#inp_search").val();//搜索值
        if(inp_search==null||inp_search==""||inp_search==undefined||inp_search=="undefined"){
            inp_search = "";
        }
        var sel_cls = $('.sel_cls>span').text();//一级目录
        if(sel_cls==null||sel_cls==""||sel_cls==undefined||sel_cls=="undefined"){
            sel_cls = "";
        }
        window.location.href="pictureList.html?inp_search="+inp_search+"&sel_cls="+sel_cls;
    },
    /**
     * 点击关键词进行搜索
     * @param inp_search 关键字
     */
    search_gjc:function(inp_search){
        if(inp_search==null||inp_search==""||inp_search==undefined||inp_search=="undefined"){
            inp_search = "";
        }
        window.location.href="pictureList.html?inp_search="+inp_search;
    },
    /**
     * 通过按钮 打开图片列表页
     * @param inp_search 全文搜索值
     * @param sel_cls 一级目录
     * @param qx_search 区县
     */
    search_a:function(inp_search,sel_cls,qx_search,broadCastXh){
        if(inp_search==null||inp_search==""||inp_search==undefined||inp_search=="undefined"){
            inp_search = "";
        }
        if(sel_cls==null||sel_cls==""||sel_cls==undefined||sel_cls=="undefined"){
            sel_cls = "";
        }
        if(qx_search==null||qx_search==""||qx_search==undefined||qx_search=="undefined"){
            qx_search = "";
        }
        if(broadCastXh==undefined || broadCastXh==null||broadCastXh==""||broadCastXh=="undefined"){
        	broadCastXh = "";
        }
        window.location.href="pictureList.html?inp_search="+inp_search+"&sel_cls="+sel_cls+"&qx_search="+qx_search+"&broadCastXh="+broadCastXh;
    },
     /**
     * 通过按钮 打开图集列表页
     * @param inp_search 全文搜索值
     * @param sel_cls 一级目录
     * @param qx_search 区县
     */
    search_b:function(inp_search,sel_cls,qx_search){
        if(inp_search==null||inp_search==""||inp_search==undefined||inp_search=="undefined"){
            inp_search = "";
        }
        if(sel_cls==null||sel_cls==""||sel_cls==undefined||sel_cls=="undefined"){
            sel_cls = "";
        }
        if(qx_search==null||qx_search==""||qx_search==undefined||qx_search=="undefined"){
            qx_search = "";
        }
        window.location.href="atlasList.html?inp_search="+inp_search+"&sel_cls="+sel_cls+"&qx_search="+qx_search;
    },
    /**
     * 我要供稿
     */
    provide:function(){
    	if(USRSESSION==null){
            layer.alert("请先登录！");
            return;
        }else{
        	window.location.href="user_uploadImg.html";
        }
    },
    /**
    * 打开弹出层
    * 只适合 登录和注册弹窗
    * @param url 弹出层的路径
    */
   open:function(url){
       layer.open({
           type: 2,
           title: false,//标题 false 不显示
           closeBtn: 1,
           shadeClose: true,
           skin: 'layui-layer-nobg', //没有背景色
           area: ['850px', '490px'],//宽高
           fixed: false, //不固定
           content: url
       });
   },
   /**
    * 关闭layer弹出层
    */
   close:function(){
       layer.closeAll();//关闭所有弹窗
   },
   alertCreating:function(){
	   layer.alert('正在建设中！');
   },
   /**
    * 根据分类搜索
    */
   searchType:function(typeOne,typeTwo,isAty){
	   if(isAty == "active"){
		   window.location.href="../vision/html/pictureList.html?sel_cls="+typeOne+"&sel_cls_two="+typeTwo;
	   }else{
		   window.location.href="pictureList.html?sel_cls="+typeOne+"&sel_cls_two="+typeTwo;
	   }
   },
   /**
    * 检索新闻图片的二级分类
    */
   searchNewsType:function(isAty){
	   $.ajax({
            url:"/sjcq/manage/picSort/aggSecondDir",
            type:"post",
            dataType:"json",
            async:true,
            data:{typeOne:"新闻图片"},
            success:function(data){
	        	  var html='';
	        	  if(isAty == "active"){
	        		  $.each(data,function(i,val){
	        			  html+='<a href="javascript:index_nav.searchType(\'新闻图片\',\''+val.type_two+'\',\'active\')">'+val.type_two+'</a>';
	        		  });
	        	  }else{
	        		  $.each(data,function(i,val){
	        			  html+='<a href="javascript:index_nav.searchType(\'新闻图片\',\''+val.type_two+'\')">'+val.type_two+'</a>';
	        		  });
	        	  }
	        	  $("#newsSecondType").html(html);
            },
            error:function(){
                layer.msg('加载目录失败！');
            }
        });
   },
   /**
    * 登录后跳转个人上传页面
    */
   returnMysc:function(){
	   if(USRSESSION==null){
           layer.alert("请先登录！");
           return;
       }else{
    	   window.location.reload();
    	  /* var user=USRSESSION;
    	   if(user.userType!=0){   		   
    		   location.href="/vision/html/user_uploadImg.html?type=1";
    	   }else{
    		   location.href="/vision/html/user_uploadImg.html?type=0";
    	   }*/
       }
   }
}

if($('.in_search').offset()!=null&& $('.in_search').offset()!=""&&$('.in_search').offset()!=""){
	var oldtop = $('.in_search').offset().top;
	$(window).scroll(function(){	
		var nowTop=$(this).scrollTop();
		if(nowTop>oldtop){
			$('.in_search').addClass('searchFix');
		}else if(nowTop<oldtop){
			$('.in_search').removeClass('searchFix');
		}
	})
}


/**
 * 得到session
 */
function getSessoin() {
	$.ajax({
		url : "/sjcq/account/getBasic",
		dataType : "json",
		async : false,
		data : {},
		type : "post",
		success : function(data) {
			if(data.status){
				USRSESSION=data.account;
	    	}
		},
		error : function() {
		}
	});
}

/**
 * 获取分辨率
 * @returns {___anonymous7076_7077}
 */
function getWinXY(){
	var obj={};
	obj.X=window.screen.width;
	obj.Y=window.screen.height;
	return obj;
}




