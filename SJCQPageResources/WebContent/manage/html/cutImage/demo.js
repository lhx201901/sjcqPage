// 防劫持
(function() {
  var href = window.self.location.href;
//0218
  /*if (window.frameElement) {
    (window.top || window.parent).location.href = href;
    return;
  };*/

  // var site = window.self.location.protocol + '//' + window.self.location.hostname;

  // try {
  //   if (window.top.location.href !== href) {
  //     window.top.location.href = site + '/404.html';
  //   };
  // } catch(e) {
  //   window.self.location.href = site + '/404.html';
  // };
})();


/**
 * 代码高亮
 */
hljs.initHighlightingOnLoad();

// 导航高亮当前位置
(function() {
  // console.log(typeof document.querySelector)
  if (typeof document.querySelectorAll !== 'function') {return};

  var hrefs = {
    full: location.href,
    path: location.href
  };

  if (hrefs.path.indexOf('?') >= 0) {
    hrefs.path = hrefs.path.slice(0, hrefs.path.indexOf('?'));
  };

//  var links = document.getElementById('nav').querySelectorAll('a');
  var _link;
  var _index;

  // console.log(hrefs);

/*  for (var i = 0, l = links.length; i < l; i++) {
    _link = links[i].href;

    if (_link === hrefs.full) {
      _index = i;
      break;
    };

    if (_link.indexOf('?') >= 0) {
      _link = _link.slice(0, _link.indexOf('?'));
    };

    if (_link === hrefs.path) {
      _index = i;
      break;
    };
  };

  if (typeof _index === 'number' && _index >= 0) {
    links[_index].parentNode.classList.add('n');
  };*/
})();

function save(){
	var picPath=$("#picPath1").attr('src');
	if(picPath.trim()==""){
		$box.promptBox("请选择图片！");
		return;
	}
	 if(type=="updateFile"){
		if(FILE!=undefined && FILE.size>0){
			if(BROAD.x==undefined || BROAD.x==null){
				$box.promptBox("请选择图片需要切割的区域！");
				return ;
			}
		}
	 }else if(BROAD.x==undefined || BROAD.x==null){
		$box.promptBox("请选择图片需要切割的区域！");
		return ;
	}
	if($("#picName").val()==""){
		$box.promptBox("请输入图片名称！");
		return;
	}
	if($("#picContent").val()==""){
		$box.promptBox("请输入图片内容！");
		return;
	}
	console.log(BROAD);
	BROAD.broType="1";//首页轮播
	BROAD.picAuthor=$("#picAuthor").val();
	BROAD.picName=$("#picName").val();
	BROAD.picContent=$("#picContent").val();
	BROAD.isUsed=$(':radio[name="isUsed"]:checked').val();
	BROAD.pageDivWidth="800";
	if(type=="addFile"){//先上传文件再切图
		if(FILE!=undefined && FILE.size>0){
			var data = new FormData();
			data.append("pic", FILE);
			console.log(FILE);
			var picYtlj="";
			if(BROAD.picPath!=undefined && BROAD.picPath!=null){
				picYtlj=BROAD.picPath;
			}
			$box.promptBox("图片上传中请稍等！");
			$.ajax({
				contentType : "multipart/form-data",
				url : "/sjcq/broadcast/uploadBroad?broType=1&picYtlj="+encodeURIComponent(""),
				type : "POST",
				async:true,
				data : data,
				dataType : "text",
				processData : false, // 告诉jQuery不要去处理发送的数据
				contentType : false, // 告诉jQuery不要去设置Content-Type请求头
				success : function(data) {
					var json = JSON.parse(data);
					if(json.succ){
						BROAD.picPath=json.pic;
						console.log(BROAD);
						saveData();
					}else{
						$box.promptBox("文件上传失败！");
					}
				},
			    error:function(data){
			    	if(data.status==503){
			    		$box.promptBox("当前上传人数过多,请稍后重试！");
			    		return;
			    	}else{
			    		$box.promptBox("服务异常！");
			    		return;
			    	}
			    }
			});
		}else{
			$box.promptBox("请选择文件后上传！");
		}
	}else if(type=="updateFile"){
		//先上传文件再切图
		if(FILE!=undefined && FILE.size>0){
			var data = new FormData();
			data.append("pic", FILE);
			console.log(FILE);
			var picYtlj="";
			if(BROAD.picPath!=undefined && BROAD.picPath!=null){
				picYtlj=BROAD.picPath;
			}
			$box.promptBox("图片上传中请稍等！");
			$.ajax({
				contentType : "multipart/form-data",
				url : "/sjcq/broadcast/uploadBroad?broType=1&picYtlj="+encodeURIComponent(""),
				type : "POST",
				async:true,
				data : data,
				dataType : "text",
				processData : false, // 告诉jQuery不要去处理发送的数据
				contentType : false, // 告诉jQuery不要去设置Content-Type请求头
				success : function(data) {
					var json = JSON.parse(data);
					if(json.succ){
						BROAD.picPath=json.pic;
						console.log(BROAD);
						updateData();
					}else{
						$box.promptBox("文件上传失败！");
					}
				},
			    error:function(data){
			    	if(data.status==503){
			    		$box.promptBox("当前上传人数过多,请稍后重试！");
			    		return;
			    	}else{
			    		$box.promptBox("服务异常！");
			    		return;
			    	}
			    }
			});
		}else{
			updateData();
		}
	}else{//直接切图
		BROAD.picPath=ytLj;
		BROAD.picXh=picXh;
		saveData();
	}


}
/**
 * 数据交互，保存修改数据
 * @param BROAD
 */
