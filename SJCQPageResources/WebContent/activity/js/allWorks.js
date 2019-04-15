$(function() {
	var pageCount2 = 1;
	var pageCount = 1;
	search(pageCount2, true, "id");
	// showCenterPic();
	// 组图按钮
	$("#chooseImages").click(function() {
		$("#imgSearchName").val("");
		var orderText = $(".cur3").text();
		if (orderText == "最新图片") {
			$("#sola").removeClass("cur cur2");
			$("#chooseImages").addClass("cur cur2");
			chooseImagess(1, true, "id");
		} else {
			AlertBox.alert("组图不支持最新排名！");
			return;
			/* chooseImagess(1,true,"voteNum"); */
		}
	});
	
	//关闭中图
	$(".center_pic_window>div > .ed_sel_del").click(function(){
		$(".center_pic_window > .center_pic").attr("src","");
		$(".center_pic_window").hide(200);
	});
	
	

	// 单张按钮
	$("#sola").click(function() {
		$("#imgSearchName").val("");
		var orderText = $(".cur3").text();
		$("#sola").addClass("cur cur2");
		$("#chooseImages").removeClass("cur cur2");
		if (orderText == "最新图片") {
			search(1, true, "id");
		} else {
			search(1, true, "voteNum");
		}
	})

	// 最新图片按钮
	$("#newImg").click(function() {
		$("#imgSearchName").val("");
		$("#newImg").addClass("cur cur3");
		$("#newImgs").removeClass("cur cur3");
		newImage();
	});
	// 最新排名按钮
	$("#newImgs").click(function() {
		$("#imgSearchName").val("");
		if ($(".cur2").html() == "单张") {
			$("#newImgs").addClass("cur cur3");
			$("#newImg").removeClass("cur cur3");
			newImages();
		} else {
			AlertBox.alert("组图不支持最新排名！");
			return;
		}
	});

	// 搜索图片
	$("#searchImg").click(function() {
		var showType = $(".cur2").html();
		var orderTypeName = $(".cur3").html();
		var orderType = "";
		if(showType == "单张"){
			if (orderTypeName == "最新图片") {
				orderType = "id";
			} else {
				orderType = "voteNum";
			}
			var imgSearchTerm = $("#imgSearchName").val();
			searchImgs(1, true, orderType, imgSearchTerm);
		}else{
			if (orderTypeName == "最新图片") {
				orderType = "id";
				var imgSearchTerm = $("#imgSearchName").val();
				searchTj(1, true, orderType, imgSearchTerm);
			} else {
				AlertBox.alert("组图不支持最新排名！");
				return;
				/*orderType = "voteNum";*/
			}
		}
	});
	
});
function searchImgs(pageCount, type, orderType, imgSearchTerm) {
	$.ajax({
		url : "/sjcq/manage/searchImgs", // 请求的url地址
		type : "post", // 请求方式
		dataType : "json", // 返回格式为json
		async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {
			pageNumber : pageCount, // 页码
			pageSize : 8, // 页面大小
			activeId : atuid,// 活动序号
			orderType : orderType,// 排序方式
			imgSearchTerm : imgSearchTerm
		// 关键词
		}, // 参数值
		success : function(data) {
			/* var deleteImg = {}; */
			pageCount = Math.ceil(data.total / 8);// 获取 页数
			pageCount2 = pageCount;
			var html = "";
			if (data == null || data == "") {
				initPages(1, true, false, orderType);
			} else {
				$(data.rows).each(function(i, row) {
					var xtlj = index_nav.PICURI + row.picLylys;
					html = html + '<li><div class="img_info">';
					html = html + '<div class="img">';
					html = html + '<a href="javascript:void(0)"  onclick="showCenterPic(\''+xtlj+' \',\''+row.picFbl+' \')"   ondblclick="showPicDetail(\'' + row.id + '\')"    class="cur"><img src="' + xtlj + '""></a>';
					html = html + '</div>';
					html = html + '<div class="tped">';
					html = html + '<span><i class="ico piao"></i><font id="Img' + row.id + '">' + row.voteNum + '</font></span>';
					html = html + '<a href="javascript:void(0)" class="btn btn_ok" onclick="voteImg(\'' + row.picXh + '\')">投TA一票</a>';
					html = html + '</div>';
					html = html + '</li></div>';
				});
				$("#showImg").html(html);
				if (type) {// 是否第一次加载分页
					if (pageCount == 0) {
						pageCount = 1;
					}
					initPages(pageCount, true, false, orderType);
				}
			}
		}
	})
}


