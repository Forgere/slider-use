$(function () {
	pageId= 0;api = 'http://localhost:3000/uploads.json?page_id=';
	// $(window).resize(function(event) {
	// 	console.log(1);
	// });
	$('#slider1').width('980px');
	var weinr = $('#slider1 .slider1').slider2({
		showaccount: 4, //图数量
		savenumber: 2, //显示前后保存的数据
		render: renderer,
		dynamicLoading : true
	});
	//控制器
	var weinrcontrol = weinr.data('key');
	//到最后一个是触发ajax获取数据
	weinr.on('reachLastImage',function(e){
		pageId++;
    $.ajax({
        url: api+pageId,
        type: 'GET',
        dataType: 'json',
        success:function(result){
        	//传入结果
        	weinrcontrol.o.romoteData = result;
			  	//等待传入结果
			    setTimeout(function(){
			      $.each(weinrcontrol.o.romoteData,function(i) {
			      	//保存数据
			        weinrcontrol.o.romoteArray.push(weinrcontrol.o.romoteData[i]);
			      });
			      if(weinr.find('li').length === 0){
			        if(weinrcontrol.o.romoteArray){
			          //初始加赞图片，在保存的数据中去除需要的数据
			          weinrcontrol.o.array = weinrcontrol.o.romoteArray.slice(weinrcontrol.i, weinrcontrol.i + weinrcontrol.o.showaccount);
			          for (var i = 0; i < weinrcontrol.o.showaccount; i++) {
			          	//讲数据用render函数 转化为dom 并添加
			            weinrcontrol.addImage(weinrcontrol.o.array, 'right', weinrcontrol.i,weinrcontrol.o.innerHTML);
			            //image index更新
			            weinrcontrol.i++;
			          }
			        }
			      }
			    },300);
        }
    });
	});
	function renderer(data){
		var address = "http://"+window.location.host+data.img.url+"/thumb";
		return $('<a><img src='+address+'></a>');
	}
});