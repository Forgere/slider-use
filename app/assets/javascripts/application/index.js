$(function(){
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
	});
	//规则弹出
	$('.banner span').on('click',function(){
		showzhezhao();
		$('.huodongguize').show();
		$(window).scrollTop(636);
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
		if(!$("input#upload_type_1")[0].checked && !$("input#upload_type_2")[0].checked && !$("input#upload_type_3")[0].checked){
			alert("请选择明信片宣言");
			return false;
		}
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
		/* Act on the event */
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

	// $("input[type='submit']").click(function(e){
	// 	event.preventDefault();

	// 	$()
	// });
});
