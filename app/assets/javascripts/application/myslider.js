(function ($) {
	//类
	var Slider = function () {
		this.o = {
			//静态
			items: 'ul',
			item: 'li',
			arrows: true,
			dots: true,
			prevButton: '◀️',
			nextButton: '▶️',
			//动态
			showcount: 4, //'auto' or number
			cachecount: false,
			autoplay: false,
			autospeed: 'slow',
			duration: 3000,
			loop: false,
			autosize: false,
			speed: 200,
			lazyload: false,
			easing: 'swing',
			itemsArray: [],
			renderer: '',
			mode: 'static',
			currentPage: 0,
			currentItem: 0,
			totalPage: 0,
			totalItem: 0,
		};
		this.init = function (el, o) {
			var that = this;
			this.o = $.extend(this.o, o);
			this.el = el;
			this.ul = $("<" + this.o.items + "></" + this.o.items + ">");
			this.ul.appendTo(el);
			this.li = this.ul.find(this.o.item);
			if (this.o.showcount === 'auto') {
				this.parentW = el.parent().width();
				this.leftArray = [];
			} else {
				this.parentW = parseInt(el.parent().width() / this.o.showcount) * this.o.showcount;
				this.liWidth = this.parentW / this.o.showcount;
			}
			this.ul.height('100%');

			//监听当前item
			this.el.on('slider:currentItem', slider_currentItem);
			//监听当前page
			this.el.on('slider:currentPage', slider_currentPage);
			//监听当前总page
			this.el.on('slider:totalPage', slider_totalPage);
			//监听当前总item
			this.el.on('slider:totalItem', slider_totalItem);
			//监听自动播放
			this.el.on('slider:autoplay', slider_autoplay);
			if(this.o.cachecount){
				this.o.cachecount --;
				this.set('totalItem',this.o.cachecount);
			}

			if (this.o.mode !== 'static') {
				setTimeout(function () {
					that.el.trigger('reachLastImage');
				}, 0);
			}

			if (this.o.autosize) {
				$(window).resize(slider_resize).resize();
			}
			this.set('autoplay', this.o.autoplay);

			if (this.o.arrows) {
				if (typeof (this.o.prev) === 'object') {
					//选择器
					this.o.prev.onclick(function () {
						this.prev();
					});
					this.o.next.onclick(function () {
						this.next();
					});
				} else {
					var html = '<div class="';
					html = html + 'arrows">' + html + 'arrow' + ' prev">' + that.o.prev + '</div>' + html + 'arrow' + ' next">' + that.o.next + '</div></div>';
					that.el.addClass('has-' + 'arrows').append(html).find('.arrow').click(function () {
						var me = $(this);
						if(me.hasClass('prev')){
							that.prev();
						}else{
							that.next();
						}
					});
				}
			}
			if (this.o.dots) {
				var totalPages = this.get('totalPage');
				var dots = $('<div class="dots"></div>');
				dots.appendTo(this.el);
				if (totalPages === 0|| !totalPages) {
					totalPages = 1;
				}
				//根据pages创建dots
				for (var i = 0; i < totalPages; i++) {
					if (i === this.o.currentPage) {
						$('<div class="dot active"></div>').css('left',i*20+'px').appendTo(dots);
					} else {
						$('<div class="dot"></div>').css('left',i*20+'px').appendTo(dots);
					}
					// $('.dot').eq(i).on('click',that.set('currentPage', i));
					$('.dot').eq(i).on('click',{value:i},dot_changePage);
				}
				//dots动态改变事件
				this.el.on('slider:checkdots', slider_dots);
			}
			//resize 函数
			function dot_changePage(e){
				that.set('currentPage',e.data.value);
				$('.dot').removeClass('active');
				$(e.target).addClass('active');
			}
			function slider_resize() {
				that.parentW = that.el.parent().width();
				that.liWidth = that.parentW / that.o.showcount;
				var sliderWidth = that.liWidth * that.o.showcount;
				if(that.r) clearTimeout(that.r);
				that.r = setTimeout(function () {
					var beforeSaveLiList = that.el.find(that.o.items).children(that.o.item);
					var beforeSaveWidth = that.el.find(that.o.items).children(that.o.item).eq(0).outerWidth();
					that.el.width(sliderWidth);
					that.el.find('li').outerWidth(that.liWidth);
					for (var i = 0; i < that.o.totalItem; i++) {
						if (that.getItem(i)) {
							that.getItem(i).css('left', i * that.liWidth);
						}
					}
					that.set('currentItem', that.o.currentItem);
				}, 50);
			}
			//事件
			function slider_dots(e, value) {
				var totalPages = that.get('totalPage');
				var currentPage = that.get('currentPage');
				var currentDots = $('.dot').length;
				if(that.showPage){
					$('.dots').empty();
					for(var j=0;j<that.showPage;j++){
						$('<div class="dot"></div>').css('left',j*20+'px').appendTo(dots);
						$('.dot').eq(j).on('click',{value:j},dot_changePage);
					}
					$('.dot').eq(0).addClass('active');
				}else{
					if (totalPages === 0) {
						totalPages++;
					}
					//根据pages,补充 删除 dots
					if(totalPages > currentDots){
						//如果小于当前页面
						for(var i=currentDots;i<totalPages;i++){
							$('<div class="dot"></div>').css('left',i*20+'px').appendTo(dots);
							$('.dot').eq(i).on('click',{value:i},dot_changePage);
						}
					}else{
						for(var k=totalPages;k<currentDots-1;k++){
							$('.dot').last().remove();
						}
					}
				}
				//当前页
				$('.dot').removeClass('active');
        if(!$('.dot').eq(currentPage).length){
          var dotLength = $('.dot').length;
          $('<div class="dot"></div>').css('left',dotLength*20+'px').appendTo(dots);
          $('.dot').eq(dotLength).on('click',{value:dotLength},dot_changePage);
        }
				$('.dot').eq(currentPage).addClass('active');
			}

			function slider_currentItem(e, value) {
				that.ul.animate({
					left: (that.o.showcount === 'auto')?that.leftArray[value]*-1:value * that.liWidth * -1
				}, that.o.speed, that.o.easing);
				that.o.currentItem = value;
        $('.dot')
          .removeClass('active')
          .eq(Math.floor(value/that.o.showcount)).addClass('active');
				return that.o.currentItem;
			}

			function slider_currentPage(e, value) {
				if (!value && value !== 0) {
					that.o.name = (that.o.showcount === 'auto')?Math.floor(parseInt(that.ul.css('left'))*-1/that.el.width()):Math.floor(that.o.currentItem / that.o.showcount);
				} else {
					if(that.o.showcount === 'auto'){
						var currentpage;
						$.each(that.leftArray,function(i){
							if(that.leftArray[i]>that.el.width()*value){
								currentpage = i;
							that.ul.animate({
								left: that.leftArray[currentpage-1]*-1
							}, that.o.speed, that.o.easing,function(){
								// that.o.currentPage = value-1;
								that.o.currentItem = currentpage-1;
							});
								return false;
							}
						});
					}else{
						//超出已经获得的数量4中情况
						var currentPageFirstItem = value*that.o.showcount;
						var currentPageLastItem = ( value+1) *that.o.showcount-1;
						var whichAjaxPage = [];
						//设置的当前页面在之后两种情况
						if(currentPageFirstItem > (that.o.currentItem + parseInt(that.o.showcount) -1)){
							whichAjaxPage[0] = Math.ceil(currentPageFirstItem/that.ajax);
							whichAjaxPage[1] = Math.ceil((currentPageLastItem+1)/that.ajax)-Math.ceil(currentPageFirstItem/that.ajax)+1;
						}
						if(currentPageFirstItem < (that.o.currentItem + that.o.showcount-1) && (currentPageFirstItem > that.o.currentItem) && (currentPageLastItem > (that.o.currentItem + that.o.showcount-1))){
							whichAjaxPage[0] = Math.ceil(currentPageFirstItem/that.ajax);
							whichAjaxPage[1] = Math.ceil((currentPageFirstItem - that.o.currentItem)/that.ajax);
						}
						if(currentPageLastItem < that.o.currentItem){
							whichAjaxPage[0] = Math.ceil(currentPageFirstItem/that.ajax);
							whichAjaxPage[1] = Math.ceil((currentPageLastItem+1)/that.ajax)-Math.ceil(currentPageFirstItem/that.ajax)+1;
						}
						if(!that.o.itemsArray[currentPageLastItem] || !that.o.itemsArray[currentPageFirstItem]){
							that.el.trigger('reachLastImage',whichAjaxPage);
						}else{
							if(that.o.cachecount){
								that.ul.empty();
								if(value === 0){
									that.addItems((value)*that.o.showcount,that.o.itemsArray.slice(value*that.o.showcount, value*that.o.showcount + that.o.cachecount+1));
								}else{
									that.addItems((value)*that.o.showcount,that.o.itemsArray.slice((value)*that.o.showcount, (value)*that.o.showcount + that.o.cachecount+1));
								}
							}
						}
					}
					that.ul.animate({
						left: value * that.o.showcount * that.liWidth * -1
					}, that.o.speed, that.o.easing,function(){
						that.o.currentItem = (value)*that.o.showcount;
						that.set('currentItem',that.o.currentItem);
					});
				}
			}

			function slider_totalPage(e, value) {
				if (!value) {
					that.o.name = Math.floor(parseInt(that.ul.find(that.o.item).eq(that.ul.find(that.o.item).length-1).css('left')) / that.el.width());
				} else {
					//当前有超过
					if ((value * that.o.showcount < (that.o.totalItem))) {
						if(that.o.showcount === 'auto'&& that.leftArray[that.leftArray.length - 1]>value*that.el.width()){
							if(parseInt(that.el.find(that.o.item).last().css('left')) > value*that.el.width()){
								var currentItem;
								$.each(that.leftArray,function(j) {
									if(that.leftArray[j]+that.el.width() > that.el.width()*value){
										currentItem = j;
										return false;
									}
								});
								that.set('currentItem', currentItem);
							}
							$.each(that.ul.find(that.o.item),function(k){
								if(parseInt(that.ul.find(that.o.item).eq(k).css('left'))>value*that.el.width()){
									that.ul.find(that.o.item).eq(k).remove();
								}
							});
						}else{
							//回到最后一个位置
							if (that.o.currentItem + that.o.showcount > value * that.o.showcount) {
								that.set('currentItem', (value - 1) * that.o.showcount);
							}
							for (var i = value * that.o.showcount; i < that.o.totalItem; i++) {
								that.getItem(value * that.o.showcount).remove();
							}
						}
					}
					//确保以后不会有超过发生
					that.showPage = value;
					that.el.trigger('slider:checkdots');
				}
			}

			function slider_totalItem(e, value) {
				if (!value) {
					that.o.name = that.o.itemsArray.length;
				} else {
					//当前有超过
					var liArray = that.el.find(that.o.item);
					var liArrayLastImageIndex =(that.o.showcount === 'auto')? that.leftArray.length -1 :parseInt(liArray.eq(liArray.length - 1).css('left')) / that.liWidth;
					if (value <= liArrayLastImageIndex) {
						if(that.o.showcount === 'auto'){
							//回到最后一个位置
							if (parseInt(liArray.eq(liArray.length-1).css('left'))>that.leftArray[value]) {
								var currentItem;
								$.each(that.leftArray,function(i) {
									if(that.leftArray[i]+that.el.width() > that.leftArray[value]){
										currentItem = i;
										return false;
									}
								});
								that.set('currentItem', currentItem);
							}
							for (var i = value; i <= liArrayLastImageIndex; i++) {
								that.getItem(value).remove();
							}
						}else{
							//回到最后一个位置
							if (that.o.currentItem + that.o.showcount > value) {
								that.set('currentItem', value - that.o.showcount);
							}
							for (var j = value; j <= liArrayLastImageIndex; j++) {
								that.getItem(value).remove();
							}
						}
					}
					//确保以后不会有超过发生
					that.el.on('slider:checkItem', function () {
						that.showItem = value;
					});
					that.el.trigger('slider:checkdots');
				}
			}

			function slider_autoplay(e, value) {
				if (value) {
					play();
					that.el.on('mouseover mouseout', function (e) {
						stop();
						if(e.type == 'mouseout')  play();
					});
				} else {
					stop();
				}
			}

			function play() {
				that.t = setInterval(function () {
					that.el.find('.next').trigger('click');
				}, that.o.duration | 0);
			}

			function stop() {
				that.t = clearInterval(that.t);
				return that;
			}
			return this;
		};
	};
	//api
	Slider.prototype = {
		get: function (name) {
			this.el.trigger('slider:' + name);
			return this.o.name;
		},
		set: function (name, value) {
			this.o.name = value;
			this.el.trigger('slider:' + name, value);
			return this.o.name;
		},
		next: function (count) {
			//currentItem值先改变
			this.o.currentItem += 1;
			if(this.o.cachecount){
				if(this.showPage){
						if ((this.o.currentItem > (this.showPage - 1) * this.o.showcount)) {
							if (this.o.loop) {
								this.o.currentItem = 0;
							} else {
								this.o.currentItem -= 1;
								return;
							}
						}
				}
				if(parseInt(this.el.find(this.o.item).eq(this.el.find(this.o.item).length - this.o.showcount).css('left')) <= parseInt(this.ul.css('left'))*-1 ){
					var creatImg = (this.o.renderer(this.o.itemsArray[this.o.currentItem + this.o.showcount -1 ]));
					this.el.find(this.o.item).first().empty().append(creatImg);
					this.el.find(this.o.item).first().css('left',(this.o.currentItem+this.o.showcount-1)*this.liWidth).appendTo(this.ul);
				}
			}else{
				this.el.trigger('slider:checkPage');
				if (this.showPage) {
					if(this.o.showcount === 'auto'){
						if(((this.leftArray[this.o.currentItem])>(this.showPage-1)*this.el.width())){
							if (this.o.loop) {
								this.o.currentItem = 0;
							} else {
								this.o.currentItem -= 1;
								return;
							}
						}
					}else{
						if ((this.o.currentItem > (this.showPage - 1) * this.o.showcount)) {
							if (this.o.loop) {
								this.o.currentItem = 0;
							} else {
								this.o.currentItem -= 1;
								return;
							}
						}
					}
				}
				this.el.trigger('slider:checkItem');
				if (this.showItem) {
					if(this.o.showcount === 'auto'){
						if(parseInt(this.ul.css('left'))*-1 > this.leftArray[this.showItem-1]-this.el.width()){
							if ((this.o.currentItem + this.o.showcount > this.showItem)){
								if (this.o.loop) {
									this.o.currentItem = 0;
								} else {
									this.o.currentItem -= 1;
									return;
								}
							}
						}
					}else{
						if ((this.o.currentItem + this.o.showcount > this.showItem)){
							if (this.o.loop) {
								this.o.currentItem = 0;
							} else {
								this.o.currentItem -= 1;
								return;
							}
						}
					}
				}
			}
			var that = this;
			//模式判断
			if (this.o.mode === 'static') {
				if (this.o.totalItem >= this.o.currentItem) {
					this.set(currentItem, this.o.currentItem);
				} else {
					this.o.currentItem = this.o.totalItem;
				}
			} else {
				if(this.o.showcount === 'auto'){
					if ((this.leftArray[this.leftArray.length-1]-this.leftArray[this.o.currentItem])>this.el.width()) {
						//已经接收到
						this.set('currentItem', this.o.currentItem);
					} else {
						this.el.trigger('reachLastImage',Math.ceil(this.get('currentPage')*this.o.showcount/this.ajax)+1);
					}
				}else{
					if (this.o.cachecount?this.o.itemsArray.length > this.o.currentItem + this.o.showcount:this.o.itemsArray.length > this.o.currentItem + this.o.showcount-1) {
						//已经接收到
						this.set('currentItem', this.o.currentItem);
					} else {
						this.el.trigger('reachLastImage',[Math.ceil(this.get('totalPage')*parseInt(this.o.showcount)/this.ajax)+1,1]);
						this.set('currentItem', this.o.currentItem);
					}
				}
			}
			that.el.trigger('slider:checkdots');
		},
		prev: function (count) {
			this.o.currentItem -= 1;
			if(this.o.cachecount){
				if(parseInt(this.el.find(this.o.item).eq(1).css('left')) >= parseInt(this.ul.css('left'))*-1 ){
					if(this.o.currentItem <= 0){
						this.set('currentItem',0);
						return;
					}
					var creatImg = (this.o.renderer(this.o.itemsArray[this.o.currentItem - 1 ]));
					this.el.find(this.o.item).last().empty().append(creatImg);
					this.el.find(this.o.item).last().css('left',(this.o.currentItem-1)*this.liWidth).prependTo(this.ul);
				}
			}else{
				if (this.o.loop) {
					this.el.trigger('slider:checkItem');
					if (this.showItem) {
						if (this.o.currentItem < 0) {
							this.o.currentItem = this.showItem - this.o.showcount;
						}
					}
					this.el.trigger('slider:checkPage');
					if (this.showPage) {
						if (this.o.currentItem < 0) {
							this.o.currentItem = (this.showPage - 1) * this.o.showcount;
						}
					}
				} else {
					if (this.o.currentItem < 0) {
						this.o.currentItem = 0;
						return;
					}
				}
			}
			if (this.o.mode === 'static') {
				if (this.o.currentItem < 0) {
					this.set('currentItem', this.o.currentItem);
				}
			} else {
				if (this.o.cachecount) {
					// this.addItems(this.o.currentItem, this.o.itemsArray.slice(this.o.currentItem, this.o.currentItem + 1));
				}
				this.set('currentItem', this.o.currentItem);
			}
			this.el.trigger('slider:checkdots');
		},
		addItems: function (index, array) {
			var that = this;
			if (array.length === 0) {
				//没有远程数据
				this.o.currentItem--;
				return;
			}
			if(that.getItem(index)&&!that.o.cachecount){
				//currentItem
				that.set('currentItem',that.o.currentItem+array.length);
				//挪后
				for(var j = index;j<that.ul.find(that.o.item).length+index;j++){
					if(that.getItem(j)){
						var changeLeft = parseInt(that.getItem(j).css('left')) + array.length*that.liWidth+'px';
						that.getItem(j).css('left',changeLeft);
					}
				}
			}
			$.each(array, function (i) {
				var creatImg = $("<" + that.o.item + "></" + that.o.item + ">");
				creatImg.append(that.o.renderer(array[i]));
				if (that.o.lazyload) {
					var lazyBox = $('<div class="lazyload"><div class="lazyload_inner"></div></div>');
					$('.lazyload').outerWidth(that.liWidth?that.liWidth:that.el.width()/4);
					lazyBox.appendTo(that.ul);
					lazyBox.css('left', that.getPositionLeft(index + i));
					creatImg.ready(function () {
						setTimeout(function () {
							if(!that.o.cachecount || (that.o.cachecount && (i <= that.o.cachecount))){
								//初始添加
								if(that.getItem(index + i-1)){
									creatImg.insertAfter(that.getItem(index + i-1));
								}else{
									creatImg.appendTo(that.ul);
								}
							}
							if(index+i === that.o.itemsArray.length){
								that.o.itemsArray.push(array[i]);
							}else{
								if(!that.o.itemsArray[index+i]){
									that.o.itemsArray[index+i] = array[i];
								}
							}
							creatImg.css('left', that.getPositionLeft(index + i));
							creatImg.outerWidth(that.liWidth);
							lazyBox.remove();
						}, 1000);
					});
				} else {
					if(!that.o.cachecount || (that.o.cachecount && (that.el.find(that.o.item).length <= that.o.cachecount))){
						//初始添加
						if(that.getItem(index + i-1)){
							creatImg.insertAfter(that.getItem(index + i-1));
						}else{
							creatImg.appendTo(that.ul);
						}
					}
					if(index+i >= that.o.itemsArray.length){
						that.o.itemsArray.push(array[i]);
					}else{
						if(!that.o.cachecount){
							var firstArray = that.o.itemsArray.splice(0,index);
							//数据改变
							that.o.itemsArray=$.merge($.merge(firstArray, array),that.o.itemsArray);
						}
					}
					creatImg.css('left', that.getPositionLeft(index + i));
					creatImg.outerWidth(that.liWidth);
				}

				that.o.totalItem++;
			});
		},
		removeItem: function (index) {
			var removeitemWidth = this.getItem(index).outerWidth();
			this.o.itemsArray.splice(index, 1);
			this.o.currentItem--;
			var that = this;
			//挪前
			$.each(this.ul.find(that.o.item), function (i) {
				if (parseInt(that.ul.find(that.o.item).eq(i).css('left')) >= parseInt(that.getItem(index).css('left'))) {
					var changeLeft = parseInt(that.ul.find(that.o.item).eq(i).css('left')) - removeitemWidth;
					that.ul.find(that.o.item).eq(i).css('left', changeLeft + 'px');
				}
			});
			this.getItem(index).remove();
		},
		//显示的items中
		getItem: function (index) {
			var that = this;
			var showedFirstItem, showedEndItem;
			if (this.o.showcount !== 'auto') {
				$.each(this.el.find('li'),function(i) {
					if(parseInt(that.el.find('li').eq(i).css('left')) === index*that.liWidth){
						return that.el.find('li').eq(i);
					}
				});
			}else{
				$.each(that.leftArray,function(i) {
					if(that.leftArray[i] == parseInt(that.el.find('li').eq(0).css('left'))){
						showedFirstItem = i;
						return false;
					}
				});
			}
			showedEndItem = this.el.find('li').length - 1 + showedFirstItem;
			if (showedFirstItem <= index && index <= showedEndItem) {
				return this.el.find('li').eq(showedFirstItem + index);
			}
		},
		getPositionLeft: function (index) {
			var that =this;
			if (this.o.showcount !== 'auto') {
				return index * this.liWidth;
			} else {
				if(!this.leftArray[index]){
					if(that.el.find('img').eq(index).width()){
						that.leftArray[index] = that.el.find('img').eq(index).width()*index;
					}else{
						return this.el.width()/4*index;
					}
				}
				return this.leftArray[index];
			}
		}


	};

	//jquery plugin
	$.fn.slider = function (o) {
		if (this.data('key')) {
			var mecontrol = this.data('key');
			return mecontrol;
		} else {
			return this.each(function (index) {
				var me = $(this);
				var instance = new Slider();
				me.data('key', instance.init(me, o));
			});
		}
	};
})(window.jQuery);