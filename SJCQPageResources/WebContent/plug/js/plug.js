/**
 * 加载操作栏
 * @param obj  数据格式 {id:"",url:"",method[{name:"method1",jsname:"方法一",jsparma:["123","321"]},{name:"method1",jsname:"方法二",jsparma:["123","321"]},{name:"method2",jsname:"方法三",jsparma:["123","321"]},{name:"method3",jsname:"方法四",jsparma:["123","321"]}]}
 * @returns {string}
 */
var IMGURL = "";
var PICURI="http://192.168.1.195:8083/photo/upload/DATA/";//后台图片加载前缀
$(document).ready(function(){
 //    String.prototype.trim=function(){return this.replace(/(^\s*)|(\s*$)/g,"");};//改变使用trim()方法时的ie不兼容
	// var cs_href=$("#contentStyle").prop("href");
	// if(cs_href.indexOf("black")>-1){
	// 	$("#contentStyle").attr("href",cs_href.replace(/black/, parent.THEME_NOW));
	// }else if(cs_href.indexOf("blue")>-1){
	// 	$("#contentStyle").attr("href",cs_href.replace(/black/, parent.THEME_NOW));
	// }else if(cs_href.indexOf("white")>-1){
	// 	$("#contentStyle").attr("href",cs_href.replace(/black/, parent.THEME_NOW));
	// }
	// IMGURL = loadImgUrl();
});
/**
 * 添加页签
 * @param id 当前页签的序号
 * @param name 页签名称
 * @param url 链接
 */
function addNewTab(id, name, url) {
	//var closable = $('#closable').val();
	var obj={};
	obj.MODULEID_ = id;
	var item = {
		'id' : id,
		'name' : name,
		'url' : encodeURI(url.trim() + "?param=" + JSON.stringify(obj)),
		'closable' : true
	};
//	alert(url + "?param=" + JSON.stringify(obj));
//	alert(encodeURI(url + "?param=" + JSON.stringify(obj)));
//	alert(item.url);
	closableTab.addTab(item);
}
/**
 * 添加标签页
 * @param id 唯一序号
 * @param name 标签名字
 * @param url 页面链接 
 * @param param 对象字符串
 */
function pageAddNewTab(id, name, url,param) {
	//var closable = $('#closable').val();
	var item = {
		'id' : id,
		'name' : name,
		'url' : encodeURI(url.trim() + "?param=" + param),
		'closable' : true
	};
	parent.closableTab.addTab(item);
}

function closeTab(item){
	parent.closableTab.closeTab(item);
}
/**
 * 动态设置iframe 的高度
 * @param divId 加载iframe 页面的div id
 * @param ifId iframe 的ID
 */
function setIframeHeight(divId,ifId){
	console.log(divId);
	console.log(ifId);
	var obj = document.getElementById(divId);
	
	var h = obj.offsetHeight;
	var w = obj.offsetWidth; //宽度
//	var tabId = "tab_container_"+ifId;
	var tabId = "tab_frame_"+ifId;
	var obj1 = window.parent.document.getElementById(tabId);
	var newHeight = h +80;
	if(newHeight< 960){
		newHeight =960
	}
	//alert(newHeight);
	obj1.style.height=newHeight +'px';
	console.log(window.parent.document.getElementById(tabId));
}

/**
 * 动态设置iframe 的高度
 * @param ifId iframe 的ID
 * @param h 加载页面的高度
 */
function setIframeHeight2(ifId,h){
	var tabId = "tab_frame_"+ifId;
	var obj1 = window.parent.document.getElementById(tabId);
	var newHeight=h;
	if(newHeight< 960){
		newHeight = 960
	}else{
		newHeight= h+80
	}
	obj1.style.height=newHeight +'px';
	console.log(window.parent.document.getElementById(tabId));
}
/**
 * 从iframe 的跳转中 获取模块序号
 * @returns
 */