function searchTj(pageCount, type, orderType, imgSearchTerm) {
	$.ajax({
		url : "/sjcq/manage/searchTjImgs", // 请求的url地址
		type : "post", // 请求方式
		dataType : "json", // 返回格式为json
		async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {
			pageNumber : pageCount, // 页码
			pageSize : 8, // 页面大小
			activeId : atuid,// 活动序号
			orderType : orderType,// 排序方式
			imgSearchTerm : imgSearchTerm
		// 关键词
		}, // 参数值
		success : function(data) {
			console.log(data);
			pageCount = Math.ceil(data.total / 8);// 获取 页数
			pageCount2 = pageCount;
			var html = "";
			if (data == null || data == "") {
				initPages(1, true, false, orderType);
			} else {
				$(data.rows).each(function(i, row) {
					var xtlj = index_nav.PICURI + row.tjFmlj;
					html = html + '<li><div class="img_info">';
					html = html + '<div class="img">';
					html = html + '<a href="javascript:void(0)" class="cur"><img src="' + xtlj + '""></a>';
					html = html + '</div>';
					html = html + '<div class="tped">';
				});
				$("#showImg").html(html);
				if (type) {// 是否第一次加载分页
					if (pageCount == 0) {
						pageCount = 1;
					}
					initPages(pageCount, true, false, orderType);
				}
			}
		}
	})
}

/**
 * 根据活动uuid加载所有上传图片
 */
function search(pageCount, type, orderType) {
	$.ajax({
		url : "/sjcq/manage/showPicByActiveTwo", // 请求的url地址
		type : "post", // 请求方式
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {
			pageNumber : pageCount, // 页码
			pageSize : 8, // 页面大小
			activeId : atuid,// 活动序号
			orderType : orderType
		}, // 参数值
		success : function(data) {
			var deleteImg = {};
			pageCount = Math.ceil(data.total / 8);// 获取 页数
			pageCount2 = pageCount;
			var html = "";
			$(data.rows).each(function(i, row) {
				deleteImg.picXh = row.picXh;
				deleteImg.tjXh = row.tjXh;
				deleteImg.isAllowSale = row.isAllowSale;
				var xtlj = index_nav.PICURI + row.picLylys;
				html = html + '<li><div class="img_info">';
				html = html + '<div class="img">';
				html = html + '<a href="javascript:void(0)" onclick="showCenterPic(\''+xtlj+' \',\''+row.picFbl+' \')"  ondblclick="showPicDetail(\'' + row.id + '\')"    class="cur"><img src="' + xtlj + '""></a>';
				html = html + '</div>';
				html = html + '<div class="tped">';
				html = html + '<span><i class="ico piao"></i><font id="Img' + row.id + '">' + row.voteNum + '</font></span>';
				html = html + '<a href="javascript:void(0)" class="btn btn_ok" onclick="voteImg(\'' + row.picXh + '\')">投TA一票</a>';
				html = html + '</div>';
				html = html + '</li></div>';
			});
			$("#showImg").html(html);
			if (type) {// 是否第一次加载分页
				if (pageCount == 0) {
					pageCount = 1;
				}
				initPages(pageCount, true, false, orderType);
			}
		},
	})
};

/**
 * 分页
 * 
 * @param {*}
 *            pageCount 页数
 */
function initPages(pageCount, type, type2, orderType) {
	if (type2) {
		$("#pAndD_pages").createPage({
			pageCount : pageCount,
			current : 1,
			backFn : function(result) {
				chooseImagess(result, false, orderType);
			}
		})
	} else {
		$("#pAndD_pages").createPage({
			pageCount : pageCount,
			current : 1,
			backFn : function(result) {
				search(result, false, orderType);
			}
		})
	}
}

