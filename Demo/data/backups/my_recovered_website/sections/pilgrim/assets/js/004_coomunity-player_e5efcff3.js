(function ( $ ) {
 
    $.fn.CoomUnityPlayer = function( options ) {
 
        var version = "0.0.0.2";
        var settings = $.extend({
            // These are the defaults.
            //id del video
            source_id: null,
            //Nombre del video
            friendly_name: "CoomÜnity Player",
            //Donde comienza el video después del tráiler
            starting_time: 0,
            //Se puede saltar o no el video
            skippable: 0,
            //Arreglo de preguntas
            questions: [],
            //Si se quiere imprimir cada acción del usuario si está en true
            debug: false,
            color: '#e91e63',
            //El resumen de las ondas que ganaste en el video
            rewards: [],
            //Al inicio del video
            trailers: [],
            uid: null,
            // Tiempo de espera después de responder
            liveliness: 3000,
            //Tiempo cuando se muestra el resumen
            closing_summary: null,
            //Código del video en Vimeo que permite embeberlo en un sitio externo
            auth_code: "",
            //Forzar a landscape
            forceLandscape: true,
            //Indica que se actualiza la página al terminar el resumen de ondas ganadas
            reloadable: "1",
            // Eventos
            onEnded: function() {},
            onPlay: function() {},
            onPause: function() {},
            //Si tiene vibras
            vibras: false,
            //Obligatorio en caso de vibras, debe contener el arreglo de la información del usuario actual
            user: null,
            //Cuando se ve el resumen y el botón de continuar apunta a otra URL
            url_closing: null,
            player: 'pilgrim'
        }, options );

        // Variable que notifica si está reproduciendo o no
        var _isPlaying = false;
		var player;
		var loading = null;
        
        var self = this;
		
		// Obtenemos la data guardada
		var dataStorage = localStorage.CoomUnityPlayer;
		dataStorage = dataStorage ? dataStorage : "{}";
		var jsonStorage = JSON.parse(dataStorage);
		

		// Intérvalo de tiempo para guardar el segundo en el que está viendo el video el usuario
		var intervalSeen = null;

        if(settings.source_id){

            loadStyle('/assets/css/coomunity-player.css?v='+version);
            loadScript('/assets/plugins/percircle/percircle.js?v='+version, () => {});
            loadStyle('/assets/plugins/percircle/percircle.css?v='+version);

			// Se verifica si se guardó la data o si es nuevo video
			if(jsonStorage[settings.source_id] == undefined){
				jsonStorage[settings.source_id] = {};
				saveDataLocalStorage();
			}

            var options = {
				controls: true,
                id: settings.source_id,
                url: 'https://vimeo.com/'+settings.source_id+'/'+settings.auth_code,
                password: 'coomunity'
            };
            
            //console.log(options);
            
            player = new Vimeo.Player( $(self)[0], options );            

            player.ready().then(function() {

                
				logDebug("Ready");
				if(jsonStorage[settings.source_id].video != undefined && jsonStorage[settings.source_id].video.time != undefined){
					player.setCurrentTime(jsonStorage[settings.source_id].video.time);
				}

                var onFinishLoadHammer = function() {
                    addPlay();
                };

                loadScript('/assets/plugins/hammer/hammer.min.js?v='+version, onFinishLoadHammer);

                

                
                // Recorremos las preguntas y luego las pasamos al cuePoint para que ejecute una acción cuando llegue al segundo
                settings.questions.forEach(function (question) {
                    var time = parseInt(question.pop_time);
                    /* if(time == 66){
                        player.addCuePoint( 20 , {options: question, type: 'question'});
                    } */
                    player.addCuePoint( time , {options: question, type: 'question'});
                    logDebug("Question: ", question);
                    //logDebug("Key: ", key);
                });

                settings.trailers.forEach(function (trailer) {
                    var time = parseInt(trailer.pop_time);
                    player.addCuePoint( time , {options: trailer, 'type': 'trailer'});

                    if(trailer.starting_time > 0){
                        player.addCuePoint( (trailer.starting_time - 1) , {options: trailer, 'type': 'removeTrailer'});
                    }

                    logDebug("Trailer: ", trailer);
                    //logDebug("Key: ", key);
                });


                if(settings.closing_summary && settings.closing_summary > 0){
                    //player.addCuePoint( 2 , {options: [], 'type': 'closing'});
                    player.addCuePoint( settings.closing_summary , {options: [], 'type': 'closing'});
                    //player.addCuePoint( 15 , {options: [], 'type': 'closing'});
                }

                if(settings.vibras && settings.user){
                    setupVibras();
                }

            });
            
			
			player.on('bufferstart', function(data) {
				//player.pause();
				showLoading();
			});

			player.on('bufferend', function(data) {
				//player.play();
				hideLoading();
			});
            
            player.on( 'play', function( data ) {
                _isPlaying = true;
                logDebug("Play");
                $(self).children('.cp-play').remove();
				addPause();

				// Intérvalo que guarda el tiempo transcurrido en el video
				intervalSeen = setInterval(function() {
					saveCurrentTime();
                }, 10000);
                
                settings.onPlay.call(this);
			});
            
            player.on( 'ended', function( data ) {
                _isPlaying = false;
                logDebug("End");
                $(self).children('.cp-pause').remove();
				addPlay();
                clearInterval(intervalSeen);
                
                if(settings.closing_summary == null){
                    createClosing(false, settings.reloadable != null);
                }

                settings.onEnded.call(this);

            });

            player.on( 'pause', function( data ) {
                
                _isPlaying = false;
                $(self).children('.cp-pause').remove();
                addPlay();
				logDebug("Pause");
                clearInterval(intervalSeen);
                settings.onPause.call(this);
            });

            player.on('cuepoint', function(data) {
                logDebug("Cuepoint: ", data);
                var options = data.data.options;
                var type = data.data.type;

                if(type == 'question'){
                    //player.pause();
                    createQuestion(options);
                }else if(type == 'trailer'){
                    //player.pause();
                    createTrailer(options);
                }else if(type == 'closing'){
                    //player.pause();
                    createClosing();
                }else if(type == 'removeTrailer'){
                    //player.pause();
                    removeTrailer(options);
                }

            });

            if(settings.forceLandscape){
                addForceHorizontal();
            }


            if(settings.player == "cinema"){
                addBackButton();
            }
        }

        function addBackButton(){
			$('body').append(
				'<div class="cp-back-button">\
                    <a href="/'+settings.player+'/'+settings.uid+'" class="text-white"><i class="material-icons">arrow_back_ios</i></a>\
				</div>'
			);
		}
        

        function setupVibras(){

            // El lapso en el que se envían las peticiones
            var lapse = 10;
            // El lapso de tiempo transcurrido
            var time_lapse = 0;
            // Arreglo que guarda todas las vibras de otros usuarios
            var arrayVibes = {"vibes": [], "lapso": {"inicio": 99999999999999999999, "fin": 999999999999999999999}, "recorrido": true, "mostradas": true};
            // Variable que guarda el setInterval
            var intetvalVideo;
            

            // Tiempo maximo de vibras en segundos
            var maxVibesTime = 10*60;
            // Tiempo en la barra de vibras
            var vibesTime = maxVibesTime / 2;
            // Tiempo que suma al dar vibra
            var moreVibesTime = 30;

            var vibrasUsuario = [];

            if(jsonStorage[settings.source_id].video != undefined && jsonStorage[settings.source_id].video.vibesTime != undefined){
                vibesTime = jsonStorage[settings.source_id].video.vibesTime;
                //console.log(vibesTime);
                setTimeout(() => {
                    setVibesProgress();
                }, 500);
            }
            
            player.on( 'ended', function( data ) {
                clearInterval(intetvalVideo);
				_isPlaying = false;
            });
            player.on( 'pause', function( data ) {
                clearInterval(intetvalVideo);
				_isPlaying = false;
            });
            player.on( 'play', function( data ) {
                
                setTimeout(() => {
                    closeFullscreen();
                    setTimeout(() => {
                        player.play();                                
                    }, 500);
                }, 50);
                intetvalVideo = setInterval(intervalVideoFunction, 500);
                _isPlaying = true;
            });

            function addVibes(){
                if((vibesTime + moreVibesTime) < maxVibesTime){
                    vibesTime += moreVibesTime;
                    setVibesProgress();
                    if(!_isPlaying){
                        player.play();
                    }
                }else if((maxVibesTime - vibesTime) <= moreVibesTime){
                    vibesTime = maxVibesTime;
                    setVibesProgress();
                }
            }
    
            function subtractVibes(vibes = 10){
                if(vibesTime >= 10){
                    vibesTime -= vibes;
                    setVibesProgress();
                }else{
                    setVibesProgress();
                    vibesTime = 0;
                }
            }
    
            function setVibesProgress(){
                
                if(jsonStorage[settings.source_id].video == undefined){
                    jsonStorage[settings.source_id].video = {vibesTime: vibesTime};
                }else{
                    jsonStorage[settings.source_id].video.vibesTime = vibesTime;
                }
                saveDataLocalStorage();
    
                if(vibesTime > 0){
                    $('.overlay-vibras-mensaje').addClass('hidden');
                    var percentage = (vibesTime / maxVibesTime) * 100;
                    $('.progress-vibra').width(percentage+"%");
                    var min = Math.round(vibesTime/60);
                    $('.progress-vibra').html(min+"min");
    
                }else{
                    $('.progress-vibra').width(0);
                    $('.progress-vibra').html("0min");
                    $('.overlay-vibras-mensaje').removeClass('hidden');
                    setTimeout(() => {
                        player.pause();					
                    }, 200);
                }
            }
    
            function intervalVideoFunction() {
                player.getCurrentTime().then(function(seconds) {
                    var current = Math.round(seconds);
                
                    var lapse_current = Math.round(current/lapse);
        
        
                    if(typeof arrayVibes.vibes[current] !== 'undefined' && !arrayVibes.vibes[current].mostradas){
                        arrayVibes.vibes[current].mostradas = true;
                        console.log(arrayVibes.vibes[current]);
                        var time_out = 0;
                        var count = arrayVibes.vibes.length;
                        //console.log(count, arrayVibes);
                        jQuery(arrayVibes.vibes[current].images).each(function(i, item){
                            var src = item;
                            time_out += 200;
                            addCircleImage(src, time_out, true, i, count);
                        });
                    }
        
                    
        
                    if(lapse_current >= time_lapse && current % lapse == 0){
                        subtractVibes();
                        time_lapse = lapse_current + 1;
        
                        //console.log(time_lapse, vibrasUsuario);
                        $.ajax({
                            method: "POST",
                            url: "/spectator/vibes/"+settings.uid,
                            data: {
                                json: JSON.stringify({
                                "vibras": vibrasUsuario,
                                "segundos": {
                                    "inicio": current,
                                    "fin": current + lapse - 1
                                }
                            })	
                            }
                        })
                        .done(function( response ) {
                            if(response.vibes){
                                arrayVibes = response;
                            }
                        });
                        vibrasUsuario = [];
                    }
                });
    
            }
            function addCircleImage(src, time_out, mostrada = true, i = 0, count = -1){
                setTimeout(() => {
                    var n = getRandomInt(1, 4);
                    var v = jQuery('.vibras-footer').append('<div class="vibra-animada anim-'+n+'"><img src="'+src+'"></div>').children('div:last-child');
                    setTimeout(() => {
                        v.remove();
                        if((i+1) >= count){
                            if(mostrada){
                                arrayVibes.mostradas = true;
                            }
                        } 
                    }, 3800);
                }, time_out);
            }
            function getRandomInt(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }


            loadStyle('/assets/css/vibras.css?v='+version);

            var overlay_vibras = jQuery('<div/>', {
                class: 'overlay-vibras-mensaje hidden',
                html: '<h3>Toca Vibrä para seguir viendo la peli.</h3>'
            }).insertAfter(self);

            var progress_vibras = jQuery('<div/>', {
                class: 'container-progress-vibra',
                html: '<div class="progress-vibra">5min</div>'
            }).insertAfter(self);

            
            var vibras_footer = jQuery('<div/>', {
                class: 'vibras-footer',
            }).insertAfter($(self).parent());
            
            
            var cont_btn_vibras = jQuery('<div/>', {
                class: 'cont-btn-vibras',
            }).insertAfter($(self).parent());

            var btn_vibras = jQuery('<div/>', {
                class: 'btn-vibras',
                html: '<img class="img-fluid" src="/assets/img/plaza/vibras.png"/>'
            }).bind('click', function(){
                if(_isPlaying || (vibesTime <= moreVibesTime)){
					
					addVibes();
                    player.getCurrentTime().then(function(seconds) {
                        var current = Math.round(seconds);
                        //console.log(current);
                        vibrasUsuario.push(current);

                        $(this).removeClass('vibrar-1');
                        $(this).addClass('vibrar-1');
                        if ('vibrate' in navigator) {
                            navigator.vibrate([200, 100, 200, 100]);
                        }
                        addCircleImage(_user.picture, 0);
                        setTimeout(() => {
                            $(this).removeClass('vibrar-1');
                        }, 500);
                    });
				}
            }).appendTo(cont_btn_vibras);


        }


        function hideLoading(){
            if(loading){
                loading.remove();					
            }
            logDebug("Fin cargando");
        }

        function showLoading(){
            loading = jQuery('<div/>', {
                class: 'cp-overlay cp-loading',
                html: '<img src="/assets/img/cp/cp_loading.svg">',
            }).insertAfter(self);
            logDebug("Cargando");
        }

		function addForceHorizontal(){
			$('body').append(
				'<div class="cp-overlays hide-ios-landscape">\
					<div class="coo-overlay portrait">\
						<div class="coo-top-screen">\
							<img src="/assets/img/go/icon-turn-h.png"/>\
						</div>\
						<div class="coo-mid-screen text-center">\
							<h2 class="text-rose mt-0">Gira tu teléfono</h2>\
							<p>Confía en nosotros, tendrás una<br>mejor experiencia</p>\
							<p class="mt-2 p-4" style="font-size: 16px; font-weight: 400;">Verifica que tengas esta opción <span> <br><img style="max-width:24px" src="/assets/img/rotate.png" alt=""></span> habilitada en tu celular.</p>\
							<!-- <button onclick="setFullScreen();" id="sender-submit-button" type="submit" class="btn btn-rose btn-round btn-lg mt-4 hide-ios">Gö!</button> -->\
						</div>\
						<div class="coo-bottom-screen pb-5">\
							<img src="/assets/img/logo-simbolo.png"/>\
						</div>\
					</div>\
				</div>'
			);
		}
        
        /* function resetCurrentTime(){
            jsonStorage[settings.source_id].video = {time: 0};
			saveDataLocalStorage();
        } */
		function saveCurrentTime(){
			player.getCurrentTime().then(function(seconds) {
                if(jsonStorage[settings.source_id].video == undefined){
                    jsonStorage[settings.source_id].video = {time: seconds};
                }else{
                    jsonStorage[settings.source_id].video.time = seconds;
                }
				saveDataLocalStorage();
			});
		}

        

        function createClosing(showClosing = true, reload = true){

            showLoading();

			var url_closing = "/video/complete/"+settings.uid;

			if(settings.url_closing){
				url_closing = settings.url_closing;
			}

            $.ajax({
                method: "GET",
                url: url_closing,
            })
            .done(function( response ) {
                hideLoading();
                if(response.error){
                    setTimeout(() => {
                        createClosing(showClosing, reload);
                    }, 1000);
                }else{

                    if(showClosing == false){
                        if(reload && settings.player != "cinema"){
                            location.reload();
                        }else if(settings.player == "cinema"){
							location.href = "/cinema/"+settings.uid;
						}
                        return;
                    }

                    var element_closing = jQuery('<div/>', {
                        class: 'cp-overlay cp-closing',
                    }).appendTo(self);

                    
                    var element_pie = jQuery('<div/>', {
                        class: 'cp-element-pie',
                    }).appendTo(element_closing);

                    var id_pie = Math.floor(Math.random() * 999);

                    var pie_wrapper = jQuery('<div/>', {
                        class: 'cp-pie-wrapper',
                    }).appendTo(element_pie);


                    var percircle = jQuery('<div/>', {
                        class: 'red',
                        id: 'percircle-'+id_pie+'',
                    }).appendTo(pie_wrapper);

                    setTimeout(() => {

                        var correctas = parseInt((response.reward.length > 0 ? response.reward[0].reward_value : 0));
                        var total = parseInt(settings.rewards[0].reward_value);
						var percent = correctas == 0 ? 0 : ( correctas / total) * 100;

                        $("#percircle-"+id_pie).percircle({
                            //text: +'/<small>'+settings.rewards[0].reward_value+"</small>",
                            text: correctas+'/<small>'+total+"</small>",
                            percent: percent
                        });
                    }, 100);

                    

                    var bottom_section = jQuery('<div/>', {
                        class: 'cp-bottom-section',
                    }).appendTo(element_closing);

                    var left_btn = jQuery('<button/>', {
                        class: 'cp-btn cp-btn-other btn btn-primary btn-rose',
                        html: 'Siguiente video',
                    }).bind('click', function(){
                        logDebug("Click Siguiente");
                        //element_closing.remove();
						if(settings.player != "cinema"){
                            location.reload();
                        }else{
							location.href = "/cinema/"+settings.uid;
						}
                        //clickBtnTrailer(trailer, element_trailer);
                    }).appendTo(bottom_section);

                    

                }
                 logDebug("Response: ", response);
            });


        } 

        function loadStyle(url){
            var file = location.pathname.split( "/" ).pop();

            var link = document.createElement( "link" );
            link.href = url;
            link.type = "text/css";
            link.rel = "stylesheet";
            link.media = "screen,print";

            document.getElementsByTagName( "head" )[0].appendChild( link );
        }

        function loadScript(url, callback)
        {
            // Adding the script tag to the head as suggested before
            var head = document.head;
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;

            // Then bind the event to the callback function.
            // There are several events for cross browser compatibility.
            script.onreadystatechange = callback;
            script.onload = callback;

            // Fire the loading
            head.appendChild(script);
        }

        function createTrailer(trailer, rewards){

            

            var element_trailer = jQuery('<div/>', {
                class: 'cp-overlay cp-trailer cp-trailer-'+trailer.id,
            }).appendTo(self);

            var top_section = jQuery('<div/>', {
                class: 'cp-top-section',
            }).appendTo(element_trailer);


            var subtitle = jQuery('<div/>', {
                class: 'cp-sub-title',
                html: '<h5>'+'Subtítulo'+'</h5>'
            }).appendTo(top_section);

            var title = jQuery('<div/>', {
                class: 'cp-title',
                html: '<h3>'+trailer.title+'</h3>'
            }).appendTo(top_section);

            var duration = jQuery('<div/>', {
                class: 'cp-duration',
                html: '<p>'+trailer.duration+'</p>'
            }).appendTo(top_section);

            var ondas = jQuery('<div/>', {
                class: 'cp-ondas',
                html: '<h4>Öndas disponibles: '+settings.rewards[0].reward_value+'</h4>'
            }).appendTo(top_section);



            var bottom_section = jQuery('<div/>', {
                class: 'cp-bottom-section',
            }).appendTo(element_trailer);


            var bottom_left = jQuery('<div/>', {
                class: 'cp-bottom-btn cp-bottom-left',
            }).appendTo(bottom_section);

            var left_btn = jQuery('<button/>', {
                class: 'cp-btn cp-btn-go btn btn-primary',
                html: 'Go',
            }).bind('click', function(){
                logDebug("Click Go");
                element_trailer.remove();
                clickBtnTrailer(trailer, element_trailer);
            }).appendTo(bottom_left);

            if(trailer.skippable != "0"){
                var bottom_right = jQuery('<div/>', {
                    class: 'cp-bottom-btn cp-bottom-right',
                }).appendTo(bottom_section);
    
                var left_btn = jQuery('<button/>', {
                    class: 'cp-btn cp-btn-next btn btn-secondary',
                    html: 'Next',
                }).bind('click', function(){
                    logDebug("Click Next");
                    element_trailer.remove();
                    clickBtnTrailer(trailer, element_trailer, true);
                }).appendTo(bottom_right);
            }


            //player.addCuePoint( trailer.starting_time , {options: options, 'type': 'removeTrailer'});

            /* setTimeout(function(){
                if(element_trailer){
                    element_trailer.remove();
                    player.play();
                }
            }, 8000); */


        }

        function removeTrailer(trailer){
            if(jQuery('.cp-trailer-'+trailer.id).length > 0){
                jQuery('.cp-trailer-'+trailer.id).remove();
                player.play();
            }
        }

        function clickBtnTrailer(trailer, element_trailer, next = false){

            if(!next){
                player.setCurrentTime(trailer.starting_time);
                player.play();
            }else{
                $.ajax({
                    method: "GET",
                    url: "/video/skip/" + settings.uid,
                })
                .done(function( response ) {
                    if(response.error){

                    }else{
						if(settings.player != "cinema"){
                            location.reload();
                        }else if(settings.player == "cinema"){
							location.href = "/cinema/"+settings.uid;
						}
                        /* location.reload(); */
                    }
                    logDebug("Response: ", response);
                });
            }

            if(element_trailer){
                element_trailer.remove();
            }

        }


        function createQuestion(question){

			if(jsonStorage[settings.source_id].questions != undefined){
				// pregunta ya respondida
				if(jsonStorage[settings.source_id].questions[question.id] == true ){
					return;
				}else{
					jsonStorage[settings.source_id].questions[question.id] = false;
				}
			}else{
				jsonStorage[settings.source_id].questions = {};
				jsonStorage[settings.source_id].questions[question.id] = false;
			}

			saveDataLocalStorage();

            self.children('.cp-question').remove();

            var answered = false;
            
            var element_question = jQuery('<div/>', {
                class: 'cp-overlay cp-question',
            }).appendTo(self);

            var statement = jQuery('<div/>', {
                class: 'cp-statement',
                html: question.statement ? question.statement : "",
            }).appendTo(element_question);

            // Falta por hacer
            var waiting_time = parseInt(question.waiting_time);
            //var waiting_time = 160;

            logDebug("Waiting time: ", waiting_time);

            var waiting_interval = null;
            if(waiting_time > 0){
                var waiting = jQuery('<div/>', {
                    class: 'cp-waiting',
                }).appendTo(element_question);

                var timer_waiting = jQuery('<div/>', {
                    class: 'cp-timer',
                    html: '<h5>'+waiting_time+'</h5>',
                }).appendTo(waiting);

                waiting_interval = setInterval(() => {
                    logDebug("Waiting time - Interval: ", waiting_time);
                    waiting_time -= 1;
                    waiting.html(
                        jQuery('<div/>', {
                            class: 'cp-timer',
                            html: '<h5>'+waiting_time+'</h5>',
                        })
                    );
                    if(waiting_time == 0){
                        clearInterval(waiting_interval);
                        element_question.remove();
                        player.play();
                    }

                }, 1000);

            }else{
                player.pause();
            }

            var container_options = jQuery('<div/>', {
                class: 'cp-container-options'
            }).appendTo(element_question);

            var option_a = jQuery('<div/>', {
                class: 'cp-option cp-option-a',
                html: question.option_a,
            }).bind('click', function(){
                if(answered){
                    return;
                }
                logDebug("Click Option A");
                answered = true;
                clickOption("A", question, element_question, waiting_interval);
            }).appendTo(container_options);

            var option_b = jQuery('<div/>', {
                class: 'cp-option cp-option-b',
                html: question.option_b,
            }).bind('click', function(){
                if(answered){
                    return;
                }
                answered = true;
                logDebug("Click Option B");
                clickOption("B", question, element_question, waiting_interval);
            }).appendTo(container_options);           


            

		}
		
		function saveDataLocalStorage(){
			localStorage.setItem('CoomUnityPlayer', JSON.stringify(jsonStorage));
		}

        function clickOption(option, question, element_question, waiting_interval){

            showLoading();
            if(waiting_interval){
                clearInterval(waiting_interval);                
            }

            

            var _option = option == "A" ? "option_a" : "option_b";

            $.ajax({
                method: "GET",
                url: "/video/answer/"+settings.uid+"/"+question.id+"/"+_option,
            })
            .done(function( response ) {
                hideLoading();
                logDebug("Response: ", response);

                if(response.success && response.success == "question-answered"){
                    var _options = element_question.children('.cp-container-options');
                    var _option_a = _options.children('.cp-option-a');
                    var _option_b = _options.children('.cp-option-b');
                    if(option == "A" && response.hit == true){
                        _option_a.addClass('option-correct');
                        _option_a.html(
                            '<img src="/assets/img/cp/cp_correct.svg" class="vibra-animation">'
                        );
                    }else if(option == "B" && response.hit == true){
                        _option_b.addClass('option-correct');
                        _option_b.html(
                            '<img src="/assets/img/cp/cp_correct.svg" class="vibra-animation">'
                        );
                    }else if(option == "A"){
                        _option_a.html(
                            '<img src="/assets/img/cp/cp_incorrect.svg" class="vibra-animation">'
                        );
                    }else{
                        _option_b.html(
                            '<img src="/assets/img/cp/cp_incorrect.svg" class="vibra-animation">'
                        );
                    }
                }

				jsonStorage[settings.source_id].questions[question.id] = true;
                saveDataLocalStorage();
                setTimeout(() => {

                    if(response.prize == true){
						show300Ondas();
						player.pause();
                    }else{
                        player.play();
                    }
                    element_question.remove();
                }, settings.liveliness);
            })
            .fail(function( error ) {
                hideLoading();
                logDebug("error: ", error);
                clickOption(option, question, element_question, waiting_interval);
            });

            
        }

        function show300Ondas(){
			$('.cp-back-button').remove();
            $(self).append(
                '<div class="cp-overlay cp-winner">\
                    <div class="cp-mid-section cp-section-bordered">'+
                        '<div class="row">'+
                            '<div class="col-3">'+
                                '<img class="img-fluid" src="/assets/img/cp/stars.png"/>'+
                            '</div>'+
                            '<div class="col-9">'+
                                '<div class="cp-title-modal mb-3">'+
                                    '<h5 class="mb-1">¡Ganaste!</h5>'+
                                '</div>'+
                                '<div class="cp-body-modal pr-3">'+
                                    '<p>Porque eres MULTIPOTENCIAL y no tienes una sola Vocaciön, ¡publica tu segundo anuncio!</p>'+
                                    '<a href="/place/prize/get/'+settings.uid+'" class="float-right btn btn-lg btn-primary btn-outline btn-round btn-rose">Gö</a>'+
                                '</div>'+
                            '</div>'+
                        '</p>'+
                    '</div>'+
				'</div>'
			);
        }


        function addPlay(){

            var el_play = jQuery('<div/>', {
                class: 'cp-overlay cp-play',
                html: '<img src="/assets/img/cp/cp_play.svg">',
            }).insertAfter($(self).children('iframe'));

            Hammer(el_play.get(0)).on("tap", function() {
                logDebug("Tap Play");
				player.play();
            });
        }
        
        function addPause(){
            var el_pause = jQuery('<div/>', {
                class: 'cp-overlay cp-pause',
                /* html: '<img src="/assets/img/cp/cp_pause.svg">', */
                html: '',
            }).insertAfter($(self).children('iframe'));


            // We create a manager object, which is the same as Hammer(), but without the presetted recognizers. 
            var mc = new Hammer.Manager(el_pause.get(0));


            // Tap recognizer with minimal 2 taps
            mc.add( new Hammer.Tap({ event: 'doubletap', taps: 2 }) );
            // Single tap recognizer
            mc.add( new Hammer.Tap({ event: 'singletap' }) );


            // we want to recognize this simulatenous, so a quadrupletap will be detected even while a tap has been recognized.
            mc.get('doubletap').recognizeWith('singletap');
            // we only want to trigger a tap, when we don't have detected a doubletap
            mc.get('singletap').requireFailure('doubletap');


            mc.on("singletap doubletap", function(ev) {
                if(ev.type == "singletap"){
                    logDebug("Tap Pause");
                    player.pause();
                }else{

					var el_back = jQuery('<div/>', {
						class: 'cp-overlay cp-back',
						html: '<h4>10 segundos</h4><img src="/assets/img/cp/cp_back.svg">',
					}).insertAfter($(self).children('iframe'));
					//player.pause();
					setTimeout(() => {
						el_back.addClass('cp-back-animated');
					}, 100);

					player.getCurrentTime().then(function(seconds) {
						if(seconds > 10){
							player.setCurrentTime(seconds - 10);
						}else{
							player.setCurrentTime(0);
						}
					});

					setTimeout(() => {
						el_back.remove();
						//player.play();
					}, 1000);
					logDebug("Doubletap");
                }
            });
        }
        
        function logDebug(txt, txt2 = null){
            if(settings.debug == true && !txt2){
                console.log("[CoomÜnityPlayer] "+settings.friendly_name+": "+txt);
            }
            if(settings.debug == true && txt2){
                console.log("[CoomÜnityPlayer] "+settings.friendly_name+": "+txt, txt2);
            }
        }
        
        return {
			setCurrentTime: function(seconds = null) {
				if(seconds && seconds > 0){
					player.setCurrentTime(seconds);
				}
            },
            play: function() {
				player.play();
            },
            pause: function() {
				player.pause();
            },
            getJsonStorage: function() {
				return jsonStorage;
            }
		};
 
    };
 
}( jQuery ));