function GetParamByRequest() {
	var url = location.href; // 获取url中"?"符后的字串
	url=decodeURI(url);
	var num = url.indexOf("?")
	str = url.substr(num + 1); // 取得所有参数 stringvar.substr(start [, length ]
	var name,value; 
	var arr = str.split("&"); // 各个参数放到数组里
	for (var i = 0; i < arr.length; i++) {
		num = arr[i].indexOf("=");
		if (num > 0) {
			name = arr[i].substring(0, num);
			value = arr[i].substr(num + 1);
			if(name == "param"){
				return JSON.parse(value);
			}
		}
	}
}
function getOperateMenue(obj,thisIndex){
	//alert(IMGURL);
	//loadImgUrl();
    var div= document.createElement("div");
    var dropdown_div= document.createElement("div");
    dropdown_div.setAttribute("class", "dropdown");
    var dropdown_a=document.createElement("a");
    dropdown_a.setAttribute("class","dropdown-toggle");
    dropdown_a.setAttribute("class","dropdownMenu_"+obj.id);
    dropdown_a.setAttribute("data-toggle","dropdown");
    dropdown_a.setAttribute("href","javascript:void(0);");
    var dropdown_img=document.createElement("img");
    //dropdown_img.setAttribute("src",obj.url);
    dropdown_img.setAttribute("src",IMGURL);
   //dropdown_img.setAttribute("src","../../../../img/moudleImage/menu.gif");
    dropdown_img.setAttribute("style","height:20px;width:20px");
    var dropdown_url=document.createElement("ul");
    dropdown_url.setAttribute("class","dropdown-menu");
    dropdown_url.setAttribute("role","menu");
    dropdown_url.setAttribute("aria-labelledby","dropdownMenu_"+obj.id);

    for(var i=0;i<obj.method.length;i++){
        var dropdown_li=document.createElement("li");
        dropdown_li.setAttribute("role","presentation");
        var dropdown_menuitem_a=document.createElement("a");
        dropdown_menuitem_a.setAttribute("role","menuitem");
        dropdown_menuitem_a.setAttribute("tabindex","-1");
        dropdown_menuitem_a.setAttribute("href","javascript:void(0);");
        if(obj.method[i].isuse=='1'){
            if(obj.method[i].jsparam!=null&&obj.method[i].jsparam!="undefined"&&obj.method[i].jsparam.length!=0){
                var getparam="";
                for(var j=0;j<obj.method[i].jsparam.length;j++){
                    getparam=getparam+"'"+obj.method[i].jsparam[j]+"',"
                }
                if(thisIndex!=undefined&&thisIndex!=null){
                    getparam=getparam+"'"+thisIndex+"'"
                }
                if(getparam.substring(getparam.length-1, getparam.length)==","){
                    getparam=getparam.substring(0, getparam.length-1);
                }
                dropdown_menuitem_a.setAttribute("onclick",obj.method[i].jsname+"("+ getparam  +")");
            }else{
                dropdown_menuitem_a.setAttribute("onclick","'"+obj.method[i].jsname+"("+ ")'");
            }
        }else{
            dropdown_menuitem_a.setAttribute('disabled','disabled');
            dropdown_li.setAttribute('disabled','disabled');
            dropdown_menuitem_a.setAttribute('style','color:gray;');
            dropdown_li.setAttribute('style','color:gray;');
        }

        dropdown_menuitem_a.innerHTML=obj.method[i].name;
        dropdown_li.appendChild(dropdown_menuitem_a);
        dropdown_url.appendChild(dropdown_li);
    }
    dropdown_a.appendChild(dropdown_img);
    dropdown_div.appendChild(dropdown_a);
    dropdown_div.appendChild(dropdown_url);
    div.appendChild(dropdown_div);
    return div.innerHTML;
}
//根据连接加载
function loadImgUrl(){
	var url1 = window.location.href;
	var url2 = url1.substring(0,url1.indexOf("?"));
	var url3 = url2.substring((url2.indexOf("ASS/html/")+9),url2.length);
	var url = "";
	if(url3.length >0){
		var arr = url3.split("/");
		for (var int = 0; int < arr.length; int++) {
			url += "../";
		}
		url += "img/moudleImage/menu.gif";
	}else{
		url = "../../../../img/moudleImage/menu.gif";
	}
	return url;
}

//刷新ztree某节点下的子节点
function refreshTree(treeId,refreshNode){
    var treeObj = $.fn.zTree.getZTreeObj(treeId);
    treeObj.reAsyncChildNodes(refreshNode,"refresh");
    //treeObj.expandAll(true);
}

//截取传递iframe 中的param参数的值,并转换为json对象
function getHrefParam(href){
    var dencode_href=decodeURI(href);
    if(dencode_href!=null&&dencode_href!=undefined&&dencode_href.indexOf("=")>=0){
    	if(dencode_href.substring(dencode_href.length-1)=="#"){
    		dencode_href=dencode_href.substring(0,dencode_href.length-1);
    	}
        return JSON.parse(dencode_href.substring(dencode_href.indexOf("=")+1,dencode_href.length));
    }
}

