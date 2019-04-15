/**
 * 摄影师，设计师 详情页面
 */
var photoGBasics = {
    page:1,//页数 
    listPage:0,//加载列表 一次列表增加一页
    page_tj:1,//页数 
    listPage_tj:0,//加载列表 一次列表增加一页
    init:function(){
        photoGBasics.basics();
        photoGBasics.search();//代表作品
        photoGBasics.searchTj();//图集
        photoGBasics.scroll();//监听滚动条事件
    },
    /**
     * 转换子 div
     * state 0:代表作品 1：图集
     */
    page_div:function(state,_this){
        $("#opus_list_tj").html("");
        $("#opus_list").html("");
        $(_this).siblings().each(function(){//取消其他选中
            $(this).attr("class","");
        });
        $(_this).attr("class","cur");//选中当前类
        if(1==state){
            $("#tj_opus").show();
            $("#pic_opus").hide();
        }else{
            $("#tj_opus").hide();
            $("#pic_opus").show();
        }
    },
    /**
     * 监听滚动条事件
     * 加载添加图片列表
     */
    scroll:function(){
        var r_footHei = $(".faut").innerHeight() + $(".footer").innerHeight();//底部的高度
        //对元素滚动的次数进行计数
        $(window).scroll(function(){
            waterPall.setWaterPall(r_footHei,function(){
                photoGBasics.search();//列表
                photoGBasics.searchTj();//列表
            });
        })
    },
    /**
     * 摄影师 设计师 详情
     */
    basics:function(){
        var uuid = getUtil.getUrlParam("basics");//获取url上的参数 一级目录
        if(uuid!=null&&uuid!=""&&uuid!=undefined){
            $.ajax({
                url:"/sjcq/pAndD/basics",    // 请求的url地址
                type:"post",   // 请求方式
                dataType:"json",   // 返回格式为json
                async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
                data:{uuid:uuid},    // 参数值     
                success:function(data){
                    //console.log(data)
                    $("#user_cover").attr("src",index_nav.PICURI+data.cover);
                    $("#user_actor").attr("src",index_nav.PICURI+data.actor);
                    $(".user_info_msg>.w_auto>.user_name").html(data.realName);
                    $(".user_info_msg>.w_auto>.user_con").html(data.remark);
                    $("#user_address").html(getUtil.null_W(data.address));
                    $("#user_nOfWorks").html("作品 "+getUtil.number(data.numberOfWorks));
                    $("#user_focus").html("关注量 "+getUtil.number(data.focusOnNum));
                    $("#user_viewed").html("被浏览数 "+getUtil.number(data.viewed));

                },
                error:function(){
                    layer.msg('加载数据失败！');
                }
            });
        }
    },
    /**
     * 加载代表作品
     */
    search:function(){
        //console.log(photoGBasics.page,photoGBasics.listPage)
        if( photoGBasics.page == photoGBasics.listPage){
            return false;//页数相同停止加载
        }
        var uuid = getUtil.getUrlParam("basics");//获取url上的参数 一级目录
        if(uuid!=null&&uuid!=""&&uuid!=undefined){
            $.ajax({
                url:"/sjcq/pAndD/opus",    // 请求的url地址
                type:"post",   // 请求方式
                dataType:"json",   // 返回格式为json
                async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
                data:{index:photoGBasics.listPage,size:12,uuid:uuid},    // 参数值     
                success:function(data){
                    console.log(data)
                    if( photoGBasics.page == photoGBasics.listPage){
                        return false;//页数相同停止加载
                    }
                    photoGBasics.listPage = photoGBasics.listPage + 1;
                    photoGBasics.page = Math.ceil(data.total/12);//获取 页数 下拉加载图片时使用
                    var str = "";
                    $(data.rows).each(function(i,row){
                        str = str + '<li >';
                        str = str + '<div class="img_info">';
                        str = str + '<a href="javascript:void(0)" onclick="in_search.imgJump(\''+row.pic_xh+'\')">';
                        str = str + '<p class="img"><img src="'+index_nav.PICURI+row.pic_lylys+'"></p>';
                        str = str + '</a>';
                        str = str + '<div class="atr_info">';
                        str = str + '<div class="atit">'+getUtil.nullR(row.pic_mc)+'</div>';
                        str = str + '<div class="atime">'+getUtil.getTimetrans(row.pic_scsj)+'</div>';
                        if(row.collect){
                            str = str + '<div class="sesum" ><i class="ico ico24f " onclick="in_browse.delCollect(\''+row.pic_xh+'\',\'\',0,this)"></i></div>';
                        }else{
                            str = str + '<div class="sesum" ><i class="ico ico18 " onclick="in_browse.addCollect(\''+row.pic_xh+'\',\'\',0,this)"></i></div>';
                        }
                        // str = str + '<div class="sesum"><i class="ico ico18"></i></div>';
                        str = str + '</div>';
                        str = str + '</div>';
                        str = str + '</li>';
                    });
                    $("#opus_list").append(str);

                },
                error:function(){
                    layer.msg('加载数据失败！');
                }
            });
        }
    },
    /**
     * 加载图集
     */
    searchTj:function(){
        //console.log(photoGBasics.page_tj,photoGBasics.listPage_tj)
        if( photoGBasics.page_tj == photoGBasics.listPage_tj){
            return false;//页数相同停止加载
        }
        var uuid = getUtil.getUrlParam("basics");//获取url上的参数 一级目录
        if(uuid!=null&&uuid!=""&&uuid!=undefined){
            var jsonstring = JSON.stringify({table:"d_photo_tj",term:"","tj_sczxh":uuid});
            //console.log(jsonstring)
            in_search.search(photoGBasics.listPage_tj,12,"id","desc",jsonstring,function(data){
                if( photoGBasics.page_tj == photoGBasics.listPage_tj){
                    return false;//页数相同停止加载
                }
                photoGBasics.listPage_tj = photoGBasics.listPage_tj + 1;
                photoGBasics.page_tj = Math.ceil(data.total/12);//获取 页数 下拉加载图片时使用
                var html = "";
                $(data.rows).each(function(i,row){
                    html = html + '<li onclick="in_search.imgJumpTj(\''+row.tj_xh+'\')">';
                    html = html + '<div class="img_info">';
                    html = html + '<a href="javascript:void(0)">';
                    html = html + '<p class="img"><img src="'+index_nav.PICURI+row.tj_fmlj+'"></p>';
                    html = html + '</a>';
                    html = html + '<div class="atr_info">';
                    html = html + '<div class="atit"></div>';
                    html = html + '<div class="atime">'+row.tj_mc+'</div>';
                    html = html + '<div class="sesum"><i class=\"ico ico40\"></i></div>';
                    html = html + '</div>';
                    html = html + '</div>';
                    html = html + '</li>';
                });
                $("#opus_list_tj").html(html);
                console.log(data);
            });
        }
    }
}