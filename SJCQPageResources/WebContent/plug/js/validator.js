/**
 * Created by WeiSiBin on 2017/7/21.
 * 基于bootsTrap框架的表单验证
 */

$(function () {
    //输入框不在模态框中的情况
    $("button[name='vali']").attr("onmousedown","validator('top')");
    //输入框在模态框中的情况
/*    $('#myModal').on('shown', function () {
        alert(1);
        $("button[name='vali']").attr("onmousedown","validator('right')");
    });*/

});

/**
 * 验证方法
 * @author WeiSiBin
 * @createTime 2017/7/24
 * @param fx 验证提示框方向
 */
function validator(fx) {

    //验证前做的事
    var valis = $("input[vali]:not(:disabled),textarea[vali]:not(:disabled)");//获得当前所有需要验证的input  只读或disabled的input框不能验证
    destroyPopover(valis);//验证之前取消所有的样式
    valis.attr("onfocus","destroyPopover(this)");//验证前就给当前所有的的vali input 加事件onfocus

    //验证的正则表达式
    var cardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;//身份证正则表达式
    var phone = /^1[34578]\d{9}$/;//手机号码正则表达式
    var onlyInt = /^[1-9]\d*$/; //正整数的正则表达式
    var roomNum = /^\d{2}$/;//两位以内的数字正则表达式 int(0-100)
    var onlyEn = /^[a-zA-Z]*$/;//英文字母的正则表达式
    var landline = /^((\d{3,4}-?\d{7,8})|(\d{7,8})|(\d{5}))$/;//座机号码正则表达式
    var url = /^(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$/;//网站地址正则表达式

    //范围int的正则表达式
    var intScope = /^[i][n][t][(]\d*[-]\d*[)]$/; //例如 int(0-100)
    //范围的string长度的正则表达式
    var strScope = /^[s][t][r][(]\d*[-]\d*[)]$/;//例如 str(0-100)

    //验证
    $.each(valis,function (index,ite) {
        var vali = $(ite).attr("vali").split(" ");//获取当前需要验证的条件进行分割
        var con = $(ite).val();//获得当前验证的值
        var boo = false;
        for (var i = 0; i < vali.length; i++) {//循环验证条件分别验证
            if (vali[i] == "not-null") {
                if (con.trim().length == 0) {
                    showPopover("输入不能为空！", ite, fx);
                    boo = true;
                    break;
                }
            } else if (vali[i] == "idCard") {
                if (!cardReg.test(con.trim())) {
                    showPopover("请输入正确的身份证号码！", ite, fx);
                    boo = true;
                    break;
                }
            } else if (vali[i]=="po-int"){
                if(!onlyInt.test(con.trim())) {
                    showPopover("请输入大于0的整数！", ite, fx);
                    boo = true;
                    break;
                }
            }else if (vali[i] == "phone") {//手机号(必须填)
                if (!phone.test(con.trim())) {
                    showPopover("请输入正确的手机号码！", ite, fx);
                    boo = true;
                    break;
                }
            }else if(vali[i]=="orPhone"){//手机号(要么填正确，要么不填)
                if(con.trim().length!=0){
                    if (!phone.test(con.trim())) {
                        showPopover("请输入正确的手机号码！", ite, fx);
                        boo = true;
                        break;
                    }
                }
            }else if(vali[i]=="land"){//座机号(要么填正确，要么不填)
                if(con.trim().length!=0){
                    if (!landline.test(con.trim())) {
                        showPopover("请输入正确的固定电话号码！", ite, fx);
                        boo = true;
                        break;
                    }
                }
            }else if(vali[i]=="orLand"){//座机号(要么填正确，要么不填)
                if(con.trim().length!=0){
                    if (!landline.test(con.trim())) {
                        showPopover("请输入正确的固定电话号码！", ite, fx);
                        boo = true;
                        break;
                    }
                }
            }else if(vali[i]=="landOrPhone"){//手机号或者电话号(必填)
                if (!phone.test(con.trim())&&!landline.test(con.trim())) {
                    showPopover("请输入格式正确的电话号码！", ite, fx);
                    boo = true;
                    break;
                }
            }else if(vali[i]=="orLandOrPhone"){//手机号或者电话号(要么填正确，要么不填)
                if(con.trim().length!=0){
                    if (!phone.test(con.trim())&&!landline.test(con.trim())) {
                        showPopover("请输入格式正确的电话号码！", ite, fx);
                        boo = true;
                        break;
                    }
                }
            }else if(vali[i]=="roomNum"){
                if (!roomNum.test(con.trim())) {
                    showPopover("库房号必须为两位数字！", ite, fx);
                    boo = true;
                    break;
                }
            }else if(intScope.test(vali[i])){
                var i_start = vali[i].indexOf("(")+1;
                var i_end = vali[i].indexOf(")");
                var i_scope = vali[i].substring(i_start,i_end).split("-");
                if (con.trim()>=i_scope[1]||con.trim()<=i_scope[0]) {
                    showPopover("请输入"+i_scope[0]+"-"+i_scope[1]+"之间的数字！", ite, fx);
                    boo = true;
                    break;
                }
            }else if(strScope.test(vali[i])){
                var s_start = vali[i].indexOf("(")+1;
                var s_end = vali[i].indexOf(")");
                var s_scope = vali[i].substring(s_start,s_end).split("-");
                if (con.trim().length>=s_scope[1]||con.trim().length<=s_scope[0]) {
                    showPopover("请输入"+s_scope[0]+"-"+s_scope[1]+"之间的字个数！", ite, fx);
                    boo = true;
                    break;
                }
            }else if(vali[i]=="onlyEn"){
                if(!onlyEn.test(con.trim())){
                    showPopover("输入只能为英文字母！", ite, fx);
                    boo = true;
                    break;
                }
            }else if(vali[i]=="url"){
                if(!url.test(con.trim())){
                    showPopover("请输入格式正确的网址！", ite, fx);
                    boo = true;
                    break;
                }
            }else if(vali[i]=="onlyInt"){
                if(!onlyInt.test(con.trim())){
                    showPopover("输入只能为数值！", ite, fx);
                    boo = true;
                    break;
                }
            }
        }
        if(boo){
            $("button[name='vali']").attr("disabled", true);
            return false;
        }
    });
}

/**
 * 弹出提示框，并改变当前对象边框颜色为红色
 * @author WeiSiBin
 * @createTime 2017/7/24
 * @param content  弹出内容
 * @param _this 当前指向对象
 * @param fx  显示验证提示框方向  如：right
 */
function showPopover(content,_this,fx) {
    $(_this).attr("data-toggle", "popover");//给当前框设置弹出框需要的属性
    $(_this).popover({content: content, placement: fx, trigger: "click"}).popover("show");
    $(_this).css("border-color", "red");
}

/**
 * 销毁提示框，并改变input的边框颜色为正常 并且取消按钮的 disabled 属性
 * @author WeiSiBin
 * @createTime 2017/7/25
 * @param _this 当前指向元素
 */
function destroyPopover(_this) {
    $(_this).popover("destroy");
    $(_this).css("border-color", "#ccc");
    $("button[name='vali']").attr("disabled", false);
}
