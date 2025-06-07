/*
 * flipclock
 * Version: 1.0.1 
 * Authors: @gokercebeci
 * Licensed under the MIT license
 * Demo: http://
 */

(function($) {
        var pluginName = 'flipclock';

        var optionsG;
    
        var methods = {
            pad: function(n) {
                return (n < 10) ? '0' + n : n;
            },
            time: function(date, active=true) {

                if(active){
                         
                    var e = new Date(date);
                    var b = new Date();
                    var distance = e.getTime() - b.getTime();
                    var days = '00';
                    var hours = '00';
                    var minutes = '00';
                    var seconds = '00';

                    if (distance > 0) {            
                        // Time calculations for days, hours, minutes and seconds
                        days = Math.floor(distance / (1000 * 60 * 60 * 24));
                        days = (days < 10 ? '0' : '') + days;
                        console.log(days);
                        hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        hours = (hours < 10 ? '0' : '') + hours;
                        minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                        minutes = (minutes < 10 ? '0' : '') + minutes;
                        seconds = Math.floor((distance % (1000 * 60)) / 1000);
                        seconds = (seconds < 10 ? '0' : '') + seconds;
                    }else{
                        optionsG.onEnded();
                    }
                    /* if(zero){
                        t= '00000000000000';
                    } */
                    
                    return {
                        
                        'Y': {'d2': '0', 'd1': '0'},
                        'M': {'d2': '0', 'd1': '0'},
                        'D': {'d2': days.charAt(0), 'd1': days.charAt(1)},
                        'h': {'d2': hours.charAt(0), 'd1': hours.charAt(1)},
                        'm': {'d2': minutes.charAt(0), 'd1': minutes.charAt(1)},
                        's': {'d2': seconds.charAt(0), 'd1': seconds.charAt(1)}
                    };
                }
            },
            play: function(c) {
                
                $('body').removeClass('play');
                var a = $('#flip-'+this.id + c + ' section.active');
                if (a.html() == undefined) {
                    a = $('#flip-'+this.id + c + ' section').eq(0);
                    a.addClass('ready')
                            .removeClass('active')
                            .next('section')
                            .addClass('active')
                            .closest('body')
                            .addClass('play');
    
                }
                else if (a.is(':last-child')) {
                    $('#flip-'+this.id + c + ' section').removeClass('ready');
                    a.addClass('ready').removeClass('active');
                    a = $('#flip-'+this.id + c + ' section').eq(0);
                    a.addClass('active')
                            .closest('body')
                            .addClass('play');
                }
                else {
                    $('#flip-'+this.id + c + ' section').removeClass('ready');
                    a.addClass('ready')
                            .removeClass('active')
                            .next('section')
                            .addClass('active')
                            .closest('body')
                            .addClass('play');
                }
            },
            // d1 is first digit and d2 is second digit
            ul: function(c, d2, d1) {
                this.id = Math.round(Math.random()*1000);
                return '<ul id="flip-'+this.id+'" class="flip ' + c + '">' + this.li('d2', d2) + this.li('d1', d1) + '</ul>';
            },
            li: function(c, n) {
                //
                return '<li class="' + c + '"><section class="ready"><div class="up">'
                        + '<div class="shadow"></div>'
                        + '<div class="inn"></div></div>'
                        + '<div class="down">'
                        + '<div class="shadow"></div>'
                        + '<div class="inn"></div></div>'
                        + '</section><section class="active"><div class="up">'
                        + '<div class="shadow"></div>'
                        + '<div class="inn">' + n + '</div></div>'
                        + '<div class="down">'
                        + '<div class="shadow"></div>'
                        + '<div class="inn">' + n + '</div></div>'
                        + '</section></li>';
            }
        };
        const myDate = new Date();
        const newDate = new Date(myDate);
        newDate.setHours(newDate.getHours() + 1);
        
        var defaults = {
            fulltime : false,
            days: false,
            time: newDate.toString(),
            static : false,
            active: true,
            onEnded: function(){},
        };
        function Plugin(element, options) {
            this.element = element;
            //this.options = options;
            this.options = $.extend({}, defaults, options);
            optionsG = this.options;
            // this._defaults = defaults;
            this._name = pluginName;
            this.init();
            
        }
        Plugin.prototype = {
            init: function() {
                var t, full = this.options.fulltime;
                var days = this.options.days;
                
                if (!this.options.time || this.options.time == 'clock') {
    
                    t = methods.time();
    
                } else if (this.options.time == 'date') {
    
                    t = methods.time();
    
                } else {
                    t = methods.time(this.options.time, this.options.active);
    
                }
    
                $(this.element)
                        .addClass('flipclock')
                        .html(
                            (days ? 
                                '<div class="content-number">'
                                +'<small>Días</small>'                        
                                +methods.ul('day', t.D.d2, t.D.d1)
                                +'</div>'
                                +'<span class="flip-clock-divider seconds">'
                                +'<span class="flip-clock-dot top"></span>'
                                +'<span class="flip-clock-dot bottom"></span>'
                                +'</span>'
                                : '')
                        +(full ?
                            '<div class="content-number">'
                            +'<small>Horas</small>'                        
                            +methods.ul('hour', t.h.d2, t.h.d1)
                            +'</div>'
                            +'<span class="flip-clock-divider seconds">'
                            +'<span class="flip-clock-dot top"></span>'
                            +'<span class="flip-clock-dot bottom"></span>'
                            +'</span>'
                            : '')                        
                        +'<div class="content-number">'
                        +'<small>Minutos</small>'  
                        + methods.ul('minute', t.m.d2, t.m.d1)
                        +'</div>'
                        +(days ? methods.ul('second', t.s.d2, t.s.d1): 
                        '<span class="flip-clock-divider seconds">'
                        +'<span class="flip-clock-dot top"></span>'
                        +'<span class="flip-clock-dot bottom"></span>'
                        +'</span>'                        
                        +'<div class="content-number">'
                        +'<small>Segundos</small>'  
                        + methods.ul('second', t.s.d2, t.s.d1)
                        +'</div>')
                        + '<audio id="flipclick">'
                        + '<source src="https://github.com/gokercebeci/flipclock/blob/master/js/plugins/flipclock/click.mp3?raw=true" type="audio/mpeg"/>'
                        + '</audio>');
                        if(days){

                            $('.second').css('display', 'none')
                        }
                if(!this.options.static){
                    setInterval($.proxy(this.refresh, this), 1000);
                }else{
                    this.refresh();
                }
    
            },
            refresh: function() {
                var el = $(this.element);
                var t;
                if (this.options.time
                    && this.options.time != 'clock'
                    && this.options.time != 'date') {
                        
                        t = methods.time(this.options.time/* , this.options.zero */);
                    } else
                    t = methods.time();
    
                // second sound
                setTimeout(function() {
                    /* var promise= document.getElementById('flipclick').play();

                    if (promise !== undefined) {
                        promise.then(_ => {
                        // Autoplay started!
                            // second first digit
                        }).catch(error => {
                            // Autoplay was prevented.
                            // Show a "Play" button so that user can start playback.
                        });
                    } */
                    el.find(".second .d1 .ready .inn").html(t.s.d1);
                    methods.play('.second .d1');
                    // second second digit
                    if ((t.s.d1 === '0')) {
                        el.find(".second .d2 .ready .inn").html(t.s.d2);
                        methods.play('.second .d2');
                        // minute first digit
                        if ((t.s.d2 === '0')) {
                            el.find(".minute .d1 .ready .inn").html(t.m.d1);
                            methods.play('.minute .d1');
                            // minute second digit
                            if ((t.m.d1 === '0')) {
                                el.find(".minute .d2 .ready .inn").html(t.m.d2);
                                methods.play('.minute .d2');
                                // hour first digit
                                if ((t.m.d2 === '0')) {
                                    el.find(".hour .d1 .ready .inn").html(t.h.d1);
                                    methods.play('.hour .d1');
                                    // hour second digit
                                    if ((t.h.d1 === '0')) {
                                        el.find(".hour .d2 .ready .inn").html(t.h.d2);
                                        methods.play('.hour .d2');
                                        // day first digit
                                        if ((t.h.d2 === '0')) {
                                            el.find(".day .d1 .ready .inn").html(t.D.d1);
                                            methods.play('.day .d1');
                                            // day second digit
                                            if ((t.D.d1 === '0')) {
                                                el.find(".day .d2 .ready .inn").html(t.D.d2);
                                                methods.play('.day .d2');
                                                
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                }, 500);

    
    
            },
            finish: function (){
                console.log('finish');
            }
        };
    
        $.fn[pluginName] = function(options) {
            return this.each(function() {
                if (!$(this).data('plugin_' + pluginName)) {
                    $(this).data('plugin_' + pluginName,
                            new Plugin(this, options));
                }
            });
        };

        $.fn[pluginName].finish = function() {
            this.options.finish();
        }
    
    })(typeof jQuery !== 'undefined' ? jQuery : Zepto);
    
    
    // RUN
    /* $('#container').flipclock(); */
    