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
			cachepage: 1,
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
						me.hasClass('dot') ? that.stop().to(me.index()) : me.hasClass('prev') ? that.prev() : that.next();
					});
				}
			}
			if (this.o.dots) {
				var totalPages = this.get('totalPage');
				var dots = $('<div class="dots"></div>');
				dots.appendTo(this.el);
				if (totalPages === 0) {
					totalPages++;
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
				that.r && clearTimeout(that.r);
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
				if (totalPages === 0) {
					totalPages++;
				}
				//根据pages,补充 删除 dots
				if(totalPages > currentDots){
					for(var i=currentDots;i<totalPages;i++){
						$('<div class="dot"></div>').css('left',i*20+'px').appendTo(dots);
						$('.dot').eq(i).on('click',{value:i},dot_changePage);
					}
				}else{
					for(var j=totalPages;j<currentDots;j++){
						$('.dot').eq(j).remove();
					}
				}
				//当前页
				$('.dot').removeClass('active');
				$('.dot').eq(currentPage).addClass('active');

			}

			function slider_currentItem(e, value) {
				that.ul.animate({
					left: value * that.liWidth * -1
				}, that.o.speed, that.o.easing);
				that.o.currentItem = value;
				return that.o.currentItem;
			}

			function slider_currentPage(e, value) {
				if (!value && value !== 0) {
					that.o.name = Math.floor(that.o.currentItem / that.o.showcount);
				} else {
					that.ul.animate({
						left: value * that.o.showcount * that.liWidth * -1
					}, that.o.speed, that.o.easing,function(){
						// that.o.currentPage = value-1;
						that.o.currentItem = (value)*that.o.showcount;
					});
				}
			}

			function slider_totalPage(e, value) {
				if (!value) {
					that.o.name = Math.floor(that.o.itemsArray.length / that.o.showcount);
				} else {
					//当前有超过
					if (value * that.o.showcount < (that.o.totalItem)) {
						//回到最后一个位置
						if (that.o.currentItem + that.o.showcount > value * that.o.showcount) {
							that.set('currentItem', (value - 1) * that.o.showcount);
						}
						for (var i = value * that.o.showcount; i < that.o.totalItem; i++) {
							that.getItem(value * that.o.showcount).remove();
						}
					}
					//确保以后不会有超过发生
					that.el.on('slider:checkPage', function () {
						that.showPage = value;
					});
				}
			}

			function slider_totalItem(e, value) {
				if (!value) {
					that.o.name = that.o.itemsArray.length;
				} else {
					//当前有超过
					var liArray = that.el.find(that.o.item);
					var liArrayLastImageIndex = parseInt(liArray.eq(liArray.length - 1).css('left')) / that.liWidth;
					if (value <= liArrayLastImageIndex) {
						//回到最后一个位置
						if (that.o.currentItem + that.o.showcount > value) {
							that.set('currentItem', value - that.o.showcount);
						}
						for (var i = value; i <= liArrayLastImageIndex; i++) {
							that.getItem(value).remove();
						}
					}
					//确保以后不会有超过发生
					that.el.on('slider:checkItem', function () {
						that.showItem = value;
					});
				}
			}

			function slider_autoplay(e, value) {
				if (value) {
					play();
					that.el.on('mouseover mouseout', function (e) {
						stop();
						e.type == 'mouseout' && play();
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
			this.el.trigger('slider:checkPage');
			if (this.showPage) {
				if (this.o.currentItem > (this.showPage - 1) * this.o.showcount) {
					if (this.o.loop) {
						this.o.currentItem = 0;
					} else {
						this.o.currentItem -= 1;
						return;
					}
				}
			}
			this.el.trigger('slider:checkItem');
			if (this.showItem) {
				if (this.o.currentItem + this.o.showcount > this.showItem) {
					if (this.o.loop) {
						this.o.currentItem = 0;
					} else {
						this.o.currentItem -= 1;
						return;
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
				if (this.o.itemsArray.length > this.o.currentItem + this.o.showcount - 1) {
					//已经接收到
					if (this.o.cachepage) {}
					this.set('currentItem', this.o.currentItem);
				} else {
					this.el.trigger('reachLastImage');
				}
			}
			that.el.trigger('slider:checkdots');
		},
		prev: function (count) {
			this.o.currentItem -= 1;
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
			if (this.o.mode === 'static') {
				if (this.o.currentItem < 0) {
					this.set('currentItem', this.o.currentItem);
				}
			} else {
				if (this.o.cachepage) {
					this.addItems(this.o.currentItem, this.o.itemsArray.slice(this.o.currentItem, this.o.currentItem + 1));
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
			if(that.getItem(index)){
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
					$('.lazyload').outerWidth(that.liWidth);
					lazyBox.appendTo(that.ul);
					lazyBox.css('left', that.getPositionLeft(index + i));
					creatImg.ready(function () {
						setTimeout(function () {
							//初始添加
							if(that.getItem(index + i-1)){
								creatImg.insertAfter(that.getItem(index + i-1));
							}else{
								creatImg.appendTo(that.ul);
							}
							that.o.itemsArray.push(array[i]);
							creatImg.css('left', that.getPositionLeft(index + i));
							creatImg.outerWidth(that.liWidth);
							lazyBox.remove();
						}, 1000);
					});
				} else {
					//初始添加
					if(that.getItem(index + i-1)){
						creatImg.insertAfter(that.getItem(index + i-1));
					}else{
						creatImg.appendTo(that.ul);
					}
					if(index+i === that.o.itemsArray.length){
						that.o.itemsArray.push(array[i]);
					}else{
						var firstArray = that.o.itemsArray.splice(0,index);
						//数据改变
						that.o.itemsArray=$.merge($.merge(firstArray, array),that.o.itemsArray);
					}
					creatImg.css('left', that.getPositionLeft(index + i));
					creatImg.outerWidth(that.liWidth);
				}
				that.o.totalItem++;
			});
			this.set('currentItem', this.o.currentItem);
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
			var showedFirstItem, showedEndItem;
			if (this.o.showcount !== 'auto') {
				showedFirstItem = parseInt(this.el.find('li').eq(0).css('left')) / this.liWidth;
				showedEndItem = this.el.find('li').length - 1 + showedFirstItem;
				if (showedFirstItem <= index && index <= showedEndItem) {
					return this.el.find('li').eq(showedFirstItem + index);
				}
			}
		},
		getPositionLeft: function (index) {
			if (this.o.showcount !== 'auto') {
				return index * this.liWidth;
			} else {

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