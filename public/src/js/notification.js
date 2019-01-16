var $ = require('jquery');

function Notification(){

    var $notification = $('.notification'),
        $button = $('.notification--close'),
        $header = $('header'),
        $badge = $('.hero-banner--badge'),
        animationTime = 200,
        cookieNotification = 'notification',
        cookieExpireDays = 30;

    if( $notification.length > 0 ) {
    }

    this.init = function(){

        if( !getCookie( cookieNotification ) ){

            showMessage();

            $button.on('click touch', function(){
                closeMessage();
            });

            // Set Header top position onload
            // Set timeout, because in iOS notification block onload is higher then should be
            // and only after few moments it jumps to right size. Not sure why it happens
            setTimeout(function(){
                resetHeaderTop();
            }, 150);

            window.addEventListener('resize', resetHeaderTop, false);

        }
    };

    var showMessage = function(){
        $notification.fadeIn();
    };

    var closeMessage = function(){
        // Hide notification and remove
        $button.parent().animate({height:0}, animationTime, function(){
            $(this).remove();
        });

        // Set Header top position to 0
        $header.animate({top:0}, animationTime);
        $badge.animate({top:0}, animationTime);

        //remove listener, no longer needed
        window.removeEventListener('resize', resetHeaderTop, false);

        setCookie(cookieNotification, 'read', cookieExpireDays);
    };

    // Recalculate Header's top position when Notification bar change it's height
    var resetHeaderTop = function(){
        $header.css({
            'top': $notification.height()
        } );
        $badge.css({
            'top': $notification.height()
        } );
    };

    var setCookie = function(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires;
    };

    var getCookie = function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };
}

$(function(){
    if( $('.notification').length > 0 ) {
        var notification = new Notification().init();
    }
});