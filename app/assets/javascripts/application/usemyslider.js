$(function () {
	var pageId= 4,api = 'http://localhost:3000/uploads.json?page_id=';
	$.ajax({
		url: api+pageId,
		type: 'GET',
		dataType: 'json',
		success:function(result){
			var romoteArray = [];
			$.each(result,function(i) {
				romoteArray[i] = "http://"+window.location.host+result[i].img.url+"/thumb";
			});
			$('#slider1').width('980px');
			$('#slider1 .slider1').slider({
				number: 4, //图数量
				savenumber: 2, //显示前后保存的数据
				autochange: true, //是否自动适应平铺
				autoplay: false, //自动播放
				arrows: true, //有箭头
				duration: 3000, //自动播放时延迟
				speed: 200, //箭头滚动速度
				autospeed: 'slow', //自动播放速度
				lazyload: true, //是否开启lazyload
				loading: '/assets/loading.gif', //加载中的图片
				fadeIn: false, //开启fadeIn滚动特效
				romoteArray:romoteArray,
				pageId:pageId,//存在即无线滚动下去
				api:api
			});
			$('.arrow').html('');

		}
	});
});