/**
 * 弹出提示框
 * @type {{promptBox: Function, promptSureBox: Function}}
 */
var $box = {
    /**
     * 只是弹出提示消息框
     * @param content 提示文字
     */
    promptBox: function (content) {
        $("#myModalLabel").html("消息提示");
        $("#myModal .modal-body").html(content);
        $("#myModal .modal-footer").html('<button class="btn closeBtn" data-dismiss="modal" aria-hidden="true">关闭</button>');
        $("#myModal").modal('show');
    },
    picBox: function (content,title) {
        $("#myModalLabel").html(title);
        $("#myModal .modal-body").html(content);
        $("#myModal .modal-footer").html('<button class="btn closeBtn" data-dismiss="modal" aria-hidden="true">关闭</button>');
        $("#myModal").modal('show');
    },
    /**
     *
     * @param content 提示文字
     * @param fun 传入方法名称 （字符串）
     * @param param  方法参数
     */
    promptSureBox:function (content,fun,param,title){
    	if(title!=null && title!=undefined && title.length>0){
    		$("#myModalLabel").html(title);
    	}else{    		
    		$("#myModalLabel").html("消息提示");
    	}
        $("#myModal .modal-body").html(content);
        var html = "<button class='btn btn-primary'  onmousedown='validator(\"right\")'  name='vali' onclick='"+fun+"(\""+param+"\")'>确定</button>";
        html += "<button class='btn closeBtn' data-dismiss='modal' aria-hidden='true'>取消</button>";
        $("#myModal .modal-footer").html(html);
        $("#myModal").modal('show');
    }
};



/**
 * 加载中的页面处理对象
 * @type {{}}
 */
var $loading = {
    /**
     * 显示加载数据层
     * @param content  层中的文字显示
     */
    show:function(content){
        var loadingDiv = $(document.body).find("#loadingDiv");
        if(loadingDiv.length<1){
            var loadHtml = '<div onselectstart="return false;" id="loadingDiv" style="background-color:#BBD5ED;opacity: 0.5;display:none;position:absolute;width:100%;height:100%;top:0px;left:0px;z-index:1000;">';
            loadHtml += '<div style="position: relative;top:200px;left: 40%;width: 20%;height: 100px; text-align: center;">';
            loadHtml += '<img src="/ASS/img/loading.gif" alt="数据处理中..."/><p></p></div></div>';
            $(document.body).append(loadHtml);
        }
        $("#loadingDiv p").text(content);
        $(document.body).find("#loadingDiv").show();
    },
    /**
     * 隐藏加载层
     */
    hide:function(){
        $(document.body).find("#loadingDiv").hide();
    }
}
/**
 * 创建表格
 * @type {{init: Function, refresh: Function}}
 */
