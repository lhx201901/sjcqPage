(function(window) {
    var theUA = window.navigator.userAgent.toLowerCase();
    if ((theUA.match(/msie\s\d+/) && theUA.match(/msie\s\d+/)[0]) || (theUA.match(/trident\s?\d+/) && theUA.match(/trident\s?\d+/)[0])) {
        var ieVersion = theUA.match(/msie\s\d+/)[0].match(/\d+/)[0] || theUA.match(/trident\s?\d+/)[0];
        if (ieVersion < 10) {
            var str = "你的浏览器版本太低了:(";
            var str1 = "建议升级浏览器版本，";
            var str2 = "推荐使用:<a href='https://www.baidu.com/s?ie=UTF-8&wd=%E8%B0%B7%E6%AD%8C%E6%B5%8F%E8%A7%88%E5%99%A8' target='_blank' style='color:red'>谷歌</a>,"
            + "<a href='https://www.baidu.com/s?ie=UTF-8&wd=%E7%81%AB%E7%8B%90%E6%B5%8F%E8%A7%88%E5%99%A8' target='_blank' style='color:red'>火狐</a>,"
            + "<a href='https://www.baidu.com/s?ie=UTF-8&wd=%E7%8C%8E%E8%B1%B9%E6%B5%8F%E8%A7%88%E5%99%A8' target='_blank' style='color:red'>猎豹</a>,其他双核急速模式";
            document.writeln("<pre style='text-align:center;color:#fff; height:100%;border:0;position:fixed;top:0;left:0;width:100%;z-index:1234'>" + 
            "<h2 style='padding-top:200px;margin:0;color:#2C96FF'><strong>" + str + "<br/></strong></h2><p style='color:#2C96FF;'>" + 
            str1+str2 + "</p><h2 style='margin:0;color:#2C96FF'><strong>如果你使用的是双核浏览器,请切换到极速模式访问<br/></strong></h2></pre>");
            document.execCommand("Stop");
        };
    }
})(window);