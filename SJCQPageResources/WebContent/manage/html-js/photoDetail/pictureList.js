/**
 * 图片列表
 */
var pictureList = {
    // --下拉加载图片
    page:10,//页数 
    listPage:0,//加载 一次列表增加一页
    searchALL:"",//全文搜索字段
    typeOne:"",//一级目录
    typeTwo:"",//二级目录
    nowPage:1,
    totalPage:0,
    pageSize:12,
    // --下拉加载图片
    /**
     * 初始化
     */
    init:function(){
        pictureList.search(1);//进入页面 加载 图片列表
        pictureList.scroll();//监听滚动条事件
        //Math.ceil(data.total/20);
    },
    
    search:function(pageIndex){
    	nowPage=pageIndex;
    	totalPage=10;
    	if(totalPage>6){
    		$("#pageDiv").html("");
    	}else{
    		
    	}
    },
    nextPage:function(){
    	pictureList.search(nowPage+1);
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
                pictureList.searchImg("d_photo_pic",pictureList.searchALL,pictureList.typeOne,pictureList.typeTwo);
            });
        })
    },
    /**
     * 列表中展示图片
     * @param table 表名
     * @param inp_search 全文检索字段
     * @param sel_cls 一级目录
     * @param type_two 二级目录
     * @param ssdw 区县
     */
    searchImg:function(table,inp_search,sel_cls,type_two,ssdw){
        pictureList.searchALL= inp_search;//全文搜索字段
        pictureList.typeOne = sel_cls;//一级目录
        pictureList.typeTwo = type_two;//二级目录
        //console.log( pictureList.page,"==========", pictureList.listPage);
        if( pictureList.page == pictureList.listPage){
            return false;//页数相同停止加载
        }
        var jsonstring = JSON.stringify({table:table,term:inp_search,"type_one":sel_cls,"type_two":type_two,"ssdw":ssdw});
        console.log(jsonstring)
        //查询 图片 in_search.js
        pictureList.listPage = pictureList.listPage + 1;//加载的页数
        in_search.search(pictureList.listPage,12,"id","desc",jsonstring,function(data){
            //console.log(data)
            pictureList.page = Math.ceil(data.total/12);//获取 页数 下拉加载图片时使用
            var str = "";//添加字段
            if(data!=null&&data!=""){
                $(data.rows).each(function(i,row){
                    str = str + '<li onclick="in_search.imgJump(\''+row.pic_xh+'\')">';
                    str = str + '<div class="img_info">';
                    str = str + '<a href="javascript:void(0)">';
                    str = str + '<p class="img"><img src="'+index_nav.PICURI+row.pic_lylys+'"></p>';
                    str = str + '</a>';
                    str = str + '<div class="atr_info">';
                    str = str + '<div class="atit">'+getUtil.nullR(row.pic_mc)+'</div>';
                    str = str + '<div class="atime">'+getUtil.getTimetrans(row.pic_scsj)+'</div>';
                    str = str + '<div class="sesum"><i class="ico ico20 mr5"></i>'+getUtil.nullR(row.look_number)+'</div>';
                    str = str + '</div>';
                    str = str + '</div>';
                    str = str + '</li>';
                });
            }
            $("#pic_list").append(str);
        })
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
}
