$(function () {
	var weinr = $('#slider1 .slider1').slider({
		cachecount: 2, //显示前后保存的数据
		showcount: 4, //图数量
		renderer: renderer,
		mode : 'dynamic'
	});

	var weinrcontrol = weinr.data('key');

	weinr.on('reachLastImage',function(e){
    $.ajax({
        url: "http://127.0.0.1:3000/uploads.json?page_id=1",
        type: 'GET',
        dataType: 'json',
        success:function(result){
        	//传入结果
        	weinrcontrol.additems(weinrcontrol.currentpage,result);
        }
    });
	});
	function renderer(data){
		var address = "http://"+window.location.host+data.img.url+"/thumb";
		return $('<a><img src='+address+'></a>');
	}
});