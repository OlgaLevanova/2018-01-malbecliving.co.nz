const $ = require('jquery');
const masterplanVar = require('./masterplanVar.js');
const mapboxgl = require('mapbox-gl');

var MasterplanUtilits = {
    updateSourceData: function( map, data, mText, val ){
        for(var i = 0; i < data.features.length; i++){

            if(val){
                data.features[i].properties.clicked = (data.features[i].properties.marker.mText == mText);
            } else {
                data.features[i].properties.clicked = false;
            }
        }

        map.getSource('forSale').setData(data);
    },
    toggleFullScreenButtonColor: function(){
        masterplanVar.$body.find('[aria-label="Toggle fullscreen"]').toggleClass('mapboxgl-ctrl-fullscreen-white');
        masterplanVar.$body.find('.mapboxgl-ctrl-zoom-in').toggleClass('mapboxgl-ctrl-zoom-in-white');
        masterplanVar.$body.find('.mapboxgl-ctrl-zoom-out').toggleClass('mapboxgl-ctrl-zoom-out-white');
    }
};

module.exports = MasterplanUtilits;