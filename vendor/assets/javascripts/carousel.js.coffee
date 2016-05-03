$ = jQuery
$.fn.carousel = (options={})->
  if @.length
    el = @.first()
    if obj = el.data('carousel')
      return obj
    else
      el.data('carousel',new Carousel(el,options))
  @

isAnimating = false

class Carousel
  @defaults: {
    nextSelector: '.btn-next'
    prevSelector: '.btn-prev'
    innerSelector: '.carousel-inner'
    thumbnailsSelector: 'ul'
    scrollDuring: 200
    resizeChildByNum: false # 视口包含元素数量, 根据视口大小自动调整元素大小
  }
  $: (selector)->
    $(selector,@el)

  prevHandler: (e)=>
    e.preventDefault()
    @_scrollThumb(1)
  nextHandler: (e)=>
    e.preventDefault()
    @_scrollThumb(-1)
  swipeHandler: (e,direction)=>
    if direction == 'left'
      @_scrollThumb(-1,@_startSwipePos)
    else
      @_scrollThumb(1,@_startSwipePos)

  swipeStatusHandler: (e,phase,direction,distance,duration,fingers)=>
    if phase == 'start'
      @_startSwipePos = parseFloat(@inner.find('ul').css('margin-left') || 0)
    else if phase == 'cancel'
      @inner.find('ul').css('margin-left': @_startSwipePos)
      return
    d = if direction == 'left' then distance else -1 * distance
    pos = @_limitPos(@_startSwipePos - d)
    @inner.find('ul').css('margin-left': pos)

  _scrollThumb: (v,from)->
    if isAnimating == true
      return
    pos = if from? then from else parseFloat(@inner.find('ul').css('margin-left') || 0)
    pos = @_limitPos(pos + @childOuterWidth * v)
    @currentChild = Math.floor(pos / @childOuterWidth * -1)
    isAnimating = true
    @inner.find('ul').stop().animate {
      'margin-left': pos
    },
      duration: @scrollDuring,
      complete: ->
        isAnimating = false
        return

  _limitPos: (pos)->
    Math.min(0,Math.max(@inner.width() - @childOuterWidth * @count, pos))

  _resizeChild: ()=>
    newWidth = @inner.width() / @resizeChildByNum
    return if @childOuterWidth == newWidth
    @childOuterWidth = newWidth
    @margin = 0
    @inner.find('li').width(@childOuterWidth)
    pos = @_limitPos(@currentChild * @childOuterWidth * -1)
    @inner.find('ul').css('margin-left': pos)
    if @inner.width() - (@childOuterWidth * @count) >= @margin
      @prevBtn.hide()
      @nextBtn.hide()

  constructor: (@el,@options = {}) ->
    $.extend(@,@constructor.defaults,@options)
    @currentChild = 0
    @inner = @$(@innerSelector)
    @count = @inner.find('li').length;
    @prevBtn = @$(@prevSelector)
    @nextBtn = @$(@nextSelector)
    if @resizeChildByNum && @resizeChildByNum > 0
      $(window).resize(@_resizeChild)
      @_resizeChild()
    else
      @childOuterWidth = @inner.find('li').first().outerWidth(true)
      @margin = @inner.find('li').first().outerWidth() - @childOuterWidth
      if @inner.width() - (@childOuterWidth * @count) >= @margin
        @prevBtn.hide()
        @nextBtn.hide()
    @prevBtn.click(@prevHandler)
    @nextBtn.click(@nextHandler)
    # 如果加载jquery.touchSwipe 则识别手势
    if $.fn.swipe?
      @el.swipe
        swipe: @swipeHandler
        swipeStatus: @swipeStatusHandler
        threshold: 100
        cancelThreshold: 10
        excludedElements: ""