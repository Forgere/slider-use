(function($){
    // var silde = {
    //     init:function(a){
    //         this.auto(a);
    //     },
    //     auto:function(a){
    //         var _root = this,
    //             $ul = $(a).find("ul"),
    //             $lis = $ul.children("li"),
    //             width = $lis.eq(0).width();
    //         timemachine=setInterval(function(){
    //             $ul.animate({
    //                     'margin-left':'-'+ 2*width +'px'
    //                 },
    //                 'slow',
    //                 function(){
    //                     //此处保证能循环轮播
    //                     //将已经轮播过的节点的第一张图片添加到末尾的位置
    //                     //再将margin-left重置为0px;
    //                     //这样就能一直的循环下去.
    //                     $ul.css({'margin-left':'-'+ width +'px'}).
    //                         children('li').
    //                         last().
    //                         after(
    //                             $ul.children('li').first()
    //                         );
    //                 });
    //             },3000
    //         );
    //         $('.sliders').hover(function(){
    //             window.clearInterval(timemachine);
    //         });
    //         $('.sliders').mouseleave(function(){
    //             silde.init(a);
    //         });
    //        $('.prev').on('click', function(event) {
    //             event.preventDefault();
    //             /* Act on the event */
    //             $ul.stop().animate({'margin-left': '-'+width},'slow',function(){
    //                 $ul.css({'margin-left':'-'+ 2*width +'px'}).
    //                     children('li').
    //                     first().
    //                     before(
    //                         $ul.children('li').last()
    //                     );
    //             });
    //         });
    //         $('.next').on('click', function(event) {
    //             event.preventDefault();
    //             /* Act on the event */
    //             $('.showdianzan .showslider').find('ul').stop().animate({'margin-left':'-'+2*width},'slow',function(){
    //                 $ul.css({'margin-left':'-'+ width +'px'}).
    //                     children('li').
    //                     last().
    //                     after(
    //                         $ul.children('li').first()
    //                     );
    //             });
    //         });
    //     }
    // };
    $(function(){
        // 切换slider
        $('.showdianzan .groups li').eq(0).click(function(event) {
            /* Act on the event */
            $('.showdianzan .groups li span').removeClass('active');
            $(this).find('span').addClass('active');
            $('.showdianzan .sliderwarp').hide().removeClass('showslider');
            $('.showdianzan #slider1').show().addClass('showslider');
        });
        $('.showdianzan .groups li').eq(1).click(function(event) {
            /* Act on the event */
            $('.showdianzan .groups li span').removeClass('active');
            $(this).find('span').addClass('active');
            $('.showdianzan .sliderwarp').hide().removeClass('showslider');
            $('.showdianzan #slider2').show().addClass('showslider');
        });
        $('.showdianzan .groups li').eq(2).click(function(event) {
            /* Act on the event */
            $('.showdianzan .groups li span').removeClass('active');
            $(this).find('span').addClass('active');
            $('.showdianzan .sliderwarp').hide().removeClass('showslider');
            $('.showdianzan #slider3').show().addClass('showslider');
        });

        //路线
        var unslider5 = $("#slider5").unslider({
                during: 800,
                delay: 7000,
                dots: true,
                autoplay:false,             //  Display dot navigation
                fluid: true
            });
        var unslider4 = $("#slider4").unslider({
            during: 800,
            delay: 7000,
            autoplay:false,
            dots: true,             //  Display dot navigation
            fluid: true
        });
        var unslider6 = $("#slider6").unslider({
            during: 800,
            delay: 7000,
            autoplay:false,
            dots: true,             //  Display dot navigation
            fluid: true
        });
        $('#route1').click(function(event) {
            /* Act on the event */
            $('.showroute .groups li span').removeClass('active');
            $(this).find('span').addClass('active');
            $('.showroute .slider').removeClass('showslider');
            $('.showroute .slider4').addClass('showslider');
             $('.showroute .slider4').show();
            $("#slider4").unslider({
                during: 800,
                delay: 7000,
                autoplay:false,
                dots: true,             //  Display dot navigation
                fluid: true   
            });         //  Support responsive design. May break non-responsive designs
            $('.showroute span').removeClass('active2');
            $('#slider5').hide();
            $('#slider6').hide();
            $('#slider4 .dots:first').remove();
        });

        $('.showroute .groups li').eq(1).click(function(event) {
            /* Act on the event */
            $('.showroute .groups li span').removeClass('active');
            $(this).find('span').addClass('active');
            $('.showroute .slider').removeClass('showslider');
            $('.showroute .slider5').addClass('showslider');
             $('.showroute .slider5').show();
            $("#slider5").unslider({
                during: 800,
                delay: 7000,
                autoplay:false,
                dots: true,             //  Display dot navigation
                fluid: true
            });         //  Support responsive design. May break non-responsive designs
            $('.showroute span').removeClass('active2');
            $('#slider4').hide();
            $('#slider6').hide();
            $('#slider5 .dots:first').remove();
        });

        $('.showroute .groups li').eq(2).click(function(event) {
            /* Act on the event */
            $('.showroute .groups li span').removeClass('active');
            $(this).find('span').addClass('active');
            $('.showroute .slider').removeClass('showslider');
            $('.showroute .slider6').addClass('showslider');
            $('.showroute .slider6').show();
            $("#slider6").unslider({
                during: 800,
                delay: 7000,
                autoplay:false,
                dots: true,             //  Display dot navigation
                fluid: true   
            });         //  Support responsive design. May break non-responsive designs
            $('#slider4').hide();
            $('#slider5').hide();
            $('#slider6 .dots:first').remove();
        });
       // $(".route").unslider({
       //          during: 800,
       //          delay: 7000,
       //          dots: true,             //  Display dot navigation
       //          fluid: true
       //      }); //  Support responsive design. May break non-responsive designs

        // $('.showroute .btn-prev').click(function() {
        //     $('.showroute span').removeClass('active2');
        //     $(this).addClass('active2');
        //     $('.showroute .showslider ul').animate({'margin-left':'0px'},'slow');
        // });
        // $('.showroute .btn-next').click(function() {
        //     $('.showroute span').removeClass('active2');
        //     $(this).addClass('active2');
        //     $('.showroute .showslider ul').animate({'margin-left':'-1012px'},'slow');
        // });
            //hotel
        var carousel1 = $('#hotelslider').carousel({resizeChildByNum: 2});
        var scroll = function(){
            //$(".hotel .btn-next").trigger("click");
            inner = $('.hotel .carousel-inner');
            var pos =  parseFloat(inner.find('ul').css('margin-left') || 0);
            childOuterWidth = inner.width()/2;
            count = inner.find('li').length;
            pos = pos + childOuterWidth * -2;
            if(pos == -1 * childOuterWidth * count){
              pos = 0;
            }
            inner.find('ul').stop().animate({'margin-left': pos},200);
        };
        // var autoScroll = setInterval(scroll,5000);
        //jia

    });
})(jQuery);