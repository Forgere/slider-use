(function ($) {
  var Slider = function () {
    that = this;
    //  默认参数
    this.o = {
      number: 4,              //显示都少图片
      savenumber: null,       //前后保存数量
      items: '>ul',           //容器子元素
      item: '>li',            //容器孙元素
      autoplay: false,        //自动滚动
      loop: false,            //无线滚动
      autochange: false,      //适应屏幕
      duration: 3000,         //间隔
      arrows: true,           //箭头
      prev: '&larr;',
      next: '&rarr;',
      speed: 200,             //滚动速度
      autospeed: 'slow',      //自动滚动速度
      array: [],              //添加图片使用的数组
      cache: [],              //缓存图片地址数组
      easing: 'swing',        //animate数组
      lazyload: true,         //lazyload
      loading: '',            //lazy图片
      fadeIn: false,          //fadeIN效果
      romoteArray: '',        //动态加入图片
      ajaxcallback: false
    };

    this.init = function (el, o) {
      //  信息合并
      this.o = $.extend(this.o, o);
      this.el = el;
      this.ul = el.find(this.o.items);
      this.li = this.ul.find(this.o.item);
      this.parentW = Math.floor(parseInt(el.parent().css('width')) / this.o.number) * this.o.number;
      this.liWidth = this.parentW / this.o.number;
      //  当前图片index
      this.i = 0;
      //已加载图片的最大index
      this.maxI = this.o.number;
      if(this.o.romoteArray){
        //初始加赞图片
        this.o.array = this.o.romoteArray.slice(this.i, this.i + this.o.number);
        for (var i = 0; i < this.o.number; i++) {
          this.addImage(this.o.array, 'right', this.i);
          this.i++;
        }
      }
      //高度
      this.ul.height('100%');
      //  Autoslide
      this.o.autoplay && setTimeout(function () {
        if (that.o.duration | 0) {
          if (that.o.autoplay) {
            that.play();
          }
          that.el.on('mouseover mouseout', function (e) {
            that.stop();
            that.o.autoplay && e.type == 'mouseout' && that.play();
          });
        }
      }, 0);
      //  Dot pagination
      this.o.dots && nav('dot');

      //  Arrows support
      if (this.o.arrows) {
        nav('arrow');
      }
      //  Patch for fluid-width sliders. Screw those guys.
      if (this.o.autochange) {
        $(window).resize(function () {
          var sliderWidth = this.liWidth * this.o.number;
          this.r && clearTimeout(this.r) && clearTimeout(this.protectTime);
          this.r = setTimeout(function () {
            var beforeSaveLiList = this.el.find(this.o.items).children('li');
            var beforeSaveWidth = parseInt(this.el.find(this.o.items).children('li').eq(0).outerWidth());
            this.el.width(sliderWidth);
            this.el.find('img').width(sliderWidth / this.o.number);
            var liWidth = beforeSaveLiList.eq(0).outerWidth();
            for (var i = 0; i < beforeSaveLiList.length; i++) {
              if (this.i === this.maxI) {
                beforeSaveLiList.eq(i).css('left', liWidth * (this.i - beforeSaveLiList.length + i));
              } else if (this.maxI - this.o.savenumber > this.i) {
                beforeSaveLiList.eq(i).css('left', liWidth * (parseInt(beforeSaveLiList.eq(beforeSaveLiList.length - 1).css('left')) / this.liWidth + 1 - beforeSaveLiList.length + i));
              } else if (this.o.savenumber > this.maxI - this.i) {
                beforeSaveLiList.eq(i).css('left', liWidth * (this.maxI - beforeSaveLiList.length + i));
              }
            }
            this.el.find(this.o.items).css('left', (this.o.number - this.i) * liWidth);
          }, 50);
        }).resize();
      }
      setInterval(
        function () {
          that.protect();
        }, 1000);
      return this;
    };
    //basic ///////////////////////////////////////////////////
    //  根据this.i移动ul
    this.to = function (index, callback) {
      if (this.t) {
        this.stop();
        this.play();
      }
      var o = this.o,
        el = this.el,
        ul = this.ul,
        li = this.li,
        current = this.i;
      //  slider到达边缘条件
      if ((this.o.romoteArray.length + 1 === this.i) && o.loop === false) {
        this.i = index;
        return;
      }
      if (index < this.o.number && o.loop === false) {
        this.i = this.o.number;
        return;
      }

      var speed = callback ? 5 : o.speed | 0,
        easing = o.easing,
        obj = {};

      if (!ul.queue('fx').length) {
        el.animate(obj, speed, easing) && ul.animate($.extend({
          left: (this.o.number - index) * this.liWidth
        }, obj), speed, easing, function (data) {
          that.maxI = (index > that.maxI) ? index : that.maxI;
        });
      }
    };

    //  自动增加index
    this.play = function () {
      that.t = setInterval(function () {
        that.next(that.o.ajaxcallback);
      }, that.o.duration | 0);
    };

    //  Stop
    this.stop = function () {
      that.t = clearInterval(that.t);
      return that;
    };

    //  右箭头
    this.next = function (callback) {
      if(this.ul.queue('fx').length)return;
      if (this.o.romoteArray.length === this.i) return;
      if (this.o.romoteArray.length - 1 === this.i){
        //到底 外获取
        $.isFunction(callback) && callback();
      }
      this.i++;
      this.getArray(this.i - 1, this.i);
      //判断要添加的图片是否不存在
      var lastImageLeft = parseInt(this.el.find(this.o.items).children('li').last().css('left'));
      var width = Math.floor(parseInt(this.el.parent().css('width')) / this.o.number);
      var lastImageIndex = lastImageLeft / width - 1;
      if (this.i > lastImageIndex) {
        this.addImage(this.o.array, 'right', this.i - 1);
      }
      return this.stop().to(this.i);
    };
    //  左箭头
    this.prev = function () {
      this.i--;
      if (this.o.number === this.i + 1) return;
      if (this.o.savenumber) {
        var firstImageLeft = parseInt(this.el.find(this.o.items).children('li').first().css('left'));
        var width = Math.floor(parseInt(this.el.parent().css('width')) / this.o.number);
        var firstImageIndex = firstImageLeft / width;
        this.getArray(this.i - this.o.number, this.i - this.o.number + 1);
        //判断要添加的图片是否不存在
        if (this.i - this.o.number < firstImageIndex) {
          this.addImage(this.o.array, 'left', this.i + 1);
        }
      }
      return this.stop().to(this.i);
    };
    //  Create dots and arrows
    function nav(name, html) {
      if (name == 'dot') {
        html = '<ol class="dots">';
        $.each(this.li, function (index) {
          html += '<li class="' + (index == this.i ? name + ' active' : name) + '">' + ++index + '</li>';
        });
        html += '</ol>';
      } else {
        html = '<div class="';
        html = html + name + 's">' + html + name + ' prev">' + that.o.prev + '</div>' + html + name + ' next">' + that.o.next + '</div></div>';
      }

      that.el.addClass('has-' + name + 's').append(html).find('.' + name).click(function () {
        var me = $(this);
        me.hasClass('dot') ? that.stop().to(me.index()) : me.hasClass('prev') ? that.prev() : that.next(that.o.ajaxcallback);
      });
    }
    this.getArray = function (from, to) {
      if (to <= this.maxI) {
        if (this.o.cache[from] == null || undefined) {
          this.o.array = [];
        } else {
          this.o.array[0] = this.o.cache[from];
        }
      } else {
        this.o.array = this.o.romoteArray.slice(from, to);
      }
      return this.o.array;
    },
    this.addImage = function (array, direction, index) {
      if (array.length === 0) {
        return;
      }
      //lazyload support
      if (this.o.lazyload) {
        this.lazyload(array, direction, index);
      } else {
        // if (array[0] === '' || !array[0]) {array.shift();}
        $("<li style='left:" + (this.i - 1) * this.liWidth + 'px' + "'><img src=" + array[0] + " style='width:" + this.liWidth + ";'></li>").appendTo(this.ul);
        array.shift();
      }
    },
    this.lazyload = function (array, direction, index) {
      var creatImg = $("<li style='left:" + index * this.liWidth + 'px' + "'><img src=" + this.o.loading + " style='height:100%;width:" + this.liWidth + ";'></li>");
      if (direction === 'left') {
        creatImg = $("<li style='left:" + (index - this.o.number - 1) * this.liWidth + 'px' + "'><img src=" + this.o.loading + " style='width:" + this.liWidth + ";'></li>");
        creatImg.prependTo(this.ul);
      } else {
        creatImg.appendTo(this.ul);
      }
      var tmpimg = $("<img src=" + array[0] + ">");
      tmpimg.ready(function () {
        setTimeout(function () {
          //fadeIn
          if (that.o.fadeIn) {
            creatImg.find('img').attr('src', tmpimg.attr('src')).hide().fadeIn('slow');
          } else {
            creatImg.find('img').attr('src', tmpimg.attr('src'));
          }
        }, 1000);
      });
      array.shift();
    },
    this.protect = function () {
      if (this.o.savenumber) {
        this.protectTime = setTimeout(
          function () {
            that.protectMemory();
          }, 1000);
      }
    };
    //保护内存
    this.protectMemory = function () {
      //留下的图片的index 从0开始
      var protectededFirst = this.i - (this.o.number + this.o.savenumber);
      var protectededLast = this.i + this.o.savenumber - 1;
      //限制修正这两个index
      protectededFirst = (protectededFirst < 0) ? 0 : protectededFirst;
      protectededLast = (protectededLast > this.maxI) ? this.maxI : protectededLast;
      var currentLiList = this.el.find(this.o.items).children('li');
      var liEachWidth = this.liWidth;
      //删除其他图片
      for (var i = 0; i < currentLiList.length; i++) {
        var liEachLeft = parseInt(currentLiList.eq(i).css('left'));
        var eachImageIndex = liEachLeft / liEachWidth;
        if (eachImageIndex < protectededFirst || eachImageIndex > protectededLast) {
          //保存数据
          this.o.cache[eachImageIndex] = currentLiList.eq(i).find('img').attr('src');
          currentLiList.eq(i).remove();
        }
      }
    };
  };

  //  Create a jQuery plugin
  $.fn.slider2 = function (o) {
    var len = this.length;

    //  Enable multiple-slider support
    return this.each(function (index) {
      //  Cache a copy of $(this), so it
      var me = $(this),
        key = 'unslider' + (len > 1 ? '-' + ++index : ''),
        instance = (new Slider).init(me, o);

       // Invoke an Unslider instance
      me.data(key, instance).data('key', key);
    });
  };

})(jQuery);