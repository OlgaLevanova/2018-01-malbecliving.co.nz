const $ = require('jquery');

var MasterplanVarLocal = {
    colors : {
        'red':'#E23437',
        'white':'#EEEFF1',
        'pink':'#E48789'
    },
    opacityAnimate : [0, 0.99]
};

var MasterplanVar = {
    $body : $('body'),
    $masterplanMapbox : $('#masterplan-mapbox'),
    $masterplanExplore : $('.masterplan-explore'),
    malbecCenter : [174.59522978313407, -36.81675470669174],
    malbecZoom : 18,
    initCenter : [174.7624357, -36.8517059],
    initZoom : 11,
    markersMinZoom : 17,
    markersAnimationDuration : 300,
    markerHoverId : '',
    buttonExplore : document.getElementById('button-explore'),
    colors : {
        'red':MasterplanVarLocal.colors.red,
        'white':MasterplanVarLocal.colors.white,
        'pink':MasterplanVarLocal.colors.pink
    },
// Don't set it to 1. For some reason opacity 1 doesn't work properly. It becomes transparent
    opacityAnimate : MasterplanVarLocal.opacityAnimate,
    paintBackground : {
        "background-color": MasterplanVarLocal.colors.red,
        "background-opacity":MasterplanVarLocal.opacityAnimate[0],
        "background-opacity-transition": {duration: 1000}
    },
    paintPinkLines : {
        "line-color": MasterplanVarLocal.colors.pink,
        "line-width": 0.5,
        "line-opacity": 0,
        "line-opacity-transition": {duration: 1000}
    },
    paintWhiteLines : {
        "line-color": MasterplanVarLocal.colors.white,
        "line-width": 0.5,
        "line-opacity": 0,
        "line-opacity-transition": {duration: 1000}
    },
    paintRedFill : {
        "fill-color": MasterplanVarLocal.colors.red,
        "fill-opacity":MasterplanVarLocal.opacityAnimate[0],
        "fill-opacity-transition": {duration: 1000},
        "fill-antialias": true,
        "fill-outline-color": MasterplanVarLocal.colors.white
    },
    paintWhiteFill : {
        "fill-color": MasterplanVarLocal.colors.white,
        "fill-opacity":MasterplanVarLocal.opacityAnimate[0],
        "fill-opacity-transition": {duration: 1000}
    },
    markerClassActive : 'map-markers-white--active',
    markerClassClicked : 'map-markers-white--clicked',
    smallBreakpoint : 768,
    isMapOpened : false
};

module.exports = MasterplanVar;