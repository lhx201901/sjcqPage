/**
 * 处理数据的公共方法
 */
var getUtil = {
    /**
     * 初始化
     */
    init:function(){
        
    },
    /**
     * 获取网页上的值
     * @param name key
     */
    getUrlParam:function(name){
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        //console.log(r);
        if (r != null) return chineseFromUtf8Url(r[2]);
        return null; //返回参数值
    },
    /**
     * 字符串为空 返回 "";
     */
    nullR:function(str){
        if(str==null||str==undefined){
            return "";
        }else{
            return str;
        }
    },
    /**
     * 字符串为空 返回 无;
     */
    null_W:function(str){
        if(str==null||str==undefined||str==""){
            return "无";
        }else{
            return str;
        }
    },
    /**
     * 当数字超过 10000 时 修改为中文的 作为单位万
     */
    number:function(num){
        if(num==null||num==""){
            return 0;
        }
        if(num>10000){
            //console.log((num.toString()));
            return (num.toString()).substring(0,((num.toString()).length-4))+"万";
        }
        return num;
    },
    /**
     * 时间戳 转为时间
     */
    getTimetrans:function(timestamp) {
        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        //return Y+M+D+h+m+s;
        return Y+M+D;
    }

}
 
/**
 * 汉子转utf-8
 * @param {*} s1 
 */
function EncodeUtf8(s1){
      var s = escape(s1);
      var sa = s.split("%");
      var retV ="";
      if(sa[0] != ""){
         retV = sa[0];
      }
      for(var i = 1; i < sa.length; i ++){
           if(sa[i].substring(0,1) == "u"){
               retV += Hex2Utf8(Str2Hex(sa[i].substring(1,5)));
           }
           else retV += "%" + sa[i];
      }
      return retV;
}
function Str2Hex(s){
      var c = "";
      var n;
      var ss = "0123456789ABCDEF";
      var digS = "";
      for(var i = 0; i < s.length; i ++){
         c = s.charAt(i);
         n = ss.indexOf(c);
         digS += Dec2Dig(eval(n));
      }
      //return value;
      return digS;
}
function Dec2Dig(n1){
        var s = "";
        var n2 = 0;
        for(var i = 0; i < 4; i++){
            n2 = Math.pow(2,3 - i);
            if(n1 >= n2){
                s += '1';
                n1 = n1 - n2;
            }else
            s += '0';

        }
        return s;
}
function Dig2Dec(s){
        var retV = 0;
        if(s.length == 4)
        {
            for(var i = 0; i < 4; i ++)
            {
                retV += eval(s.charAt(i)) * Math.pow(2, 3 - i);
            }
            return retV;
        }
        return -1;
}
function Hex2Utf8(s){
        var retS = "";
        var tempS = "";
        var ss = "";
        if(s.length == 16)
        {
            tempS = "1110" + s.substring(0, 4);
            tempS += "10" + s.substring(4, 10);
            tempS += "10" + s.substring(10,16);
            var sss = "0123456789ABCDEF";
            for(var i = 0; i < 3; i ++)
            {
                retS += "%";
                ss = tempS.substring(i * 8, (eval(i)+1)*8);
                retS += sss.charAt(Dig2Dec(ss.substring(0,4)));
                retS += sss.charAt(Dig2Dec(ss.substring(4,8)));
            }
            return retS;
        }
        return "";
}


/**
 * utf-8转汉子
 * @param {*} strUtf8 
 */
