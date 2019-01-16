const $ = require('jquery');
const mapboxgl = require('mapbox-gl');
const masterplanVar = require('./masterplanVar.js');
const masterplanUtilits = require('./masterplanUtilits.js');

var MasterplanHighlight = {
    removeHighlight: function(map){

        masterplanVar.markerHoverId = '';

        // Remove any active state from each lot
        masterplanVar.$body.find('.' + masterplanVar.markerClassActive).removeClass(masterplanVar.markerClassActive);
        masterplanVar.$body.find('.' + masterplanVar.markerClassClicked).removeClass(masterplanVar.markerClassClicked);

        // Remove all clicked state form source data
        masterplanUtilits.updateSourceData( map, mpForSaleLots, '', false );

        // Remove all hover effects
        map.setFilter("forSale-fills-hover", ["==", "name", ""]);
    },
    addHighlight: function(map, mText, name){

        // Remove any active state from each lot
        masterplanVar.$body.find('.' + masterplanVar.markerClassActive).removeClass(masterplanVar.markerClassActive);
        masterplanVar.$body.find('.' + masterplanVar.markerClassClicked).removeClass(masterplanVar.markerClassClicked);

        // Get hover lot's marker text
        masterplanVar.markerHoverId = mText;

        // Add active and clicked state to selected lot
        masterplanVar.$body.find('#id-' + masterplanVar.markerHoverId).addClass(masterplanVar.markerClassActive).addClass(masterplanVar.markerClassClicked);

        // Add clicked state to source data
        masterplanUtilits.updateSourceData( map, mpForSaleLots, mText, true );

        // Add hover effects
        map.setFilter("forSale-fills-hover", [
            "any",
            ["==", "name", name],
            ["==", "clicked", true]
        ]);
    }
};

module.exports = MasterplanHighlight;