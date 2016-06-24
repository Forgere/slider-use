$(function () {
	pageId= 1;api = 'http://localhost:3000/uploads.json?page_id=';
	$.ajax({
		url: api+pageId,
		type: 'GET',
		dataType: 'json',
		success:function(result){
			var romoteArray = [];
			$.each(result,function(i) {
				romoteArray[i] = "http://"+window.location.host+result[i].img.url+"/thumb";
				console.log(renderer(result[i]));
			});
			$('#slider1').width('980px');
			var weinr = $('#slider1 .slider1').slider2({
				number: 4, //图数量
				savenumber: 2, //显示前后保存的数据
				loading: '/assets/loading.gif', //加载中的图片
				romoteArray:romoteArray,
				prev: '',
				next: '',
				innerHTML:'<li><a><img></a></li>',
				ajaxcallback:true
			});

			/*
			控制器行为     weinr.data('key').next();
			
			添加事件				weinr.on('addNewImage', function(event) {
											alert(1);
										});

			
			*/
			weinr.on('reachLastImage',function(e,location){
				console.log(location);
				pageId++;
        $.ajax({
            url: api+pageId,
            type: 'GET',
            dataType: 'json',
            success:function(result){
                var romoteAddArray = [];
                $.each(result,function(i) {
                    romoteAddArray[i] = "http://"+window.location.host+result[i].img.url+"/thumb";
                });
                $.each(romoteAddArray,function(i) {
                    romoteArray.push(romoteAddArray[i]);
                });
            }
        });
			});
		}
	});
	function renderer(data){
		var item;
		var address = "http://"+window.location.host+data.img.url+"/thumb";
		item = $('<li><a href='+address+'><img></a></li>');
		return item;
	}
});