var checkedRow=function(){}//选中的行信息
var unCheckedRow=function(){}//取消选中行信息
var $creatTable={
    /**
     *
     * @param tableId       表格绑定的id
     * @param URL           查询数据路径
     * @param searchParam  查询参数(JSON字符串)
     * @param tableColumns 列的初始化参数 例如:[{
            field: 'opter',
            title: '操作栏',
            formatter:tableformatter
        }, {
            field: 'tableEnName',
            title: '表名称'
        },{
            field: 'tableChName',
            title: '表别名'
        }]
     *eventsList:需要加入的相应的表格的事件
     * setTableOption:设置相应表格的option参数
     */
    init:function (parentId,tableId,URL,searchParam,tableColumns,eventsList,setTableOption){//初始化表格
        $("#"+parentId).empty();
        $("#"+parentId).html('<table id="'+tableId+'"></table>');
        var obj={
        	classes:"table table-no-bordered",
            url: URL,  //请求后台的URL（*）
            striped: true,   //是否显示行间隔色
            pagination: true,   //是否显示分页（*）
            sortable: true,   //是否启用排序
            ajaxOptions:{async:false},
            method:"post",
            sortOrder: "desc",   //排序方式
            sidePagination: "server",  //分页方式：client客户端分页，server服务端分页（*）
            queryParamsType: "",
            queryParams: function (params) {
                return {
                    offset: params.pageNumber,  //页码
                    limit: params.pageSize,   //页面大小
                    search:searchParam,
                    sort : params.sortOrder, //排序
                    order : params.sortName //排序
                }
            },
            // strictSearch:true,//设置为 true启用 全匹配搜索，否则为模糊搜索
            //  searchOnEnterKey:true,
            maintainSelected:true,//设置为 true 在点击分页按钮或搜索按钮时，将记住checkbox的选择项
            clickToSelect:false,//设置true 将在点击行时，自动选择rediobox 和 checkbox
            //  showPaginationSwitch:true,
            //  showColumns:true,
            selectItemName:"checked",
            //  search:true,
            //  fixedColumns: true,
            // fixedNumber:0,
            pageNumber:1,   //初始化加载第一页，默认第一页
            pageSize: 10,   //每页的记录行数（*）
            pageList: [5, 10, 50, 100], //可供选择的每页的行数（*）
            strictSearch: false,
            //height: 400,   //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "id",  //每一行的唯一标识，一般为主键列
            cardView: false,   //是否显示详细视图
            detailView: false,   //是否显示父子表
            columns: tableColumns,
            onCheck:function(row,tr){ //选中事件
            		checkedRow(row);
            },
            onUncheck:function(row,tr){ //取消选中事件
            		unCheckedRow(row);
            }
        };
        if(eventsList){
            $.each(eventsList,function(index,item){
                obj[item.eventName]=item.methodName;
            });}
        if(setTableOption){
            $.each(setTableOption,function(index,item){
                    obj[item.optionAttr]=item.optionValue;
            });}
        $('#'+tableId).bootstrapTable(obj);
    },
    refresh:function(tableId,searchParam){//刷新表格
    $("#"+tableId).bootstrapTable("refresh",{query: { offset:1,  //页码
        limit:function(){
       	 return $("#"+tableId).bootstrapTable('getOptions').pageSize;
        }(),   //页面大小
        search:searchParam,
        order : "asc", //排序
        sort :"id" //排序
    }});
    },

    /**
     * 统计 的 动态表格填充
     * @param param 查询参数
     * @param tableId  html 表Id
     * @param url 后台url
     * @returns {boolean}  返回值判断是否成功请求
     */
    initStatTbl:function(param,tableId,url,divId,ifId){
        $("#"+tableId).bootstrapTable("destroy");//每次加载销毁前面加载的表格
        var state = {};
        state.type=true;
        $loading.show("数据加载中,请稍后 • • •");
        $.ajax({
            url:url,//
            //contentType:"application/json;charset=utf-8",
            dataType: "json",
            type: "POST",
            async:false,
            data: param,
            success: function (result) {
                var columnAndRows=eval(result);
                state.datas=columnAndRows;
                $("#"+tableId).bootstrapTable({
                    //url: url,  //后台 URL 链接
                    striped: true,   //是否显示行间隔色
                    pagination: false,   //是否显示分页（*）
                    sortable: false,   //是否启用排序
                    ajaxOptions:{async:false},
                    //method: "post",
                    // strictSearch:true,//设置为 true启用 全匹配搜索，否则为模糊搜索
                    //  searchOnEnterKey:true,
                    //maintainSelected: true,//设置为 true 在点击分页按钮或搜索按钮时，将记住checkbox的选择项
                    //  showPaginationSwitch:true,
                    //  showColumns:true,
                    //selectItemName: "checdd",
                    //  search:true,
                    strictSearch: false,
                 //   height: 460,   //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
                    uniqueId: "ID_",   //每一行的唯一标识，一般为主键列
                    cardView: false,   //是否显示详细视图
                    detailView: false,   //是否显示父子表
                    columns:columnAndRows.column,//表头
                    data:columnAndRows.rows,//数据
                    onLoadSuccess:setIframeHeight(divId,ifId)
                });
                /**
                 * 合并单元格
                 */
                var statData = $('#' + tableId).bootstrapTable("getData");
                $.each(statData, function (index, ite) {
                    if (ite.isMerge == "true") {
                        $.each(ite.mergeParam, function (index_, item) {
                            $("#" + tableId).bootstrapTable('mergeCells', item);
                        });
                    }
                });
                $loading.hide();
            },
            error: function () {
                state.type = false;
            }
        });
        return state;
    }
};
/** wc
 *  20170502
 * 删除数组中的某个对象
 */
Array.prototype.remove = function(val) {
    for(var i=0; i<this.length; i++) {
        if(this[i] == val) {
            this.splice(i, 1);
            i--;
        }
    }
}
/**
 * 获取sessionId
 * @returns {String}
 */
function getSessionId(){
	var sessionId="";
	$.ajax({
		url:"/ASS/getSessionId",
		async:false,
        type: "POST",
		success:function(data){
			sessionId=data;
		},
		error:function(){
			alert("错误");
		}
	});
	return sessionId;
}

