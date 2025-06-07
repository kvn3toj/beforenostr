jQuery(document).ready(function($){
    $('.coo-file-upload').click(function(){
        if($(this).children('.inputFileHidden').length > 0){
            $(this).children('.inputFileHidden')[0].click();
        }
    });
})

function cambiarFile(self){
    const input = document.getElementById('uploadFilesPqrs');
    if(input.files && input.files[0]){
        console.log("File Seleccionado : ", input.files[0]);
        jQuery(self).parent().children('.inputFileVisible').val(input.files[0].name);
    }
   
}

function validateFieldsStarter(self){
    _u = $(self).val();
    var checkBox = $("#accept").is(":checked");
    if(checkBox){
        $('#btn-starter').prop('disabled', false);
    }else{
        $('#btn-starter').prop('disabled', true);
    }
}

function reloadPage(){
    location.reload(true);
}

function loadAnimationMatch(self, id, pos) {
   
   
    $.ajax({
        method: "POST",
        url: url_ajax,
        data: { question_id: id, value: pos }
    }).done(function( response ) {
        console.log(response);
        if(response && response.error == null){
            setResponseRate(self, response.rate);
        }else{
            // Si hay algún error
            if(response.error == "user_not_connected"){
                //location.href="/sign";
            }
        }
        
    }).fail(function( jqXHR, textStatus ) {
        //alert( "Request failed: " );
    });
    
}

jQuery(document).ready(function(){
    jQuery('div[rate=1]').each(function(i, item){
        var id = $(item).data('id');
        var rate = $(item).data('rate');
        var value = $(item).data('value');
        
        setResponseRate('.btn-id-'+id, rate, value);

        /* console.log(i);
        console.log(); */
    });
});


function setResponseRate(self, rate, _value=null){
    var el = $(self);
    var parent = el.parent().parent();
    var information = parent.children('.information');
    console.log(information);
    var arrayMatch = [ ' de los emprendedores postulados piensa como tú', ' de los emprendedores postulados está de acuerdo contigo', ' de quienes han recorrido El Cämino piensa igual que tú', 'de los postulados opinan lo mismo que tú', 'de los postulados resuena como tú con este enunciado'];
    var countArray = 0;
    if((el.hasClass("border-black") && _value == null) || _value < 0){
        information.css("background", "#000");
    }else if((el.hasClass("border-red") && _value == null) || _value > 0){
        information.css("background", "#dc1a5b");
    }else{
        information.css("background", "#666666");
    }
    countArray = Math.floor(Math.random() * (3 - 0)) ;
    console.log("Arreglo "+ arrayMatch);
    console.log("Número random "+ countArray);
    parent.addClass('hover');
    information.css("display", "flex");
    parent.parent().next(".hr").css("margin", "0 auto");
    parent.css("height", "100px");
    information.children('.value').html('El <strong>'+rate+'%</strong> '+arrayMatch[countArray]);
}


function loadAnimationVideo(id){
    id= '#' + id + ' img';
    $("#buttons-options").css("display", "flex");
    $("#buttons-options").css("display", "flex");
    $("#buttons-options").css("z-index", "5");
    $(id).css("display", "initial");    
    $(id).addClass("animationVideo");
    $("#options").addClass("visibilityOptions");
    setTimeout(function() {
        $("#options").css("display","none");
        $("#buttons-options").css("z-index", "3");
    }, 1300);
    
} 

/*On Boarding*/

jQuery(document).ready(function(){
    if($('.owl-carousel').length <= 0){
        return;
    }
    $('.owl-carousel').owlCarousel({
        loop:false,
        margin:10,
        nav: true,
        items: 1,
        navText: ['<i class="fa fa-chevron-left fa-lg" aria-hidden="true"></i>','<i class="fa fa-chevron-right fa-lg" aria-hidden="true"></i>']
    });
})


function closeApp(){
    navigator.app.exitApp();
}

var settingsBlur = {
    "red-pill": false,
    "go": false,
    "download": false,
};

var showBlur = true;
jQuery(document).ready(function(){
    if(localStorage.getItem('render_video')){    
        
        var renderVideo = JSON.parse(localStorage.getItem('render_video'));
        var url =  urlSaved(renderVideo);
        if(!renderVideo[url]){
            showBlur = true;
        }else{
            showBlur = false;
        }

    }else{
        localStorage.setItem('render_video', JSON.stringify(settingsBlur));
    }
    if(showBlur){
        $('#sender').addClass('custom_blur');
        $('#questions').addClass('custom_blur');       
    }
});


