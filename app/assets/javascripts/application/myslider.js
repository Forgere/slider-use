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
			cachepage: 1,
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
		this.init = function (el , o) {
      this.o = $.extend(this.o, o);
      this.el = el;
      this.ul = $("<"+this.o.items+"></"+this.o.items+">");
      this.ul.appendTo(el);
      this.li = this.ul.find(this.o.item);
		};
		function getPositionLeft(index){
			
		}
		function creatImg (argument) {
			var creatImg = $("<"+that.o.item+"></"+that.o.item+">");
	    creatImg.append(that.o.renderer(that.o.itemsArray[argument]));
	    if(this.getitem(argument-1)){
	    	creatImg.insertAfter(this.getitem(argument-1));
	    	this.o.itemsArray.insertAfter(this.getitem(argument-1));
	    }else{
	    	creatImg.insertBefore(this.getitem(argument+1));
	    	this.o.itemsArray.insertBefore(this.getitem(argument+1));
	    }
			creatImg.css('left', getPositionLeft(argument));
			//挪后
			$.each(this.li,function(i) {
				if(this.li[i].offset().left >= getPositionLeft(argument)){
					this.li[i].offset().left += creatImg.outerWidth();
				}
			});
		}
	};
	//api
	Slider.fn = {
		get:function(name){
			return this.o.name;
		},
		set:function(name,value){
			this.o.name = value;
			this.el.trigger('"on"+'+name+'+"change"');
		},
		next:function(count){
			//currentitem值先改变
			this.o.currentitem += 1;
			//模式判断
			if(this.o.mode === 'static'){
				if(this.o.totalitem >= this.o.currentitem){
					this.set(currentitem,this.o.currentitem);
				}else{
					this.o.currentitem = this.o.totalitem;
				}
			}else{
				if(this.o.itemsArray.length >= this.o.currentitem){
					//已经接收到
					if (this.o.cachepage) {
						this.additem(this.o.currentitem,this.o.itemsArray.slice(this.o.currentitem, this.o.currentitem + 1));
					}
					this.set(currentitem,this.o.currentitem);
				}else{
					this.el.trigger('reachLastImage');
				}
			}
		},
		prev:function(count){
			this.o.currentitem -= 1;
			if(this.o.mode === 'static'){
				if(this.o.currentitem < 0){
					this.o.currentitem = 0;
					return;
				}else{
					this.set(currentitem,this.o.currentitem);
				}
			}else{
				if (this.o.cachepage) {
					this.additem(this.o.currentitem,this.o.itemsArray.slice(this.o.currentitem, this.o.currentitem + 1));
				}
				this.set(currentitem,this.o.currentitem);
			}
		},
		additem:function(index,array){
			var that = this;
			$.each(array,function(i) {
				creatImg(index+i);
			});
		},
		removeitem:function(index){
			var removeitemWidth = this.getitem(index).outerWidth();
			this.getitem(index).remove();
			this.o.itemsArray[index].remove();
			//挪前
			$.each(this.li,function(i) {
				if(this.li[i].offset().left > getPositionLeft(index)){
					this.li[i].offset().left -= removeitemWidth;
				}
			});
		},
		//显示的items中
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