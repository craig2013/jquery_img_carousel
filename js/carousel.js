            $.widget("nmk.carousel",{ 
                options: { 
                  visibleArea: null,   //Identifies the wrapper id used for carousel
                  wrapper: null,
                  autoScroll: null,
                  autoScrollTime: null,
                },             
                _create: function(){
                    _self = this;
                    $('.slider img:first').addClass('active');                    // Here we are assigning a class "active" to the first image in the "slider" div.
                    $('.slider-numbers .slider-number:first').addClass('highlight');    //Highlight first item is current
                 
                    this.imageWidth = $(this.options.visibleArea).width();
                    this.totalImages =   $(this.options.visibleArea+' img').size();
                    this.sliderWidth = this.imageWidth * this.totalImages;
                    
                    $(this.options.visibleArea + ' .slider').css({'width': this.sliderWidth});
                    
                    $('.slider-numbers #picture-1').addClass('highlight');
                    
                    $(this.options.wrapper + ' .slider-nav .next').click(function(e){
                       _self._next(); 
                    });
                    
                    $(this.options.wrapper + ' .slider-nav .previous').click(function(e){
                       _self._previous(); 
                    });
                    
                    if(this.options.autoScroll)
                      _self._autoScroll(this);
                    
                    
                    $(this.options.wrapper + ' .slider-nav .control-nav .pause-nav .pause-button').click(function(e){
                        _self._pauseAutoScroll(_self);
                    });

                     $(this.options.wrapper + ' .slider-nav .control-nav .play-nav .play-button').click(function(e){
                        _self._resumeAutoScroll(_self);
                    });
                     
                     $(this.options.wrapper + ' .slider-numbers .slider-number a').click(function(){
                        _self._clicked($(this).closest('div').attr('title'));
                     });
                },
                _next: function(){
                    $active = $('.slider img.active').next();                 // On click of next button, we are saving the image (next to "active" image) in a jQuery variable $active
                    if ($active.length==0)                                 // If this is the last image inside the "slider" div, and there is no image after that, then go back to the first image in "slider" div and save it in a variable $active. 
                            $active = $('.slider img:first');
                    
                    $('.slider img').removeClass('active');                   // Remove class active from the images inside slider div.
                    $active.addClass('active');                               // Add the class active to the $active (next image).
                
                    count = $active.attr('alt') -1;                       
                    sliderposition = count * this.imageWidth;                  // Here we are calculating, how much "slider" div will slide on click of next button, and we are saving it in a variable "sliderposition".
                    //console.log($active);
                    $('.slider').animate({'left': -sliderposition}, 500);     // Here we are using the jQuery animate method to slide the "slider" div.
                    
                    sliderNavPrev = $('.slider img.active').attr('alt');
                    sliderNavCur = $('.slider img.active').attr('alt');
                    
                    sliderNavPrev = ($('.slider img:first').attr('class')==='active') ? parseInt($('.slider img:last').attr('alt')) : sliderNavPrev = parseInt(sliderNavPrev)-1; 
                    
                    $('.slider-numbers div[title=picture-' + sliderNavPrev + ']').removeClass('highlight');
                    $('.slider-numbers div[title=picture-' + sliderNavCur + ']').addClass('highlight');
                },
                _previous: function(){
                    $active = $('.slider img.active').prev();                 // On click of previous button, we are saving the image (previous to "active" image) in a jQuery variable $active.
                    if ($active.length==0)                                  // If this is the first image inside the "slider" div, and there is no image before that, then go back to the last image in "slider" div and save it in a variable $active. 
                            $active = $('.slider img:last');
                            
                    $('.slider img').removeClass('active');  // Remove class active from the images inside slider div.
                    $active.addClass('active');                  // Add the class active to the $active (next image).
                    
                    count = $active.attr('alt') -1;                       
                    sliderposition = count * this.imageWidth;                  // Here we are calculating, how much "slider" div will slide on click of next button, and we are saving it in a variable "sliderposition".

                    $('.slider').animate({'left': -sliderposition}, 500);     // Here we are using the jQuery animate method to slide the "slider" div.

                    sliderNavCur = $('.slider img.active').attr('alt');
                    sliderNavPrev = $('.slider img.active').attr('alt');              
 
                    sliderNavPrev = ($('.slider img:last').attr('class')==='active') ? parseInt($('.slider img:first').attr('alt')) : sliderNavPrev = parseInt(sliderNavPrev)+1; 
                    
                    $('.slider-numbers div[title=picture-' + sliderNavPrev + ']').removeClass('highlight');
                    $('.slider-numbers div[title=picture-' + sliderNavCur + ']').addClass('highlight');                   
                },
                _clicked: function(img){
                    sliderNavCur = $('.slider img.active').attr('alt');
                    clickedImg = parseInt(img.replace('picture-',''));
                    sliderposition = (clickedImg-1) * this.imageWidth;
                    $active = $('.slider img.active');
                    
                    $active.removeClass('active');
                    
                    $('.slider').animate({'left': -sliderposition}, 500);
                    
                    $('.slider img[alt=' + clickedImg + ']').addClass('active');
                    
                    $('.slider-numbers div[title=picture-' + sliderNavCur + ']').removeClass('highlight');
                    $('.slider-numbers div[title=picture-' + clickedImg + ']').addClass('highlight');                     
                },
               _autoScroll: function(t){
                    t.intervalId = setInterval(function(){             //Change image based on autoScroll time
                        t._next();
                    }, this.options.autoScrollTime); 
                },
                _pauseAutoScroll: function(t){
                    clearInterval(t.intervalId);
                    $(t.options.wrapper + ' .slider-nav .control-nav .pause-nav').css('display','none');
                    $(t.options.wrapper + ' .slider-nav .control-nav .play-nav').css('display','block');                  
                },
                _resumeAutoScroll: function(t){
                    t._autoScroll(t);
                    $(t.options.wrapper + ' .slider-nav .control-nav .pause-nav').css('display','block');
                    $(t.options.wrapper + ' .slider-nav .control-nav .play-nav').css('display','none');                     
                }
            });