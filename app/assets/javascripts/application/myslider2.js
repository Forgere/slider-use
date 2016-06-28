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
      showaccout: 4,          //显示都少图片
      savenumber: null,       //前后保存数量
      items: 'ul',           //容器子元素
      item: 'li',            //容器孙元素
      autoplay: false,        //自动滚动
      loop: false,            //无线滚动
      autochange: false,      //适应屏幕
      duration: 3000,         //间隔
      arrows: true,           //箭头
      prev: '',
      next: '',
      speed: 200,             //滚动速度
      autospeed: 'slow',      //自动滚动速度
      array: [],              //添加图片使用的数组
      romoteArray: [],        //缓存图片地址数组
      easing: 'swing',        //animate数组
      lazyload: false,         //lazyload
      loading: 'data:image/gif;base64,R0lGODlh6AB8ANU/ADs7O729vfz8/Lm5ueHh4d3d3ZWVldHR0cXFxfn5+Y2Njebm5mlpaVFRUXV1dYGBgTQ0NPf394iIiMHBwfb29pGRkbW1teTk5G5ubnx8fO7u7vLy8nl5efT09KioqIWFhenp6crKyp2dnXFxcaWlpU1NTfDw8Ovr66Ghoc3Nzc7Ozurq6mFhYVlZWWVlZbKyslVVVUZGRpqamrCwsK6urklJSaysrNTU1EFBQdra2iwsLNfX19jY2F1dXf///////yH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MkE5QjY5MDMxRjMzMTFFNkFDRkI5QTFFNTYzNjAyQzQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MkE5QjY5MDQxRjMzMTFFNkFDRkI5QTFFNTYzNjAyQzQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyQTlCNjkwMTFGMzMxMUU2QUNGQjlBMUU1NjM2MDJDNCIg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',            //lazy图片
      fadeIn: false,          //fadeIN效果
      romoteData: '',        //ajax result
      render:'',
      dynamicLoading:true      //是否开启动态加载
    };

    this.init = function (el, o) {
      //  信息合并
      this.o = $.extend(this.o, o);
      this.el = el;
      this.ul = $("<"+this.o.items+"></"+this.o.items+">");
      this.ul.appendTo(el);
      this.li = this.ul.find(this.o.item);
      if(this.o.showaccout === 'auto'){
      }else{
        this.parentW = Math.floor(parseInt(el.parent().css('width')) / this.o.showaccout) * this.o.showaccout;
        this.liWidth = this.parentW / this.o.showaccout;
      }
      //  当前图片index
      this.i = 0;
      //已加载图片的最大index
      this.maxI = this.o.showaccout;
      //高度
      this.ul.height('100%');
      //初始化加载
      if(this.o.dynamicLoading){
        this.onreachLastImage();
      }else{
        //有图的情况下 根据是否给出显示数量排布
        if(this.o.showaccout === 'auto'){

        }else{
          var existingitems = this.el.find('li');
          $.each(existingitems,function(i) {
            existingitems[i].css('left', i*that.liWidth);
          });
        }
      }
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
        if(this.el.find('.arrows').length !== 0){
          this.el.find('.arrows').find('.next').onclick(function(){that.next();});
          this.el.find('.arrows').find('.prev').onclick(function(){that.prev();});
        }else{
          if(typeof(this.o.prev) === 'object'){
            var arrow = $('<div class="arrows"></div>');
            console.log(arrow.appendTo(that.el));
            this.o.prev.appendTo(arrow);
            this.o.next.appendTo(arrow);
          }else{
            nav('arrow');
          }
        }
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
      if(this.o.dynamicLoading){
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
        this.i = this.o.showaccout;
        return;
      }
      if (this.o.dynamicLoading) {
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
      console.log(from);
      console.log(to);
      if(this.o.dynamicLoading){
        this.el.bind('addNewImage', this.el, function(event) {
          that.o.array = that.o.romoteArray.slice(from, to);
        });
        this.onaddNewImage();
      }
      return this.o.array;
    },
    //自定义html
    addImage : function (array, direction, index) {
      if(this.o.dynamicLoading){
        if (array.length === 0) {
          return;
        }
        //lazyload support
        if (this.o.lazyload) {
          this.lazyload(array, direction, index ,that.o.innerHTML);
        } else {
          var creatImg = $("<"+this.o.item+"></"+this.o.item+">");
          creatImg.append(this.o.render(array[0]));
          if (direction === 'left') {
            $(creatImg).css('left',(index - this.o.showaccout - 1) * this.liWidth + 'px').prependTo(this.ul).find('img').width(this.liWidth);
          } else {
            $(creatImg).css('left',index * this.liWidth + 'px').appendTo(this.ul).find('img').width(this.liWidth);
          }
          array.shift();
        }
      }
    },
    lazyload : function (array, direction, index) {
      var originSrc = this.o.render(array[0]).find('img')[0].src;
      var creatImg = $("<"+this.o.item+"></"+this.o.item+">");
      creatImg.append(this.o.render(array[0]));
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
      if (this.o.dynamicLoading) {
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
        if (that.o.dynamicLoading) {
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