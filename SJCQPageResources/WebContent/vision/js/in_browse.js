/**
 * 公用方法
 * 添加图片浏览次数，关注，收藏，摄影师浏览次数
 */
var in_browse = {
    init:function(){

    },
    /**
     * 图片 浏览量+1
     */
    pic_browse:function(){
        var uuid = getUtil.getUrlParam("img");//获取url上的参数  
        if(uuid!=null&&uuid!=""){
            $.ajax({
                url:"/sjcq/photoPic/lookNumber",    // 请求的url地址
                type:"post",   // 请求方式
                dataType:"text",   // 返回格式为json
                async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
                data:{picXh:uuid},    // 参数值
                success:function(data){
                    console.log(data);
                    return data;
                },
                error:function(){
                    layer.msg('查询加载失败！');
                }
            });
        }
    },
    /**
     * 设计师或摄影师 浏览量+1
     */
    pAndD_browse:function(){
        var uuid = getUtil.getUrlParam("basics");//获取url上的参数  
        if(uuid!=null&&uuid!=""){
            $.ajax({
                url:"/sjcq/pAndD/viewed",    // 请求的url地址
                type:"post",   // 请求方式
                dataType:"text",   // 返回格式为json
                async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
                data:{uuid:uuid},    // 参数值
                success:function(data){
                    console.log(data);
                    return data;
                },
                error:function(){
                    layer.msg('查询加载失败！');
                }
            });
        }
    },
    /**
     * 用户关注摄影师
     * @param padUuidC 摄影师uuid
     * @param id 标签的id
     * @param state 返回类型
     * @param _this 
     */
    addConcern:function(padUuidC,id,state,_this){
        if(USRSESSION==null){
            layer.alert("请先登录！");
            return;
        }
        var acUuid = USRSESSION.uuid;//用户uuid
        if(acUuid!=null&&acUuid!=""&&padUuidC!=null&&padUuidC!=""){
            $.ajax({
                url:"/sjcq/account/addConcern",    // 请求的url地址
                type:"post",   // 请求方式
                dataType:"text",   // 返回格式为json
                async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
                data:{acUuid:acUuid,padUuidC:padUuidC},    // 参数值
                success:function(data){
                    layer.msg(data);
                    if(state==0){
                        $(_this).parent().html('<a href="javascript:void(0)" onclick="in_browse.delConcern(\''+padUuidC+'\',\'\',0,this)" class="cur"><i class="ico ico29"></i> 已关注</a>')//改为未关注状态
                    }else{
                        $("#"+id).attr("class","artion");
                        $("#"+id).html("<a href=\"javascript:void(0)\" onclick=\"in_browse.delConcern('"+padUuidC+"','"+id+"')\" class=\"cur\"><i class=\"ico ico29\"></i> 已关注</a>");
                    }
                    return false;//防止调用 其他事件
                },
                error:function(){
                    layer.msg('查询加载失败！');
                }
            });
        }else{
            layer.msg('关注失败！');
        }
    },
    /**
     * 用户取消关注摄影师
     * @param padUuidC 摄影师uuid
     * @param id 标签的id
     * @param state 返回类型
     * @param _this 
     */
    delConcern:function(padUuidC,id,state,_this){
        if(USRSESSION==null){
            layer.alert("请先登录！");
            return;
        }
        var acUuid = USRSESSION.uuid;//用户uuid
        if(acUuid!=null&&acUuid!=""&&padUuidC!=null&&padUuidC!=""){
            $.ajax({
                url:"/sjcq/account/delConcern",    // 请求的url地址
                type:"post",   // 请求方式
                dataType:"text",   // 返回格式为json
                async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
                data:{acUuid:acUuid,padUuidC:padUuidC},    // 参数值
                success:function(data){
                    layer.msg(data);
                    if(state==0){
                        //$(_this).parent().html('<a href="javascript:void(0)" onclick="in_browse.delConcern(\''+row.uuid+'\',\'\'0,this)" class="cur"><i class="ico ico29"></i> 已关注</a>')//改为未关注状态
                        $(_this).parent().html('<a href="javascript:void(0)" onclick="in_browse.addConcern(\''+padUuidC+'\',\'\',0,this)" ><i class="ico ico29"></i> 关注</a>')//改为关注状态
                    }else{
                        $("#"+id).attr("class","snb");
                        $("#"+id).html("<a href=\"javascript:void(0)\" onclick=\"in_browse.addConcern('"+padUuidC+"','"+id+"')\">+ 关注</a>");
                    }
                    
                    
                    return false;//防止调用 其他事件
                },
                error:function(){
                    layer.msg('查询加载失败！');
                }

            });
        }else{
            layer.msg('取消关注失败！');
        }
    },
    /**
	 * 用户收藏图片
	 * @param picXh 图片uuid
	 * @param id 标签的id
     * @param state 状态 0:使用 修改i标签 中的class
	 * @param _this 
	 */
    addCollect:function(picXh,id,state,_this){
        if(USRSESSION==null){
        	layer.msg("请先登录！");
            return;
        }
        var acUuid = USRSESSION.uuid;//用户uuid
        if(acUuid!=null&&acUuid!=""&&picXh!=null&&picXh!=""){
            $.ajax({
                url:"/sjcq/pic/addCollect",    // 请求的url地址
                type:"post",   // 请求方式
                dataType:"text",   // 返回格式为json
                async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
                data:{acUuid:acUuid,picXh:picXh},    // 参数值
                success:function(data){
                    layer.msg(data);
                    if(state==0){
                        $(_this).parent().html("<i class=\"ico ico24f \" onclick=\"in_browse.delCollect('"+picXh+"','',0,this)\"></i>")//改为收藏状态
                    }else{
                        $("#"+id).html('<a href="javascript:void(0)" class="btn btn_ok">'+
                                    '<i class="ico ico23 mr5"></i>加入购物车</a>'+
                                    '<a onclick=\"in_browse.delCollect(\''+picXh+'\',\''+id+'\')\"  href="javascript:void(0)" class="btn ml10">'+
                                    '<i class="ico ico24f mr5"></i>收藏</a>');
                    }
                    return false;//防止调用 其他事件
                },
                error:function(){
                    layer.msg('查询加载失败！');
                }
            });
        }else{
            layer.msg('收藏失败！');
        }
    },
    /**
	 * 用户取消收藏图片
	 * @param picXh 图片uuid
	 * @param id 标签的id
     * @param state 状态 0:使用 修改i标签 中的class
	 * @param _this 
	 * 
	 */
    delCollect:function(picXh,id,state,_this){
        if(USRSESSION==null){
            layer.alert("请先登录！");
            return;
        }
        var acUuid = USRSESSION.uuid;//用户uuid
        if(acUuid!=null&&acUuid!=""&&picXh!=null&&picXh!=""){
            $.ajax({
                url:"/sjcq/pic/delCollect",    // 请求的url地址
                type:"post",   // 请求方式
                dataType:"text",   // 返回格式为json
                async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
                data:{acUuid:acUuid,picXh:picXh},    // 参数值
                success:function(data){
                    layer.msg(data);
                    if(state==0){
                        $(_this).parent().html("<i class=\"ico ico18 \" onclick=\"in_browse.addCollect('"+picXh+"','',0,this)\"></i>")//改为未收藏状态
                    }else{
                        $("#pic_collect").html('<a href="javascript:void(0)" class="btn btn_ok">'+
                                           '<i class="ico ico23 mr5"></i>加入购物车</a>'+
                                           '<a onclick=\"in_browse.addCollect(\''+picXh+'\',\''+id+'\')\"  href="javascript:void(0)" class="btn ml10">'+
                                           '<i class="ico ico24 mr5"></i>收藏</a>');
                    }
                    return false;//防止调用 其他事件
                },
                error:function(){
                    layer.msg('查询加载失败！');
                }
            });
        }else{
            layer.msg('取消收藏失败！');
        }
    }
}