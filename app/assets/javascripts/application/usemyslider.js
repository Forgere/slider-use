$(function () {
	pageId= 1;api = 'http://localhost:3000/uploads.json?page_id=';
	$.ajax({
		url: api+pageId,
		type: 'GET',
		dataType: 'json',
		success:function(result){
			var romoteArray = [];
			$.each(result,function(i) {
				romoteArray[i] = renderer(result[i]);
			});
			$('#slider1').width('980px');
			var weinr = $('#slider1 .slider1').slider2({
				number: 4, //图数量
				savenumber: 2, //显示前后保存的数据
				loading: '/assets/loading.gif', //加载中的图片
				romoteArray:romoteArray,
				prev: '',
				next: '',
				ajaxcallback:true
			});

			weinr.on('reachLastImage',function(e,location){
				pageId++;
        $.ajax({
            url: api+pageId,
            type: 'GET',
            dataType: 'json',
            success:function(result){
              $.each(result,function(i) {
                  romoteArray.push(renderer(result[i]));
              });
            }
        });
			});
		}
	});
	function renderer(data){
		var item;
		var address = "http://"+window.location.host+data.img.url+"/thumb";
		item = $('<li><a><img src='+address+'></a></li>');
		return item;
	}
});