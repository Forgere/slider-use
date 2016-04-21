$(function(){
	//遮罩显示
	function showzhezhao(){
		$('.zhezhao').css('display','block');
		var wheight =$(document).height();
		console.log(wheight);
		$('.zhezhao').css('height',wheight);
	}
	//遮罩关闭
	$('.close').on('click', function(event) {
		event.preventDefault();
		/* Act on the event */
		$('.tanchu').hide();
		$('.zhezhao').hide();
	});
	//规则弹出
	$('.banner span').on('click',function(){
		showzhezhao();
		$('.huodongguize').show();
	});
	//我要上传弹出
	$('.title1 img').on('click', function(event) {
		event.preventDefault();
		/* Act on the event */
		showzhezhao();
		$('.shangchuan').show();
	});
	//注册弹出（加判断）
	$('.shangchuan .sharebutton').on('click',function(event) {
		event.preventDefault();
		/* Act on the event */
		$('.shangchuan').hide();
		$('.zhuce').show();
	});
	//注册提交后，上传成功弹出
	$('.zhuce .sharebutton').on('click',function(event) {
		event.preventDefault();
		/* Act on the event */
		$('.zhuce').hide();
		$('.gongxi').show();
	});
	//分享按钮
	$('.sharebutton .weixin').on('click',function(event) {
		event.preventDefault();
		/* Act on the event */
	});
	$('.sharebutton .weibo').on('click',function(event) {
		event.preventDefault();
		/* Act on the event */
	});


// //跑马灯效果
// 	$('.sliders').carousel({resizeChildByNum: 4 });
// //切换slider
//   $('.showdianzan .groups li').eq(0).click(function(event) {
//       /* Act on the event */
//       $('.showdianzan .groups li span').removeClass('active');
//       $(this).find('span').addClass('active');
//       $('.showdianzan .slider').hide().removeClass('showslider');
//       $('.showdianzan #slider1').show().addClass('showslider');
// 			$('.sliders').carousel({resizeChildByNum: 4 });
//   });
//   $('.showdianzan .groups li').eq(1).click(function(event) {
//       /* Act on the event */
//       $('.showdianzan .groups li span').removeClass('active');
//       $(this).find('span').addClass('active');
//       $('.showdianzan .slider').hide().removeClass('showslider');
//       $('.showdianzan #slider2').show().addClass('showslider');
//       $('.sliders').carousel({resizeChildByNum: 4 });
//   });
//   $('.showdianzan .groups li').eq(2).click(function(event) {
//       /* Act on the event */
//       $('.showdianzan .groups li span').removeClass('active');
//       $(this).find('span').addClass('active');
//       $('.showdianzan .slider').hide().removeClass('showslider');
//       $('.showdianzan #slider3').show().addClass('showslider');
//       $('.sliders').carousel({resizeChildByNum: 4 });
//     });
});