function urlSaved(array){
    var allUrl = window.location.href.split ("/");
    for (let index = 3; index < allUrl.length; index++) {

        var url = allUrl[index];
        url = url.split('?')[0];        

        if( array[url] != undefined ){
            return url;
        }
    }
}

function saveRenderVideo(){
    var renderVideo = JSON.parse(localStorage.getItem('render_video'));
    var url =  urlSaved(renderVideo);
    if( renderVideo && url){
        renderVideo[url]= true;   
       // localStorage.removeItem('render_video');
        localStorage.setItem('render_video', JSON.stringify(renderVideo));
    }
}
/*Wizard*/
var settingsViewsWizard = {
    "red-pill": {
            "tutorial":[
                {
                    "element": ".iframe-container",
                    "title": "",
                    "description": "Observa el video y toma una decisión al final.",
                    "position": "bottom"
                }
            ],
            "tutorial-1":[
                {
                    "element": ".step-1",
                    "title": "",
                    "description": " Dinos qué tanto resuenas con los enunciados, tocando en uno de los círculos.",
                    "position": "top"
                }
            ]
    },
    "pilgrim":{
        "preventScrolling": true,
        "landscape": true,
        "tutorial":[
            {
                "element": "#primary-float",
                "title": "Menú Perfil",
                "description": "User name, este es el botón más importante de tu experiencia. ¡Toca aquí y encuentra para qué sirve!",
                "position": "bottom-left"
            }
        ],
        "tutorial-menu":[
            {
                "element": ".btn-cinema",
                "title": "Cinëma",
                "description": "El cine de los emprendedores. Toca el botón para ver tus contenidos favoritos!",
                "position": "left"
            },
            {
                "element": ".btn-plaza",
                "title": "Pläza",
                "description": "Si llegas a desbloquear la Pläza, aquí podrás mercar y ganar Lükas con tus servicios, productos o experiencias.",
                "position": "left"
            },
            {
                "element": ".btn-aldea",
                "title": "Aldëa",
                "description": "Si llegas desbloquear la Aldëa, este es nuestro entorno social, donde hacemos equipo y ¡transformamos el mundo!",
                "position": "bottom-left"
            }
        ]
    },  
    "profile":{
        "preventScrolling": true,
        "tutorial":[
            
            {
                "element": ".box-ondas",
                "title": "Öndas",
                "description": "Gana Öndas en cada reto o actividad. A mayor cantidad de Öndas, más cerca estarás del siguiente Portäl.",
                "position": "right"
            },
            {
                "element": ".box-meritos",
                "title": "Méritos",
                "description": "Es el factor WOW que te dará la Coomunidäd al recibir tu servicio, producto o experiencia.",
                "position": "right"
            },
            {
                "element": ".box-lukas",
                "title": "Lükas",
                "description": "Representan la Confiänza y el valor que das a otros. Úsalas para todo lo que con pesos no te alcanza.",
                "position": "right"
            },                       
            {
                "element": ".portal-close",
                "title": "",
                "description": "El Camïno se conforma de Portäles. Aquí te mostramos el tiempo que te resta para que cierre cada Portäl. ¡Debes estar pendiente o tendrás que correr!",
                "position": "top"
            },
            {
                "element": "#btn-rules a",
                "title": "Claves del Portäl",
                "description": "¡Para que no te pierdas en El Camïno, pulsa el botón y comienza tu recorrido con seguridad.",
                "position": "top"
            },
            {
                "element": "#btn-pqrs a",
                "title": "Necesito ayuda",
                "description": "¿No entiendes algo? ¿Necesitas una mano? ¡Pulsa aquí para conectarte con nosotros!",
                "position": "top"
            }
        ],
        "tutorial-3":[
            {
                "element": ".container-blur-table",
                "title": "Ranking",
                "description": "Muestra tu lugar en la Coompetëncia.",
                "position": "top"
            }
        ]
    },
    "pqrs":{
        "tutorial":[
            {
                "element": "#headingOne",
                "title": "",
                "description": "Haz clic para ver más información de tu tema.",
                "position": "bottom"
            },
            {
                "element": "#back-pqrs",
                "title": "",
                "description": "Haz clic aquí para volver a la pantalla inicial.",
                "position": "top-left"
            },
            {
                "element": "#send-pqrs",
                "title": "",
                "description": "Haz clic aquí para hacer una consulta específica.",
                "position": "top-right"
            }
        ],
        "tutorial-1":[
            {
                "element": ".coo-file-upload",
                "title": "",
                "description": "Puedes adjuntar una imagen de tu consulta específica.",
                "position": "top"
            },
            {
                "element": "#back-pqrs",
                "title": "",
                "description": "Haz clic aquí para volver a preguntas frecuentes.",
                "position": "top-left"
            },
            {
                "element": "#sendPqrs",
                "title": "",
                "description": "Haz clic aquí para registrar tu consulta específica.",
                "position": "top-right"
            }
        ]
    },
    "seeker":{
        "portrait": true,
        "tutorial":[
            {
                "element": ".btn-hexa-rose",
                "title": "",
                "description": "Toca en el hexágono y haz una lista de todo aquello que haría tu vida más fácil a nivel personal!",
                "position": "top"
            }
        ]
    },
    "solver":{
        "tutorial-1":[
            {
                "element": "#title",
                "title": "",
                "description": "Escribe de manera concreta y llamativa lo que ofreces.",
                "position": "bottom"
            },
            {
                "element": "#description",
                "title": "",
                "description": "¡Describe brevemente el *valor de lo que haces* y *cómo* lo logras! Sé creativo(a).",
                "position": "top"
            }
        ]
    },
    "happy":{
        "tutorial":[
            {
                "element": ".container-progress-vibra",
                "title": "Barra de tiempo",
                "description": "Esta barra te muestra el tiempo de reproducción disponible en cada contenido interactivo. ¡Podrás recargar más tiempo tocando el botón Vïbra.",
                "position": "bottom"
            },
            {
                "element": ".cont-btn-vibras",
                "title": "Vibras",
                "description": "Toca el botón Vibrä para recargar más tiempo de reproducción en cada contenido interactivo.",
                "position": "left"
            }
        ]
    },
    "profile_place":{
        "tutorial":[
            /* {
                "element": ".btn-recharge",
                "title": "Recargar Lükas",
                "description": "Toca el botón y recarga tu wallet con Lükas para coomprar servicios, productos y experiencias geniales!",
                "position": "bottom-mid"
            }, */
            {
                "element": ".btn-match",
                "title": "Mis matches",
                "description": "El número de veces que has conectado tus capacidades con las necesidades de otros.",
                "position": "bottom"
            },
            {
                "element": ".btn-anun",
                "title": "Mis anuncios:",
                "description": "El número de servicios, productos o experiencias ofrecidos a la Coomunidäd.",
                "position": "bottom"
            },
            {
                "element": ".btn-comprar",
                "title": "Ir a coomprar",
                "description": "Pulsa en el carrito cuando quieras coomprar servicios, productos y experiencias de la Coomunidäd.",
                "position": "bottom"
            }
        ],
        "tutorial-menu":[
            
        ]
    },
    "search":{
        "tutorial":[
            {
                "element": ". btn-search",
                "title": "",
                "description": "Puedes buscar por nombre, usuario o palabras clave.",
                "position": "bottom-left"
            },
            {
                "element": ".btn-notifications",
                "title": "",
                "description": "Aquí verás tus notificaciones. Los íconos que ayudarán a identificar fácilmente cada una de ellas.",
                "position": "left"
            }
        ]
    },
};
function verifyStateUrl(url, miObjeto){
    
    var sizeObject = miObjeto[url] != undefined ? Object.keys(miObjeto[url]).length : 0;
    var intoURL = true;
    if(sizeObject>0){
       intoURL= miObjeto[url]["tutorial"];
    }else{
       intoURL = miObjeto[url];
    }
    return intoURL;
}

