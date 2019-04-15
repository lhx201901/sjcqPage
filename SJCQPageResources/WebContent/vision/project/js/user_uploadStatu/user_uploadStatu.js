$(function(){
	$('.asoci>a').on('click',function(){
		var idx=$(this).index();
		$(this).addClass('cur').siblings().removeClass('cur');
		$('.cisoao .my_up_img').eq(idx).fadeIn('fast').siblings().fadeOut('fast');
	})
	
})
