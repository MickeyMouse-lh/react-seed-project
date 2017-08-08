;(function($, window, undefined) {

    var win = $(window),
        doc = $(document),
        count = 1,
        isLock = false;

    var Dialog = function(options) {

        this.settings = $.extend({}, Dialog.defaults, options);

        this.init();

    }

    Dialog.prototype = {

        /**
         * 初始化
         */
        init : function() {

            this.create();



            if (!isNaN(this.settings.time)&&this.settings.time!=null) {
                this.time();
            }

            if (this.settings.lock) {
                this.lock();
            }

        },

        /**
         * 创建
         */
        create : function() {
            var themeclass = this.settings.theme
            var divHeader = (this.settings.title=='')?'':'<div class="m9fDialog-header">'+ this.settings.title +'</div>';
            var dialogclass ='m9fDialog-content m9fDialog-contentp';
            /*吐司弹框*/
            if(this.settings.type=='toast'){
                dialogclass='m9fDialog-content';
            }
             var footer = '<div class="m9fDialog-footer clear"></div>'

            if(this.settings.type=='topclose'){
                dialogclass='m9fDialog-content m9fDialog-contentp';
                footer = "";
            }

            if(this.settings.type=='loading'){
                dialogclass='m9fDialog-content m9fDialog-contentp';
                footer = "";
            }

            // HTML模板
            var templates = $("<div>",{
                class:'m9fDialog-wrap m9fDialog-wrap-theme-'+themeclass,

                html:divHeader + '<div class="'+dialogclass+'">'+ this.settings.content +'</div>' +footer
            })
           /* '<div class="m9fDialog-wrap m9fDialog-wrap-theme-'+themeclass+'">' +
                                divHeader +
                                '<div class="'+dialogclass+'">'+ this.settings.content +'</div>' +
                                '<div class="m9fDialog-footer"></div>' +
                            '</div>';*/
            // 追回到body
            this.dialog = $('<div>').addClass('m9fDialog').css({ zIndex : this.settings.zIndex + (count++) }).html(templates).prependTo('body');

            if(this.settings.type=='topclose'){
                        this.topclose();
            }

            // 设置cancel按钮
            if (this.settings.cancelText) {
               this.cancel();
            }


            // 设置ok按钮
            if (this.settings.okText) {
                this.ok();
            }





            // 设置大小
            this.size();

            // 设置位置
            this.position();

        },

        /**
         * ok
         */
        ok : function() {
            var _this = this,
                footer = this.dialog.find('.m9fDialog-footer');
            var classes = "m9fDialog-ok";
                // 设置cancel按钮
            if (this.settings.cancelText) {
               classes = "butcl2";
            }

            $('<a>', {
                href : 'javascript:;',
                text : this.settings.okText
            }).on("click", function() {
                    if ($.isFunction(_this.settings.ok)) {
                         _this.settings.ok();
                     }
                    _this.close();
            }).addClass(classes).appendTo(footer);

        },

        /**
         * cancel
         */
        cancel : function() {

            var _this = this,
                footer = this.dialog.find('.m9fDialog-footer');
            var classes = "m9fDialog-cancel";
                // 设置cancel按钮
            if (this.settings.okText) {
               classes = "butcl2";
            }

            $('<a>', {
                href : 'javascript:;',
                text : this.settings.cancelText
            }).on("click",function() {
                    if ($.isFunction(_this.settings.cancel)) {
                         _this.settings.cancel();
                     }
                    _this.close();

            }).addClass(classes).prependTo(footer);


        },

        /**
         *设置顶部关闭按钮
         */
        topclose:function(){
            var _this = this,
                wrap = this.dialog.find('.m9fDialog-wrap');
                wrap.css({position:"relative"});//<i class="bill-topclose"></i> <i class="warning-line"></i>
            $('<i>',{
                class:"bill-topclose"
            }).on("click",function(){
                _this.close();
            }).appendTo(wrap);
            $('<i>',{
                class:"warning-line"
            }).appendTo(wrap);


        },

        /**
         * 设置大小
         */
        size : function() {

            var content = this.dialog.find('.m9fDialog-content'),
                wrap = this.dialog.find('.m9fDialog-wrap');

            var width =  win.width() - 50;
           /* content.css({
                width : width,//this.settings.width,
                height : this.settings.height
            });*/
            wrap.css({width:width,height : this.settings.height})

        },

        /**
         * 设置位置
         */
        position : function() {
            var wWidth = (screen.width > 0) ? (window.innerWidth >= screen.width || window.innerWidth == 0) ? screen.width : window.innerWidth : window.innerWidth
            var wHeight = (screen.height > 0) ? (window.innerHeight >= screen.height || window.innerHeight == 0) ? screen.height : window.innerHeight : window.innerHeight;
            var _this = this,
                winWidth = win.width(),
                winHeight = win.height(),
                scrollTop = 0;
            var dialogtop = (winHeight - _this.dialog.height()) / 2 ;
            this.dialog.css({
                left : (winWidth - _this.dialog.width()) / 2,
                top : dialogtop
            });

            var left = parseInt(_this.dialog.css("left"));
            if(left==0){
                _this.dialog.css({"left":"7%","top":"35%"});
            }

            if(parseInt(_this.dialog.width())==0){
                _this.dialog.css({"left":"7%","top":"35%"});

            }


            if(this.settings.type=='topclose'){
                if(dialogtop>52){
                    var wrap = this.dialog.find('.m9fDialog-wrap');
                    var topclose = wrap.find('.bill-topclose');
                    var line = wrap.find('.warning-line');
                    topclose.css({top:(-52)+"px"});
                    line.css({height:23+"px",top:(-23)+"px"});
                    $(".m9fDialog").css({top:"76px"})
                }
             }else{
//              /this.dialog.append((winWidth - _this.dialog.width()) / 2+"   "+dialogtop));
             }

        },

        /**
         * 设置锁屏
         */
        lock : function() {
            if (isLock) return;

            this.lockdom = $('<div>').css({ zIndex : this.settings.zIndex }).addClass('m9fDialog-mask');
             //禁止移动背景模板
                this.lockdom.on("touchmove",function(e){
                          e.preventDefault();
                     });
            this.lockdom.appendTo('body');

            isLock = true;

        },

        /**
         * 关闭锁屏
         */
        unLock : function() {
           var _this = this;
           try{
            if (this.settings.lock) {
                if (isLock && _this.lockdom && !$(".m9fDialog")) {
                    _this.lockdom.remove();
                    isLock = false;
                }else if($(".m9fDialog-mask")){
                    if($(".m9fDialog").length==0){
                    $(".m9fDialog-mask").remove();
                    isLock = false;
                    }
                }
            }
            }catch(e){
                alert(e.message);
            }
        },

        /**
         * 关闭方法
         */
        close : function() {
            try{
                //alert("12321");
            this.dialog.remove();
            this.unLock();
           }catch(e){
            alert(e.message);
           }
        },

        /**
         * 定时关闭
         */
        time : function() {

            var _this = this;

            this.closeTimer = setTimeout(function() {
                _this.close();

                  if($.isFunction(_this.settings.autofn)){
                    _this.settings.autofn();
                  }

            }, this.settings.time);

        }

    }

    /**
     * 默认配置
     */
    Dialog.defaults = {
        theme:'black',
        // 内容
        content: '加载中...',

        // 标题
        title: '小玖提示',

        // 宽度
        width: 'auto',

        // 高度
        height: 'auto',

        // 取消按钮回调函数
        cancel: null,

        // 确定按钮回调函数
        ok: null,


        // 确定按钮文字
        okText: '',

        // 取消按钮文字
        cancelText: '',

        // 自动关闭时间(毫秒)
        time: null,

        // 是否锁屏
        lock: true,

        // z-index值
        zIndex: 9999,
        //提示类别
        type:null

    }

    var m9fDialog = function(options) {
        return new Dialog(options);
    }

      var toast = function(message,callback,second){
        try{
        if(window.toastobj){
            window.toastobj.close();
        }
         var toastobj = $.dialog({
                content : message,
                title : '',
                lock : false,
                 // 宽度
                width: 'auto',
                // 高度
                height: 'auto',
                // 自动关闭时间(毫秒)
                time: second || 2000,
                autofn:callback,
                type:'toast'
            });
        window.toastobj = toastobj;
        }catch(e){
            alert(e.message);
        }
        return toastobj;
    }



    /**
     *
     * @param {Object} message
     * @param {Object} title
     * @param {Object} btntext
     * @param {Object} height
     * @param {Object} width
     * @example customAlert("<p style='text-align:left;margin-bottom:25px'>您已逾期，若不及时还款，将被列入金融黑名单！黑名单信息会同步至全国各大银行、芝麻信用等机构，您的信用卡、房贷、车贷等业务将会同步受到影响，情节严重者将受到法律诉讼和制裁！<br/><br/>请尽快保证您尾号为0679的银行卡余额充足，系统会自动扣款。扣款成功后，您会收到短信通知，请注意查收。如有问题，请拨打客服：<a href='tel:4008108818'>400-8108818</a></p>","<i class='billicon-warning'></i>预期警告","","topclose");
     *           customAlert("若还款日您未按时还款，还款日第二天起开始计收逾期服务费，每日收取当期应还借款本息的0.1%作为逾期服务费。如果您逾期超过3天，将一次性收取当期应还本息的3%作为滞纳金。","预期说明");
     */
    var customAlert = function (message,title,btntext,callback,type,height,width) {
        var width123 = document.documentElement.clientWidth;
            title  = title ||""
            height = height||"auto"
            width = width|| "auto"
            btntext = btntext||"我知道了"
            var dia1 =  $.dialog({
                theme:'white',
                content : message,
                title : title,
                cancelText: btntext,
                cancel : callback,
                lock : true,
                height:height,
                width:width,
                type:type
            });
    }

    /**
     * @param {Object} message
     * @param {Object} title
     * @param {Object} okfun
     * @param {Object} canclefun
     * @param {Object} height
     * @param {Object} width
     * @example customConfirm("<p style='color: rgb(51, 150, 255);font-size:12px;'>完成位置信息授权才能获得信用额度</p>","允许“玖富钱包”在使用该应用程序时访问您的位置吗？",function(){},function(){});
     */
    var customConfirm = function(message,title,okText,cancelText,okfun,canclefun,height,width){
            title  = title ||""
            height = height||"auto"
            width = width|| "auto"
            $.dialog({
                theme:'white',
                content : message,
                title : title,
                cancelText: cancelText || '不允许',
                cancel : canclefun,
                okText: okText || '允许',
                ok : okfun,
                lock : true,
                height:height,
                width:width
            });
    }

    window.m9fDialog = $.m9fDialog = $.dialog = m9fDialog;
    window.dialog = {
      toast:toast,
      customConfirm:customConfirm,
      customAlert:customAlert

    }
})($, window);
