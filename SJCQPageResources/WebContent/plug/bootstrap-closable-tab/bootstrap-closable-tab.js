var closableTab = {
	//frame加载完成后设置父容器的高度，使iframe页面与父页面无缝对接
	frameLoad:function (frame){

			var mainheight = $(frame).contents().find('body').height();
		//	alert(mainheight);
			$(frame).parent().height("700px");
		},

    //添加tab
	addTab:function(tabItem){ //tabItem = {id,name,url,closable,param}
		var id = "tab_seed_" + tabItem.id;
		var container ="tab_container_" + tabItem.id;
		var url=tabItem.url;
		console.log(tabItem);
		var ifram_id="tab_frame_"+tabItem.id;
		if(tabItem.param!=null && tabItem.param!='undefined'){
			url = encodeURI(url+"?"+"param="+tabItem.param);
		}
		$("li[id^=tab_seed_]").removeClass("active");
		$("div[id^=tab_container_]").removeClass("active");

		if(!$('#'+id)[0]){
			var li_tab = '<li role="presentation" class="" id="'+id+'"><a href="#'+container+'"  role="tab" data-toggle="tab" style="position: relative;padding:2px 20px 2px 15px;background-color:transparent;">'+tabItem.name;
			if(tabItem.closable){
				li_tab = li_tab + '<i class="icon-remove-sign" tabclose="'+id+'" style="position: absolute;right:4px;top: 5px;"  onclick="closableTab.closeTab(this)"></i></a></li> ';
			}else{
				li_tab = li_tab + '</a></li>';
			}
		
		 	var tabpanel = '<div role="tabpanel" class="tab-pane" id="'+container+'" style="width: 100%;">'+
	    					  '<iframe src="'+url+'" id="'+ifram_id+'" style="width:100%;height:2000px;   background-color: transparent;" allowtransparency=true    frameBorder="0"></iframe></div>' ;
			$('.nav-tabs').append(li_tab);
			$('.tab-content').append(tabpanel);
		}
		$("#"+id).addClass("active");
		$("#"+container).addClass("active");
	},

	//关闭tab
	closeTab:function(item){
		console.log(item);
		var val = $(item).attr('tabclose');
		var containerId = "tab_container_"+val.substring(9);
   	    
   	    if($('#'+containerId).hasClass('active')){
   	    	$('#'+val).prev().addClass('active');
   	    	$('#'+containerId).prev().addClass('active');
   	    }


		$("#"+val).remove();
		$("#"+containerId).remove();
	},
	clearAllTab:function(){
		$("#tabMenue").children().remove();
		$("#tabContent").children().remove();
	},
	clearTabNotThis:function(id){
		var save_li="tab_seed_"+id;
		var save_tab_pane="tab_container_"+id;
	//	var save_tab_content= $("#"+save_tab_pane).clone(true);
	//	var save_menue_li= $("#"+save_li).clone(true);
		$("#tabContent").children(":not('#"+save_tab_pane+"')").remove();
		$("#tabMenue").children(":not('#"+save_li+"')").remove();
	//	$("#tabContent").empty();
	//	$("#tabMenue").empty();
	//	$("#tabContent").append(save_tab_content);
	//	$("#tabMenue").append(save_menue_li);
	},
	closeThisTab:function(id){
		var val = "tab_seed_"+id;
		var containerId = "tab_container_"+id;
		if($('#'+containerId).hasClass('active')){
			$('#'+val).prev().addClass('active');
			$('#'+containerId).prev().addClass('active');
		}
		$("#"+val).remove();
		$("#"+containerId).remove();
	},
	closeTabNotThis:function(id){
		
		var id= id.substring(10,id.length)
		var save_li="tab_seed_"+id;
		var save_tab_pane="tab_container_"+id;
		 $("#"+save_tab_pane).nextAll().remove();
		 $("#"+save_li).nextAll().remove();
		 $('#'+save_tab_pane).addClass('active');
		 $('#'+save_li).addClass('active');
	}
}
