var $ = require('jquery');
require("./../../../node_modules/velocity-animate/velocity.min.js");

function Menu(){

    var $body = $('html,body'),
        $nav = $('#nav'),
        $navInner = $('#nav-inner'),
        $menu = $('#menu'),
        $button = $('#menu-toggle'),
        $navNotes = $('.nav--notes'),
        $header = $('.header'),
        navActiveClass = 'nav--opened',
        liShowClass = 'li-show',
        noteShowClass = 'nav--notes-open',
        headerActiveClass = 'header--active',
        duration = 400,
        navPadding = 515; // Need to have space for header elements and nav notes

    $('body').on('click', $('.header-menu-button'), function(e){
        e.stopImmediatePropagation();
        if( $(e.target).hasClass('header-menu-button') || $(e.target).hasClass('header-menu-button--inner') ){
            menuToggle();
        }
    });

    var menuToggle = function(){
        if( $nav.hasClass(navActiveClass) ) closeMenu();
        else openMenu();
    };

    var openMenu = function(){

        // Animate menu icon, show language menu
        //$header.addClass(headerActiveClass);

        // Set nav's inner block height
        $navInner.css('height', calculateNavHeight());

        // Set nav's height. =  height of the window
        //$nav.css('height', window.innerHeight);

        // $navInner has min-height:100vh in styles, but without height $menu calculate it's position wrong
        // So set height of $navInner
        //setNavHeight();

        // Set body's scroll to 0
        windowToTop();

        // Slide nav block
        $nav.stop().velocity({
            'width':'100%'
        }, duration, function(){

            // Remove body's scroll
            $body.css({
                'height': window.innerHeight,
                'overflow': 'hidden'
            });

            // Set nav's scroll
            $nav.css('overflow-y', 'scroll');
            $nav.addClass(navActiveClass);

            $nav.scrollTop(0);

            windowToTop();

            // Add some sugar. Animate li elements
            menuAnimate();

            // Clone header inside nav
            showHeader();
        });

        // Add listener when menu is opened
        window.addEventListener('resize', resizeMenu, false);
    };

    var closeMenu = function(){

        // Remove header from nav
        removeHeader();

        // Show body's scroll, hide nav's scroll
        $body.css({
            'height': 'auto',
            'overflow': 'auto'
        });
        $nav.css('overflow-y', 'hidden');

        // Hide nav
        $nav.stop().velocity({
            'width':0
        }, duration, function(){
            $nav.removeClass(navActiveClass);

            // Hide menu's li and notes for further animation
            $menu.find('li').removeClass(liShowClass);
            $navNotes.removeClass(noteShowClass);

            // Animate menu icon, hide language menu
            //$header.removeClass(headerActiveClass);
        });

        // Remove listener when menu is closed
        window.removeEventListener('resize', resizeMenu, false);
    };

    // Nav's min-height = window height. (May be use 100vh in css?)
    var calculateNavHeight = function(){
        var navHeight =  $menu.height() + navPadding;
        var windowHeight = window.innerHeight;

        if( navHeight < windowHeight ) navHeight = windowHeight;

        return navHeight;
    };

    var setNavHeight = function(){
        $navInner.css('height', $navInner.height());
    };

    var menuAnimate = function(){

        var counter = 1;

        var id = setInterval(showLi, 150);

        // Show menu's li one by one
        function showLi() {
            if (counter == 7) {
                clearInterval(id);

                // Show Note
                $navNotes.addClass(noteShowClass);
            } else {
                $menu.find('li:nth-child(' + counter + ')').addClass(liShowClass);
                counter++;
            }
        }
    };

    var showHeader = function(){

        $header.clone().appendTo($nav)
            .addClass(headerActiveClass);
    };

    var removeHeader = function(){

        $nav.find('header').remove();
    };

    var resizeMenu = function(){
        $body.css({
            'height': window.innerHeight
        });
        $nav.css('height', window.innerHeight);
    };

    var windowToTop = function(){
        window.scrollTo(0,0);
    };
}

$(function(){
    var menu = new Menu();
});