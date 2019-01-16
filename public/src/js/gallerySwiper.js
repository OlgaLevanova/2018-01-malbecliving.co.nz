'use strict'

/* Was installed Swiper 3.4.2
* In newest version 4.0.1 next/prev buttons didn't work
* */

var $ = require('jquery');
var Swiper = require('swiper');

var galleryClass = '.swiper-container';

if( $(galleryClass).length > 0 ) {
    document.addEventListener('DOMContentLoaded', function loadGallerySwiper(){
        if ($('.swiper-slide').length > 1) {
            GallerySwiper.init();
        }
    }, false);
}

var GallerySwiper = {
    init: function() {
        var mySwiper = new Swiper('.swiper-container', {
            slidesPerView: 1,
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
            loop: true
        });
    }
};
