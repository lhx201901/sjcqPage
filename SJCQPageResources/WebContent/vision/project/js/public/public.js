$(function(){
	initAllLiWidth();
	toggleExcess();
	//搜索框 绑定点击事件 给 span 赋值
	$('.sel_cls').on('click','li',function(){
		var nowTxt=$(this).find('a').text();
		$('.sel_cls>span').text(nowTxt);
	})
	$('.h_excess').hover(function(){//wc 2018 1121
		$(this).find('.h_eol').stop(true).slideDown('fast');
			},function(){
			$(this).find('.h_eol').stop(true).slideUp('fast');
	})
	
	//将搜索框置中
	var imgHeight=$(".top_box").height();
	/*var tHeight = $(".showMsg").height()-60;
	var twidth = $(".showMsg").width();
	var realHeight = (759 - tHeight)/2;
	var realWidth = ($(window).width() - twidth)/2;*/
	//$(".in_search").css("top",imgHeight+"px");

})
$(window).resize(function(res){
	toggleExcess();
})
//顶部导航栏，超过内容是否隐藏展示省略号必须的部分
var navWidthArray=[];
var navLength=$('.h_top_nav>ul>li').length;
var realAllwidth=0;
for(var nav=0;nav<navLength;nav++){
	navWidthArray[nav]=$('.h_top_nav>ul>li').eq(nav).width();
	realAllwidth+=$('.h_top_nav>ul>li').eq(nav).width();;
}
//顶部导航栏，超过内容是否隐藏展示省略号
/*function toggleExcess(){
	var pointWid=$('.h_excess .h_point').width();
	var rightWid=$('.user_qt_ed').width();//右边登录的宽度
	var allWid=$('.h_outBox').width();//当前head的总宽度
	var liLen=$('.h_top_nav>ul>li').length;//li的个数
	var currentWidth=$('.top_box').width();//左边盒子当前真实宽度
	
	var restWid=allWid-rightWid-15-currentWidth;//左边盒子多余宽度
	var arrLen=navWidthArray.length;
	var navNum=0;//需要隐藏的个数
	if(restWid<0){
		if(pointWid<navWidthArray[liLen-1]){
			if(Math.abs(restWid) < navWidthArray[liLen-1]){
				navNum=2;
			}else if(Math.abs(restWid) >= navWidthArray[liLen-1] && Math.abs(restWid)< navWidthArray[liLen-2] + navWidthArray[liLen-1]){
				navNum=3;
			}else if(Math.abs(restWid) >= navWidthArray[liLen-2] + navWidthArray[liLen-1] && Math.abs(restWid) < navWidthArray[liLen-3] + navWidthArray[liLen-2] + navWidthArray[liLen-1]){
				navNum=4;
			}else{
				navNum=5;
			}
		}else{
			if(Math.abs(restWid) < pointWid){
				navNum=2;
			}else if(Math.abs(restWid) >= pointWid && Math.abs(restWid)< navWidthArray[liLen-2] + pointWid){
				navNum=3;
			}else if(Math.abs(restWid) >= navWidthArray[liLen-2] + pointWid && Math.abs(restWid) < navWidthArray[liLen-3] + navWidthArray[liLen-2] + pointWid){
				navNum=4;
			}else{
				navNum=5;
			}
		}
		
		if(navNum===0) return;
		var nowStr='';
		for(var m=navNum;m>0;m--){
			nowStr+='<li>'+$('.h_top_nav li').eq(liLen-m).html()+'</li>';
			$('.h_top_nav li').eq(liLen-m).remove();
			liLen--;
		}
		$('.h_excess>.h_eol').prepend(nowStr);
		$('.h_excess').show();
		$('.h_excess').hover(function(){
			$(this).find('.h_eol').stop(true).slideDown('fast');
		},function(){
			$(this).find('.h_eol').stop(true).slideUp('fast');
		})
	}
}*/

