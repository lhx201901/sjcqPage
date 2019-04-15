/**
 * 购物车
 */
var shopping = function(){
    var ml_num = 0;//商品选中数
    var confirm_list = "";//确认订单列表
    var confirm_show = "";//确认订单 已选商品 列表
    var confirm_money = 0;//确认订单 价格
    var payment_type = 0;//支付方式
    var listPay = [];
    /**
     * 初始化
     */
    var init = function (){
        search();
        catShow();//左边展示 已选商品
        
    }
    var pay = function(){
//        console.log(JSON.stringify(listPay));
//        var obj={};
//        obj.ids=JSON.stringify(listPay);
//        obj.payType=payment_type;
    	var LOADDING;
    	if(payment_type==1){
    		LOADDING=layer.load(0,{content: "<font style='float: left;padding-top: 30px;width: 300px;font-size: 16px;margin-left: -35px;'>微信支付二维码加载中，请等待！</font>",shade: [0.1,'#fff']});
    	}
        $.ajax({
            url:"/sjcq/shoppingCart/pay",
            dataType:"json",
    	    async:true,
    	    data:{
    	    	ids:JSON.stringify(listPay),
    	    	payType:payment_type
    	    },
    	    type:"post",
//          contentType : "application/json;charset=UTF-8",
            success:function(data){
            	console.log(data);
            	if(data.status){
            		if(payment_type==0){
            			$("#car_confirm .gwc_li").append(data.result);
            		}else if(payment_type==1){
            			layer.close(LOADDING);
            			var result=data.result;
            			strs = result.split("&");
            			var theRequest={};
            			for (var i = 0; i < strs.length; i++) {
            				theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
            			}
            			var html='';
            			html+='<div style="padding:50px;text-align: center;">';
            			html+='<div style="margin: 0 atuo;width: 100%;height: 20px;margin-bottom: 20px;">';
            			html+='<p style="float: left;">订单号：'+theRequest.no+'</p>';
            			html+='<p style="float: right;">金额：'+theRequest.price+'</p>';
            			html+='</div>';
            			html+='<img src="'+index_nav.PICURI+theRequest.path+'">';
            			html+='</div>';
            			var payWin=layer.open({
            				title:null,
            				area: ['500px', '400px'],
            				content: html,
            				btn:null
            			});
            			var lunxun = setInterval(function(){
            				 $.ajax({
            			            url:"/sjcq/photoPay/checkByOrderNum",
            			            dataType:"json",
            			    	    async:true,
            			    	    data:{
            			    	    	orderNum:theRequest.no
            			    	    },
            			    	    type:"post",
            			            success:function(data){
            			            	if(data){
            			            		clearInterval(lunxun);
//            			            		layer.msg('付款成功！');
            			            		layer.open({
            			                        content: '付款成功！',
            			                        btn: ['确认'],
            			                        yes: function(index, layero) {
            			                        	window.location.href="shoppingCart.html";
            			                        },
            			                        cancel: function() {
            			                        	window.location.href="shoppingCart.html";
            			                        }
            			                    });
//            			            		window.location.href="shoppingCart.html";
            			            	}
            			            },
            			            error:function(){
            			                layer.msg('加载失败！');
            			            }
            			        });
            			},3000);
            		}
            		
            	}else{
            		layer.msg(data.msg);
            	}
                
//                if(data=="购买成功"){
//                    window.location.reload();//刷新页面
//                }
                //console.log(data);
            },
            error:function(){
                layer.msg('支付失败！');
            }
        });
    }
    /**
     * 查询商品
     * 
     */
    var search = function(){
        $.ajax({
            url:"/sjcq/shoppingCart/list",    // 请求的url地址
            type:"post",   // 请求方式
            dataType:"json",   // 返回格式为json
            async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
            data:{},   // 参数值     
            success:function(data){
               console.log(data);
               var html = "";
               $(data).each(function(i,row){
                   html = html + '<li>';
                   html = html + '<i class="ico ico43" data-id="'+row.carXh+'" data-type="0" onclick="shopping.select(this)"></i>';
                   html = html + '<p class="img"><img src="'+index_nav.PICURI+row.picPath+'"></p>';
                   html = html + '<p class="title">'+row.picMc+'</p>';
                   html = html + '<p class="imd">ID:'+row.picXh+'</p>';
                   html = html + '<p class="gs">JPG  '+row.picFbl+'</p>';
                   if(row.photoPrice==undefined || row.photoPrice ==null || row.photoPrice=='null' || row.photoPrice=='NULL' || row.photoPrice.length==0){
                	   html = html + '<p class="jg">¥0</p>';
                   }else{
                	   html = html + '<p class="jg">¥'+row.photoPrice+'</p>';
                   }
                   
                   html = html + '<p class="del"><a herf="javascript:void(0)" onclick="shopping.deleteThisObj(\''+row.id+'\')">删除</a></p>';
                   html = html + '</li>';
               });
               $("#cat_list").html(html);        
               catShow();//左边展示 已选商品
            },
            error:function(){
                layer.msg('加载目录失败！');
            }
        });
    }
    /**
     * 选择商品
     * @param {*} _this 
     */
    var select = function(_this){
        var _i = $(_this);//<i> 标签
        if(_i.attr("data-type") == 0){//判断是否选中状态  改为相反状态 0:选中  1:未选中
            _i.attr("class","ico ico42");
            _i.attr("data-type","1")
            //ml_num--;
        }else{
            _i.attr("class","ico ico43");
            _i.attr("data-type","0")
            //ml_num++;
        }
        
        catShow();//左边展示 已选商品
        //console.log(prev.is(":checked"));
    }

    /**
     * 全选 商品
     */
    var selectAll = function(_this){
        var all = $(_this);//<i> 标签
        if(all.attr("data-type") == 0){//判断是否选中状态  改为相反状态 0:选中  1:未选中
            all.attr("class","ico ico42");
            all.attr("data-type","1");

            var children = $("#cat_list").children();
            $(children).each(function(i,row){
                var i_ = $(row).children().eq(0);//<i> 标签
                i_.attr("data-type","1");
                i_.attr("class","ico ico42");
            });
        }else{
            all.attr("class","ico ico43");
            all.attr("data-type","0");

            var children = $("#cat_list").children();
            $(children).each(function(i,row){
                var i_ = $(row).children().eq(0);//<i> 标签
                i_.attr("data-type","0");
                i_.attr("class","ico ico43");
            });
        }
        catShow();//左边展示 已选商品
    }

    /**
     * 左边展示 已选商品
     */
    var catShow = function(){
        listPay = [];//每次刷新 付款信息
        confirm_list = "";//每次刷新 确认信息
        ml_num = 0;//选中数量
        var children = $("#cat_list").children();
        var html = "";
        var moneyAll = 0;//总价
        //console.log(children);
        $(children).each(function(i,row){
            var i_ = $(row).children().eq(0);//<i> 标签
            if(i_.attr("data-type")==0){
                listPay.push(i_.attr("data-id"));//获取选中商品 记录的uuid
                
                html = html + '<tr>';
                var ID = $(row).children().eq(3);//<p> 标签 ID
                html = html + '<td>'+ID.text()+'</td>';
                var money = $(row).children().eq(5);//<p> 标签 ID
                html = html + '<td><span class="gray3">'+money.text()+'</span></td>';
                html = html + '</tr>';    
                var str = (money.text()).substring(1,money.text().length);
                moneyAll =  parseFloat(moneyAll) +  parseFloat(str);
                ml_num++;//选中商品数量
                
                //确认订单数据
                confirm_list = confirm_list + '<li>';
                confirm_list = confirm_list + '<p class="img">'+$(row).children().eq(1).html()+'</p>';
                confirm_list = confirm_list + '<p class="title">'+$(row).children().eq(2).text()+'</p>';
                confirm_list = confirm_list + '<p class="imd">'+$(row).children().eq(3).text()+'</p>';
                confirm_list = confirm_list + '<p class="gs">'+$(row).children().eq(4).text()+'</p>';
                confirm_list = confirm_list + '<p class="jg">'+$(row).children().eq(5).text()+'</p>';
                confirm_list = confirm_list + '</li>';

                // confirm_list = confirm_list + '<p class="del">'+$(row).children().eq(3).text()+'</p>';
            }
 
            //confirm_list = confirm_list + $(row).html();//获取当前图片的 全部信息 展示在
            //console.log(confirm_list);
        });

        confirm_show = html;//确认订单列表
        confirm_money = moneyAll;//确认订单 价格

        $("#cat_show").html(html);
        $("#moneyAll").html("总计：<span>"+moneyAll+"</span>元");//总价实时 刷新
        $(".gwc_info>.ml20").text("已经选择商品 "+ml_num+" 件");//右边 选中商品 实时刷新
    }

    /**
     * 部分跳转
     * @param {*} state 1:返回 订单页面
     */
    var jump = function(state){
        if(state==1){
            $("#car_shopping").show();
            $("#car_confirm").hide();
            search();
            catShow();//左边展示 已选商品
        }else{
            $("#car_shopping").hide();
            $("#car_confirm").show();
            //展示订单数据
            $("#confirm_list").html(confirm_list);
            $("#confirm_show").html(confirm_show);
            $("#confirm_money").html("总计：<span>"+confirm_money+"</span>元");//总价实时 刷新
            $(".gwc_info>.ml5").text("共购买 "+ml_num+" 件作品");//右边 选中商品 实时刷新
        }
    }
    

    /**
     * 选择 支付方式
     * 
     * @param {*} state 0:支付宝 1:微信
     * @param {*} _this 
     */
    var payment = function(state,_this){
        var html = "";
        html = html + '<div class="pay_li" onclick="shopping.payment(0,this)">';
        html = html + '<span class="img"><img src="../project/images/zfb.png"></span>';
        html = html + '<span>支付宝</span>';
        if(state==0){
            payment_type = 0;
            html = html + '<i class="ico ico44"></i>';
        }
        html = html + '</div>';

        html = html + ' <div class="pay_li" onclick="shopping.payment(1,this)">';
        html = html + '<span class="img"><img src="../project/images/wx.png"></span>';
        html = html + '<span>微信</span>';
        if(state==1){
            payment_type = 1;
            html = html + '<i class="ico ico44"></i>';
        }
        html = html + '</div>';
        $(_this).parent().html(html)
    }
    /**
     * 删除商品.
     */
   var deleteThisObj=function(id){
       $.ajax({
           url:"/sjcq/shoppingCart/deleteThisObj",    // 请求的url地址
           type:"post",   // 请求方式
           dataType:"json",   // 返回格式为json
           async:true,// 请求是否异步，默认为异步，这也是ajax重要特性
           data:{id:id},   // 参数值     
           success:function(data){
        	   if(data.status=='success'){
        		   location.reload();
        	   }else{
        		   layer.msg(data.message);
        	   }
           },
           error:function(){
               layer.msg('系统异常!');
           }
       });
   }
    return {
    	deleteThisObj:deleteThisObj,
        init:init,
        select:select,
        selectAll:selectAll,
        jump:jump,
        payment:payment,
        pay:pay
    };
}();