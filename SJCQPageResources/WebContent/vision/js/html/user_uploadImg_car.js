/**
 * 我的购买
 */
var buy={
    sureFilter_type:true,
    init:function(){
        laydate.render({
              elem: '#startTime' //开始日期
            });
        laydate.render({
              elem: '#endTime' //开始日期
            });
    },
    /**
     * 分页
     * @param {*} pageCount  页数
     */
    initPages:function(pageCount){
        $("#userpay_pages").createPage({
            pageCount:pageCount,
            current:1,
            backFn:function(result){
                buy.sureFilter(result,false);
            }
        })
    },
    //确定顾虑
    sureFilter:function(pageCount,type){
        //$(".userpay .gwc_dt").remove();
        var buysxsj=$("#buysxsj").val();
        var buykeyword=$("#buykeyword").val();
        var startTime=$("#startTime").val();
        var endTime=$("#endTime").val();

        $.ajax({
            url:"/sjcq/photoPay/getPayPageInfo",    // 请求的url地址
            type:"post",   // 请求方式
            dataType:"json",   // 返回格式为json
            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
            data:{pageIndex:pageCount,pageSize:10,term:buykeyword,timeStart:startTime,timeEnd:endTime,buysxsj:buysxsj},    // 参数值     state 0:密码登录 1:验证码登录
            success:function(data){
                var html = "";
                var temNum = [];//订单号
                pageCount = Math.ceil(data.total/10);//获取 页数 
                $(data.rows).each(function(i,row){//获取所有订单
                    var x = 0;
                    for(var s=0;s<temNum.length;s++){
                        var tem_str = temNum[s].split("@");
                        if(tem_str[0]==row.order_number){
                            x = 1; break;
                        }
                    }
                    if(x==0){temNum.push(row.order_number+"@"+row.pay_date); }
                });
                var tem = "";
                
                $(temNum).each(function(ss,str){
                    var tem_str = str.split("@")
                    tem= tem + '<div class="gwc_dt">';
                    tem= tem + '<div class="gwc_info clearfix">';
                    tem= tem + '<span class="fl">订单号：'+tem_str[0]+'</span>';
                    tem= tem + '<span class="fr">'+tem_str[1]+'</span>';
                    tem= tem + '</div>';
                    tem= tem + '<ul>';
                    var num_pic = 0;
                    var price = 0;
                    $(data.rows).each(function(j,jow){
                        if(tem_str[0]==jow.order_number){
                            num_pic++;
                            //price =jow.pay_total_amount;
                            //测试时修改为 减少价格     price=parseInt(jow.photo_price)
                            if(jow.photo_price==undefined || jow.photo_price ==null || jow.photo_price=='null' || jow.photo_price.length==0){
                            	price = price;
                            }else{                            	
                            	price = price + parseInt(jow.photo_price);
                            }
                            tem = tem + '<li>';
                            tem = tem + '<a href="photoDetail.html?img='+jow.pic_xh+'" target="_blank" style="cursor:pointer;color:#999;"><p class="img"><img src="'+index_nav.PICURI+jow.pic_path+'""></p>';
                            tem = tem + '<p class="title">'+jow.pic_mc+'</p></a>';
                            tem = tem + '<p class="imd">ID:'+jow.pic_xh+'</p>';
                            tem = tem + '<p class="gs">JPG  '+jow.pic_fbl+'</p>';
                            if(jow.photo_price==undefined || jow.photo_price ==null || jow.photo_price=='null' || jow.photo_price.length==0){
                            	tem = tem + '<p class="jg">¥0</p>';
                            }else{
                            	tem = tem + '<p class="jg">¥'+jow.photo_price+'</p>';
                            }
                            if(jow.photo_price!=undefined && jow.photo_price !=null && jow.photo_price!='null' && jow.down_number>0){                            	
                            	tem = tem + '<p class="del">可下载次数:'+jow.down_number+'<a href="javascript:void(0)" onclick="index_nav.dowPic(\''+jow.pic_xh+'\')" class="ml10">下载</a></p>';
                            }else{
                            	tem = tem + '<p class="del">可下载次数:'+jow.down_number+'</p>';
                            }
                            tem = tem + '</li>';
                        }
                    });
                    tem= tem + '</ul>';
                    tem= tem + '<div class="gonji">';
                    tem= tem + '<span>共'+num_pic+'件商品</span>';
                    tem= tem + '<span class="ml20">总计：<u>¥'+price+'</u></span>';
                    tem= tem + '</div>';
                    tem= tem + '</div>';
                });
                $("#userpay").html(tem);

                if(type&&buy.sureFilter_type){
                    buy.sureFilter_type = false;
                    buy.initPages(pageCount)
                }
            },
            error:function(){
                layer.alert('加载订单数据失败！');
            }
        });
    }
    // downLoadThisImg:function(ID){
    //     if($("#imgForm").length > 0){
    //         $("#imgForm").remove();
    //     }
    //     var form = $("<form id='imgForm'>");   	
    //     $('body').append(form);         
    //     form.attr('style','display:none');          
    //     form.attr('target','/sjcq/account/downLoadImgById');        
    //     form.attr('method','post');       
    //     form.attr('action','');//下载文件的请求路径                        
    //     var input1 = $('<input>');         
    //     input1.attr('type','hidden');         
    //     input1.attr('name','ID');         
    //     input1.attr('value',ID);        
    //     form.append(input1);                     
    //     form.submit(); 
    // }
};