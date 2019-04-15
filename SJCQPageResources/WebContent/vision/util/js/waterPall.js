/**
 * 简单的瀑布流加载
 * 
 */
var waterPall = {
    /**
     * 初始化
     */
    init:function(){
        
    },
    /**
     * 设置滚动到最小高度时  执行方法
     * @param r_footHei 底部的高度
     * @param callback 回调函数
     */
    setWaterPall:function(r_footHei,callback){
        var r_docHei = $(window.document).height();//文档高度
        var r_scrollTop = $(window.document).scrollTop();//滚动的距离
        //var r_footHei = $(".faut").innerHeight() + $(".footer").innerHeight();//底部的高度
        var win_Hei = $(window).height();//窗口高度
        //var ul_Hei = $(".r-waterFall").height();//整个瀑布流的高度
        //var minHei = Math.min.apply(null,itemArray);//当前瀑布流高度最小值
        var r_nowHei = r_docHei - win_Hei - r_footHei - r_scrollTop;//整个瀑布流距离窗口底部的大小
        //var ul_restUl = ul_Hei - minHei;//最小高度div距离瀑布流底部的大小
        //var r_maxSetHei= ul_restUl- r_nowHei;//最小高度div距离浏览器窗口底部的大小
        //console.log(r_nowHei,"======");
        if(r_nowHei<100){
            callback();
        }
    }

}