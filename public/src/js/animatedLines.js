var $ = require('jquery');
require("./../../../node_modules/velocity-animate/velocity.min.js");

function AnimatedLines(){
    var lineTime = 500,
        $linesBlock = $('.animated-lines'),
        linesBlocksNumber = $linesBlock.length,
        linesBlocksCounter = 0;
        // Set animation's order for different blocks
        animationParam = {
            'left-bottom': [{'height':'100%'}, {'width':'100%'}],
            'left-top': [{'width':'100%'}, {'height':'100%'}],
            'top-right': [{'width':'100%'}, {'height':'100%'}]
        };

    init();

    function init(){

        // Check if any of lines block is on screen
        start();

        // Add listener
        window.addEventListener('scroll', start, false);
    }

    function start(){

        $linesBlock.each(function(){

            // Start animation if lines block on screen and it's not visible
            if( isOnScreenNotVisible( $(this) ) ) {

                animateLines($(this), 1);
            }
        });
    }

    function isOnScreenNotVisible( $lines ){
        var offset = $lines.offset().top,
            windowScroll = $(window).scrollTop(),
            windowHeight = $(window).height(),
            linesData = $lines.attr('data-visibility');

        // Check if lines block is on screen    
        var isOnScreen = (offset > windowScroll) && (offset < (windowScroll + windowHeight));

        // Check if this block still not visible
        var isVisible = linesData !== undefined && linesData == 'visible';

        // Return true only if this block on screen and not visible
        return (isOnScreen && !isVisible);
    }

    function animateLines($lineBox, counter){
        var animationType = $lineBox.data('animation-type');

        // Make this changes only on first line animation
        if( counter == 1 ) {

            // Mark block as visible
            $lineBox.attr('data-visibility', 'visible');

            // Count visible blocks
            linesBlocksCounter++;
        }

        // Remove listener if all blocks are visible
        if( linesBlocksCounter == linesBlocksNumber ){
            window.removeEventListener('scroll', start, false);
        }

        // Animate lines
        $lineBox.find('.line-' + counter).animate(
            animationParam[animationType][counter - 1],
            lineTime,
            function(){
                // Show second line
                if( counter == 1 ) animateLines($lineBox, 2);

                // Show text if there is text
                if( counter == 2 ) animateText($lineBox);
            }
        );
    }

    // Show text
    function animateText($lineBox){

        var $lineText = $lineBox.find('.line-text');
        if( $lineText.length ) $lineText.fadeIn();
    }
}

$(function(){
    var animatedLines = new AnimatedLines();
});