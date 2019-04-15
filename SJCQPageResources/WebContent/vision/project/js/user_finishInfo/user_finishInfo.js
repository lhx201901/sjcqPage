$(function(){
	var radioStatu='man';//初始性别是男
	$('.toggleRadio').on('click','span',function(){
		$(this).addClass('raCur').siblings().removeClass('raCur');
		$(this).find('i').addClass('ico56').removeClass('ico55');
		$(this).siblings().find('i').removeClass('ico56').addClass('ico55');
		if($(this).hasClass('radioMan')){
			radioStatu='man';
		}else{
			radioStatu='women';
		}
		console.log(radioStatu)
	})
})
