$(function(){
    var $w = $(window),
    ww = $w.width(),
    wh = $w.height(),
    transform;
    var scale = ww/360;
    transform = 'scale(' + scale + ',' + scale + ')';
    $('.mobile').css('-webkit-transform', transform)
      .css('transform', transform);
	var wheight =$(document).height();
	$('.zhezhao').css('height',wheight);
	//遮罩显示
	function showzhezhao(){
		$('.zhezhao').css('display','block');
		var wheight =$(document).height();
		$('.zhezhao').css('height',wheight);
	}
	//遮罩关闭
	$('.close').on('click', function(event) {
		event.preventDefault();
		/* Act on the event */
		$('.tanchu').hide();
		$('.zhezhao').hide();
		if(window.action_str){
      $("form").attr("action", window.action_str);
    }
	});
	//wap close
	$('.mobile .tanchu').on('click', function(e) {
		$('.tanchu').hide();
		$('.zhezhao').hide();
		if(window.action_str){
      $("form").attr("action", window.action_str);
    }
	});
	$('.shangchuanwarp').on('click', function(event) {
    event.stopPropagation();
		/* Act on the event */
	});
	$('.zhucewarp').on('click', function(event) {
    event.stopPropagation();
		/* Act on the event */
	});
	//规则弹出
	$('.banner span').on('click',function(){
		showzhezhao();
		$('.huodongguize').show();
		var sctop = $('.banner').offset().top;
		$(window).scrollTop(sctop);
	});

	//我要上传弹出
	$('.title1 img').on('click', function(event) {
		event.preventDefault();
		/* Act on the event */
		showzhezhao();
		$('.shangchuan').show();
		$('.shangchuanwarp').show();
		$('.zhucewarp').hide();
	});
	//注册弹出（加判断）
	$('.shangchuanwarp .sharebutton').on('click',function(event) {
		event.preventDefault();
		/* Act on the event */
		if($('input#upload_img').val().length === 0 || !$('input#upload_img').val().match(/\.gif|jpg|jpeg|png|bmp$/)){
			alert("请上传图片");
			return false;
		}
		if(!$("input#upload_upload_type_1")[0].checked && !$("input#upload_upload_type_2")[0].checked && !$("input#upload_upload_type_3")[0].checked){
			alert("请选择明信片宣言");
			return false;
		}
		$('.mobile .shangchuan .kuangbg>img').attr('src','/assets/wap_zhucebg.png');
		$('.shangchuanwarp').hide();
		$('.zhucewarp').show();
	});
	//注册提交后，上传成功弹出
	// $('.zhucewarp .sharebutton').on('click',function(event) {
	// 	event.preventDefault();
	// 	/* Act on the event */
	// 	$('.shangchuan').hide();
	// 	$('.gongxi').show();
	// });
	//分享按钮
	$('.sharebutton .weixin').on('click',function(event) {
		event.preventDefault();
		event.stopPropagation();
		/* Act on the event */
		//$('.tanchu').hide();
		$('.zhezhao').show();
		$('.tanchu').hide();
		$('.erweima').show();
	});
	$('span.right').click(function(event) {
		/* Act on the event */
		$('.erweima').hide();
		$('.zhezhao').hide();
	});

	$(".xuanxiang input").change(function(e){
		$(".xuanxiang label").removeClass('checked');
		$(".xuanxiang input:checked+label").addClass('checked');
	});

	$('.lt-ie9 .left1').hover(function() {
		w = $(this).width();
		h = $(this).height();
		 // Stuff to do when the mouse enters the element 
		$(this).width(1.1*w);
		$(this).height(1.1*h);
		},function(){
		$(this).width(157);
		$(this).height(360);
	});
	$('.lt-ie9 .right1').hover(function() {
		w = $(this).width();
		h = $(this).height();
		 // Stuff to do when the mouse enters the element 
		$(this).width(1.1*w);
		$(this).height(1.1*h);
		},function(){
		$(this).width(275);
		$(this).height(121);
	});
	$('.lt-ie9 .right2').hover(function() {
		w = $(this).width();
		h = $(this).height();
		// Stuff to do when the mouse enters the element 
		$(this).width(1.1*w);
		$(this).height(1.1*h);
		$(this).css('margin', '0 -2px -10px 0');
		},function(){
		$(this).width(w);
		$(this).height(h);
		$(this).css('margin', '0');
	});
	$('.lt-ie9 .blockzhong1').hover(function() {
		w = $('.zhong1').width();
		h = $('.zhong1').height();
		 // Stuff to do when the mouse enters the element 
		$('.zhong1').width(1.1*w);
		$('.zhong1').height(1.1*h);
		$('.zhong1').css('margin', '-10px 0 0 -10px');
		},function(){
		$('.zhong1').width(473);
		$('.zhong1').height(192);
		$('.zhong1').css('margin', '0');
	});
	$('.lt-ie9 .blockzhong2').hover(function() {
		w = $('.zhong2').width();
		h = $('.zhong2').height();
		 // Stuff to do when the mouse enters the element 
		$('.zhong2').width(1.1*w);
		$('.zhong2').height(1.1*h);
		$('.zhong2').css('margin', '-10px 0 0 -10px');
		},function(){
		$('.zhong2').width(359);
		$('.zhong2').height(219);
		$('.zhong2').css('margin', '0');
	});
	$('.lt-ie9 .blockzhong3').hover(function() {
		w = $('.zhong3').width();
		h = $('.zhong3').height();
		 // Stuff to do when the mouse enters the element 
		$('.zhong3').width(1.1*w);
		$('.zhong3').height(1.1*h);
		$('.zhong3').css('margin', '-15px 0 0 -15px');
		},function(){
		$('.zhong3').width(380);
		$('.zhong3').height(258);
		$('.zhong3').css('margin', '0');
	});
});
