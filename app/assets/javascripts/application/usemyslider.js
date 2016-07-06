$(function () {
	var weinr = $('#slider1 .slider1').slider({
		showcount:4, //图数量
		renderer: renderer,
		mode : 'dynamic',
		prev:'',
		next:'',
		cachecount:8,
		lazyload:true
	});
	var weinrControl = weinr.data('key');
	weinr.on('reachLastImage',ajax);
	function ajax(e,value,time){
		var url = "http://127.0.0.1:3000/uploads.json?page_id=";
		var id,resultSum=[];
		if(value){
			for(var i = 0;i<time;i++){
				id = value+i;
				havaValueJax(url,id,value,resultSum,time,i);
			}
		}else{
	    $.ajax({
	        url: url + 1,
	        type: 'GET',
	        dataType: 'json',
	        success:success
	    });
		}
	}
	function havaValueJax(url,id,value,resultSum,time,i){
    $.ajax({
      url: url + id,
      type: 'GET',
      dataType: 'json',
      success:function(result){
				//积累数据
				resultSum =$.merge(resultSum, result);
				if( i === time -1){
					console.log(1);
					weinrControl.addItems(weinrControl.ajax*(value-1),resultSum);
				}
      }
    });
	}
	function success(result){
  	//传入结果
  	weinrControl.addItems(weinrControl.o.totalItem,result);
  	weinrControl.ajax = result.length;
	}
  	weinrControl.set('totalPage',4);
	function renderer(data){
		var address = "http://"+window.location.host+data.img.url+"/thumb";
		return $('<a><img src='+address+'></a>');
	}
});