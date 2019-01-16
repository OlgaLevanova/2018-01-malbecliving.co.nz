const $ = require('jquery');

var $elements = $('[data-drag]');
var $dragging = null;
var $body = $(document.body);
var $window = $(window);
var delta = null;
var maxImgShift = null;

var Drag = {

    init: function( $element ){

        setElementInCenter($element);

        $body.on('mousemove touchmove', $element, function(e){
            // cancel the native drag event chain
            //e.preventDefault(); // this cancel horizontal scroll on mobile. Set attribute draggable="false" to images instead

            if ($dragging !== null) {
                var x = getCursorPosition(e) + delta;

                if(x < maxImgShift) {
                    x = maxImgShift;
                } else if(x > 0) {
                    x = 0;
                }

                // translate the element
                setTranslate($dragging, 'translate(' + x + 'px, 0px)');
            }
        });

        $body.on('mousedown touchstart', $element, function(e) {
            if( $element.width() > $element.parent().width()) {
                //$dragging = $(e.target).parents('[data-drag]');
                $dragging = $element;

                // Map's start translateX - cursor start x position
                delta = getTranslate($dragging) - getCursorPosition(e);

                // Max possible images shift to the left
                maxImgShift = $dragging.parent().width() - $dragging.width();
            }
        });

        $body.on('mouseup touchend', $element, function(e) {

            $dragging = null;
            // Recalculate these values on mousedown, so don't need to do it on resize window
            delta = null;
            maxImgShift = null;

        });

        $window.on("resize.inCenter",(function() {
            setElementInCenter($element);
        }));
    },

    stopDrag: function( $element ){
        $body.off('mousemove touchmove', $element);
        $body.off('mousedown touchstart', $element);
        $body.off('mouseup touchend', $element);
        //$window.off("resize.inCenter");
    }
};

function getTranslate($element){
    var matrix = $element.css('transform').replace(/[^0-9\-.,]/g, '').split(',');
    var transformX = matrix[12] || matrix[4];
    if( !transformX ) transformX = 0;
    return transformX;
    //var x = matrix[12] || matrix[4];
    //var y = matrix[13] || matrix[5];
}

function setTranslate($element, property){
    $element.css({
        "webkitTransform":property,
        "MozTransform":property,
        "msTransform":property,
        "OTransform":property,
        "transform":property
    });
}

function getCursorPosition(e) {
    var xPos = e.pageX;
    if(xPos === undefined) xPos = e.originalEvent.touches[0].pageX;

    return xPos
}

function setElementInCenter($element){
    var deltaWidth = $element.parent().width() - $element.width();

    if( deltaWidth < 0) {
        setTranslate($element, 'translate(' + deltaWidth/2 + 'px, 0px)');
    } else {
        if( getTranslate($element) != 0 ) setTranslate($element, 'translate(0px, 0px)');
    }
}

module.exports = Drag;