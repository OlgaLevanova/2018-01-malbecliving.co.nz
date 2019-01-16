/**
 * Rewritten form this plugin:
 *
 * jQuery.enllax.js v1.1.0
 * https://github.com/mmkjony/enllax.js
 * demo: http://mmkjony.github.io/enllax.js/
 *
 * Copyright 2015, MMK Jony
 * This content is released under the MIT license
 **/

var $ = require('jquery');

function Enllax(){
    // type == 'foreground'
    // dir == 'vertical'
    var $window = $(window),
        winWidth = getWindowWidth(),
        winHeight = $window.height(),
        elem = $('[data-enllax-ratio]'),
        desktop = winWidth > 991,
        trigger = (desktop ? 0 : 1);

    if( elem.length ){
        initEnllax();
    }

    function initEnllax(){
        if( desktop ){
            startEnllax();
        }

        window.addEventListener('resize', toggleEnllax, false);
    }

    function startEnllax(){
        setTransform();

        window.addEventListener('scroll', setTransform, false);
    }

    function setTransform(){
        elem.each(function() {
            var offset = $(this).offset().top,
                height = $(this).outerHeight(),
                ratio = $(this).data('enllax-ratio');

            var scrolling = $window.scrollTop();

            var transform = Math.round(((offset - (winHeight / 2) + height) - scrolling) * ratio);

            $(this).css({
                '-webkit-transform': 'translateY(' + transform + 'px)',
                '-moz-transform': 'translateY(' + transform + 'px)',
                'transform': 'translateY(' + transform + 'px)'
            });
        });
    }

    // Get and set window size
    function setWindowSize(){
        winWidth = window.innerWidth;
        winHeight = $window.height();
    }

    // Remove translate effect form elements
    function clearEnllax(){
        elem.each(function(){
            $(this).css({
                '-webkit-transform': 'translateY(0px)',
                '-moz-transform': 'translateY(0px)',
                'transform': 'translateY(0px)'
            });
        });
    }

    function getWindowWidth(){
        return window.innerWidth;
    }

    // Remove parallax effect on small screen and back it on big ones
    function toggleEnllax(){

        setWindowSize();

        if(winWidth > 991){
            if( trigger == 1 ) {

                startEnllax();

                trigger = 0;
            }
        } else {
            if( trigger == 0 ) {

                clearEnllax();

                window.removeEventListener('scroll', setTransform, false);

                trigger = 1;

            }
        }
    }
}

$(function(){
    var enllax = new Enllax();
});