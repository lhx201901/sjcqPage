$(function(){
	var USRSESSION = null;
/*	// 活动uuid
	var atuid = "43392ad9-8515-4d43-86c6-9651634819f6";
	// 活动id
	var atid = "1";*/
	
	//获取参数
	var url = window.location.search;
	// 正则筛选地址栏
	var reg = new RegExp("(^|&)"+ "atyXh" +"=([^&]*)(&|$)");
	var reg2 = new RegExp("(^|&)"+ "id" +"=([^&]*)(&|$)");
	// 匹配目标参数
	var result = url.substr(1).match(reg);
	var result2 = url.substr(1).match(reg2);
	//返回参数值
	atuid= result ? decodeURIComponent(result[2]) : null;
	atid= result2 ? decodeURIComponent(result2[2]) : null;
	//根据活动序号查询当前活动获奖情况
	if(atuid == "" || atuid == null){
		AlertBox.alert("没有该活动！");
	}
	getSessoin();
	if (USRSESSION != null) {
		var user = USRSESSION; // 获取用户
		// 用户id
		var id = user.uuid;
		// 是否报名参赛
		$.ajax({
			url : "/sjcq/homepage/joinAt",
			type : "POST",
			async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
			data : {
				id : id,
				atuid : atuid
			},
			dataType : "JSON",
			success : function(data2) {
					// 头部内容
					$.ajax({
						url : "/sjcq/homepage/getStatusInfoByAtyXh", // 请求的url地址
						type : "POST", // 请求方式
						dataType : "json", // 返回格式为json
						async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
						data : {
							uuid : atuid
						}, // 参数值
						success : function(data) {
							console.log("==");
							console.log(data);
							$(".nr").html(data.atyTitle);
							$(".dw").html(data.atyReleaseUnit);
							$(".jj").html(data.atyAwards);
							if (data.statusInfo != "已结束" && data.statusInfo != "活动异常") {
								if(data2 == "2"){
									$(".status").html("报名参赛");
								}else{
									$(".status").html("上传图片");
								}
							} else {
								$(".status").html(data.statusInfo);
							}
							$("#stopDate").html(data.executeFinishDays);

						},
						error : function() {
							layer.alert('加载数据失败！');
						}
					});
			},
			error : function() {
				layer.msg('报名异常！请联系管理员');
			}
		});
	}else{
		// 头部内容
		$.ajax({
			url : "/sjcq/homepage/getStatusInfoByAtyXh", // 请求的url地址
			type : "POST", // 请求方式
			dataType : "json", // 返回格式为json
			async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
			data : {
				uuid : atuid
			}, // 参数值
			success : function(data) {
				$(".nr").html(data.atyTitle);
				$(".dw").html(data.atyReleaseUnit);
				$(".jj").html(data.atyAwards);
				if (data.statusInfo != "已结束" && data.statusInfo != "活动异常") {
					$(".status").html("报名参赛");
				} else {
					$(".status").html(data.statusInfo);
				}
				$("#stopDate").html(data.executeFinishDays);

			},
			error : function() {
				layer.alert('加载数据失败！');
			}
		});
	}
	
	
	// 版块内容
/*	$.ajax({
		url : "/sjcq/homepage/getIdByAtyXh", // 请求的url地址
		type : "POST", // 请求方式
		dataType : "json", // 返回格式为json
		async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {
			id : atid
		}, // 参数值
		success : function(data) {
			var real = eval(data);
			var len = real.length;
			var content = "";
			for (var i = 0; i < len; i++) {
				if (i < 1) {
					content += "<div class='tit'>" + real[i].textTitle + "</div><div class='con'>";
				} else {
					content += "<div class='tit mt20'>" + real[i].textTitle + "</div><div class='con'>";
				}
				content += real[i].textContent + "</div>";
			}
			$(".mb").append(content);
		},
		error : function() {
			layer.alert('加载数据失败！');
		}
	});*/

	//状态信息
	$(".status").click(function() {
		if ($(".status").html() == "报名参赛") {
			if (USRSESSION != null) {
				var user = USRSESSION; // 获取用户
				// 用户id
				var id = user.uuid;
				// 报名参赛
				$.ajax({
					url : "/sjcq/homepage/addAP", // 请求的url地址
					type : "POST", // 请求方式
					dataType : "json", // 返回格式为json
					async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
					data : {
						id : id,
						atuid : atuid
					}, // 参数值
					success : function(data) {
						layer.msg('参赛成功！');
						$(".status").html("上传图片");
						/*window.location.reload();*/
					},
					error : function() {
						layer.alert('报名失败！请联系管理员');
					}
				});

			} else {
				/*$(".ui_mask2").css("display", "block");
				$(".register_box").css("display", "block");*/
				openQuickRegister();
			}
		}else if($(".status").html() == "上传图片"){
			location.href="upImg.html?atyXh="+atuid;
		}
	});
	
	/**
	 * 
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
				if (data.status) {
					USRSESSION = data.account;
				}
			},
			error : function() {
			}
		});
	}

});
//全部作品
function reLoadAprize(){
	location.href="allWorks.html?id="+atid+"&atyXh="+atuid;
}
//获奖情况
function productions(){
	location.href="winaprize.html?id="+atid+"&atyXh="+atuid;
}
//活动简介
function atyIntroduction(){
	location.href="introduction.html?id="+atid+"&atyXh="+atuid;
}


/**
 * 关闭快速注册
 */
function closeQuickRegister(){
	$(".register_box").hide();
	$(".ui_mask").hide();
	
}
/**
 * 打开快速注册
 */
function openQuickRegister(){
	$(".ui_mask").show();
	$(".register_box").show();
	$(".register_box iframe").attr("src","./quickRegister.html");
}

