$(function () {
	var weinr = $('#slider1 .slider1').slider({
		cachepage: false, //显示前后保存的数据
		showcount: 4, //图数量
		renderer: renderer,
		mode : 'dynamic',
		prev:'',
		next:'',
		loop:true
	});
  var id = 1;
	var weinrControl = weinr.data('key');
	console.log(weinrControl);
	weinr.on('reachLastImage',function(e){
		var url = "http://127.0.0.1:3000/uploads.json?page_id=";
    $.ajax({
        url: url + id,
        type: 'GET',
        dataType: 'json',
        success:function(result){
        	id ++;
        	//传入结果
        	weinrControl.addItems(weinrControl.o.currentItem,result);
        }
    });
	});
	function renderer(data){
		var address = "http://"+window.location.host+data.img.url+"/thumb";
		return $('<a><img src='+address+'></a>');
	}
});