(function($){
    var silde = {
        init:function(a){
            this.auto(a);
        },
        auto:function(a){
            var _root = this,
                $ul = $(a).find("ul"),
                $lis = $ul.children("li"),
                width = $lis.eq(0).width();
            timemachine=setInterval(function(){
                $ul.animate({
                        'margin-left':'-'+ 2*width +'px'
                    },
                    'slow',
                    function(){
                        //此处保证能循环轮播
                        //将已经轮播过的节点的第一张图片添加到末尾的位置
                        //再将margin-left重置为0px;
                        //这样就能一直的循环下去.
                        $ul.css({'margin-left':'-'+ width +'px'}).
                            children('li').
                            last().
                            after(
                                $ul.children('li').first()
                            );
                    });
                },3000
            );
            $('.sliders').hover(function(){
                window.clearInterval(timemachine);
            });
            $('.sliders').mouseleave(function(){
                silde.init(a);
            });
            $('.btn-prev').on('click', function(event) {
                event.preventDefault();
                /* Act on the event */
                $ul.stop().animate({'margin-left': '-'+width},'slow',function(){
                    $ul.css({'margin-left':'-'+ 2*width +'px'}).
                        children('li').
                        first().
                        before(
                            $ul.children('li').last()
                        );
                });
            });
            $('.btn-next').on('click', function(event) {
                event.preventDefault();
                /* Act on the event */
                $('.showdianzan .showslider').find('ul').stop().animate({'margin-left':'-'+2*width},'slow',function(){
                    $ul.css({'margin-left':'-'+ width +'px'}).
                        children('li').
                        last().
                        after(
                            $ul.children('li').first()
                        );
                });
            });
        }
    };
    $(function(){
        //切换slider
    $('.showdianzan .groups li').eq(0).click(function(event) {
        /* Act on the event */
        $('.showdianzan .groups li span').removeClass('active');
        $(this).find('span').addClass('active');
        window.clearInterval(timemachine);
        $('.showdianzan .slider').hide().removeClass('showslider');
        $('.showdianzan #slider1').show().addClass('showslider');
                //动起来
        silde.init('.showdianzan .showslider');
    });
    $('.showdianzan .groups li').eq(1).click(function(event) {
        /* Act on the event */
        $('.showdianzan .groups li span').removeClass('active');
        $(this).find('span').addClass('active');
        window.clearInterval(timemachine);
        $('.showdianzan .slider').hide().removeClass('showslider');
        $('.showdianzan #slider2').show().addClass('showslider');
                //动起来
        silde.init('.showdianzan .showslider');
    });
    $('.showdianzan .groups li').eq(2).click(function(event) {
        /* Act on the event */
        $('.showdianzan .groups li span').removeClass('active');
        $(this).find('span').addClass('active');
        window.clearInterval(timemachine);
        $('.showdianzan .slider').hide().removeClass('showslider');
        $('.showdianzan #slider3').show().addClass('showslider');
        //动起来
        silde.init('.showdianzan .showslider');
    });

        //动起来
        silde.init('.showdianzan .showslider');
    });
})(jQuery);