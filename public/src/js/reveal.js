'use strict';

var $ = require('jquery');
var ScrollReveal = require('scrollreveal');

// Applies to all pages
function Reveal(){
    window.sr = ScrollReveal();

    // viewFactor
    // Change when an element is considered in the viewport. The default value
    // of 0.20 means 20% of an element must be visible for its reveal to occur.
    var viewFactor = 0.2;

    // Set for mobile
    if( window.innerWidth < 756) {
        viewFactor = 0.05;
    }

    // duration was 800.
    sr.reveal('.reveal-block', {
        scale: 1,
        duration: 1500,
        viewFactor: viewFactor
    });
}

$(function(){
    var reveal = new Reveal();
});