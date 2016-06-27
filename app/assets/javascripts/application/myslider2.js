/*
调用          weinr = $('#slider1 .slider1').slider2
控制器行为     weinr.data('key').next();

添加事件        weinr.on('addNewImage', function(event) {
                alert(1);
              });
给第二个元素上事件      weinr.trigger('addEvent',[1,function(){
                        alert(1);
                      }]);
第一张          noLoopReachFirst
最后一张        noLoopReachEnd
新添一张        addNewImage
最后一张        reachLastImage
*/
(function ($) {
  var Slider = function () {
    that = this;
    //  默认参数
    this.o = {
      showaccout: 4,              //显示都少图片
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
      romoteData: '',        //动态加入图片
      ajaxcallback: false,     //ajax回调数组 url success类型默认get json；若动态改变则在whichchange中写入改变的参数
      render:''
    };

    this.init = function (el, o) {
      //  信息合并
      this.o = $.extend(this.o, o);
      this.el = el;
      this.ul = el.find(this.o.items);
      this.li = this.ul.find(this.o.item);
      this.parentW = Math.floor(parseInt(el.parent().css('width')) / this.o.showaccout) * this.o.showaccout;
      this.liWidth = this.parentW / this.o.showaccout;
      //  当前图片index
      this.i = 0;
      //已加载图片的最大index
      this.maxI = this.o.showaccout;
      //储存可以用的items
      this.o.romoteArray = [];
      this.el.on('addEvent', function(event,index,callback) {
        that.el.find('li').eq(index).on('click', function(){
          callback();
        });
      });
      this.el.on('reachLastImage',function(){
        setTimeout(function(){
          $.each(that.o.romoteData,function(i) {
            that.o.romoteArray.push(that.o.render(that.o.romoteData[i]));
          });
          if(that.el.find('li').length === 0){
            if(that.o.romoteArray){
              //初始加赞图片
              that.o.array = that.o.romoteArray.slice(that.i, that.i + that.o.showaccount);
              for (var i = 0; i < that.o.showaccount; i++) {
                that.addImage(that.o.array, 'right', that.i,that.o.innerHTML);
                that.i++;
              }
            }
          }
        },200);
      });
      this.onreachLastImage();
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
          var sliderWidth = that.liWidth * that.o.showaccount;
          that.r && clearTimeout(that.r) && clearTimeout(that.protectTime);
          that.r = setTimeout(function () {
            var beforeSaveLiList = that.el.find(that.o.items).children('li');
            var beforeSaveWidth = parseInt(that.el.find(that.o.items).children('li').eq(0).outerWidth());
            that.el.width(sliderWidth);
            that.el.find('img').width(sliderWidth / that.o.showaccount);
            var liWidth = beforeSaveLiList.eq(0).outerWidth();
            for (var i = 0; i < beforeSaveLiList.length; i++) {
              if (that.i === that.maxI) {
                console.log(that.i);
                beforeSaveLiList.eq(i).css('left', liWidth * (that.i - beforeSaveLiList.length + i));
              } else if (that.maxI - that.o.savenumber > that.i) {
                beforeSaveLiList.eq(i).css('left', liWidth * (parseInt(beforeSaveLiList.eq(beforeSaveLiList.length - 1).css('left')) / that.liWidth + 1 - beforeSaveLiList.length + i));
              } else if (that.o.savenumber > that.maxI - that.i) {
                beforeSaveLiList.eq(i).css('left', liWidth * (that.maxI - beforeSaveLiList.length + i));
              }
            }
            that.el.find(that.o.items).css('left', (that.o.showaccount - that.i) * liWidth);
          }, 50);
        }).resize();
      }
      if(this.o.savenumber){
        setInterval(
          function () {
            that.protect();
          }, 2000);
        return this;
      }
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
        me.hasClass('dot') ? that.stop().to(me.index()) : me.hasClass('prev') ? that.prev() : that.next();
      });
    }
  };
  Slider.prototype = {
    //  根据this.i移动ul
    to : function(index, callback){
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
      if (index < this.o.showaccout && o.loop === false) {
        this.i = this.o.showaccout;
        return;
      }
      var speed = callback ? 5 : o.speed | 0,
        easing = o.easing,
        obj = {};

      if (!ul.queue('fx').length) {
        el.animate(obj, speed, easing) && ul.animate($.extend({
          left: (this.o.showaccout - index) * this.liWidth
        }, obj), speed, easing, function (data) {
          that.maxI = (index > that.maxI) ? index : that.maxI;
        });
      }
    },

    //  自动增加index
    play : function () {
      that.t = setInterval(function () {
        that.el.find('.next').trigger('click');
      }, that.o.duration | 0);
    },
    //  Stop
    stop : function () {
      that.t = clearInterval(that.t);
      return that;
    },

    //  右箭头
    next : function () {
      if(this.ul.queue('fx').length)return;
      if (this.o.romoteArray.length === this.i) {
        this.onNoLoopReachEnd();
        return;
      }
      this.onreachLastImage();
      this.i++;
      this.getArray(this.i - 1, this.i);
      //判断要添加的图片是否不存在
      var lastImageLeft = parseInt(this.el.find(this.o.items).children('li').last().css('left'));
      var width = Math.floor(parseInt(this.el.parent().css('width')) / this.o.showaccout);
      var lastImageIndex = lastImageLeft / width - 1;
      if (this.i > lastImageIndex) {
        this.addImage(this.o.array, 'right', this.i - 1,this.o.innerHTML);
      }
      return this.to(this.i);
    },
    //  左箭头
    prev : function () {
      this.i--;
      if (this.o.showaccout === this.i + 1) {
        this.onNoLoopReachFirst();
        return;
      }
      if (this.o.savenumber) {
        var firstImageLeft = parseInt(this.el.find(this.o.items).children('li').first().css('left'));
        var width = Math.floor(parseInt(this.el.parent().css('width')) / this.o.showaccout);
        var firstImageIndex = firstImageLeft / width;
        this.getArray(this.i - this.o.showaccout, this.i - this.o.showaccout + 1);
        //判断要添加的图片是否不存在
        if (this.i - this.o.showaccout < firstImageIndex) {
          this.addImage(this.o.array, 'left', this.i + 1);
        }
      }
      return this.to(this.i);
    },
    getArray : function (from, to) {
      if(this.o.romoteArray){
        if (to <= this.maxI) {
          if (this.o.cache[from] == null || undefined) {
            this.o.array = [];
          } else {
            this.o.array[0] = this.o.cache[from];
          }
        } else {
          this.el.bind('addNewImage', this.el, function(event) {
            that.o.array = that.o.romoteArray.slice(from, to);
          });
          this.onaddNewImage();
        }
        return this.o.array;
      }
    },
    //自定义html
    addImage : function (array, direction, index) {
      if(this.o.romoteArray){
        if (array.length === 0) {
          return;
        }
        //lazyload support
        if (this.o.lazyload) {
          this.lazyload(array, direction, index ,that.o.innerHTML);
        } else {
          $(array[0]).css('left',(this.i - 1) * this.liWidth + 'px').appendTo(this.ul).find('img').width(this.liWidth);
          array.shift();
        }
      }
    },
    lazyload : function (array, direction, index) {
      var originSrc = array[0].find('img')[0].src;
      var creatImg = array[0];
      creatImg.css('left',index * this.liWidth+'px').find('img').width(this.liWidth).attr('src', this.o.loading);
      if (direction === 'left') {
        creatImg.css('left',(index - this.o.showaccout - 1) * this.liWidth + 'px').prependTo(this.ul).find('img').width(this.liWidth);
      } else {
        creatImg.appendTo(this.ul);
      }
      var tmpimg = $("<img src=" + originSrc + ">");
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
    protect : function () {
      if (this.o.savenumber) {
        this.protectTime = setTimeout(
        function () {
          that.protectMemory();
        }, 1000);
      }
    },
    //保护内存
    protectMemory : function () {
      //留下的图片的index 从0开始
      var protectededFirst = this.i - (this.o.showaccout + this.o.savenumber);
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
          this.o.cache[eachImageIndex] = currentLiList.eq(i);
          currentLiList.eq(i).remove();
        }
      }
    },
    //第一张
    onNoLoopReachFirst : function(){
      that.el.trigger('noLoopReachFirst');
    },
    //最后一张
    onNoLoopReachEnd : function(){
      that.el.trigger('noLoopReachEnd');
    },
    //新添一张
    onaddNewImage : function(){
      that.el.trigger('addNewImage');
    },
    //何时触发reachLastImage最后一张
    onreachLastImage : function(){
      if (this.o.romoteArray.length - 1 === (this.i || -1)){
        //到底 外获取
        if (that.o.ajaxcallback && that.o.romoteArray) {
          setTimeout(function(){
            that.el.trigger('reachLastImage',that.i);
          },100);
        }
      }
    }
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
      me.data('key', instance);
    });
  };

})(jQuery);