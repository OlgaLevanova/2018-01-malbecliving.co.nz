
const $ = require('jquery');

(function() {

	mapboxgl.accessToken = 'pk.eyJ1Ijoic2liIiwiYSI6ImNqOTZhZ2xuMjAyZXEzMnF4MGFnd24wanoifQ.Griek6cdG7yWcTGnfmZv0g';

	var map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/streets-v9',
		center: [-100.486052, 37.830348],
		zoom: 2,
		trackResize: true
	});

	map.addControl(new mapboxgl.FullscreenControl());

	map.on('load', function () {

		var elem = $('[aria-label="Toggle fullscreen"]');

		elem.on("click", function(){
			setTimeout(function(){

				map.resize();

			}, 1000);

		});

	});

	function mapResize(){

		var elem = $('[aria-label="Toggle fullscreen"]');

		elem.removeEventListener("resize", mapResize, false);

		if (elem.hasClass('mapboxgl-ctrl-shrink')) {
			document.getElementById('wrapper').classList.add("masterplan-mapbox-wrapper--static");

		} else {
			document.getElementById('wrapper').classList.remove("masterplan-mapbox-wrapper--static");
		}

		//map.resize();
	}

})();