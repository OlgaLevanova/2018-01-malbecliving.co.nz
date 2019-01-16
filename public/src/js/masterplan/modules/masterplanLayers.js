const $ = require('jquery');
const masterplanVar = require('./masterplanVar.js');
const mapboxgl = require('mapbox-gl');
const masterplanMarkers = require('./masterplanMarkers.js');
const masterplanUtilits = require('./masterplanUtilits.js');
const masterplanPopup = require('./masterplanPopup.js');
const masterplanHighlight = require('./masterplanHighlight.js');

var MasterplanLayers = {
    addBackground: function(map){
        map.addLayer({
            "id": "lots-background",
            "type": "background",
            "paint": masterplanVar.paintBackground
        });
    },
    addForSalePolygons: function(map){

        map.addSource("forSale", {
            "type": "geojson",
            "data": mpForSaleLots
        });

        map.addLayer({
            "id": "forSale-fills",
            "type": "fill",
            "source": "forSale",
            "layout": {},
            "paint": masterplanVar.paintRedFill
        });

        map.addLayer({
            "id": "forSale-borders",
            "type": "line",
            "source": "forSale",
            "layout": {},
            "paint": masterplanVar.paintWhiteLines
        });

        map.addLayer({
            "id": "forSale-fills-hover",
            "type": "fill",
            "source": "forSale",
            "layout": {},
            "paint": masterplanVar.paintWhiteFill,
            "filter": ["==", "name", ""]
        });

        // Add markers for For Sale Lots
        mpForSaleLots.features.forEach(function(marker){
            masterplanMarkers.addMarker(map, marker.properties.marker);
        });

        // When the user moves their mouse over the forSale-fill layer, we'll update the filter in
        // the forSale-fills-hover layer to only show the matching lot, thus making a hover effect.
        map.on("mousemove", "forSale-fills", function(e) {
            // I have no fucking idea why here e.features[0].properties.marker became String instead of Object
            // And I don't have time to figure it out
            // So turn it back to Object with JSON.parse
            var markerObj = JSON.parse(e.features[0].properties.marker);

            // Remove hover color from Marker any active but not clicked lot
            masterplanVar.$body.find('.' + masterplanVar.markerClassActive).not('.' + masterplanVar.markerClassClicked).removeClass(masterplanVar.markerClassActive);

            // Get hover lot's marker text
            masterplanVar.markerHoverId = markerObj.mText;

            // If lot is not sold
            if(masterplanVar.markerHoverId != 'Sold'){

                // Highlight clicked and hover lots
                map.setFilter("forSale-fills-hover", [
                    "any",
                    ["==", "name", e.features[0].properties.name],
                    ["==", "clicked", true]
                ]);

                // Set hover color on Marker
                masterplanVar.$body.find('#id-' + masterplanVar.markerHoverId).addClass(masterplanVar.markerClassActive);
            } else {

                // Highlight only clicked lots
                map.setFilter("forSale-fills-hover", ["==", "clicked", true]);
            }
        });

        // Reset the forSale-fills-hover layer's filter when the mouse leaves the layer.
        map.on("mouseleave", "forSale-fills", function(e) {
            // Remove hover color from Marker any active but not clicked lot
            masterplanVar.$body.find('.' + masterplanVar.markerClassActive).not('.' + masterplanVar.markerClassClicked).removeClass(masterplanVar.markerClassActive);

            masterplanVar.markerHoverId = '';

            // Highlight only clicked lots
            map.setFilter("forSale-fills-hover", [
                "any",
                ["==", "name", ""],
                ["==", "clicked", true]
            ]);

        });

        // When a click event occurs on a feature in the lots layer, open a popup at the
        // location of the click, with description HTML from its properties.
        map.on('click', 'forSale-fills', function (e) {

            if(JSON.parse(e.features[0].properties.marker).mText != 'Sold') {

                masterplanUtilits.updateSourceData( map, mpForSaleLots, JSON.parse(e.features[0].properties.marker).mText, true );

                // Remove any active state from each lot
                masterplanVar.$body.find('.' + masterplanVar.markerClassActive).removeClass(masterplanVar.markerClassActive);
                masterplanVar.$body.find('.' + masterplanVar.markerClassClicked).removeClass(masterplanVar.markerClassClicked);

                // Add active and clicked state to clicked lot
                masterplanVar.$body.find('#id-' + masterplanVar.markerHoverId).addClass(masterplanVar.markerClassActive).addClass(masterplanVar.markerClassClicked);

                // Open popup
                masterplanPopup.createPopUp( map, JSON.parse(e.features[0].properties.info), e.lngLat );

                // Add dalay because of removeHighlight() function in createPopUp(), which starts with some delay
                // and remove all highlighted elements
                setTimeout(function(){
                    masterplanHighlight.addHighlight(map, JSON.parse(e.features[0].properties.marker).mText, e.features[0].properties.name);
                }, 100);
            }
        });
    },
    addReservedPolygons: function(map){

        // Add data of the reserved areas
        map.addSource("reserved", {
            "type": "geojson",
            "data": mpReservedGroup
        });

        map.addLayer({
            "id": "reserved-borders",
            "type": "line",
            "source": "reserved",
            "layout": {},
            "paint": masterplanVar.paintPinkLines
        });

        // Add markers for Reserved Groups
        mpReservedGroup.features.forEach(function(marker){
            masterplanMarkers.addMarker(map, marker.properties.marker);
        });
    },
    addReleaseSoonPolygons: function(map){

        // Add data of the release soon group
        map.addSource("releaseSoon", {
            "type": "geojson",
            "data": mpReleaseSoonGroup
        });

        // Add data of the release soon lots
        map.addSource("releaseSoonLots", {
            "type": "geojson",
            "data": mpReleaseSoonLots
        });

        map.addLayer({
            "id": "releaseSoonLots-borders",
            "type": "line",
            "source": "releaseSoonLots",
            "layout": {},
            "paint": masterplanVar.paintPinkLines
        });

        map.addLayer({
            "id": "releaseSoon-borders",
            "type": "line",
            "source": "releaseSoon",
            "layout": {},
            "paint": masterplanVar.paintWhiteLines
        });

        // Add markers for Releasing Soon Groups
        mpReleaseSoonGroup.features.forEach(function(marker){
            masterplanMarkers.addMarker(map, marker.properties.marker);
        });
    },
    addAllSoldPolygons: function(map){

        // Add data of the release soon lots
        map.addSource("allSoldLots", {
            "type": "geojson",
            "data": mpAllSoldLots
        });

        map.addLayer({
            "id": "allSold-borders",
            "type": "line",
            "source": "allSoldLots",
            "layout": {},
            "paint": masterplanVar.paintPinkLines
        });

        // Add markers for All Sold Groups
        mpAllSoldGroup.features.forEach(function(marker){
            masterplanMarkers.addMarker(map, marker.properties.marker);
        });
    },
    addExtraLinesWhite: function(map){

        // Add data of the release soon lots
        map.addSource("extraLinesWhite", {
            "type": "geojson",
            "data": mpExtraLinesWhite
        });

        map.addLayer({
            "id": "extraLines-white",
            "type": "line",
            "source": "extraLinesWhite",
            "layout": {},
            "paint": masterplanVar.paintWhiteLines
        });
    },
    addExtraLinesPink: function(map){

        // Add data of the release soon lots
        map.addSource("extraLinesPink", {
            "type": "geojson",
            "data": mpExtraLinesPink
        });

        map.addLayer({
            "id": "extraLines-pink",
            "type": "line",
            "source": "extraLinesPink",
            "layout": {},
            "paint": masterplanVar.paintPinkLines
        });
    }
};

module.exports = MasterplanLayers;