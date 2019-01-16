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
var drag = require('./drag.js');


var $body = $('body'),
    $masterplanMapbox = $('#masterplan-mapbox'),
    $masterplanExplore = $('.masterplan-explore'),
    $newPlan = null,
    map,
    isMapOpened = false,
    malbecCenter = [174.59522978313407, -36.81675470669174],
    malbecZoom = 18,
    initCenter = [174.7624357, -36.8517059],
    initZoom = 11,
    markers,
    markersMinZoom = 17,
    markersAnimationDuration = 200,
    markerHoverId = '',
    buttonExplore = document.getElementById('button-explore'),
    colors = {
        'red':'#E23437',
        'white':'#EEEFF1',
        'pink':'#E48789'
    },
// Don't set it to 1. For some reason opacity 1 doesn't work properly. It becomes transparent
    opacityAnimate = [0, 0.99],
    paintBackground = {
        "background-color": colors.red,
        "background-opacity":opacityAnimate[0],
        "background-opacity-transition": {duration: 1000}
    },
    paintPinkLines = {
        "line-color": colors.pink,
        "line-width": 0.5,
        "line-opacity": 0,
        "line-opacity-transition": {duration: 1000}
    },
    paintWhiteLines = {
        "line-color": colors.white,
        "line-width": 0.5,
        "line-opacity": 0,
        "line-opacity-transition": {duration: 1000}
    },
    paintRedFill = {
        "fill-color": colors.red,
        "fill-opacity":opacityAnimate[0],
        "fill-opacity-transition": {duration: 1000},
        "fill-antialias": true,
        "fill-outline-color": colors.white
    },
    paintWhiteFill = {
        "fill-color": colors.white,
        "fill-opacity":opacityAnimate[0],
        "fill-opacity-transition": {duration: 1000}
    },
    markerClassActive = 'map-markers-white--active',
    markerClassClicked = 'map-markers-white--clicked',
    $smallBreakpoint = 768;

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

        var lotMarkerInfo = getMarkerInfo(name);

        if( lotMarkerInfo.info !== null) {

            scrollToMap();

            map.jumpTo({center: malbecCenter});
            map.setZoom(malbecZoom);

            if(!isMapOpened) {
                isMapOpened = true;

                $masterplanExplore.fadeOut();

                toggleMarkers();

                showMasterplan();

                // Change full screen icon color
                toggleFullScreenButtonColor();
            }

            // Show lot's popup info
            createPopUp( lotMarkerInfo.info, lotMarkerInfo.lngLat );

            // Highlight lot on map
            addHighlight(mText, name);
        }
    }

};

function mapboxInit(){
    // Access token in olga@thespaceinbetween.co.nz account
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2liIiwiYSI6ImNqOTZhZ2xuMjAyZXEzMnF4MGFnd24wanoifQ.Griek6cdG7yWcTGnfmZv0g';

    map = new mapboxgl.Map({
        container: 'masterplan-mapbox',
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: initCenter,
        zoom: initZoom
    });

    // Full screen button
    map.addControl(new mapboxgl.FullscreenControl());
    // Zoom buttons
    map.addControl(new mapboxgl.NavigationControl());

    // Show markers only on certain zoom
    map.on('zoomend', function (e) {
        toggleMarkers();
    });

    map.on('moveend', function() {

        console.log(map.getZoom(), map.getCenter());
    });

    //map.scrollZoom.disable();
    /*map.dragPan.disable();*/
}

function eventsListeners(){

    map.on('load', function () {

        // Add background and hide it
        addBackground();

        // Add reserved area on map and hide it
        addReservedPolygons();

        // Add reserved area on map and hide it
        addReleaseSoonPolygons();

        // Add interactive lots on map and hide them
        addForSalePolygons();

        // Add area with all sold lots on map and hide them
        addAllSoldPolygons();

        // Add extra lines
        addExtraLinesPink();
        addExtraLinesWhite();
        addExtraMarkers();
    });

    // Click on "Start Exploring" button
    buttonExplore.addEventListener('click', function () {

        $masterplanExplore.fadeOut();

        // Fly to masterplan
        mapboxFly();

    });

    // Click on close button in Lot's Popup window
    $masterplanMapbox.on('click', '.lot-popup-images-close', function(){
        hideImages();
    });

    // Click on View plans link
    $masterplanMapbox.on('click', '#view-plans', function(e){

        e.preventDefault();

        var plan = $(this).data('plan');

        showPlan(plan);

        hideImages();
    });

    // Click on Lot's title
    $masterplanMapbox.on('click touch', '#lot-popup-info-id', function(e){

        if(window.innerWidth <= $smallBreakpoint) {
            toggleLotInfo();

            hideImages();
        }
    });
}

function mapboxFly(){
    map.flyTo({
        curve:2,
        bearing: 0,
        speed: 0.4,
        center: malbecCenter,
        zoom: malbecZoom
    });

    map.once('moveend', function() {

        isMapOpened = true;

        // Show masterplan
        //showMasterplan();

        toggleMarkers();
    });

    setTimeout(function(){
        showMasterplan();

        // Change full screen icon color
        toggleFullScreenButtonColor();
    }, 3000);
}

function addBackground(){
    map.addLayer({
        "id": "lots-background",
        "type": "background",
        "paint": paintBackground
    });
}

function addForSalePolygons(){

    map.addSource("forSale", {
        "type": "geojson",
        "data": mpForSaleLots
    });

    map.addLayer({
        "id": "forSale-fills",
        "type": "fill",
        "source": "forSale",
        "layout": {},
        "paint": paintRedFill
    });

    map.addLayer({
        "id": "forSale-borders",
        "type": "line",
        "source": "forSale",
        "layout": {},
        "paint": paintWhiteLines
    });

    map.addLayer({
        "id": "forSale-fills-hover",
        "type": "fill",
        "source": "forSale",
        "layout": {},
        "paint": paintWhiteFill,
        "filter": ["==", "name", ""]
    });

    // Add markers for For Sale Lots
    mpForSaleLots.features.forEach(function(marker){
        addMarker(marker.properties.marker);
    });

    // When the user moves their mouse over the forSale-fill layer, we'll update the filter in
    // the forSale-fills-hover layer to only show the matching lot, thus making a hover effect.
    map.on("mousemove", "forSale-fills", function(e) {
        // I have no fucking idea why here e.features[0].properties.marker became String instead of Object
        // And I don't have time to figure it out
        // So turn it back to Object with JSON.parse
        var markerObj = JSON.parse(e.features[0].properties.marker);

        // Remove hover color from Marker any active but not clicked lot
        $body.find('.' + markerClassActive).not('.' + markerClassClicked).removeClass(markerClassActive);

        // Get hover lot's marker text
        markerHoverId = markerObj.mText;

        // If lot is not sold
        if(markerHoverId != 'Sold'){

            // Highlight clicked and hover lots
            map.setFilter("forSale-fills-hover", [
                "any",
                ["==", "name", e.features[0].properties.name],
                ["==", "clicked", true]
            ]);

            // Set hover color on Marker
            $body.find('#id-' + markerHoverId).addClass(markerClassActive);
        } else {

            // Highlight only clicked lots
            map.setFilter("forSale-fills-hover", ["==", "clicked", true]);
        }
    });

    // Reset the forSale-fills-hover layer's filter when the mouse leaves the layer.
    map.on("mouseleave", "forSale-fills", function(e) {
        // Remove hover color from Marker any active but not clicked lot
        $body.find('.' + markerClassActive).not('.' + markerClassClicked).removeClass(markerClassActive);

        markerHoverId = '';

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

            updateSourceData( mpForSaleLots, JSON.parse(e.features[0].properties.marker).mText, true );

            // Remove any active state from each lot
            $body.find('.' + markerClassActive).removeClass(markerClassActive);
            $body.find('.' + markerClassClicked).removeClass(markerClassClicked);

            // Add active and clicked state to clicked lot
            $body.find('#id-' + markerHoverId).addClass(markerClassActive).addClass(markerClassClicked);

            // Open popup
            createPopUp( JSON.parse(e.features[0].properties.info), e.lngLat );

            // Add dalay because of removeHighlight() function in createPopUp(), which starts with some delay
            // and remove all highlighted elements
            setTimeout(function(){
                addHighlight(JSON.parse(e.features[0].properties.marker).mText, e.features[0].properties.name);
            }, 100);
        }
    });
}

function updateSourceData( data, mText, val ){

    for(var i = 0; i < data.features.length; i++){

        if(val){
            data.features[i].properties.clicked = (data.features[i].properties.marker.mText == mText);
        } else {
            data.features[i].properties.clicked = false;
        }
    }

    map.getSource('forSale').setData(data);
}

function removeHighlight(){

    markerHoverId = '';

    // Remove any active state from each lot
    $body.find('.' + markerClassActive).removeClass(markerClassActive);
    $body.find('.' + markerClassClicked).removeClass(markerClassClicked);

    // Remove all clicked state form source data
    updateSourceData( mpForSaleLots, '', false );

    // Remove all hover effects
    map.setFilter("forSale-fills-hover", ["==", "name", ""]);
}

function addHighlight(mText, name){

    // Remove any active state from each lot
    $body.find('.' + markerClassActive).removeClass(markerClassActive);
    $body.find('.' + markerClassClicked).removeClass(markerClassClicked);

    // Get hover lot's marker text
    markerHoverId = mText;

    // Add active and clicked state to selected lot
    $body.find('#id-' + markerHoverId).addClass(markerClassActive).addClass(markerClassClicked);

    // Add clicked state to source data
    updateSourceData( mpForSaleLots, mText, true );

    // Add hover effects
    map.setFilter("forSale-fills-hover", [
        "any",
        ["==", "name", name],
        ["==", "clicked", true]
    ]);
}

function createPopUp(popupInfo, lngLat){
    new mapboxgl.Popup()
        .setLngLat(lngLat)
        //.setHTML(e.features[0].properties.name)
        .setHTML( getPopUpInfo( popupInfo ) )
        .addTo(map)
        .on('close', function() {
            closePlan();
            // Remove all highlighted lots
            removeHighlight();
        });

    $('body').find('.mapboxgl-popup').addClass('mapboxgl-popup-show');
}

function getPopUpInfo(lotInfo){
    var htmlStr = '',
        htmlStrAgent = '',
        htmlStrImage = '',
        htmlStrLotPlan = '',
        htmlStrLotPlanPdf = '',
        htmlStrImages = '',
        queryStr = '?lotGroup=' + lotInfo.lotGroup + '&lotId=' + lotInfo.lotId;

    if( lotInfo.lotAgentLogoImage != ''){
        htmlStrAgent = '<div class="lot-popup-agent lot-popup-cell"><img src="' + lotInfo.lotAgentLogoImage + '" alt=""></div>';
    }
    if( lotInfo.lotImage != ''){
        htmlStrImage = '<div class="lot-popup-image lot-popup-cell"><img src="' + lotInfo.lotImage + '" alt=""></div>';
    }
    if( lotInfo.lotAgentLogoImage != '' || lotInfo.lotImage != '' ){
        htmlStrImages = '<div class="lot-popup-images">' +
            htmlStrAgent + htmlStrImage +
            '<div class="lot-popup-images-close"></div>' +
            '</div>';
    }
    if( lotInfo.lotPlan != '' ){
        htmlStrLotPlan = '<div class="lot-popup-info-links lot-popup-info-links-plan lot-popup-cell">' +
            '<a href="#" class="lot-popup-info-view" id="view-plans" data-plan="' + lotInfo.lotPlan + '">View plans</a>' +
            '</div>';
    }
    if( lotInfo.lotPlanPdf != '' ){
        htmlStrLotPlanPdf = '<div class="lot-popup-info-links-pdf lot-popup-cell">' +
            '<a href="' + lotInfo.lotPlanPdf + '" target=”_blank”>Download plans</a>' +
            '</div>';
    }
    if(lotInfo.lotAgentEmail != ''){
        queryStr += '&email=' + lotInfo.lotAgentEmail;
    }

    var htmlStrInfo = '<div class="lot-popup-info">' +
        '<div class="lot-popup-info-tbl">' +
            htmlStrAgent +
            htmlStrImage +
            '<div class="lot-popup-info-id lot-popup-cell"><div id="lot-popup-info-id">' + lotInfo.lotTitle + '</div>' +
            '</div>' +
            '<div class="lot-popup-info-inner lot-popup-cell lot-popup-info-inner--toggle">' +
                '<div class="lot-popup-info-tbl">' +
                    '<div class="lot-popup-info-inner lot-popup-cell">' +
                        '<b>' + lotInfo.lotArea + 'm2</b> section <span class="lot-popup-hide-mobile">with resource consent for a <b>' + lotInfo.lotLevels + '</b> level, <b>' + lotInfo.lotBedrooms + '</b> bedroom,</span> <b>' + lotInfo.houseArea + 'm2</b> standalone house.' +
                    '</div>' +
                    htmlStrLotPlan +
                    htmlStrLotPlanPdf +
                    '<div class="lot-popup-info-links lot-popup-info-links-enquire lot-popup-cell">' +
                        '<a href="' + lotInfo.contactPageURL + queryStr + '" class="lot-popup-info-enquire">Enquire</a>' +
                    '</div>' +
                    '<div class="lot-popup-info-empty lot-popup-cell">' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '</div>';

    htmlStr = '<div class="lot-popup">' +
        htmlStrInfo + htmlStrImages +
        '</div>';

    return htmlStr;
}

function getMarkerInfo(lotTitle){
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

function scrollToMap(){
    $('html, body').animate({
        scrollTop: $masterplanMapbox.offset().top
    }, 400);
}

function addReservedPolygons(){

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
        "paint": paintPinkLines
    });

    // Add markers for Reserved Groups
    mpReservedGroup.features.forEach(function(marker){
        addMarker(marker.properties.marker);
    });
}

function addReleaseSoonPolygons(){

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
        "paint": paintPinkLines
    });

    map.addLayer({
        "id": "releaseSoon-borders",
        "type": "line",
        "source": "releaseSoon",
        "layout": {},
        "paint": paintWhiteLines
    });

    // Add markers for Releasing Soon Groups
    mpReleaseSoonGroup.features.forEach(function(marker){
        addMarker(marker.properties.marker);
    });
}

function addAllSoldPolygons(){

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
        "paint": paintPinkLines
    });

    // Add markers for All Sold Groups
    mpAllSoldGroup.features.forEach(function(marker){
        addMarker(marker.properties.marker);
    });
}

function addExtraLinesWhite(){

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
        "paint": paintWhiteLines
    });
}

function addExtraLinesPink(){

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
        "paint": paintPinkLines
    });
}

// Lots' and Areas' markers
function addMarker(marker){

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
}

// Roads' Markers
function addExtraMarkers(){

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
}

function showMasterplan(){
    //showBackground();
    showBackground();
    showLines();
    //setTimeout(showLines,1000);
    //setTimeout(toggleMarkers,2000);
}

function showBackground(){
    // Background
    map.setPaintProperty('lots-background', 'background-opacity', opacityAnimate[1]);
}

function showLines(){

    // Reserved
    map.setPaintProperty('reserved-borders', 'line-opacity', opacityAnimate[1]);

    // Release Soon
    map.setPaintProperty('releaseSoon-borders', 'line-opacity', opacityAnimate[1]);
    map.setPaintProperty('releaseSoonLots-borders', 'line-opacity', opacityAnimate[1]);

    // For sale
    map.setPaintProperty('forSale-borders', 'line-opacity', opacityAnimate[1]);
    // For sale filled polygons for hover effect
    map.setPaintProperty('forSale-fills', 'fill-opacity', opacityAnimate[1]);
    map.setPaintProperty('forSale-fills-hover', 'fill-opacity', opacityAnimate[1]);

    // All Sold
    map.setPaintProperty('allSold-borders', 'line-opacity', opacityAnimate[1]);

    // Extra lines and Markers
    map.setPaintProperty('extraLines-white', 'line-opacity', opacityAnimate[1]);
    map.setPaintProperty('extraLines-pink', 'line-opacity', opacityAnimate[1]);
}

function toggleMarkers(){

    var newOpacity = 0;
    if( isMapOpened && map.getZoom() > markersMinZoom ){
        newOpacity = opacityAnimate[1];
    }

    $('.map-markers').stop().animate({
        'opacity':newOpacity
    }, markersAnimationDuration);
}

function createMarker(){
    // create a DOM element for the marker
    var el = document.createElement('div');
    el.className = 'map-marker';
    el.innerHTML = '<div>Marker!</div>';

    // add marker to map
    markers = new mapboxgl.Marker(el)
        .setLngLat([174.7624357, -36.8517059])
        .addTo(map);
}

function showPlan(plan){

    var planImg = new Image() ;
    planImg.src = plan;
    planImg.onload = function() {

        var bottomOffset = $body.find('.lot-popup-info-tbl').height() - 5;
        var htmlPlan = '<div class="lot-popup-plan">' +
            '<div class="lot-popup-plan-close">Close plans</div>' +
            '<div class="lot-popup-plan-inner">' +
            '<img src="' + plan + '" alt="" draggable="false"></div></div>';

        togglePDFLink();

        if(window.innerWidth <= $smallBreakpoint) toggleLotInfo();

        $masterplanMapbox.append(htmlPlan);

        $newPlan = $body.find('.lot-popup-plan');

        $newPlan.fadeIn(300);

        drag.init( $newPlan.find('img') );

        $masterplanMapbox.on('click', '.lot-popup-plan-close', closePlan);
    };
}

function closePlan(){

    if( $newPlan !== null ) {

        togglePDFLink();

        drag.stopDrag( $newPlan.find('img') );

        $newPlan.fadeOut(300, function(){

            $(this).remove();
        });

        $masterplanMapbox.off('click', '.lot-popup-plan-close', closePlan);

        $newPlan = null;
    }
}

function toggleFullScreenButtonColor(){
    $body.find('.mapboxgl-ctrl-fullscreen').addClass('mapboxgl-ctrl-fullscreen-white');
    $body.find('.mapboxgl-ctrl-zoom-in').addClass('mapboxgl-ctrl-zoom-in-white');
    $body.find('.mapboxgl-ctrl-zoom-out').addClass('mapboxgl-ctrl-zoom-out-white');
}

function togglePDFLink(){
    var $pdfLink = $body.find('.lot-popup-info-links-pdf');
    var $planLink = $body.find('.lot-popup-info-links-plan');

    if( $pdfLink !== null && $pdfLink.length > 0 ){
        $pdfLink.toggleClass('show');
    }

    $planLink.toggleClass('hide');
}

function toggleLotInfo(){
    var infoToggle = $body.find('.lot-popup-info-inner--toggle');

    infoToggle.fadeToggle(100);
}

function hideImages(){
    $masterplanMapbox.find('.lot-popup-images').animate(
        {'height':0},
        300
    );
}

module.exports = Masterplan;