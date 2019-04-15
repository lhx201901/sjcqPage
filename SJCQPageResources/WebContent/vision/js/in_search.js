/**
 * 公用 方法
 * 图片 图集 详情,列表
 * 
 */
var timer=null;
var in_search = {
    init:function(){

    },
    /**
     * 搜索图片 图集
     * @param page 页数
     * @param size 条数
     * @param field 排序字段
     * @param order 排序方式
     * @param jsonstring 检索方式 //var jsonstring = {table:"d_photo_pic",term:abc@#@def(多个检索词以@#@隔开),
     *                             "type_one":"第三个数据开始数据表字段。。可多个"} 
     *                              参数 table 传图片表 为查询图片，传图集查询图集
     * @param callback 回调函数
     */
    search:function(page,size,field,order,jsonstring,callback){
        var param = {pageIndex:page,pageSize:size,orderField:field,orderType:order,searchWord:jsonstring};
        $.ajax({
            url:"/sjcq/retriebe/basicSolrSearch",    // 请求的url地址
            type:"post",   // 请求方式
            dataType:"json",   // 返回格式为json
            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
            data:param,    // 参数值     
            success:function(data){
               //console.log(data);
               callback(data);
            },
            error:function(){
                layer.alert('加载数据失败！');
            }
        });
    },
    searchAll:function(page,size,field,order,jsonstring,callback){
        var param = {pageIndex:page,pageSize:size,orderField:field,orderType:order,searchWord:jsonstring};
        $.ajax({
            url:"/sjcq/retriebe/allSolrSearch",    // 请求的url地址
            type:"post",   // 请求方式
            dataType:"json",   // 返回格式为json
            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
            data:param,    // 参数值     
            success:function(data){
               //console.log(data);
               callback(data);
            },
            error:function(){
                layer.alert('加载数据失败！');
            }
        });
    },
    editSelectedSearch:function(page,size,uuid,callback){
        var param = {pageIndex:page,pageSize:size,sortUUid:uuid};
        $.ajax({
            url:"/sjcq/manage/editSelectedPicInfo/getPicPageInfoBySortUuid",    // 请求的url地址
            type:"post",   // 请求方式
            dataType:"json",   // 返回格式为json
            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
            data:param,    // 参数值     
            success:function(data){
               callback(data);
            },
            error:function(){
                layer.alert('加载数据失败！');
            }
        });
    
    },
    broadCastPicSearch:function(page,size,uuid,callback){
        var param = {pageIndex:page,pageSize:size,broadcastXh:uuid,isShelves:1};
        $.ajax({
            url:"/sjcq/broadcastPicInfo/findPicPage",    // 请求的url地址
            type:"post",   // 请求方式
            dataType:"json",   // 返回格式为json
            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
            data:param,    // 参数值     
            success:function(data){
               callback(data);
            },
            error:function(){
                layer.alert('加载数据失败！');
            }
        });
    
    },
    /**
     * 获取二级目录
     * @param typeOne 一级目录
     * @param state 1:获取图片 2:获取图集
     * @param callback 回调函数
     */
    catalog:function(typeOne,state,callback){
        if(state==1){
            $.ajax({
               // url:"/sjcq/photoPic/aggSecondDir",    // 请求的url地址   
                url:"/sjcq/manage/picSort/aggSecondDir",    // 请求的url地址   
                type:"post",   // 请求方式
                dataType:"json",   // 返回格式为json
                async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
                data:{typeOne:typeOne},    // 参数值     
                success:function(data){
                   //console.log(data);
                   callback(data);
                },
                error:function(){
                    layer.msg('加载目录失败！');
                }
            });
        }else{
            $.ajax({
               // url:"/sjcq/photoTj/aggSecondDir",    // 请求的url地址
            	 url:"/sjcq/manage/picSort/aggSecondDir",    // 请求的url地址   
            	type:"post",   // 请求方式
                dataType:"json",   // 返回格式为json
                async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
                data:{typeOne:typeOne},    // 参数值     
                success:function(data){
                   //console.log(data);
                   callback(data);
                },
                error:function(){
                    layer.msg('加载目录失败！');
                }
            });
        }
    },
    /**
     * 编辑精选获取二级目录
     * @param typeOne 一级目录
     * @param state 1:获取图片 2:获取图集
     * @param callback 回调函数
     */
    catalogForEditSelected:function(callback){
        $.ajax({
        	 url:"/sjcq/manage/editSelectedSort/getAll",    // 请求的url地址   
        	type:"post",   // 请求方式
            dataType:"json",   // 返回格式为json
            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
            data:{},    // 参数值     
            success:function(data){
               callback(data);
            },
            error:function(){
                layer.msg('加载目录失败！');
            }
        });
    
    },
    /**
     * 跳转到图片详情页
     * @param uuid 图片uuid
     */
    imgJump:function(uuid){
        window.location.href="photoDetail.html?img="+uuid;
    },
    
    //单击
    clickOne:function(path){
    	clearTimeout(timer);
    	timer = setTimeout(function () { //在单击事件中添加一个setTimeout()函数，设置单击事件触发的时间间隔
    		if(path!=undefined && path!=null){		
    			AlertBox.picAlert('<img  src="' + index_nav.PICURI + "/"+path + '" style="height:100%;width:123%;">',
    			"图片显示");
    		}
    	}, 400);
    },
    /**
     * 跳转到图集详情页
     * @param uuid 图片uuid
     */
    imgJumpTj:function(uuid){
        window.location.href="photoDetail.html?img="+uuid+"&tj=sjcq";
    },
    /**
     * 通过 uuid 查看 图片 详情
     * 附带摄影师 部分信息
     * @param picXh 图片uuid
     * @param callback 回调函数
     */
    imgDetail:function(picXh,callback){
        $.ajax({
            url:"/sjcq/photoPic/findByPicXh",    // 请求的url地址
            type:"post",   // 请求方式
            dataType:"json",   // 返回格式为json
            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
            data:{picXh:picXh},    // 参数值     
            success:function(data){
               //console.log(data);
               callback(data);
            },
            error:function(){
                layer.msg('加载数据失败！');
            }
        });
    },
    /**
     * 通过 uuid 查看 图集 详情
     * @param picXh 图集uuid
     * @param callback 回调函数
     */
    tjDetail:function(tjXh,callback){
        $.ajax({
            url:"/sjcq/photoTj/findByTjXh",    // 请求的url地址
            type:"post",   // 请求方式
            dataType:"json",   // 返回格式为json
            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
            data:{tjXh:tjXh},    // 参数值     
            success:function(data){
               //console.log(data);
               callback(data);
            },
            error:function(){
                layer.msg('加载数据失败！');
            }
        });
    },
    loadFirstLevelPicSort:function(){
        $.ajax({
            url:"/sjcq/manage/picSort/findBySortPxh",    // 请求的url地址
            type:"post",   // 请求方式
            dataType:"json",   // 返回格式为json
            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
            data:{sortPxh:"0"} ,    // 参数值     state 0:密码登录 1:验证码登录
            success:function(data){
            	$(".sel_cls>ul li").remove();
            	$(".sel_cls>ul").append('<li><a href="javascript:void(0)">全部图片</a></li>');
            	for(var i=0;i< data.length;i++){
        			//options=options+'<option value="'+data[i].sortXh+'">'+data[i].sortName+'</option>'
            		$(".sel_cls>ul").append('<li><a href="javascript:void(0)">'+data[i].sortName+'</a></li>');
        		}
            	return data;
            },
            error:function(){
                layer.alert('查询加载失败！');
            }
        });
	
    }
    ,
    picSortLoad:function(sortpxh){
        $.ajax({
            url:"/sjcq/manage/picSort/findBySortPxh",    // 请求的url地址
            type:"post",   // 请求方式
            dataType:"json",   // 返回格式为json
            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
            data:{sortPxh:sortpxh} ,    // 参数值     state 0:密码登录 1:验证码登录
            success:function(data){
            	return data;
            },
            error:function(){
                layer.alert('查询加载失败！');
            }
        });
	}
}
 