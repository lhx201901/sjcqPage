/**
 * 首页
 */
var index = {
	init : function() {
		index.initSlideWidthAndHeight();
		index.bannerData();// 加载轮播图片
		index.loadActivities();
		$('#inp_search').keydown(function(e) {
			if (e.keyCode == 13) {
				index_nav.search();
			}
		})
		// index.loadType();//热门图片加载二级目录
		// index.loadImg();//热门图片加载
		
		
		///wc 导航鼠标移入
/*		$('.head').mouseover(function() {
			$('.head').css("background", "rgba(255,255,255,1)");
			$('.head a').css("color", "rgba(0,0,0,0.7)");
		});
		///wc 导航鼠标移除
		$('.head').mouseout(function() {
			if ($(document).scrollTop() >= 550) {
				$('.head').css('background', "rgba(255,255,255,1)");
			} else {
				$('.head').css('background', "rgba(255,255,255,0)");
				$('.head a').css("color", "rgba(255,255,255,0.7)");
			}
		});
		*/
		
	},
	/**
	 * 轮播加载图片
	 */
	bannerData : function() {
		$.ajax({
			url : "/sjcq/broadcast/loadCarousel", // 请求的url地址
			type : "post", // 请求方式
			dataType : "json", // 返回格式为json
			async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
			data : {
				broType : 1
			}, // 参数值 broType 轮播类型
			success : function(data) {
				$(data).each(
						function(i, row) {
							/*if (row.picXh != null && row.picXh != undefined && row.picXh != 'null' && row.picXh.trim().length > 0) {
								$(".slick").append(
										'<div><a href="#" onclick="in_search.imgJump(\'' + row.picXh + '\')"><img style="width:100%;height:100%" src="' + index_nav.PICURI
												+ row.picPath + '" alt=""></a></div>');
							} else {
							}*/
							$(".slick").append(
									'<div><div class="imgDiv"><span class="cover">' + row.picContent + '</span></div><a href="#" onclick="index_nav.search_a(\'\',\'轮播组图\',\'\',\''+row.broadcastXh+'\')"><img style="width:100%;height:100%" src="'
									+ index_nav.PICURI + row.picPath + '" alt=""></a></div>');
							
							$('.imgDiv').mouseover(function() {
								$(".cover").css("display", "block");
							});
							
							$('.imgDiv').mouseout(function() {
								$(".cover").css("display", "none");
							});

						})
				$('.slick').slick({
					dots : true,
					autoplay : true,
					arrows : true,
					draggable : false,
					autoplaySpeed : 5000,
					infinite : true,
					speed : 300,
					slidesToShow : 1,
					adaptiveHeight : true,
					pauseOnHover : true
				});

				/*
				 * var str = ""; $(data).each(function(i,row){ // 轮播图片 高要注意 str =
				 * str + '<li><img
				 * style="height:'+((794.00/1080)*getWinXY().Y)+'px;"
				 * src="'+index_nav.PICURI+row.picPath+'"></li>';
				 * //console.log(row); }) $("#index_top").html(str);
				 * $(window).resize(function(){ $("#index_top
				 * img").css("height",(794.00/1920)*($(window).width())+"px");
				 * 
				 * }); //console.log(data); bannerAnimate();//轮播图动画
				 */},
			error : function() {
				layer.alert('查询加载失败！');
			}
		});
	},
	/**
	 * 加载摄影活动4个
	 */
	loadActivities : function() {
		$.ajax({
			url : "/sjcq/ptgyatv/searchActiveData",
			type : "post",
			dataType : "json",
			async : true,
			data : {
				type : 0,
				pageIndex : 1,
				pageSize : 4,
				orderBy : "id"
			},
			success : function(data) {
				var html = "";
				$("#allPage").val(data.tatalPages);
				$.each(data.rows, function(index, item) {
					html += '<li onclick=\'index.jumpActivityPage("' + item.id + '",\"' + item.atyXh + '\")\'><div class="hd_info">';
					html += '<div class="img">';
					html += '<p><img src="' + index_nav.PICURI + item.atyCoverImg + '"></p>';
					html += '<div class="hd_ipr">';
					html += '<div class="hdti">' + item.atyTitle + '</div>';
					html += '<div class="hdci"><i class="ico ico31"></i>' + item.atyAwards + '</div>';
					html += '</div>';
					html += '</div>';
					html += '<p class="tit">' + item.atyReleaseUnit + '</p>';
					html += '<p class="con"><i class="ico ico32"></i>距截稿：' + item.executeFinishDays + '天</p>';
					html += '<p class="hd_zt"><i class="ico ico33">' + item.statusInfo + '</i></p>';
					html += '</div></li>';
				});
				$("#activities").html(html);
			},
			error : function() {
				layer.alert('查询加载失败！');
			}
		});
	},
	
	
	/**
	 * 跳转活动页面
	 * 
	 * @param id
	 */
	jumpActivityPage : function(id,atyXh) {
	/*	window.open("activityDetail.html?id=" + id, "_blank");*/
			window.open("../../activity/introduction.html?id=" +id+"&atyXh="+atyXh, "_self");
	},
	/**
	 * 获取热门图片的二级分类
	 */
	loadType : function() {
		$.ajax({
			url : "/sjcq/manage/hotPicSort/getAll", // 请求的url地址
			type : "post", // 请求方式
			dataType : "json", // 返回格式为json
			async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
			data : {}, // 参数值 broType 轮播类型
			success : function(data) {
				var tem = "";
				$(data).each(function(i, row) {
					// class="cur"
					// if(i==0){
					// tem = tem + '<a href="javascript:void(0)" onclick=""
					// >'+row.sortName+'</a>';
					// }else{
					tem = tem + '<a href="javascript:void(0)" onclick="index.loadImg(\'' + row.uuid + '\',this)" >' + row.sortName + '</a>';
					// }
				});
				$("#hot_pic_type").html(tem);
				console.log(data);
			},
			error : function() {
				layer.alert('查询加载失败！');
			}
		});
	},
	/**
	 * 热门图片模块 加载
	 * 
	 * @param uuid
	 *            分类uuid
	 * @param _this
	 * @param state
	 *            状态 0：查询所有
	 */
	loadImg : function(uuid, _this, state) {
		$("#hot_pic").html("");// 清空数据
		$(_this).siblings().each(function() {// 取消其他选中
			$(this).attr("class", "");
		});
		$(_this).attr("class", "cur");// 选中当前类

		$.ajax({
			url : "/sjcq/manage/hotPicInfo/getPicPageInfo", // 请求的url地址
			type : "post", // 请求方式
			dataType : "json", // 返回格式为json
			async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
			data : {
				sortUUid : uuid,
				pageIndex : 1,
				pageSize : 12
			}, // 参数值 broType 轮播类型
			success : function(data) {
				if (data.rows == null || data.rows == "") {
					return false;
				}
				var tem = "";
				$("#hot_pic").css("width", (((436.00 / 1920) * (getWinXY().X)) + 11) * 4 + "px");
				$(data.rows).each(
						function(i, row) {
							tem = tem + "<li>";
							tem = tem + "<div class=\"img_info\">";
							tem = tem + "<a href=\"javascript:void(0)\" onclick=\"in_search.imgJump('" + row.pic_xh + "')\">";
							tem = tem + "<p class=\"img\" style=\"width:" + (436.00 / 1920) * (getWinXY().X) + "px;height:" + (330.00 / 1080) * (getWinXY().Y) + "px;\">"
									+ "<img src=\"" + index_nav.PICURI + row.pic_lylys + "\" style=\"width:100%;height:100%;\"></p>";
							tem = tem + "</a>";
							tem = tem + "<div class=\"atr_info\" style=\"text-align:left;\">";
							// tem = tem + '<div
							// class="atit">'+row.pic_mc+'</div>';
							// <span class=\"userimg\"><img
							// src="../project/images/usering.png" width="28"
							// height="28"></span>
							tem = tem + "<p>" + row.pic_scz + "</p>";
							tem = tem + "<span class=\"edainfo\">";
							if (row.collect) {
								tem = tem + "<span ><i class=\"ico ico24f \" onclick=\"in_browse.delCollect('" + row.pic_xh + "','',0,this)\"></i></span>";
							} else {
								tem = tem + "<span ><i class=\"ico ico18 \" onclick=\"in_browse.addCollect('" + row.pic_xh + "','',0,this)\"></i></span>";
							}
							tem = tem + "<i class=\"ico ico19\" onclick=in_pay.add('" + row.pic_xh + "')></i>";
							tem = tem + "</span>";
							tem = tem + "</div>";
							tem = tem + "</div>";
							tem = tem + "</li>";
						});
				$("#hot_pic").html(tem);
				$(window).resize(function() {
					$("#hot_pic").css("width", (((436.00 / 1920) * ($(window).width())) + 11) * 4 + "px");
					$("#hot_pic .img").css("width", (436.00 / 1920) * ($(window).width()) + "px");
					$("#hot_pic .img").css("height", (330.00 / 1920) * ($(window).width()) + "px");

				});
				console.log(data);
			},
			error : function() {
				layer.alert('查询加载失败！');
			}
		});
	},
	initSlideWidthAndHeight : function() {
		/*
		 * var width= $("#mySlide").parent().width();
		 * $("#mySlide").height(width*(9/16)); $("#mySlide"). width(width);
		 */
	}
}

