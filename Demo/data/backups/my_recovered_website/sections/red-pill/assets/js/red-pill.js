var player;

function verifyStateUrlR(url, miObjeto){
    var sizeObject = Object.keys(miObjeto[url]).length;
    var intoURL = true;
    if(sizeObject>0){
       intoURL= miObjeto[url]["tutorial-1"];
    }else{
       intoURL = miObjeto[url];
    }
    return intoURL;
}
$( document ).ready( function() {

    var options = {
        controls: true,
        id: 388723112
    };
    var iframe = document.querySelector('#vimeo');
    //console.log(iframe);
    if(iframe){
        player = new Vimeo.Player( iframe, options );
        player.on( 'ended', function( data ) {
            var vid = document.getElementById("loop");
            vid.play();
            $( '#options').css( 'display', 'block' );
        });
    }
    

    $( '#left-option' ).click( function() { 			
        $("html, body").animate({ scrollTop: $('#questions').offset().top - 10 }, 500, function() {
            $( '#questions' ).addClass( 'disable_blur' );
            $( '#sender' ).addClass( 'disable_blur' );
            //$( "#sender-submit-button" ).prop( "disabled", false );
            
            saveRenderVideo();
        });
        showTourBySlug("tutorial-1");
    });			
        
    $( '.link-gameover' ).click( function() { 
        $( "input[name='stage']" ).val( 'rejecter' );
        $( 'form' ).submit();
    });

    $( '.slider' ).each( function( i, slider ) {
        var my_noUiSlider = noUiSlider.create( slider, {
            start: [0],
            step: 1,
            connect: [ true, false ],
            animate: true,
            range: {
                'min': -5,
                'max': 5
            }
        });
        my_noUiSlider.on( 'set', function() { 
            $( $( slider ).data( 'control' ) ).val( my_noUiSlider.get() );
        });
    });
   
});

function reloadPage(){
    location.reload(true);
}

function loadAnimationMatch(self, id, pos) {

    $.ajax({
        method: "POST",
        url: "",
        data: { question_id: id, value: pos }
    }).done(function( response ) {
        console.log("Funciona :P");
        if(response && response.error == null){
            setResponseRate(self, response.rate);
        }else{
            // Si hay algún error
            if(response.error == "user_not_connected"){
                location.href="/sign";
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
        $("#questions").removeClass("custom_blur");
        $("#sender").removeClass("custom_blur");
        $( "#sender-submit-button" ).prop( "disabled", false );
        /* console.log(i);
        console.log(); */
    });
});


function setResponseRate(self, rate, _value=null){
    var el = $(self);
    var parent = el.parent().parent();
    var information = parent.children('.information');
    var arrayMatch = [ ' de los emprendedores postulados piensa como tú', ' de los emprendedores postulados está de acuerdo contigo', ' de quienes han recorrido El Cämino piensa igual que tú'];
    var countArray = 0;
    countArray = Math.floor(Math.random() * (3 - 0)) ;
    parent.addClass('hover');
    information.attr("style", "display: flex !important");
    if((el.hasClass("border-black") && _value == null) || _value < 0){
        console.log( "negro");        
        information.css("background", "#000");
    }else if((el.hasClass("border-red") && _value == null) || _value > 0){
        information.css("background", "#dc1a5b");
        console.log( "fucsia");        
    }else{
        information.css("background", "#666666");
    }
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