const $ = require('jquery');
const masterplanVar = require('./masterplanVar.js');
const mapboxgl = require('mapbox-gl');

var MasterplanMarkers = {
    // Lots' and Areas' markers
    addMarker: function(map, marker){

        if(marker.coordinates != '') {
            // create a HTML element for each feature
            var el = document.createElement('div');
            el.className = 'map-markers ' + marker.class + ' ' + marker.angle;
            var markerText = marker.mText;

            // Create url for "Join the Waitlist" link, if it's marker for Releasing soon Group
            var markerURL = "";
            if( marker.contactPageURL !== 'undefined'){
                markerURL = marker.contactPageURL + '?lotGroup=' + marker.name;
                markerText = marker.mText.replace("#", markerURL);
            }

            if( marker.type == 'lot' ) {
                el.innerHTML = '<div id="id-' + marker.mText + '">' + marker.mText + '</div>';
            } else {
                el.innerHTML = '<div>' + markerText + '</div>';
            }

            // make a marker for each feature and add to the map
            var newMarker = new mapboxgl.Marker(el)
                .setLngLat(marker.coordinates)
                .addTo(map);
        }
    },

    // Roads' Markers
    addExtraMarkers: function(map){

        // add markers to map
        mpExtraMarkers.forEach(function(marker) {

            // create a HTML element for each feature
            var el = document.createElement('div');
            el.className = 'map-markers ' + marker.property.angle;
            el.innerHTML = '<div>' + marker.property.text + '</div>';

            // make a marker for each feature and add to the map
            new mapboxgl.Marker(el)
                .setLngLat(marker.coordinates)
                .addTo(map);
        });
    },
    toggleMarkers: function(map){

        var newOpacity = 0;
        if( masterplanVar.isMapOpened && map.getZoom() > masterplanVar.markersMinZoom ){
            newOpacity = masterplanVar.opacityAnimate[1];
        }

        $('.map-markers').stop().animate({
            'opacity':newOpacity
        }, masterplanVar.markersAnimationDuration);
    },
    createMarker: function(map){
        // create a DOM element for the marker
        var el = document.createElement('div');
        el.className = 'map-marker';
        el.innerHTML = '<div>Marker!</div>';

        // add marker to map
        markers = new mapboxgl.Marker(el)
            .setLngLat([174.7624357, -36.8517059])
            .addTo(map);
    },
    getMarkerInfo: function(lotTitle){
        var lots = mpForSaleLots.features,
            info = null,
            lngLat = {};

        for(var i = 0; i < lots.length; i++){
            if( lots[i].properties.name == lotTitle ){
                info = lots[i].properties.info;
                lngLat.lat = lots[i].properties.marker.coordinates[1];
                lngLat.lng = lots[i].properties.marker.coordinates[0];
                break;
            }
        }

        return {info: info, lngLat: lngLat};
    }
};

module.exports = MasterplanMarkers;