/**
*吴冲
*2017/03/24
*首页模块加载
*/



$(function(){
	//console.log(11111);
	var appCss=parent.APPCSS;
	$("#first_style_color").attr("href",appCss);
	indexInIt();
	//初始化模块
	function indexInIt(){
		$(".thumbnails").children().remove();
		for(var i=0;i<parent.result_1.length;i++){
			console.log(parent.result_1[i]);
			$(".thumbnails").append(
				//"<li class='span3'><a href='javascript:void(0);' class='thumbnail'  onclick='javascript:moduleSelected(&apos;"+parent.result_1[i].id+"&apos;);'><img src='"+parent.result_1[i].moduleImg+"' alt='"+parent.result_1[i].name+"'/><p style='text-align: center;'>"+parent.result_1[i].name+"</p></a></li>"
				//"<li class='span3' style='margin: 0px;width: 269px;'><a href='javascript:void(0);' class='thumbnail' style='border:0px;padding:0px'  onclick='javascript:moduleSelected(&apos;"+parent.result_1[i].id+"&apos;);'><img src='"+parent.result_1[i].moduleImg+"'style='width:320px' alt='"+parent.result_1[i].name+"'/></a></li>"
				"<li class='span3' ><a href='javascript:void(0);' class='thumbnail thumbnail-notboxshow' title='"+parent.result_1[i].name+"'  onclick=\"moduleSelected('"+parent.result_1[i].id+"')\"><img src='"+parent.result_1[i].moduleImg+"' alt='"+parent.result_1[i].name+"'/><p style='display:none; text-align: center;'>"+parent.result_1[i].name+"</p></a></li>"
			);
		}
	}
});

/*pwdid:模块id
	方法描述:改变对应主菜单及子菜单的样式
*/
function moduleSelected(pwdid){
		if(pwdid==null||pwdid==undefined){
			return;
		}
		parent.MAIN_MODULE_ID=pwdid;
		$("#li_"+pwdid, parent.document).attr("class","active");
		$("#li_"+pwdid+" >a >.arrow", parent.document).attr("class","arrow open");
		$("#li_"+pwdid+" >a", parent.document).append("<span class='selected'></span>");
		$("#li_"+pwdid+" >ul", parent.document).attr("style","");
		$("#li_"+pwdid, parent.document).siblings("li").attr("class","");
		for(var i=0;i<parent.result_1.length;i++){
			if(parent.result_1[i].id==pwdid&& parent.result_1[i].children){
				skipToSunPage(parent.result_1[i].children);
				break;
			}
			
		}
		
		//改变子菜单中的样式
		function  skipToSunPage(result){
		if(result[0]==null||result[0]==undefined){
		return;
		}
		$("#li_"+result[0].id, parent.document).attr("class","active");
		$("#li_"+result[0].id+" >a >.arrow", parent.document).attr("class","arrow open");
		$("#li_"+result[0].id+" >ul", parent.document).attr("style","");
		$("#li_"+result[0].id, parent.document).siblings("li").attr("class","");
		if(result[0].children==null||result[0].children=="undefined"||result[0].children.length==0){
			//window.location.href=result[0].url;
			var item = {'id':result[0].id,'name':result[0].name,'url':result[0].url,'closable':false,'param':JSON.stringify({MODULEID_:result[0].id})};
			parent.loadDH(result[0],$("#li_"+result[0].id+">a", parent.document));
			parent.closableTab.addTab(item);
			//console.log(1111111111111)
			parent.closableTab.clearTabNotThis(result[0].id);
		//	console.log(222222222)
		}else{
			skipToSunPage(result[0].children);
		}
	}
}




