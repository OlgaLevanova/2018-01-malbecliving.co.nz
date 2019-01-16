const $ = require('jquery');
const mapboxgl = require('mapbox-gl');

function Draw() {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2liIiwiYSI6ImNqOTZhZ2xuMjAyZXEzMnF4MGFnd24wanoifQ.Griek6cdG7yWcTGnfmZv0g';

    var map = new mapboxgl.Map({
        container: 'draw', // container id
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: [174.5959078, -36.816255], // starting position
        zoom: 16 // starting zoom
    });

    map.on('load', function () {
        map.addSource("overlayMap", {
            "type": "image",
            "url": "/assets/images/Masterplan-static.jpg",
            "coordinates": [
                [174.59265437950978,-36.815082099122506],
                [174.59876849106303,-36.815082099122506],
                [174.59876849106303,-36.817843850115246],
                [174.59265437950978,-36.817843850115246]
            ]
            });

            map.addLayer({
                "id": "overlayMap",
                "source": "overlayMap",
                "type": "raster",
                "paint": {"raster-opacity": 0.95}
            });
    });

    var draw = new MapboxDraw({
        /*displayControlsDefault: false,
        controls: {
            polygon: true,
            combine_features:true,
            uncombine_features:true,
            trash: true
        }*/
    });
    map.addControl(draw);

    map.on('draw.delete', updateArea);
    map.on('draw.selectionchange', updateArea);

    function updateArea(e) {
        var polCoordinatesArray;
        var data = draw.getSelected();
        var answer = document.getElementById('polygon-coordinates');
        if (data.features.length == 1) {

            switch(data.features[0].geometry.type){
                case 'Polygon':
                    polCoordinatesArray = data.features[0].geometry.coordinates[0];
                    break;
                case 'LineString':
                case 'Point':
                    polCoordinatesArray = data.features[0].geometry.coordinates;
                    break;
            }

            var polString = '';

            switch(data.features[0].geometry.type){
                case 'Polygon':

                    for(var i = 0; i < polCoordinatesArray.length; i++){
                        polString += '[' + polCoordinatesArray[i][0] + ',' + polCoordinatesArray[i][1] + ']';

                        if(i != (polCoordinatesArray.length - 1)) polString += ',';
                    }
                    answer.innerHTML = '[[' + polString + ']]';

                    break;
                case 'LineString':

                    for(var i = 0; i < polCoordinatesArray.length; i++){
                        polString += '[' + polCoordinatesArray[i][0] + ',' + polCoordinatesArray[i][1] + ']';

                        if(i != (polCoordinatesArray.length - 1)) polString += ',';
                    }
                    answer.innerHTML = '[' + polString + ']';

                    break;
                case 'Point':

                    polString = polCoordinatesArray;

                    answer.innerHTML = '[' + polString + ']';

                    break;
            }
        } else {

            if(data.features.length == 0){
                answer.innerHTML = '';
            }
            else {
                answer.innerHTML = 'Select only 1 polygon';
            }
            //if (e.type !== 'draw.delete') alert("Use the draw tools to draw a polygon!");
        }
    }


}

(function() {
    var draw = document.getElementById('draw');

    if( (typeof(draw) != 'undefined' && draw != null) )  var drawNew = new Draw();
})();