/**
 * 根据活动uuid展示图集
 */

function chooseImagess(pageCount, type, orderType) {
	$.ajax({
		url : "/sjcq/manage/showPicTjByActive", // 请求的url地址
		type : "post", // 请求方式
		dataType : "json", // 返回格式为json
		async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {
			pageNumber : pageCount, // 页码
			pageSize : 8, // 页面大小
			activeId : atuid,//
			orderType : orderType
		// 排序方式
		}, // 参数值
		success : function(data) {
			var deleteImg = {};
			pageCount = Math.ceil(data.total / 8);// 获取 页数
			pageCount2 = pageCount;
			var html = "";
			$(data.rows).each(function(i, row) {
				deleteImg.picXh = row.picXh;
				deleteImg.tjXh = row.tjXh;
				deleteImg.isAllowSale = row.isAllowSale;
				var xtlj = index_nav.PICURI + row.tjFmlj;
				html = html + '<li><div class="img_info">';
				html = html + '<div class="img">';
				html = html + '<a href="javascript:void(0)" class="cur"><img src="' + xtlj + '""></a>';
				html = html + '</div>';
				html = html + '<div class="tped">';
				/*
				 * html = html + '<span><i class="ico piao"></i>1200</span>';
				 * html = html + '<a href="#" class="btn btn_ok">投TA一票</a>';
				 */
				html = html + '</div>';
				html = html + '</li></div>';
			});
			$("#showImg").html(html);
			if (type) {// 是否第一次加载分页
				if (pageCount == 0) {
					pageCount = 1;
				}
				initPages(pageCount, true, true, orderType);
			}
		},
	})
}

// 最新图片
function newImage() {
	var orderText = $(".cur2").text();
	if (orderText == "单张") {
		search(1, true, "id");
	} else {
		chooseImagess(1, true, "id");
	}
};
// 最新排名
function newImages() {
	var orderText = $(".cur2").text();
	if (orderText == "单张") {
		search(1, true, "voteNum");
	} else {
		/* chooseImagess(1, true,"voteNum"); */
	}
}

// 点击投票
function voteImg(picXh) {
	$.ajax({
		url : "/sjcq/manage/voteImg", // 请求的url地址
		type : "post", // 请求方式
		dataType : "json", // 返回格式为json
		async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {
			picXh : picXh
		// 排序方式
		}, // 参数值
		success : function(data) {
			layer.msg(data.msg);
			if (data.succ) {
				// 获取当前最新票数
				$.ajax({
					url : "/sjcq/manage/getImgVote", // 请求的url地址
					type : "post", // 请求方式
					dataType : "json", // 返回格式为json
					async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
					data : {
						picXh : picXh
					// 排序方式
					}, // 参数值
					success : function(data) {
						$("#Img" + data.id).text(data.voteNum);
					}
				})
			}
		},
	})
}

var clickFlag = null;//是否点击标识（定时器编号）
function showCenterPic(url,picFbl){

	
    if(clickFlag) {//取消上次延时未执行的方法
        clickFlag = clearTimeout(clickFlag);
    }
    
    clickFlag = setTimeout(function() {
        //此处为单击事件要执行的代码
    	$(".center_pic_window").show(200);
    	$(".center_pic_window > .center_pic").attr("src",url);
    	$(".center_pic_window > .center_pic").width("auto");
    	$(".center_pic_window > .center_pic").height("auto");
    	 var picfblObj=  picFbl.split("×");
    	if(new Number(picfblObj[0]) >=new Number(picfblObj[1])){
    		$(".center_pic_window > .center_pic").width("700px");	
    	}else{
    		$(".center_pic_window > .center_pic").height("700px");
    	}
    }, 300);//延时300毫秒执行
	
}

function showPicDetail(picXh){
    if(clickFlag) {//取消上次延时未执行的方法
        clickFlag = clearTimeout(clickFlag);
    }
    window.open("../vision/html/atyPhotoDetail.html?img="+picXh+"","_blank");
}
