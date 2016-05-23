/**
 * @author: jiuhu
 * @date: 15/5/6
 */

(function(global, factory) {
    if ( typeof define === "function") { // AMD || CMD
        if(define.amd) {
            define(function() {
                return factory();
            });
        } else if(define.cmd) {
            define(function(require, exports, module) {
                module.exports = factory();
            });
        }
    } else if( typeof module === "object" && typeof module.exports === "object" ) { // commonJS
        module.exports = factory();
    } else { // global
        global.QunarAPI = factory();
    }
}(typeof window !== "undefined" ? window : this, function() {

    'use strict';

    var QunarAPI = {};
    var win = window;
    var doc = win.document;
    var ua = win.navigator.userAgent;
    var configOptions = {};
    // 鍦╞ridge杩樻病ready鏃讹紝璋冪敤API鏃朵細鍏堣缂撳瓨璧锋潵锛岀瓑ready鍚庡啀瑙﹀彂
    var cache = [];
    // 缂撳啿閿欒鍥炶皟鏂规硶
    var errorCallbackCache = [];
    // 榛樿閰嶇疆
    var defaultOptions = {
        wechatApiUrl: 'http://res.wx.qq.com/open/js/jweixin-1.0.0.js'
    };
    var name2KeyMap = {};
    var key2NameMap = {};
    // sniffer
    var browser = (function() {
        if(/MicroMessenger/i.test(ua)) {
            return {wechat: true, version: ''};
        } else if(/Qunar/i.test(ua)) {
            return {qunar: true, version: ''};
        } else {
            return {h5: true, version: ''};
        }
    })();

    var hooks = {
        'api':{
            'openWebView':function(){
                isFunction(this.onViewBack) && QunarAPI.hy.onceReceiveData({success:this.onViewBack});
            }
        },
        'bridge':{
            'method':function(key){
                return API.share.wechat[key] || API.share.hy[key] ? 'invoke' : '';
            }
        }
    };

    var paramHandler = {
        checkJsApi: function(param){
            var map = name2KeyMap;
            var successCb = param.success;

            var listClone = param.jsApiList.slice(0);

            // 鏍规嵁map,鐢熸垚鏂扮殑list
            param.jsApiList = listClone.map(function(key){
                return map[key] || key;
            });

            param.success = function(res){
                var obj = {};
                // 鏍规嵁鍒濆jsApiList锛岀敓鎴愬搴旂殑瀵硅薄
                listClone.forEach(function(key){
                    // 鑾峰彇map鏈夎褰曠殑name锛屽惁鍒欒涓轰笉鏀寔
                    var name = map[key];
                    obj[key] = res[name] || false;
                });
                isFunction(successCb) && successCb.call(null, obj);
            }
            return param;
        },
        log: function( msg ){
            if( isString(msg) ){
                var param = {
                    message: msg
                }
                return param;
            }
            return msg;

        }
    };

    function isFunction (obj) {
        return typeof obj === 'function';
    };

    function isString (string) {
        return Object.prototype.toString.call(string) === "[object String]";
    };

    function domReady( callback ){
        var readyRep = /complete|loaded|interactive/;

        if (readyRep.test(document.readyState) && document.body) {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', function () {
                callback();
            }, false);
        }
    };

    // 娉ㄥ唽鎺ュ彛
    function batchRegisterAPI(api, namespace) {
        for(var key in api) {
            QunarAPI.register(key, api[key], namespace);
        }
    };

    function callbackQueue(){
        if(cache.length > 0){
            cache.forEach(function(item) {
                QunarAPI.invoke(item.key, item.callback, item.param);
            });
            cache = [];
        }
    }

    function errorHandler(res){
        if(errorCallbackCache.length > 0){
            errorCallbackCache.forEach(function(callback) {
                callback(res);
            });
        }
    }

    // 瀹夸富鐜閫傞厤
    function adapter() {
        // load wechat api
        if(browser.wechat) {
            var head = doc.getElementsByTagName('head')[0];
            var script = doc.createElement('script');
            script.setAttribute('src', defaultOptions.wechatApiUrl);
            head.appendChild(script);
            script.onload = function() {
                for(var key in wx) {
                    QunarAPI[key] = wx[key];
                }
                //娣诲姞閫氱敤鍒嗕韩鏂规硶
                QunarAPI['onMenuShare'] = function(param){
                    for(var key in API.share.wechat) {
                        QunarAPI[key](param);
                    }
                }
                QunarAPI.isReady = true;
                cache.forEach(function(item) {
                    QunarAPI[item.key](item.param);
                });
                cache = [];
            };
        } else if(browser.qunar) {
            // 娣诲姞onInitData
            QunarAPI.hy.onInitData = function(param) {
                QunarAPI.hy.getInitData({
                    success: function(data) {
                        isFunction(param.success) && param.success(data);
                    }
                });
            };

            // 娣诲姞bridge鍒ゆ柇
            window.addEventListener('load', function(){
                // 600ms 鍚庯紝杩樻病鏈塺eady锛岃鏄巄ridge娉ㄥ叆澶辫触
                setTimeout(function(){
                    if(!QunarAPI.bridge){
                        // 瑙﹀彂閿欒
                        errorHandler( {
                            ret: false,
                            errcode: -1,
                            errmsg: "bridge娉ㄥ叆澶辫触"
                        } );
                    }
                }, 600)
            });
        }
    };

    function doResult(key, param, name){
        if(!param) {
            console.error('Parameters are not allowed to be empty!');
            return;
        }

        // 澶勭悊param
        if(paramHandler[name]){
            param = paramHandler[name](param);
        }

        var successCb = param.success,
            failCb = param.fail,
            completeCb = param.complete;

        var callback = function(data) {
            configOptions.debug && console.log(data);
            var args = Array.prototype.slice.call(arguments, 0);

            // data鏈変袱绉嶆暟鎹紝涓€绉嶆槸甯︾姸鎬佺殑鏁版嵁锛屼竴绉嶆槸鏃犵姸鎬佺殑鏁版嵁
            // { ret: true, data: {} }
            // {  }

            if(!data || typeof data.ret === 'undefined') {
                // response涓嶅瓨鍦ㄦ垨鑰卹et鏈畾涔夛紝璁や负鎴愬姛
                // success
                isFunction(successCb) && successCb.apply(null, args);
                hooks.api[name] && hooks.api[name].call(param, data || {});
            }else if(data.ret){
                // response涓嶄负绌猴紝涓攔et涓簍rue锛岃涓烘垚鍔燂紝鐪熸鐨勬暟鎹负data.data
                args[0] = data.data;
                isFunction(successCb) && successCb.apply(null, args);
                hooks.api[name] && hooks.api[name].call(param, data.data || {});
            }else {
                isFunction(failCb) && failCb.apply(null, args);
            }
            isFunction(completeCb) && completeCb.apply(null, args);

            /*
             * 閽堝invoke鍒嗕韩鎺ュ彛锛屽彧鑳界洃鍚竴娆￠棶棰�
             * 鍥炶皟鍙戣捣鍚庯紝閲嶆柊鐩戝惉
             */

            if(browser.qunar && data && data.errcode != -1 && hooks.bridge.method(name)){
                QunarAPI.invoke(key, callback, param, name);
            }
        };

        QunarAPI.invoke(key, callback, param, name);
    };

    var API = {
        // 閫氱敤API
        common: {
            /** 鍥惧儚鎺ュ彛 */
            chooseImage: 'chooseImage', // 鎷嶇収鎴栦粠鎵嬫満鐩稿唽涓€夊浘
            previewImage: 'previewImage', // 棰勮鍥剧墖
            uploadImage: 'uploadImage', // 涓婁紶鍥剧墖
            uploadImage_v1: 'uploadImage.v1', // 涓婁紶鍥剧墖鏂版帴鍙�
            downloadImage: 'downloadImage', // 涓嬭浇鍥剧墖

            /** 璁惧淇℃伅鎺ュ彛 */
            getNetworkType: 'network.getType', // 鑾峰彇缃戠粶鐘舵€�
            openLocation: 'openLocation', // 浣跨敤寰俊鍐呯疆鍦板浘鏌ョ湅浣嶇疆
            getLocation: 'geolocation.getCurrentPosition', // 鑾峰彇鍦扮悊浣嶇疆

            /** 鐣岄潰鎿嶄綔鎺ュ彛 */
            closeWindow: 'webview.back', // 鍏抽棴褰撳墠缃戦〉绐楀彛
            hideOptionMenu: 'hideOptionMenu', // 闅愯棌鍙充笂瑙掕彍鍗�
            showOptionMenu: 'showOptionMenu', // 鏄剧ず鍙充笂瑙掕彍鍗�
            hideMenuItems: 'hideMenuItems', // 鎵归噺闅愯棌鍔熻兘鎸夐挳
            showMenuItems: 'showMenuItems', // 鎵归噺鏄剧ず鍔熻兘鎸夐挳
            hideAllNonBaseMenuItem: 'hideAllNonBaseMenuItem', // 闅愯棌鎵€鏈夐潪鍩虹鎸夐挳
            showAllNonBaseMenuItem: 'showAllNonBaseMenuItem', // 鏄剧ず鎵€鏈夊姛鑳芥寜閽�
            hideLoadView: 'webview.hideLoadView', // 闅愯棌loading

            /** loading浜嬩欢 */
            onLoadingClose: 'loadingview.close', // 鐩戝惉loading鍏抽棴浜嬩欢

            /** 鎵竴鎵帴鍙� */
            scanQRCode: 'scanQRCode', // 璋冭捣鎵竴鎵�

            /** 鍏朵粬鎺ュ彛 */
            checkJsApi: 'checkJsApi' // 鍒ゆ柇褰撳墠瀹㈡埛绔増鏈槸鍚︽敮鎸佹寚瀹欽S
        },

        share: {
            wechat: {
                onMenuShareTimeline: 'onMenuShareTimeline',
                onMenuShareAppMessage: 'onMenuShareAppMessage'
                //onMenuShareQQ: 'onMenuShareQQ'  // QQ闇€瑕佺鍏DK鐩墠澶у鎴风涓嶆敮鎸�
            },
            hy: {
                onMenuShareWeiboApp: 'onMenuShareWeiboApp',
                onMenuShareSMS: 'onMenuShareSMS',
                onMenuShareEmail: 'onMenuShareEmail',
                onMenuShare: 'onMenuShare',
                onMenuShareQunarIM: 'onMenuShareQunarIM'
            }
        },

        // HYAPI
        hy: {
            /**鐙湁API**/
            // webView鎺ュ彛
            openWebView: 'webview.open', // 鎵撳紑鏂扮殑webview
            closeWebView: 'webview.back', // 鍏抽棴webview
            setWebViewAttr: 'webview.attribute', // 璁剧疆webview灞炴€�
            getInitData: 'webview.getInitData',
            enableBackGesture: 'qunarnative.gesturesView', // 鏄惁鏀寔鍚庨€€鎵嬪娍(浠呴拡瀵笽OS)

            // webView浜嬩欢
            onShow: 'webview.onShow',
            onHide: 'webview.onHide',
            onReceiveData: 'webview.onReceiveData',
            onceReceiveData: 'webview.onReceiveData',
            onCloseWebView: 'webview.targetClosed', // 鐩戝惉WebView鍏抽棴浜嬩欢
            onceCloseWebView: 'webview.targetClosed', // 鐩戝惉WebView鍏抽棴浜嬩欢

            // 浠ヤ笅涓変釜鎺ュ彛涓嶆帹鑽愪娇鐢紝鍚庣画浼氬垹闄�
            onBeforeShow: 'webview.onBeforeShow',
            onBeforeHide: 'webview.onBeforeHide',
            onDestroy: 'webview.onDestroy',

            // 瀵艰埅鎺ュ彛
            navRefresh: 'navigation.refresh', // 鍒锋柊瀵艰埅鏉�,
            getNavDisplayStatus: 'navigation.displayStatus', // 鑾峰彇瀵艰埅鏍忔樉绀虹姸鎬�
            setNavDisplayStatus: 'navigation.display', // 璁剧疆瀵艰埅鏍忔樉绀虹姸鎬�

            // 瀵艰埅浜嬩欢
            onNavClick: 'navigation.click', // 鐩戝惉瀵艰埅鏉＄偣鍑讳簨浠�

            // 鐘舵€佹爮
            setStatus: 'qunarnative.status', // 璁剧疆鐘舵€佹爮棰滆壊 default锛堥粦锛夊拰light锛堢櫧锛�

            /*涓诲姩鍒嗕韩*/
            shareTimeline: 'shareTimeline',
            shareAppMessage: 'sendAppMessage',
            shareWeiboApp: 'shareWeiboApp',
            shareSMS: 'shareSMS',
            shareEmail: 'shareEmail',
            shareQunarIM: 'shareQunarIM',

            /* 鍒嗕韩鍥剧墖鍒版湅鍙嬪湀 */
            shareImageToTimeline: 'shareImageToTimeline',

            // 鍞よ捣share dialog妗�
            showShareItems: "doShare",

            // 璁惧淇℃伅
            getDeviceInfo: 'native.getDeviceInfo', // 鑾峰彇璁惧淇℃伅

            login: 'login.start', // 鐧诲綍
            syncLoginFromTouch: 'syncLoginFromTouch', // 浠巘ouch绔悓姝ョ櫥闄嗕俊鎭�

            log: 'debug.log', // debug
            uelog: 'hy.uelog', // uelog
            qaf: 'qaf'
        },

        // H5API
        h5: {
            getLocation: function(cb, param) {
                if(navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(param.success, param.fail, {
                        enableHighAccuracy: param.enableHighAccuracy || true,
                        timeout: param.timeout || 5000
                    });
                } else {
                    cb({
                        ret: false,
                        errcode: -1,
                        errmsg: 'Geolocation is not supported!'
                    });
                }
            },

            login: function(cb, param){
                var data, loginUrl, p, str = "";
                loginUrl = "http://user.qunar.com/mobile/login.jsp";
                data = {
                    ret: param.ret || encodeURIComponent(location.href),
                    goback: param.goback || "",
                    backUrl: param.backUrl || ""
                };
                for(p in data){
                    if(data.hasOwnProperty(p) && data[p] !== ""){
                        str += p + "=" + data[p]
                    }
                }
                location.href = loginUrl + "?" + str;
            },

            checkJsApi: function(cb, param){
                var jsApiList = param.jsApiList || [];
                var obj = {}, name;
                jsApiList.forEach(function(key){
                    name = key2NameMap[key];
                    obj[key] = !!API.h5[name];
                })
                cb( obj );
            },

            notSupport: function(cb, param, key, name) {
                if(!isFunction(cb)) return;
                cb({
                    ret: false,
                    errcode: -1,
                    errmsg: '娴忚鍣ㄧ幆澧冧笅涓嶆敮鎸�"' + name+ '"鎺ュ彛璋冪敤'
                });
            }
        }
    };

    QunarAPI = {
        version: '1.0.16',
        isReady: false,
        bridge: null,
        sniff: browser,
        ready: function(callback) {
            var self = this;
            if(browser.qunar) {
                doc.addEventListener('WebViewJavascriptBridgeReady', function(e) {
                    self.isReady = true;
                    self.bridge = e.bridge;
                    isFunction(callback) && callback.call(self);
                    // 鎵ц闃熷垪閲岀殑api鏂规硶
                    callbackQueue();
                });
            } else if(browser.h5){
                self.isReady = true;
                isFunction(callback) && callback.call(self);
            }
        },
        // 閫氳繃config鎺ュ彛娉ㄥ叆鏉冮檺楠岃瘉閰嶇疆
        config: function(opt) {
            doResult('config', configOptions = opt);
        },
        error: function(callback){
            if( isFunction(callback) ){
                errorCallbackCache.push(callback);
            }
        },
        invoke: function (key, callback, param, name) {
            if(!isFunction(callback)) return;

            if(QunarAPI.isReady) {
                if (browser.qunar) {
                    name = name || key;
                    var method = 'invoke';
                    if(name.indexOf('once') === 0) {
                        method = 'once';
                    } else if(name.indexOf('on') === 0) {
                        method = 'on';
                    }
                    this.bridge[ hooks.bridge.method(name) || method](key, callback, param);
                } else if(browser.wechat) {
                    this[key] && this[key](param);
                } else if(browser.h5){
                    API.h5[API.h5[name] ? name : 'notSupport'](callback, param, key, name);
                }
            } else {
                cache.push({key: key, callback: callback, param: param});
            }
        },
        /**
         * 鑷畾涔夋帴鍙�
         * @param  {String} name      鎺ュ彛鍚嶇О
         * @param  {String} key       bridge
         * @param  {String} namespace 鍛藉悕绌洪棿锛屼笟鍔℃柟寤鸿浣跨敤鑷繁鐨勫懡鍚嶇┖闂�
         */
        register: function (name, key, namespace) {
            var self = this, ns = this;
            namespace && (self[namespace] ? (ns = self[namespace]) : (ns = self[namespace] = {}));

            // 璁板綍琚敞鍐岀殑name
            name2KeyMap[name] = key;
            key2NameMap[key] = name;

            // self[name] = // 鎵€鏈夋柟娉曟敞鍐屽埌QunarAPI锛屽噺灏戝樊寮傝褰�
            ns[name] = function(param){
                if(!param){
                    param = {};
                }
                doResult(key, param, name);
            };
        }
    };

    batchRegisterAPI(API.share.wechat);
    batchRegisterAPI(API.share.hy);
    batchRegisterAPI(API.common);
    batchRegisterAPI(API.hy, 'hy');
    adapter();
    return QunarAPI;
}));
QunarAPI.config({
    debug: true ,// 目前只支持 debug 参数
});

QunarAPI.checkJsApi({
    jsApiList: ['onMenuShare'], // 需要检测的JS接口列表
    success: function(res) {
        // 以键值对的形式返回，可用的api值true，不可用为false
        // HY
        // res: {"onMenuShare": true}
        // wechat
        // res：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
    }
});
QunarAPI.ready(function() {
    // 调用QunarAPI提供的各种接口
 QunarAPI.onMenuShare({
        title: '荣威360 幸福新发现', // 标题
        link: 'http://roewe360.xtunes.cn/', // 链接URL
        desc: '通用分享，描述', // 描述
        imgUrl: 'http://roewe360.xtunes.cn/assets/sharelogo.png', // 分享图标
    });
});