/**
 *后台连接返回数据
 * @param URL
 * @param paramObj
 * @returns {String}
 * @author xzq
 * @Create time :2017/07/26
 */
function getArrayItem(URL,paramObj){
	var message="";
    $.ajax({
        url: URL,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        type: "POST",
        async:false,
        data: JSON.stringify(paramObj),
        success: function (msg) {
           message=eval(msg);
        },
        error: function (result, status) {
			$box.promptBox("系统异常，请联系管理员！");
        }
    });
    return message;
}
/**
 * 浏览原文
 * @param tableId
 * @param DAH
 * @param id
 * @param userId
 */
function showOringal(tableId,DAH,id,userId,MODULE_ID,FIRST_MODULE_ID){
	//校验浏览权限
	 $.ajax({
	        url: " /ASS/checkBrowseAuthority",
	        contentType: "application/json;charset=utf-8",
	        dataType: "json",
	        type: "POST",
	        async:false,
	        data: JSON.stringify({tableId:tableId,userId:userId}),
	        success: function (msg) {
	            var message=eval(msg);
	            pageRedirect(message);
	            if(message.Mstate=="error"){
	            	$("#myModal").attr("style","width:70%;left:38%");
	                $("#myModal").modal('toggle');
	                $("#myModalLabel").html(message.Minfo);
	                $("#myModal .modal-body").html("<table id='handle_history'></table>");
	                $("#myModal .modal-footer").html( '<button class="btn closeBtn" data-dismiss="modal" aria-hidden="true">关闭</button>');
	            }else{
	            	var path = window.location.protocol+"//"+window.location.host+"/"+window.location.pathname.split("/")[1];
	            	// 查看原文controller
	            	path = path+"/findBrowseText?tableId="+tableId+"&DAH="+DAH+"&userId="+userId+"&id="+id+"&FIRSTMOUDLEID="+FIRST_MODULE_ID+"&MOUDLEID="+MODULE_ID;
	            	//window.open(encodeURI(encodeURI(path)),"原文");//正常浏览原文弹出xml
	            	// 查看原文
	             	window.oldOnError = window.onerror;
	             	var command = "ArchivesViewer://"+path+" "+window.location.protocol+"//"+window.location.host+"/"+window.location.pathname.split("/")[1]+"/";
	             	window.open(window.location.protocol+"//"+window.location.host+"/"+window.location.pathname.split("/")[1]+"/html/yw.html?command="+command);
	            }
	        },
	        error: function (result, status) {
                $box.promptBox("系统异常，请联系管理员！");
	        }
	    });

}

/**
 * @author WeiSibin
 * @createTime 2017-8-4
 * @param seletcId 页面需要半段的id
 * @return boolean 是全选返回true  不是 返回false
 */
function isMultipleSelectAll(seletcId) {
	var selectDataLength = $('#' + seletcId).multipleSelect('getSelects').length;
	var allDataLength = $('#' + seletcId)[0].length;
	return selectDataLength == allDataLength ? true : false;
}

/**
 * 
 * @discribe 动态设置bootstrapTable 某一行单元格的样式
 * @author wc
 * @date 创建时间：2017年8月22日 下午1:35:04
 * @params 
 * @return
 */
function changeTableSelectedItemColor(tableId,uniqueid,styleObj){
	if(!tableId){
		//console.log("tableId 不能为空");
		return ;
	}
	if(uniqueid!=0&&!uniqueid){
		//console.log("uniqueid 不能为空");
		return ;
	}
	if(uniqueid!=0&&!styleObj==null&&styleObj==undefined){
		//console.log("styleObj 不能为空");
		return ;
	}
	$("#"+tableId+" tbody tr[data-uniqueid = "+uniqueid+"] td").css(styleObj);
}
/**
 * 
 * @discribe 页面刷新后改变被浏览过原文的项被标识
 * @author wc
 * @date 创建时间：2017年8月22日 下午3:06:15
 * @params tableId 表格的id 属性, styleObj 表格中某一行的单元格的样式对象{"background": "blue"},selectedArchives被选中的档案的id记录 格式为{"id值","id"},tableData 表格数据
 * @return
 */
function changeViewedItemColor(tableId,styleObj,selectedArchives,tableData){
	if(tableData&&tableData.length>0){
		$.each(tableData,function(index,item){
			for(var key in selectedArchives){
				if(item.id==key){
					changeTableSelectedItemColor(tableId,key,styleObj);
				}
			}
		})

	}
}


