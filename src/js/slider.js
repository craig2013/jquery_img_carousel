;
( function ( $, window, document, undefined ) {

    'use strict';

    var pluginName = 'slider',
        defaults = { //Plugin options with default values
            autoScroll: true,
            autoScrollTime: 10000,
            sliderArrows: false,
            sliderCountDown: false,
            sliderNav: false,
            sliderNavType: 'default',
            sliderPauseBtn: false,
            slideDuration: 300,
            slideDirection: 'right'
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

            this.setBindings();

            if ( this.options.autoScroll ) {
                this.autoScroll();
            }

            if ( this.options.sliderCountDown ) {
                var countDownTime = parseInt( this.options.autoScrollTime, 10 ) / 1000;
                this.updateCounter( countDownTime );
            }
        },

        setBindings: function () {
            var self = this;

            $( this.element ).on( 'click', function ( e ) {
                e.preventDefault();
                var $targetClicked = $( e.target );

                if ( self.options.sliderNav ) { //slider nav is enabled

                    if ( self.options.sliderPauseBtn ) { //slider pause btn is enabled

                        if ( $targetClicked.hasClass( 'slider-btn-pause' ) ) { //slider pause btn is clicked
                            self.pauseAutoScroll();
                        } else if ( $targetClicked.hasClass( 'slider-btn-play' ) ) { //slider play btn is clicked
                            self.resumeAutoScroll();
                        }
                    }

                    if ( $targetClicked.hasClass( 'slider-indicator' ) ) { //slider nav number is clicked
                        self.goToSlide( $targetClicked );
                    }

                }

                if ( self.options.sliderArrows ) { //slider arrows is enabled

                    if ( $targetClicked.hasClass( 'slider-btn-previous' ) ) { //slider btn previous is clicked
                        self.previousSlide();
                    } else if ( $targetClicked.hasClass( 'slider-btn-next' ) ) { //slider btn next is clicked
                        self.nextSlide();
                    }

                }

            } );
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

            if ( this.options.sliderCountDown ) {
                clearTimeout( this.counterId );
            }

            if ( this.options.sliderNav ) {
                $( this.element ).find( '.slider-nav .slider-control-nav .slider-play-nav' ).show();
                $( this.element ).find( '.slider-nav .slider-control-nav .slider-pause-nav' ).hide();
            }
        },

        resumeAutoScroll: function () {
            if ( this.options.sliderCountDown ) {
                var countDownTime = $( this.element ).find( '.slider-nav .slider-right-nav .slider-countdown' ).text();
                var interValTime = parseInt( countDownTime ) * 1000;
                var self = this;

                this.updateCounter( countDownTime );
                this.autoScroll( interValTime );
            } else {
                this.autoScroll();
            }

            if ( this.options.sliderNav ) {
                $( this.element ).find( '.slider-nav .slider-control-nav .slider-play-nav' ).hide();
                $( this.element ).find( '.slider-nav .slider-control-nav .slider-pause-nav' ).show();
            }
        },

        previousSlide: function () {
            var $activeSlide = $( this.element ).find( '.slider-slides .slider-slide.active-slide' );
            var $previousSlide = ( $( this.element ).find( '.slider-slides .slider-slide' ).first().hasClass( 'active-slide' ) ) ? $( this.element ).find( '.slider-slides .slider-slide' ).last() : $( this.element ).find( '.slider-slides .slider-slide.active-slide' ).prev();

            this.animateSlide( $activeSlide, $previousSlide );
        },

        nextSlide: function () {
            var $activeSlide = $( this.element ).find( '.slider-slides .slider-slide.active-slide' );
            var $nextSlide = ( $( this.element ).find( '.slider-slides .slider-slide' ).last().hasClass( 'active-slide' ) ) ? $( this.element ).find( '.slider-slides .slider-slide' ).first() : $( this.element ).find( '.slider-slides .slider-slide.active-slide' ).next();

            this.animateSlide( $activeSlide, $nextSlide );
        },

        goToSlide: function ( $slideClicked ) {
            var $activeSlide = $( this.element ).find( '.slider-slides .slider-slide.active-slide' );
            var slideNumber = $slideClicked.attr( 'data-slideNumber' );
            var $showSlide = $( this.element ).find( '.slider-slides .slider-slide[data-slideNumber="' + slideNumber + '"]' );

            if ( this.options.sliderCountDown ) {
                this.pauseTimer();
            }

            this.animateSlide( $activeSlide, $showSlide );
        },

        animateSlide: function ( $activeSlide, $nextSlide ) {
            if ( !this.hasCSSAnimation() ) { //Use jQuery .animate as fallback
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

            if ( this.options.sliderNav ) {
                this.updateSliderNav( $activeSlide, $nextSlide );
            }

            if ( this.options.sliderCountDown ) {
                var countDownTime = parseInt( this.options.autoScrollTime, 10 ) / 1000;
                this.updateCounter( countDownTime );
            }

        },

        cssAnimation: function ( $activeSlide, $nextSlide ) {
            var self = this;
            var slideDirection = this.options.slideDirection;

            $nextSlide.addClass( 'slider-slide-right  active-slide' );
            //Animate next slide to the right so it will slide in to the left
            setTimeout( function () {
                $( self.element ).addClass( 'slider-transition' );
                $( self.element ).find( '.slider-slides .slider-slide' ).css( {
                    'transition-duration': '900ms',
                    '-webkit-transition-duration': '900ms',
                    '-moz-transition-duration': '900ms',
                    '-o-transition-duration': '900ms'
                } );
                $activeSlide.addClass( 'slider-shift-' + slideDirection );
            }.bind( this ), 500 );

            //Remove styles and classes that had been added
            setTimeout( function () {
                $( self.element ).removeClass( 'slider-transition' );
                $( self.element ).find( '.slider-slides .slider-slide' ).attr( 'style', '' );
                $activeSlide.removeClass( 'slider-shift-' + slideDirection );
                $activeSlide.removeClass( 'active-slide' );
                $nextSlide.removeClass( 'slider-slide-' + slideDirection );
                self.setTimer();
                self.update( $activeSlide, $nextSlide );
            }.bind( this ), 1600 );
        },

        jsAnimation: function ( $activeSlide, $nextSlide ) {
            var animation = {};
            var animationPrev = {};
            var autoScrollTime = this.options.autoScrollTime;
            var self = this;
            var slideDirection = this.options.slideDirection;
            var slideDuration = this.options.slideDuration;
            var $sliderSlide = $( this.element ).find( '.slider-slides .slider-slide' );

            if ( slideDirection === 'right' ) {
                $activeSlide.addClass( 'slider-js-reset-left' );
            }

            animation[ slideDirection ] = '0%';

            animationPrev[ slideDirection ] = '100%';

            $activeSlide.animate( animationPrev, slideDuration );

            $nextSlide.addClass( 'slider-slide-right  active-slide' );

            $nextSlide.animate( animation, slideDuration, 'swing', function () {
                $activeSlide.removeClass( 'slider-js-reset-left' );
                $activeSlide.removeClass( 'active-slide' );
                $nextSlide.removeClass( 'slider-slide-' + slideDirection );
                $sliderSlide.attr( 'style', '' );
                self.setTimer();
                self.update( $activeSlide, $nextSlide );
            } );
        },

        hasCSSAnimation: function () {
            var animation = false,
                animationstring = 'animation',
                keyframeprefix = '',
                domPrefixes = 'Webkit Moz O ms Khtml'.split( ' ' ),
                pfx = '',
                elm = document.createElement( 'div' );

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
