(function ($) {
	$.fn.slider = function (options) {
		var $that = $(this);
		var defaults = {
			imageindex: 0,
			number: 4,
			gundong: 1,
			savenumber: null,
			items: '>ul',
			item: '>li',
			autoplay: true,
			loop: false,
			autochange: true,
			duration: 3000,
			arrows: true,
			prev: '&larr;',
			next: '&rarr;',
			speed: 500,
			autospeed: 'slow',
			array: [],
			cache: [],
			easing: 'swing',
			lazyload: true,
			loading: 'loading.gif',
			fadeIn: false,
			romoteArray:''
		};
		options = $.extend(defaults, options);
		$el = $that;
		$ul = $that.find(options.items);
		$li = $ul.find(options.item);
		this.each(function () {
			init = function () {
				//  信息合并
				$parentW = Math.floor(parseInt($el.parent().css('width')) / options.number) * options.number;
				$liWidth = $parentW / options.number;
				//  当前图片index
				$that.i = 0;
				//已加载图片的最大index
				$that.maxI = options.number;
				//初始加赞图片
				options.array = options.romoteArray.slice($that.i, $that.i + options.number);
				if (options.lazyload) {
					for (var i = 0; i < options.number; i++) {
						addImage(options.array, 'right', $that.i);
						$that.i++;
					}
				} else {
					for (var j = 0; j < options.number; j++) {
						$("<li style='left:" + $that.i * $liWidth + 'px' + "'><img src=" + options.array[0] + " style='width:" + $liWidth + ";'></li>").appendTo($ul);
						$that.i++;
						//清空数组
						options.array.shift();
					}
				}
				//高度
				$ul.height('100%');
				//  Autoslide
				options.autoplay && setTimeout(function () {
					if (options.duration | 0) {
						if (options.autoplay) {
							_.play();
						}
						$el.on('mouseover mouseout', function (e) {
							_.stop();
							options.autoplay && e.type == 'mouseout' && _.play();
						});
					}
				}, 0);
				//  Dot pagination
				options.dots && nav('dot');
				//  Arrows support
				if (options.arrows) {
					nav('arrow');
				}
				//  Patch for fluid-width sliders. Screw those guys.
				if (options.autochange) {
					$(window).resize(function () {
            clearInterval($that.protectTime);
						var sliderWidth = $liWidth * options.number;
						$that.r && clearTimeout($that.r) && clearTimeout($that.protectTime);
						$that.r = setTimeout(function () {
							var beforeSaveLiList = $el.find(options.items).children('li');
							var beforeSaveWidth = parseInt($el.find(options.items).children('li').eq(0).outerWidth());
							$el.width(sliderWidth);
							$el.find('img').width(sliderWidth / options.number);
							var liWidth = beforeSaveLiList.eq(0).outerWidth();
							for (var i = 0; i < beforeSaveLiList.length; i++) {
								// var beforeIndex = Math.floor(parseInt(beforeSaveLiList.eq(i).css('left')) / beforeSaveWidth);
								if($that.i === $that.maxI){
									beforeSaveLiList.eq(i).css('left', liWidth * ($that.i - beforeSaveLiList.length + i));
								}else if($that.maxI-options.savenumber > $that.i){
									beforeSaveLiList.eq(i).css('left', liWidth * ($that.i - beforeSaveLiList.length +options.savenumber+ i ));
								}else{
									beforeSaveLiList.eq(i).css('left', liWidth * ($that.maxI - beforeSaveLiList.length + i));
								}
							}
							$el.find(options.items).css('left', (options.number - $that.i) * liWidth);
						}, 50);
					}).resize();
				}
				// $el.hover(function () {
				// 	 Stuff to do when the mouse enters the element 
				// 	clearInterval($that.protectTime);
				// }, function () {
          setInterval(
            function(){
            protect();
            }
            ,50);
				// });
				return $that;
			}();

			function getArray(from, to) {
				if (to <= $that.maxI) {
					if (options.cache[from] == null || undefined) {
						options.array = [];
					} else {
						options.array[0] = options.cache[from];
					}
				} else {
					options.array = options.romoteArray.slice(from, to);
				}
				return options.array;
			}

			function addImage(array, direction, index) {
				if (array.length === 0) {
					return;
				}
				//lazyload support
				if (options.lazyload) {
					lazyload(array, direction, index);
				} else {
					// if (array[0] === '' || !array[0]) {array.shift();}
					$("<li style='left:" + ($that.i - 1) * $liWidth + 'px' + "'><img src=" + array[0] + " style='width:" + $liWidth + ";'></li>").appendTo(_.ul);
					array.shift();
				}
			}

			function lazyload(array, direction, index) {
				var creatImg = $("<li style='left:" + index * $liWidth + 'px' + "'><img src=" + options.loading + " style='height:100%;width:" + $liWidth + ";'></li>");
				if (direction === 'left') {
					creatImg = $("<li style='left:" + (index - options.number - 1) * $liWidth + 'px' + "'><img src=" + options.loading + " style='width:" + $liWidth + ";'></li>");
					creatImg.prependTo($ul);
				} else {
					creatImg.appendTo($ul);
				}
				var tmpimg = $("<img src=" + array[0] + ">");
				tmpimg.ready(function () {
					setTimeout(function () {
						//fadeIn
						if (options.fadeIn) {
							creatImg.find('img').attr('src', tmpimg.attr('src')).hide().fadeIn('slow');
						} else {
							creatImg.find('img').attr('src', tmpimg.attr('src'));
						}
					}, 1000);
				});
				array.shift();
			}

			function nav(name, html) {
				if (name == 'dot') {
					html = '<ol class="dots">';
					$.each($li, function (index) {
						html += '<li class="' + (index == $that.i ? name + ' active' : name) + '">' + ++index + '</li>';
					});
					html += '</ol>';
				} else {
					html = '<div class="';
					html = html + name + 's">' + html + name + ' prev">' + options.prev + '</div>' + html + name + ' next">' + options.next + '</div></div>';
				}

				$el.addClass('has-' + name + 's').append(html).find('.' + name).click(function () {
					var me = $(this);
					me.hasClass('dot') ? stop().to(me.index()) : me.hasClass('prev') ? prev() : next();
				});
			}

			function stop() {
				$that.t = clearInterval($that.t);
				return $that;
			}
			function play() {
				$that.t = setInterval(function () {
					to($that.i + 1);
				}, options.duration | 0);
			}

			function protect() {
				if (options.savenumber) {
					$that.protectTime = setTimeout(
						function () {
							protectMemory();
						}, 1000);
				}
			}

			function protectMemory() {
				var protectededFirst = $that.i - (options.number + options.savenumber);
				var protectededLast = $that.i + options.savenumber - 1;
				//限制修正这两个index
				protectededFirst = (protectededFirst < 0) ? 0 : protectededFirst;
				protectededLast = (protectededLast > $that.maxI) ? $that.maxI : protectededLast;
				var currentLiList = $el.find(options.items).children('li');
				var liEachWidth = $liWidth;
				//删除其他图片
				for (var i = 0; i < currentLiList.length; i++) {
					var liEachLeft = parseInt(currentLiList.eq(i).css('left'));
					var eachImageIndex = liEachLeft / liEachWidth;
					if (eachImageIndex < protectededFirst || eachImageIndex > protectededLast) {
						//保存数据
						options.cache[eachImageIndex] = currentLiList.eq(i).find('img').attr('src');
						currentLiList.eq(i).remove();
					}
				}
			}
			function next() {
				if (options.romoteArray.length === $that.i) return;
				$that.i++;
				getArray($that.i - 1, $that.i);
				//判断要添加的图片是否不存在
				var lastImageLeft = parseInt($el.find(options.items).children('li').last().css('left'));
				var width = $liWidth;
				var lastImageIndex = lastImageLeft / width - 1;
				if ($that.i > lastImageIndex) {
					addImage(options.array, 'right', $that.i - 1);
				}
				$that.stop();
				return to($that.i);
			}

			function prev() {
        if ($that.i === options.number) return;
				$that.i--;
				if (options.number === $that.i + 1) return;
				if (options.savenumber) {
					var firstImageLeft = parseInt($el.find(options.items).children('li').first().css('left'));
					var width = $liWidth;
					var firstImageIndex = firstImageLeft / width;
					getArray($that.i - options.number, $that.i - options.number + 1);
					//判断要添加的图片是否不存在
					if ($that.i - options.number < firstImageIndex) {
						addImage(options.array, 'left', $that.i + 1);
					}
				}
				$that.stop();
				return to($that.i);
			}

			function to(index, callback) {
				console.log(index);
				if ($that.t) {
					stop();
					play();
				}
				var o = options,
					el = $el,
					ul = $ul,
					li = $li,
					current = $that.i,
					target = options.romoteArray[index];
				//  slider到达边缘条件
				if ((options.romoteArray.length + 1 === $that.i) && options.loop === false) {
					$that.i = index;
					return;
				}
				if (index < options.number && options.loop === false) {
					$that.i = options.number;
					return;
				}

				var speed = callback ? 5 : options.speed | 0,
					easing = options.easing,
					obj = {};

				if (!ul.queue('fx').length) {
									console.log($liWidth);
					el.animate(obj, speed, easing) && ul.animate($.extend({
						left: (options.number - index) * $liWidth
					}, obj), speed, easing, function (data) {
						$that.maxI = (index > $that.maxI) ? index : $that.maxI;
					});
				}
			}
		});
	};
})(jQuery);