function createWizard( steps, position , preventScrolling = false){
    if(!(steps && steps != undefined)){
        return;
    }
    console.log("Steps: ", steps);
    window.tour = new Tour({
        padding: 0,
        next: 'Siguiente',
        done: 'Avanzar',
        prev: 'Anterior',
        tipClasses: 'tip-class active',
        steps: steps,
        preventScrolling: preventScrolling
    });    
    tour.override('showStep', function(self, step) {
      self(step);
    })
  
    tour.override('end', function(self, step) {
      self(step);
    })
    
    tour.start();
    /* var sizeObject = Object.keys(miObjeto[url]).length;
   
    if(sizeObject>0){
        miObjeto[url][position]= true;
    }else{
        miObjeto[url]= true;
    }
    
    localStorage.setItem('datos', JSON.stringify(miObjeto)); */

}


jQuery(document).ready(function(){
    showTourBySlug("tutorial");   
});



function showTourBySlug(slug){
    var arrLocal = localStorage.getItem('datos');
    arrLocal = arrLocal ? arrLocal : "{}";

    var miObjeto = JSON.parse(arrLocal);
    var allUrl = window.location.href.split ("/");

    for (let index = 3; index < allUrl.length; index++) {
        var url = allUrl[index];
        url = url.split('?')[0];
        // Verificamos si la variable existe dentro del arreglo del local
        // Y si sí existe, verificamos si está en true la posición del tutorial actual
        // Esto nos devuelve true en caso de haberlo visto, pero necesitamos saber si no lo vió xd 

        if( miObjeto[url] == undefined || 
            (miObjeto[url][slug] != undefined && miObjeto[url][slug] != true) ||
            miObjeto[url][slug] == undefined
        ){
            var preventScrolling = false;
            // Verificamos si solo se muestra en horizontal (landscape así se dice xd)
            if(settingsViewsWizard[url] != undefined && settingsViewsWizard[url]['landscape'] != undefined && settingsViewsWizard[url]['landscape'] == true){
                // Si no está en landscape, que no muestre el tutorial.
                // Pero debemos dejar un disparador para que cuando gire el dispositivo se active solo
                if(window.innerHeight > window.innerWidth){
                    window.addEventListener("orientationchange", function() {
                        setTimeout(() => {
                            if(window.innerHeight < window.innerWidth){
                                showTourBySlug(slug);
                            }
                        }, 1000);
                    });

                    return;
                }else{
                    
                }
            }

            if(settingsViewsWizard[url] != undefined && settingsViewsWizard[url]['portrait'] != undefined && settingsViewsWizard[url]['portrait'] == true){
                // Si no está en portrait, que no muestre el tutorial.
                // Pero debemos dejar un disparador para que cuando gire el dispositivo se active solo
                if(window.innerHeight < window.innerWidth){
                    window.addEventListener("orientationchange", function() {
                        setTimeout(() => {
                            if(window.innerHeight > window.innerWidth){
                                showTourBySlug(slug);
                            }
                        }, 1000);
                    });

                    return;
                }else{
                    
                }
            }

            if(settingsViewsWizard[url] != undefined && settingsViewsWizard[url]['preventScrolling'] != undefined && settingsViewsWizard[url]['preventScrolling'] == true){
                preventScrolling = true;
            }

            // Entonces aquí ya sabemos si no lo ha visto:
            // Si no lo ha visto, verificamos que exista también en nuestro arreglo de tours
            //console.log("OBJ1: ", settingsViewsWizard[url]);
            if(settingsViewsWizard[url] != undefined){
                //console.log("OBJ2: ", settingsViewsWizard[url]);
                // Hasta aquí no debería de haber fallos, entonces lo que hacemos es asignar a true
                // la posición en el arreglo del localStorage

                // Aquí verificamos primero si existe el arreglo para esa url
                if(miObjeto[url] == undefined){
                    miObjeto[url] = {};
                    miObjeto[url][slug] = true;
                    //console.log(miObjeto);
                }else{
                    miObjeto[url][slug] = true;
                }

                localStorage.setItem('datos', JSON.stringify(miObjeto));

                setTimeout(() => {
                    /* console.log("Después del tiempo: ", miObjeto)
                    console.log("Después del tiempo: ", settingsViewsWizard[url]); */
                    if(settingsViewsWizard[url] == undefined){
                        return;
                    }                    
                    createWizard(settingsViewsWizard[url][slug], slug, preventScrolling );                    
                }, 500);


                break;
            }
        }
    }


    
}



jQuery(document).ready(function(){
    var size =  $('.tb-admin_users').data('size');    
    if(size<12){
        $('.dataTables_paginate').css('display','none');
    }
})		

