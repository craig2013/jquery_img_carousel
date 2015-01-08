;(function ( $, window, document, undefined ) {

    var pluginName = "carousel",
          defaults = {//Plugin options with default values
                autoScroll: true,
                autoScrollTime: 10000,
                direction: "left",
                imageHeight: null,
                imageWidth: null,
                sliderArrows: false,
                sliderCountDown: false,
                sliderNav: true,
                sliderNavType: "default",
                sliderPauseBtn: false,
                slideDuration: 300,
                totalImages: null,            
          };

    function Plugin( element, options ) {
        this.element = element;

        this.options = $.extend( {}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function() {
            var self = this;

            this.sliderWidth = this.options.imageWidth * this.options.totalImages;  

            $(this.element).find('.slider-visible-area .slider-slide').css('width',this.sliderWidth);

            this.setBindings();

            if (this.options.autoScroll) {
                this.autoScroll();
            }
        },

        setBindings: function() {//Set click events
            var self = this;
            $(this.element).on('click', function(e) {
                e.preventDefault();
                var $target = $(e.target)[0];
                var btnClicked = $($target).attr('class').split(' ')[0];

                if ((self.options.sliderArrows) && (btnClicked === 'slider-btn-next')) {
                    self.arrowClicked(btnClicked);
                } else if ((self.options.sliderArrows) && (btnClicked === 'slider-btn-previous')) {
                    self.arrowClicked(btnClicked);
                } else if ((self.options.sliderPauseBtn) && (btnClicked === 'slider-btn-pause')) {
                    self.pauseAutoScroll();
                } else if ((self.options.sliderPauseBtn) && (btnClicked === 'slider-btn-play')) {
                    self.resumeAutoScroll();
                } else if ((self.options.sliderNav) && (btnClicked === 'slider-number' || btnClicked === 'slider-bullet')) {
                    self.imageSelected($target);
                } 
            });
        },

        animateSlide: function($activeImg) {//Animate the slide
            var sliderNumber = $activeImg.attr('data-slideNumber') - 1;
            var sliderPosition = sliderNumber * this.options.imageWidth;
            var animateSlider = {};

            animateSlider[this.options.direction] = -sliderPosition;

            $(this.element).find('.slider-slide').animate(animateSlider, this.options.slideDuration); 
        },

        updateSliderNav: function(currentSlide) {//Update the slider navigation
            var $navObject = '';

            if (this.options.sliderNavType === 'default') { //Default number navigation
                $navObject = $(this.element).find('.slider-nav .slider-numbers .slider-number');
            } else if (this.options.sliderNavType === 'bullets') { //Bullets navigation
                $navObject = $(this.element).find('.slider-nav .slider-bullets .slider-bullet');
            }       

            $navObject.removeClass('slider-highlight-slide');

            $.each($navObject, function(i, obj) {
                if ($(obj).attr('data-slideNumber') === currentSlide) {
                    $(obj).addClass('slider-highlight-slide');
                } 
            });          
        },

        updateCounter: function(seconds) {//Update the slider counter if there is one 
            var self = this;

            if(seconds === 0) {
                $(this.element).find('.slider-nav .slider-right-nav .slider-countdown').empty().text('10');
                return;
            }

            this.counterId = setTimeout(function(){
                self.updateCounter(seconds-1);
            },1000);

            $(this.element).find('.slider-nav .slider-right-nav .slider-countdown').empty().text(seconds);
        },

        autoScroll: function(resumeAutoScrollTime) {//Auto scroll slider
            var self = this;
            resumeAutoScrollTime = (resumeAutoScrollTime===undefined)? ' ' : resumeAutoScrollTime;

            if ((typeof resumeAutoScrollTime === 'number') && (resumeAutoScrollTime >= 1)) {
                this.intervalId = setInterval(function() { 
                    self.nextImg(resumeAutoScrollTime);
                }, resumeAutoScrollTime);
            } else {
                this.intervalId = setInterval(function() { 
                    self.nextImg();
                }, this.options.autoScrollTime);                
            }

            if (this.options.sliderCountDown && !this.counterId) {
                var countDownTime = parseInt(this.options.autoScrollTime, 10) / 1000;

                this.updateCounter(countDownTime);
            }
        },

        pauseAutoScroll: function() {//Pause auto scroll 
            clearInterval(this.intervalId);

            if (this.options.sliderCountDown) {
                clearTimeout(this.counterId);
            }    
            
            if (this.options.sliderNav) {
                $(this.element).find('.slider-nav .slider-control-nav .slider-play-nav').show();
                $(this.element).find('.slider-nav .slider-control-nav .slider-pause-nav').hide();
            }                
        },

        resumeAutoScroll: function() {//Resume auto scroll
            if (this.options.sliderCountDown) {
                var countDownTime = $(this.element).find('.slider-nav .slider-right-nav .slider-countdown').text();
                var interValTime = parseInt(countDownTime) * 1000;
                var self = this;

                this.updateCounter(countDownTime);      
                this.autoScroll(interValTime);
            } else {
                this.autoScroll();
            }

            if (this.options.sliderNav) {
                $(this.element).find('.slider-nav .slider-control-nav .slider-play-nav').hide();
                $(this.element).find('.slider-nav .slider-control-nav .slider-pause-nav').show();
            }             
        },

        nextImg: function(resumeAutoScrollTime) {//Show the next image
            var $activeImg = (($(this.element).find('.slider-slide img').last().attr('class') !== undefined) && ($(this.element).find('.slider-slide img').last().attr('class').split(' ')[0] === 'active-slide'))? $(this.element).find('.slider-slide img').first() : $(this.element).find('.slider-slide img.active-slide').next();            
            resumeAutoScrollTime = (resumeAutoScrollTime===undefined)? ' ' : resumeAutoScrollTime;

            this.animateSlide($activeImg);

            $activeImg.addClass('active-slide').siblings().removeClass('active-slide');

            if (this.options.sliderNav) {
                this.updateSliderNav($activeImg.attr('data-slideNumber'));
            }

            if (this.options.sliderCountDown) {
                var countDownTime = parseInt(this.options.autoScrollTime, 10) / 1000;
                this.updateCounter(countDownTime);

                if (typeof  resumeAutoScrollTime === 'number') {
                    clearInterval(this.intervalId);
                    resumeAutoScrollTime = undefined;
                    this.autoScroll();
                }                
            }

        },

        previousImg: function() {//Show the previous image
            var $activeImg = (($(this.element).find('.slider-slide img').first().attr('class') !== undefined) && ($(this.element).find('.slider-slide img').first().attr('class').split(' ')[0] === 'active-slide'))? $(this.element).find('.slider-slide img').last() : $(this.element).find('.slider-slide img.active-slide').prev(); 

            this.animateSlide($activeImg);

            $activeImg.addClass('active-slide').siblings().removeClass('active-slide');

            if (this.options.sliderNav) {
                this.updateSliderNav($activeImg.attr('data-slideNumber'));
            }     

            if (this.options.sliderCountDown) {
                var countDownTime = parseInt(this.options.autoScrollTime, 10) / 1000;
                this.updateCounter(countDownTime);
            }            
        },

        arrowClicked: function(btnClicked) {//Determine which slider arrow clicked if an arrow exists
            if (this.options.sliderCountDown) {
                $(this.element).find('.slider-nav .slider-right-nav .slider-countdown').empty().text('10');
                clearTimeout(this.counterId);
            }

            if (btnClicked === 'slider-btn-next') {
                clearInterval(this.intervalId);
                this.nextImg();
                this.autoScroll();
            } else if (btnClicked === 'slider-btn-previous') {
                clearInterval(this.intervalId);
                this.previousImg();
                this.autoScroll();
            }
        },

        imageSelected: function($target) {//Change slider based on what slide was selected in the navigation
            var $target =  $($target);
            var imgSelected = $target.attr('data-slideNumber');

            this.animateSlide($target);    

            $(this.element).find('.visible-area .slider-slide img[data-slideNumber="'+imgSelected+'"]').addClass('active-slide').siblings().removeClass('active-slide');

            if (this.options.sliderNav) {
                this.updateSliderNav(imgSelected);
            }                 

            if (this.options.autoScroll) {
                 if (this.options.sliderCountDown) {
                    var countDownTime = parseInt(this.options.autoScrollTime, 10) / 1000;

                    $(this.element).find('.slider-nav .slider-right-nav .slider-countdown').empty().text('10');
                    clearTimeout(this.counterId);
                    this.updateCounter(countDownTime);
                    this.nextImg();
                }                 
                clearInterval(this.intervalId);
                this.autoScroll();
            }
        },        
    };

    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );