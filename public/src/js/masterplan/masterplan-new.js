/* Create mapbox satellite map
 * Layers:
 * - lots-background - Background type. Red full screen background
 * - reserved-borders - Line type. Reserved group area, no lots
 * - releaseSoonLots-borders - Line type. Release soon lots
 * - releaseSoon-borders - Line type. Release soon group area
 * - forSale-fills - Fill type. For sale lots
 * - forSale-fills-hover - Fill type. For sale hover lots
 * - allSold-borders - Line type. All sold lots
 * - extraLines-white - Line type. Some white extra lines on map which are not lots or group area, like masterplan border
 * - extraLines-pink - Line type. Some pink extra lines on map which are not lots or group area, like roads
 * - extraMarkers - Point type. Some extra markers on map (roads)
 * */

const $ = require('jquery');
const mapboxgl = require('mapbox-gl');
const masterplanVar = require('./modules/masterplanVar.js');
const masterplanPopup = require('./modules/masterplanPopup.js');
const masterplanLayers = require('./modules/masterplanLayers.js');
const masterplanMarkers = require('./modules/masterplanMarkers.js');
const masterplanHighlight = require('./modules/masterplanHighlight.js');
const masterplanUtilits = require('./modules/masterplanUtilits.js');

var map;

var Masterplan = {

    init: function(masterplanMap) {

        if( (typeof(masterplanMap) != 'undefined' && masterplanMap != null) ) {

            // Render mapbox
            mapboxInit();

            // Add events listeners
            eventsListeners();
        }
    },

    showLotInfo: function( mText, name ) {

        var lotMarkerInfo = masterplanMarkers.getMarkerInfo(name);

        if( lotMarkerInfo.info !== null) {

            scrollToMap();

            map.jumpTo({center: masterplanVar.malbecCenter});
            map.setZoom(masterplanVar.malbecZoom);

            if(!masterplanVar.isMapOpened) {
                masterplanVar.isMapOpened = true;

                masterplanVar.$masterplanExplore.fadeOut();

                masterplanMarkers.toggleMarkers(map);

                showMasterplan();

                // Change full screen icon color
                masterplanUtilits.toggleFullScreenButtonColor();
            }

            // Show lot's popup info
            masterplanPopup.createPopUp( map, lotMarkerInfo.info, lotMarkerInfo.lngLat );

            // Highlight lot on map
            masterplanHighlight.addHighlight(map, mText, name);
        }
    }

};

function mapboxInit(){
    // Access token in olga@thespaceinbetween.co.nz account
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2liIiwiYSI6ImNqOTZhZ2xuMjAyZXEzMnF4MGFnd24wanoifQ.Griek6cdG7yWcTGnfmZv0g';

    map = new mapboxgl.Map({
        container: 'masterplan-mapbox',
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: masterplanVar.initCenter,
        zoom: masterplanVar.initZoom
    });

    // Full screen button
    map.addControl(new mapboxgl.FullscreenControl());
    // Zoom buttons
    map.addControl(new mapboxgl.NavigationControl());

    // Show markers only on certain zoom
    map.on('zoomend', function (e) {
        masterplanMarkers.toggleMarkers(map);
    });

    /*map.on('moveend', function() {

        console.log(map.getZoom(), map.getCenter());
    });*/

    //map.scrollZoom.disable();
    /*map.dragPan.disable();*/
}

function eventsListeners(){

    map.on('load', function () {

        // Add background and hide it
        masterplanLayers.addBackground(map);

        // Add reserved area on map and hide it
        masterplanLayers.addReservedPolygons(map);

        // Add reserved area on map and hide it
        masterplanLayers.addReleaseSoonPolygons(map);

        // Add interactive lots on map and hide them
        masterplanLayers.addForSalePolygons(map);

        // Add area with all sold lots on map and hide them
        masterplanLayers.addAllSoldPolygons(map);

        // Add extra lines
        masterplanLayers.addExtraLinesPink(map);
        masterplanLayers.addExtraLinesWhite(map);
        masterplanMarkers.addExtraMarkers(map);
    });

    // Click on "Start Exploring" button
    masterplanVar.buttonExplore.addEventListener('click', function () {

        var mapDelay = 500;

        // Open full screen mode
        const container = map.getContainer();
        const rfs =
            container.requestFullscreen ||
            container.webkitRequestFullScreen ||
            container.mozRequestFullScreen ||
            container.msRequestFullscreen;

        // Full screen mode doesn't work on iOS so check if rfs exists
        if(rfs !== undefined ){
            rfs.call(container);

            mapDelay = 1000;

            // Map doesn't resize correctly in full screen mode in Safari.
            // Resize it manually
            resizeMap();
        }

        // Let fullscreen open and and then animate map
        setTimeout(function(){
            masterplanVar.$masterplanExplore.fadeOut();

            // Fly to masterplan
            mapboxFly();
        }, mapDelay);

    });

    // Click on close button in Lot's Popup window
    masterplanVar.$masterplanMapbox.on('click', '.lot-popup-images-close', function(){
        hideImages();
    });

    // Click on View plans link
    masterplanVar.$masterplanMapbox.on('click', '#view-plans', function(e){

        e.preventDefault();

        var plan = $(this).data('plan');

        masterplanPopup.showPlan(plan);

        hideImages();
    });

    // Click on Lot's title
    masterplanVar.$masterplanMapbox.on('click touch', '#lot-popup-info-id', function(e){

        if(window.innerWidth <= masterplanVar.smallBreakpoint) {
            masterplanPopup.toggleLotInfo();

            hideImages();
        }
    });

    // Click full screen button
    var $fullScreenButton = $('[aria-label="Toggle fullscreen"]');

    // Map doesn't resize correctly in full screen mode in Safari.
    // Resize it manually
    $fullScreenButton.on("click", function(){
        resizeMap();
    });
}

// Map doesn't resize correctly in full screen mode in Safari.
// Resize it manually
function resizeMap(){
    setTimeout(function(){

        map.resize();

    }, 1000);
}

function mapboxFly(){

    // Create layer above map to prevent click or scroll on it during animation
    var $protectionDiv = $('<div style="position:absolute;top:0;left:0;bottom:0;right:0;z-index:100;"></div>');

    $('#masterplan-mapbox').prepend($protectionDiv);

    map.flyTo({
        curve:2,
        bearing: 0,
        speed: 0.4,
        center: masterplanVar.malbecCenter,
        zoom: masterplanVar.malbecZoom
    });

    map.once('moveend', function() {

        masterplanVar.isMapOpened = true;

        // Show masterplan
        //showMasterplan();

        // Remove provection layer.
        $protectionDiv.remove();

        // Show markers
        masterplanMarkers.toggleMarkers(map);
    });

    setTimeout(function(){
        showMasterplan();

        // Change full screen icon color
        masterplanUtilits.toggleFullScreenButtonColor();
    }, 3000);
}

function scrollToMap(){
    $('html, body').animate({
        scrollTop: masterplanVar.$masterplanMapbox.offset().top
    }, 400);
}


function showMasterplan(){
    showBackground();
    showLines();
}

function showBackground(){
    // Background
    map.setPaintProperty('lots-background', 'background-opacity', masterplanVar.opacityAnimate[1]);
}

function showLines(){

    // Reserved
    map.setPaintProperty('reserved-borders', 'line-opacity', masterplanVar.opacityAnimate[1]);

    // Release Soon
    map.setPaintProperty('releaseSoon-borders', 'line-opacity', masterplanVar.opacityAnimate[1]);
    map.setPaintProperty('releaseSoonLots-borders', 'line-opacity', masterplanVar.opacityAnimate[1]);

    // For sale
    map.setPaintProperty('forSale-borders', 'line-opacity', masterplanVar.opacityAnimate[1]);
    // For sale filled polygons for hover effect
    map.setPaintProperty('forSale-fills', 'fill-opacity', masterplanVar.opacityAnimate[1]);
    map.setPaintProperty('forSale-fills-hover', 'fill-opacity', masterplanVar.opacityAnimate[1]);

    // All Sold
    map.setPaintProperty('allSold-borders', 'line-opacity', masterplanVar.opacityAnimate[1]);

    // Extra lines and Markers
    map.setPaintProperty('extraLines-white', 'line-opacity', masterplanVar.opacityAnimate[1]);
    map.setPaintProperty('extraLines-pink', 'line-opacity', masterplanVar.opacityAnimate[1]);
}

function hideImages(){
    masterplanVar.$masterplanMapbox.find('.lot-popup-images').animate(
        {'height':0},
        300
    );
}

module.exports = Masterplan;