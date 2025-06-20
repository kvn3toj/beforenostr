/* Extracted from: merchant_home_02_after_scroll_2025-06-03T02-11-18-900Z.html */
/* Block index: 28 */
/* Extracted at: 2025-06-03T02:16:25.357Z */

jQuery(document).ready(function(){
        jQuery.fn.animateRotate = function( angle, duration, easing, complete ) {
            var $elem = this;
            $( { deg: 0 } ).animate( { deg: angle }, {
                duration: duration,
                easing: 'swing',
                step: function( now ) {
                    $elem.css( {
                        transform: 'rotate(' + now + 'deg)'
                    } );
                },
                complete: complete || $.noop
            });
        }
    });

    var iframeurl = "";
    function iframeURLChange(iframe, callback) {
        var unloadHandler = function () {
            // Timeout needed because the URL changes immediately after
            // the `unload` event is dispatched.
            setTimeout(function () {
                callback(iframe.contentWindow.location.href);
            }, 0);
        };

        function attachUnload() {
            // Remove the unloadHandler in case it was already attached.
            // Otherwise, the change will be dispatched twice.
            iframe.contentWindow.removeEventListener("unload", unloadHandler);
            iframe.contentWindow.addEventListener("unload", unloadHandler);
        }

        iframe.addEventListener("load", attachUnload);
        attachUnload();
    }

    iframeURLChange(document.getElementById("iprofile"), function (newURL) {
        console.log("URL changed:", newURL);
        iframeurl = newURL;

        if(newURL == "about:blank"){
            return;
        }

        if(newURL != "https://coomunity.co/place/user_profile"){
            $('#overlays').addClass('other-url');
        }else{
            $('#overlays').removeClass('other-url');
        }
    });

    $( '#primary-float').click( function(){
        var time = 1000;
        var $iframe=$('#iprofile');

        if($("#primary-float").hasClass("with-notification")){
            $('#primary-float').removeClass('with-notification').html('<img src="/assets/img/btn/oo.png">');
        }
        
        if(iframeurl != $iframe.data('src') && $iframe.data('load') == "loaded"){
            time = 300;
            setTimeout(() => {
                $iframe.prop('src', $iframe.data('src'));						
            }, 300);
        }else
        if (iframeurl != $iframe.data('src') || ($iframe.data('src') && $iframe.data('load') != "loaded")){ // only do it once per iframe
            //console.warn(iframeurl, $iframe.data('src'));
            $iframe.prop('src', $iframe.data('src')); //.data('src', false);
            $iframe.data('load', "loaded");
        }else{
            time = 500;
            setTimeout(() => {
                $iframe[0].contentWindow.resizeTable();                
            }, 1000);
            console.log("Abierto")
        }

        $( this ).removeClass('with-notification');
        $( this ).children('.not-counter').remove();
        $el = $(this);
        $( this ).animateRotate( 360, time, 'swing', function(){

            var child_buttons = $el.parent('.floating-buttons').children('.child-buttons');
            var child = child_buttons.children('.btn-hexa');
            
            child_buttons.toggleClass('active');

            if( $( '#iprofile' ).is( ':hidden' ) )
            {
                $('#in-profile').css('z-index', 101);
                $('.child-buttons').show();
                
                $( '#iprofile' ).fadeIn( 500, function(){
                    $( this ).show();
                });
            }
            else
            {
                $( '#iprofile' ).fadeOut( 500, function(){
                    $( this ).hide();
                    $('#in-profile').css('z-index', 99);
                    $('.child-buttons').hide();
                });
            }

        });

    });