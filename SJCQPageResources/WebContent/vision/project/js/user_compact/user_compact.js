$(function(){
	var radioStatu=true;//初始是同意协议
	$('.toggleRadio').on('click','span',function(){
		$(this).addClass('raCur').siblings().removeClass('raCur');
		$(this).find('i').addClass('ico56').removeClass('ico55');
		$(this).siblings().find('i').removeClass('ico56').addClass('ico55');
		if($(this).hasClass('radioLeft')){
			radioStatu=true;
		}else{
			radioStatu=false;
		}
		console.log(radioStatu)
	})
	
})


