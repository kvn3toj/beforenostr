$.fn.animateRotate = function( angle, duration, easing, complete ) {
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


jQuery(document).ready(function($){

    $('.floating-buttons').each(function(e){
        var child = $(this).children('.child-buttons');
        child.css('top', -(child.height() + 10));
        //child.children('.btn-hexa').hide();
    });

    if(window.location.hash && jQuery(window.location.hash).length > 0){
        $("html, body").animate({ scrollTop: $(window.location.hash).offset().top - 80 }, 1000);
    }
});



$( '#primary-float').click( function(){

    $el = $(this);
    $( this ).animateRotate( 360, 500, 'swing', function(){


        var child_buttons = $el.parent('.floating-buttons').children('.child-buttons');
        var child = child_buttons.children('.btn-hexa');
        
        child_buttons.toggleClass('active');

        if( $( '#overlay1' ).is( ':hidden' ) )
        {
            /* child.fadeIn( 500, function(){
                $( this ).show();
            }); */
            $( '#overlay1' ).fadeIn( 500, function(){
                $( this ).show();
            });
            showTourBySlug("tutorial");
        }
        else
        {
            /* child.fadeOut( 500, function(){
                $( this ).hide();
            }); */
            $( '#overlay1' ).fadeOut( 500, function(){
                $( this ).hide();
            });
        }

    });

});

function showLoading(element){
    hideLoading(element);
    jQuery(element).append('<div class="coo-loading"><img src="/assets/img/cp/cp_loading.svg"></div>')
}

function hideLoading(element){
    jQuery(element).children(".coo-loading").remove();
}


var objNotifications = null;

jQuery(document).ready(function($){

    jQuery('.btn-notifications').click(function(){

        var element = "#modal-notifications .modal-body";

        if(!objNotifications){
            showLoading(element);
            $.ajax({
                method: "GET",
                url: url_notifications,
            })
            .done(function( notifications ) {
                
                if(notifications.length > 0){
                    objNotifications = notifications;    
                    jQuery(element).html('');
                    notifications.forEach(function (notification) {

                        var type = notification.kind == "system" ? "notifications" : "cart";
                        var color_class = notification.kind == "system" ? "bg-blue" : "bg-rose";

                        var shown = notification.shown != null ? "read" : "";
                        var url = notification.url;
                        var id = notification.id;
                        var date = new Date(notification.created * 1000);
                        var created = date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear();

                        var elnot = 
                        (url != null ? "<div class='row' id='notification-"+id+"'><a href='"+url+"'>" : "")+
                        '<div class="item-notification d-flex flex-row '+shown+'" data-id="'+id+'">'+
                        '    <div class="content-image text-center mr-3">'+
                        '        <img class="img-notification" src="'+notification.picture+'">'+
                        '        <span class="color-span '+color_class+'"><img src="'+base_url_notifications+'assets/images/icons/'+type+'.png"></span>'+
                        '    </div>'+
                        '    <div class="text-content w-100">'+
                        '        <p class="mb-1"><b>'+notification.title+' '+created+'</b></p>'+
                        '        <p>'+notification.description+'</p>'+
                        '        <hr>'+
                        '    </div>'+
                        '</div>'+
                        (url != null ? "</a><span class='badge' onclick='delNotify(this)' data-id-notify='"+id+"'><i class='fa fa-trash'></i></span></div>" : "");
                        jQuery(element).append(elnot);
                    });
                }else{
                    jQuery(element).html('<h3>No tienes notificaciones actualmente</h3>');
                }
                
                jQuery('.item-notification').click(function(){

                    var id = $(this).data('id');

                    var el = $(this);

                    $.ajax({
                        method: "GET",
                        url: url_notifications+'/set/shown/'+id,
                    })
                    .done(function( response ) {
                        if(response.success == 'notification-set-as-shown'){
                            $('.pending-notifications').html(response.pending_notifications);
                            el.addClass('read');
                        }
                    });
                        
                });

            });

        }
    });

    jQuery('.btn-search, .close-search').click(function(){
        jQuery('.search-box').toggleClass('open');
    });
});


function formatPending(pending){
    var n = parseInt(pending);

    if(n > 9){
        return "+9";
    }else{
        return n;
    }

}

jQuery.printClockStatic = function(hour){  
    alert(hour);  
}

function delNotify(e)
{
    var id = $(e).data('idNotify');
    $.ajax({
        method: "GET",
        url: url_notifications+'/delete/'+id,
        })
        .done(function() {
            $("#notification-"+id).remove();
    });
}

