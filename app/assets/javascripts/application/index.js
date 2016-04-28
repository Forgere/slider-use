$(function(){
var province = [["00","安徽省"],["02","北京"],["03","重庆"],["04","福建省"],["05","甘肃省"],["06","广东省"],["07","广西省"],["08","贵州省"],["09","海南省"],["10","河北省"],["11","河南省"],["12","黑龙江省"],["13","湖北省"],["14","湖南省"],["15","吉林省"],["16","江苏省"],["17","江西省"],["18","辽宁省"],["19","内蒙古自治区"],["20","宁夏回族自治区"],["21","青海省"],["22","山东省"],["23","山西省"],["24","陕西省"],["25","上海"],["26","四川省"],["28","天津"],["29","西藏自治区"],["31","新疆维吾尔自治区"],["32","云南省"],["33","浙江省"]];
var proSchool = {"00":["合肥","芜湖","阜阳","六安","池州","亳州"],
									"02":["北京"],
									"03":["重庆"],
									"04":["福州市","厦门市","莆田市","漳州市"],
									"05":["兰州市","嘉峪关市"],
									"06":["肇庆市","东莞市","广州市","湛江市","惠州市","汕头市","深圳市","清远市","佛山市","韶关市","揭阳市"],
									"07":["南宁市","柳州市","桂林市"],
									"08":["贵阳市","遵义市","毕节市","六盘水市"],
									"09":["海口市"],
									"10":["保定","沧州","邯郸","石家庄","衡水","廊坊","唐山","邢台","张家口"],
									"11":["洛阳市","新乡市","郑州市","南阳市","驻马店市","平顶山市","周口市","开封市","濮阳市","焦作市"],
									"12":["哈尔滨市"],
									"13":["荆州市","黄石市","武汉市","荆门市","恩施市","宜昌市","襄阳市","十堰市","咸宁市"],
									"14":["郴州市","衡阳市","长沙市","湘潭市","岳阳市","株洲市","怀化市"],
									"15":["长春市","吉林市"],
									"16":["南通市","泰州市","宿迁市","南京市","苏州市","扬州市","镇江市","盐城市","无锡市","常州市","连云港市","徐州市","淮安市"],
									"17":["赣州市","南昌市","景德镇市","九江市","上饶市","鄱阳市"],
									"18":["沈阳市","鞍山市","大连市"],
									"19":["包头","赤峰","鄂尔多斯","呼和浩特","通辽","乌兰察布"],
									"20":["银川市","银川"],
									"21":["西宁"],
									"22":["威海市","烟台市","日照市","青岛市","泰安市","济南市","莱芜市","德州市","聊城市","菏泽市","临沂市","济宁市","枣庄市","东营市","诸城市","潍坊市","淄博市"],
									"23":["太原","大同","运城","吕梁"],
									"24":["西安","宝鸡","汉中","西咸新区"],
									"25":["上海"],
									"26":["广元市","成都市","南充市","德阳市","乐山市","达州市","遂宁市","广安市","眉山市","自贡市","攀枝花市","泸州市","巴中市","内江市"],
									"28":["天津"],
									"29":["拉萨"],
									"31":["乌鲁木齐","巴音郭楞"],
									"32":["昆明市","大理市","曲靖市","文山市"],
									"33":["宁波","乐清","瑞安","台州","温州","苍南","舟山","金华","义乌","衢州","绍兴","诸暨","湖州","杭州","嘉兴","慈溪"]
									};
		//province;
		//proSchool;
		//学校名称 激活状态
		$("#upload_city").focus(function(){
		  var top = $(this).position().top+22;
    	  var left = $(this).position().left;
    	  $("div[class='provinceSchool']").css({top:top,left:left});
    	  $("div[class='provinceSchool']").show();
		});
		//初始化省下拉框
		var provinceArray = "";
		var provicneSelectStr = "";
		for(var i=0,len=province.length;i<len;i++){
		  provinceArray = province[i];
		  provicneSelectStr = provicneSelectStr + "<option value='"+provinceArray[0]+"'>"+provinceArray[1]+"</option>"
		} 
		$("div[class='proSelect'] select").html(provicneSelectStr);
		//初始化学校列表
		var selectPro = $("div[class='proSelect'] select").val();
		var schoolUlStr = "";
		var schoolListStr = new String(proSchool[selectPro]);
		var schoolListArray = schoolListStr.split(",");
		var tempSchoolName = "";
		for(var i=0,len=schoolListArray.length;i<len;i++){
		  tempSchoolName = schoolListArray[i];
		  //console.log(tempSchoolName.length);
		  if(tempSchoolName.length>13){
		  	schoolUlStr = schoolUlStr + "<li class='DoubleWidthLi'>"+schoolListArray[i]+"</li>"
		  }else {
		  	schoolUlStr = schoolUlStr + "<li>"+schoolListArray[i]+"</li>"
		  }
		}
		$("div[class='schoolList'] ul").html(schoolUlStr);
		//省切换事件
		$("div[class='proSelect'] select").change(function(){
		  if("99"!=$(this).val()){
		    $("div[class='proSelect'] span").show();
		    $("div[class='proSelect'] input").hide();
		  	schoolUlStr = "";
		    schoolListStr = new String(proSchool[$(this).val()]);
		    schoolListArray = schoolListStr.split(",");
		    for(var i=0,len=schoolListArray.length;i<len;i++){
		  	  tempSchoolName = schoolListArray[i];
			  if(tempSchoolName.length>13){
			  	schoolUlStr = schoolUlStr + "<li class='DoubleWidthLi'>"+schoolListArray[i]+"</li>"
			  }else {
			  	schoolUlStr = schoolUlStr + "<li>"+schoolListArray[i]+"</li>"
			  }
		    }
		    $("div[class='schoolList'] ul").html(schoolUlStr);
		  }else {
		    $("div[class='schoolList'] ul").html("");
		    $("div[class='proSelect'] span").hide();
		    $("div[class='proSelect'] input").show();
		  }
		});
		//学校列表mouseover事件
		$("div[class='schoolList'] ul").on("mouseover","li",function(){
		  $(this).css("background-color","#72B9D7");
		});
		//学校列表mouseout事件
		$("div[class='schoolList'] ul").on("mouseout","li",function(){
		  $(this).css("background-color","");
		});
		//学校列表点击事件
		$("div[class='schoolList'] ul").on("click","li",function(){
		  $("#upload_city").val($(this).html());
		  $("div[class='provinceSchool']").hide();
		});
	//适应窗口
  var $w = $(window),
  ww = $w.width(),
  wh = $w.height(),
  transform;
  var scale = ww/360;
  transform = 'scale(' + scale + ',' + scale + ')';
  $('.mobile').css('-webkit-transform', transform)
    .css('transform', transform);
	var wheight =$(document).height();
	$('.zhezhao').css('height',wheight);
	window.fileSelected = false;
	//遮罩显示
	function showzhezhao(){
		$('.zhezhao').css('display','block');
		var wheight =$(document).height();
		$('.zhezhao').css('height',wheight);
	}
	//遮罩关闭
	$('.close').on('click', function(event) {
		event.preventDefault();
		/* Act on the event */
		$('.tanchu').hide();
		$('.zhezhao').hide();
		if(window.action_str){
      $("form").attr("action", window.action_str);
    }
	});
	//wap close
	$('.mobile .tanchu').on('click', function(e) {
		$('.tanchu').hide();
		$('.zhezhao').hide();
		if(window.action_str){
      $("form").attr("action", window.action_str);
    }
	});
	$('.shangchuanwarp').on('click', function(event) {
    event.stopPropagation();
		/* Act on the event */
	});
	$('.zhucewarp').on('click', function(event) {
    event.stopPropagation();
		/* Act on the event */
	});
	//规则弹出
	$('.banner span').on('click',function(){
		showzhezhao();
		$('.huodongguize').show();
		var sctop = $('.banner').offset().top;
		$(window).scrollTop(sctop);
	});

	//我要上传弹出
	$('.title1 img').on('click', function(event) {
		event.preventDefault();
		/* Act on the event */
		showzhezhao();
		$('.shangchuan').show();
		$('.shangchuanwarp').show();
		$('.zhucewarp').hide();
	});
	$('input#upload_img').on("change", function(){
		window.fileSelected = true;
	});
	//注册弹出（加判断）
	$('.shangchuanwarp .sharebutton').on('click',function(event) {
		event.preventDefault();
		/* Act on the event */
		if(!window.fileSelected){
			alert("请上传图片");
			return false;
		}
		if(!$("input#upload_upload_type_1")[0].checked && !$("input#upload_upload_type_2")[0].checked && !$("input#upload_upload_type_3")[0].checked){
			alert("请选择明信片宣言");
			return false;
		}
		$('.mobile .shangchuan .kuangbg>img').attr('src','/assets/wap_zhucebg.png');
		$('.shangchuanwarp').hide();
		$('.zhucewarp').show();
	});
	//注册提交后，上传成功弹出
	// $('.zhucewarp .sharebutton').on('click',function(event) {
	// 	event.preventDefault();
	// 	/* Act on the event */
	// 	$('.shangchuan').hide();
	// 	$('.gongxi').show();
	// });
	//分享按钮
	$('.sharebutton .weixin').on('click',function(event) {
		event.preventDefault();
		event.stopPropagation();
		/* Act on the event */
		//$('.tanchu').hide();
		$('.zhezhao').show();
		$('.tanchu').hide();
		$('.erweima').show();
	});
	$('span.right').click(function(event) {
		/* Act on the event */
		$('.erweima').hide();
		$('.zhezhao').hide();
	});

	$(".xuanxiang input").change(function(e){
		$(".xuanxiang label").removeClass('checked');
		$(".xuanxiang input:checked+label").addClass('checked');
	});

	$('.lt-ie9 .left1').hover(function() {
		w = $(this).width();
		h = $(this).height();
		 // Stuff to do when the mouse enters the element 
		$(this).width(1.1*w);
		$(this).height(1.1*h);
		},function(){
		$(this).width(157);
		$(this).height(360);
	});
	$('.lt-ie9 .right1').hover(function() {
		w = $(this).width();
		h = $(this).height();
		 // Stuff to do when the mouse enters the element 
		$(this).width(1.1*w);
		$(this).height(1.1*h);
		},function(){
		$(this).width(275);
		$(this).height(121);
	});
	$('.lt-ie9 .right2').hover(function() {
		w = $(this).width();
		h = $(this).height();
		// Stuff to do when the mouse enters the element 
		$(this).width(1.1*w);
		$(this).height(1.1*h);
		$(this).css('margin', '0 -2px -10px 0');
		},function(){
		$(this).width(w);
		$(this).height(h);
		$(this).css('margin', '0');
	});
	$('.lt-ie9 .blockzhong1').hover(function() {
		w = $('.zhong1').width();
		h = $('.zhong1').height();
		 // Stuff to do when the mouse enters the element 
		$('.zhong1').width(1.1*w);
		$('.zhong1').height(1.1*h);
		$('.zhong1').css('margin', '-10px 0 0 -10px');
		},function(){
		$('.zhong1').width(473);
		$('.zhong1').height(192);
		$('.zhong1').css('margin', '0');
	});
	$('.lt-ie9 .blockzhong2').hover(function() {
		w = $('.zhong2').width();
		h = $('.zhong2').height();
		 // Stuff to do when the mouse enters the element 
		$('.zhong2').width(1.1*w);
		$('.zhong2').height(1.1*h);
		$('.zhong2').css('margin', '-10px 0 0 -10px');
		},function(){
		$('.zhong2').width(359);
		$('.zhong2').height(219);
		$('.zhong2').css('margin', '0');
	});
	$('.lt-ie9 .blockzhong3').hover(function() {
		w = $('.zhong3').width();
		h = $('.zhong3').height();
		 // Stuff to do when the mouse enters the element 
		$('.zhong3').width(1.1*w);
		$('.zhong3').height(1.1*h);
		$('.zhong3').css('margin', '-15px 0 0 -15px');
		},function(){
		$('.zhong3').width(380);
		$('.zhong3').height(258);
		$('.zhong3').css('margin', '0');
	});
});