function saveData(){
	$box.promptBox("数据提交中请稍等！");
	console.log(BROAD);
	$.ajax({
	    url:"/sjcq/broadcastAudit/addBroadcastAudit",
	    dataType:"json",
	    async:true,
	    data:BROAD,
	    type:"post",
	    success:function(data){
	    	$box.promptBox(data.resultInfo);
	    	if(data.resultStatus==true || data.resultStatus=="true"){
				$('#myModal').on('hidden.bs.modal', function () {
					parent.closableTab.closeThisTab(PARAM.tabId);
					//MAIN_PAGE_WINDOW.searchData();
			    });
	    	}
	    },
	    error:function(){
	    	$box.promptBox("服务异常！");
	    }
	});
}
/**
 * 数据交互，保存修改数据
 * @param BROAD
 */
function updateData(){
	BROAD.updateDate=new Date();
	$box.promptBox("数据提交中请稍等！");
	console.log(BROAD);
	$.ajax({
	    url:"/sjcq/broadcast/updateBroadcastCover",
	    dataType:"json",
	    async:true,
	    data:BROAD,
	    type:"post",
	    success:function(data){
	    	if(data){
	    		$box.promptBox("保存成功！");
				$('#myModal').on('hidden.bs.modal', function () {
					parent.closableTab.closeThisTab(PARAM.tabId);
					MAIN_PAGE_WINDOW.searchData();
			    });
	    	}
	    },
	    error:function(){
	    	$box.promptBox("服务异常！");
	    }
	});

}


/**
 * 根据序号加载详情
 * @param broadId
 */
function findInfoById(broadId){
	if(broadId=="" || broadId==null || broadId==undefined){
		return;
	}
	$.ajax({
	    url:"/sjcq/broadcast/findBroadById",
	    dataType:"json",
	    async:true,
	    data:{id:broadId},
	    type:"post",
	    success:function(data){
	    	if(data){
	    		BROAD=data;
	    		$("#picAuthor").val(data.picAuthor);
	    		$("#picName").val(data.picName);
	    		$("#picContent").val(data.picContent);
	    		$(":radio[name='isUsed'][value='" + data.isUsed + "']").prop("checked", "checked");
	    		 var $img = $("#target");
	    		 $img.attr('src', PICURI+"/"+data.picPath);
	    		 $pimg.attr('src', PICURI+"/"+data.picPath);
	    		 initJcrop();
	    	}else{
	    		$box.promptBox("查询轮播封面信息失败！");
	    	}
	    },
	    error:function(){
	    	alert("查询加载错误！");
	    }
	})
}