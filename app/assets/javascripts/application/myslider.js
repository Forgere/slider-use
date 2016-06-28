(function($){
	//类
	var Slider = function(){
		this.o = {
			//静态
			items:'ul',
			item:'li',
			arrows:true,
			dots:true,
			prevButton:'◀️',
			nextButton:'▶️',
			//动态
			showcount: 4,
			cachecount: 2,
			autoplay: false,
			autospeed:'slow',
			duration:3000,
			loop:false,
			autosize:false,
			speed:200,
			lazyload:false,
			easing:'swing',
			itemsArray:'',
			renderer:'',
			mode:'static',
			currentpage:0,
			currentitem:0,
			totalpage:0,
			totalitem:0,
		};
	};
	//api
	Slider.fn = {
		get:function(name){

		},
		set:function(name,value){

		},
		next:function(count){

		},
		prev:function(count){
			
		},
		add:function(index,array){

		},
		removeitem:function(index){

		},
		getitem:function(index){

		}

	};
	//jquery plugin
	$.fn.slider = function(){
    return this.each(function (index) {
      //  Cache a copy of $(this), so it
      var me = $(this),
        	instance = (new Slider).init(me, o);
      // Invoke an Unslider instance
      me.data('key', instance);
    });
	};
})(window.jQuery);