//wc 2018 1121
var allLiWidthObj={};
var allLiWidthObjLen=0;
var indexToDataId={};//下标对应data-id
function initAllLiWidth(){//初始导航栏化数据
	$.each($('.h_top_nav>ul>li'),function(index,item){
		var data_id=$(item).attr("data-id");
		allLiWidthObj[data_id]={"index": index,"width":$(item).width(),"dataId":data_id,"barLiDataId":data_id+"_sl","barLiShow":false,"nvaShow":true };
		indexToDataId[index]=data_id;
		allLiWidthObjLen++;
	});
}

//wc 2018 1121
function toggleExcess(){
	var rightWid=$('.user_qt_ed').width();//右边盒子当前真实宽度
	var leftWidth=$('.top_box').width();//左边盒子当前真实宽度
	var zol=$('.h_outBox').width();//页头当前的真实宽度
	var xcwidth= zol-rightWid-leftWidth; //相差宽度
	var liobj=$('.h_top_nav>ul>li');
	var rdc_xycIndexList=[];//减少导航栏  需导航栏隐藏的和缩略点显示的.
	var add_xycIndexList=[];//增加导航栏
	if(xcwidth<0){// 左右出现重叠时 出现...
		var zolWidth=-xcwidth;
		for(var i=liobj.length;i>0;i--){
			var liDataId=$(liobj[i-1]).attr("data-id");
			if(zolWidth>0){
				if(i==liobj.length&&allLiWidthObjLen==liobj.length){
					zolWidth=zolWidth-($("li[data-id='"+liDataId+"']").width()-$('.h_excess').width());
				}else{
					zolWidth=zolWidth-$("li[data-id='"+liDataId+"']").width();
				}
				rdc_xycIndexList.push(liDataId);
				allLiWidthObj[liDataId].barLiShow=true;
				allLiWidthObj[liDataId].nvaShow=false;
			}else{
				break;
			}
		}
		addThumbnailNav(rdc_xycIndexList);//执行样式改变
	}else if(xcwidth>0){//增加导航,减少缩略
		var zolWidth=xcwidth;
		$.each(allLiWidthObj,function(index,item){
			if(!item.nvaShow){
				zolWidth=zolWidth-item.width;
				if(zolWidth>0){
					add_xycIndexList.push(item.dataId);
					allLiWidthObj[item.dataId].barLiShow=false;
					allLiWidthObj[item.dataId].nvaShow=true;
				}
			}
		});
		reduceThumbnailNav(add_xycIndexList);//执行样式改变
	}
}
//wc 2018 1121
//增加缩略导航
function addThumbnailNav(rdcList){
	if(rdcList.length>0){
		hideOrShowMenue();
		$.each(rdcList,function(index,item){
			$("li[data-id='"+item+"']").hide();
			$("li[data-id='"+allLiWidthObj[item].barLiDataId+"']").show();

		});
	}
} 
//wc 2018 1121
//减少所虐导航
function reduceThumbnailNav(addList){
	if(addList.length>0){
		hideOrShowMenue();
		$.each(addList,function(index,item){
			$("li[data-id='"+item+"']").show ();
			$("li[data-id='"+allLiWidthObj[item].barLiDataId+"']").hide();
		});
	}
}
//wc 2018 1121
//隐藏或者展示 缩略菜单或者整个导航菜单
function hideOrShowMenue(){
	var nvaMenueLiShowSize=0;//导航li显示个数
	var thbMenueLiShowSize=0;//缩略li显示个数
	$.each(allLiWidthObj,function(index,item){
		if(item.nvaShow){
			nvaMenueLiShowSize++;
		}
		if(item.barLiShow){
			thbMenueLiShowSize++;
		}
	});
	if(thbMenueLiShowSize==0){
		$(".h_excess").hide();
	}else{
		$(".h_excess").show();
	}
	if(nvaMenueLiShowSize==0){
		$(".h_top_nav").hide();
	}else{
		$(".h_top_nav").show();
	}
}

