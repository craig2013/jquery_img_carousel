/*!
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */

// the semi-colon before the function invocation is a safety
// net against concatenated scripts and/or other plugins
// that are not closed properly.
;(function ( $, window, document, undefined ) {

    // undefined is used here as the undefined global
    // variable in ECMAScript 3 and is mutable (i.e. it can
    // be changed by someone else). undefined isn't really
    // being passed in so we can ensure that its value is
    // truly undefined. In ES5, undefined can no longer be
    // modified.

    // window and document are passed through as local
    // variables rather than as globals, because this (slightly)
    // quickens the resolution process and can be more
    // efficiently minified (especially when both are
    // regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "carousel",
        defaults = {
            autoScroll: true,
            autoScrollTime: 10000,
            direction: "left",
            height: null,
            sliderNav: true,
            width: null
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        // jQuery has an extend method that merges the
        // contents of two or more objects, storing the
        // result in the first object. The first object
        // is generally empty because we don't want to alter
        // the default options for future instances of the plugin
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

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );