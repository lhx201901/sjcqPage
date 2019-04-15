$(function(){
	//选择内容
	var curSelectArray=[];//已选择内容的id
	$('.my_up_img').on('click','li',function(){
		var idx=$(this).index();
		var curID=$(this).attr('data-id');
		var curLen=curSelectArray.length;
		if($(this).hasClass('cur')){
			$(this).removeClass('cur');
			for(var i=0;i<curLen;i++){
				if(curSelectArray[i]===curID){
					curSelectArray.splice(i,1);
				}
			}
		}else{
			$(this).addClass('cur');
			curSelectArray.push(curID);
		}
		$('.nowSelct').text(curSelectArray.length);
	})
	//取消选择
	$('.cancleSelect').on('click',function(){
		$('.my_up_img').find('li').removeClass('cur');
		curSelectArray=[];
		$('.nowSelct').text(0);
	})
})
