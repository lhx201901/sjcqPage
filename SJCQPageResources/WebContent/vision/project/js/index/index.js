$(function(){
	//bannerAnimate();//轮播图动画
	selfMoveBanner()
	//下面这个方法在public.js里
	partBanner({
		outBox:$('.in_hzhb .in_outBox'),//最外层显示三个内容的盒子
		moveBox:$('.in_hzhb .in_rili'),//内部移动的整个盒子
		leftBtn:$('.inhz_lt'),//左按钮
		rightBtn:$('.inhz_rt')//右按钮
	});
	/*//加载图片说明

	$(".showImgMsg").mouseover(function(){
		console.log("进入");
		 $.ajax({
	            url:"/sjcq/broadcast/showImgMsg",    // 请求的url地址
	            type:"post",   // 请求方式
	            dataType:"text",   // 返回格式为json
	            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
	            data:{
	            	id:1
	            },    // 参数值   
	            success:function(data){
	            },
	            error:function(){
	            }
	        });
	});

	$(".showImgMsg").mouseout(function(){
		console.log("b");
	});*/
})

//顶部轮播图
// function bannerAnimate(){
// 	 var banner = $('.top_banner').unslider({
//         dots: true,//是否有点
//         fluid:true,//是否响应式
//         speed:1000,
//         delay:3500//轮播的快慢
//    })
//     var banData = banner.data('unslider'); 
//     $('.ban_arrow').click(function() {
//         var fn = this.className.split(' ')[0];
//         banData[fn]();
//     });
// }

//底部自己移动的banenr
function selfMoveBanner(){
	var showWidth=$('.minlog').width();
	var moveObj=$('.minlog>ul');
	var len=moveObj.children().length;
	var oneWid=moveObj.children().outerWidth(true);
	var allWidth=len*oneWid;
	if(showWidth>allWidth) return;
	moveObj.width(allWidth);
	var nowTime=setInterval(function(){
		moveObj.stop().animate({"margin-left":-oneWid},800,function(){
			var nowOne=moveObj.children().eq(0);
			$(nowOne).appendTo(moveObj);
			moveObj.css('margin-left',0);
		});
	},1500)
	moveObj.hover(function(){
		clearInterval(nowTime)
	},function(){
		nowTime=setInterval(function(){
			moveObj.stop().animate({"margin-left":-oneWid},800,function(){
				var nowOne=moveObj.children().eq(0);
				$(nowOne).appendTo(moveObj);
				moveObj.css('margin-left',0);
			});
		},1500)
	})
}


