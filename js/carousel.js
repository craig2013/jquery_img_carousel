;(function ( $, window, document, undefined ) {

    var pluginName = "carousel",
        defaults = {
            autoScroll: true,
            autoScrollTime: 10000,
            direction: "left",
            height: null,
            sliderNav: true,
            width: null
        };

    function Plugin( element, options ) {
        this.element = element;

        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function() {
            var self = this;
            this.imageWidth = this.options.width;
            this.totalImages =   $(this.element).find('.visible-area .slider img').length;
            this.sliderWidth = this.imageWidth * this.totalImages;  

            $(this.element).find('.visible-area .slider').css('width',this.sliderWidth);

            this.setBindings();

            if (this.options.autoScroll) {
                this.autoScroll();
            }
        },

        setBindings: function() {
            var self = this;
            $(this.element).on('click', function(e) {
                e.preventDefault();
                var $target = $(e.target)[0];
                var btnClicked = $($target).attr('class').split(' ')[0];

                if (btnClicked === 'btn-next') {
                    self.nextImg();
                } else if (btnClicked === 'btn-previous') {
                    self.previousImg();
                } else if (btnClicked === 'btn-pause') {
                    self.pauseAutoScroll();
                } else if (btnClicked === 'btn-play') {
                    self.resumeAutoScroll();
                } else if (btnClicked === 'slider-number') {
                    self.imageSelected($target);
                }
            });
        },

        animateSlide: function($activeImg) {
            var count = $activeImg.attr('data-slideNumber') - 1;
            var sliderPosition = count * this.imageWidth;
            var currentSlide = $activeImg.attr('data-slideNumber');
            var animateSlider = {};

            animateSlider[this.options.direction] = -sliderPosition;

            $(this.element).find('.slider').animate(animateSlider, 500); 
        },

        updateSliderNav: function(currentSlide) {
            if ($(this.element).find('.slider-nav .slider-numbers')) { 
                $.each($(this.element).find('.slider-nav .slider-numbers .slider-number'), function(i, obj) {
                    if ($(obj).attr('data-slideNumber') === currentSlide) {
                        $(obj).addClass('highlight-slide-number');
                    } else {
                        $(obj).removeClass('highlight-slide-number');
                    }
                });
            }       
        },

        autoScroll: function() {
            var self = this;
            this.intervalId = setInterval(function() { 
                var time =    self.options.autoScrollTime / 1000;

                console.log(time);        
                self.nextImg();
            }, this.options.autoScrollTime); 
        },

        pauseAutoScroll: function() {
            clearInterval(this.intervalId);
            if (this.options.sliderNav) {
                $(this.element).find('.slider-nav .control-nav .play-nav').show();
                $(this.element).find('.slider-nav .control-nav .pause-nav').hide();
            }            
        },

        resumeAutoScroll: function() {
            this.autoScroll();
            if (this.options.sliderNav) {
                $(this.element).find('.slider-nav .control-nav .play-nav').hide();
                $(this.element).find('.slider-nav .control-nav .pause-nav').show();
            }             
        },

        nextImg: function() {
            var $active = (($(this.element).find('.slider img').last().attr('class') !== undefined) && ($(this.element).find('.slider img').last().attr('class').split(' ')[0] === 'active-slide'))? $(this.element).find('.slider img').first() : $(this.element).find('.slider img.active-slide').next();            

            this.animateSlide($active);

            $active.addClass('active-slide').siblings().removeClass('active-slide');

            if (this.options.sliderNav) {
                this.updateSliderNav($active.attr('data-slideNumber'));
            }
        },

        previousImg: function() {
            var $active = (($(this.element).find('.slider img').first().attr('class') !== undefined) && ($(this.element).find('.slider img').first().attr('class').split(' ')[0] === 'active-slide'))? $(this.element).find('.slider img').last() : $(this.element).find('.slider img.active-slide').prev(); 

            this.animateSlide($active);

            $active.addClass('active-slide').siblings().removeClass('active-slide');

            if (this.options.sliderNav) {
                this.updateSliderNav($active.attr('data-slideNumber'));
            }     
        },

        imageSelected: function($target) {
            var $target =  $($target);
            var imgSelected = $target.attr('data-slideNumber');

            this.animateSlide($target);    

            $(this.element).find('.visible-area .slider img[data-slideNumber="'+imgSelected+'"]').addClass('active-slide').siblings().removeClass('active-slide');

            if (this.options.sliderNav) {
                this.updateSliderNav(imgSelected);
            }                 

            clearInterval(this.intervalId);
            this.autoScroll();
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