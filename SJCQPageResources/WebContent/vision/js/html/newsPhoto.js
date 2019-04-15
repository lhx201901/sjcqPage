//图片列表展示
var picX=285.00;//在1920下图片的宽
var picY=256.00;//在1920下图片的高
var picTotle=18;//总共显示多少个
var picNum=6;//一行展示多少个
/**
 * 新闻图片
 */
var newsPhoto = {
    init:function(){
        newsPhoto.newsImg();//加载 新闻图片模块
        newsPhoto.editSearchImg();//编辑精选 加载
        $('#inp_search').keydown(function(e){
    		if(e.keyCode==13){
    			index_nav.search();
    		}
    	});
    },
    
    /**
     * 编辑精选
     */
    editSearchImg:function(){
        $.ajax({
            url:"/sjcq/manage/editSelectedPicInfo/getPicPageInfo",    // 请求的url地址
            type:"post",   // 请求方式
            dataType:"json",   // 返回格式为json
            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
            data:{pageIndex:1,pageSize:picTotle},    // 参数值     broType 轮播类型
            success:function(data){
                console.log(data);
                var str = "";
                $(data.rows).each(function(i,row){
                	str += '<li onclick="in_search.imgJump(\'' + row.pic_xh + '\')">';
                    str += '<div class="img_info">';
                    str += '<a href="javascript:void(0)">';
                    str += '<p class="img">'
                    +'<img src="'+index_nav.PICURI+row.pic_lylys+'" onload="this.clientHeight> this.clientWidth ? this.style.height = \'100%\' : this.style.width = \'100%\'"></p>';
                    str += '</a>';
                    str += '</div>';
                    str += '<div class="atr_info">';
                    str += '<a href="javascript:void(0)">';
                    str += '<div class="atime">'+getUtil.getTimetrans(row.pic_scsj)+'</div>';
                    str += '<div class="sesum" style="float:right;"><i class="ico ico21 mr5"></i>'+getUtil.nullR(row.look_number)+'</div>';
                    if(getUtil.nullR(row.pic_mc).length > 40){
                    	 str += '<div class="atit">'+row.pic_mc.substring(0,43)+'……</div>';
                    }else{
                    	 str += '<div class="atit">'+getUtil.nullR(row.pic_mc)+'</div>';
                    }
                    str += '</a>';
                    str += '</div>';
                    str += '</li>';
                });
                $("#pic_jx").html(str);
            },
            error:function(){
                layer.alert('查询加载失败！');
            }
        });


    },
    /**
     * 新闻图片模块加载图片
     */
    newsImg:function(){
        //获取二级目录方法  in_search.js
        in_search.catalog("新闻图片",1,function(data){
            var html = "";
            var type_two = "";//二级目录
            $(data).each(function(i,row){
                if(i==0){ 
                    html = html + '<a href="javascript:void(0)" class="cur" '
                                + 'onclick="newsPhoto.searchImg(\'d_photo_tj\',\'\',\'新闻图片\',\''+row.type_two+'\',this)" >'+row.type_two+'</a>';
                    type_two = row.type_two;
                }else{
                    html = html + '<a href="javascript:void(0)" '
                                + 'onclick="newsPhoto.searchImg(\'d_photo_tj\',\'\',\'新闻图片\',\''+row.type_two+'\',this)" >'+row.type_two+'</a>';
                }
            })
            $("#img_sel_tab").html(html);
            newsPhoto.searchImg("d_photo_tj","","新闻图片",type_two);
        });
    },
    /**
     * 加载图片列表
     * @param table 表名
     * @param inp_search 全文检索字段
     * @param sel_cls 一级目录
     * @param type_two 二级目录
     * @param _this 标签
     */
    searchImg:function(table,inp_search,sel_cls,type_two,_this){
        if(_this!=null){
            $("#pic_list").html("");//清空数据
            $(_this).siblings().each(function(){//取消其他选中
                $(this).attr("class","");
            });
            $(_this).attr("class","cur");//选中当前类
        }
        var jsonstring = JSON.stringify({table:table,term:inp_search,"type_one":sel_cls,"type_two":type_two});
        in_search.search(1,picTotle,"id","desc",jsonstring,function(data){
            var str = "";
            $(data.rows).each(function(i,row){
//            	str += '<li onclick="in_search.imgJump(\'' + row.pic_xh + '\')">';
//                str += '<div class="img_info">';
//                str += '<a href="javascript:void(0)">';
//                str += '<p class="img">'
//                +'<img src="'+index_nav.PICURI+row.pic_lylys+'" onload="this.clientHeight> this.clientWidth ? this.style.height = \'100%\' : this.style.width = \'100%\'"></p>';
//                str += '</a>';
//                str += '</div>';
//                str += '<div class="atr_info">';
//                str += '<a href="javascript:void(0)">';
//                str += '<div class="atime">'+getUtil.getTimetrans(row.pic_scsj)+'</div>';
//                str += '<div class="sesum"><i class="ico ico21 mr5"></i>'+getUtil.nullR(row.look_number)+'</div>';
//                if(getUtil.nullR(row.pic_mc).length > 40){
//                	 str += '<div class="atit">'+row.pic_mc.substring(0,43)+'……</div>';
//                }else{
//                	 str += '<div class="atit">'+getUtil.nullR(row.pic_mc)+'</div>';
//                }
//                str += '</a>';
//                str += '</div>';
//                str += '</li>';
            	
            	str += '<li onclick="in_search.imgJumpTj(\'' + row.tj_xh + '\')">';
                str += '<div class="img_info">';
                str += '<a href="javascript:void(0)">';
                str += '<p class="img">'
                +'<img src="'+index_nav.PICURI+row.tj_fmlj+'" onload="this.clientHeight> this.clientWidth ? this.style.height = \'100%\' : this.style.width = \'100%\'"></p>';
                str += '</a>';
                str += '</div>';
                str += '<div class="atr_info">';
                str += '<a href="javascript:void(0)">';
                str += '<div class="atime">'+getUtil.getTimetrans(row.tj_scsj)+'</div>';
                str += '<div class="sesum">&nbsp;&nbsp;|&nbsp;&nbsp;共'+getUtil.nullR(row.tj_sl)+'张</div>';
                if(getUtil.nullR(row.tj_remark).length > 40){
                	 str += '<div class="atit">'+row.tj_remark.substring(0,43)+'……</div>';
                }else{
                	 str += '<div class="atit">'+getUtil.nullR(row.tj_remark)+'</div>';
                }
                str += '</a>';
                str += '</div>';
                str += '</li>';
            })
            $("#pic_list").html(str);
        });
    }
}
 