// Set equal height for the set of the elements.
const $ = require('jquery');

function EqualHeight(){

	var elementsHeight = [],
		$window = $(window),
		breakpoint = 991,
		isMobileTrigger = window.innerWidth <= breakpoint,
		elements = null;

	// init function
	this.init = function($equalHeight){

		elements = $equalHeight;

		start();
	};

	var start = function(){

		var isMobile = window.innerWidth <= breakpoint;

		if(!isMobileTrigger && isMobile) {

			cleanHeights();

			isMobileTrigger = !isMobileTrigger;

		} else {

			if(!isMobile) {

				setEqualHeight();

				if(isMobileTrigger) isMobileTrigger = !isMobileTrigger;
			}

		}
	};

	// setEqualHeight function
	var setEqualHeight = function(){

		getHeights( elements );

		setHeights( elements );

	};

	// find max value in array
	var findMaxHeight = function(){

		return Math.max.apply(null, elementsHeight);
	};

	// get height of each element
	var getHeights = function(){

		elements.height('auto');
		elementsHeight = [];

		elements.each(function () {
			elementsHeight.push($(this).height());
		});

	};

	// set height of each element to the max value
	var setHeights = function(){

		elements.each(function () {
			$(this).height( findMaxHeight() );
		});

	};

	var cleanHeights = function(){

		elements.each(function () {
			if($(this).height != 'auto') $(this).height('auto');
		});

	};

	var isMobile = function(){
		return window.innerWidth <= breakpoint;
	};

	// reset height of each block on resize of the window
	window.addEventListener('resize', function resizeEqualHeight(){
		start();
	}, false);
}

module.exports = EqualHeight;

$(function(){
	if( $('[data-equal ="image-1"]').length > 1 )  {
		new EqualHeight().init($('[data-equal="image-1"]'));
	}
});
