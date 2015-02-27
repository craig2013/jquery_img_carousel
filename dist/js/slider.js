;
(function ($, window, document, undefined) {

    var pluginName = 'slider',
        defaults = { //Plugin options with default values
            autoScroll: true,
            autoScrollTime: 10000,
            slideHeight: null,
            slideWidth: null,
            sliderArrows: false,
            sliderCountDown: false,
            sliderNav: true,
            sliderNavType: 'default',
            sliderPauseBtn: false,
            slideDuration: 300,
            slideDirection: 'right',
            totalSlides: null,
        };

    function Plugin(element, options) {
        this.element = element;

        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function () {

            this.setBindings();

            if (this.options.autoScroll) {
                this.autoScroll();
            }

            if (this.options.sliderCountDown) {
                var countDownTime = parseInt(this.options.autoScrollTime, 10) / 1000;
                this.updateCounter(countDownTime);
            }
        },

        setBindings: function () {
            var self = this;

            $(this.element).on('click', function (e) {
                e.preventDefault();
                var $targetClicked = $(e.target);

                //If slider has a pause button
                if (self.options.sliderPauseBtn) {
                    if ($targetClicked.hasClass('slider-btn-pause')) {
                        self.pauseAutoScroll();
                    } else if ($targetClicked.hasClass('slider-btn-play')) {
                        self.resumeAutoScroll();
                    }
                }

            });
        },

        autoScroll: function () {
            this.setTimer();
        },

        setTimer: function () {
            var self = this;
            clearInterval(this.intervalId);
            this.intervalId = setInterval(function () {
                self.nextSlide();
            }, this.options.autoScrollTime);
        },

        updateCounter: function (seconds) {
            var self = this;
            var countDownTime = parseInt(this.options.autoScrollTime, 10) / 1000;

            if (seconds === 0) {
                $(this.element).find('.slider-nav .slider-right-nav .slider-countdown').empty().text(countDownTime);
                return;
            }

            this.counterId = setTimeout(function () {
                self.updateCounter(seconds - 1);
            }, 1000);

            $(this.element).find('.slider-nav .slider-right-nav .slider-countdown').empty().text(seconds);
        },

        pauseAutoScroll: function () {
            clearInterval(this.intervalId);

            if (this.options.sliderCountDown) {
                clearTimeout(this.counterId);
            }

            if (this.options.sliderNav) {
                $(this.element).find('.slider-nav .slider-control-nav .slider-play-nav').show();
                $(this.element).find('.slider-nav .slider-control-nav .slider-pause-nav').hide();
            }
        },

        resumeAutoScroll: function () {
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

        nextSlide: function () {
            var $activeSlide = $(this.element).find('.slider-slides .slider-slide.active-slide');
            var $nextSlide = ($(this.element).find('.slider-slides .slider-slide').last().hasClass('active-slide')) ? $(this.element).find('.slider-slides .slider-slide').first() : $(this.element).find('.slider-slides .slider-slide.active-slide').next();

            this.animateSlide($activeSlide, $nextSlide);

        },

        previousSlide: function () {
            //placeholder function 
        },

        animateSlide: function ($activeSlide, $nextSlide) {
            if (!Modernizr.csstransitions) { //Use jQuery .animate as fallback
                this.jsAnimation($activeSlide, $nextSlide);
            } else { //Use CSS3 transition
                this.cssAnimation($activeSlide, $nextSlide);
            }

            if (this.options.sliderNav) { //Update slider nav if it exists
                this.updateSliderNav($activeSlide, $nextSlide);
            }
        },

        updateSliderNav: function ($activeSlide, $nextSlide) {
            var $navObject = '';
            var sliderNavType = this.options.sliderNavType;
            var activeSlideNumber = $activeSlide.attr('data-slideNumber');
            var nextSlideNumber = $nextSlide.attr('data-slideNumber');

            if (sliderNavType === 'default') {
                $navObject = $(this.element).find('.slider-nav .slider-numbers');

                $navObject.find('.slider-number[data-slideNumber="' + activeSlideNumber + '"]').removeClass('slider-highlight-slide');
                $navObject.find('.slider-number[data-slideNumber="' + nextSlideNumber + '"]').addClass('slider-highlight-slide');

            } else if (sliderNavType === 'bullets') {
                $navObject = $(this.element).find('.slider-nav .slider-bullets');

                $navObject.find('.slider-bullet[data-slideNumber="' + activeSlideNumber + '"]').removeClass('slider-highlight-slide');
                $navObject.find('.slider-bullet[data-slideNumber="' + nextSlideNumber + '"]').addClass('slider-highlight-slide');
            }


        },

        cssAnimation: function ($activeSlide, $nextSlide) {
            var self = this;
            var slideDirection = this.options.slideDirection;

            $nextSlide.addClass('slider-slide-right  active-slide');
            //Animate next slide to the right so it will slide in to the left
            setTimeout(function () {
                $(self.element).addClass('slider-transition');
                $(self.element).find('.slider-slides .slider-slide').css({
                    'transition-duration': '900ms',
                    '-webkit-transition-duration': '900ms',
                    '-moz-transition-duration': '900ms',
                    '-o-transition-duration': '900ms'
                });
                $activeSlide.addClass('slider-shift-' + slideDirection);
            }.bind(this), 500);

            //Remove styles and classes that had been added
            setTimeout(function () {
                $(self.element).removeClass('slider-transition');
                $(self.element).find('.slider-slides .slider-slide').attr('style', '');
                $activeSlide.removeClass('slider-shift-' + slideDirection);
                $activeSlide.removeClass('active-slide');
                $nextSlide.removeClass('slider-slide-' + slideDirection);
                self.setTimer();
                if (self.options.sliderNav) {
                    self.updateSliderNav($activeSlide, $nextSlide);
                }
                if (self.options.sliderCountDown) {
                    var countDownTime = parseInt(this.options.autoScrollTime, 10) / 1000;
                    self.updateCounter(countDownTime);
                }
            }.bind(this), 1600);
        },

        jsAnimation: function ($activeSlide, $nextSlide) {
            var self = this;
            var animation = {};
            var animationPrev = {};
            var slideDirection = this.options.slideDirection;
            var slideDuration = this.options.slideDuration;
            var autoScrollTime = this.options.autoScrollTime;
            var $sliderSlide = $(this.element).find('.slider-slides .slider-slide');

            if (slideDirection === 'right') {
                $activeSlide.addClass('slider-js-reset-left');
            }

            animation[slideDirection] = '0%';

            animationPrev[slideDirection] = '100%';

            $activeSlide.animate(animationPrev, slideDuration);

            $nextSlide.addClass('slider-slide-right  active-slide');

            $nextSlide.animate(animation, slideDuration, 'swing', function () {
                $activeSlide.removeClass('slider-js-reset-left');
                $activeSlide.removeClass('active-slide');
                $nextSlide.removeClass('slider-slide-' + slideDirection);
                $sliderSlide.attr('style', '');
                self.setTimer();
                if (self.options.sliderCountDown) {
                    var countDownTime = parseInt(self.options.autoScrollTime, 10) / 1000;
                    self.updateCounter(countDownTime);
                }
            });
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                    new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);
