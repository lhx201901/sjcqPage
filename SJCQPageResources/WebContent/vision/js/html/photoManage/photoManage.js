/**
 * 作品管理上下架--js
 */
$(function() {
	$('#searchW_words').keydown(function(e){
		if(e.keyCode==13){
			loadMyPhoto();
		}
	})
	$("#is_shelves").change(function(){
		loadMyPhoto();
	});
})

/**
 * 检索获取条件
 */
function getParam() {
	var obj = {};
	obj.pageIndex = 1;
	pageSize = $("#page_size").val();
	obj.pageSize = pageSize;
	obj.orderField = "pic_scsj";
	obj.orderType = "desc";
	var searchWord = {};
	searchWord.table = "d_photo_pic";// 要查询的表，图集还是图片
	searchWord.is_shelves = $("#is_shelves").val();
	searchWord.in_audit = 1;
	searchWord.pic_mj = 1;
	var term = $("#searchW_words").val().replace(/ /g, '@');
	searchWord.term = term;//  查询字段
	obj.searchWord = JSON.stringify(searchWord);
	return obj;
}

/**
 * 初始加载
 */
function loadMyPhoto() {
	var obj = getParam();
	$.ajax({
		url : "/sjcq/retriebe/mySolrSearch",
		dataType : "json",
		async : false,
		data : obj,
		type : "post",
		success : function(data) {
			init_table(data.rows);
			$("#total_records").text(data.total);
			$("#this_page").text(1);
			var pageSize = $("#page_size").val();
			$("#total_page").text(Math.ceil(data.total / pageSize));
			var url = "/sjcq/retriebe/mySolrSearch";
			setCommon(obj, Table_Obj, url);
		},
		error : function() {
		}
	})
}
/**
 * 初始化表格
 */
function init_table(datas) {
	var esay = $("#TableContainer").easyTable({
		data : datas, // 初始数据，动态添加可以通过setData
		hideCheckbox : true, // 否显示复选框，获取复选框选择的数据用方法getCheckedItem
		//				rowClick : function(data) {// 行点击回调，参数为改行数据
		//					alert(JSON.stringify(data))
		//				},
		rowDoubleClick : function(data) {// 行双击回调，参数为改行数据
			//alert(JSON.stringify(data))
		},
		columns : [ {// 表格结构配置
			title : "图片",// 列title文字
			field : "pic_lylys",// 该列对应数据哪个字段
			width : "10%",// 列宽度设置,不设也没什么
			align:"center",
			render : function(data) {
				var html = "";
				html += '<div class="hill_img" style="align:center;"><div class="hl_img"><img src="' + index_nav.PICURI + data.pic_lylys + '"></div></div>';
				return html;
			}
		}, {
			title : "图片信息",
			field : "pic_mc",
			width : "50%",
			render : function(data) {
				var html = "";
				html += '<p><span style="font-weight: bold;">标题：</span>' + data.pic_mc + '</p>';
				html += '<p><span style="font-weight: bold;">摄影者：</span>' + data.pic_syz + '</p>';
				if (data.pic_remark.length > 50) {
					html += '<p><span style="font-weight: bold;">主说明：</span>' + data.pic_remark.substring(0, 50) + '……</p>';
				} else {
					html += '<p><span style="font-weight: bold;">主说明：</span>' + data.pic_remark + '</p>';
				}
				if (data.picfremark.length > 50) {
					html += '<p><span style="font-weight: bold;">分说明：</span>' + data.picfremark.substring(0, 50) + '……</p>';
				} else {
					html += '<p><span style="font-weight: bold;">分说明：</span>' + data.picfremark + '</p>';
				}
				return html;
			}

		}, {
			title : "价格(人名币:元)",
			field : "pic_jg",
			width : "10%"
		}, {
			title : "密级状态",
			field : "pic_mj",
			width : "8%",
			render : function(data) {
				if (data.pic_mj == 1) {
					return "公开";
				} else {
					return "非公开";
				}
			}
		}, {
			title : "上下架状态",
			field : "is_shelves",
			width : "8%",
			render : function(data) {
				if (data.is_shelves == 1) {
					return "上架";
				} else {
					return "下架";
				}
			}
		}, {
			title : "操作",
			render : function(data) {

				return loadOperater(data);//'<a href="#">查看</a><a href="#" class="ml10">编辑</a><a href="#" class="ml10" onclick="test_delete()">删除</a>';
			}
		} ]
	});
	Table_Obj = esay;
}

/**
 * 加载方法
 * @param data
 * @returns {String}
 */
function loadOperater(data) {
	var html = "";
	if (data.is_shelves == 0) {
		html += '<a class="ml10" onclick="oneUp(\'' + data.pic_xh + '\','+data.pic_jg+')">上架</a>';
		html += '<a class="ml10" onclick="setJG(\'' + data.pic_xh + '\')">定价</a>';
	} else {
		html += '<a class="ml10" onclick="setDown(\'' + data.pic_xh + '\')">下架</a>';
	}
	return html;
}

/**
 * 检索
 */
function searchData() {
	alert();
	var pageSize = $("#page_size").val();
	var pageIndex = 1;
	var obj = {};
	obj.pageSize = pageSize;
	obj.pageIndex = pageIndex;
	var othr = getParam();
	reset_serach(othr, obj);
	var is_shelves = $("#is_shelves").val();
	if (is_shelves.trim().length == 0) {
		$("#beacthUp").hide();
		$("#beacthJg").hide();
		$("#beacthDown").hide();
	} else if (is_shelves == "1") {
		$("#beacthUp").hide();
		$("#beacthJg").hide();
		$("#beacthDown").show();
	} else if (is_shelves == "0") {
		$("#beacthUp").show();
		$("#beacthJg").show();
		$("#beacthDown").hide();
	}
}

/**
 * 上架
 */
function shelvesUp(picXh) {
	layer.confirm('确定图片上架吗？', {
		btn : [ '确定', '取消' ]
	// 按钮
	},  function (index){
	        $.ajax({
	        	url : "/sjcq/photoPicManage/addPicShelvesTask",
//	        	url : "/sjcq/photoPic/picShelvesUp",
				type : "post", 
				dataType : "text", 
				async : false,
				data : {
					picXh : picXh,
					picPices : $("#picPrice").val()
				}, // 参数值     state 0:密码登录 1:验证码登录
				success : function(data) {
					layer.alert(data+"<br>特别提醒：操作成功需等待1至2分钟更新数据");
					loadMyPhoto();
				},
				error : function() {
					layer.alert('查询加载失败！');
				}
	        }); 
	});
}


/**
 * 单个上架
 */
function oneUp(picXh,picJg){
	if(picJg==null || picJg=="" || picJg < 0){
		layer.alert("上架前需先定价，价格大于等于0", "");
		return;
	}
	shelvesUp(picXh);
}

/**
 * 批量上架
 */
function beacthUp(){
	var datas = Table_Obj.getCheckedItem();
	if(datas.length==0){
		layer.alert("未选择有效数据！", "");
		return;
	}
	var arr = new Array();
	$.each(datas, function(key, val) {
		arr[key] = val.pic_xh;
		if(val.pic_jg==null || val.pic_jg=="" || val.pic_jg < 0){
			layer.alert("上架前需先定价，价格大于等于0", "");
			return;
		}
	});
	var picxhs = arr.join(",");
	shelvesUp(picxhs);
}


/**
 * 定价
 */
function setJG(picXh) {
	var html = "<div>" + "<dl><dt>图片价格：</dt><dd><input type=\"text\" class=\"text\" value='' " + "id=\"picPrice\" onkeyup=\"if(!/^\\d+(\\.\\d{0,2})?$/.test(this.value)){this.value='';}\"" + " onafterpaste=\"if(!/^\\d+(\\.\\d{0,2})?$/.test(this.value)){this.value='';}\"   value='请输入图片价格' />￥（元）"
			+ "</dd></dl></div>";
	layer.confirm(html, {
		btn : [ '确定', '取消' ],
		title : '设置图片价格',
		btnAlign : 'c',
		area : [ '300px', '200px' ], //宽高
	// 按钮
	}, function(index) {
		if ($("#picPrice").val() == '请输入图片价格' || $("#picPrice").val() == '') {
			alert("请输入图片价格");
			return;
		}
		$.ajax({
			url : "/sjcq/photoPic/setJG",
			type : "post", 
			dataType : "json", 
			async : false,
			data : {
				picXhs : picXh,
				picJg : $("#picPrice").val()
			}, // 参数值     state 0:密码登录 1:验证码登录
			success : function(data) {
				if(data){
					layer.alert("操作成功！<br>特别提醒：操作成功需等待1至2分钟更新数据");
				}else{
					layer.alert("操作失败！");
				}
				
			},
			error : function() {
				layer.alert('查询加载失败！');
			}
		});
	});
}


/**
 * 批量定价
 */
function beacthJg(){
	var datas = Table_Obj.getCheckedItem();
	if(datas.length==0){
		layer.alert("未选择有效数据！", "");
		return;
	}
	var arr = new Array();
	$.each(datas, function(key, val) {
		arr[key] = val.pic_xh;
	});
	var picxhs = arr.join(",");
	setJG(picxhs);
}

/**
 * 单个下架
 * @param arr
 */
function setDown(pic_xh){
	var arr = new Array();
	arr[0] = pic_xh;
	shelvesDown(arr);
}

/**
 * 下架
 */
function shelvesDown(arr){
	 layer.confirm('确定图片下架？', {
			btn : [ '确定', '取消' ]
		// 按钮
		},  function (index){
	        $.ajax({
	            url:"/sjcq/photoPic/picShelvesDown",    // 请求的url地址
	            type:"post",   // 请求方式
	            contentType : 'application/json;charset=utf-8',
	            dataType:"text",   // 返回格式为json
	            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
	            data:JSON.stringify(arr) ,    // 参数值     state 0:密码登录 1:验证码登录
	            success:function(data){
	            	layer.alert(data+"<br>特别提醒：操作成功需等待1至2分钟更新数据");
	            	loadMyPhoto();
	            },
	            error:function(){
	                layer.alert('查询加载失败！');
	            }
	        }); 
		});
}

/**
 * 批量下架
 */
function beacthDown(){
	var datas = Table_Obj.getCheckedItem();
	if(datas.length==0){
		layer.alert("未选择有效数据！", "");
		return;
	}
	var arr = new Array();
	$.each(datas, function(key, val) {
		arr[key] = val.pic_xh;
	});
	shelvesDown(arr);
}