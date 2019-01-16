var $ = require('jquery');
var objectFitImages = require('object-fit-images');

var $banner = $('.hero-banner--image');

if( $banner.length > 0 ) {
    document.addEventListener('DOMContentLoaded', function loadFitImage(){
        FitImage.init();
    }, false);
}

var FitImage = {
    init: function() {
        objectFitImages('img.hero-banner--image');
    }
};