/**
 * 摄影活动点击下一页
 */
/*var tatalPages = 1;*/
$(function(){
	$(".yx_rt").click(function(){
		var allPage=$("#allPage").val();
		var pageNum_n = $("#mypage").val();
		if(parseFloat(allPage)>1){
			if(parseFloat(allPage)==parseFloat(pageNum_n)){
				$("#mypage").val(1);
				pageIndex=1;
			}else{
				$("#mypage").val(parseFloat(pageNum_n)+1);
				pageIndex=parseFloat(pageNum_n)+1;
			}
		
		}else{
			return ;
		}
		$.ajax({
			url : "/sjcq/ptgyatv/searchActiveData",
			type : "post",
			dataType : "json",
			async : true,
			data : {
				type : 0,
				pageIndex : pageIndex,
				pageSize : 4,
				orderBy : "id"
			},
			success : function(data) {
				var html = "";
				 $("#allPage").val(data.tatalPages);
				$.each(data.rows, function(index, item) {
					html += '<li onclick=\'index.jumpActivityPage("' + item.id + '",\"' + item.atyXh + '\")\'><div class="hd_info">';
					html += '<div class="img">';
					html += '<p><img src="' + index_nav.PICURI + item.atyCoverImg + '"></p>';
					html += '<div class="hd_ipr">';
					html += '<div class="hdti">' + item.atyTitle + '</div>';
					html += '<div class="hdci"><i class="ico ico31"></i>' + item.atyAwards + '</div>';
					html += '</div>';
					html += '</div>';
					html += '<p class="tit">' + item.atyReleaseUnit + '</p>';
					html += '<p class="con"><i class="ico ico32"></i>距截稿：' + item.executeFinishDays + '天</p>';
					html += '<p class="hd_zt"><i class="ico ico33">' + item.statusInfo + '</i></p>';
					html += '</div></li>';
				});
				$("#activities").html(html);
			},
			error : function() {
				layer.alert('查询加载失败！');
			}
		});
	});
	$(".yx_lt").click(function(){
		var allPage=$("#allPage").val();
		var pageNum_n = $("#mypage").val();
		if(parseFloat(pageNum_n)==1){
			$("#mypage").val(allPage);
			pageIndex= allPage;
		}else{
			$("#mypage").val(parseFloat(pageNum_n)-1);
			pageIndex = parseFloat(pageNum_n)-1;
		}
		$.ajax({
			url : "/sjcq/ptgyatv/searchActiveData",
			type : "post",
			dataType : "json",
			async : true,
			data : {
				type : 0,
				pageIndex : pageIndex,
				pageSize : 4,
				orderBy : "id"
			},
			success : function(data) {
				 $("#allPage").val(data.tatalPages);
				var html = "";
				$.each(data.rows, function(index, item) {
					html += '<li onclick=\'index.jumpActivityPage("' + item.id + '",\"' + item.atyXh + '\")\'><div class="hd_info">';
					html += '<div class="img">';
					html += '<p><img src="' + index_nav.PICURI + item.atyCoverImg + '"></p>';
					html += '<div class="hd_ipr">';
					html += '<div class="hdti">' + item.atyTitle + '</div>';
					html += '<div class="hdci"><i class="ico ico31"></i>' + item.atyAwards + '</div>';
					html += '</div>';
					html += '</div>';
					html += '<p class="tit">' + item.atyReleaseUnit + '</p>';
					html += '<p class="con"><i class="ico ico32"></i>距截稿：' + item.executeFinishDays + '天</p>';
					html += '<p class="hd_zt"><i class="ico ico33">' + item.statusInfo + '</i></p>';
					html += '</div></li>';
				});
				$("#activities").html(html);
			},
			error : function() {
				layer.alert('查询加载失败！');
			}
		});
	});
});



