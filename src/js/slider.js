;
( function ( $, window, document, undefined ) {

    'use strict';

    var pluginName = 'slider',
        defaults = { //Plugin options with default values
            autoScroll: true,
            autoScrollTime: 10000,
            duration: 600,
            navigation: false,
            navigationOptions: {
                arrows: false,
                countDown: false,
                indicators: false,
                pauseBtn: false
            },
            pauseOnHover: false
        };

    function Plugin( element, options ) {
        this.element = element;

        this.options = $.extend( {}, defaults, options );

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function () {

            //Set the activeSlide to the first slide
            this.$activeSlide = $( this.element ).find( '.slider-slides .slider-slide' ).eq( 0 );

            //Set the current slide number
            this.currentSlideNumber = this.$activeSlide.attr( 'data-slideNumber' );

            //Set the number of slides
            this.totalSlides = $( this.element ).find( '.slider-slides .slider-slide' ).length;

            //Enable auto scroll if it's enabled
            if ( this.options.autoScroll ) {
                this.autoScroll();
            }

            //If slider has navigation set bindings for navigation
            if ( this.options.navigation ) {

                this.setBindings();

                if ( this.options.navigationOptions.countDown ) {
                    var countDownTime = parseInt( this.options.autoScrollTime, 10 ) / 1000;
                    this.updateCounter( countDownTime );
                }

            }

        },

        setBindings: function () {
            var self = this;

            $( this.element ).find( '.slider-play-nav .slider-btn-play' ).on( 'click', function ( e ) {
                e.preventDefault();

                self.resumeAutoScroll();
            } );

            $( this.element ).find( '.slider-pause-nav .slider-btn-pause' ).on( 'click', function ( e ) {
                e.preventDefault();

                self.pauseAutoScroll();
            } );

            //Slider has slide indicators
            $( this.element ).find( '.slider-indicators .slider-indicator' ).on( 'click', function ( e ) {
                e.preventDefault();

                self.goToSlide( $( this ) );
            } );

            //Slider has previous button enabled
            $( this.element ).find( '.slider-arrow-left .slider-btn-previous' ).on( 'click', function ( e ) {
                e.preventDefault();

                if ( self.options.autoScroll ) {
                    self.pauseAutoScroll();
                }

                self.previousSlide();
            } );

            //Slider has next button enabled
            $( this.element ).find( '.slider-arrow-right .slider-btn-next' ).on( 'click', function ( e ) {
                e.preventDefault();

                if ( self.options.autoScroll ) {
                    self.pauseAutoScroll();
                }

                self.nextSlide();
            } );

            if ( this.options.pauseOnHover ) {
                $( this.element ).on( {
                    mouseenter: function ( e ) {
                        self.pauseAutoScroll();
                    },
                    mouseleave: function ( e ) {
                        self.resumeAutoScroll();
                    }
                } );
            }
        },

        autoScroll: function () {
            this.setTimer();
        },

        setTimer: function () {
            window.clearInterval( this.intervalId );

            this.intervalId = setInterval( function () {
                this.nextSlide();
            }.bind( this ), this.options.autoScrollTime );
        },

        pauseTimer: function () {
            clearInterval( this.intervalId );

            if ( this.options.sliderCountDown ) {
                clearTimeout( this.counterId );
            }
        },

        updateCounter: function ( seconds ) {
            var countDownTime = parseInt( this.options.autoScrollTime, 10 ) / 1000;

            if ( seconds === 0 ) {
                $( this.element ).find( '.slider-nav .slider-right-nav .slider-countdown' ).empty().text( countDownTime );
                return;
            }

            window.clearTimeout( this.counterId );

            this.counterId = setTimeout( function () {
                this.updateCounter( seconds - 1 );
            }.bind( this ), 1000 );

            $( this.element ).find( '.slider-nav .slider-right-nav .slider-countdown' ).empty().text( seconds );
        },

        pauseAutoScroll: function () {
            clearInterval( this.intervalId );

            if ( this.options.navigationOptions.countDown ) {
                clearTimeout( this.counterId );
            }

            if ( this.options.navigationOptions.indicators ) {
                $( this.element ).find( '.slider-nav .slider-control-nav .slider-play-nav' ).show();
                $( this.element ).find( '.slider-nav .slider-control-nav .slider-pause-nav' ).hide();
            }
        },

        resumeAutoScroll: function () {
            if ( this.options.navigationOptions.countDown ) {
                var countDownTime = $( this.element ).find( '.slider-nav .slider-right-nav .slider-countdown' ).text();
                var interValTime = parseInt( countDownTime ) * 1000;
                var self = this;

                this.updateCounter( countDownTime );
                this.autoScroll( interValTime );
            } else {
                this.autoScroll();
            }

            if ( this.options.navigationOptions.indicators ) {
                $( this.element ).find( '.slider-nav .slider-control-nav .slider-play-nav' ).hide();
                $( this.element ).find( '.slider-nav .slider-control-nav .slider-pause-nav' ).show();
            }
        },

        previousSlide: function () {
            if ( this.currentSlideNumber > 1 ) {
                this.currentSlideNumber--;
            } else {
                this.currentSlideNumber = 3;
            }

            var $nextSlide = $( this.element ).find( '.slider-slides .slider-slide[data-slideNumber="' + this.currentSlideNumber + '"]' );

            this.animateSlide( this.$activeSlide, $nextSlide );
        },

        nextSlide: function () {
            if ( this.currentSlideNumber < this.totalSlides ) {
                this.currentSlideNumber++;
            } else {
                this.currentSlideNumber = 1;
            }

            var $nextSlide = $( this.element ).find( '.slider-slides .slider-slide[data-slideNumber="' + this.currentSlideNumber + '"]' );


            this.animateSlide( this.$activeSlide, $nextSlide );
        },

        goToSlide: function ( $slideClicked ) {
            var $activeSlide = $( this.element ).find( '.slider-slides .slider-slide.active-slide' );
            var slideNumber = $slideClicked.attr( 'data-slideNumber' );
            var $showSlide = $( this.element ).find( '.slider-slides .slider-slide[data-slideNumber="' + slideNumber + '"]' );

            if ( this.options.navigation ) {
                if ( this.options.navigationOptions.countDown ) {
                    this.pauseTimer();
                }
            }

            this.animateSlide( $activeSlide, $showSlide );
        },

        animateSlide: function ( $activeSlide, $nextSlide ) {
            if ( !this.hasCSSAnimation() ) { //Use jQuery .animate as fallback if css transitions not support
                this.jsAnimation( $activeSlide, $nextSlide );
            } else { //Use CSS3 transition
                this.cssAnimation( $activeSlide, $nextSlide );
            }
        },

        updateSliderNav: function ( $activeSlide, $nextSlide ) {
            var activeSlideNumber = $activeSlide.attr( 'data-slideNumber' );
            var nextSlideNumber = $nextSlide.attr( 'data-slideNumber' );
            var $navObject = $( this.element ).find( '.slider-nav .slider-indicators' );

            $navObject.find( '.slider-indicator[data-slideNumber="' + activeSlideNumber + '"]' ).removeClass( 'slider-highlight-slide' );
            $navObject.find( '.slider-indicator[data-slideNumber="' + nextSlideNumber + '"]' ).addClass( 'slider-highlight-slide' );
        },

        update: function ( $activeSlide, $nextSlide ) {


            if ( this.options.navigationOptions.indicators ) {
                this.updateSliderNav( $activeSlide, $nextSlide );
            }

            if ( this.options.navigationOptions.countDown ) {
                var countDownTime = parseInt( this.options.autoScrollTime, 10 ) / 1000;
                this.updateCounter( countDownTime );
            }

        },

        cssAnimation: function ( $activeSlide, $nextSlide ) {
            var slideDirection = 'right';


            /**
             *
             * The animateTimeOut variable timeout time must be less than cleanUpTimeOut time.
             *
             **/

            //Animate next slide to the right so it will slide in to the left

            setTimeout( function () {

                $( this.element ).addClass( 'slider-transition' );

                this.addCSSDuration();

                $activeSlide.addClass( 'slider-shift-' + slideDirection );

                $nextSlide.addClass( 'active-slide' );
            }.bind( this ), 100 );

            //Remove styles and classes that had been added
            //This timout speed has to be less than 1 second or 1000
            setTimeout( function () {

                $( this.element ).removeClass( 'slider-transition' );

                $activeSlide.removeClass( 'active-slide' );
                $activeSlide.removeClass( 'slider-shift-' + slideDirection );

                var activeSlideNumber = $activeSlide.attr( 'data-slideNumber' );

                this.removeCSSDuration();

                this.resetCSSAnimation( activeSlideNumber );

                if ( this.options.autoScroll ) {
                    this.setTimer();
                }

                if ( this.options.navigation ) {
                    this.update( $activeSlide, $nextSlide );
                }

            }.bind( this ), 600 );

            this.$activeSlide = $( this.element ).find( '.slider-slides .slider-slide' ).eq( this.currentSlideNumber - 1 );
        },

        addCSSDuration: function () {
            var slideDuration = this.options.duration.toString() + 'ms';
            $( this.element ).find( '.slider-slides .slider-slide' ).each( function () {
                $( this ).css( 'transition-duration', slideDuration );
            } );
        },

        removeCSSDuration: function () {
            $( this.element ).find( '.slider-slides .slider-slide' ).each( function () {
                $( this ).css( 'transition-duration', '' );
            } );
        },

        resetCSSAnimation: function ( activeSlideNumber ) {
            var $newActiveSlide = $( this.element ).find( '.slider-slides .slider-slide[data-slideNumber="' + activeSlideNumber + '"]' ).clone( true );

            $( this.element ).find( '.slider-slides .slider-slide[data-slideNumber="' + activeSlideNumber + '"]' ).replaceWith( $newActiveSlide );
        },

        jsAnimation: function ( $activeSlide, $nextSlide ) {
            var animation = {};
            var animationPrev = {};
            var autoScrollTime = this.options.autoScrollTime;
            var self = this;
            var slideDirection = 'right';
            var slideDuration = this.options.duration.toString() + 'ms';
            var $sliderSlide = $( this.element ).find( '.slider-slides .slider-slide' );

            $activeSlide.addClass( 'slider-js-reset-left' );

            animation[ slideDirection ] = '0%';

            animationPrev[ slideDirection ] = '100%';

            $activeSlide.animate( animationPrev, slideDuration );

            $nextSlide.addClass( 'slider-slide-right  active-slide' );

            $nextSlide.animate( animation, slideDuration, 'swing', function () {

                $activeSlide.removeClass( 'slider-js-reset-left' );

                $activeSlide.removeClass( 'active-slide' );

                $nextSlide.removeClass( 'slider-slide-' + slideDirection );

                $sliderSlide.attr( 'style', '' );

                if ( self.options.autoScroll ) {
                    self.setTimer();
                }

                self.update( $activeSlide, $nextSlide );

            } );
        },

        hasCSSAnimation: function () {
            var animation = false;
            var animationstring = 'animation';
            var elm = document.createElement( 'div' );
            var keyframeprefix = '';
            var domPrefixes = 'Webkit Moz O ms Khtml'.split( ' ' );
            var pfx = '';


            if ( elm.style.animationName !== undefined ) {
                animation = true;
            }

            if ( animation === false ) {
                for ( var i = 0; i < domPrefixes.length; i++ ) {
                    if ( elm.style[ domPrefixes[ i ] + 'AnimationName' ] !== undefined ) {
                        pfx = domPrefixes[ i ];
                        animationstring = pfx + 'Animation';
                        keyframeprefix = '-' + pfx.toLowerCase() + '-';
                        animation = true;
                        break;
                    }
                }
            }

            return animation;
        }
    };

    $.fn[ pluginName ] = function ( options ) {
        return this.each( function () {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName,
                    new Plugin( this, options ) );
            }
        } );
    };

} )( jQuery, window, document );