function  chineseFromUtf8Url(strUtf8) { 
    var   bstr   =   ""; 
    var   nOffset   =   0; //   processing   point   on   strUtf8 
    if(   strUtf8   ==   ""   ) 
        return   ""; 
    var tempStr=strUtf8.toLowerCase(); 
    nOffset   =   tempStr.indexOf("%e"); 
    if(   nOffset   ==   -1   ) 
        return   strUtf8; 
    while(   nOffset   !=   -1   ) { 
        bstr   +=   tempStr.substr(0,   nOffset); 
        strUtf8   =   strUtf8.substr(nOffset,   strUtf8.length   -   nOffset); 
        tempStr   =   tempStr.substr(nOffset,   tempStr.length   -   nOffset); 
        if(   tempStr   ==   ""   ||   tempStr.length   <   9   )       //   bad   string 
            return   bstr; 

        bstr   +=   utf8CodeToChineseChar(tempStr.substr(0,   9)); 
        strUtf8   =   strUtf8.substr(9,   strUtf8.length   -   9); 
        tempStr   =   tempStr.substr(9,   tempStr.length   -   9); 
        nOffset   =   tempStr.indexOf("%e"); 
    } 
    return   bstr   +   strUtf8; 
} 

function   unicodeFromUtf8(strUtf8)   { 
    var   bstr   =   ""; 
    var   nTotalChars   =   strUtf8.length; //   total   chars   to   be   processed. 
    var   nOffset   =   0; //   processing   point   on   strUtf8 
    var   nRemainingBytes   =   nTotalChars; //   how   many   bytes   left   to   be   converted 
    var   nOutputPosition   =   0; 
    var   iCode,   iCode1,   iCode2; //   the   value   of   the   unicode. 
    while   (nOffset   <   nTotalChars) 
    { 
    iCode   =   strUtf8.charCodeAt(nOffset); 
    if   ((iCode   &   0x80)   ==   0) //   1   byte. 
    { 
    if   (   nRemainingBytes   <   1   ) //   not   enough   data 
    break; 

    bstr   +=   String.fromCharCode(iCode   &   0x7F); 
    nOffset   ++; 
    nRemainingBytes   -=   1; 
    } 
    else   if   ((iCode   &   0xE0)   ==   0xC0) //   2   bytes 
    { 
    iCode1   =     strUtf8.charCodeAt(nOffset   +   1); 
    if   (   nRemainingBytes   <   2   || //   not   enough   data 
        (iCode1   &   0xC0)   !=   0x80   ) //   invalid   pattern 
    { 
    break; 
    } 

    bstr   +=   String.fromCharCode(((iCode   &   0x3F)   <<   6)   |   (   iCode1   &   0x3F)); 
    nOffset   +=   2; 
    nRemainingBytes   -=   2; 
    } 
    else   if   ((iCode   &   0xF0)   ==   0xE0) //   3   bytes 
    { 
    iCode1   =     strUtf8.charCodeAt(nOffset   +   1); 
    iCode2   =     strUtf8.charCodeAt(nOffset   +   2); 
    if   (   nRemainingBytes   <   3   || //   not   enough   data 
        (iCode1   &   0xC0)   !=   0x80   || //   invalid   pattern 
        (iCode2   &   0xC0)   !=   0x80   ) 
    { 
    break; 
    } 

    bstr   +=   String.fromCharCode(((iCode   &   0x0F)   <<   12)   |    
    ((iCode1   &   0x3F)   <<     6)   | 
    (iCode2   &   0x3F)); 
    nOffset   +=   3; 
    nRemainingBytes   -=   3; 
    } 
    else //   4   or   more   bytes   --   unsupported 
    break; 
    } 
    if   (nRemainingBytes   !=   0) 
    { 
    //   bad   UTF8   string. 
    return   ""; 
    } 

    return   bstr; 
} 

function   utf8CodeToChineseChar(strUtf8) { 
      var   iCode,   iCode1,   iCode2; 
      iCode   =   parseInt("0x"   +   strUtf8.substr(1,   2)); 
      iCode1   =   parseInt("0x"   +   strUtf8.substr(4,   2)); 
      iCode2   =   parseInt("0x"   +   strUtf8.substr(7,   2)); 
      return   String.fromCharCode(((iCode & 0x0F) << 12) | ((iCode1   &   0x3F) << 6)   | (iCode2   &   0x3F)); 
} 