// 顶部轮播图
function bannerAnimate() {
	var banner = $('.top_banner').unslider({
		dots : true,// 是否有点
		fluid : true,// 是否响应式
		speed : 1000,
		delay : 3500
	// 轮播的快慢
	})
	var banData = banner.data('unslider');
	$('.ban_arrow').click(function() {
		var fn = this.className.split(' ')[0];
		banData[fn]();
	});
}

/**
 * 禁用鼠标右键
 */
if (window.Event) {
	document.captureEvents(Event.MOUSEUP);
}

function nocontextmenu() {
	event.cancelBubble = true;
	event.returnValue = false;
	return false;
}

function norightclick(e) {
	if (window.Event) {
		if (e.which == 2 || e.which == 3) {
			return false;
		}
	} else if (event.button == 2 || event.button == 3) {
		event.cancelBubble = true
		event.returnValue = false;
		return false;
	}
}

document.oncontextmenu = nocontextmenu; // for IE5+
document.onmousedown = norightclick; // for all others

function isUpImg() {
	// 先判断是否登陆，再判断是否是供稿人
	getSessoin();
	var user = USRSESSION; // 获取用户
	if (user == null || user == "null") {
		index_nav.open('../login.html');
	} else {
		var userType = user.userType;
		if(userType == 0){
			alert("您还未成为供稿用户，请先通过审核！");
			location.href="/vision/html/user_uploadImg.html?type=0";
		}else{
			location.href="/vision/html/user_uploadImg.html?type=1";
		}
	}
}