/**
 * 图片列表
 */
var atlasList = {
    // --下拉加载
    page:10,//页数 
    listPage:0,//加载 一次列表增加一页
    searchALL:"",//全文搜索字段
    typeOne:"",//一级目录
    typeTwo:"",//二级目录
    // --下拉加载
    /**
     * 初始化
     */
    init:function(){
        atlasList.search(0);//默认获取 url上的
        atlasList.scroll();
        $('#inp_search').keydown(function(e){
    		if(e.keyCode==13){
    			atlasList.search(1);
    		}
    	})
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
                //加载图集
                atlasList.searchImg("d_photo_tj",atlasList.searchALL,atlasList.typeOne,atlasList.typeTwo);
            });
        })
    },
    /**
     * 搜索图集
     * @param state 0:获取url上的数据 1:获取该页面的数据查询 
     * @param type_two 二级目录，查询图片是传入的值
     */
    search:function(state,type_two){
        //重新加载 下拉加载数据初始化
        atlasList.searchALL= "";//全文搜索字段
        atlasList.typeOne = "";//一级目录
        atlasList.typeTwo = "";//二级目录
        atlasList.page = 10;
        atlasList.listPage = 0;
        //重新加载 下拉加载数据初始化

        $(".img_sel_tab").html("");//加载二级目录 前清空二级目录
        $("#tj_list").html("");//加载二级目录 清空图片
        var inp_search = $("#inp_search").val();// 全文搜索字段
        var sel_cls = $('.sel_cls>span').text();//一级目录
        if(state==0){//获取url上的数据
            inp_search = getUtil.getUrlParam("inp_search");//获取url上的参数  全文搜索字段
            sel_cls = getUtil.getUrlParam("sel_cls");//获取url上的参数 一级目录
        }
        //全文搜索数据 判断是否有值 
        if(inp_search==null||inp_search==""||inp_search==undefined||inp_search=="undefined"){
            inp_search = "";
        }
        if(sel_cls!=null&&sel_cls!=""&&sel_cls!="全部图片"){//判断是否展示 二级目录
            in_search.catalog(sel_cls,2,function(data){
                var html = "";
                $(data).each(function(i,row){
                    if(row.type_two!=null&&row.type_two!=""){
                        if(type_two==row.type_two){//判断 是否有二级目录 有就改变样式
                            html = html + '<a href="javascript:void(0)" class="cur"'
                                            + 'onclick="atlasList.search('+state+',\''+row.type_two+'\')" >'+row.type_two+'</a>';
                        }else{
                            if(i==0){//判断 是否已有二级目录 没有就默认第一个改变样式
                                if(type_two==null||type_two==""){
                                    type_two = row.type_two;//获取 第一个二级目录
                                    html = html + '<a href="javascript:void(0)" class="cur"'
                                            + 'onclick="atlasList.search('+state+',\''+row.type_two+'\')" >'+row.type_two+'</a>';
                                }else{
                                    html = html + '<a href="javascript:void(0)"'
                                            + 'onclick="atlasList.search('+state+',\''+row.type_two+'\')" >'+row.type_two+'</a>';
                                }
                            }else{
                                html = html + '<a href="javascript:void(0)"'
                                            + 'onclick="atlasList.search('+state+',\''+row.type_two+'\')" >'+row.type_two+'</a>';
                            }
                        }
                    }
                })
                $(".img_sel_tab").html(html);
                atlasList.searchImg("d_photo_tj",inp_search,sel_cls,type_two);//加载图集
                //console.log(data);
            });
        }else{
            atlasList.searchImg("d_photo_tj",inp_search,"","");//加载图集
        }
        

    },
    /**
     * 列表中展示图集
     * @param table 表名
     * @param inp_search 全文检索字段
     * @param sel_cls 一级目录
     * @param type_two 二级目录
     */
    searchImg:function(table,inp_search,sel_cls,type_two){
        //默认下拉记载 数据
        atlasList.searchALL= inp_search;//全文搜索字段
        atlasList.typeOne = sel_cls;//一级目录
        atlasList.typeTwo = type_two;//二级目录
        //console.log( pictureList.page,"==========", pictureList.listPage);
        if( atlasList.page == atlasList.listPage){
            return false;//页数相同停止加载
        }
        atlasList.listPage = atlasList.listPage + 1;//加载的页数

        var jsonstring = JSON.stringify({table:table,term:inp_search,"type_one":sel_cls,"type_two":type_two});
        //console.log(jsonstring)
        in_search.search(atlasList.listPage,12,"id","desc",jsonstring,function(data){
            atlasList.page = Math.ceil(data.total/12);//获取 页数 下拉加载时使用

            var html = "";//添加字段
            if(data!=null&&data!=""){
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
            }
            $("#tj_list").append(html);
            //console.log(data)
        });
    }
    
}
