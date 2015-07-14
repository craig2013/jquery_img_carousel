;
( function ( $, window, document, undefined ) {

    'use strict';

    var pluginName = 'slider',
        defaults = { //Plugin options with default values
            autoScroll: true,
            autoScrollTime: 10000,
            duration: 900,
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



            if ( this.options.autoScroll ) {
                this.autoScroll();
            }

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

            $( this.element ).on( 'click', function ( e ) {
                e.preventDefault();
                var $targetClicked = $( e.target );

                if ( self.options.navigation ) { //slider nav is enabled
                    if ( self.options.navigationOptions.pauseBtn ) { //slider pause btn is enabled

                        if ( $targetClicked.hasClass( 'slider-btn-pause' ) ) { //slider pause btn is clicked

                            self.pauseAutoScroll();
                        } else if ( $targetClicked.hasClass( 'slider-btn-play' ) ) { //slider play btn is clicked
                            self.resumeAutoScroll();
                        }
                    }

                    if ( self.options.navigationOptions.indicators ) {
                        if ( $targetClicked.hasClass( 'slider-indicator' ) ) { //slider nav number is clicked
                            self.goToSlide( $targetClicked );
                        }
                    }
                }

                if ( self.options.navigationOptions.arrows ) { //slider arrows is enabled
                    if ( $targetClicked.hasClass( 'slider-btn-previous' ) ) { //slider btn previous is clicked
                        self.previousSlide();
                    } else if ( $targetClicked.hasClass( 'slider-btn-next' ) ) { //slider btn next is clicked
                        self.nextSlide();
                    }

                }

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
            var self = this;

            window.clearInterval( this.intervalId );

            this.intervalId = setInterval( function () {
                self.nextSlide();
            }, this.options.autoScrollTime );
        },

        pauseTimer: function () {
            clearInterval( this.intervalId );

            if ( this.options.sliderCountDown ) {
                clearTimeout( this.counterId );
            }
        },

        updateCounter: function ( seconds ) {
            var self = this;
            var countDownTime = parseInt( this.options.autoScrollTime, 10 ) / 1000;

            if ( seconds === 0 ) {
                $( this.element ).find( '.slider-nav .slider-right-nav .slider-countdown' ).empty().text( countDownTime );
                return;
            }

            window.clearTimeout( this.counterId );

            this.counterId = setTimeout( function () {
                self.updateCounter( seconds - 1 );
            }, 1000 );

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
            var currentSlideNumber = $( this.element ).find( '.slider-slides .slider-slide.active-slide' ).data( 'slidenumber' );
            var previousSlideNumber = $( this.element ).find( '.slider-slides .slider-slide.active-slide' ).prev().data( 'slidenumber' );
            var $activeSlide = $( this.element ).find( '.slider-slides .slider-slide.active-slide[data-slideNumber="' + currentSlideNumber + '"]' );
            var $previousSlide = '';

            if ( previousSlideNumber === undefined ) {
                previousSlideNumber = $( this.element ).find( '.slider-slides .slider-slide' ).length;
            }

            $previousSlide = $( this.element ).find( '.slider-slides .slider-slide[data-slideNumber="' + previousSlideNumber + '"]' );

            this.animateSlide( $activeSlide, $previousSlide );
        },

        nextSlide: function () {
            var currentSlideNumber = $( this.element ).find( '.slider-slides .slider-slide.active-slide' ).data( 'slidenumber' );
            var nextSlideNumber = $( this.element ).find( '.slider-slides .slider-slide.active-slide' ).next().data( 'slidenumber' );
            var $activeSlide = $( this.element ).find( '.slider-slides .slider-slide.active-slide[data-slideNumber="' + currentSlideNumber + '"]' );
            var $nextSlide = '';

            if ( nextSlideNumber === undefined ) {
                nextSlideNumber = 1;
            }

            $nextSlide = $( this.element ).find( '.slider-slides .slider-slide[data-slideNumber="' + nextSlideNumber + '"]' );

            this.animateSlide( $activeSlide, $nextSlide );
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
            var self = this;
            var slideDirection = 'right';
            var slideDuration = this.options.duration.toString() + 'ms';

            $nextSlide.addClass( 'slider-slide-right' );

            /**
             *
             * The animateTimeOut variable timeout time must be less than cleanUpTimeOut time.
             *
             **/

            //Animate next slide to the right so it will slide in to the left
            var animateTimeOut = setTimeout( function () {

                $( self.element ).addClass( 'slider-transition' );

                $( self.element ).find( '.slider-slides .slider-slide' ).css( {
                    'transition-duration': slideDuration,
                    '-webkit-transition-duration': slideDuration,
                    '-moz-transition-duration': slideDuration,
                    '-o-transition-duration': slideDuration
                } );

                $activeSlide.addClass( 'slider-shift-' + slideDirection );

                $nextSlide.addClass( 'active-slide' );
            }.bind( this ), 100 );

            //Remove styles and classes that had been added
            var cleanUpTimeOut = setTimeout( function () {

                $activeSlide.removeClass( 'active-slide slider-shift-' + slideDirection );

                $nextSlide.removeClass( 'slider-slide-right' );

                $( self.element ).removeClass( 'slider-transition' );

                $( self.element ).find( '.slider-slides .slider-slide' ).attr( 'style', '' );

                if ( self.options.autoScroll ) {
                    self.setTimer();
                }

                if ( self.options.navigation ) {
                    self.update( $activeSlide, $nextSlide );
                }

            }.bind( this ), 1100 );
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