//整体移动的banner
function partBanner(options){
	var widObj=options.outBox;
	var moveObj=options.moveBox
	var oneWid=widObj.width();//每次移动的距离
	var curObj=moveObj.children();
	var len=curObj.length;
	if(len<2){
		options.rightBtn.hide();
		options.leftBtn.hide();
		return;
	}
	var allWidth =oneWid*len;//当前总的宽度
	moveObj.width(allWidth);//设置盒子总宽度
	curObj.width(oneWid);//每三个部分设置宽度
	
	options.rightBtn.on('click',function(){
		moveObj.stop().animate({"margin-left":-oneWid},800,function(){
			var nowOne=moveObj.children().eq(0);
			$(nowOne).appendTo(moveObj);
			moveObj.css('margin-left',0);
		});
	})
	options.leftBtn.on('click',function(){
		var lastOne=moveObj.children().eq(len-1);
		$(lastOne).prependTo(moveObj);
		moveObj.css('margin-left',-oneWid);
		moveObj.stop().animate({"margin-left":0},800);
	})
}

//上传图片
//that是该input，imgName是图片要显示的src的位置
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

//冯港   , 20190227吴冲注释 修改到index.js
/*$('.head').mouseover(function() {
	$('.head').css("background", "rgba(255,255,255,1)");
	$('.head a').css("color", "rgba(0,0,0,0.7)");
});

$('.head').mouseout(function() {
	if ($(document).scrollTop() >= 550) {
		$('.head').css('background', "rgba(255,255,255,1)");
	} else {
		$('.head').css('background', "rgba(255,255,255,0)");
		$('.head a').css("color", "rgba(255,255,255,0.7)");
	}
});*/
/*
var aWindow = $(window);
var aBody = $(document);*/
/*aWindow.scroll(function() {
	var imgHeight=$(".imgHeight").height();
	if (aBody.scrollTop() >= imgHeight) {
		$('.in_search').css('background', "rgba(255,255,255,1)");
		$('.search_box').css("display", "block");
	} else {
		$('.in_search').css('background', "rgba(255,255,255,0)");
	}
});*/

$('.showMsg').mouseover(function() {
	$('.search_box').css("display", "block");
});

$('.showMsg').mouseout(function() {
	$('.search_box').css("display", "none");
});

$('#upImg').mouseover(function() {
	$('#upImg a').css("color", "red");
});

$('#upImg').mouseout(function() {
	$('#upImg a').css("color", "#000");
});
function load(){
	
	setTimeout(function(){
		
		
		
		var aWindow = $(window);
		var aBody = $(document);
		
		var initHight=0;
		try {
			initHight=getTopHeight();
		} catch (e) {
			// TODO: handle exception
			load();
		}
		
		var ischange=false;
		
		 if(initHight>$(window).scrollTop()){
			 $('.in_search').removeClass('searchFix');
			 $('.in_search').addClass('serch_center');
			 ischange=false;
			 $(".search_box").hide();
		 }else{
			 $('.in_search').removeClass('serch_center');
			 $('.in_search').addClass('searchFix');
			 ischange=true;
			 $(".search_box").show();
		 }
		
		aWindow.scroll(function() {
			 if(initHight>$(window).scrollTop()){
				 $('.in_search').removeClass('searchFix');
				 $('.in_search').addClass('serch_center');
				 ischange=false;
				// $(".search_box").hide();
				 $(".search_box").show();
			 }else{
				 $('.in_search').removeClass('serch_center');
				 $('.in_search').addClass('searchFix');
				 ischange=true;
				 $(".search_box").show();
			 }
			
			/*var imgHeight2=$(".imgHeight").height();*/
	/*		if (aBody.scrollTop() >= imgHeight) {
				$(".in_search").css("top","0px");
			} else {
				$(".in_search").css("top",imgHeight+"px");
			}*/
		});

/*		$(".in_search .w_auto").hover(
		  function () {
			  $(".search_box").show();
		  },
		  function () {
			  if(ischange){
				  $(".search_box").show();
			  }else{
				  $(".search_box").hide();
			  }
		  }
		);*/
		
		$(".slick-prev,.slick-next").hover(
				  function () {
					  if(ischange){
						  $(".search_box").show();
					  }else{
						  $(".search_box").hide();
					  }

				  },
				  function () {
					  
					  $(".search_box").show();
				  }
				);
		
		
		function getTopHeight(){
			return $(".slick-prev").offset().top;
		}
		
		
	},2000);

}