/**
 * 
 * @discribe 改变检索词的颜色
 * @author wc
 * @date create time:2017年8月25日 上午11:28:59
 * @params 
 * @return
 */
function changeFontColor(value,row,index){
	//return value;
	return 	value.replace(KEYWORD,function(str){
		//console.log(str);
		return "<span style='color:red'>"+str+"</span>";
	});
	
}
/**
 * 
 * @discribe 为某一行档案为涉密的添加颜色
 * @author wc
 * @date create time:2017年9月12日 上午11:36:04
 * @params 
 * @return
 */
function changeRowFontColor(value,row,index){
	if(row.isSecret){
		return "<span style='color:red'>"+value+"</span>";
	}
	return value;
}
/**
 * 页面跳转
 * @returns {String}
 */
function pageRedirect(message){
	  if(message.Mstate){
      	if(message.Mstate=="pageRedirect"){
      		//跳转到登录页面
      		var url1 = window.location.href;
      		var url2 = url1.substring(0,url1.indexOf("?"));
      		var url3 = url2.substring((url2.indexOf("ASS/html/")+9),url2.length);
      		var url = "";
      		if(url3.length >0){
      			var arr = url3.split("/");
      			for (var int = 0; int < arr.length; int++) {
      				url += "../";
      			}
      			url += "login.html";
      		}else{
      			url = "../../../../login.html";
      		}
      		alert("登录超时即将跳转到登录页面！！！");
      		parent.location.href=url;	
      	}
      }
}
/**
 * 时间戳转换为想要的时间格式
 * @param fmt
 * @returns
 */
Date.prototype.format = function(fmt) { 
    var o = { 
       "M+" : this.getMonth()+1,                 //月份 
       "d+" : this.getDate(),                    //日 
       "h+" : this.getHours(),                   //小时 
       "m+" : this.getMinutes(),                 //分 
       "s+" : this.getSeconds(),                 //秒 
       "q+" : Math.floor((this.getMonth()+3)/3), //季度 
       "S"  : this.getMilliseconds()             //毫秒 
   }; 
   if(/(y+)/.test(fmt)) {
           fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
   }
    for(var k in o) {
       if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
   return fmt; 
}
/**
 * 返回设置信息
 */
function getSettingInfo(tableName,field){
	var message={};
	$.ajax({
		url : "/fas/GetSettingInfo",
		dataType : "json",
		async:false,
		type : "post",
		data : {tableName:tableName,field:field},
		success : function(msg) {
			var data=eval(msg);
			message.systemName=data.systemName;
			message.batchNum=data.batchNum;
			message.returnURL=data.serverIp;
			message.ftp=data.ftpInfo;
		},
		error : function(result, status) {
			$box.promptBox("系统异常，请联系管理员！");
		}
	});
	return message;
}
/**
 * 根据上传类型/文件夹 查看资料图片
 * @param uploadType
 * @param folderName
 */
function showIDPicture(uploadType,folderName){
	var url = "../html/com-html/showIDPicture.html";
	var tabId = "zltp";
	var name = "资料图片";
	var param =JSON.stringify({"tabId":tabId,"uploadType":uploadType,"folderName":folderName});
	
	pageAddNewTab(tabId, name, url,param) 
}
//var time1 = new Date(data.auditTime).format("yyyy-MM-dd hh:mm:ss");

/**************************************时间格式化处理************************************/
function dateFtt(fmt,date)   
{ //author: meizz   
  var o = {   
    "M+" : date.getMonth()+1,                 //月份   
    "d+" : date.getDate(),                    //日   
    "h+" : date.getHours(),                   //小时   
    "m+" : date.getMinutes(),                 //分   
    "s+" : date.getSeconds(),                 //秒   
    "q+" : Math.floor((date.getMonth()+3)/3), //季度   
    "S"  : date.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
} 
/**
 * 转换时间戳
 * @param timestamp
 * @returns {String}
 */
function timecheck(timestamp) {
	var term=Number(timestamp);
    var date = new Date(term);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    //return Y+M+D+h+m+s;
    return Y+M+D;
}
/**
 * 登录过期，跳转登录页面
 */
function checksessoin() {
	$.ajax({
		url : "/sjcq/user/loginSession",
		dataType : "json",
		async : false,
		data : {},
		type : "post",
		success : function(data) {
			if(!data.resultStatus){
				$box.promptBox(data.resultInfo);
				$('#myModal').on('hidden.bs.modal', function () {
					parent.window.location.href = "/manage/html/login.html";
			    });
	    	}
		},
		error : function() {
		}
	});
}